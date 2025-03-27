<template>
  <div class="json-grid-editor">
    <div class="toolbar">
      <button class="btn copy-btn" @click="copyToClipboard" title="Copy JSON to clipboard">
        Copy to Clipboard
      </button>
    </div>
    <cell 
      :element="jsonData" 
      :expanded="true"
      @update:element="updateJson"
    />
  </div>
</template>

<script>
import { 
  initVSCode,
  saveDocumentChanges,
  copyToClipboard as copyToClip,
  sendReadyMessage,
  debounce
} from './utils/vscodeMessaging';

export default {
  data() {
    return {
      jsonData: {},
      saveJsonChanges: null
    }
  },
  created() {
    // Initialize VS Code API
    initVSCode();

    // Create debounced save function
    this.saveJsonChanges = debounce((data) => {
      saveDocumentChanges(data);
    }, 300);

    // Listen for messages from extension
    window.addEventListener('message', event => {
      switch (event.data.type) {
        case 'update':
          this.jsonData = event.data.doc
          break;
      }
    });

    // Notify extension we're ready
    sendReadyMessage();
  },
  methods: {
    updateJson(newValue) {
      this.jsonData = newValue;
      this.saveJsonChanges(this.jsonData);
    },
    copyToClipboard() {
      copyToClip(this.jsonData);
    }
  }
}
</script>

<style>
.json-grid-editor {
  margin: 0;
  padding: 10px;
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  padding: 5px 0;
  position: sticky;
  top: 0;
  background-color: var(--vscode-editor-background);
  z-index: 1000;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.btn {
  padding: 6px 12px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.btn:hover {
  background-color: var(--vscode-button-hoverBackground);
}

.btn:active {
  background-color: var(--vscode-button-secondaryBackground);
}

.copy-btn {
  margin-left: 8px;
}
</style>
