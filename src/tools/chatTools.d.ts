import { Tool } from "ollama";
import { App } from "obsidian";

export type ChatTool = {
	tool: Tool;
	handler: (app: App, params: Record<string, unknown>) => Promise<string>;
};
