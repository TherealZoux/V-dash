<template>
  <div :class="props.class">
    <DataTable :value="data || []" :loading="loading">
      <template #header v-if="props.header">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xl font-bold">{{ props.header }}</span>
        </div>
      </template>
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      >
        <template #body="slotProps" v-if="col.template">
          <component :is="col.template(slotProps.data)" />
        </template>
        <template #body="slotProps" v-else>
          {{ formatCellValue(slotProps.data, col) }}
        </template>
      </Column>
      <Column
        v-if="props.actions && props.actions.length"
        field="actions"
        header="Actions"
      >
        <template #body="slotProps">
          <div class="flex gap-2">
            <button
              v-for="action in props.actions"
              :key="action as string"
              class="px-2 py-1 rounded text-xs font-medium"
              :class="{
                'bg-blue-100 text-blue-700': action === 'view',
                'bg-yellow-100 text-yellow-700': action === 'edit',
                'bg-red-100 text-red-700':
                  action === 'delet' || action === 'delete',
                'bg-green-100 text-green-700': action === 'update',
              }"
              @click="
                action === 'view' ||
                action === 'edit' ||
                action === 'delet' ||
                action === 'delete'
                  ? $emit('save', slotProps.data)
                  : $emit('close')
              "
              :title="(action as string).charAt(0).toUpperCase() + (action as string).slice(1)"
            >
              <span v-if="action === 'view'"><i class="pi pi-eye"></i></span>
              <span v-else-if="action === 'edit'"
                ><i class="pi pi-pencil"></i
              ></span>
              <span v-else-if="action === 'delet' || action === 'delete'"
                ><i class="pi pi-trash"></i
              ></span>
              <span v-else-if="action === 'update'"
                ><i class="pi pi-refresh"></i
              ></span>
              <span v-else>{{ action as string }}</span>
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
    <!-- <Paginator :rows="10" :totalRecords="120" /> -->
  </div>
  <CRUDDialog
    :fields="fields"
    :title="addDialogTitle"
    :visible="visible"
    :initialData="initialValues"
    :validationSchema="validationSchema"
    @update:visible="$emit('close')"
    :submit="submit"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import DataTable from "primevue/datatable";
import Paginator from "primevue/paginator";
import Column from "primevue/column";
import type { DefineComponent } from "vue";
import CRUDDialog from "./dialogs/CRUDDialog.vue";
import { Field } from "vee-validate";

const props = defineProps({
  data: Array as () => any[],
  columns: Array as () => any[],
  header: String,
  addDialogTitle: {
    type: String,
    default: 'Add Item',
  },
  loading: Boolean,
  class: String,
  actions: {
    type: Array as () => string[],
    default: () => [],
  },
  initialValues: {
    type: Object as () => Record<string, any>,
    default: () => ({}),
  },
  fields: {
    type: Array as () => any[],
    default: () => [],
  },
  visible: {
    type: Boolean,
    default: false,
  },
  validationSchema: {
    type: Object,
    default: () => ({}),
  },
  submit: {
    type: Function,
    default: () => {},
  },
});
const emits = defineEmits(["close", "save"]);

const formatCellValue = (item: any, column: any) => {
  const value = item[column.field as string];
  if (column.formatter && typeof column.formatter === "function") {
    return column.formatter(value, item);
  }
  return value ?? "_";
};
</script>
