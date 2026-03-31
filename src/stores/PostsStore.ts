import { defineStore } from "pinia";
import { useCrud } from "@/composables/useCrud";
import { ref, computed } from "vue";

export const usePostsStore = defineStore("postsStore", () => {
  const posts = ref();
  const comments = ref();
  const currentPost = ref();
  const error = ref();
  const loading = ref(false);
  const total = ref(0);
  const pageSize = ref(10);
  const currentSkip = ref(0);

  const hasMore = computed(() => currentSkip.value < total.value);

  const getAllPosts = async (limit?: number, skip?: number, appendMode = false) => {
    loading.value = true;
    try {
      const effectiveLimit = limit ?? pageSize.value;
      const effectiveSkip = skip ?? currentSkip.value;
      const res = await useCrud("/posts").list({ limit: effectiveLimit, skip: effectiveSkip });
      
      if (!res?.data) {
        return posts;
      }
      
      if (appendMode) {
        if (posts.value?.data?.posts) {
          posts.value.data.posts = [...posts.value.data.posts, ...res.data.posts];
        }
      } else {
        posts.value = res;
      }
      
      total.value = res.data?.total || 0;
      currentSkip.value = effectiveSkip + effectiveLimit;
      return posts;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = () => {
    getAllPosts(pageSize.value, currentSkip.value, true);
  };

  const resetAndFetch = () => {
    currentSkip.value = 0;
    getAllPosts(pageSize.value, 0, false);
  };

  const getAllComments = async (limit?: number, skip?: number) => {
    try {
      const res = await useCrud("/comments").list({ limit: limit, skip: skip });
      comments.value = res;
      return comments;
    } catch (error) {
      console.log(error);
    }
  };

  const getPostById = async (id: number) => {
    try {
      const res = await useCrud("/posts").get(id);
      currentPost.value = res;
    } catch (error) {
      console.log(error);
    }
  };
  const getUserPosts = async (id: number) => {
    try {
      const res = await useCrud("/posts/user").get(id);
      posts.value = res;
    } catch (error) {
      console.log(error);
    }
  };
  const getPostComments = async (id: number) => {
    try {
      const res = await useCrud("/comments/post").get(id);
      comments.value = res;
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  const createPost = async (payload: any) => {
    try {
      const res = await useCrud("/posts/add").create(payload);
      if (posts.value?.data?.posts) {
        posts.value.data.posts.unshift(res);
      }
      return res;
    } catch (err: any) {
      console.log(err);
      error.value = err;
      return false;
    }
  };

  return {
    posts,
    comments,
    currentPost,
    error,
    loading,
    total,
    pageSize,
    currentSkip,
    hasMore,
    getAllPosts,
    getAllComments,
    getPostById,
    getUserPosts,
    getPostComments,
    createPost,
    loadMore,
    resetAndFetch,
  };
});
