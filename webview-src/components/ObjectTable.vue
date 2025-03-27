<template>
  <div class="object-table-container">
    <resizable-table :headers="headers" tblClass="object expanded" trClass="object-hdr">
      <template #body>
        <tr v-for="(val, key) in member" class="object member" :key="key">
          <th class="object key">
            <span v-if="editingKey === key" class="key-edit">
              <input 
                type="text" 
                v-model="editKeyValue" 
                @blur="saveKey(key)" 
                @keyup.enter="saveKey(key)"
                @keyup.esc="cancelKeyEdit"
                ref="keyInput"
              />
            </span>
            <span v-else @dblclick="startKeyEdit(key)" class="key-display">
              {{ key }}
              <button class="action-btn remove-btn" @click="removeProp(key)" title="Remove property">×</button>
            </span>
          </th>
          <td class="object element">
            <cell 
              :element="val" 
              @update:element="updateProperty(key, $event)"
            />
          </td>
        </tr>
        <tr v-if="isAddingProperty" class="object member new-property">
          <th class="object key">
            <input 
              type="text" 
              v-model="newPropertyKey" 
              placeholder="Property name" 
              @keyup.enter="finishAddingProperty"
              @keyup.esc="cancelAddingProperty"
              ref="newPropInput"
            />
          </th>
          <td class="object element">
            <select v-model="newPropertyType" class="property-type-select">
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="null">Null</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
            </select>
          </td>
        </tr>
      </template>
    </resizable-table>
    <div class="object-actions">
      <button class="action-btn add-btn" @click="startAddingProperty">Add property</button>
    </div>
  </div>
</template>

<script>
import ResizableTable from './ResizableTable.vue';
import { createDefaultValue } from '../utils/jsonUtils';

export default {
  components: { ResizableTable },
  props: [
    'member'
  ],
  emits: ['update:member'],
  data() {
    return {
      headers: [
        { header: 'key', thClass: 'object key' },
        { header: 'val', thClass: 'object value' }
      ],
      editingKey: null,
      editKeyValue: '',
      isAddingProperty: false,
      newPropertyKey: '',
      newPropertyType: 'string'
    }
  },
  methods: {
    startKeyEdit(key) {
      this.editingKey = key;
      this.editKeyValue = key;
      this.$nextTick(() => {
        if (this.$refs.keyInput) {
          this.$refs.keyInput[0].focus();
        }
      });
    },
    saveKey(oldKey) {
      if (!this.editKeyValue || this.editKeyValue === oldKey || this.member[this.editKeyValue] !== undefined) {
        this.editingKey = null;
        return;
      }
      
      // Create new object with updated key
      const updatedMember = {};
      Object.entries(this.member).forEach(([key, value]) => {
        if (key === oldKey) {
          updatedMember[this.editKeyValue] = value;
        } else {
          updatedMember[key] = value;
        }
      });
      
      this.editingKey = null;
      this.$emit('update:member', updatedMember);
    },
    cancelKeyEdit() {
      this.editingKey = null;
    },
    updateProperty(key, newValue) {
      const updatedMember = { ...this.member };
      updatedMember[key] = newValue;
      this.$emit('update:member', updatedMember);
    },
    removeProp(key) {
      const updatedMember = { ...this.member };
      delete updatedMember[key];
      this.$emit('update:member', updatedMember);
    },
    startAddingProperty() {
      this.isAddingProperty = true;
      this.newPropertyKey = '';
      this.newPropertyType = 'string';
      
      this.$nextTick(() => {
        if (this.$refs.newPropInput) {
          this.$refs.newPropInput.focus();
        }
      });
    },
    finishAddingProperty() {
      if (!this.newPropertyKey || this.member[this.newPropertyKey] !== undefined) {
        this.isAddingProperty = false;
        return;
      }
      
      // Create value based on selected type using utility function
      const value = createDefaultValue(this.newPropertyType);
      
      const updatedMember = { ...this.member };
      updatedMember[this.newPropertyKey] = value;
      
      this.isAddingProperty = false;
      this.$emit('update:member', updatedMember);
    },
    cancelAddingProperty() {
      this.isAddingProperty = false;
    }
  },
  created() {
    // Listen for event to add property from Cell component
    this.$root.$on('add-object-property', (obj) => {
      if (obj === this.member) {
        this.startAddingProperty();
      }
    });
  },
  beforeUnmount() {
    this.$root.$off('add-object-property');
  }
}
</script>

<style scoped>
.key-edit {
  display: flex;
  width: 100%;
}

.key-edit input {
  width: 100%;
  padding: 2px 4px;
  border: 1px solid var(--vscode-editor-foreground);
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
}

.property-type-select {
  padding: 2px 4px;
  border: 1px solid var(--vscode-editor-foreground);
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
}

.object-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-start;
}

.key-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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

.remove-btn {
  color: var(--vscode-errorForeground, #f44);
  border-color: var(--vscode-errorForeground, #f44);
  font-weight: bold;
}
</style>
