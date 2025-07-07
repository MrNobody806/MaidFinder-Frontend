<template>
  <section class="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Loading State -->
      <div
        v-if="loading && !agreement"
        class="flex justify-center items-center h-64"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"
        ></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl"
      >
        <div class="flex items-center gap-3 mb-3">
          <Icon
            name="mdi:alert-circle"
            class="text-red-500 dark:text-red-400 w-6 h-6"
          />
          <h3 class="text-lg font-medium text-red-800 dark:text-red-200">
            Failed to load agreement
          </h3>
        </div>
        <p class="text-red-700 dark:text-red-300 mb-4">{{ error }}</p>
        <button
          @click="fetchAgreement"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Retry
        </button>
      </div>

      <!-- Content -->
      <template v-else-if="agreement">
        <!-- Back Button -->
        <nav class="flex items-center mb-6">
          <button
            @click="goBack"
            class="flex items-center text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 transition"
          >
            <Icon name="mdi:chevron-left" class="mr-1 w-5 h-5" />
            Back to Agreements
          </button>
        </nav>

        <!-- Main Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <!-- Status Header -->
          <div
            class="px-6 py-4 border-b"
            :class="statusHeaderClasses(agreement.status)"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div class="flex items-start gap-4">
                <div
                  class="flex-shrink-0 p-3 rounded-lg"
                  :class="statusIconBgClasses(agreement.status)"
                >
                  <Icon
                    name="mdi:file-document"
                    class="w-6 h-6"
                    :class="statusIconColorClasses(agreement.status)"
                  />
                </div>
                <div>
                  <h1
                    class="text-2xl font-bold text-gray-800 dark:text-gray-100"
                  >
                    {{ agreement.job.title }}
                  </h1>
                  <div class="flex items-center flex-wrap gap-2 mt-2">
                    <span
                      class="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5"
                      :class="statusClasses(agreement.status)"
                    >
                      <Icon
                        :name="statusIcon(agreement.status)"
                        class="w-4 h-4"
                      />
                      {{ formatStatus(agreement.status) }}
                    </span>
                    <div
                      class="flex items-center text-sm text-gray-600 dark:text-gray-300"
                    >
                      <Icon name="mdi:calendar" class="mr-1.5 w-4 h-4" />
                      Created {{ formatRelativeDate(agreement.created_at) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2">
                <!-- Pending Status Actions -->
                <template v-if="agreement.status === 'pending'">
                  <button
                    @click="showAcceptModal = true"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                    :disabled="actionLoading"
                  >
                    <Icon name="mdi:check" class="w-5 h-5" />
                    <span v-if="!actionLoading">Accept</span>
                    <span v-else>Processing...</span>
                  </button>
                  <button
                    @click="initiateRejection"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
                    :disabled="actionLoading"
                  >
                    <Icon name="mdi:close" class="w-5 h-5" />
                    <span v-if="!actionLoading">Reject</span>
                    <span v-else>Processing...</span>
                  </button>
                </template>

                <!-- Confirmed Status Actions -->
                <template v-else-if="agreement.status === 'confirmed'">
                  <button
                    v-if="agreement.job.time === 'one time'"
                    @click="showFinishModal = true"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
                    :disabled="actionLoading"
                  >
                    <Icon name="mdi:check-all" class="w-5 h-5" />
                    <span v-if="!actionLoading">Mark Finished</span>
                    <span v-else>Processing...</span>
                  </button>
                  <button
                    v-else
                    @click="showCancelModal = true"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
                    :disabled="actionLoading"
                  >
                    <Icon name="mdi:cancel" class="w-5 h-5" />
                    <span v-if="!actionLoading">Cancel</span>
                    <span v-else>Processing...</span>
                  </button>
                </template>

                <!-- Common Actions -->
                <button
                  @click="printAgreement"
                  class="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition flex items-center gap-2"
                >
                  <Icon name="mdi:printer" class="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Left Column - Job Details -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Job Information Card -->
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h2
                      class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"
                    >
                      <Icon
                        name="mdi:briefcase"
                        class="text-lime-600 dark:text-lime-400"
                      />
                      Job Information
                    </h2>
                    <span
                      class="text-xs px-2.5 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-200"
                    >
                      {{ agreement.job.status }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <label
                        class="text-xs font-medium text-gray-500 dark:text-gray-400"
                        >Job Type</label
                      >
                      <p
                        class="text-gray-800 dark:text-gray-100 font-medium capitalize"
                      >
                        {{ formatJobTime(agreement.job.time) }}
                      </p>
                    </div>

                    <div class="space-y-1">
                      <label
                        class="text-xs font-medium text-gray-500 dark:text-gray-400"
                        >Location</label
                      >
                      <p
                        class="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-1"
                      >
                        <Icon
                          name="mdi:map-marker"
                          class="text-gray-500 dark:text-gray-400"
                        />
                        {{ agreement.job.location }}
                      </p>
                    </div>

                    <div class="space-y-1">
                      <label
                        class="text-xs font-medium text-gray-500 dark:text-gray-400"
                        >Start Date</label
                      >
                      <p
                        class="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-1"
                      >
                        <Icon
                          name="mdi:calendar"
                          class="text-gray-500 dark:text-gray-400"
                        />
                        {{ formatDate(agreement.job.expected_start_date) }}
                      </p>
                    </div>

                    <div class="space-y-1">
                      <label
                        class="text-xs font-medium text-gray-500 dark:text-gray-400"
                        >Salary Range</label
                      >
                      <p
                        class="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-1"
                      >
                        <Icon
                          name="mdi:cash"
                          class="text-gray-500 dark:text-gray-400"
                        />
                        ${{ agreement.job.salary_min }} - ${{
                          agreement.job.salary_max
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Agreement Terms Card -->
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <h2
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4"
                  >
                    <Icon
                      name="mdi:file-document-edit"
                      class="text-lime-600 dark:text-lime-400"
                    />
                    Agreement Terms
                  </h2>
                  <div
                    class="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <pre
                      class="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200"
                      >{{ agreement.agreement_details }}</pre
                    >
                  </div>
                </div>

                <!-- Review Card - For finished OR confirmed agreements -->
                <div
                  v-if="
                    agreement.status === 'finished' ||
                    (agreement.status === 'confirmed' &&
                      (agreement.job.time === 'part time' ||
                        agreement.job.time === 'full time'))
                  "
                  class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <h2
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4"
                  >
                    <Icon
                      name="mdi:star"
                      class="text-lime-600 dark:text-lime-400"
                    />
                    <span v-if="agreement.status === 'finished'"
                      >Rate & Review Household</span
                    >
                    <span v-else>Provide Feedback</span>
                  </h2>

                  <!-- Success Message -->
                  <div
                    v-if="reviewSuccess"
                    class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div
                      class="flex items-center text-green-800 dark:text-green-200"
                    >
                      <Icon name="mdi:check-circle" class="w-5 h-5 mr-2" />
                      <span
                        >Your feedback has been submitted successfully!</span
                      >
                    </div>
                  </div>

                  <!-- Existing Reviews for this agreement -->
                  <div
                    v-if="
                      agreement.their_reviews &&
                      agreement.their_reviews.length > 0
                    "
                    class="space-y-4 mb-4"
                  >
                    <!-- Show 3 reviews by default, 5 after clicking "Show More" -->
                    <div
                      v-for="(review, index) in displayedReviews"
                      :key="index"
                      class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center">
                          <div class="flex">
                            <Icon
                              v-for="star in 5"
                              :key="star"
                              name="mdi:star"
                              class="w-5 h-5"
                              :class="
                                star <= review.rating
                                  ? 'text-yellow-500'
                                  : 'text-gray-300 dark:text-gray-600'
                              "
                            />
                          </div>
                          <span
                            class="ml-2 text-sm text-gray-600 dark:text-gray-300"
                          >
                            Rated {{ review.rating }} stars
                            <span v-if="agreement.job.time !== 'one time'"
                              >({{
                                formatRelativeDate(review.created_at)
                              }})</span
                            >
                          </span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDateTime(review.created_at) }}
                        </span>
                      </div>
                      <p
                        class="text-gray-800 dark:text-gray-200 text-sm"
                        v-if="review.comment"
                      >
                        "{{ review.comment }}"
                      </p>
                    </div>

                    <!-- Show More button (when more than 3 reviews) -->
                    <button
                      v-if="
                        agreement.their_reviews.length > 3 && !showAllReviews
                      "
                      @click="showAllReviews = true"
                      class="text-sm text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
                    >
                      <Icon name="mdi:chevron-down" class="w-4 h-4" />
                      Show more reviews ({{
                        agreement.their_reviews.length - 3
                      }}
                      more)
                    </button>

                    <!-- Show Less button (when showing all reviews) -->
                    <button
                      v-if="showAllReviews"
                      @click="
                        showAllReviews = false;
                        currentPage = 1;
                      "
                      class="text-sm text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1 mt-2"
                    >
                      <Icon name="mdi:chevron-up" class="w-4 h-4" />
                      Show less
                    </button>

                    <!-- Pagination controls (when more than 5 reviews and showAll is true) -->
                    <div
                      v-if="
                        agreement.their_reviews.length > 5 && showAllReviews
                      "
                      class="flex items-center justify-between mt-4"
                    >
                      <button
                        @click="currentPage--"
                        :disabled="currentPage === 1"
                        class="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span class="text-sm text-gray-600 dark:text-gray-300">
                        Page {{ currentPage }} of {{ totalPages }}
                      </span>
                      <button
                        @click="currentPage++"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <!-- Review Form -->
                  <div v-if="canSubmitReview" class="space-y-4">
                    <div
                      v-if="agreement.job.time !== 'one time'"
                      class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3"
                    >
                      <div
                        class="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200"
                      >
                        <Icon
                          name="mdi:information"
                          class="flex-shrink-0 mt-0.5"
                        />
                        <p>
                          For {{ formatJobTime(agreement.job.time) }} jobs, you
                          can provide feedback every 30 minutes while the
                          agreement is active.
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center">
                      <span
                        class="mr-3 text-sm text-gray-600 dark:text-gray-300"
                        >Rating:</span
                      >
                      <div class="flex">
                        <button
                          v-for="star in 5"
                          :key="star"
                          @click="selectedRating = star"
                          class="focus:outline-none"
                        >
                          <Icon
                            name="mdi:star"
                            class="w-8 h-8 transition"
                            :class="
                              star <= selectedRating
                                ? 'text-yellow-500 hover:text-yellow-600'
                                : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'
                            "
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        for="review"
                        class="block text-sm text-gray-600 dark:text-gray-300 mb-1"
                      >
                        Feedback (optional):
                      </label>
                      <textarea
                        id="review"
                        v-model="reviewText"
                        :placeholder="
                          agreement.status === 'finished'
                            ? 'Share your experience with this household...'
                            : 'Share your recent experience working with this household...'
                        "
                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                        rows="3"
                      ></textarea>
                    </div>

                    <button
                      @click="submitReview"
                      class="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg transition flex items-center gap-2"
                      :disabled="!selectedRating || reviewLoading"
                    >
                      <Icon name="mdi:send" class="w-5 h-5" />
                      <span v-if="!reviewLoading">Submit Feedback</span>
                      <span v-else>Submitting...</span>
                    </button>
                  </div>
                </div>

                <!-- Timeline Card -->
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <h2
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4"
                  >
                    <Icon
                      name="mdi:timeline"
                      class="text-lime-600 dark:text-lime-400"
                    />
                    Activity Timeline
                  </h2>
                  <div class="space-y-4">
                    <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 mt-1">
                        <div
                          class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center"
                        >
                          <Icon
                            name="mdi:file-document-plus"
                            class="text-blue-600 dark:text-blue-300 w-5 h-5"
                          />
                        </div>
                      </div>
                      <div class="flex-1">
                        <p
                          class="text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                          Agreement created
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDateTime(agreement.created_at) }}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 mt-1">
                        <div
                          class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"
                        >
                          <Icon
                            name="mdi:check"
                            class="text-green-600 dark:text-green-300 w-5 h-5"
                          />
                        </div>
                      </div>
                      <div class="flex-1">
                        <p
                          class="text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                          Agreement {{ formatStatus(agreement.status) }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatRelativeDate(agreement.updated_at) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column - Household Details -->
              <div class="space-y-6">
                <!-- Household Card -->
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 sticky top-6"
                >
                  <h2
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4"
                  >
                    <Icon
                      name="mdi:home"
                      class="text-lime-600 dark:text-lime-400"
                    />
                    Household Information
                  </h2>

                  <div class="flex flex-col items-center mb-4">
                    <img
                      :src="
                        agreement.household.image_url ||
                        'https://via.placeholder.com/150?text=No+Image'
                      "
                      :alt="agreement.household.name"
                      class="w-20 h-20 rounded-full object-cover border-2 border-lime-500 mb-3"
                      @error="handleImageError"
                    />
                    <h3
                      class="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center"
                    >
                      {{ agreement.household.first_name }}
                      {{ agreement.household.last_name }}
                    </h3>
                    <div class="flex items-center mt-1">
                      <div class="flex">
                        <Icon
                          v-for="star in 5"
                          :key="star"
                          name="mdi:star"
                          class="w-5 h-5"
                          :class="
                            star <=
                            Math.floor(parseFloat(agreement.household.rating))
                              ? 'text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          "
                        />
                      </div>
                      <span
                        class="ml-1 text-sm text-gray-600 dark:text-gray-300"
                      >
                        {{ agreement.household.rating || "No ratings yet" }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div class="flex items-start gap-3">
                      <Icon
                        name="mdi:home"
                        class="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <label
                          class="text-xs font-medium text-gray-500 dark:text-gray-400"
                          >Household Name</label
                        >
                        <p class="text-gray-800 dark:text-gray-100">
                          {{ agreement.household.name }}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <Icon
                        name="mdi:map-marker"
                        class="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <label
                          class="text-xs font-medium text-gray-500 dark:text-gray-400"
                          >Address</label
                        >
                        <p class="text-gray-800 dark:text-gray-100">
                          {{ agreement.household.address }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Documents Card -->
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <h2
                    class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4"
                  >
                    <Icon
                      name="mdi:file-multiple"
                      class="text-lime-600 dark:text-lime-400"
                    />
                    Attached Documents
                  </h2>
                  <div class="space-y-2">
                    <div
                      class="text-center py-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      No documents attached
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Accept Agreement Modal -->
      <div
        v-if="showAcceptModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Icon
                name="mdi:check"
                class="w-6 h-6 text-green-600 dark:text-green-300"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Confirm Acceptance
            </h3>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to accept this agreement? This action cannot
            be undone.
          </p>

          <div class="flex justify-end gap-3">
            <button
              @click="showAcceptModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              @click="confirmAccept"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <Icon name="mdi:check" class="w-5 h-5" />
              Confirm Acceptance
            </button>
          </div>
        </div>
      </div>

      <!-- Rejection Reason Modal -->
      <div
        v-if="showRejectionModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <Icon
                name="mdi:alert-circle"
                class="w-6 h-6 text-red-600 dark:text-red-300"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Reason for Rejection
            </h3>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Please provide a detailed reason for rejecting this agreement. This
            will be shared with the household.
          </p>

          <textarea
            v-model="rejectionReason"
            placeholder="Example: The proposed schedule doesn't work for me..."
            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-lime-500 focus:border-transparent"
            rows="4"
          ></textarea>

          <div class="flex justify-end gap-3">
            <button
              @click="cancelRejection"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
              :disabled="actionLoading"
            >
              Cancel
            </button>
            <button
              @click="confirmRejection"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
              :disabled="!rejectionReason.trim() || actionLoading"
              :class="{
                'opacity-50 cursor-not-allowed':
                  !rejectionReason.trim() || actionLoading,
              }"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
              <span v-if="!actionLoading">Submit Rejection</span>
              <span v-else>Processing...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Finish Job Modal -->
      <div
        v-if="showFinishModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Icon
                name="mdi:check-all"
                class="w-6 h-6 text-purple-600 dark:text-purple-300"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Mark Job as Finished
            </h3>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to mark this job as finished? This action
            cannot be undone.
          </p>

          <div class="flex justify-end gap-3">
            <button
              @click="showFinishModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              @click="confirmFinish"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <Icon name="mdi:check-all" class="w-5 h-5" />
              Confirm Completion
            </button>
          </div>
        </div>
      </div>

      <!-- Cancel Agreement Modal -->
      <div
        v-if="showCancelModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <Icon
                name="mdi:cancel"
                class="w-6 h-6 text-red-600 dark:text-red-300"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Cancel Agreement
            </h3>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Are you sure you want to cancel this agreement? This action cannot
            be undone.
          </p>

          <div class="flex justify-end gap-3">
            <button
              @click="showCancelModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              @click="confirmCancellation"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <Icon name="mdi:cancel" class="w-5 h-5" />
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>

      <!-- Cooldown Error Modal -->
      <div
        v-if="showCooldownErrorModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <Icon
                name="mdi:clock-alert"
                class="w-6 h-6 text-red-600 dark:text-red-300"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Feedback Cooldown
            </h3>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {{ cooldownError }}
          </p>

          <div class="flex justify-end">
            <button
              @click="showCooldownErrorModal = false"
              class="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      <!-- Review Success Modal -->
      <div
        v-if="showReviewSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Icon
                name="mdi:check-circle"
                class="w-6 h-6 text-green-600 dark:text-green-300"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Feedback Submitted
            </h3>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Your feedback has been successfully submitted. Thank you for your
            review!
          </p>

          <div class="flex justify-end">
            <button
              @click="showReviewSuccessModal = false"
              class="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import backendApi from "@/networkServices/api/backendApi.js";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Reactive state
const agreement = ref(null);
const loading = ref(true);
const actionLoading = ref(false);
const error = ref(null);
const showAcceptModal = ref(false);
const showRejectionModal = ref(false);
const showFinishModal = ref(false);
const showCancelModal = ref(false);
const showCooldownErrorModal = ref(false);
const showReviewSuccessModal = ref(false);
const rejectionReason = ref("");

// Review state
const selectedRating = ref(0);
const reviewText = ref("");
const reviewLoading = ref(false);
const reviewSuccess = ref(false);
const cooldownError = ref(null);
const showAllReviews = ref(false);
const currentPage = ref(1);
const reviewsPerPage = ref(5); // Number of reviews per page when paginated

// Computed properties
const totalPages = computed(() => {
  if (!agreement.value?.their_reviews) return 0;
  return Math.ceil(agreement.value.their_reviews.length / reviewsPerPage.value);
});

const displayedReviews = computed(() => {
  if (!agreement.value?.their_reviews) return [];

  // For one-time jobs, just show the single review if it exists
  if (agreement.value.job.time === "one time" && agreement.value.their_review) {
    return [agreement.value.their_review];
  }

  // Sort reviews by date (newest first)
  const reviews = [...agreement.value.their_reviews].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // If not showing all, show first 3 reviews
  if (!showAllReviews.value) {
    return reviews.slice(0, 3);
  }

  // If showing all with pagination (when more than 5 reviews)
  if (agreement.value.their_reviews.length > 5) {
    const start = (currentPage.value - 1) * reviewsPerPage.value;
    return reviews.slice(start, start + reviewsPerPage.value);
  }

  // Otherwise show all reviews (when between 4-5 reviews)
  return reviews;
});

const canSubmitReview = computed(() => {
  if (!agreement.value) return false;

  if (agreement.value.job.time === "one time") {
    return (
      agreement.value.status === "finished" && !agreement.value.their_review
    );
  }

  return agreement.value.status === "confirmed";
});

// Methods
const fetchAgreement = async () => {
  try {
    loading.value = true;
    error.value = null;
    cooldownError.value = null;
    showCooldownErrorModal.value = false;

    if (!authStore._hydrated) {
      await authStore.hydrate();
    }

    const response = await backendApi.get(
      `/show_agreements/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    agreement.value = response.data.agreement;
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Failed to load agreement";
    console.error("Error fetching agreement:", err);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (!selectedRating.value || !agreement.value) return;

  try {
    reviewLoading.value = true;
    reviewSuccess.value = false;
    cooldownError.value = null;
    showCooldownErrorModal.value = false;

    const response = await backendApi.post(
      `/reviews/${agreement.value.agreement_id}`,
      {
        rating: selectedRating.value,
        review: reviewText.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );

    // For one-time jobs, we replace the review
    if (agreement.value.job.time === "one time") {
      agreement.value.their_review = {
        ...response.data.review,
        rating: parseInt(response.data.review.rating),
      };
    } else {
      // For part-time/full-time jobs, we add to the reviews array
      if (!agreement.value.their_reviews) {
        agreement.value.their_reviews = [];
      }
      agreement.value.their_reviews.unshift(response.data.review);
    }

    // Update household's rating if returned
    if (response.data.updated_rating && agreement.value?.household) {
      agreement.value.household.rating = response.data.updated_rating;
    }

    // Show success state
    reviewSuccess.value = true;
    showReviewSuccessModal.value = true;
    reviewText.value = "";
    selectedRating.value = 0;

    // Refresh agreement data
    await fetchAgreement();
  } catch (err) {
    if (err.response?.data?.error?.includes("30 minutes after confirmation")) {
      cooldownError.value =
        "You can submit your first feedback 30 minutes after the agreement is confirmed.";
      showCooldownErrorModal.value = true;
    } else if (
      err.response?.data?.error?.includes("review again after 30 minutes")
    ) {
      cooldownError.value =
        "You can submit another feedback 30 minutes after your last review.";
      showCooldownErrorModal.value = true;
    } else if (
      err.response?.data?.error?.includes("You have already reviewed this job")
    ) {
      cooldownError.value = "You have already submitted feedback for this job.";
      showCooldownErrorModal.value = true;
    } else {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit feedback";
    }
    console.error("Error submitting feedback:", err);
  } finally {
    reviewLoading.value = false;
  }
};

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/150?text=No+Image";
};

const goBack = () => {
  router.push(`/maids/agreements`);
};

const printAgreement = () => {
  window.print();
};

const confirmAccept = async () => {
  try {
    if (!authStore._hydrated) {
      await authStore.hydrate();
    }
    actionLoading.value = true;
    const response = await backendApi.post(
      `/agreements/${agreement.value.agreement_id}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    agreement.value.status = "confirmed";
    showAcceptModal.value = false;
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to accept agreement";
    console.error("Error accepting agreement:", err);
  } finally {
    actionLoading.value = false;
  }
};

const initiateRejection = () => {
  showRejectionModal.value = true;
  rejectionReason.value = "";
};

const cancelRejection = () => {
  showRejectionModal.value = false;
  rejectionReason.value = "";
};

const confirmRejection = async () => {
  if (!rejectionReason.value.trim()) return;

  try {
    actionLoading.value = true;
    const response = await backendApi.post(
      `/agreements/${agreement.value.agreement_id}/reject`,
      { rejection_reason: rejectionReason.value },
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    agreement.value.status = "rejected";
    agreement.value.rejection_reason = rejectionReason.value;
    showRejectionModal.value = false;
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to reject agreement";
    console.error("Error rejecting agreement:", err);
  } finally {
    actionLoading.value = false;
  }
};

const confirmFinish = async () => {
  try {
    actionLoading.value = true;
    const response = await backendApi.post(
      `/agreements/${agreement.value.agreement_id}/finish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    agreement.value.status = "finished";
    showFinishModal.value = false;

    // Enable review after finishing
    await fetchAgreement();
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to mark job as finished";
    console.error("Error finishing job:", err);
  } finally {
    actionLoading.value = false;
  }
};

const confirmCancellation = async () => {
  try {
    actionLoading.value = true;
    const response = await backendApi.post(
      `/agreements/${agreement.value.id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      }
    );
    agreement.value.status = "canceled";
    showCancelModal.value = false;
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to cancel agreement";
    console.error("Error canceling agreement:", err);
  } finally {
    actionLoading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return formatDate(dateString);
};

const formatJobTime = (jobTime) => {
  if (!jobTime) return "N/A";
  return jobTime
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatStatus = (status) => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const statusIcon = (status) => {
  switch (status) {
    case "confirmed":
      return "mdi:check-circle";
    case "finished":
      return "mdi:check-all";
    case "pending":
      return "mdi:clock";
    case "canceled":
      return "mdi:cancel";
    case "rejected":
      return "mdi:close-circle";
    default:
      return "mdi:information";
  }
};

const statusClasses = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
    case "finished":
      return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "canceled":
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const statusHeaderClasses = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-50 border-blue-100 dark:bg-blue-900/30 dark:border-blue-800";
    case "finished":
      return "bg-purple-50 border-purple-100 dark:bg-purple-900/30 dark:border-purple-800";
    case "pending":
      return "bg-yellow-50 border-yellow-100 dark:bg-yellow-900/30 dark:border-yellow-800";
    case "canceled":
    case "rejected":
      return "bg-red-50 border-red-100 dark:bg-red-900/30 dark:border-red-800";
    default:
      return "bg-gray-50 border-gray-100 dark:bg-gray-700/30 dark:border-gray-700";
  }
};

const statusIconBgClasses = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 dark:bg-blue-800/50";
    case "finished":
      return "bg-purple-100 dark:bg-purple-800/50";
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-800/50";
    case "canceled":
    case "rejected":
      return "bg-red-100 dark:bg-red-800/50";
    default:
      return "bg-gray-100 dark:bg-gray-800/50";
  }
};

const statusIconColorClasses = (status) => {
  switch (status) {
    case "confirmed":
      return "text-blue-600 dark:text-blue-300";
    case "finished":
      return "text-purple-600 dark:text-purple-300";
    case "pending":
      return "text-yellow-600 dark:text-yellow-300";
    case "canceled":
    case "rejected":
      return "text-red-600 dark:text-red-300";
    default:
      return "text-gray-600 dark:text-gray-300";
  }
};

// Watchers
watch(
  () => agreement.value?.their_reviews,
  () => {
    currentPage.value = 1;
    showAllReviews.value = false;
  }
);

// Lifecycle hooks
onMounted(() => {
  fetchAgreement();
});

// definePageMeta({
//   layout: "maid",
// });
</script>

<style scoped>
.prose {
  color: inherit;
}
.prose pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
}

.star-rating button {
  transition: transform 0.2s;
}
.star-rating button:hover {
  transform: scale(1.2);
}

@media print {
  nav,
  .sticky {
    display: none !important;
  }
  body {
    background: white !important;
    color: black !important;
  }
  .dark\:bg-gray-800 {
    background: white !important;
  }
  .dark\:text-gray-200 {
    color: black !important;
  }
}
</style>
