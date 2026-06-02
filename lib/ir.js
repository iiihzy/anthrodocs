/**
 * Intermediate Representation (IR) data structures
 * for the anthrodocs converter.
 *
 * All parser outputs conform to this shape regardless
 * of input format (Swagger 2.0 or OpenAPI 3.x).
 */

/**
 * @typedef {Object} SecurityDef
 * @property {string} type - 'apiKey' | 'http' | 'oauth2' etc.
 * @property {string} name - header/query parameter name
 * @property {string} in  - 'header' | 'query'
 */

/**
 * @typedef {Object} Parameter
 * @property {string} name
 * @property {string} in    - 'path' | 'query' | 'header' | 'formData' | 'body'
 * @property {string} type  - 'string' | 'number' | 'integer' | 'boolean' | 'file'
 * @property {boolean} required
 * @property {string} description
 * @property {string} [format] - e.g. 'binary', 'date-time'
 */

/**
 * @typedef {Object} SchemaNode
 * @property {string} name        - field name
 * @property {string} type        - 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'union'
 * @property {string} [subType]   - when type='array', the name of the child type (e.g. 'MessageParam')
 * @property {boolean} required
 * @property {string} description
 * @property {string[]} [enum]    - enum values
 * @property {string} [default]   - default value
 * @property {string} [format]    - e.g. 'binary', 'date-time', 'uuid'
 * @property {SchemaNode[]} [children] - nested fields for object/array sub-types
 * @property {SchemaNode[]} [variants] - when type='union', the alternative types
 */

/**
 * @typedef {Object} Response
 * @property {string} status      - e.g. '200', '400'
 * @property {string} description
 * @property {Object|null} schema - parsed schema or null when empty
 * @property {SchemaNode[]} [schemaTree] - recursive schema tree
 * @property {boolean} isEmpty    - true when schema is effectively empty
 */

/**
 * @typedef {Object} Endpoint
 * @property {string} method      - 'get' | 'post' | 'put' | 'delete' | ...
 * @property {string} path
 * @property {string} summary
 * @property {string} description
 * @property {Parameter[]} parameters
 * @property {Object|null} requestBody - { contentType, schema: Object|null, schemaTree: SchemaNode[] }
 * @property {Response[]} responses
 */

/**
 * @typedef {Object} ApiDoc
 * @property {string} title
 * @property {string} version
 * @property {string} description
 * @property {string} baseUrl
 * @property {SecurityDef[]} security
 * @property {Endpoint[]} endpoints
 */

/**
 * Group parameters by their `in` location.
 * @param {Parameter[]} params
 * @returns {Record<string, Parameter[]>}
 */
export function groupParamsByIn(params) {
  const groups = {};
  for (const p of params) {
    const key = p.in;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  return groups;
}

/**
 * Check if a schema is effectively empty (no meaningful properties).
 * @param {Object|null} schema
 * @returns {boolean}
 */
export function isEmptySchema(schema) {
  if (!schema) return true;
  // Empty object or object with empty properties
  if (schema.type === 'object' && (!schema.properties || Object.keys(schema.properties).length === 0)) {
    return true;
  }
  return false;
}

/**
 * Default placeholder response for empty schemas.
 */
export const PLACEHOLDER_RESPONSE = {
  code: 0,
  message: 'success',
  data: {}
};

/**
 * Map OpenAPI/swagger primitive types to display types.
 */
const TYPE_MAP = {
  string: 'string',
  number: 'number',
  integer: 'number',
  boolean: 'boolean',
  array: 'array',
  object: 'object',
};

/**
 * Recursively parse a schema object into a SchemaNode tree.
 *
 * @param {Object|null} schema  - the raw schema from swagger/openapi
 * @param {string} name         - field name for the top-level node
 * @param {boolean} [required]  - whether this field is required
 * @param {Object} [options]
 * @param {Object} [options.refs]   - map of $ref definitions for resolution
 * @param {number} [options.depth]  - current recursion depth (for cycle detection)
 * @param {number} [options.maxDepth] - max recursion depth (default 15)
 * @returns {SchemaNode[]}
 */
export function parseSchemaToTree(schema, name, required = false, options = {}) {
  if (!schema) {
    return [{
      name,
      type: 'object',
      required,
      description: '',
      children: [],
    }];
  }

  const { refs = {}, depth = 0, maxDepth = 15 } = options;

  // Cycle detection
  if (depth > maxDepth) {
    return [{ name, type: 'object', required, description: '... (too deep to display)', children: [] }];
  }

  // Resolve $ref
  if (schema.$ref && refs) {
    const refPath = schema.$ref.replace('#/definitions/', '').replace('#/components/schemas/', '');
    const resolved = refs[refPath];
    if (resolved) {
      return parseSchemaToTree(resolved, name, required, { ...options, depth: depth + 1 });
    }
    return [{ name, type: 'object', required, description: `Reference: ${schema.$ref}`, children: [] }];
  }

  // Detect oneOf/anyOf → union type
  if (schema.oneOf || schema.anyOf) {
    const variants = (schema.oneOf || schema.anyOf).map((v, i) => {
      const vName = v.title || v.type || `variant_${i}`;
      return parseSchemaToTree(v, vName, required, { ...options, depth: depth + 1 })[0];
    });
    return [{
      name,
      type: 'union',
      required,
      description: schema.description || '',
      variants,
    }];
  }

  // Detect allOf
  if (schema.allOf) {
    const merged = { ...schema };
    delete merged.allOf;
    for (const part of schema.allOf) {
      if (part.$ref) {
        const refPath = part.$ref.replace('#/definitions/', '').replace('#/components/schemas/', '');
        const resolved = refs[refPath];
        if (resolved) {
          Object.assign(merged, { properties: { ...(merged.properties || {}), ...(resolved.properties || {}) } });
        }
      } else if (part.properties) {
        merged.properties = { ...(merged.properties || {}), ...part.properties };
      }
    }
    return parseSchemaToTree(merged, name, required, { ...options, depth: depth + 1 });
  }

  const nodeType = TYPE_MAP[schema.type] || 'object';
  const node = {
    name,
    type: nodeType,
    required,
    description: schema.description || '',
    enum: schema.enum || undefined,
    default: schema.default !== undefined ? String(schema.default) : undefined,
    format: schema.format || undefined,
    children: [],
  };

  // Arrays: mark subType and parse items
  if (nodeType === 'array' && schema.items) {
    if (schema.items.type && schema.items.type !== 'object') {
      node.subType = schema.items.type;
    } else if (schema.items.$ref) {
      const refPath = schema.items.$ref.replace('#/definitions/', '').replace('#/components/schemas/', '');
      node.subType = refPath.split('/').pop();
    } else if (schema.items.type === 'object' || Object.keys(schema.items).length > 0) {
      node.subType = 'object';
    }

    // Parse array items as children
    if (schema.items.properties) {
      const requiredFields = schema.items.required || [];
      for (const [propName, propSchema] of Object.entries(schema.items.properties)) {
        node.children.push(...parseSchemaToTree(propSchema, propName, requiredFields.includes(propName), { ...options, depth: depth + 1 }));
      }
    } else if (schema.items.$ref) {
      // We'll delegate sub-type parsing to handle in the renderer
      node.subType = schema.items.$ref.replace('#/definitions/', '').replace('#/components/schemas/', '');
    }
  }

  // Objects: recurse into properties
  if (nodeType === 'object' && schema.properties) {
    const requiredFields = schema.required || [];
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      node.children.push(...parseSchemaToTree(propSchema, propName, requiredFields.includes(propName), { ...options, depth: depth + 1 }));
    }
  }

  return [node];
}