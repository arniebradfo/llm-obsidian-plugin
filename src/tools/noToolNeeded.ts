import { ChatTool } from "./chatTools";

/** llama3.2 seems to always call a tool, even when one is not needed. This is a no-op tool that can be used to circumvent this behavior. */
export const noToolNeeded: ChatTool = {
	tool: {
		type: "function",
		function: {
			name: "respond_to_user",
			description:
				"Respond to the user without calling any other tools.",
			parameters: {
				type: "object",
				properties: {},
				required: [],
			},
		},
	},
	handler: async (params: {}) => {
		return "Respond to the user";
	},
};
