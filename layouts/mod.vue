<template>
  <div
    class="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col md:flex-row"
  >
    <!-- Mobile Sidebar Overlay -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-30 md:hidden"
        @click="toggleMobileMenu"
      />
    </transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white dark:bg-gray-800 shadow-lg fixed h-full transform transition-all duration-200 z-40 pt-12',
        isSidebarCollapsed ? 'w-16' : 'w-64',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto py-2 px-2">
          <ul class="space-y-1">
            <li v-for="(item, index) in navItems" :key="index">
              <template v-if="!item.children">
                <NuxtLink
                  :to="item.link"
                  class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  active-class="bg-gray-100 dark:bg-gray-700 font-medium"
                  @click="closeMobileMenu"
                >
                  <Icon :name="item.icon" class="size-5" />
                  <span v-if="!isSidebarCollapsed" class="ml-3">{{
                    item.label
                  }}</span>
                </NuxtLink>
              </template>
              <template v-else>
                <button
                  @click="toggleSubMenu(index)"
                  class="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="flex items-center">
                    <Icon :name="item.icon" class="size-5" />
                    <span v-if="!isSidebarCollapsed" class="ml-3">{{
                      item.label
                    }}</span>
                  </div>
                  <Icon
                    :name="
                      openSubMenus.includes(index)
                        ? 'mdi:chevron-up'
                        : 'mdi:chevron-down'
                    "
                    class="size-5"
                  />
                </button>

                <transition name="slide">
                  <ul
                    v-if="openSubMenus.includes(index) && !isSidebarCollapsed"
                    class="pl-8 mt-1 space-y-1"
                  >
                    <li
                      v-for="(child, childIndex) in item.children"
                      :key="childIndex"
                    >
                      <NuxtLink
                        :to="child.link"
                        class="flex items-center p-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        active-class="bg-gray-100 dark:bg-gray-700 font-medium"
                        @click="closeMobileMenu"
                      >
                        <Icon :name="child.icon" class="size-4" />
                        <span class="ml-3">{{ child.label }}</span>
                      </NuxtLink>
                    </li>
                  </ul>
                </transition>
              </template>
            </li>
          </ul>
        </nav>

        <!-- Bottom Section -->
        <div class="p-2 border-t border-gray-200 dark:border-gray-700">
          <!-- Collapse Button -->
          <button
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon
              :name="
                isSidebarCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'
              "
              class="size-5 text-gray-600 dark:text-gray-400"
            />
            <span v-if="!isSidebarCollapsed" class="ml-2 text-sm"
              >Collapse</span
            >
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div
      :class="[
        'flex-1 flex flex-col min-h-screen transition-all duration-200 overflow-hidden',
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64',
      ]"
    >
      <!-- Sticky Header -->
      <header
        class="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm px-4 py-2 flex items-center justify-between"
      >
        <div class="flex items-center">
          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
          >
            <Icon name="mdi:menu" class="size-5" />
          </button>

          <!-- Dynamic Page Title -->
          <div
            class="hidden md:flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            <span class="font-medium text-gray-800 dark:text-gray-200">
              {{ currentTitle }}
            </span>
          </div>
        </div>

        <!-- Right Side Controls -->
        <div class="flex items-center space-x-2">
          <!-- Search Bar (Desktop) -->
          <div class="hidden md:block relative">
            <input
              type="text"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-500 w-64"
              :disabled="loadingProfile"
            />
            <Icon
              name="mdi:magnify"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
          </div>

          <!-- Notification -->
          <div class="relative">
            <button
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              @click="toggleDropdown('notification')"
              :disabled="loadingProfile"
            >
              <Icon name="mdi:bell-outline" class="size-5" />
              <span
                v-if="unreadNotifications > 0"
                class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full size-4 flex items-center justify-center"
                >{{ unreadNotifications }}</span
              >
            </button>

            <div
              v-if="activeDropdown === 'notification'"
              class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              v-click-outside="() => (activeDropdown = null)"
            >
              <div class="p-2 border-b border-gray-200 dark:border-gray-700">
                <h3 class="font-medium text-gray-800 dark:text-gray-200">
                  Notifications
                </h3>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <template v-if="notifications.length > 0">
                  <div
                    v-for="(notification, index) in notifications"
                    :key="index"
                    class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    @click="handleNotificationClick(notification)"
                  >
                    <div class="flex items-start">
                      <div
                        class="flex-shrink-0 p-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                      >
                        <Icon
                          :name="notification.icon || 'mdi:bell-outline'"
                          class="size-4 text-gray-600 dark:text-gray-400"
                        />
                      </div>
                      <div class="ml-3 flex-1">
                        <p
                          class="text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                          {{ notification.title || "Notification" }}
                        </p>
                        <p
                          class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        >
                          {{ notification.message }}
                        </p>
                        <p
                          class="text-xs text-gray-400 dark:text-gray-500 mt-1"
                        >
                          {{ formatTime(notification.time) }}
                        </p>
                      </div>
                      <div v-if="!notification.read" class="ml-2">
                        <span class="size-2 bg-lime-500 rounded-full"></span>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                    <Icon name="mdi:bell-off-outline" class="size-5 mx-auto" />
                    <p class="mt-2 text-sm">No notifications</p>
                  </div>
                </template>
              </div>
              <div
                v-if="notifications.length > 0"
                class="p-2 border-t border-gray-200 dark:border-gray-700 text-center"
              >
                <button
                  class="text-xs text-lime-600 dark:text-lime-400 hover:underline"
                  @click="markAllAsRead"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>

          <!-- Profile -->
          <div class="relative">
            <button
              @click="toggleDropdown('profile')"
              class="flex items-center space-x-1 focus:outline-none"
              :disabled="loadingProfile"
            >
              <div class="relative">
                <NuxtImg
                  :src="employee.avatar"
                  alt="Profile"
                  class="size-8 rounded-full object-cover border-2 border-lime-500"
                />
              </div>
            </button>

            <div
              v-if="activeDropdown === 'profile'"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              v-click-outside="() => (activeDropdown = null)"
            >
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {{ employee.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ employee.email }}
                </p>
              </div>
              <div class="py-1">
                <NuxtLink
                  to="/mod/settings"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="closeDropdowns"
                >
                  <div class="flex items-center">
                    <Icon name="mdi:cog-outline" class="size-4 mr-2" />
                    Settings
                  </div>
                </NuxtLink>
              </div>
              <div class="py-1 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Icon name="mdi:logout" class="size-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 p-4 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <div class="max-w-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import backendAPI from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

// Reactive state
const isSidebarOpen = ref(false);
const isSidebarCollapsed = ref(false);
const activeDropdown = ref(null);
const openSubMenus = ref([]);
const loadingProfile = ref(false);
const profileError = ref(null);
const authStore = useAuthStore();
const route = useRoute();

// Notifications
const notifications = ref([]);
const unreadNotifications = ref(0);

// Employee data with default values
const employee = ref({
  name: authStore.user?.name || "Employee",
  email: authStore.user?.email || "admin@example.com",
  avatar: authStore.user?.avatar || "/default-avatar.png",
});

// Navigation items
const navItems = [
  { label: "Dashboard", link: "/mod", icon: "mdi:home" },
  {
    label: "User Management",
    icon: "mdi:accounts",
    children: [
      {
        label: "Maid Profiles",
        link: "/mod/maidsprofilelist",
        icon: "mdi:cleaning",
      },
      {
        label: "Household Profiles",
        link: "/mod/houseprofilelist",
        icon: "mdi:house-city",
      },
    ],
  },
  { label: "Jobs", link: "/mod/jobs", icon: "mdi:work" },
  { label: "Settings", link: "/mod/settings", icon: "mdi:cog" },
];

// Dynamic title based on route
const currentTitle = computed(() => {
  const routeMap = {
    "/mod": "Dashboard",
    "/mod/maidsprofilelist": "Maid Profiles",
    "/mod/houseprofilelist": "Household Profiles",
    "/mod/jobs": "Jobs",
    "/mod/settings": "Settings",
  };

  // Check for exact matches first
  if (routeMap[route.path]) return routeMap[route.path];

  // Handle dynamic routes (e.g., /mod/maidsprofilelist/:id)
  if (route.path.startsWith("/mod/maidsprofilelist/"))
    return "Maid Profile Details";
  if (route.path.startsWith("/mod/houseprofilelist/"))
    return "Household Profile Details";

  // Fallback to the last part of the path
  const parts = route.path.split("/").filter((p) => p);
  return parts.length > 0
    ? parts[parts.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Dashboard";
});

async function fetchProfile() {
  try {
    loadingProfile.value = true;
    await authStore.hydrate();
    if (!authStore.isAuthenticated) navigateTo("/login");
    else if (authStore.isAuthenticated && !authStore.user) {
      await authStore.fetchUser();
    }
  } catch (error) {
    console.error("Profile fetch error:", error);
  } finally {
    loadingProfile.value = false;
  }
}

// Fetch notifications
const fetchNotifications = async () => {
  try {
    const response = await backendAPI.get("/notifications", {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    notifications.value = response.data.notifications || [];
    unreadNotifications.value = response.data.unreadCount || 0;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
};

// UI Methods
const toggleMobileMenu = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeMobileMenu = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

const toggleSubMenu = (index) => {
  const idx = openSubMenus.value.indexOf(index);
  idx > -1 ? openSubMenus.value.splice(idx, 1) : openSubMenus.value.push(index);
};

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

const closeDropdowns = () => {
  activeDropdown.value = null;
};

// Notification methods
const handleNotificationClick = async (notification) => {
  if (!notification.read) {
    try {
      await backendAPI.patch(`/notifications/${notification.id}/read`, null, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
      notification.read = true;
      unreadNotifications.value = Math.max(0, unreadNotifications.value - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  if (notification.link) {
    navigateTo(notification.link);
  }
  closeDropdowns();
};

const markAllAsRead = async () => {
  try {
    await backendAPI.patch("/notifications/mark-all-read", null, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    notifications.value.forEach((n) => (n.read = true));
    unreadNotifications.value = 0;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Logout function
const logout = async () => {
  if (loadingProfile.value) return;

  try {
    loadingProfile.value = true;
    await backendAPI.post("/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    authStore.logout();
    navigateTo("/login");
    loadingProfile.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchNotifications()]);
});
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  @apply w-2 h-2;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>
