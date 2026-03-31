import { defineStore } from "pinia";
import { useCrud } from "@/composables/useCrud";
import { ref } from "vue";

export const useProductsStore = defineStore("productsStore", () => {
  const data = ref();
  const currentProduct = ref();
  const categories = ref();
  const error = ref();
  const loading = ref(false);

  const getAllProducts = async (limit: any = 20, skip: any = 0) => {
    try {
      loading.value = true;
      const res = await useCrud("/products").list({ limit: limit, skip: skip });
      data.value = res?.data;
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const getProductById = async (id: number) => {
    try {
      const res = await useCrud("/products").get(id);
      currentProduct.value = res.data;
      data;
    } catch (error) {
      console.log(error);
    }
  };
  const getProductsCategories = async () => {
    try {
      const res = await useCrud("/products/categories").list();
      categories.value = res?.data;
      data;
    } catch (error) {
      console.log(error);
    }
  };

  const createProduct = async (data: object) => {
    try {
      const res = await useCrud("/products/add").create(data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const updateProduct = async (id: number | string, data: object) => {
    try {
      const res = await useCrud("/products").update(id, data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    data,
    categories,
    currentProduct,
    loading,
    error,
    getAllProducts,
    getProductById,
    getProductsCategories,
    updateProduct,
    createProduct,
  };
});
