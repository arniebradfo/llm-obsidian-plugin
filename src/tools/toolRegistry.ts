import { Tool, ToolRegistry } from "src/types/Tool";
import { dateTimeTool, handleDateTimeTool } from "./dateTimeTool";
import { noToolNeeded } from "./noTool";

const toolRegistry: ToolRegistry = new Map();

export const registerTool = (tool: Tool) => {
    toolRegistry.set(tool.function.name, tool);
};

export const getToolHandler = (name: string) => {
    return toolRegistry.get(name)?.handler;
};

export const getAllToolDefinitions = () => {
    return Array.from(toolRegistry.values());
};

// Register default tools
registerTool({
    type: "function",
    function: dateTimeTool.function,
    handler: handleDateTimeTool
});

registerTool({
    type: "function",
    function: noToolNeeded.function,
    handler: async () => "No tool needed"
});

export { toolRegistry }; 