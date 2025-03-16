import { Tool } from "ollama";

/** llama3.2 seems to always call a tool, even when one is not needed. This is a no-op tool that can be used to circumvent this behavior. */
export const noToolNeeded: Tool = {
    type: "function",
    function: {
        name: "respond_to_user",
        description: "The assistant doesn't need to call any other tools. Only respond to the user.",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    }
};