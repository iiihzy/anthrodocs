type SecurityDef = {
    /**
     * - 'apiKey' | 'http' | 'oauth2' etc.
     */
    type: string;
    /**
     * - header/query parameter name
     */
    name: string;
    /**
     * - 'header' | 'query'
     */
    in: string;
};
type Parameter = {
    name: string;
    /**
     * - 'path' | 'query' | 'header' | 'formData' | 'body'
     */
    in: string;
    /**
     * - 'string' | 'number' | 'integer' | 'boolean' | 'file'
     */
    type: string;
    required: boolean;
    description: string;
    /**
     * - e.g. 'binary', 'date-time'
     */
    format?: string;
};
type SchemaNode = {
    /**
     * - field name
     */
    name: string;
    /**
     * - 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'union'
     */
    type: string;
    /**
     * - when type='array', the name of the child type (e.g. 'MessageParam')
     */
    subType?: string;
    required: boolean;
    description: string;
    /**
     * - enum values
     */
    enum?: string[];
    /**
     * - default value
     */
    default?: string;
    /**
     * - e.g. 'binary', 'date-time', 'uuid'
     */
    format?: string;
    /**
     * - nested fields for object/array sub-types
     */
    children?: SchemaNode[];
    /**
     * - when type='union', the alternative types
     */
    variants?: SchemaNode[];
};
type Response = {
    /**
     * - e.g. '200', '400'
     */
    status: string;
    description: string;
    /**
     * - parsed schema or null when empty
     */
    schema: any | null;
    /**
     * - recursive schema tree
     */
    schemaTree?: SchemaNode[];
    /**
     * - true when schema is effectively empty
     */
    isEmpty: boolean;
};
type Endpoint = {
    /**
     * - 'get' | 'post' | 'put' | 'delete' | ...
     */
    method: string;
    path: string;
    summary: string;
    description: string;
    parameters: Parameter[];
    /**
     * - { contentType, schema: Object|null, schemaTree: SchemaNode[] }
     */
    requestBody: any | null;
    responses: Response[];
};
type ApiDoc = {
    title: string;
    version: string;
    description: string;
    baseUrl: string;
    security: SecurityDef[];
    endpoints: Endpoint[];
};

/**
 * Parse an OpenAPI / Swagger specification from a YAML/JSON string.
 * No Node.js dependencies - safe for browser/client-side use.
 * @param {string} raw - raw YAML or JSON string
 * @returns {import('./ir.js').ApiDoc}
 */
declare function parseSpecFromString(raw: string): ApiDoc;

export { parseSpecFromString };
