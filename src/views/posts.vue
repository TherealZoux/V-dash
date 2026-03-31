<template>
  <section class="p-8 relative">
    <SectionHeader
      title="Posts"
      desc="View all Posts details here."
      :show-add-button="true"
      add-button-title="Add new Post"
      @add="openAddDialog"
    />
    <hr class="text-gray-200 mt-4 absolute left-0 w-full" />

    <div class="mt-8 space-y-6 w-[54rem] mx-auto">
      <Post v-for="post in store?.posts?.data?.posts" :key="post.id" :post="post" :comments="store?.comments?.data?.comments" />

      <div
        v-if="!store?.posts?.data?.posts?.length"
        class="text-center text-gray-500 py-12 border rounded-2xl bg-white " 
      >
        Nothing to show yet. Try adding a new post.
      </div>

      <div v-if="store.hasMore" class="flex justify-center mt-6">
        <Button
          label="Load More Posts"
          :loading="store.loading"
          @click="store.loadMore()"
          class="px-6 py-2"
        />
      </div>
    </div>

    <CRUDDialog
      :fields="fields"
      title="Add new post"
      :visible="visible"
      :initialData="initialValues"
      :validationSchema="validationSchema"
      :submit="handleAddPost"
      @update:visible="handleCloseDialog"
      @cancel="handleCloseDialog"
    />
  </section>
</template>

<script lang="ts" setup>
import SectionHeader from "@/components/SectionHeader.vue";
import CRUDDialog from "@/components/dialogs/CRUDDialog.vue";
import { usePostsStore } from "@/stores/PostsStore";
import { useUserStore } from "@/stores/UserStore";
import { computed, onMounted, ref } from "vue";
import * as yup from "yup";
import Post from "@/components/Post.vue";
import Button from "primevue/button";
const store = usePostsStore();
const usersStore = useUserStore();
const visible = ref(false);





const initialValues = {
  id: null,
  title: "",
  body: "",
  tags: [],
  reactions: {
    likes: 0,
    dislikes: 0,
  },
  views: 0,
  userId: 0,
};

// Validation schema for posts (not products)
const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  body: yup.string().required("Body is required"),
  userId: yup.number().required("User ID is required"),
});

const fields = computed(() => [
  {
    name: "userId",
    label: "User",
    type: "select",
    required: true,
    options:
      usersStore?.data?.users?.map((user: any) => ({
        label: user.username,
        value: user.id,
      })) || [],
  },
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "body",
    label: "Body",
    type: "textarea",
    required: true,
  },
  { name: "tags", label: "Tags", type: "text" },
]);

const openAddDialog = () => {
  visible.value = true;
};
const handleCloseDialog = () => {
  visible.value = false;
};
const handleAddPost = async (values: any) => {
  try {
    await store.createPost(values);
    visible.value = false;
  } catch (error) {}
};
onMounted(async () => {
  await store.getAllPosts();
  await store.getAllComments();
  await usersStore.getAllUsers(500, 0);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
