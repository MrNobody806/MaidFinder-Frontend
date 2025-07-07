<template>
  <div class="min-h-screen bg-[#F3F3F3] dark:bg-[#191A23]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <svg
          class="animate-spin h-12 w-12 text-[#B9FF66]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <!-- Profile Creation Form (shown when no profile exists) -->
      <div
        v-else-if="!profileExists"
        class="bg-white dark:bg-[#20233f] rounded-lg shadow-lg p-8 max-w-3xl mx-auto"
      >
        <h1 class="text-lg font-bold text-gray-800 dark:text-[#F3F3F3] mb-6">
          Create Your {{ user.role === "maid" ? "Maid" : "Household" }} Profile
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Complete your profile to start using the platform
        </p>

        <form @submit.prevent="createProfile" class="space-y-4">
          <!-- Error Message -->
          <transition name="error-message">
            <div
              v-if="errorMessage"
              class="p-4 mb-4 text-base font-medium rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 flex items-start"
            >
              <Icon
                name="heroicons:exclamation-circle"
                class="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-red-600 dark:text-red-400"
              />
              <span>{{ errorMessage }}</span>
            </div>
          </transition>

          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                First Name
              </label>
              <input
                v-model="createForm.first_name"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Middle Name (Optional)
              </label>
              <input
                v-model="createForm.middle_name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Last Name
              </label>
              <input
                v-model="createForm.last_name"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
          </div>

          <!-- Personal Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Date of Birth
              </label>
              <input
                v-model="createForm.date_of_birth"
                type="date"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Gender
              </label>
              <select
                v-model="createForm.gender"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Religion (Optional)
              </label>
              <input
                v-model="createForm.religion"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
          </div>

          <!-- Contact Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Primary Phone
              </label>
              <input
                v-model="createForm.phone_number1"
                type="tel"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Secondary Phone (Optional)
              </label>
              <input
                v-model="createForm.phone_number2"
                type="tel"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2">
              Address
            </label>
            <input
              v-model="createForm.address"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
          </div>

          <!-- Maid-specific fields -->
          <template v-if="user.role === 'maid'">
            <!-- Skill -->
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Primary Skill
              </label>
              <input
                v-model="createForm.skill"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>

            <!-- Languages -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                >
                  Main Language
                </label>
                <input
                  v-model="createForm.main_language"
                  type="text"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                />
              </div>
              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                >
                  Other Languages (Optional)
                </label>
                <input
                  v-model="createForm.other_language"
                  type="text"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                />
              </div>
            </div>

            <!-- Job Time -->
            <div>
              <label
                class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
              >
                Job Type
              </label>
              <select
                v-model="createForm.job_time"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              >
                <option value="one time">One Time</option>
                <option value="part time">Part Time</option>
                <option value="full time">Full Time</option>
              </select>
            </div>
          </template>

          <!-- Profile Image -->
          <div>
            <label class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload('image', $event)"
              required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              JPEG, PNG, JPG, GIF (Max 2MB)
            </p>
          </div>

          <!-- Identity Image -->
          <div>
            <label class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2">
              Identity Document
            </label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload('identity_image', $event)"
              required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              JPEG, PNG, JPG, GIF (Max 2MB)
            </p>
          </div>

          <!-- Criminal Clearance (Maid only) -->
          <div v-if="user.role === 'maid'">
            <label class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2">
              Criminal Clearance Certificate
            </label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload('criminal_clearance_image', $event)"
              required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              JPEG, PNG, JPG, GIF (Max 2MB)
            </p>
          </div>

          <!-- Form Actions -->
          <div
            class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-[#F3F3F3]"
          >
            <button
              type="button"
              @click="navigateTo('/')"
              class="inline-flex items-center px-4 py-2 border rounded-lg text-gray-700 dark:text-[#F3F3F3] bg-white dark:bg-[#191A23] hover:bg-gray-50 dark:hover:bg-[#000000] transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isCreating"
              class="inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-white dark:text-[#191A23] bg-black dark:bg-[#B9FF66] font-semibold hover:bg-[#191A23] dark:hover:bg-[#A0E55C] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isCreating"
                class="animate-spin -ml-1 mr-2 h-5 w-5 text-white dark:text-[#191A23]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isCreating ? "Creating..." : "Create Profile" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Profile View/Edit (shown when profile exists) -->
      <div v-else class="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <!-- Sidebar Navigation -->
        <div class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white dark:bg-[#20233f] rounded-lg shadow-lg p-6">
            <div class="flex items-center space-x-4 mb-6">
              <div class="relative">
                <div
                  class="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-[#B9FF66] to-green-500 ring-2 ring-[#B9FF66]"
                >
                  <NuxtImg
                    :src="profile.image_url || '/default-avatar.jpg'"
                    class="w-full h-full object-cover"
                    :alt="profile.first_name"
                    width="64"
                    height="64"
                  />
                </div>
                <span
                  v-if="user.role === 'maid'"
                  class="absolute -bottom-1 -right-1 bg-[#B9FF66] text-[#191A23] text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  Maid
                </span>
                <span
                  v-else-if="user.role === 'household'"
                  class="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  Household
                </span>
              </div>
              <div>
                <h2 class="font-bold text-gray-900 dark:text-[#F3F3F3]">
                  {{ profile.first_name }} {{ profile.last_name }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ user.email }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Status: {{ profile.verification_status }}
                </p>
              </div>
            </div>

            <nav class="space-y-2">
              <NuxtLink
                to="/profile"
                class="block px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-[#191A23] text-[#B9FF66]"
                aria-current="page"
              >
                Profile
              </NuxtLink>
              <NuxtLink
                to="/profile/settings"
                class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-[#F3F3F3] hover:bg-gray-100 dark:hover:bg-[#191A23] transition duration-300"
              >
                Settings
              </NuxtLink>
              <NuxtLink
                to="/notifications"
                class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-[#F3F3F3] hover:bg-gray-100 dark:hover:bg-[#191A23] transition duration-300"
              >
                Notifications
              </NuxtLink>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <div
            class="bg-white dark:bg-[#20233f] rounded-lg shadow-lg overflow-hidden"
          >
            <!-- Form Header -->
            <div
              class="px-6 py-5 border-b border-gray-200 dark:border-[#F3F3F3] flex items-center justify-between"
            >
              <h3 class="text-lg font-bold text-gray-900 dark:text-[#F3F3F3]">
                Profile Information
              </h3>
              <span
                v-if="isDirty"
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                Unsaved changes
              </span>
            </div>

            <!-- Profile Update Form -->
            <form @submit.prevent="updateProfile">
              <div class="space-y-4 px-6 py-5">
                <!-- Profile Picture -->
                <div>
                  <label
                    class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                  >
                    Profile Photo
                  </label>
                  <div class="flex items-center space-x-6">
                    <div class="relative">
                      <div
                        class="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-[#B9FF66] to-green-500 ring-2 ring-[#B9FF66]"
                      >
                        <NuxtImg
                          :src="
                            previewImage ||
                            profile.image_url ||
                            '/default-avatar.jpg'
                          "
                          class="w-full h-full object-cover"
                          :alt="profile.first_name"
                          width="80"
                          height="80"
                        />
                      </div>
                      <div
                        v-if="uploadProgress > 0 && uploadProgress < 100"
                        class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                      >
                        <div class="text-white text-xs font-bold">
                          {{ uploadProgress }}%
                        </div>
                      </div>
                    </div>
                    <div class="flex space-x-3">
                      <label
                        class="relative cursor-pointer bg-white dark:bg-[#191A23] rounded-lg font-medium text-[#B9FF66] hover:text-green-500 transition duration-300"
                      >
                        <span class="text-sm">Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          class="sr-only"
                          @change="handleImageUpload"
                        />
                      </label>
                      <button
                        v-if="previewImage"
                        type="button"
                        @click="removeImage"
                        class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Name Fields -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      First Name
                    </label>
                    <input
                      v-model="form.first_name"
                      type="text"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Middle Name
                    </label>
                    <input
                      v-model="form.middle_name"
                      type="text"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      v-model="form.last_name"
                      type="text"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>
                </div>

                <!-- Personal Info -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Date of Birth
                    </label>
                    <input
                      v-model="form.date_of_birth"
                      type="date"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Gender
                    </label>
                    <select
                      v-model="form.gender"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @change="markDirty"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Religion
                    </label>
                    <input
                      v-model="form.religion"
                      type="text"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Primary Phone
                    </label>
                    <input
                      v-model="form.phone_number1"
                      type="tel"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Secondary Phone
                    </label>
                    <input
                      v-model="form.phone_number2"
                      type="tel"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>
                </div>

                <!-- Address -->
                <div>
                  <label
                    class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                  >
                    Address
                  </label>
                  <input
                    v-model="form.address"
                    type="text"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                    @input="markDirty"
                  />
                </div>

                <!-- Maid-specific fields -->
                <template v-if="user.role === 'maid'">
                  <!-- Skill -->
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Primary Skill
                    </label>
                    <input
                      v-model="form.skill"
                      type="text"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @input="markDirty"
                    />
                  </div>

                  <!-- Languages -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                      >
                        Main Language
                      </label>
                      <input
                        v-model="form.main_language"
                        type="text"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                        @input="markDirty"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                      >
                        Other Languages
                      </label>
                      <input
                        v-model="form.other_language"
                        type="text"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                        @input="markDirty"
                      />
                    </div>
                  </div>

                  <!-- Job Time -->
                  <div>
                    <label
                      class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                    >
                      Job Type
                    </label>
                    <select
                      v-model="form.job_time"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      @change="markDirty"
                    >
                      <option value="one time">One Time</option>
                      <option value="part time">Part Time</option>
                      <option value="full time">Full Time</option>
                    </select>
                  </div>
                </template>

                <!-- Document Uploads -->
                <div>
                  <label
                    class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-2"
                  >
                    Documents
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-1"
                      >
                        Identity Document
                      </label>
                      <a
                        :href="profile.identity_image_url"
                        target="_blank"
                        class="text-[#B9FF66] hover:underline text-sm"
                      >
                        View Document
                      </a>
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleFileUpload('identity_image', $event)"
                        class="mt-2 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      />
                    </div>
                    <div v-if="user.role === 'maid'">
                      <label
                        class="block text-sm text-gray-700 dark:text-[#F3F3F3] mb-1"
                      >
                        Criminal Clearance
                      </label>
                      <a
                        :href="profile.criminal_clearance_image_url"
                        target="_blank"
                        class="text-[#B9FF66] hover:underline text-sm"
                      >
                        View Document
                      </a>
                      <input
                        type="file"
                        accept="image/*"
                        @change="
                          handleFileUpload('criminal_clearance_image', $event)
                        "
                        class="mt-2 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                      />
                    </div>
                  </div>
                </div>

                <!-- Form Actions -->
                <div
                  class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-[#F3F3F3]"
                >
                  <button
                    type="button"
                    @click="resetForm"
                    :disabled="!isDirty"
                    class="inline-flex items-center px-4 py-2 border rounded-lg text-gray-700 dark:text-[#F3F3F3] bg-white dark:bg-[#191A23] hover:bg-gray-50 dark:hover:bg-[#000000] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="!isDirty || isUpdating"
                    class="inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-white dark:text-[#191A23] bg-black dark:bg-[#B9FF66] font-semibold hover:bg-[#191A23] dark:hover:bg-[#A0E55C] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="isUpdating"
                      class="animate-spin -ml-1 mr-2 h-5 w-5 text-white dark:text-[#191A23]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {{ isUpdating ? "Saving..." : "Save Changes" }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const isLoading = ref(true);
const profileExists = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDirty = ref(false);
const uploadProgress = ref(0);
const previewImage = ref(null);
const errorMessage = ref("");
const user = ref({});
const profile = ref({});

// Initialize create form with empty values
const createForm = ref({
  first_name: "",
  middle_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "male",
  phone_number1: "",
  phone_number2: "",
  religion: "",
  address: "",
  image: null,
  identity_image: null,
  skill: "",
  main_language: "",
  other_language: "",
  job_time: "one time",
  criminal_clearance_image: null,
});

// Initialize edit form with empty values
const form = ref({
  first_name: "",
  middle_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "male",
  phone_number1: "",
  phone_number2: "",
  religion: "",
  address: "",
  image_url: "",
  skill: "",
  main_language: "",
  other_language: "",
  job_time: "one time",
});

// Fetch user and profile data
const fetchData = async () => {
  isLoading.value = true;
  try {
    // Fetch user data from auth store
    user.value = authStore.user;

    // Fetch profile data
    const response = await $fetch("/api/profile");

    // If we get a response, profile exists
    if (response) {
      profile.value = response;
      profileExists.value = true;

      // Initialize form with profile data
      resetForm();
    } else {
      profileExists.value = false;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    if (error.response?.status === 404) {
      profileExists.value = false;
    } else {
      errorMessage.value = "Failed to load profile. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Handle file upload for create form
const handleFileUpload = (field, event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type and size
  if (!file.type.match("image.*")) {
    errorMessage.value = "Please select an image file (JPEG, PNG, JPG, GIF)";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    // 2MB
    errorMessage.value = "Image size should be less than 2MB";
    return;
  }

  createForm.value[field] = file;
  errorMessage.value = "";
};

// Handle image upload for edit form
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type and size
  if (!file.type.match("image.*")) {
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
    markDirty();
  };
  reader.readAsDataURL(file);

  // Simulate upload progress
  uploadProgress.value = 0;
  const interval = setInterval(() => {
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        form.value.image_url = previewImage.value;
        uploadProgress.value = 0;
      }, 500);
    }
  }, 100);
};

// Remove selected image
const removeImage = () => {
  previewImage.value = null;
  form.value.image_url = "";
  markDirty();
};

// Mark form as dirty when any field changes
const markDirty = () => {
  isDirty.value = true;
};

// Reset form to original values
const resetForm = () => {
  form.value = {
    first_name: profile.value.first_name || "",
    middle_name: profile.value.middle_name || "",
    last_name: profile.value.last_name || "",
    date_of_birth: profile.value.date_of_birth || "",
    gender: profile.value.gender || "male",
    phone_number1: profile.value.phone_number1 || "",
    phone_number2: profile.value.phone_number2 || "",
    religion: profile.value.religion || "",
    address: profile.value.address || "",
    image_url: profile.value.image_url || "",
    skill: profile.value.skill || "",
    main_language: profile.value.main_language || "",
    other_language: profile.value.other_language || "",
    job_time: profile.value.job_time || "one time",
  };
  previewImage.value = null;
  isDirty.value = false;
};

// Create profile
const createProfile = async () => {
  isCreating.value = true;
  errorMessage.value = "";

  try {
    // Prepare form data for upload
    const formData = new FormData();

    // Add all fields to form data
    for (const key in createForm.value) {
      if (createForm.value[key] !== null) {
        if (key === "job_time") {
          // Convert job_time to numeric value for maid profiles
          const jobTimeMap = { "one time": 1, "part time": 2, "full time": 3 };
          formData.append(
            key,
            user.value.role === "maid"
              ? jobTimeMap[createForm.value[key]]
              : createForm.value[key]
          );
        } else {
          formData.append(key, createForm.value[key]);
        }
      }
    }

    // Create profile
    const response = await $fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    // Update local state
    profile.value = response;
    profileExists.value = true;

    // Initialize form with new profile data
    resetForm();
  } catch (error) {
    console.error("Error creating profile:", error);
    errorMessage.value =
      error.response?.data?.error ||
      "Failed to create profile. Please try again.";
  } finally {
    isCreating.value = false;
  }
};

// Update profile
const updateProfile = async () => {
  if (!isDirty.value) return;

  isUpdating.value = true;
  errorMessage.value = "";

  try {
    // Prepare the data to send
    const payload = {
      first_name: form.value.first_name,
      middle_name: form.value.middle_name,
      last_name: form.value.last_name,
      date_of_birth: form.value.date_of_birth,
      gender: form.value.gender,
      phone_number1: form.value.phone_number1,
      phone_number2: form.value.phone_number2,
      religion: form.value.religion,
      address: form.value.address,
      ...(form.value.image_url && { image_url: form.value.image_url }),
      ...(user.value.role === "maid" && {
        skill: form.value.skill,
        main_language: form.value.main_language,
        other_language: form.value.other_language,
        job_time: form.value.job_time,
      }),
    };

    // Update profile
    const response = await $fetch("/api/profile", {
      method: "PUT",
      body: payload,
    });

    // Update local profile data
    profile.value = response;

    // Reset dirty state
    isDirty.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
    errorMessage.value =
      error.response?.data?.error ||
      "Failed to update profile. Please try again.";
  } finally {
    isUpdating.value = false;
  }
};

// Fetch data when component mounts
onMounted(() => {
  fetchData();
});

definePageMeta({
  layout: false,
});
</script>

<style scoped>
/* Error message animation */
.error-message-enter-active,
.error-message-leave-active {
  transition: all 0.3s ease;
}
.error-message-enter-from,
.error-message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Dark mode transitions */
input,
button,
select {
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
}
</style>
