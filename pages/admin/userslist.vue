<template>
  <section class="min-h-screen ml-0 bg-gray-100 dark:bg-gray-900 ml-2 mt-2">
    <!-- Filters Section -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
          <button
            v-if="selectedUsers.length > 0"
            @click="bulkActionsDropdown = !bulkActionsDropdown"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center relative"
          >
            <Icon name="mdi:dots-horizontal" class="h-5 w-5 mr-1" />
            Actions
            <div
              v-if="bulkActionsDropdown"
              class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10"
            >
              <button
                @click="deleteSelectedUsers"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
              >
                Delete Selected
              </button>
              <button
                @click="exportSelectedUsers"
                class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-blue-400"
              >
                Export Selected
              </button>
            </div>
          </button>
          <button
            @click="printUserList"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
            :disabled="loading"
          >
            <Icon
              name="mdi:printer"
              class="h-5 w-5 mr-1 text-black dark:text-white"
            />
            Print List
          </button>
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row md:space-y-0 md:space-x-4 space-y-4"
      >
        <!-- Search Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Search</label
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :disabled="loading"
            @input="handleSearchInput"
          />
        </div>

        <!-- Role Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Role</label
          >
          <select
            v-model="roleFilter"
            class="mt-1 p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :disabled="loading"
          >
            <option value="">All Roles</option>
            <option value="1">Admin</option>
            <option value="2">Household</option>
            <option value="3">Maid</option>
            <option value="4">Employee</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="flex-1">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Registration Date (Range)</label
          >
          <div
            class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
          >
            <input
              type="date"
              v-model="startDate"
              class="mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full"
              :disabled="loading"
            />
            <input
              type="date"
              v-model="endDate"
              class="mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 w-full"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 w-full md:w-auto"
            :disabled="loading"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"
      ></div>
      <p class="text-gray-500 dark:text-gray-400">Loading users...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <Icon
        name="mdi:alert-circle"
        class="h-12 w-12 text-red-500 mx-auto mb-2"
      />
      <p class="text-red-500 dark:text-red-400 mb-2">Failed to load users</p>
      <button
        @click="fetchUsers"
        class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Users Table -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow mb-6 overflow-x-auto"
    >
      <table class="w-full min-w-[1000px]" id="userListTable">
        <thead>
          <tr class="border-b dark:border-gray-700">
            <th class="text-left p-2 w-8">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
                class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </th>
            <th class="text-left p-2 cursor-pointer" @click="sortBy('name')">
              <div class="flex items-center">
                Name
                <Icon
                  v-if="sortColumn === 'name'"
                  :name="
                    sortDirection === 'asc'
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
                  class="ml-1"
                />
              </div>
            </th>
            <th class="text-left p-2 cursor-pointer" @click="sortBy('email')">
              <div class="flex items-center">
                Email
                <Icon
                  v-if="sortColumn === 'email'"
                  :name="
                    sortDirection === 'asc'
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
                  class="ml-1"
                />
              </div>
            </th>
            <th
              class="text-left p-2 cursor-pointer"
              @click="sortBy('role_name')"
            >
              <div class="flex items-center">
                Role
                <Icon
                  v-if="sortColumn === 'role_name'"
                  :name="
                    sortDirection === 'asc'
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
                  class="ml-1"
                />
              </div>
            </th>
            <th
              class="text-left p-2 cursor-pointer"
              @click="sortBy('created_at')"
            >
              <div class="flex items-center">
                Registered
                <Icon
                  v-if="sortColumn === 'created_at'"
                  :name="
                    sortDirection === 'asc'
                      ? 'mdi:chevron-up'
                      : 'mdi:chevron-down'
                  "
                  class="ml-1"
                />
              </div>
            </th>
            <th class="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users.data"
            :key="user.id"
            class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="p-2">
              <input
                type="checkbox"
                v-model="selectedUsers"
                :value="user.id"
                class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </td>
            <td class="p-2">{{ user.name }}</td>
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">
              <span :class="roleClass(user.role)">
                {{ user.role_name }}
              </span>
            </td>
            <td class="p-2">{{ formatDate(user.created_at) }}</td>
            <td class="p-2 space-x-2 whitespace-nowrap">
              <div class="relative inline-block">
                <button
                  @click="toggleUserActions(user.id)"
                  class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Icon name="mdi:dots-vertical" class="h-5 w-5" />
                </button>
                <div
                  v-if="activeUserActions === user.id"
                  class="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
                >
                  <NuxtLink
                    :to="`/mod/users/edit/${user.id}`"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    @click="viewUserDetails(user.id)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    View
                  </button>
                  <button
                    @click="confirmDeleteUser(user)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="users.data.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">
          No users found matching your criteria
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="users.data.length > 0"
        class="flex flex-col md:flex-row items-center justify-between mt-4"
      >
        <div class="mb-2 md:mb-0">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ users.from }} to {{ users.to }} of
            {{ users.total }} entries
          </span>
        </div>
        <div class="flex space-x-1">
          <button
            @click="prevPage"
            :disabled="users.current_page === 1"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            v-for="(page, index) in paginationButtons"
            :key="index"
            @click="goToPage(page)"
            :disabled="page === users.current_page"
            :class="[
              'px-3 py-1 border rounded-lg',
              page === users.current_page
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="nextPage"
            :disabled="users.current_page === users.last_page"
            class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="mt-2 md:mt-0">
          <select
            v-model="perPage"
            class="p-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            @change="fetchUsers(1)"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Confirm Deletion</h3>
          <button
            @click="showDeleteModal = false"
            class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Icon name="mdi:close" class="h-6 w-6" />
          </button>
        </div>
        <p class="mb-6">
          Are you sure you want to delete
          {{
            deleteUserCount === 1
              ? "this user"
              : `these ${deleteUserCount} users`
          }}? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="executeDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { debounce } from "lodash";
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";
const router = useRouter();

// State
const loading = ref(true);
const error = ref(null);
const users = ref({
  data: [],
  current_page: 1,
  from: 0,
  to: 0,
  total: 0,
  last_page: 1,
  per_page: 10,
});

const authStore = useAuthStore();

// Filters
const startDate = ref("");
const endDate = ref("");
const roleFilter = ref("");
const searchQuery = ref("");
const perPage = ref(10);

// Sorting
const sortColumn = ref("created_at");
const sortDirection = ref("desc");

// User selection
const selectedUsers = ref([]);
const selectAll = ref(false);

// Actions dropdown
const activeUserActions = ref(null);
const bulkActionsDropdown = ref(false);

// Delete modal
const showDeleteModal = ref(false);
const userToDelete = ref(null);
const deleteUserCount = ref(1);

// Debounced search function
const debouncedSearch = debounce(() => {
  fetchUsers(1);
}, 500);

// Handle search input with debounce
const handleSearchInput = () => {
  debouncedSearch();
};

// Fetch users from API
const fetchUsers = async (page = 1) => {
  try {
    loading.value = true;
    error.value = null;
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const params = {
      page,
      per_page: perPage.value,
    };

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }
    if (roleFilter.value) {
      params.role = roleFilter.value;
    }
    if (startDate.value) {
      params.start_date = startDate.value;
    }
    if (endDate.value) {
      params.end_date = endDate.value;
    }
    if (sortColumn.value) {
      params.sort_by = sortColumn.value;
      params.sort_direction = sortDirection.value;
    }

    const response = await backendApi.get("/reports/users", {
      params,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    users.value = {
      data: response.data.users || [],
      current_page: response.data.pagination.current_page || 1,
      from: (response.data.pagination.current_page - 1) * perPage.value + 1,
      to: Math.min(
        response.data.pagination.current_page * perPage.value,
        response.data.pagination.total_users
      ),
      total: response.data.pagination.total_users || 0,
      last_page: response.data.pagination.total_pages || 1,
      per_page: perPage.value,
    };
  } catch (err) {
    console.error("Error fetching users:", err);
    error.value = "Failed to load users. Please try again later.";
  } finally {
    loading.value = false;
    selectAll.value = false;
  }
};

const viewUserDetails = (userId) => {
  router.push(`/mod/users/${userId}`);
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Role Class
const roleClass = (role) => {
  switch (role) {
    case 1: // Admin
      return "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs dark:bg-purple-700 dark:text-purple-100";
    case 2: // Household
      return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs dark:bg-blue-700 dark:text-blue-100";
    case 3: // Maid
      return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs dark:bg-green-700 dark:text-green-100";
    case 4: // Unknown
    default:
      return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs dark:bg-gray-700 dark:text-gray-100";
  }
};

// Navigation methods
const prevPage = () => {
  if (users.value.current_page > 1) {
    fetchUsers(users.value.current_page - 1);
  }
};

const nextPage = () => {
  if (users.value.current_page < users.value.last_page) {
    fetchUsers(users.value.current_page + 1);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= users.value.last_page) {
    fetchUsers(page);
  }
};

// Pagination buttons
const paginationButtons = computed(() => {
  const buttons = [];
  const totalPages = users.value.last_page;
  const currentPage = users.value.current_page;

  // Always show first page
  buttons.push(1);

  // Show pages around current page
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    if (!buttons.includes(i)) {
      buttons.push(i);
    }
  }

  // Always show last page
  if (totalPages > 1 && !buttons.includes(totalPages)) {
    buttons.push(totalPages);
  }

  return buttons;
});

// Clear Filters
const clearFilters = () => {
  startDate.value = "";
  endDate.value = "";
  roleFilter.value = "";
  searchQuery.value = "";
  fetchUsers(1);
};

// Sort by column
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
  fetchUsers(users.value.current_page);
};

// Toggle user actions dropdown
const toggleUserActions = (userId) => {
  activeUserActions.value = activeUserActions.value === userId ? null : userId;
};

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative.inline-block")) {
    activeUserActions.value = null;
  }
  if (!event.target.closest(".relative")) {
    bulkActionsDropdown.value = false;
  }
};

// Toggle select all users
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = users.value.data.map((user) => user.id);
  } else {
    selectedUsers.value = [];
  }
};

// Watch for changes in selected users
watch(selectedUsers, (newVal) => {
  selectAll.value =
    newVal.length === users.value.data.length && users.value.data.length > 0;
});

// Bulk actions
const deleteSelectedUsers = () => {
  if (selectedUsers.value.length === 0) return;
  userToDelete.value = null;
  deleteUserCount.value = selectedUsers.value.length;
  showDeleteModal.value = true;
};

const exportSelectedUsers = () => {
  if (selectedUsers.value.length === 0) return;
  console.log("Exporting users:", selectedUsers.value);
  // Implement export functionality here
};

// Single user delete
const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  selectedUsers.value = [user.id];
  deleteUserCount.value = 1;
  showDeleteModal.value = true;
};

// Execute delete
const executeDelete = async () => {
  try {
    loading.value = true;
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    if (userToDelete.value) {
      // Single user delete
      await backendApi.delete(`/users/${userToDelete.value.id}`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });
    } else if (selectedUsers.value.length > 0) {
      // Bulk delete
      await backendApi.post(
        "/users/bulk-delete",
        {
          user_ids: selectedUsers.value,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
        }
      );
    }

    showDeleteModal.value = false;
    fetchUsers(users.value.current_page);
    selectedUsers.value = [];
  } catch (err) {
    console.error("Error deleting users:", err);
    error.value = "Failed to delete users. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Print User List
const printUserList = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Users Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .role-admin { background-color: #e9d8fd; color: #553c9a; }
          .role-household { background-color: #bee3f8; color: #2b6cb0; }
          .role-maid { background-color: #c6f6d5; color: #276749; }
          .role-unknown { background-color: #e2e8f0; color: #4a5568; }
          .print-date { text-align: right; margin-bottom: 20px; }
          .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .print-filters { margin-bottom: 20px; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1>Users Report</h1>
            <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          </div>
        </div>

        <div class="print-filters">
          <strong>Filters Applied:</strong><br>
          ${
            roleFilter.value ? `Role: ${getRoleName(roleFilter.value)}<br>` : ""
          }
          ${
            startDate.value || endDate.value
              ? `Date Range: ${startDate.value} to ${endDate.value}<br>`
              : ""
          }
          ${searchQuery.value ? `Search: "${searchQuery.value}"` : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            ${users.value.data
              .map(
                (user) => `
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td class="role-${getRoleClass(user.role)}">
                  ${user.role_name}
                </td>
                <td>${formatDate(user.created_at)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// Helper functions for printing
const getRoleName = (roleId) => {
  switch (roleId) {
    case "1":
      return "Admin";
    case "2":
      return "Household";
    case "3":
      return "Maid";
    case "4":
      return "Unknown";
    default:
      return "Unknown";
  }
};

const getRoleClass = (roleId) => {
  switch (roleId) {
    case 1:
      return "admin";
    case 2:
      return "household";
    case 3:
      return "maid";
    case 4:
    default:
      return "unknown";
  }
};

// Watchers for filters that should trigger API calls
watch([roleFilter, startDate, endDate, perPage], () => {
  fetchUsers(1);
});

watch([sortColumn, sortDirection], () => {
  fetchUsers(users.value.current_page);
});

// Initialize
onMounted(() => {
  fetchUsers();
  document.addEventListener("click", handleClickOutside);
});

// Cleanup
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

definePageMeta({
  layout: "admin",
});
</script>
