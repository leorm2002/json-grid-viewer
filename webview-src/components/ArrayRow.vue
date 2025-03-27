<template>
  <tr :class="[ 'array-el', typeOfEl ]">
    <td :class="[ 'index', typeOfEl ]">
      <div class="index-container">
        <span>{{ index }}</span>
        <button class="action-btn remove-btn" @click="$emit('remove')" title="Remove item">×</button>
      </div>
    </td>
    <template v-if="typeOfEl == 'object'">
      <td v-for="{ header } in columns" :key="header" class="member">
        <cell 
          :element="element[header]" 
          @update:element="updateObjectProperty(header, $event)"
        />
      </td>
    </template>
    <td v-else class="value" :colspan="columns.length">
      <cell 
        :element="element" 
        @update:element="updateValue"
      />
    </td>
  </tr>
</template>

<script>
import { getValueType } from '../utils/jsonUtils';

export default {
  props: [
    'element',
    'index',
    'columns'
  ],
  emits: ['update:element', 'remove'],
  computed: {
    typeOfEl() {
      return getValueType(this.element);
    }
  },
  methods: {
    updateObjectProperty(key, value) {
      if (typeof this.element !== 'object' || this.element === null) return;
      
      const updatedElement = { ...this.element };
      updatedElement[key] = value;
      
      this.$emit('update:element', updatedElement);
    },
    updateValue(value) {
      this.$emit('update:element', value);
    }
  }
}
</script>

<style scoped>
.index-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-btn {
  background: none;
  border: 1px solid var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-radius: 3px;
  cursor: pointer;
  margin-left: 4px;
  padding: 0 4px;
  font-size: 0.9em;
  line-height: 1.2;
}

.action-btn:hover {
  background-color: var(--vscode-button-hoverBackground);
}

.remove-btn {
  color: var(--vscode-errorForeground, #f44);
  border-color: var(--vscode-errorForeground, #f44);
  font-weight: bold;
}
</style>
