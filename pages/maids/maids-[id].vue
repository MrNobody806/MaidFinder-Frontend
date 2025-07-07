<template>
  <section class="py-8 bg-gray-50 dark:bg-gray-900">
    <!-- Already Invited Modal -->
    <div
      v-if="showAlreadyInvitedModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4"
          >
            <Icon
              name="mdi:information-outline"
              class="text-blue-600 dark:text-blue-400 text-2xl"
            />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Already Invited
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            This maid has already been invited/selected to apply for this job.
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="showAlreadyInvitedModal = false"
              class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button
              @click="viewHireRequests"
              class="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium border border-gray-300 dark:border-gray-600"
            >
              View Requests
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4"
          >
            <Icon
              name="mdi:check"
              class="text-green-600 dark:text-green-400 text-2xl"
            />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Hire Request Sent!
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Your request to hire this maid has been successfully submitted.
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="showSuccessModal = false"
              class="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button
              @click="viewHireRequests"
              class="px-6 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium border border-gray-300 dark:border-gray-600"
            >
              View Requests
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Selection Modal -->
    <div
      v-if="showJobSelectionModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div class="text-center mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Select a Job to Hire For
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Choose which open job you want to hire this maid for
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="job in householdJobs"
            :key="job.id"
            @click="selectedJobId = job.id"
            class="p-4 border rounded-lg cursor-pointer transition-colors"
            :class="{
              'border-lime-500 bg-lime-50 dark:bg-lime-900/20':
                selectedJobId === job.id,
              'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700':
                selectedJobId !== job.id,
            }"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {{ job.job_title }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {{ job.job_description }}
                </p>
              </div>
              <span
                class="px-2 py-1 text-xs rounded-full capitalize"
                :class="{
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400':
                    job.job_time === 'full time',
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400':
                    job.job_time === 'part time',
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400':
                    job.job_time === 'one time',
                }"
              >
                {{ job.job_time }}
              </span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Location:</span>
                <span class="ml-2 text-gray-700 dark:text-gray-300">
                  {{ job.location }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Salary:</span>
                <span class="ml-2 text-gray-700 dark:text-gray-300">
                  {{ formatCurrency(job.salary_min) }} -
                  {{ formatCurrency(job.salary_max) }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400"
                  >Start Date:</span
                >
                <span class="ml-2 text-gray-700 dark:text-gray-300">
                  {{ formatDate(job.expected_start_date) }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400"
                  >Maids Needed:</span
                >
                <span class="ml-2 text-gray-700 dark:text-gray-300">
                  {{ job.num_of_maids }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="householdJobs.length === 0" class="py-8 text-center">
            <div class="mx-auto max-w-xs text-center">
              <Icon
                name="mdi:briefcase-off-outline"
                class="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3"
              />
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-1"
              >
                No open jobs found
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                You need to create a job posting first before hiring.
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button
            @click="showJobSelectionModal = false"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="confirmHireSelection"
            :disabled="!selectedJobId || applying"
            class="px-6 py-2 rounded-lg transition-colors font-medium"
            :class="{
              'bg-lime-500 hover:bg-lime-600 text-white':
                selectedJobId && !applying,
              'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed':
                !selectedJobId || applying,
            }"
          >
            <span v-if="applying">Sending Request...</span>
            <span v-else>Confirm Hire</span>
            <Icon
              v-if="applying"
              name="mdi:loading"
              class="animate-spin text-lg ml-2"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Back Button - Modern Floating Style -->
      <button
        @click="$router.push('/maids/maidslist')"
        class="mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
      >
        <Icon name="mdi:chevron-left" class="text-lg" />
        <span>Back to Maids</span>
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center gap-3">
          <div
            class="w-5 h-5 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-gray-600 dark:text-gray-300">
            Loading maid details...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div
          class="max-w-md mx-auto p-4 bg-red-50 dark:bg-red-900/20 rounded-xl"
        >
          <p class="text-red-500 dark:text-red-400 mb-4">{{ error }}</p>
          <button
            @click="fetchMaidDetails"
            class="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-6">
        <!-- Maid Header Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div class="p-6 md:p-8">
            <div
              class="flex flex-col md:flex-row md:items-start md:justify-between gap-6"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400':
                        maid.verification_status === 'verified',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400':
                        maid.verification_status === 'pending',
                      'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400':
                        maid.verification_status === 'rejected',
                    }"
                  >
                    {{ maid.verification_status }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Member since {{ formatRelativeDate(maid.created_at) }}
                  </span>
                </div>

                <div class="flex items-start gap-6">
                  <div class="flex-shrink-0">
                    <div
                      class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg"
                    >
                      <img
                        v-if="maid.image_url"
                        :src="maid.image_url"
                        class="w-full h-full object-cover"
                        :alt="maid.first_name"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <span
                          class="text-3xl font-semibold text-gray-400 dark:text-gray-300"
                        >
                          {{ maid.first_name?.charAt(0) || "M" }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h1
                      class="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                      {{ maidFullName }}
                    </h1>

                    <div
                      class="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-4"
                    >
                      <div class="flex items-center gap-1">
                        <Icon name="mdi:map-marker-outline" class="text-lg" />
                        <span>{{ maid.address }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <Icon name="mdi:account-outline" class="text-lg" />
                        <span class="capitalize">{{ maid.gender }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <Icon name="mdi:cake-variant-outline" class="text-lg" />
                        <span
                          >{{ calculateAge(maid.date_of_birth) }} years</span
                        >
                      </div>
                    </div>

                    <div class="flex items-center gap-2 mb-4">
                      <div class="flex items-center">
                        <Icon
                          name="mdi:star"
                          class="text-yellow-400"
                          v-for="star in Math.floor(Number(maid.rating))"
                          :key="star"
                        />
                        <Icon
                          name="mdi:star-half-full"
                          class="text-yellow-400"
                          v-if="Number(maid.rating) % 1 >= 0.5"
                        />
                        <Icon
                          name="mdi:star-outline"
                          class="text-yellow-400"
                          v-for="star in 5 - Math.ceil(Number(maid.rating))"
                          :key="'empty-' + star"
                        />
                      </div>
                      <span class="text-gray-600 dark:text-gray-300">
                        {{ maid.rating }} ({{ maid.total_reviews }} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 p-5 rounded-lg border border-lime-100 dark:border-lime-800/50 mt-6"
                >
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        Primary Skill
                      </p>
                      <p
                        class="text-2xl font-bold text-gray-900 dark:text-white capitalize"
                      >
                        {{ maid.skill }}
                      </p>
                    </div>
                    <button
                      @click.stop="openHireModal"
                      :disabled="applying || hireStatus === 'applied'"
                      class="px-6 py-3 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      :class="{
                        'bg-lime-500 hover:bg-lime-600 text-white':
                          !applying && hireStatus !== 'applied',
                        'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed':
                          applying,
                        'bg-green-500 hover:bg-green-600 text-white':
                          hireStatus === 'applied',
                      }"
                    >
                      <span v-if="applying">Sending Request...</span>
                      <span v-else-if="hireStatus === 'applied'"
                        >Request Sent</span
                      >
                      <span v-else>Hire Now</span>
                      <Icon
                        v-if="applying"
                        name="mdi:loading"
                        class="animate-spin text-lg"
                      />
                      <Icon
                        v-else-if="hireStatus === 'applied'"
                        name="mdi:check"
                        class="text-lg"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Maid Details Sections -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="md:col-span-2 space-y-6">
            <!-- About the Maid -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <class class="p-6 md:p-8">
                <h2
                  class="text-xl p-4 font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon
                    name="mdi:account-details-outline"
                    class="text-lime-500"
                  />
                  <span>About Me</span>
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div
                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <h3
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                    >
                      Availability
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300 capitalize">
                      {{ maid.job_time || "Flexible" }}
                    </p>
                  </div>

                  <div
                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <h3
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                    >
                      Languages
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ maid.main_language }}
                      <span v-if="maid.other_language"
                        >, {{ maid.other_language }}</span
                      >
                    </p>
                  </div>

                  <div
                    class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <h3
                      class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                    >
                      Religion
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ maid.religion || "Not specified" }}
                    </p>
                  </div>
                </div>
              </class>
            </div>

            <!-- Skills & Experience -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div class="p-6 md:p-8">
                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon name="mdi:tools" class="text-lime-500" />
                  <span>Skills & Experience</span>
                </h2>

                <div class="space-y-4">
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                      Primary Skill
                    </h3>
                    <div class="flex items-center gap-2">
                      <span
                        class="px-3 py-1 bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-200 rounded-full text-sm font-medium"
                      >
                        {{ maid.skill }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                      Additional Skills
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ maid.other_skills || "Not specified" }}
                    </p>
                  </div>

                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                      Experience
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300">
                      {{ maid.experience || "Not specified" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Verification Status -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div class="p-6">
                <h2
                  class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
                >
                  <Icon name="mdi:shield-check-outline" class="text-lime-500" />
                  <span>Verification Status</span>
                </h2>

                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Account Status</span
                    >
                    <span
                      class="text-sm font-medium capitalize"
                      :class="{
                        'text-green-500':
                          maid.verification_status === 'verified',
                        'text-yellow-500':
                          maid.verification_status === 'pending',
                        'text-red-500': maid.verification_status === 'rejected',
                      }"
                    >
                      {{ maid.verification_status }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >ID Verified</span
                    >
                    <span
                      class="text-sm font-medium"
                      :class="{
                        'text-green-500':
                          maid.verification_status === 'verified',
                        'text-gray-500':
                          maid.verification_status !== 'verified',
                      }"
                    >
                      {{
                        maid.verification_status === "verified" ? "Yes" : "No"
                      }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >Background Check</span
                    >
                    <span
                      class="text-sm font-medium"
                      :class="{
                        'text-green-500':
                          maid.verification_status === 'verified',
                        'text-gray-500':
                          maid.verification_status !== 'verified',
                      }"
                    >
                      {{
                        maid.verification_status === "verified"
                          ? "Clear"
                          : "Pending"
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div class="p-6 md:p-8">
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
            >
              <h2
                class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
              >
                <Icon name="mdi:star-outline" class="text-lime-500" />
                <span>Client Reviews</span>
              </h2>

              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ maid.rating }}
                  </div>
                  <div class="flex flex-col">
                    <div class="flex items-center">
                      <Icon
                        name="mdi:star"
                        class="text-yellow-400"
                        v-for="star in 5"
                        :key="star"
                        :class="{
                          'text-yellow-400': star <= Number(maid.rating),
                          'text-gray-300 dark:text-gray-600':
                            star > Number(maid.rating),
                        }"
                      />
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ maid.total_reviews }} reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="maid.reviews?.length > 0" class="space-y-6">
              <!-- Show only first 3 reviews initially -->
              <div
                v-for="(review, index) in visibleReviews"
                :key="index"
                class="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div
                      class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow"
                    >
                      <img
                        v-if="review.household_image"
                        :src="review.household_image"
                        class="w-full h-full object-cover"
                        :alt="review.household_name"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center"
                      >
                        <span
                          class="text-lg font-semibold text-gray-400 dark:text-gray-300"
                        >
                          {{ review.household_name?.charAt(0) || "H" }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="font-medium text-gray-900 dark:text-white">
                        {{ review.household_name }}
                      </h4>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatRelativeDate(review.created_at) }}
                      </span>
                    </div>

                    <div class="flex items-center mb-2">
                      <div class="flex mr-2">
                        <Icon
                          name="mdi:star"
                          class="text-yellow-400"
                          v-for="star in 5"
                          :key="star"
                          :class="{
                            'text-yellow-400': star <= Number(review.rating),
                            'text-gray-300 dark:text-gray-600':
                              star > Number(review.rating),
                          }"
                        />
                      </div>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ review.rating }}.0
                      </span>
                    </div>

                    <p class="text-gray-700 dark:text-gray-300">
                      {{ review.review }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Show More/Less Button -->
              <div v-if="maid.reviews.length > 3" class="pt-4">
                <button
                  @click="showAllReviews = !showAllReviews"
                  class="w-full py-2 px-4 text-lime-500 hover:text-lime-600 dark:hover:text-lime-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>{{ showAllReviews ? "Show Less" : "Show More" }}</span>
                  <Icon
                    :name="
                      showAllReviews ? 'mdi:chevron-up' : 'mdi:chevron-down'
                    "
                    class="text-lg"
                  />
                </button>
              </div>
            </div>

            <div v-else class="py-8 text-center">
              <div class="mx-auto max-w-xs text-center">
                <Icon
                  name="mdi:comment-question-outline"
                  class="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3"
                />
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-1"
                >
                  No reviews yet
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  This maid hasn't received any reviews yet.
                </p>
              </div>
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
import { useAuthStore } from "@/stores/auth";
import backendApi from "@/networkServices/api/backendApi.js";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const maidId = route.params.id;

// Data
const loading = ref(false);
const applying = ref(false);
const error = ref(null);
const showSuccessModal = ref(false);
const showJobSelectionModal = ref(false);
const showAlreadyInvitedModal = ref(false);
const householdJobs = ref([]);
const selectedJobId = ref(null);
const maid = ref({
  rating: 0,
  total_reviews: 0,
  reviews: [],
});
const showAllReviews = ref(false);
const showContactForm = ref(false);
const hireStatus = ref(null); // 'applied' or null

// Computed
const maidFullName = computed(() => {
  if (!maid.value) return "";
  return `${maid.value.first_name || ""} ${maid.value.middle_name || ""} ${
    maid.value.last_name || ""
  }`.trim();
});

const visibleReviews = computed(() => {
  if (!maid.value.reviews) return [];
  return showAllReviews.value
    ? maid.value.reviews
    : maid.value.reviews.slice(0, 3);
});

// Methods
const viewHireRequests = () => {
  showSuccessModal.value = false;
  router.push("/house/job/applicationlist");
};

const calculateAge = (dateString) => {
  if (!dateString) return "Unknown";
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return formatDate(dateString);
};

const formatCurrency = (amount) => {
  if (!amount) return "Negotiable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const fetchHouseholdJobs = async () => {
  try {
    loading.value = true;
    const response = await backendApi.get("/household/open", {
      params: { status: "open" },
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    householdJobs.value = response.data.jobs;
  } catch (err) {
    console.error("Error fetching household jobs:", err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch your job postings";
  } finally {
    loading.value = false;
  }
};

const openHireModal = async () => {
  if (hireStatus.value === "applied") return;

  try {
    // First check if user has any open jobs
    await fetchHouseholdJobs();

    if (householdJobs.value.length === 0) {
      error.value = "You need to create a job posting first before hiring.";
      return;
    }

    showJobSelectionModal.value = true;
    selectedJobId.value = null;
  } catch (err) {
    console.error("Error preparing hire modal:", err);
  }
};

const confirmHireSelection = async () => {
  if (!selectedJobId.value) return;
  await hireMaid(maid.value.id, selectedJobId.value);
};

const hireMaid = async (maidId, jobId) => {
  try {
    applying.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    if (!authStore.isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const response = await backendApi.post(
      `/jobs/${jobId}/hire-maid/${maidId}`,
      { job_id: jobId },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      hireStatus.value = "applied";
      showJobSelectionModal.value = false;
      showSuccessModal.value = true;
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      authStore.logout();
      router.push("/auth/login");
      error.value = "Your session has expired. Please log in again.";
    } else if (err.response && err.response.status === 403) {
      hireStatus.value = "applied";
      showJobSelectionModal.value = false;
      showAlreadyInvitedModal.value = true;
    }
  } finally {
    applying.value = false;
  }
};

const fetchMaidDetails = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(`/maids/verified/${maidId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    maid.value = response.data;

    // Check if user has already applied to hire this maid
    if (response.data.hire_status) {
      hireStatus.value = response.data.hire_status;
    }
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch maid details";
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchMaidDetails();
});

definePageMeta({
  layout: "house",
});
</script>

<style scoped>
.whitespace-pre-line {
  white-space: pre-line;
}

.review-enter-active,
.review-leave-active {
  transition: all 0.3s ease;
}
.review-enter-from,
.review-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
