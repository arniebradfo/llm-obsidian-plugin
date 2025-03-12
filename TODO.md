# TODOs

Weelll, it works, now what
- options
  - chat in obsidian md editor, highlight responses in [callouts](https://help.obsidian.md/callouts)
  - highlight text to rewrite
- Settings: ollama setup
- RAG? 


## Workflows

### Chat in md Editor
- type out a request, run "chat with context"
- system takes entire page as question context

### Rewrite selection
- highlight section to rewrite
  1. replace rewrite, undo/redo to toggle changes
  2. show diff? in commented format
  3. show changes merged with strike-through/highlight? Super hard to accept/deny

### Chat in sidepanel

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
