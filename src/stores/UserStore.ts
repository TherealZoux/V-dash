import { defineStore } from "pinia";
import { useCrud } from "@/composables/useCrud";
import { ref, computed } from "vue";
export const useUserStore = defineStore("users", () => {
  const data = ref();
  const currenstUser = ref();
  const error = ref();
  const loading = ref(false);
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value));
  const skip = computed(() => (currentPage.value - 1) * pageSize.value);

  const getCurrentUser = async () => {
    loading.value = true;
    try {
      const res = await useCrud("/auth/me").list();
      data.value = res?.data;
      return data;
    } catch (error) {
      return false;
    } finally {
      loading.value = false;
    }
  };
  const getAllUsers = async (limit?: number, skipVal?: number) => {
    loading.value = true;
    try {
      const effectiveLimit = limit ?? pageSize.value;
      const effectiveSkip = skipVal ?? skip.value;
      const res = await useCrud("/users").list({ limit: effectiveLimit, skip: effectiveSkip });
      data.value = res?.data;
      total.value = res?.data?.total || 0;
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const setPage = (page: number) => {
    currentPage.value = page;
    getAllUsers();
  };
  const setPageSize = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    getAllUsers();
  };
  const getUserById = async (id: number) => {
    try {
      const res = await useCrud("/users").get(id);
      currenstUser.value = res?.data;
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  const createUser = async (payload: any) => {
    loading.value = true;
    try {
      const res = await useCrud("/users/add").create(payload);
      if (data.value && data.value.users) {
        data.value.users.unshift(res);
      }
      return res;
    } catch (err) {
      error.value = err;
      return false;
    } finally {
      loading.value = false;
    }
  };
  return {
    data,
    currenstUser,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    totalPages,
    getCurrentUser,
    getAllUsers,
    getUserById,
    createUser,
    setPage,
    setPageSize,
  };
});
