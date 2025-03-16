export interface ToolParameters {
    type: string;
    properties?: Record<string, {
        type: string;
        description: string;
        enum?: string[];
    }>;
    required: string[];
}

export interface ToolFunction {
    name: string;
    description: string;
    parameters: ToolParameters;
}

export interface ToolCall {
    function: {
        name: string;
        arguments: string | Record<string, unknown>;
    };
}

export interface OllamaCompatibleTool {
    type: "function";
    function: ToolFunction;
}

export interface Tool extends OllamaCompatibleTool {
    handler: (args: Record<string, unknown>) => Promise<string>;
}

export type ToolRegistry = Map<string, Tool>; 