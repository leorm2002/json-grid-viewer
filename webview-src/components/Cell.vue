<template>
  <div>
    <template v-if="Array.isArray(element)">
      <span class="array collapsed">
        <span class="array badge">Array[{{ element.length }}]</span>
        <span class="expand" @click="toggleExpanded">{{ expanded ? '-' : '+' }}</span>
        <span class="actions">
          <button class="action-btn add-btn" @click="addArrayItem" title="Add item">+</button>
        </span>
      </span>
      <array-table v-if="expanded" :array="element" @update:element="updateValue" />
    </template>
    <template v-else-if="typeof element === 'object' && element != null">
      <span class="object collapsed">
        <span class="object badge">Object[{{ Object.keys(element).length}}]</span>
        <span class="expand" @click="toggleExpanded">{{ expanded ? '-' : '+' }}</span>
        <span class="actions">
          <button class="action-btn add-btn" @click="addObjectProperty" title="Add property">+</button>
        </span>
      </span>
      <object-table v-if="expanded" :member="element" @update:member="updateValue" />
    </template>
    <template v-else-if="isEditing">
      <span class="value-edit-container">
        <input 
          v-if="typeof element === 'string'" 
          type="text" 
          v-model="editValue" 
          @blur="saveEdit" 
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          ref="editInput"
        />
        <input 
          v-else-if="typeof element === 'number'" 
          type="number" 
          v-model.number="editValue" 
          @blur="saveEdit" 
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          ref="editInput"
        />
        <select 
          v-else-if="typeof element === 'boolean'" 
          v-model="editValue" 
          @blur="saveEdit" 
          @change="saveEdit"
          ref="editInput"
        >
          <option :value="true">true</option>
          <option :value="false">false</option>
        </select>
        <select 
          v-else-if="element === null" 
          v-model="editValue" 
          @blur="saveEdit"
          @change="saveEdit"
          ref="editInput"
        >
          <option :value="null">null</option>
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="object">object</option>
          <option value="array">array</option>
        </select>
      </span>
    </template>
    <template v-else>
      <span 
        :class="['value', valueTypeClass]" 
        @dblclick="startEdit"
      >
        {{ displayValue }}
      </span>
    </template>
  </div>
</template>

<script>
import { getValueType, createArrayItem, createDefaultValue } from '../utils/jsonUtils';

export default {
  props: [
    'element',
    'path'
  ],
  emits: ['update:element'],
  data() {
    return {
      expanded: false,
      isEditing: false,
      editValue: null,
      originalValue: null
    }
  },
  computed: {
    displayValue() {
      if (this.element === null) return 'null';
      return this.element;
    },
    valueTypeClass() {
      return getValueType(this.element);
    }
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded
    },
    startEdit() {
      this.isEditing = true;
      this.editValue = this.element;
      this.originalValue = this.element;
      this.$nextTick(() => {
        if (this.$refs.editInput) {
          this.$refs.editInput.focus();
        }
      });
    },
    saveEdit() {
      this.isEditing = false;
      
      // Handle type conversion for null value changes
      if (this.element === null && typeof this.editValue === 'string') {
        this.editValue = createDefaultValue(this.editValue);
      }
      
      if (this.editValue !== this.originalValue) {
        this.$emit('update:element', this.editValue);
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.editValue = this.originalValue;
    },
    updateValue(newValue) {
      this.$emit('update:element', newValue);
    },
    addArrayItem() {
      if (!Array.isArray(this.element)) return;
      
      // Expand array if it's not already expanded
      if (!this.expanded) {
        this.expanded = true;
      }
      
      // Add appropriate default value based on array contents
      const newItem = createArrayItem(this.element);
      const newArray = [...this.element, newItem];
      this.$emit('update:element', newArray);
    },
    addObjectProperty() {
      if (typeof this.element !== 'object' || this.element === null) return;
      
      // Expand object if it's not already expanded
      if (!this.expanded) {
        this.expanded = true;
      }
      
      this.$nextTick(() => {
        // Use event bus to notify object table to add a new property
        this.$root.$emit('add-object-property', this.element);
      });
    }
  },
  created() {
    if (this.$parent === this.$root) this.expanded = true
  }
}
</script>

<style scoped>
.value-edit-container {
  display: inline-block;
  min-width: 100px;
}

.value-edit-container input,
.value-edit-container select {
  width: 100%;
  padding: 2px 4px;
  border: 1px solid var(--vscode-editor-foreground);
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
}

.actions {
  display: inline-flex;
  margin-left: 8px;
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

.add-btn {
  background-color: var(--vscode-button-background);
}
</style>
