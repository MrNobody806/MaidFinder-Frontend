<template>
  <section class="dark:bg-gray-900 min-h-screen dark:text-gray-100">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <!-- User Header with Actions -->
      <div
        class="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:px-6 flex justify-between items-center"
      >
        <div>
          <h3
            class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
          >
            Maid Profile Details
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage maid profile and verification status
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="printUserProfile"
            class="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center"
          >
            <Icon
              name="mdi:printer"
              class="h-5 w-5 mr-1 text-black dark:text-white"
            />
            Print Profile
          </button>
          <NuxtLink
            to="/mod/maidsprofilelist"
            class="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 flex items-center"
          >
            Back to List
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <Spinner class="mx-auto h-8 w-8 text-blue-500" />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Loading maid data...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 text-center">
        <ExclamationCircleIcon class="mx-auto h-8 w-8 text-red-500" />
        <p class="mt-2 text-sm text-red-500 dark:text-red-400">{{ error }}</p>
        <button
          @click="fetchMaidData(id)"
          class="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 text-sm"
        >
          Retry
        </button>
      </div>

      <!-- Maid Details -->
      <div v-else class="px-4 py-5 sm:p-6" id="userProfileContent">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div>
            <h4
              class="text-md font-semibold mb-4 border-b pb-2 dark:border-gray-700"
            >
              Basic Information
            </h4>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Full Name:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.first_name }}
                  {{ maidData.middle_name ? maidData.middle_name + " " : "" }}
                  {{ maidData.last_name }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Gender:
                </div>
                <div class="col-span-2 text-sm capitalize">
                  {{ maidData.gender || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Date of Birth:
                </div>
                <div class="col-span-2 text-sm">
                  {{ formatDate(maidData.date_of_birth) || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Phone 1:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.phone_number1 || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Phone 2:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.phone_number2 || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Religion:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.religion || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Address:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.address || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Registered:
                </div>
                <div class="col-span-2 text-sm">
                  {{ formatDate(maidData.created_at) }}
                </div>
              </div>
            </div>

            <!-- Professional Info -->
            <h4
              class="text-md font-semibold mb-4 border-b pb-2 dark:border-gray-700 mt-6"
            >
              Professional Information
            </h4>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Skill:
                </div>
                <div class="col-span-2 text-sm capitalize">
                  {{ maidData.skill || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Main Language:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.main_language || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Other Languages:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.other_language || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Job Time:
                </div>
                <div class="col-span-2 text-sm capitalize">
                  {{ maidData.job_time || "N/A" }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Expected Salary:
                </div>
                <div class="col-span-2 text-sm">
                  {{
                    maidData.expected_salary
                      ? `$${maidData.expected_salary}`
                      : "N/A"
                  }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Rating:
                </div>
                <div class="col-span-2 text-sm">
                  {{ maidData.rating || "Not rated yet" }}
                </div>
              </div>
            </div>
          </div>

          <!-- Account Status & Documents -->
          <div>
            <h4
              class="text-md font-semibold mb-4 border-b pb-2 dark:border-gray-700"
            >
              Account Status & Documents
            </h4>
            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-4 items-center">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Verification:
                </div>
                <div class="col-span-2">
                  <span
                    :class="verificationClass(maidData.verification_status)"
                  >
                    {{ maidData.verification_status }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Profile Image:
                </div>
                <div class="col-span-2">
                  <img
                    v-if="maidData.image_url"
                    :src="maidData.image_url"
                    alt="Profile Image"
                    class="h-24 w-24 rounded-full object-cover border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80"
                    @click="zoomImage = maidData.image_url"
                  />
                  <span v-else class="text-sm text-gray-500">No image</span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  ID Document:
                </div>
                <div class="col-span-2">
                  <a
                    v-if="maidData.identity_image_url"
                    href="#"
                    @click.prevent="zoomImage = maidData.identity_image_url"
                    class="text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
                  >
                    <Icon name="mdi:file-document" class="h-5 w-5 mr-1" />
                    View ID Document
                  </a>
                  <span v-else class="text-sm text-gray-500">No document</span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Criminal Clearance:
                </div>
                <div class="col-span-2">
                  <a
                    v-if="maidData.criminal_clearance_image_url"
                    href="#"
                    @click.prevent="
                      zoomImage = maidData.criminal_clearance_image_url
                    "
                    class="text-blue-600 dark:text-blue-400 hover:underline flex items-center cursor-pointer"
                  >
                    <Icon name="mdi:file-document" class="h-5 w-5 mr-1" />
                    View Clearance
                  </a>
                  <span v-else class="text-sm text-gray-500">No document</span>
                </div>
              </div>
            </div>

            <!-- Status Actions -->
            <div class="mt-6 flex flex-wrap gap-2">
              <button
                v-if="maidData.verification_status !== 'rejected'"
                @click="rejectMaid"
                class="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600 text-sm"
              >
                Reject
              </button>
              <button
                v-if="maidData.verification_status !== 'verified'"
                @click="verifyMaid"
                class="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600 text-sm"
              >
                Verify Maid
              </button>
            </div>

            <!-- Rejection Reason -->
            <div
              class="grid grid-cols-3 gap-4 mt-4"
              v-if="maidData.verification_status === 'rejected'"
            >
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rejection Reason:
              </div>
              <div class="col-span-2 text-sm">
                {{ maidData.rejection_reason || "Not specified" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Zoom Modal -->
    <div
      v-if="zoomImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click.self="zoomImage = null"
    >
      <div class="relative max-w-4xl max-h-screen">
        <button
          @click="zoomImage = null"
          class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 z-10"
        >
          <Icon name="mdi:close" class="h-6 w-6 text-gray-800" />
        </button>
        <img
          :src="zoomImage"
          alt="Zoomed Image"
          class="max-w-full max-h-screen object-contain"
        />
      </div>
    </div>

    <!-- Rejection Reason Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <h3 class="text-lg font-medium mb-4 dark:text-white">Reject Maid</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Please provide a reason for rejecting this maid:
        </p>
        <textarea
          v-model="rejectionReason"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          rows="3"
          placeholder="Enter rejection reason..."
        ></textarea>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showRejectModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            @click="confirmReject"
            :disabled="!rejectionReason.trim()"
            :class="{
              'opacity-50 cursor-not-allowed': !rejectionReason.trim(),
            }"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import backendApi from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const id = route.params.id;
const authStore = useAuthStore();

// Maid data state
const maidData = ref({});
const loading = ref(true);
const error = ref(null);
const zoomImage = ref(null);
const showRejectModal = ref(false);
const rejectionReason = ref("");

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Verification Class
const verificationClass = (status) => {
  if (!status)
    return "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";

  switch (status.toLowerCase()) {
    case "verified":
      return "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
    case "rejected":
      return "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100";
    case "pending":
      return "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100";
    default:
      return "inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

// Fetch maid data
const fetchMaidData = async (id) => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(`/maid-profile/${id}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    maidData.value = response.data;
  } catch (err) {
    console.error("Error fetching maid data:", err);
    error.value = "Failed to load maid data. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Verify Maid
const verifyMaid = async () => {
  try {
    await backendApi.patch(
      `/maid-profiles/${id}/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    maidData.value.verification_status = "verified";
    maidData.value.rejection_reason = null;
  } catch (err) {
    console.error("Error verifying maid:", err);
  }
};

// Reject Maid (shows modal)
const rejectMaid = () => {
  showRejectModal.value = true;
  rejectionReason.value = maidData.value.rejection_reason || "";
};

// Confirm Reject (with reason)
const confirmReject = async () => {
  try {
    await backendApi.patch(
      `/maid-profiles/${id}/reject`,
      {
        rejection_reason: rejectionReason.value.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    maidData.value.verification_status = "rejected";
    maidData.value.rejection_reason = rejectionReason.value.trim();
    showRejectModal.value = false;
  } catch (err) {
    console.error("Error rejecting maid:", err);
  }
};

// Print Maid Profile
const printUserProfile = () => {
  const printWindow = window.open("", "", "width=800,height=600");

  const content = document.getElementById("userProfileContent").innerHTML;

  printWindow.document.write(`
    <html>
      <head>
        <title>Maid Profile - ${maidData.value.first_name} ${
    maidData.value.last_name
  }</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 20px; }
          h2 { color: #444; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; }
          .grid { display: grid; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .gap-4 { gap: 1rem; }
          .text-sm { font-size: 0.875rem; }
          .font-medium { font-weight: 500; }
          .text-gray-500 { color: #6b7280; }
          .verification-verified {
            background-color: #d4edda;
            color: #155724;
          }
          .verification-unverified {
            background-color: #f8d7da;
            color: #721c24;
          }
          .verification-pending {
            background-color: #fff3cd;
            color: #856404;
          }
          .print-date {
            text-align: right;
            margin-bottom: 20px;
            font-size: 0.875rem;
            color: #6b7280;
          }
          img {
            max-width: 150px;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
        <h1>Maid Profile - ${maidData.value.first_name} ${
    maidData.value.last_name
  }</h1>
        ${content}
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

// Handle Escape key to close modals
const handleKeyDown = (e) => {
  if (e.key === "Escape") {
    if (zoomImage.value) {
      zoomImage.value = null;
    } else if (showRejectModal.value) {
      showRejectModal.value = false;
    }
  }
};

onMounted(() => {
  fetchMaidData(id);
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

definePageMeta({
  layout: "mod",
});
</script>
