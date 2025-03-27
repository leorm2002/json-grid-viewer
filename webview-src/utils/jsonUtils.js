/**
 * Utilities for handling JSON data operations
 */

/**
 * Creates a default value based on the type
 * @param {string} type - The type of value to create ('string', 'number', 'boolean', 'null', 'object', 'array')
 * @returns {any} The default value for the given type
 */
export const createDefaultValue = (type) => {
  switch (type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'object': return {};
    case 'array': return [];
    case 'null':
    default:
      return null;
  }
};

/**
 * Creates a new array item based on the pattern of existing items
 * @param {Array} array - The array to analyze
 * @returns {any} A new item that matches the pattern of the array
 */
export const createArrayItem = (array) => {
  if (!array || array.length === 0) return null;
  
  const lastItem = array[array.length - 1];
  
  if (Array.isArray(lastItem)) {
    return [];
  } else if (typeof lastItem === 'object' && lastItem !== null) {
    // For objects, create a similar structure
    const newItem = {};
    Object.keys(lastItem).forEach(key => {
      const value = lastItem[key];
      if (Array.isArray(value)) {
        newItem[key] = [];
      } else if (typeof value === 'object' && value !== null) {
        newItem[key] = {};
      } else {
        newItem[key] = createDefaultValueFromExisting(value);
      }
    });
    return newItem;
  } else {
    return createDefaultValueFromExisting(lastItem);
  }
};

/**
 * Creates a default value based on an existing value's type
 * @param {any} value - The value to base the default on
 * @returns {any} A new default value of the same type
 */
export const createDefaultValueFromExisting = (value) => {
  if (value === null) return null;
  
  switch (typeof value) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'object':
      if (Array.isArray(value)) return [];
      return {};
    default:
      return null;
  }
};

/**
 * Determines the type of a value
 * @param {any} value - The value to check
 * @returns {string} The type as a string ('array', 'object', 'string', 'number', 'boolean', 'null')
 */
export const getValueType = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};