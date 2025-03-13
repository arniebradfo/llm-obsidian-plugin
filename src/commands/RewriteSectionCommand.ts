import { Command, Editor, MarkdownView, Modal, Plugin } from "obsidian";
import { OllmUpdateSelectionComponent } from "src/components/OllmUpdateSelectionComponent";    

export const rewriteSectionCommand = (plugin: Plugin): Command => ({
    id: "ollm-rewrite-selection",
    name: "Rewrite Selection",
    editorCallback: async (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection());

        const modal = new Modal(plugin.app);

        const ollmUpdateSelectionComponent =
            new OllmUpdateSelectionComponent(
                modal.contentEl,
                plugin.app,
                editor
            );

        ollmUpdateSelectionComponent.load();

        modal.onClose = () => {
            // is this necessary for unloading? or preventing memory leaks?
            ollmUpdateSelectionComponent.unload();
            modal.contentEl.empty();
        };

        ollmUpdateSelectionComponent.register(() => {
            modal.close();
        });

        modal.open();
    },
})
