<template>
  <!----if maid--->
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#191A23] p-2"
    v-if="role === 'Maid'"
  >
    <div
      class="bg-white dark:bg-[#20233f] p-8 font-serif rounded-lg shadow-lg text-center max-w-xl w-full"
    >
      <!-- Stepper Component -->
      <div class="flex justify-between items-center mb-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="{
              'bg-[#B9FF66] text-[#191A23]': currentStep > index,
              'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-[#F3F3F3]':
                currentStep <= index,
            }"
          >
            {{ index + 1 }}
          </div>
          <span
            class="text-xs mt-1"
            :class="{
              'text-[#B9FF66] font-medium': currentStep > index,
              'text-gray-500 dark:text-gray-400': currentStep <= index,
            }"
          >
            {{ step }}
          </span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-2 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Step 1: Personal Information -->
        <div v-if="currentStep === 1" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Personal Information
          </h2>

          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >First Name</label
              >
              <input
                v-model="form.first_name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Middle Name</label
              >
              <input
                v-model="form.middle_name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Last Name</label
              >
              <input
                v-model="form.last_name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
          </div>

          <!-- Birth Date -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Birth Date</label
            >
            <input
              v-model="form.date_of_birth"
              type="date"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
          </div>

          <!-- Gender Dropdown -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Gender</label
            >
            <select
              v-model="form.gender"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            >
              <option value="" disabled selected>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <!-- Religion Dropdown -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Religion</label
            >
            <select
              v-model="form.religion"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            >
              <option value="" disabled selected>Select Religion</option>
              <option value="Christianity">Orthodox Christian</option>
              <option value="Protestant">Protestant</option>
              <option value="Islam">Islam</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <!-- Step 2: Professional Information -->
        <div v-if="currentStep === 2" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Professional Information
          </h2>

          <!-- Skill Selection -->
          <div class="relative mb-4">
            <label class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Skills (Select multiple)</label
            >
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(skill, index) in form.skills"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full bg-[#B9FF66] text-[#191A23] text-sm"
              >
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(index)"
                  class="ml-2 text-[#191A23] hover:text-red-500"
                >
                  ×
                </button>
              </span>
            </div>
            <div class="flex">
              <select
                v-model="selectedSkill"
                class="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              >
                <option value="" disabled selected>Select Skill</option>
                <option value="House Cleaning">House Cleaning</option>
                <option value="Cooking">Cooking</option>
                <option value="Child Care">Child Care</option>
                <option value="Elderly Care">Elderly Care</option>
                <option value="Laundry">Laundry</option>
                <option value="Ironing">Ironing</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="button"
                @click="addSkill"
                class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-r-lg hover:bg-[#A0E55C] transition duration-300"
              >
                Add
              </button>
            </div>
            <input
              v-if="form.skills.includes('Other')"
              v-model="form.otherSkill"
              type="text"
              class="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              placeholder="Please specify other skill"
            />
          </div>

          <!-- Language Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Main Language</label
              >
              <select
                v-model="form.main_language"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              >
                <option value="" disabled selected>Select Language</option>
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="French">French</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Other Language</label
              >
              <input
                v-model="form.other_language"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                placeholder="Separate languages with commas"
              />
            </div>
          </div>

          <!-- Job Time -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Job Time</label
            >
            <select
              v-model="form.job_time"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            >
              <option value="" disabled selected>Select Job Time</option>
              <option value="full time">Full-time</option>
              <option value="part time">Part-time</option>
              <option value="one time">One-time</option>
            </select>
          </div>

          <!-- Address -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Address</label
            >
            <textarea
              v-model="form.address"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            ></textarea>
          </div>

          <!-- Phone Numbers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Phone Number 1</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
                >
                  +251
                </span>
                <input
                  v-model="form.phone_number1"
                  type="tel"
                  placeholder="9xxxxxxxx"
                  class="w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                />
              </div>
            </div>
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Phone Number 2</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
                >
                  +251
                </span>
                <input
                  v-model="form.phone_number2"
                  type="tel"
                  placeholder="9xxxxxxxx"
                  class="w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Document Upload -->
        <div v-if="currentStep === 3" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Document Upload
          </h2>

          <!-- Profile Image -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Profile Image</label
            >
            <input
              type="file"
              @change="handleImageUpload('image', $event)"
              accept="image/*"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <div v-if="form.image" class="mt-2">
              <img
                :src="imagePreview"
                class="h-20 w-20 object-cover rounded-lg border"
              />
            </div>
          </div>

          <!-- Identity Document -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Identity Document</label
            >
            <input
              type="file"
              @change="handleImageUpload('identity_image', $event)"
              accept="image/*"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <div v-if="form.identity_image" class="mt-2">
              <img
                :src="identityPreview"
                class="h-20 w-20 object-cover rounded-lg border"
              />
            </div>
          </div>

          <!-- Criminal Clearance -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Criminal Clearance</label
            >
            <input
              type="file"
              @change="handleImageUpload('criminal_clearance_image', $event)"
              accept="image/*"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <div v-if="form.criminal_clearance_image" class="mt-2">
              <img
                :src="criminalPreview"
                class="h-20 w-20 object-cover rounded-lg border"
              />
            </div>
          </div>
        </div>

        <!-- Step 4: Confirmation -->
        <div v-if="currentStep === 4" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Review Your Information
          </h2>

          <div class="text-left space-y-4">
            <div>
              <h3 class="font-medium dark:text-[#F3F3F3]">
                Personal Information
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Name: {{ form.first_name }} {{ form.middle_name }}
                {{ form.last_name }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Birth Date: {{ form.date_of_birth }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Gender: {{ form.gender }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Religion: {{ form.religion }}
              </p>
            </div>

            <div>
              <h3 class="font-medium dark:text-[#F3F3F3]">
                Professional Information
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Skills: {{ form.skills.join(', ') }}
                <span v-if="form.otherSkill && form.skills.includes('Other')">
                  ({{ form.otherSkill }})
                </span>
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Main Language: {{ form.main_language }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Other Languages: {{ form.other_language }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Job Time: {{ form.job_time }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Address: {{ form.address }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Phone Numbers: +251 {{ form.phone_number1 }},
                {{ form.phone_number2 ? '+251 ' + form.phone_number2 : 'N/A' }}
              </p>
            </div>

            <div>
              <h3 class="font-medium dark:text-[#F3F3F3]">Documents</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Profile Image: {{ form.image ? "Uploaded" : "Not uploaded" }}
              </p>
              <img
                :src="imagePreview"
                class="h-24 w-24 object-cover rounded-lg border"
              />
              <p class="text-gray-600 dark:text-gray-300">
                Identity Document:
                {{ form.identity_image ? "Uploaded" : "Not uploaded" }}
              </p>
              <img
                :src="identityPreview"
                class="h-24 w-24 object-cover rounded-lg border"
              />
              <p class="text-gray-600 dark:text-gray-300">
                Criminal Clearance:
                {{
                  form.criminal_clearance_image ? "Uploaded" : "Not uploaded"
                }}
              </p>
              <img
                :src="criminalPreview"
                class="h-24 w-24 object-cover rounded-lg border"
              />
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-center mt-6 mb-4">
            <input
              type="checkbox"
              v-model="form.agreeTerms"
              class="mr-2 accent-[#B9FF66]"
              required
            />
            <label class="text-gray-700 dark:text-[#F3F3F3]">
              I agree to the
              <a href="#" class="text-[#B9FF66] hover:underline"
                >Terms & Conditions</a
              >
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-lg text-gray-700 dark:text-[#F3F3F3] hover:bg-gray-100 dark:hover:bg-[#191A23] transition duration-300"
          >
            Previous
          </button>
          <button
            v-else
            @click="skipToLastStep"
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-lg text-gray-700 dark:text-[#F3F3F3] hover:bg-gray-100 dark:hover:bg-[#191A23] transition duration-300"
          >
            Skip
          </button>

          <button
            v-if="currentStep < steps.length"
            @click="nextStep"
            type="button"
            class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-lg hover:bg-[#A0E55C] transition duration-300"
          >
            Next
          </button>
          <button
            v-else
            type="submit"
            class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-lg hover:bg-[#A0E55C] transition duration-300"
            :disabled="!form.agreeTerms || isLoading"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else>Complete Registration</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  <!---if Household-->
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#191A23] p-2"
    v-if="role === 'Household'"
  >
    <div
      class="bg-white dark:bg-[#20233f] p-8 font-serif rounded-lg shadow-lg text-center max-w-xl w-full"
    >
      <!-- Stepper Component -->
      <div class="flex justify-between items-center mb-8">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="{
              'bg-[#B9FF66] text-[#191A23]': currentStep > index,
              'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-[#F3F3F3]':
                currentStep <= index,
            }"
          >
            {{ index + 1 }}
          </div>
          <span
            class="text-xs mt-1"
            :class="{
              'text-[#B9FF66] font-medium': currentStep > index,
              'text-gray-500 dark:text-gray-400': currentStep <= index,
            }"
          >
            {{ step }}
          </span>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-2 bg-red-100 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Step 1: Personal Information -->
        <div v-if="currentStep === 1" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Personal Information
          </h2>

          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >First Name</label
              >
              <input
                v-model="form.first_name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Middle Name</label
              >
              <input
                v-model="form.middle_name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Last Name</label
              >
              <input
                v-model="form.last_name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
              />
            </div>
          </div>

          <!-- Birth Date -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Birth Date</label
            >
            <input
              v-model="form.date_of_birth"
              type="date"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
          </div>

          <!-- Gender Dropdown -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Gender</label
            >
            <select
              v-model="form.gender"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            >
              <option value="" disabled selected>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <!-- Step 2: Contact & Residence Information -->
        <div v-if="currentStep === 2" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Contact Information
          </h2>

          <!-- Phone Numbers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Phone Number 1</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
                >
                  +251
                </span>
                <input
                  v-model="form.phone_number1"
                  type="tel"
                  placeholder="9xxxxxxxx"
                  class="w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                />
              </div>
            </div>
            <div class="relative">
              <label
                class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
                >Phone Number 2</label
              >
              <div class="flex">
                <span
                  class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
                >
                  +251
                </span>
                <input
                  v-model="form.phone_number2"
                  type="tel"
                  placeholder="9xxxxxxxx"
                  class="w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
                />
              </div>
            </div>
          </div>

          <!-- Religion Dropdown -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Religion</label
            >
            <select
              v-model="form.religion"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            >
              <option value="" disabled selected>Select Religion</option>
              <option value="Christianity">Orthodox Christian</option>
              <option value="Protestant">Protestant</option>
              <option value="Islam">Islam</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Address -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Address</label
            >
            <textarea
              v-model="form.address"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            ></textarea>
          </div>
        </div>

        <!-- Step 3: Document Upload -->
        <div v-if="currentStep === 3" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Document Upload
          </h2>

          <!-- Profile Image -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Profile Image</label
            >
            <input
              type="file"
              @change="handleImageUpload('image', $event)"
              accept="image/*"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <div v-if="form.image" class="mt-2">
              <img
                :src="imagePreview"
                class="h-20 w-20 object-cover rounded-lg"
              />
            </div>
          </div>

          <!-- Identity Document -->
          <div class="relative mb-4">
            <label
              class="block text-left text-gray-700 dark:text-[#F3F3F3] mb-2"
              >Identity Document</label
            >
            <input
              type="file"
              @change="handleImageUpload('identity_image', $event)"
              accept="image/*"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B9FF66] dark:bg-[#191A23] dark:text-[#F3F3F3] dark:border-[#F3F3F3]"
            />
            <div v-if="form.identity_image" class="mt-2">
              <img
                :src="identityPreview"
                class="h-20 w-20 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        <!-- Step 4: Confirmation -->
        <div v-if="currentStep === 4" class="slide-in">
          <h2 class="text-xl font-semibold mb-4 text-left dark:text-[#F3F3F3]">
            Review Your Information
          </h2>

          <div class="text-left space-y-4">
            <div>
              <h3 class="font-medium dark:text-[#F3F3F3]">
                Personal Information
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Name: {{ form.first_name }} {{ form.middle_name }}
                {{ form.last_name }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Birth Date: {{ form.date_of_birth }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Gender: {{ form.gender }}
              </p>
            </div>

            <div>
              <h3 class="font-medium dark:text-[#F3F3F3]">
                Contact Information
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Phone Numbers: +251 {{ form.phone_number1 }},
                {{ form.phone_number2 ? '+251 ' + form.phone_number2 : 'N/A' }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Religion: {{ form.religion }}
              </p>
              <p class="text-gray-600 dark:text-gray-300">
                Address: {{ form.address }}
              </p>
            </div>

            <div>
              <h3 class="font-medium dark:text-[#F3F3F3]">Documents</h3>
              <div class="flex space-x-4">
                <div v-if="form.image">
                  <p class="text-gray-600 dark:text-gray-300 mb-1">
                    Profile Image:
                  </p>
                  <img
                    :src="imagePreview"
                    class="h-24 w-24 object-cover rounded-lg border"
                  />
                </div>
                <div v-if="form.identity_image">
                  <p class="text-gray-600 dark:text-gray-300 mb-1">
                    Identity Document:
                  </p>
                  <img
                    :src="identityPreview"
                    class="h-24 w-24 object-cover rounded-lg border"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-center mt-6 mb-4">
            <input
              type="checkbox"
              v-model="form.agreeTerms"
              class="mr-2 accent-[#B9FF66]"
              required
            />
            <label class="text-gray-700 dark:text-[#F3F3F3]">
              I agree to the
              <a href="#" class="text-[#B9FF66] hover:underline"
                >Terms & Conditions</a
              >
            </label>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-lg text-gray-700 dark:text-[#F3F3F3] hover:bg-gray-100 dark:hover:bg-[#191A23] transition duration-300"
          >
            Previous
          </button>
          <button
            v-else
            @click="skipToLastStep"
            type="button"
            class="px-4 py-2 border border-gray-300 dark:border-[#F3F3F3] rounded-lg text-gray-700 dark:text-[#F3F3F3] hover:bg-gray-100 dark:hover:bg-[#191A23] transition duration-300"
          >
            Skip
          </button>

          <button
            v-if="currentStep < steps.length"
            @click="nextStep"
            type="button"
            class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-lg hover:bg-[#A0E55C] transition duration-300"
          >
            Next
          </button>
          <button
            v-else
            type="submit"
            class="px-4 py-2 bg-[#B9FF66] text-[#191A23] font-semibold rounded-lg hover:bg-[#A0E55C] transition duration-300"
            :disabled="!form.agreeTerms || isLoading"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else>Complete Registration</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import backendAPI from "@/networkServices/api/backendApi.js";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const authStore = useAuthStore();

// Stepper configuration
const steps = ref(["Personal", "Contact", "Documents", "Confirm"]);
const currentStep = ref(1);
const isLoading = ref(false);
const errorMessage = ref("");
const selectedSkill = ref("");

// Form data - combined for both roles
const form = ref({
  // Common fields
  first_name: "",
  middle_name: "",
  last_name: "",
  gender: "",
  religion: "",
  address: "",
  phone_number1: "",
  phone_number2: "",

  // Household specific
  date_of_birth: "",

  // Maid specific
  skill: "", // Single skill field for backend
  skills: [], // For frontend multiple selection
  otherSkill: "", // For "Other" skill specification
  main_language: "",
  other_language: "",
  job_time: "",

  // Documents
  image: null,
  identity_image: null,
  criminal_clearance_image: null, // Maid only

  // Terms
  agreeTerms: false,
  roleId: id.value,
});

// Image previews
const imagePreview = computed(() => {
  return form.value.image ? URL.createObjectURL(form.value.image) : "";
});

const identityPreview = computed(() => {
  return form.value.identity_image
    ? URL.createObjectURL(form.value.identity_image)
    : "";
});

const criminalPreview = computed(() => {
  return form.value.criminal_clearance_image
    ? URL.createObjectURL(form.value.criminal_clearance_image)
    : "";
});

// Handle file uploads
const handleImageUpload = (field, event) => {
  const file = event.target.files[0];
  if (file) {
    form.value[field] = file;
  }
};

// Skill management
const addSkill = () => {
  if (selectedSkill.value && !form.value.skills.includes(selectedSkill.value)) {
    form.value.skills.push(selectedSkill.value);
    selectedSkill.value = "";
  }
};

const removeSkill = (index) => {
  form.value.skills.splice(index, 1);
};

// Navigation functions
const nextStep = () => {
  errorMessage.value = "";
  currentStep.value++;
};

const prevStep = () => {
  errorMessage.value = "";
  currentStep.value--;
};

const skipToLastStep = () => {
  router.push("/");
};

const role = computed(() => {
  switch (id.value) {
    case "2":
      return "Household";
    case "3":
      return "Maid";
    default:
      return "";
  }
});

// API Submission
const handleSubmit = async () => {
  if (!form.value.agreeTerms) {
    errorMessage.value = "Please agree to the Terms & Conditions";
    return;
  }

  // Validate at least one skill is selected for Maid role
  if (role.value === 'Maid' && form.value.skills.length === 0) {
    errorMessage.value = "Please select at least one skill";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  try {
    const formData = new FormData();

    // Append all form fields
    Object.keys(form.value).forEach((key) => {
      // Skip the frontend-only skills array
      if (key === 'skills') return;
      
      if (
        key === "image" ||
        key === "identity_image" ||
        key === "criminal_clearance_image"
      ) {
        if (form.value[key]) {
          formData.append(key, form.value[key]);
        }
      } else if (form.value[key] !== null && form.value[key] !== undefined) {
        formData.append(key, form.value[key]);
      }
    });

    // Convert skills array to comma-separated string for the backend
    if (form.value.skills.length > 0) {
      formData.append("skill", form.value.skills.join(', '));
    }

    // Append other skill if "Other" is selected
    if (form.value.skills.includes("Other") && form.value.otherSkill) {
      formData.append("other_skill", form.value.otherSkill);
    }

    const response = await backendAPI.post("/create-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    if (response.data) {
      router.push("/");
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      errorMessage.value = Object.values(errors).flat().join(", ");
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: "custom",
});
</script>

<style scoped>
.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>