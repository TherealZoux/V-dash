<template>
  <article
    class=" border border-gray-100 rounded-2xl shadow-sm p-6 transition hover:border-indigo-100"
  >
    <header class="flex items-center gap-4">
      <img
        v-if="user?.image"
        :src="user.image"
        :alt="user?.username || 'User avatar'"
        class="w-14 h-14 rounded-full object-cover border border-gray-100"
      />
      <div
        v-else
        class="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-lg"
      >
        {{ getInitials(user) }}
      </div>
      <div>
        <p class="text-lg font-semibold ">
          {{ formatFullName(user) }}
        </p>
        <p class="text-sm text-gray-500">
          @{{ user?.username || "anonymous" }}
        </p>
      </div>
    </header>

    <div class="mt-4 space-y-3">
      <h3
        v-if="post.title"
        class="text-xl font-semibold  leading-tight"
      >
        {{ post.title }}
      </h3>
      <p class="text-base  leading-relaxed">
        {{ post.body }}
      </p>
      <div class="flex flex-wrap gap-6 text-sm text-gray-500">
        <span class="flex items-center gap-2">
          <i class="pi pi-heart-fill text-rose-500"></i>
          {{ post.reactions?.likes ?? 0 }} likes
        </span>
        <span class="flex items-center gap-2">
          <i class="pi pi-thumbs-down text-gray-400"></i>
          {{ post.reactions?.dislikes ?? 0 }} dislikes
        </span>
        <span class="flex items-center gap-2">
          <i class="pi pi-eye text-indigo-400"></i>
          {{ post.views ?? 0 }} views
        </span>
      </div>
      <div
        v-if="post.tags?.length"
        class="flex flex-wrap gap-2 pt-2 text-xs font-medium text-indigo-600"
      >
        <span
          v-for="tag in post.tags"
          :key="`${post.id}-${tag}`"
          class="px-2 py-1 rounded-full bg-indigo-50"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <div class="mt-6 space-y-2">
      <div class="flex flex-wrap gap-4">
        <div
          v-for="reaction in reactionsSummary(post)"
          :key="reaction.label"
          class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-3 py-1"
        >
          <i :class="reaction.icon"></i>
          <span>{{ reaction.value }} {{ reaction.label }}</span>
        </div>
      </div>
    </div>

    <footer
      class="mt-6 border-t pt-4 flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <div class="flex items-center gap-2 text-gray-600">
        <i class="pi pi-comments text-indigo-500"></i>
        <span>{{ postComments?.comments?.length }} comments</span>
      </div>
      <button
        class="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
        @click="toggleCommentsTimeline(post.id)"
      >
        {{
          expandedCommentsPostId === post.id
            ? "Hide timeline"
            : "Show comments timeline"
        }}
      </button>
    </footer>

    <transition name="fade">
      <div
        v-if="expandedCommentsPostId === post.id"
        class="mt-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5"
      >
        <p
          v-if="!postComments?.comments.length"
          class="text-sm text-gray-500 text-center"
        >
          No comments for this post yet.
        </p>
         <ol v-else class="relative border-l border-indigo-200 pl-6 space-y-6">
          <li
            v-for="comment in postComments.comments"
            :key="comment.id"
            class="relative"
          >
            <span
              class="absolute -left-3 top-2 w-5 h-5 rounded-full border-2 border-white bg-indigo-300 shadow"
            ></span>
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex items-center justify-between gap-3 mb-2">
                <p class="text-sm font-semibold text-gray-900">
                  {{
                    comment.user?.fullName ||
                    comment.user?.username ||
                    "Anonymous"
                  }}
                </p>
                <span class="text-xs text-gray-400">
                  {{ formatRelativeTime(comment.date) }}
                </span>
              </div>
              <p class="text-sm text-gray-700">
                {{ comment.body }}
              </p>
            </div>
          </li>
        </ol> 
      </div>
    </transition>
   </article>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { usePostsStore } from "@/stores/PostsStore";
interface PostReactions {
  likes: number;
  dislikes: number;
  views: number;
}

interface Post {
  id: number;
  title?: string;
  body: string;
  tags?: string[];
  reactions?: PostReactions;
  views?: number;
  userId: number;
}
interface Comment {
  id: number;
  body: string;
  postId: number;
  date?: string;
  user?: {
    username?: string;
    fullName?: string;
  };
}

const usersStore = useUserStore()
const postsStore = usePostsStore()
const props = defineProps<{
  post: Post;
  comments: Comment[];
}>();

const user = ref()
const expandedCommentsPostId = ref<number | null>(null);


const reactionsSummary = (post: Post) => {
  return [
    {
      label: "likes",
      value: post.reactions?.likes ?? 0,
      icon: "pi pi-heart text-rose-500",
    },
    {
      label: "dislikes",
      value: post.reactions?.dislikes ?? 0,
      icon: "pi pi-thumbs-down text-gray-400",
    },
    {
      label: "views",
      value: post.views ?? 0,
      icon: "pi pi-eye text-indigo-400",
    },
  ];
};

const commentsByPost = ((postId: number) => {
  return props?.comments?.filter((comment: Comment) => comment.postId === postId);
});

const postComments = ref()


const getCommentsForPost = (postId: number) => commentsByPost(postId) || [];
const getCommentCount = (postId: number) => getCommentsForPost(postId);

const toggleCommentsTimeline = (postId: number) => {
  expandedCommentsPostId.value =
    expandedCommentsPostId.value === postId ? null : postId;
};


const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "just now";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};


const getInitials = (user?: any) => {
  if (!user) return "UU";
  const first = user.firstName?.[0] || user.username?.[0] || "U";
  const last = user.lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

const formatFullName = (user?: any) => {
  if (!user) return "Unknown user";
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return name || user.username || "Unknown user";
}

onMounted(async()=>{
    user.value =  await usersStore.getUserById(props.post.userId)
    postComments.value = await postsStore.getPostComments(props.post.id)
})
</script>