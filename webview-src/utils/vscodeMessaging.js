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
  console.log('AAAAA:', data);
  const jsonString = JSON.stringify(data);
  console.log('BBBB:', jsonString);

  getVSCode().postMessage({
    type: 'update',
    data: jsonString
  });
};

/**
 * Send request to copy data to clipboard
 * @param {Object} data - The data to copy to clipboard
 */
export const copyToClipboard = (data) => {
  try {
    // Convert to string to avoid cloning issues
    const jsonString = JSON.stringify(data);
    // Send message to VS Code to copy to clipboard
    getVSCode().postMessage({
      type: 'copyToClipboard',
      data: jsonString
    });
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Inform the user something went wrong
    getVSCode().postMessage({
      type: 'showError',
      message: 'Failed to copy to clipboard: ' + error.message
    });
  }
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