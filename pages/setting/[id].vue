<template>
  <div
    class="min-h-screen"
    :class="[theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50']"
  >
    <div class="max-w-4xl mx-auto p-4 sm:p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1
          class="text-2xl font-bold"
          :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
        >
          {{ $t("settings.title") }}
        </h1>
        <p
          class="mt-1"
          :class="[theme === 'dark' ? 'text-gray-300' : 'text-gray-500']"
        >
          {{ $t("settings.subtitle") }}
        </p>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-6">
        <!-- Appearance Section -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div class="p-4 sm:p-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-medium flex items-center">
              <Icon
                name="heroicons:paint-brush"
                class="w-5 h-5 mr-2 text-blue-500"
              />
              <span
                :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
              >
                {{ $t("settings.appearance.title") }}
              </span>
            </h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Theme Selection -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.appearance.theme") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{ $t("settings.appearance.theme_description") }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="setTheme('light')"
                    class="p-2 rounded-md"
                    :class="[
                      theme === 'light'
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                    ]"
                  >
                    <Icon
                      name="heroicons:sun"
                      class="w-5 h-5"
                      :class="[
                        theme === 'light'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400',
                      ]"
                    />
                  </button>
                  <button
                    @click="setTheme('dark')"
                    class="p-2 rounded-md"
                    :class="[
                      theme === 'dark'
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                    ]"
                  >
                    <Icon
                      name="heroicons:moon"
                      class="w-5 h-5"
                      :class="[
                        theme === 'dark'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400',
                      ]"
                    />
                  </button>
                  <button
                    @click="setTheme('system')"
                    class="p-2 rounded-md"
                    :class="[
                      theme === 'system'
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                    ]"
                  >
                    <Icon
                      name="heroicons:computer-desktop"
                      class="w-5 h-5"
                      :class="[
                        theme === 'system'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400',
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- Language Selection -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.appearance.language") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{ $t("settings.appearance.language_description") }}
                  </p>
                </div>
                <select
                  v-model="language"
                  @change="changeLanguage"
                  class="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Section -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div class="p-4 sm:p-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-medium flex items-center">
              <Icon
                name="heroicons:user-circle"
                class="w-5 h-5 mr-2 text-blue-500"
              />
              <span
                :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
              >
                {{ $t("settings.account.title") }}
              </span>
            </h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Change Password -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.account.change_password") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{ $t("settings.account.change_password_description") }}
                  </p>
                </div>
                <button
                  @click="openPasswordModal"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:text-blue-100 dark:bg-blue-900/50 dark:hover:bg-blue-800"
                >
                  {{ $t("settings.account.change") }}
                </button>
              </div>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.account.two_factor_auth") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{ $t("settings.account.two_factor_auth_description") }}
                  </p>
                </div>
                <Switch
                  v-model="twoFactorEnabled"
                  @update:modelValue="toggleTwoFactorAuth"
                  :class="[
                    twoFactorEnabled
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600',
                  ]"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span
                    :class="[
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1',
                    ]"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </Switch>
              </div>
            </div>

            <!-- Delete Account -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.account.delete_account") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{ $t("settings.account.delete_account_description") }}
                  </p>
                </div>
                <button
                  @click="openDeleteAccountModal"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:text-red-100 dark:bg-red-900/50 dark:hover:bg-red-800"
                >
                  {{ $t("settings.account.delete") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div class="p-4 sm:p-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-medium flex items-center">
              <Icon name="heroicons:bell" class="w-5 h-5 mr-2 text-blue-500" />
              <span
                :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
              >
                {{ $t("settings.notifications.title") }}
              </span>
            </h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Email Notifications -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.notifications.email_notifications") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{
                      $t(
                        "settings.notifications.email_notifications_description"
                      )
                    }}
                  </p>
                </div>
                <Switch
                  v-model="emailNotifications"
                  @update:modelValue="updateNotificationSettings"
                  :class="[
                    emailNotifications
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600',
                  ]"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span
                    :class="[
                      emailNotifications ? 'translate-x-6' : 'translate-x-1',
                    ]"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </Switch>
              </div>
            </div>

            <!-- Push Notifications -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.notifications.push_notifications") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{
                      $t(
                        "settings.notifications.push_notifications_description"
                      )
                    }}
                  </p>
                </div>
                <Switch
                  v-model="pushNotifications"
                  @update:modelValue="updateNotificationSettings"
                  :class="[
                    pushNotifications
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600',
                  ]"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span
                    :class="[
                      pushNotifications ? 'translate-x-6' : 'translate-x-1',
                    ]"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </Switch>
              </div>
            </div>

            <!-- SMS Notifications -->
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3
                    class="text-base font-medium"
                    :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                  >
                    {{ $t("settings.notifications.sms_notifications") }}
                  </h3>
                  <p
                    class="mt-1 text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
                    ]"
                  >
                    {{
                      $t("settings.notifications.sms_notifications_description")
                    }}
                  </p>
                </div>
                <Switch
                  v-model="smsNotifications"
                  @update:modelValue="updateNotificationSettings"
                  :class="[
                    smsNotifications
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600',
                  ]"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span
                    :class="[
                      smsNotifications ? 'translate-x-6' : 'translate-x-1',
                    ]"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Preferences Section -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div class="p-4 sm:p-6 border-b dark:border-gray-700">
            <h2 class="text-lg font-medium flex items-center">
              <Icon
                name="heroicons:briefcase"
                class="w-5 h-5 mr-2 text-blue-500"
              />
              <span
                :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
              >
                {{ $t("settings.work_preferences.title") }}
              </span>
            </h2>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Available Hours -->
            <div class="p-4 sm:p-6">
              <h3
                class="text-base font-medium mb-2"
                :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
              >
                {{ $t("settings.work_preferences.available_hours") }}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium mb-1"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
                    ]"
                  >
                    {{ $t("settings.work_preferences.start_time") }}
                  </label>
                  <select
                    v-model="workStartTime"
                    @change="updateWorkPreferences"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option
                      v-for="hour in hours"
                      :key="'start-' + hour"
                      :value="hour"
                    >
                      {{ hour }}:00
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium mb-1"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
                    ]"
                  >
                    {{ $t("settings.work_preferences.end_time") }}
                  </label>
                  <select
                    v-model="workEndTime"
                    @change="updateWorkPreferences"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option
                      v-for="hour in hours"
                      :key="'end-' + hour"
                      :value="hour"
                    >
                      {{ hour }}:00
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Service Types -->
            <div class="p-4 sm:p-6">
              <h3
                class="text-base font-medium mb-2"
                :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
              >
                {{ $t("settings.work_preferences.service_types") }}
              </h3>
              <div class="space-y-2">
                <div
                  v-for="service in serviceTypes"
                  :key="service.id"
                  class="flex items-center"
                >
                  <input
                    :id="'service-' + service.id"
                    v-model="selectedServices"
                    type="checkbox"
                    :value="service.id"
                    @change="updateWorkPreferences"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    :for="'service-' + service.id"
                    class="ml-3 block text-sm"
                    :class="[
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
                    ]"
                  >
                    {{ service.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Maximum Distance -->
            <div class="p-4 sm:p-6">
              <h3
                class="text-base font-medium mb-2"
                :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
              >
                {{ $t("settings.work_preferences.max_distance") }}
              </h3>
              <div class="flex items-center space-x-4">
                <input
                  type="range"
                  v-model="maxDistance"
                  min="5"
                  max="50"
                  step="5"
                  @change="updateWorkPreferences"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span
                  class="text-sm w-16"
                  :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
                >
                  {{ maxDistance }} km
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <Modal :show="showPasswordModal" @close="closePasswordModal">
      <template #header>
        <h3
          class="text-lg font-medium leading-6"
          :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
        >
          {{ $t("settings.account.change_password") }}
        </h3>
      </template>

      <div class="mt-4 space-y-4">
        <div>
          <label
            class="block text-sm font-medium mb-1"
            :class="[theme === 'dark' ? 'text-gray-300' : 'text-gray-700']"
          >
            {{ $t("settings.account.current_password") }}
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              :class="{ 'border-red-500': passwordErrors.currentPassword }"
            />
            <button
              type="button"
              @click="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
            >
              <Icon
                :name="
                  showCurrentPassword ? 'heroicons:eye-slash' : 'heroicons:eye'
                "
              />
            </button>
          </div>
          <p
            v-if="passwordErrors.currentPassword"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ passwordErrors.currentPassword }}
          </p>
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            :class="[theme === 'dark' ? 'text-gray-300' : 'text-gray-700']"
          >
            {{ $t("settings.account.new_password") }}
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              :class="{ 'border-red-500': passwordErrors.newPassword }"
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
            >
              <Icon
                :name="
                  showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'
                "
              />
            </button>
          </div>
          <p
            v-if="passwordErrors.newPassword"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ passwordErrors.newPassword }}
          </p>
          <p
            class="mt-1 text-xs"
            :class="[theme === 'dark' ? 'text-gray-400' : 'text-gray-500']"
          >
            {{ $t("settings.account.password_requirements") }}
          </p>
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            :class="[theme === 'dark' ? 'text-gray-300' : 'text-gray-700']"
          >
            {{ $t("settings.account.confirm_password") }}
          </label>
          <div class="relative">
            <input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              :class="{ 'border-red-500': passwordErrors.confirmPassword }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
            >
              <Icon
                :name="
                  showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'
                "
              />
            </button>
          </div>
          <p
            v-if="passwordErrors.confirmPassword"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ passwordErrors.confirmPassword }}
          </p>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="closePasswordModal"
          class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {{ $t("common.cancel") }}
        </button>
        <button
          type="button"
          @click="changePassword"
          :disabled="isChangingPassword"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="!isChangingPassword">{{
            $t("settings.account.change_password")
          }}</span>
          <span v-else class="flex items-center">
            <Icon
              name="heroicons:arrow-path"
              class="animate-spin h-4 w-4 mr-2"
            />
            {{ $t("common.processing") }}
          </span>
        </button>
      </template>
    </Modal>

    <!-- Delete Account Modal -->
    <Modal :show="showDeleteAccountModal" @close="closeDeleteAccountModal">
      <template #header>
        <h3
          class="text-lg font-medium leading-6"
          :class="[theme === 'dark' ? 'text-white' : 'text-gray-900']"
        >
          {{ $t("settings.account.delete_account") }}
        </h3>
      </template>

      <div class="mt-4">
        <p
          class="text-sm"
          :class="[theme === 'dark' ? 'text-gray-300' : 'text-gray-500']"
        >
          {{ $t("settings.account.delete_account_warning") }}
        </p>
        <div class="mt-4">
          <label
            class="block text-sm font-medium mb-1"
            :class="[theme === 'dark' ? 'text-gray-300' : 'text-gray-700']"
          >
            {{ $t("settings.account.enter_password_to_confirm") }}
          </label>
          <input
            v-model="deleteAccountPassword"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            :class="{ 'border-red-500': deleteAccountError }"
          />
          <p
            v-if="deleteAccountError"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ deleteAccountError }}
          </p>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="closeDeleteAccountModal"
          class="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {{ $t("common.cancel") }}
        </button>
        <button
          type="button"
          @click="confirmDeleteAccount"
          :disabled="isDeletingAccount"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="!isDeletingAccount">{{
            $t("settings.account.delete_account")
          }}</span>
          <span v-else class="flex items-center">
            <Icon
              name="heroicons:arrow-path"
              class="animate-spin h-4 w-4 mr-2"
            />
            {{ $t("common.processing") }}
          </span>
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { Switch } from "@headlessui/vue";
import { useI18n } from "vue-i18n";
// import { useTheme } from "~/composables/useTheme";
// import Modal from "~/components/ui/Modal.vue";

const { t, locale } = useI18n();
// const { theme, setTheme } = useTheme();

// Theme and language
const language = ref(locale.value);

// Account settings
const twoFactorEnabled = ref(false);
const showPasswordModal = ref(false);
const showDeleteAccountModal = ref(false);
const isChangingPassword = ref(false);
const isDeletingAccount = ref(false);
const deleteAccountPassword = ref("");
const deleteAccountError = ref("");

// Password change form
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordErrors = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Notification settings
const emailNotifications = ref(true);
const pushNotifications = ref(true);
const smsNotifications = ref(false);

// Work preferences
const hours = Array.from({ length: 24 }, (_, i) => i);
const workStartTime = ref(8);
const workEndTime = ref(17);
const maxDistance = ref(20);
const serviceTypes = ref([
  { id: 1, name: t("settings.work_preferences.regular_cleaning") },
  { id: 2, name: t("settings.work_preferences.deep_cleaning") },
  { id: 3, name: t("settings.work_preferences.window_cleaning") },
  { id: 4, name: t("settings.work_preferences.laundry") },
  { id: 5, name: t("settings.work_preferences.ironing") },
]);
const selectedServices = ref([1, 2, 3]);

// Change language
const changeLanguage = () => {
  locale.value = language.value;
  // Save to localStorage or send to backend
  localStorage.setItem("language", language.value);
};

// Password modal
const openPasswordModal = () => {
  showPasswordModal.value = true;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
  resetPasswordForm();
};

const resetPasswordForm = () => {
  passwordForm.currentPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  passwordErrors.currentPassword = "";
  passwordErrors.newPassword = "";
  passwordErrors.confirmPassword = "";
};

const validatePasswordForm = () => {
  let isValid = true;

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = t(
      "settings.account.errors.current_password_required"
    );
    isValid = false;
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = t(
      "settings.account.errors.new_password_required"
    );
    isValid = false;
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = t(
      "settings.account.errors.password_too_short"
    );
    isValid = false;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = t(
      "settings.account.errors.passwords_dont_match"
    );
    isValid = false;
  }

  return isValid;
};

const changePassword = async () => {
  if (!validatePasswordForm()) return;

  isChangingPassword.value = true;

  try {
    // Call API to change password
    // await api.changePassword(passwordForm);
    showToast(t("settings.account.password_changed_success"), "success");
    closePasswordModal();
  } catch (error) {
    showToast(
      error.message || t("settings.account.password_change_failed"),
      "error"
    );
  } finally {
    isChangingPassword.value = false;
  }
};

// Delete account modal
const openDeleteAccountModal = () => {
  showDeleteAccountModal.value = true;
  deleteAccountPassword.value = "";
  deleteAccountError.value = "";
};

const closeDeleteAccountModal = () => {
  showDeleteAccountModal.value = false;
};

const confirmDeleteAccount = async () => {
  if (!deleteAccountPassword.value) {
    deleteAccountError.value = t("settings.account.errors.password_required");
    return;
  }

  isDeletingAccount.value = true;

  try {
    // Call API to delete account
    // await api.deleteAccount(deleteAccountPassword.value);
    showToast(t("settings.account.account_deleted_success"), "success");
    // Redirect to login or home page
    navigateTo("/");
  } catch (error) {
    deleteAccountError.value =
      error.message || t("settings.account.account_deletion_failed");
  } finally {
    isDeletingAccount.value = false;
  }
};

// Two-factor auth
const toggleTwoFactorAuth = async (enabled) => {
  try {
    // Call API to toggle two-factor auth
    // await api.toggleTwoFactorAuth(enabled);
    showToast(
      enabled
        ? t("settings.account.two_factor_enabled")
        : t("settings.account.two_factor_disabled"),
      "success"
    );
  } catch (error) {
    twoFactorEnabled.value = !enabled; // Revert if failed
    showToast(
      error.message || t("settings.account.two_factor_update_failed"),
      "error"
    );
  }
};

// Notification settings
const updateNotificationSettings = async () => {
  try {
    // Call API to update notification settings
    // await api.updateNotificationSettings({
    //   email: emailNotifications.value,
    //   push: pushNotifications.value,
    //   sms: smsNotifications.value
    // });
    showToast(t("settings.notifications.settings_updated"), "success");
  } catch (error) {
    showToast(
      error.message || t("settings.notifications.update_failed"),
      "error"
    );
  }
};

// Work preferences
const updateWorkPreferences = async () => {
  try {
    // Call API to update work preferences
    // await api.updateWorkPreferences({
    //   startTime: workStartTime.value,
    //   endTime: workEndTime.value,
    //   maxDistance: maxDistance.value,
    //   services: selectedServices.value
    // });
    showToast(t("settings.work_preferences.settings_updated"), "success");
  } catch (error) {
    showToast(
      error.message || t("settings.work_preferences.update_failed"),
      "error"
    );
  }
};

// Load user settings on mount
onMounted(async () => {
  try {
    // Load user settings from API
    // const settings = await api.getUserSettings();
    // twoFactorEnabled.value = settings.twoFactorEnabled;
    // emailNotifications.value = settings.emailNotifications;
    // pushNotifications.value = settings.pushNotifications;
    // smsNotifications.value = settings.smsNotifications;
    // workStartTime.value = settings.workStartTime;
    // workEndTime.value = settings.workEndTime;
    // maxDistance.value = settings.maxDistance;
    // selectedServices.value = settings.selectedServices;
  } catch (error) {
    showToast(error.message || t("settings.load_failed"), "error");
  }
  definePageMeta({
    layout: false,
  });
});
</script>

<style scoped>
/* Custom styles for range input */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
}

.dark input[type="range"]::-webkit-slider-thumb {
  background: #60a5fa;
}

.dark input[type="range"]::-moz-range-thumb {
  background: #60a5fa;
}
</style>
