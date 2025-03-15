import { Tool } from "ollama";

export const dateTimeTool: Tool = {
    type: "function",
    function: {
        name: "get_current_datetime",
        description: "Get the current date and time",
        parameters: {
            type: "object",
            properties: {
                format: {
                    type: "string",
                    enum: ["ISO", "local"],
                    description: "Format for the date/time output ('ISO' or 'local')"
                }
            },
            required: []
        }
    }
};

export async function handleDateTimeTool(params: { format?: "ISO" | "local" }): Promise<string> {
    const now = new Date();
    return params.format === "local" ? now.toLocaleString() : now.toISOString();
} 