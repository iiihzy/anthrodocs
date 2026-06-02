import yaml from 'js-yaml';
import { isEmptySchema, parseSchemaToTree } from './ir.js';

/**
 * Parse an OpenAPI / Swagger specification from a YAML/JSON string.
 * No Node.js dependencies - safe for browser/client-side use.
 * @param {string} raw - raw YAML or JSON string
 * @returns {import('./ir.js').ApiDoc}
 */
export function parseSpecFromString(raw) {
  let spec;
  try {
    spec = yaml.load(raw);
  } catch (e) {
    const err = new Error(`无法解析 YAML: ${e.message}`);
    err.line = e.mark?.line;
    err.yamlError = true;
    throw err;
  }

  if (!spec) {
    throw new Error('输入内容为空');
  }

  if (typeof spec === 'string') {
    try {
      spec = JSON.parse(raw);
    } catch (e) {
      throw new Error('无法解析 JSON: ' + e.message);
    }
  }

  if (spec.swagger === '2.0') {
    return parseSwagger2(spec);
  }
  if (spec.openapi && spec.openapi.startsWith('3.')) {
    return parseOpenApi3(spec);
  }

  throw new Error(
    `不支持的规范版本。仅支持 Swagger 2.0 和 OpenAPI 3.x。` +
    `检测到的字段: ${spec.swagger ? `swagger="${spec.swagger}"` : `openapi="${spec.openapi}"`}`
  );
}

// ─── Swagger 2.0 parser ────────────────────────────────────────────

function parseSwagger2(spec) {
  const security = parseSecurity(spec.securityDefinitions || {});
  const baseUrl = spec.host
    ? `${(spec.schemes && spec.schemes[0]) || 'https'}://${spec.host}${spec.basePath || ''}`
    : 'https://your-domain.com';

  const refs = spec.definitions || {};

  const endpoints = [];
  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      if (!methods) continue;
      for (const [method, op] of Object.entries(methods)) {
        if (method === 'parameters') continue;
        if (op && typeof op === 'object') {
          endpoints.push(parseSwagger2Operation(method, path, op, refs));
        }
      }
    }
  }

  return {
    title: spec.info?.title || 'API 文档',
    version: spec.info?.version || '1.0.0',
    description: spec.info?.description || '',
    baseUrl,
    security,
    endpoints,
  };
}

function parseSwagger2Operation(method, path, op, refs = {}) {
  const consumes = op.consumes || [];
  const produces = op.produces || [];

  const params = (op.parameters || []).map(p => ({
    name: p.name || '',
    in: p.in || 'query',
    type: p.type || 'string',
    required: !!p.required,
    description: p.description || '',
    format: p.format || null,
  }));

  let requestBody = null;
  const formParams = params.filter(p => p.in === 'formData');
  if (formParams.length > 0) {
    requestBody = { contentType: 'multipart/form-data', schema: null, schemaTree: null };
  } else if (op.parameters) {
    const bodyParam = op.parameters.find(p => p.in === 'body' && p.schema);
    if (bodyParam) {
      const schemaTree = parseSchemaToTree(bodyParam.schema, 'body', true, { refs });
      requestBody = {
        contentType: (consumes && consumes[0]) || 'application/json',
        schema: bodyParam.schema,
        schemaTree,
      };
    }
  }

  const responses = Object.entries(op.responses || {}).map(([status, r]) => {
    const schema = r?.schema || null;
    const isEmpty = isEmptySchema(schema);
    const schemaTree = (schema && !isEmpty) ? parseSchemaToTree(schema, 'response', false, { refs }) : null;
    return { status, description: r?.description || '', schema, schemaTree, isEmpty };
  });

  return {
    method: method.toLowerCase(),
    path,
    summary: op.summary || '',
    description: op.description || op.summary || '',
    parameters: params,
    requestBody,
    responses,
  };
}

// ─── OpenAPI 3.x parser ────────────────────────────────────────────

function parseOpenApi3(spec) {
  const security = parseSecurityOAS3(spec.components?.securitySchemes || {});
  const servers = spec.servers || [];
  const baseUrl = servers.length > 0
    ? servers[0].url.replace(/\/$/, '')
    : 'https://your-domain.com';

  const refs = spec.components?.schemas || {};

  const endpoints = [];
  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      if (!methods) continue;
      for (const [method, op] of Object.entries(methods)) {
        if (method === 'parameters') continue;
        if (op && typeof op === 'object') {
          endpoints.push(parseOAS3Operation(method, path, op, refs));
        }
      }
    }
  }

  return {
    title: spec.info?.title || 'API 文档',
    version: spec.info?.version || '1.0.0',
    description: spec.info?.description || '',
    baseUrl,
    security,
    endpoints,
  };
}

function parseOAS3Operation(method, path, op, refs = {}) {
  const params = (op.parameters || []).map(p => ({
    name: p.name || '',
    in: p.in || 'query',
    type: p.schema?.type || 'string',
    required: !!p.required,
    description: p.description || '',
    format: p.schema?.format || null,
  }));

  let requestBody = null;
  if (op.requestBody?.content) {
    const contentTypes = Object.keys(op.requestBody.content);
    const ct = contentTypes[0] || 'application/json';
    const schema = op.requestBody.content[ct]?.schema || null;
    const schemaTree = schema ? parseSchemaToTree(schema, 'body', true, { refs }) : null;
    requestBody = { contentType: ct, schema, schemaTree };
  }

  const responses = Object.entries(op.responses || {}).map(([status, r]) => {
    const content = r?.content;
    let schema = null;
    if (content) {
      const ctKeys = Object.keys(content);
      if (ctKeys.length > 0) {
        schema = content[ctKeys[0]]?.schema || null;
      }
    }
    const isEmpty = isEmptySchema(schema);
    const schemaTree = (schema && !isEmpty) ? parseSchemaToTree(schema, 'response', false, { refs }) : null;
    return { status, description: r?.description || '', schema, schemaTree, isEmpty };
  });

  return {
    method: method.toLowerCase(),
    path,
    summary: op.summary || '',
    description: op.description || op.summary || '',
    parameters: params,
    requestBody,
    responses,
  };
}

// ─── Security helpers ──────────────────────────────────────────────

function parseSecurity(defs) {
  const result = [];
  for (const [name, def] of Object.entries(defs)) {
    if (def && def.type === 'apiKey') {
      result.push({ type: def.type, name: def.name, in: def.in });
    }
  }
  return result;
}

function parseSecurityOAS3(defs) {
  const result = [];
  for (const [name, def] of Object.entries(defs)) {
    if (def && def.type === 'apiKey') {
      result.push({ type: def.type, name: def.name, in: def.in });
    }
  }
  return result;
}