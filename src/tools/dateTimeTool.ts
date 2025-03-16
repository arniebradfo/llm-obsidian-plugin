import { ChatTool } from "./chatTools";
import { App } from "obsidian";
export const dateTimeTool: ChatTool = {
	tool: {
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
						description:
							"Format for the date/time output ('ISO' or 'local')",
					},
				},
				required: [],
			},
		},
	},
	handler: async (app: App, params: { format?: "ISO" | "local" }) => {
		const now = new Date();
		return params.format === "local"
			? now.toLocaleString()
			: now.toISOString();
	},
};
