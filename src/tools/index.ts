import { dateTimeTool } from "./dateTimeTool";
import { noToolNeeded } from "./noToolNeeded";

const availableChatTools = [
    noToolNeeded,  // this tool is very important, see note in file
    dateTimeTool, 
];

export const availableTools = availableChatTools.map(
	(chatTool) => chatTool.tool
);

export const toolHandlers = Object.fromEntries(
	availableChatTools.map((chatTool) => [
		chatTool.tool.function.name,
		chatTool.handler,
	])
);
