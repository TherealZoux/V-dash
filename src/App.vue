<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Toast from "primevue/toast";
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
import { useAuthStore } from "./stores/AuthStore";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import Spinner from "./components/Spinner.vue";
import Navbar from "./components/Navbar.vue";

const authStore = useAuthStore();
const sidebar = computed(() => authStore.sidebar);
const loading = ref(authStore.loading);
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const res = await authStore.checkAuth();
  if (!res) {
    router.push("/login");
  }
  authStore.setWindowWidth(window.innerWidth);
  const handleResize = () => {
    authStore.setWindowWidth(window.innerWidth);
  };
  window.addEventListener("resize", handleResize);

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});
</script>

<template>
  <div v-if="loading" class="h-[100vh] flex justify-center items-center">
    <Spinner />
  </div>

  <div v-else class="h-[100vh] flex flex-col overflow-hidden">
    <Toast />
    <!-- Navbar - only show when not on login page -->

    <!-- Main content area -->
    <main class="flex flex-1 overflow-hidden bg-[#b2b2b20f]">
      <Sidebar
        v-if="sidebar && route.name !== 'Login'"
        :style="
          authStore.windowWidth < 500
            ? {
                width: '100%',
                position: 'absolute',
                background: 'white',
                top: '40px',
                zIndex: 100,
              }
            : {}
        "
      />
      <main class="w-full flex flex-col overflow-y-auto m-2 rounded-lg border border-gray-200 ">
        <Navbar v-if="route.name !== 'Login'" class="h-fit" />
        <RouterView />
      </main>
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
  }
}
</style>
