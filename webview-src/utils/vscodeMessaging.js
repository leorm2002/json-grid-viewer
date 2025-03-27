/**
 * Utilities for communicating with VS Code extension
 */

// Store the VS Code API instance
let vscode = null;

/**
 * Initialize the VS Code API
 * @returns {Object} The VS Code API instance
 */
export const initVSCode = () => {
  if (!vscode) {
    vscode = window.acquireVsCodeApi();
  }
  return vscode;
};

/**
 * Get the VS Code API instance
 * @returns {Object} The VS Code API instance
 */
export const getVSCode = () => {
  if (!vscode) {
    return initVSCode();
  }
  return vscode;
};

/**
 * Send data to be saved to the document
 * @param {Object} data - The JSON data to save
 */
export const saveDocumentChanges = (data) => {
  getVSCode().postMessage({
    type: 'update',
    data
  });
};

/**
 * Send request to copy data to clipboard
 * @param {Object} data - The data to copy to clipboard
 */
export const copyToClipboard = (data) => {
  getVSCode().postMessage({
    type: 'copyToClipboard',
    data
  });
};

/**
 * Send ready message to VS Code
 */
export const sendReadyMessage = () => {
  getVSCode().postMessage({
    type: 'ready'
  });
};

/**
 * Create a debounced function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
 * @returns {Function} A debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};