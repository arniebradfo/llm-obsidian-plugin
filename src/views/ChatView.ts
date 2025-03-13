import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_CHAT = 'ollm-chat';

export class ChatView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_CHAT;
  }

  getDisplayText() {
    return 'Chat';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h4', { text: 'Chat' });
  }

  async onClose() {
    // Nothing to clean up.
  }
}