export interface SecurityDef {
  type: string
  name: string
  in: string
}

export interface Parameter {
  name: string
  in: string
  type: string
  required: boolean
  description: string
  format?: string
}

export interface SchemaNode {
  name: string
  type: string
  subType?: string
  required: boolean
  description: string
  enum?: string[]
  default?: string
  format?: string
  children?: SchemaNode[]
  variants?: SchemaNode[]
}

export interface Response {
  status: string
  description: string
  schema: Record<string, unknown> | null
  schemaTree?: SchemaNode[] | null
  isEmpty: boolean
}

export interface RequestBody {
  contentType: string
  schema: Record<string, unknown> | null
  schemaTree: SchemaNode[] | null
}

export interface Endpoint {
  method: string
  path: string
  summary: string
  description: string
  parameters: Parameter[]
  requestBody: RequestBody | null
  responses: Response[]
  yamlLine?: number
}

export interface ApiDoc {
  title: string
  version: string
  description: string
  baseUrl: string
  security: SecurityDef[]
  endpoints: Endpoint[]
}