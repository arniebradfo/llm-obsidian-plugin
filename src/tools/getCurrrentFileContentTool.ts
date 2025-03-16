import { App, MarkdownView } from "obsidian";
import { ChatTool } from "./chatTools";

export const getCurrentFileContentTool: ChatTool = {
	tool: {
		type: "function",
		function: {
			name: "get_current_file_content",
			description: "Get the content of the current file",
			parameters: {
				type: "object",
				properties: {},
				required: [],
			},
		},
	},
	handler: async (app: App, params: {}) => {

		let content = "No file is currently active";
		const mostrecentleafView = app.workspace.getMostRecentLeaf()?.view;

		if (mostrecentleafView instanceof MarkdownView) {
			content = mostrecentleafView.editor.getValue();
		}

		return content;
	},
};
