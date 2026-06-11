var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// lib/parser-string.js
import yaml from "js-yaml";

// lib/ir.js
function isEmptySchema(schema) {
  if (!schema) return true;
  if (schema.type === "object" && (!schema.properties || Object.keys(schema.properties).length === 0)) {
    return true;
  }
  return false;
}
var TYPE_MAP = {
  string: "string",
  number: "number",
  integer: "number",
  boolean: "boolean",
  array: "array",
  object: "object"
};
function parseSchemaToTree(schema, name, required = false, options = {}) {
  if (!schema) {
    return [{
      name,
      type: "object",
      required,
      description: "",
      children: []
    }];
  }
  const { refs = {}, depth = 0, maxDepth = 15 } = options;
  if (depth > maxDepth) {
    return [{ name, type: "object", required, description: "... (too deep to display)", children: [] }];
  }
  if (schema.$ref && refs) {
    const refPath = schema.$ref.replace("#/definitions/", "").replace("#/components/schemas/", "");
    const resolved = refs[refPath];
    if (resolved) {
      return parseSchemaToTree(resolved, name, required, __spreadProps(__spreadValues({}, options), { depth: depth + 1 }));
    }
    return [{ name, type: "object", required, description: `Reference: ${schema.$ref}`, children: [] }];
  }
  if (schema.oneOf || schema.anyOf) {
    const variants = (schema.oneOf || schema.anyOf).map((v, i) => {
      const vName = v.title || v.type || `variant_${i}`;
      return parseSchemaToTree(v, vName, required, __spreadProps(__spreadValues({}, options), { depth: depth + 1 }))[0];
    });
    return [{
      name,
      type: "union",
      required,
      description: schema.description || "",
      variants
    }];
  }
  if (schema.allOf) {
    const merged = __spreadValues({}, schema);
    delete merged.allOf;
    for (const part of schema.allOf) {
      if (part.$ref) {
        const refPath = part.$ref.replace("#/definitions/", "").replace("#/components/schemas/", "");
        const resolved = refs[refPath];
        if (resolved) {
          Object.assign(merged, { properties: __spreadValues(__spreadValues({}, merged.properties || {}), resolved.properties || {}) });
        }
      } else if (part.properties) {
        merged.properties = __spreadValues(__spreadValues({}, merged.properties || {}), part.properties);
      }
    }
    return parseSchemaToTree(merged, name, required, __spreadProps(__spreadValues({}, options), { depth: depth + 1 }));
  }
  const nodeType = TYPE_MAP[schema.type] || "object";
  const node = {
    name,
    type: nodeType,
    required,
    description: schema.description || "",
    enum: schema.enum || void 0,
    default: schema.default !== void 0 ? String(schema.default) : void 0,
    format: schema.format || void 0,
    children: []
  };
  if (nodeType === "array" && schema.items) {
    if (schema.items.type && schema.items.type !== "object") {
      node.subType = schema.items.type;
    } else if (schema.items.$ref) {
      const refPath = schema.items.$ref.replace("#/definitions/", "").replace("#/components/schemas/", "");
      node.subType = refPath.split("/").pop();
    } else if (schema.items.type === "object" || Object.keys(schema.items).length > 0) {
      node.subType = "object";
    }
    if (schema.items.properties) {
      const requiredFields = schema.items.required || [];
      for (const [propName, propSchema] of Object.entries(schema.items.properties)) {
        node.children.push(...parseSchemaToTree(propSchema, propName, requiredFields.includes(propName), __spreadProps(__spreadValues({}, options), { depth: depth + 1 })));
      }
    } else if (schema.items.$ref) {
      node.subType = schema.items.$ref.replace("#/definitions/", "").replace("#/components/schemas/", "");
    }
  }
  if (nodeType === "object" && schema.properties) {
    const requiredFields = schema.required || [];
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      node.children.push(...parseSchemaToTree(propSchema, propName, requiredFields.includes(propName), __spreadProps(__spreadValues({}, options), { depth: depth + 1 })));
    }
  }
  return [node];
}

// lib/parser-string.js
function parseSpecFromString(raw) {
  var _a;
  let spec;
  try {
    spec = yaml.load(raw);
  } catch (e) {
    const err = new Error(`\u65E0\u6CD5\u89E3\u6790 YAML: ${e.message}`);
    err.line = (_a = e.mark) == null ? void 0 : _a.line;
    err.yamlError = true;
    throw err;
  }
  if (!spec) {
    throw new Error("\u8F93\u5165\u5185\u5BB9\u4E3A\u7A7A");
  }
  if (typeof spec === "string") {
    try {
      spec = JSON.parse(raw);
    } catch (e) {
      throw new Error("\u65E0\u6CD5\u89E3\u6790 JSON: " + e.message);
    }
  }
  if (spec.swagger === "2.0") {
    return parseSwagger2(spec);
  }
  if (spec.openapi && spec.openapi.startsWith("3.")) {
    return parseOpenApi3(spec);
  }
  throw new Error(
    `\u4E0D\u652F\u6301\u7684\u89C4\u8303\u7248\u672C\u3002\u4EC5\u652F\u6301 Swagger 2.0 \u548C OpenAPI 3.x\u3002\u68C0\u6D4B\u5230\u7684\u5B57\u6BB5: ${spec.swagger ? `swagger="${spec.swagger}"` : `openapi="${spec.openapi}"`}`
  );
}
function parseSwagger2(spec) {
  var _a, _b, _c;
  const security = parseSecurity(spec.securityDefinitions || {});
  const baseUrl = spec.host ? `${spec.schemes && spec.schemes[0] || "https"}://${spec.host}${spec.basePath || ""}` : "https://your-domain.com";
  const refs = spec.definitions || {};
  const endpoints = [];
  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      if (!methods) continue;
      for (const [method, op] of Object.entries(methods)) {
        if (method === "parameters") continue;
        if (op && typeof op === "object") {
          endpoints.push(parseSwagger2Operation(method, path, op, refs));
        }
      }
    }
  }
  return {
    title: ((_a = spec.info) == null ? void 0 : _a.title) || "API \u6587\u6863",
    version: ((_b = spec.info) == null ? void 0 : _b.version) || "1.0.0",
    description: ((_c = spec.info) == null ? void 0 : _c.description) || "",
    baseUrl,
    security,
    endpoints
  };
}
function parseSwagger2Operation(method, path, op, refs = {}) {
  const consumes = op.consumes || [];
  const produces = op.produces || [];
  const params = (op.parameters || []).map((p) => ({
    name: p.name || "",
    in: p.in || "query",
    type: p.type || "string",
    required: !!p.required,
    description: p.description || "",
    format: p.format || null
  }));
  let requestBody = null;
  const formParams = params.filter((p) => p.in === "formData");
  if (formParams.length > 0) {
    requestBody = { contentType: "multipart/form-data", schema: null, schemaTree: null };
  } else if (op.parameters) {
    const bodyParam = op.parameters.find((p) => p.in === "body" && p.schema);
    if (bodyParam) {
      const schemaTree = parseSchemaToTree(bodyParam.schema, "body", true, { refs });
      requestBody = {
        contentType: consumes && consumes[0] || "application/json",
        schema: bodyParam.schema,
        schemaTree
      };
    }
  }
  const responses = Object.entries(op.responses || {}).map(([status, r]) => {
    const schema = (r == null ? void 0 : r.schema) || null;
    const isEmpty = isEmptySchema(schema);
    const schemaTree = schema && !isEmpty ? parseSchemaToTree(schema, "response", false, { refs }) : null;
    return { status, description: (r == null ? void 0 : r.description) || "", schema, schemaTree, isEmpty };
  });
  return {
    method: method.toLowerCase(),
    path,
    summary: op.summary || "",
    description: op.description || op.summary || "",
    parameters: params,
    requestBody,
    responses
  };
}
function parseOpenApi3(spec) {
  var _a, _b, _c, _d, _e;
  const security = parseSecurityOAS3(((_a = spec.components) == null ? void 0 : _a.securitySchemes) || {});
  const servers = spec.servers || [];
  const baseUrl = servers.length > 0 ? servers[0].url.replace(/\/$/, "") : "https://your-domain.com";
  const refs = ((_b = spec.components) == null ? void 0 : _b.schemas) || {};
  const endpoints = [];
  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      if (!methods) continue;
      for (const [method, op] of Object.entries(methods)) {
        if (method === "parameters") continue;
        if (op && typeof op === "object") {
          endpoints.push(parseOAS3Operation(method, path, op, refs));
        }
      }
    }
  }
  return {
    title: ((_c = spec.info) == null ? void 0 : _c.title) || "API \u6587\u6863",
    version: ((_d = spec.info) == null ? void 0 : _d.version) || "1.0.0",
    description: ((_e = spec.info) == null ? void 0 : _e.description) || "",
    baseUrl,
    security,
    endpoints
  };
}
function parseOAS3Operation(method, path, op, refs = {}) {
  var _a, _b;
  const params = (op.parameters || []).map((p) => {
    var _a2, _b2;
    return {
      name: p.name || "",
      in: p.in || "query",
      type: ((_a2 = p.schema) == null ? void 0 : _a2.type) || "string",
      required: !!p.required,
      description: p.description || "",
      format: ((_b2 = p.schema) == null ? void 0 : _b2.format) || null
    };
  });
  let requestBody = null;
  if ((_a = op.requestBody) == null ? void 0 : _a.content) {
    const contentTypes = Object.keys(op.requestBody.content);
    const ct = contentTypes[0] || "application/json";
    const schema = ((_b = op.requestBody.content[ct]) == null ? void 0 : _b.schema) || null;
    const schemaTree = schema ? parseSchemaToTree(schema, "body", true, { refs }) : null;
    requestBody = { contentType: ct, schema, schemaTree };
  }
  const responses = Object.entries(op.responses || {}).map(([status, r]) => {
    var _a2;
    const content = r == null ? void 0 : r.content;
    let schema = null;
    if (content) {
      const ctKeys = Object.keys(content);
      if (ctKeys.length > 0) {
        schema = ((_a2 = content[ctKeys[0]]) == null ? void 0 : _a2.schema) || null;
      }
    }
    const isEmpty = isEmptySchema(schema);
    const schemaTree = schema && !isEmpty ? parseSchemaToTree(schema, "response", false, { refs }) : null;
    return { status, description: (r == null ? void 0 : r.description) || "", schema, schemaTree, isEmpty };
  });
  return {
    method: method.toLowerCase(),
    path,
    summary: op.summary || "",
    description: op.description || op.summary || "",
    parameters: params,
    requestBody,
    responses
  };
}
function parseSecurity(defs) {
  const result = [];
  for (const [name, def] of Object.entries(defs)) {
    if (def && def.type === "apiKey") {
      result.push({ type: def.type, name: def.name, in: def.in });
    }
  }
  return result;
}
function parseSecurityOAS3(defs) {
  const result = [];
  for (const [name, def] of Object.entries(defs)) {
    if (def && def.type === "apiKey") {
      result.push({ type: def.type, name: def.name, in: def.in });
    }
  }
  return result;
}

export {
  parseSpecFromString
};
