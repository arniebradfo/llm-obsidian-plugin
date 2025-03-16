import { dateTimeTool } from "./dateTimeTool";
import { getCurrentFileContentTool } from "./getCurrrentFileContentTool";
import { noToolNeeded } from "./noToolNeeded";

const availableChatTools = [
    noToolNeeded,  // this tool is very important, see note in file
    dateTimeTool, 
    getCurrentFileContentTool
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
