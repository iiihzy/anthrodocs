import * as react from 'react';
export { parseSpecFromString } from './server.js';

interface SecurityDef {
    type: string;
    name: string;
    in: string;
}
interface Parameter {
    name: string;
    in: string;
    type: string;
    required: boolean;
    description: string;
    format?: string;
}
interface SchemaNode {
    name: string;
    type: string;
    subType?: string;
    required: boolean;
    description: string;
    enum?: string[];
    default?: string;
    format?: string;
    children?: SchemaNode[];
    variants?: SchemaNode[];
}
interface Response {
    status: string;
    description: string;
    schema: Record<string, unknown> | null;
    schemaTree?: SchemaNode[] | null;
    isEmpty: boolean;
}
interface RequestBody {
    contentType: string;
    schema: Record<string, unknown> | null;
    schemaTree: SchemaNode[] | null;
}
interface Endpoint {
    method: string;
    path: string;
    summary: string;
    description: string;
    parameters: Parameter[];
    requestBody: RequestBody | null;
    responses: Response[];
    yamlLine?: number;
}
interface ApiDoc {
    title: string;
    version: string;
    description: string;
    baseUrl: string;
    security: SecurityDef[];
    endpoints: Endpoint[];
}

interface Props$6 {
    initialDoc: ApiDoc | null;
    yaml: string;
    fileNames?: string[];
    activeFile?: string;
    onSwitchFile?: (fileName: string) => void;
}
declare function AppLayout({ initialDoc, yaml, fileNames, activeFile, onSwitchFile }: Props$6): react.JSX.Element;

interface Props$5 {
    value: string;
    highlightLine?: number | null;
}
declare function YamlViewer({ value, highlightLine }: Props$5): react.JSX.Element;

interface Props$4 {
    doc: {
        title: string;
        version: string;
        baseUrl: string;
        endpoints: Endpoint[];
    };
    onScroll?: (scrollTop: number) => void;
    onEndpointClick?: (idx: number) => void;
}
declare function DocPreview({ doc, onScroll, onEndpointClick }: Props$4): react.JSX.Element;

interface Props$3 {
    endpoints: Endpoint[];
    scrollTop?: number;
    onEndpointClick?: (idx: number) => void;
    onActiveChange?: (idx: number) => void;
}
declare function SidebarNav({ endpoints, scrollTop, onEndpointClick, onActiveChange }: Props$3): react.JSX.Element;

interface Props$2 {
    endpoint: Endpoint;
}
declare function EndpointCard({ endpoint: ep }: Props$2): react.JSX.Element;

interface SchemaTreeProps {
    tree: SchemaNode[] | null;
}
declare function SchemaTree({ tree }: SchemaTreeProps): react.JSX.Element;

interface Props$1 {
    parameters: Parameter[];
}
declare function ParametersTable({ parameters }: Props$1): react.JSX.Element;

interface Props {
    tree: SchemaNode[];
}
declare function JsonExample({ tree }: Props): react.JSX.Element;

declare function groupParamsByIn<T extends {
    in: string;
}>(params: T[]): Record<string, T[]>;
declare function findEndpointLines(yaml: string, endpoints: Endpoint[]): Map<number, number>;

export { AppLayout as Anthrodocs, type ApiDoc, DocPreview, type Endpoint, EndpointCard, JsonExample, type Parameter, ParametersTable, type RequestBody, type Response, type SchemaNode, SchemaTree, type SecurityDef, SidebarNav, YamlViewer, findEndpointLines, groupParamsByIn };
