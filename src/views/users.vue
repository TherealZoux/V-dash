<template>
  <section class="p-8 relative
    ">
    <SectionHeader
      title="Users"
      desc="View all Users details here."
      :show-add-button="true"
      add-button-title="Add new User"
      @add="openAddDialog"
    />
    <hr class="text-gray-200 mt-4 absolute left-0 w-full" />
    <AppTable
      :columns="columns"
      :data="users"
      :loading="loading"
      header="All Users"
      add-dialog-title="Add new user"
      class="mt-8"
      :initialValues="initialValues"
      :fields="fields"
      :visible="visible"
      :submit="handleAddProduct"
      :validationSchema="validationSchema"
      @close="handleCloseDialog"
    />
    <Paginator
      :first="(userStore.currentPage - 1) * userStore.pageSize"
      :rows="userStore.pageSize"
      :totalRecords="userStore.total"
      :rowsPerPageOptions="[10, 20, 50]"
      @page="handlePageChange"
      class="mt-4"
    />
  </section>
</template>

<script lang="ts" setup>
import AppTable from "@/components/AppTable.vue";
import Paginator from "primevue/paginator";
import SectionHeader from "@/components/SectionHeader.vue";
import { useUserStore } from "@/stores/UserStore";
import { computed, onMounted, h, ref } from "vue";
import * as yup from "yup";

const userStore = useUserStore();
const users = computed(() => userStore?.data?.users || []);
const visible = ref(false);
const loading = computed(() => userStore.loading);

const columns = [
  { field: "id", header: "ID" },
  {
    field: "image",
    header: "Avatar",
    template: (row: any) => {
      return h("div", { class: "flex items-center justify-center" }, [
        row.image
          ? h("img", {
              src: row.image,
              width: 50,
              height: 50,
              alt: `${row.firstName} ${row.lastName}`,
              style: { borderRadius: "50%", objectFit: "cover" },
            })
          : h(
              "div",
              {
                class:
                  "w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium",
              },
              row.firstName.charAt(0) + row.lastName.charAt(0)
            ),
      ]);
    },
  },
  {
    field: "firstName",
    header: "Full Name",
    template: (row: any) => {
      return h("div", { class: "flex flex-col" }, [
        h("span", { class: "font-medium" }, `${row.firstName} ${row.lastName}`),
        h("span", { class: "text-sm text-gray-500" }, `@${row.username}`),
      ]);
    },
  },
  { field: "email", header: "Email" },
  { field: "phone", header: "Phone" },
  { field: "age", header: "Age" },
  { field: "gender", header: "Gender" },
  {
    field: "birthDate",
    header: "Birth Date",
    formatter: (val: string) => new Date(val).toLocaleDateString(),
  },
];
const initialValues = {
  id: null,
  firstName: "",
  lastName: "",
  maidenName: "",
  age: null,
  gender: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  birthDate: "",
  image: "",
  bloodGroup: "",
  height: null,
  weight: null,
  eyeColor: "",
  hairColor: "",
  hairType: "",
};

// Validation schema for users
const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  maidenName: yup.string(),
  age: yup.number().required("Age is required").positive().integer(),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  birthDate: yup.date().required("Birthdate is required"),
  image: yup.string().url("Invalid URL"),
  bloodGroup: yup.string(),
  height: yup.number(),
  weight: yup.number(),
  eyeColor: yup.string(),
  hair: yup.object({
    color: yup.string(),
    type: yup.string(),
  }),
});

// Dynamic form fields
const fields = computed(() => [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "maidenName", label: "Maiden Name", type: "text" },
  { name: "age", label: "Age", type: "number", required: true },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "username", label: "Username", type: "text", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "birthDate", label: "Birthdate", type: "date", required: true },
  { name: "image", label: "Image URL", type: "text" },
  { name: "bloodGroup", label: "Blood Group", type: "text" },
  { name: "height", label: "Height (cm)", type: "number" },
  { name: "weight", label: "Weight (kg)", type: "number" },
  { name: "eyeColor", label: "Eye Color", type: "text" },
  {
    name: "hair.color",
    label: "Hair Color",
    type: "text",
  },
  {
    name: "hair.type",
    label: "Hair Type",
    type: "text",
  },
]);

const openAddDialog = () => {
  visible.value = true;
};

const handleCloseDialog = () => {
  visible.value = false;
};
const handleAddProduct = (values: any) => {
  userStore.createUser(values);
  visible.value = false;
};
const handlePageChange = (event: { page: number; rows: number }) => {
  userStore.setPage(event.page + 1);
  if (event.rows !== userStore.pageSize) {
    userStore.setPageSize(event.rows);
  }
};

onMounted(async () => {
  await userStore.getAllUsers();
});
</script>
