<template>
  <div class="array-table-container">
    <resizable-table
      :headers="[ { header: '', resize: false, thClass: 'index' }, ...headers ]"
      tblClass="array expanded"
      trClass = "array-hdr"
    >
      <template #header="{ hdr }">
        <span v-if="hdr !== 'index'">{{ hdr }}</span>
      </template>
      <template #body>
        <array-row 
          v-for="(item, index) in array" 
          :key="index" 
          :element="item" 
          :index="index" 
          :columns="headers" 
          @update:element="updateArrayItem(index, $event)"
          @remove="removeArrayItem(index)"
        />
      </template>
    </resizable-table>
    <div class="array-actions">
      <button class="action-btn add-btn" @click="addArrayItem">Add item</button>
    </div>
  </div>
</template>

<script>
import { createArrayItem } from '../utils/jsonUtils';

export default {
  props: [
    'array'
  ],
  emits: ['update:element'],
  computed: {
    headers() {
      const hdrCells = this.array.reduce((hdrs, el) => {
        if (typeof el === 'object' && el !== null) {
          return [...new Set([...hdrs, ...Object.keys(el)])]
        }
        return hdrs
      }, [])
        .map(header => {
          return { header, resize: true, thClass: "array member" }
        });
      return hdrCells;
    }
  },
  methods: {
    updateArrayItem(index, newValue) {
      const newArray = [...this.array];
      newArray[index] = newValue;
      this.$emit('update:element', newArray);
    },
    removeArrayItem(index) {
      const newArray = [...this.array];
      newArray.splice(index, 1);
      this.$emit('update:element', newArray);
    },
    addArrayItem() {
      // Create appropriate default value based on array contents
      const newItem = createArrayItem(this.array);
      const newArray = [...this.array, newItem];
      this.$emit('update:element', newArray);
    }
  }
}
</script>

<style scoped>
.array-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-start;
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
