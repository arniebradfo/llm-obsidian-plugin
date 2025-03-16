import { Tool } from "ollama";

export const noToolNeeded: Tool = {
    type: "function",
    function: {
        name: "no_tool_needed",
        description: "The assistant doesn't need to call any other tools",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    }
};