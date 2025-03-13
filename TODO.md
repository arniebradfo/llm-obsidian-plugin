# TODOs

Weelll, it works, now what
- options
  - chat in obsidian md editor, highlight responses in [callouts](https://help.obsidian.md/callouts)
  - highlight text to rewrite
- Settings: ollama setup
- RAG? 


## Workflows

### Rewrite selection
- highlight section to rewrite
- run command "LLM Edit"
- open modal: 
  - instructions + submit button, 
  - quick edit buttons, 
  - current selection as markdown
  - ---run---
  - show stream output
  - stop button / apply button / (or try again)

### EditorSuggest

### Chat in md Editor
- type out a request, run "chat with context"
- system takes entire page as question context

### Chat in side panel
- save histories as files

### Code-like Interactions
- Cursor-based operations:
  - Place cursor at end of line, run "continue writing" command
  - Place cursor in middle of paragraph, run "expand here" to insert text
  - Place cursor at start of line, run "prepend context" 
  
- Selection-based operations:
  - Select text, run "rewrite selection" command
  - Select text, run "explain selection" for inline documentation
  - Select multiple blocks, run "summarize selection"
  - Select paragraph, run "restructure" to improve organization
  
- Multi-cursor operations:
  - Select multiple similar phrases, run "batch edit" to modify all at once
  - Select multiple sections, run "find patterns" to identify commonalities
  - Select multiple sections, run "find patterns" to identify commonalities
  
- Document structure:
  - Select heading, run "generate outline" to create subsections
  - Select list, run "expand items" to add detail to each point
  - Select code block, run "convert to prose" or "explain code"
