import { Tool } from "ollama";

export type ChatTool = {
	tool: Tool;
	handler: (params: Record<string, unknown>) => Promise<string>;
};
