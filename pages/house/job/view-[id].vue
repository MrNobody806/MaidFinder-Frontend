<template>
  <section
    class="mt-2 mx-auto max-w-7xl dark:bg-gray-900 min-h-screen dark:text-gray-100 p-4"
  >
    <!-- Back Button -->
    <button
      @click="$router.go(-1)"
      class="mb-4 flex items-center text-blue-600 dark:text-blue-400 hover:underline"
    >
      <Icon name="mdi:arrow-left" class="mr-1" /> Back to Jobs
    </button>

    <!-- Job Details Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div class="p-6">
        <div
          class="flex flex-col md:flex-row justify-between items-start gap-4"
        >
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                {{ job.job_title || "No title provided" }}
              </h1>
              <span
                class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium dark:bg-green-900 dark:text-green-200"
              >
                {{ job.status ? job.status.toUpperCase() : "UNKNOWN" }}
              </span>
            </div>

            <div class="flex items-center mt-2">
              <Icon
                name="mdi:map-marker-outline"
                class="text-gray-500 dark:text-gray-400 mr-1"
              />
              <span class="text-gray-600 dark:text-gray-300">
                {{ job.location || "Location not specified" }}
              </span>
            </div>

            <div class="mt-3">
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">Expected Start:</span>
                {{ formatDate(job.expected_start_date) || "Not specified" }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="printJobDetails"
              class="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center gap-1 text-sm"
            >
              <Icon name="mdi:printer" class="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <!-- Job Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <!-- Job Information -->
          <div
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center gap-2 mb-3">
              <Icon name="mdi:information-outline" class="text-blue-500" />
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">
                Job Information
              </h3>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Job Type:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ formatJobTime(job.job_time) || "Not specified" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Posted:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ formatDate(job.created_at) || "Not specified" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400"
                  >Maids Needed:</span
                >
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ job.num_of_maids || 0 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Salary & Benefits -->
          <div
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center gap-2 mb-3">
              <Icon name="mdi:cash-multiple" class="text-green-500" />
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">
                Salary & Benefits
              </h3>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400"
                  >Salary Range:</span
                >
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ formatSalary(job) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Benefits:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ job.benefit || "Not specified" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Requirements -->
          <div
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center gap-2 mb-3">
              <Icon name="mdi:clipboard-list-outline" class="text-purple-500" />
              <h3 class="font-semibold text-gray-700 dark:text-gray-300">
                Requirements
              </h3>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Skills:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ job.required_skills || "Not specified" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Language:</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ job.language_requirement || "Not specified" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400"
                  >Gender Preference:</span
                >
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ job.gender_preference || "Not specified" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400"
                  >Religion Preference:</span
                >
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ job.religion_preference || "Not specified" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Job Description -->
        <div class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <Icon name="mdi:text-box-outline" class="text-indigo-500" />
            <h3 class="font-semibold text-lg text-gray-700 dark:text-gray-300">
              Job Description
            </h3>
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <p class="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {{ job.job_description || "No description provided" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Accepted Offers Section -->
    <div
      v-if="acceptedMaids.length > 0"
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden border border-blue-200 dark:border-blue-800"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold flex items-center gap-2">
            <Icon name="mdi:check-decagram" class="text-blue-500" />
            Accepted Offers ({{ acceptedMaids.length }})
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ job.accepted_offers_count }} maid(s) have accepted offers
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="maid in acceptedMaids"
            :key="maid.id"
            class="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50/30 dark:bg-blue-900/20 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3 mb-3">
              <img
                :src="maid.image_url || 'https://via.placeholder.com/80'"
                alt="Maid profile"
                class="w-14 h-14 rounded-lg object-cover border-2 border-blue-500"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3
                    class="font-semibold text-gray-800 dark:text-white truncate"
                  >
                    {{ getFullName(maid) }}
                  </h3>
                  <span
                    v-if="maid.rating"
                    class="flex items-center text-yellow-500 text-sm"
                  >
                    <Icon name="mdi:star" class="h-4 w-4" />
                    {{ maid.rating.toFixed(1) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ maid.skill || "Not specified" }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ maid.years_of_experience || "0" }} years experience
                </p>
              </div>
            </div>

            <!-- Key Information Grid -->
            <div class="grid grid-cols-2 gap-3 text-sm mt-3">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p class="font-medium text-gray-800 dark:text-gray-200">
                  {{ maid.phone_number1 || "N/A" }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Language</p>
                <p class="font-medium text-gray-800 dark:text-gray-200">
                  {{ maid.main_language || "N/A" }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Nationality
                </p>
                <p class="font-medium text-gray-800 dark:text-gray-200">
                  {{ maid.nationality || "N/A" }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Religion</p>
                <p class="font-medium text-gray-800 dark:text-gray-200">
                  {{ maid.religion || "N/A" }}
                </p>
              </div>
            </div>

            <!-- Recent Review (if available) -->
            <div
              v-if="maid.recent_reviews?.length > 0"
              class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
            >
              <h4
                class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Recent Review
              </h4>
              <div class="flex items-center text-yellow-500 mb-1">
                <Icon
                  v-for="star in 5"
                  :key="star"
                  :name="
                    star <= maid.recent_reviews[0].rating
                      ? 'mdi:star'
                      : 'mdi:star-outline'
                  "
                  class="h-3 w-3"
                />
              </div>
              <p
                class="text-xs text-gray-600 dark:text-gray-300 italic truncate"
              >
                "{{ maid.recent_reviews[0].comment }}"
              </p>
            </div>

            <!-- Action Button -->
            <div class="mt-4 flex justify-center">
              <NuxtLink
                :to="`/house/job/${jobId}/agreement-from-offer/${
                  maid.invite_id
                }?maidId=${maid.id}&maidName=${getFullName(maid)}&maidImage=${
                  maid.image_url
                }`"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-sm flex items-center gap-1"
              >
                <Icon name="mdi:file-document-outline" class="h-4 w-4" />
                <span>Create Agreement</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Applicants Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div class="p-6">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
        >
          <div>
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <Icon name="mdi:account-group" class="text-blue-500" />
              Applicants ({{ applications.length }})
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ selectedApplications.length }} selected of
              {{ job.num_of_maids }} needed
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div class="relative flex-1">
              <select
                v-model="applicantStatusFilter"
                class="appearance-none w-full pl-3 pr-8 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-sm bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.5rem]"
              >
                <option value="all">All Applicants</option>
                <option value="pending">Pending</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
              <Icon
                name="mdi:chevron-down"
                class="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredApplications.length === 0" class="text-center py-8">
          <Icon
            name="mdi:account-question"
            class="mx-auto text-gray-400 h-12 w-12"
          />
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            No applicants found matching your criteria
          </p>
        </div>

        <!-- Applicants List -->
        <div v-else class="space-y-4">
          <div
            v-for="application in filteredApplications"
            :key="application.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow dark:border-gray-700"
            :class="{
              'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20':
                application.status === 'selected',
              'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20':
                application.status === 'rejected',
              'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800':
                application.status === 'pending',
            }"
          >
            <!-- Rating and Status Badge -->
            <div class="flex justify-between items-center mb-3">
              <div
                v-if="application.maid_profile?.rating"
                class="flex items-center text-yellow-500"
              >
                <Icon name="mdi:star" class="h-5 w-5" />
                <span class="ml-1 font-medium">{{
                  application.maid_profile.rating.toFixed(1)
                }}</span>
                <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({{ application.maid_profile.recent_reviews?.length || 0 }}
                  reviews)
                </span>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                    application.status === 'selected',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                    application.status === 'pending',
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                    application.status === 'rejected',
                }"
              >
                {{ application.status.toUpperCase() }}
              </span>
            </div>

            <!-- Maid Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Photo Column -->
              <div class="flex flex-col items-center">
                <img
                  :src="
                    application.maid_profile?.image_url ||
                    'https://via.placeholder.com/120'
                  "
                  alt="Maid profile"
                  class="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600 mb-2"
                />
                <button
                  v-if="application.status !== 'selected'"
                  @click="updateApplicationStatus(application.id, 'selected')"
                  class="w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  :disabled="
                    selectedApplications.length >= job.num_of_maids &&
                    application.status !== 'selected'
                  "
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      selectedApplications.length >= job.num_of_maids &&
                      application.status !== 'selected',
                  }"
                >
                  Select
                </button>
              </div>

              <!-- Basic Info Column -->
              <div>
                <h3
                  class="font-semibold text-lg text-gray-800 dark:text-white mb-1"
                >
                  {{ getFullName(application.maid_profile) }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {{ application.maid_profile?.skill || "Not specified" }}
                </p>
                <div class="space-y-1 text-sm">
                  <p class="flex items-center">
                    <Icon
                      name="mdi:account-outline"
                      class="mr-2 text-gray-500"
                    />
                    {{ application.maid_profile?.age || "N/A" }} years
                  </p>
                  <p class="flex items-center">
                    <Icon
                      name="mdi:gender-male-female"
                      class="mr-2 text-gray-500"
                    />
                    {{ application.maid_profile?.gender || "N/A" }}
                  </p>
                  <p class="flex items-center">
                    <Icon
                      name="mdi:map-marker-outline"
                      class="mr-2 text-gray-500"
                    />
                    {{ application.maid_profile?.address || "N/A" }}
                  </p>
                </div>
              </div>

              <!-- Contact Info Column -->
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ application.maid_profile?.phone_number1 || "N/A" }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Nationality
                  </p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ application.maid_profile?.nationality || "N/A" }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Religion
                  </p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ application.maid_profile?.religion || "N/A" }}
                  </p>
                </div>
              </div>

              <!-- Experience & Language Column -->
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Experience
                  </p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ application.maid_profile?.years_of_experience || "0" }}
                    years
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Languages
                  </p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ application.maid_profile?.main_language || "N/A" }}
                    <span v-if="application.maid_profile?.other_languages">
                      (+{{
                        application.maid_profile.other_languages.split(",")
                          .length
                      }}
                      more)
                    </span>
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Applied
                  </p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ formatDate(application.created_at) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Recent Reviews -->
            <div
              v-if="application.maid_profile?.recent_reviews?.length > 0"
              class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <h4
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Recent Reviews
              </h4>
              <div class="space-y-3">
                <div
                  v-for="(
                    review, index
                  ) in application.maid_profile.recent_reviews.slice(0, 2)"
                  :key="index"
                  class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <div class="flex items-center mb-1">
                    <div class="flex items-center text-yellow-500">
                      <Icon
                        v-for="star in 5"
                        :key="star"
                        :name="
                          star <= review.rating
                            ? 'mdi:star'
                            : 'mdi:star-outline'
                        "
                        class="h-4 w-4"
                      />
                    </div>
                    <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(review.created_at) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    "{{ review.comment }}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredApplications.length > 0 && pagination.total_pages > 1"
          class="flex flex-col md:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="mb-2 md:mb-0">
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Showing page {{ pagination.current_page }} of
              {{ pagination.total_pages }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="prevPage"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1"
            >
              <Icon name="mdi:chevron-left" class="h-4 w-4" />
              <span>Previous</span>
            </button>

            <template v-for="page in paginationButtons" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :disabled="page === pagination.current_page"
                :class="[
                  'px-3 py-1 border rounded-lg min-w-[2.5rem]',
                  page === pagination.current_page
                    ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600',
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="px-2 py-1 text-gray-500">
                {{ page }}
              </span>
            </template>

            <button
              @click="nextPage"
              :disabled="pagination.current_page === pagination.total_pages"
              class="px-3 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1"
            >
              <span>Next</span>
              <Icon name="mdi:chevron-right" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Maids Summary -->
    <div
      v-if="selectedApplications.length > 0"
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-green-200 dark:border-green-800"
    >
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold flex items-center gap-2">
            <Icon name="mdi:check-circle-outline" class="text-green-500" />
            Selected Maids ({{ selectedApplications.length }}/{{
              job.num_of_maids
            }})
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ job.num_of_maids - selectedApplications.length }} more needed
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="application in selectedApplications"
            :key="application.id"
            class="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50/30 dark:bg-green-900/20 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3 mb-3">
              <img
                :src="
                  application.maid_profile?.image_url ||
                  'https://via.placeholder.com/80'
                "
                alt="Maid profile"
                class="w-14 h-14 rounded-lg object-cover border-2 border-green-500"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3
                    class="font-semibold text-gray-800 dark:text-white truncate"
                  >
                    {{ getFullName(application.maid_profile) }}
                  </h3>
                  <span
                    v-if="application.maid_profile?.rating"
                    class="flex items-center text-yellow-500 text-sm"
                  >
                    <Icon name="mdi:star" class="h-4 w-4" />
                    {{ application.maid_profile.rating.toFixed(1) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ application.maid_profile?.skill || "Not specified" }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ application.maid_profile?.years_of_experience || "0" }}
                  years experience
                </p>
              </div>
            </div>

            <!-- Recent Review (if available) -->
            <div
              v-if="application.maid_profile?.recent_reviews?.length > 0"
              class="mb-3 pt-3 border-t border-gray-200 dark:border-gray-700"
            >
              <h4
                class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Recent Review
              </h4>
              <div class="flex items-center text-yellow-500 mb-1">
                <Icon
                  v-for="star in 5"
                  :key="star"
                  :name="
                    star <= application.maid_profile.recent_reviews[0].rating
                      ? 'mdi:star'
                      : 'mdi:star-outline'
                  "
                  class="h-3 w-3"
                />
              </div>
              <p
                class="text-xs text-gray-600 dark:text-gray-300 italic truncate"
              >
                "{{ application.maid_profile.recent_reviews[0].comment }}"
              </p>
            </div>

            <div class="flex flex-wrap gap-2 justify-center">
              <button
                @click="updateApplicationStatus(application.id, 'pending')"
                class="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-1"
              >
                <Icon name="mdi:close" class="h-4 w-4" />
                <span>Remove</span>
              </button>
              <NuxtLink
                :to="`/house/job/${jobId}/agree-${application.id}?maidId=${
                  application.maid_profile?.id
                }&maidName=${getFullName(application.maid_profile)}&maidImage=${
                  application.maid_profile?.image_url
                }`"
                class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
              >
                <Icon name="mdi:file-document-outline" class="h-4 w-4" />
                <span>Agreement</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import backendApi from "@/networkServices/api/backendApi";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const jobId = route.params.id;
const authStore = useAuthStore();

// State
const job = ref({
  job_title: "",
  location: "",
  job_time: "",
  num_of_maids: 0,
  salary_min: "",
  salary_max: "",
  benefit: "",
  required_skills: "",
  language_requirement: "",
  gender_preference: "",
  religion_preference: "",
  job_description: "",
  created_at: "",
  status: "open",
  expected_start_date: "",
  accepted_offers_count: 0,
});

const applications = ref([]);
const acceptedMaids = ref([]);
const loading = ref(true);
const error = ref(null);
const applicantStatusFilter = ref("all");
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_applications: 0,
});

// Computed properties
const filteredApplications = computed(() => {
  if (applicantStatusFilter.value === "all") {
    return applications.value;
  }
  return applications.value.filter(
    (app) => app.status === applicantStatusFilter.value
  );
});

const selectedApplications = computed(() => {
  return applications.value.filter((app) => app.status === "selected");
});

// Methods
const fetchJobDetails = async (page = 1) => {
  try {
    loading.value = true;
    error.value = null;
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(`/job/${jobId}/applications`, {
      params: { page },
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    // Update job data
    job.value = response.data.job || {};

    // Update applications data
    applications.value = response.data.applications || [];

    // Update accepted maids data with invite_id
    acceptedMaids.value = response.data.job_invitations
      .filter((invite) => invite.status === "accepted")
      .map((invite) => ({
        ...invite.maid_profile,
        invite_id: invite.invite_id,
        recent_reviews: invite.maid_profile?.recent_reviews || [],
      }));

    // Update pagination
    pagination.value = {
      current_page: response.data.pagination?.current_page || 1,
      total_pages: response.data.pagination?.total_pages || 1,
      total_applications: response.data.pagination?.total_applications || 0,
    };
  } catch (err) {
    error.value = "Failed to load job details";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting date:", e);
    return null;
  }
};

const formatJobTime = (jobTime) => {
  if (!jobTime) return null;
  return jobTime
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatSalary = (job) => {
  if (!job.salary_min && !job.salary_max) return "Negotiable";
  if (job.salary_min && job.salary_max) {
    return `ETB ${job.salary_min} - ${job.salary_max}`;
  }
  return `ETB ${job.salary_min || job.salary_max}`;
};

const getFullName = (profile) => {
  if (!profile) return "Unknown";
  return (
    `${profile.first_name || ""} ${
      profile.middle_name ? profile.middle_name + " " : ""
    }${profile.last_name || ""}`.trim() || "Unknown"
  );
};

const printJobDetails = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Job Details - ${job.value.job_title || "Untitled Job"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .print-header { margin-bottom: 20px; }
          .section { margin-bottom: 30px; }
          .applicant-status { padding: 2px 6px; border-radius: 12px; font-size: 12px; }
          .selected { background-color: #d4edda; color: #155724; }
          .pending { background-color: #fff3cd; color: #856404; }
          .rejected { background-color: #f8d7da; color: #721c24; }
          .accepted { background-color: #cce5ff; color: #004085; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${job.value.job_title || "No title provided"}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
          <h2>Job Details</h2>
          <table>
            <tr>
              <th width="30%">Location</th>
              <td>${job.value.location || "Location not specified"}</td>
            </tr>
            <tr>
              <th>Job Type</th>
              <td>${formatJobTime(job.value.job_time) || "Not specified"}</td>
            </tr>
            <tr>
              <th>Posted Date</th>
              <td>${formatDate(job.value.created_at) || "Not specified"}</td>
            </tr>
            <tr>
              <th>Expected Start Date</th>
              <td>${
                formatDate(job.value.expected_start_date) || "Not specified"
              }</td>
            </tr>
            <tr>
              <th>Maids Needed</th>
              <td>${job.value.num_of_maids || 0}</td>
            </tr>
            <tr>
              <th>Salary Range</th>
              <td>${formatSalary(job.value)}</td>
            </tr>
            <tr>
              <th>Skills Required</th>
              <td>${job.value.required_skills || "Not specified"}</td>
            </tr>
            <tr>
              <th>Gender Preference</th>
              <td>${job.value.gender_preference || "Not specified"}</td>
            </tr>
            <tr>
              <th>Religion Preference</th>
              <td>${job.value.religion_preference || "Not specified"}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>Job Description</h2>
          <p>${job.value.job_description || "No description provided"}</p>
        </div>

        ${
          acceptedMaids.value.length > 0
            ? `
        <div class="section">
          <h2>Accepted Offers (${acceptedMaids.value.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Language</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${acceptedMaids.value
                .map(
                  (maid) => `
                <tr>
                  <td>${getFullName(maid)}</td>
                  <td>${maid.phone_number1 || "N/A"}</td>
                  <td>${maid.skill || "Not specified"}</td>
                  <td>${maid.main_language || "Not specified"}</td>
                  <td class="text-center"><span class="applicant-status accepted">accepted</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : ""
        }

        <div class="section">
          <h2>Applicants (${applications.value.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
                <th>Language</th>
                <th>Phone</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${applications.value
                .map(
                  (app) => `
                <tr>
                  <td>${getFullName(app.maid_profile)}</td>
                  <td>${app.maid_profile?.skill || "Not specified"}</td>
                  <td>${app.maid_profile?.main_language || "Not specified"}</td>
                  <td>${app.maid_profile?.phone_number1 || "N/A"}</td>
                  <td>${formatDate(app.created_at) || "Not specified"}</td>
                  <td class="text-center"><span class="applicant-status ${
                    app.status
                  }">${app.status}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        ${
          selectedApplications.value.length > 0
            ? `
        <div class="section">
          <h2>Selected Maids (${selectedApplications.value.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Language</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${selectedApplications.value
                .map(
                  (app) => `
                <tr>
                  <td>${getFullName(app.maid_profile)}</td>
                  <td>${app.maid_profile?.phone_number1 || "N/A"}</td>
                  <td>${app.maid_profile?.skill || "Not specified"}</td>
                  <td>${app.maid_profile?.main_language || "Not specified"}</td>
                  <td class="text-center"><span class="applicant-status selected">selected</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : ""
        }
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

// Pagination methods
const prevPage = () => {
  if (pagination.value.current_page > 1) {
    pagination.value.current_page--;
    fetchJobDetails(pagination.value.current_page);
  }
};

const nextPage = () => {
  if (pagination.value.current_page < pagination.value.total_pages) {
    pagination.value.current_page++;
    fetchJobDetails(pagination.value.current_page);
  }
};

const goToPage = (page) => {
  if (
    page >= 1 &&
    page <= pagination.value.total_pages &&
    page !== pagination.value.current_page
  ) {
    pagination.value.current_page = page;
    fetchJobDetails(page);
  }
};

const paginationButtons = computed(() => {
  const buttons = [];
  const current = pagination.value.current_page;
  const total = pagination.value.total_pages;

  // Always show first page
  buttons.push(1);

  // Calculate window around current page
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  // Add ellipsis if needed before window
  if (start > 2) {
    buttons.push("...");
  }

  // Add window pages
  for (let i = start; i <= end; i++) {
    buttons.push(i);
  }

  // Add ellipsis if needed after window
  if (end < total - 1) {
    buttons.push("...");
  }

  // Add last page if different from first
  if (total > 1) {
    buttons.push(total);
  }

  return buttons;
});

// Application status update
const updateApplicationStatus = async (applicationId, status) => {
  try {
    // Check if we're trying to select when we've already reached the limit
    if (
      status === "selected" &&
      selectedApplications.value.length >= job.value.num_of_maids
    ) {
      alert(
        `You can only select ${job.value.num_of_maids} maid(s) for this job`
      );
      return;
    }

    await backendApi.put(
      `/job/${jobId}/select/${applicationId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    // Update local state
    const index = applications.value.findIndex(
      (app) => app.id === applicationId
    );
    if (index !== -1) {
      applications.value[index].status = status;
    }
  } catch (err) {
    console.error("Failed to update application status", err);
    alert("Failed to update application status. Please try again.");
  }
};

// Lifecycle
onMounted(() => {
  fetchJobDetails();
});

definePageMeta({
  layout: "house",
});
</script>

<style scoped>
/* Custom styles for dark mode */
.dark .bg-gray-50 {
  background-color: #374151;
}

/* Smooth transitions */
button,
select,
a {
  transition: all 0.2s ease;
}

/* Disabled button styles */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* Animation for status changes */
.status-change {
  transition: all 0.3s ease;
}

/* Hover effects for cards */
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dark .hover-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

/* Rating stars */
.rating-stars {
  display: inline-flex;
  align-items: center;
}

/* Truncate text with ellipsis */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .flex-col-mobile {
    flex-direction: column;
  }

  .text-center-mobile {
    text-align: center;
  }
}
</style>
