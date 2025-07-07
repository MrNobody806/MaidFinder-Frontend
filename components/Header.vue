<template>
  <header
    class="w-full bg-white/80 dark:bg-[#191A23]/80 backdrop-blur-md sticky left-0 right-0 top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50"
    :class="{ 'h-16': !isHydrating }"
  >
    <!-- Loading skeleton (shown during hydration) -->
    <div
      v-if="isHydrating"
      class="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 h-16 flex items-center justify-between"
    >
      <div class="flex items-center space-x-4">
        <!-- Logo skeleton -->
        <div
          class="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
        ></div>
      </div>
      <!-- Right side skeleton -->
      <div class="flex items-center space-x-4">
        <div
          class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
        ></div>
      </div>
    </div>

    <!-- Actual header content (shown after hydration) -->
    <div v-if="!isHydrating" class="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
      <!-- Mobile Top Bar -->
      <div class="md:hidden flex items-center justify-between h-16">
        <!-- Hamburger menu button (left side) -->
        <button
          @click="toggleMenu"
          type="button"
          class="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:text-[#90d43d] hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:outline-none transition-all duration-200"
          aria-controls="mobile-menu"
          :aria-expanded="isMenuOpen"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="h-6 w-6"
            :class="{ hidden: isMenuOpen, block: !isMenuOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            class="hidden h-6 w-6"
            :class="{ block: isMenuOpen, hidden: !isMenuOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Logo (centered on mobile) -->
        <NuxtLink
          to="/"
          class="text-lg font-bold text-gray-900 dark:text-white hover:text-[#90d43d] transition-colors duration-200 mx-auto"
          aria-label="Home"
          @click="closeAllDropdowns"
        >
          <span class="text-[#90d43d]">Maid</span>Finder
        </NuxtLink>

        <!-- Profile circle (right side) -->
        <div
          v-if="
            authStore.isAuthenticated &&
            authStore.user &&
            (authStore.user.role === 'maid' ||
              authStore.user.role === 'household')
          "
          class="relative"
        >
          <button
            @click.stop="toggleProfileDropdown"
            class="flex items-center max-w-xs text-sm rounded-full focus:outline-none transition-all duration-200 hover:scale-105"
            id="mobile-user-menu"
            :aria-expanded="showProfileDropdown"
            aria-controls="mobile-user-dropdown"
          >
            <span class="sr-only">Open user menu</span>
            <div
              class="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-[#90d43d] to-green-500 ring-2 ring-[#90d43d] dark:ring-green-500"
            >
              <NuxtImg
                v-if="authStore.user.image_url"
                :src="authStore.user.image_url"
                class="w-full h-full object-cover"
                :alt="authStore.user.name || 'User avatar'"
                width="32"
                height="32"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
              >
                {{ authStore.user.name?.charAt(0)?.toUpperCase() || "U" }}
              </div>
            </div>
          </button>

          <!-- Profile dropdown (mobile) -->
          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="transform opacity-0 -translate-y-1"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-1"
          >
            <div
              v-show="showProfileDropdown"
              id="mobile-user-dropdown"
              ref="profileDropdownRef"
              class="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-1 bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none z-10"
              role="menu"
            >
              <div
                class="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50"
              >
                <p
                  class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                >
                  {{ authStore.user.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {{ authStore.user.email }}
                </p>
              </div>

              <NuxtLink
                :to="`/setting/profile-${authStore.user.id}`"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                @click="closeAllDropdowns"
                active-class="bg-gray-100 dark:bg-gray-700"
                exact-active-class="bg-gray-100 dark:bg-gray-700"
                aria-label="Profile"
              >
                Profile
              </NuxtLink>

              <NuxtLink
                :to="`/setting/${authStore.user.id}`"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                @click="closeAllDropdowns"
                active-class="bg-gray-100 dark:bg-gray-700"
                exact-active-class="bg-gray-100 dark:bg-gray-700"
                aria-label="Settings"
              >
                Settings
              </NuxtLink>

              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </div>
          </transition>
        </div>

        <!-- Login button for guests (mobile) -->
        <NuxtLink
          v-else
          to="/login"
          class="text-gray-700 dark:text-[#F3F3F3] hover:text-[#90d43d] px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg whitespace-nowrap"
          aria-label="Log in"
          @click="isMenuOpen = false"
        >
          Log In
        </NuxtLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink
            to="/"
            class="text-lg font-bold text-gray-900 dark:text-white hover:text-[#90d43d] transition-colors duration-200"
            aria-label="Home"
          >
            <span class="text-[#90d43d]">Maid</span>Finder
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center justify-between flex-1 mx-6">
          <nav class="flex space-x-1">
            <template v-for="link in mainNavigationLinks" :key="link.to">
              <!-- Regular Links -->
              <NuxtLink
                v-if="!link.children"
                :to="link.to"
                class="text-gray-700 dark:text-gray-300 hover:text-[#90d43d] px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap"
                active-class="text-[#90d43d] font-semibold"
                exact-active-class="text-[#90d43d] font-semibold"
                :aria-label="link.text"
              >
                {{ link.text }}
              </NuxtLink>

              <!-- Dropdown Links -->
              <div v-else class="relative group" :key="`dropdown-${link.to}`">
                <button
                  @mouseenter="activeDropdown = link.to"
                  @click="toggleDropdown(link.to)"
                  class="text-gray-700 dark:text-gray-300 hover:text-[#90d43d] px-3 py-2 text-sm font-medium flex items-center transition-all duration-200 hover:scale-105 whitespace-nowrap"
                  :aria-expanded="activeDropdown === link.to"
                  :aria-controls="`dropdown-${link.to}`"
                >
                  {{ link.text }}
                  <svg
                    class="w-4 h-4 ml-1 transition-transform duration-200"
                    :class="{ 'rotate-180': activeDropdown === link.to }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                <!-- Dropdown menu -->
                <transition
                  enter-active-class="transition ease-out duration-150"
                  enter-from-class="transform opacity-0 -translate-y-1"
                  enter-to-class="transform opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="transform opacity-100 translate-y-0"
                  leave-to-class="transform opacity-0 -translate-y-1"
                >
                  <div
                    v-show="activeDropdown === link.to"
                    :id="`dropdown-${link.to}`"
                    @mouseleave="activeDropdown = null"
                    class="origin-top-right absolute left-0 mt-2 w-48 rounded-lg shadow-xl py-1 bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none z-10"
                    role="menu"
                  >
                    <NuxtLink
                      v-for="child in link.children"
                      :key="child.to"
                      :to="child.to"
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      @click="activeDropdown = null"
                      active-class="bg-gray-100 dark:bg-gray-700"
                      exact-active-class="bg-gray-100 dark:bg-gray-700"
                      :aria-label="child.text"
                    >
                      {{ child.text }}
                    </NuxtLink>
                  </div>
                </transition>
              </div>
            </template>
          </nav>

          <!-- Right side icons -->
          <div class="flex items-center space-x-2">
            <!-- Notification -->
            <button
              v-if="
                authStore.isAuthenticated &&
                (authStore.user?.role === 'maid' ||
                  authStore.user?.role === 'household')
              "
              class="p-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:text-[#90d43d] hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:outline-none transition-all duration-200"
              aria-label="Notifications"
            >
              <span class="sr-only">View notifications</span>
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <LanguageSwitcher class="hidden sm:block" />
            <DarkModeToggle class="hidden sm:block" />

            <!-- Profile dropdown -->
            <div
              v-if="
                authStore.isAuthenticated &&
                (authStore.user.role === 'maid' ||
                  authStore.user.role === 'household')
              "
              class="relative ml-2"
            >
              <div>
                <button
                  @mouseenter="showProfileDropdown = true"
                  @click="toggleProfileDropdown"
                  class="flex items-center max-w-xs text-sm rounded-full focus:outline-none transition-all duration-200 hover:scale-105"
                  id="user-menu"
                  :aria-expanded="showProfileDropdown"
                  aria-controls="user-dropdown"
                >
                  <span class="sr-only">Open user menu</span>
                  <div
                    class="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-[#90d43d] to-green-500 ring-2 ring-[#90d43d] dark:ring-green-500"
                  >
                    <NuxtImg
                      v-if="authStore.user.image_url"
                      :src="authStore.user.image_url"
                      class="w-full h-full object-cover"
                      :alt="authStore.user.name || 'User avatar'"
                      width="32"
                      height="32"
                      loading="lazy"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {{ authStore.user.name?.charAt(0)?.toUpperCase() || "U" }}
                    </div>
                  </div>
                </button>
              </div>

              <!-- Dropdown menu -->
              <transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="transform opacity-0 -translate-y-1"
                enter-to-class="transform opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="transform opacity-100 translate-y-0"
                leave-to-class="transform opacity-0 -translate-y-1"
              >
                <div
                  v-show="showProfileDropdown"
                  id="user-dropdown"
                  @mouseleave="showProfileDropdown = false"
                  class="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-1 bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none z-10"
                  role="menu"
                >
                  <div
                    class="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50"
                  >
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                    >
                      {{ authStore.user.name }}
                    </p>
                    <p
                      class="text-xs text-gray-500 dark:text-gray-400 truncate"
                    >
                      {{ authStore.user.email }}
                    </p>
                  </div>

                  <NuxtLink
                    :to="`/setting/profile-${authStore.user.id}`"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    @click="closeAllDropdowns"
                    active-class="bg-gray-100 dark:bg-gray-700"
                    exact-active-class="bg-gray-100 dark:bg-gray-700"
                    aria-label="Profile"
                  >
                    Profile
                  </NuxtLink>

                  <NuxtLink
                    :to="`/setting/${authStore.user.id}`"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    @click="closeAllDropdowns"
                    active-class="bg-gray-100 dark:bg-gray-700"
                    exact-active-class="bg-gray-100 dark:bg-gray-700"
                    aria-label="Settings"
                  >
                    Settings
                  </NuxtLink>

                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    aria-label="Sign out"
                  >
                    Sign out
                  </button>
                </div>
              </transition>
            </div>

            <!-- Login button for guests -->
            <NuxtLink
              v-else
              to="/login"
              class="text-gray-700 dark:text-[#F3F3F3] hover:text-[#90d43d] px-3 py-1.5 text-sm transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg whitespace-nowrap"
              aria-label="Log in"
            >
              Log In
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div
        v-show="isMenuOpen"
        id="mobile-menu"
        class="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 overflow-y-auto max-h-[calc(100vh-4rem)]"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Mobile Navigation Links -->
          <template v-for="link in mainNavigationLinks" :key="link.to">
            <!-- Regular Mobile Links -->
            <NuxtLink
              v-if="!link.children"
              :to="link.to"
              class="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#90d43d] hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
              @click="closeAllDropdowns"
              active-class="text-[#90d43d] font-semibold bg-gray-100/50 dark:bg-gray-700/50"
              exact-active-class="text-[#90d43d] font-semibold bg-gray-100/50 dark:bg-gray-700/50"
              :aria-label="link.text"
            >
              {{ link.text }}
            </NuxtLink>

            <!-- Mobile Dropdown Links - Right-aligned -->
            <div v-else class="relative" :key="`mobile-dropdown-${link.to}`">
              <button
                @click="toggleMobileDropdown(link.to)"
                class="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#90d43d] hover:bg-gray-100/50 dark:hover:bg-gray-700/50 flex justify-between items-center transition-all duration-200"
                :aria-expanded="activeMobileDropdown === link.to"
                :aria-controls="`mobile-dropdown-${link.to}`"
              >
                {{ link.text }}
                <svg
                  class="w-4 h-4 ml-1 transform transition-transform duration-200"
                  :class="{ 'rotate-180': activeMobileDropdown === link.to }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              <transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="transform opacity-0 -translate-y-1"
                enter-to-class="transform opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="transform opacity-100 translate-y-0"
                leave-to-class="transform opacity-0 -translate-y-1"
              >
                <div
                  v-show="activeMobileDropdown === link.to"
                  :id="`mobile-dropdown-${link.to}`"
                  class="pl-4 pr-2 space-y-1"
                >
                  <NuxtLink
                    v-for="child in link.children"
                    :key="child.to"
                    :to="child.to"
                    class="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#90d43d] hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 text-right"
                    @click="closeAllDropdowns"
                    active-class="text-[#90d43d] font-semibold bg-gray-100/50 dark:bg-gray-700/50"
                    exact-active-class="text-[#90d43d] font-semibold bg-gray-100/50 dark:bg-gray-700/50"
                    :aria-label="child.text"
                  >
                    {{ child.text }}
                  </NuxtLink>
                </div>
              </transition>
            </div>
          </template>
        </div>

        <!-- Mobile Language and Dark Mode -->
        <div
          class="px-4 py-3 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center"
        >
          <LanguageSwitcher class="flex-1" />
          <DarkModeToggle class="flex-1 text-right" />
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth";
import { navigateTo } from "#imports";

const authStore = useAuthStore();

// State
const isMenuOpen = ref(false);
const showProfileDropdown = ref(false);
const activeDropdown = ref(null);
const activeMobileDropdown = ref(null);
const isHydrating = ref(true);
const profileDropdownRef = ref(null);

// Computed
const mainNavigationLinks = computed(() => {
  if (!authStore.isAuthenticated) {
    return [
      { to: "/", text: "Home" },
      { to: "/about", text: "About Us" },
      { to: "/services", text: "Services" },
      { to: "/maids", text: "Find Maids" },
      { to: "/jobs", text: "Find Jobs" },
    ];
  }

  if (authStore.user?.role === "maid") {
    return [
      { to: "/", text: "Home" },
      { to: "/about", text: "About Us" },
      { to: "/services", text: "Services" },
      { to: "/jobs/job", text: "Find Jobs" },
      { to: "/maids/agreements", text: "Agreements" },
      {
        text: "Job",
        children: [
          { to: "/maids/applications", text: "Applications" },
          { to: "/maids/joboffers", text: "Offers" },
        ],
      },
    ];
  }

  if (authStore.user?.role === "household") {
    return [
      { to: "/", text: "Home" },
      { to: "/about", text: "About Us" },
      { to: "/services", text: "Services" },
      { to: "/maids/maidslist", text: "Find Maids" },
      {
        to: "/jobs",
        text: "Jobs",
        children: [
          { to: "/house/job/create", text: "Post a Job" },
          { to: "/house", text: "My Job Posts" },
        ],
      },
      { to: "/house/job/agreements", text: "Agreements" },
      { to: "/house/job/applicationlist", text: "Applications" },
    ];
  }
});

// Lifecycle hooks
onMounted(async () => {
  try {
    await authStore.hydrate();
    if (authStore.isAuthenticated && !authStore.user) {
      await authStore.fetchUser();
    }
  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    isHydrating.value = false;
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove("overflow-hidden");
});

// Methods
const closeAllDropdowns = () => {
  isMenuOpen.value = false;
  showProfileDropdown.value = false;
  activeDropdown.value = null;
  activeMobileDropdown.value = null;
  document.body.classList.remove("overflow-hidden");
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    showProfileDropdown.value = false;
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
    activeMobileDropdown.value = null;
  }
};

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
  if (showProfileDropdown.value) {
    isMenuOpen.value = false;
    document.body.classList.remove("overflow-hidden");
  }
};

const toggleDropdown = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

const toggleMobileDropdown = (dropdown) => {
  activeMobileDropdown.value =
    activeMobileDropdown.value === dropdown ? null : dropdown;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    await navigateTo("/");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    closeAllDropdowns();
  }
};

// Click outside handler for profile dropdown
const handleClickOutside = (event) => {
  if (
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(event.target)
  ) {
    showProfileDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style>
/* Smooth transitions for dropdowns */
.origin-top-right {
  transform-origin: top right;
}

/* Backdrop blur for modern glass effect */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* Gradient border for avatar */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Ensure smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Improved mobile menu transition */
#mobile-menu {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

#mobile-menu::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Better focus states for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #90d43d;
  outline-offset: 2px;
}

/* Right-aligned dropdown items */
.text-right {
  text-align: right;
}

/* Loading skeleton animation */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
