<template>
  <div class="min-h-screen font-sans bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid gap-8 items-center relative min-h-[400px]"
      :style="{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative z-10 text-center text-white">
        <div class="flex justify-center mb-4">
          <Icon
            name="mdi:lightbulb-on-outline"
            class="w-12 h-12 text-lime-400"
          />
        </div>
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          Our Journey
        </h1>
        <p class="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          From classroom theory to real-world impact: How five software
          engineering students built Ethiopia's most trusted maid-matching
          platform.
        </p>
        <div class="flex justify-center">
          <Icon name="mdi:arrow-down" class="w-8 h-8 animate-bounce" />
        </div>
      </div>
    </div>

    <!-- The Beginning -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div class="container mx-auto max-w-5xl">
        <div class="text-center mb-16">
          <div class="flex justify-center mb-4">
            <Icon
              name="mdi:rocket-launch"
              class="w-12 h-12 text-lime-600 dark:text-lime-400"
            />
          </div>
          <h2
            class="text-3xl sm:text-4xl font-bold text-lime-600 dark:text-lime-400 mb-6"
          >
            The Spark
          </h2>
          <p
            class="text-gray-700 dark:text-gray-300 text-xl italic max-w-3xl mx-auto"
          >
            "What if we could solve a problem our families actually face?"
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div class="space-y-6">
            <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              <Icon
                name="mdi:calendar-month"
                class="w-5 h-5 inline mr-1 text-lime-600"
              />
              In November 2025, during our fifth year at Wachemo University, we
              noticed a recurring challenge in our community: families
              struggling to find reliable, trustworthy domestic help. Our own
              parents shared stories of lengthy searches, uncertain backgrounds,
              and mismatched expectations.
            </p>
            <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              <Icon
                name="mdi:code-braces"
                class="w-5 h-5 inline mr-1 text-lime-600"
              />
              As Software Engineering students, we saw an opportunity to apply
              our skills. What began as a classroom discussion evolved into
              late-night coding sessions in the university computer lab, fueled
              by endless cups of coffee and a shared vision.
            </p>
          </div>
          <div class="flex justify-center relative h-96 overflow-hidden">
            <!-- Images with fade transition -->
            <img
              v-for="(image, index) in images"
              :key="index"
              :src="image.src"
              :alt="image.alt"
              class="absolute rounded-lg shadow-xl w-full h-full object-cover transition-opacity duration-1000"
              :class="{
                'opacity-100': currentImageIndex === index,
                'opacity-0': currentImageIndex !== index,
              }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- The Challenge -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto max-w-5xl">
        <div class="flex justify-center mb-8">
          <Icon
            name="mdi:trending-up"
            class="w-12 h-12 text-lime-600 dark:text-lime-400"
          />
        </div>
        <h2
          class="text-3xl sm:text-4xl font-bold text-center text-lime-600 dark:text-lime-400 mb-12"
        >
          Building Through Barriers
        </h2>

        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <div class="flex justify-center mb-4">
              <Icon name="mdi:scale-balance" class="w-10 h-10 text-lime-600" />
            </div>
            <h3 class="font-bold text-xl mb-4 dark:text-white">
              Balancing Acts
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Juggling final-year courses with platform development, often
              working between lectures and late into the night.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <div class="flex justify-center mb-4">
              <Icon name="mdi:account-group" class="w-10 h-10 text-lime-600" />
            </div>
            <h3 class="font-bold text-xl mb-4 dark:text-white">
              Real-World Testing
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our first 100 users were fellow students' families - their honest
              feedback shaped our platform.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <div class="flex justify-center mb-4">
              <Icon name="mdi:shield-lock" class="w-10 h-10 text-lime-600" />
            </div>
            <h3 class="font-bold text-xl mb-4 dark:text-white">
              Technical Hurdles
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              Implementing secure verification systems became our most
              challenging - and rewarding - academic project.
            </p>
          </div>
        </div>

        <div class="mt-16 text-center">
          <Icon
            name="mdi:format-quote-open"
            class="w-8 h-8 text-gray-400 mx-auto mb-4"
          />
          <p
            class="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            We didn't have startup funding or fancy offices. What we had was our
            university's computer lab, our complementary skills, and a problem
            we genuinely wanted to solve.
          </p>
        </div>
      </div>
    </section>

    <!-- The Team -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div class="container mx-auto max-w-6xl">
        <div class="flex justify-center mb-8">
          <Icon
            name="mdi:account-supervisor"
            class="w-12 h-12 text-lime-600 dark:text-lime-400"
          />
        </div>
        <h2
          class="text-3xl sm:text-4xl font-bold text-center text-lime-600 dark:text-lime-400 mb-16"
        >
          The Minds Behind MaidFinder
        </h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div v-for="member in team" :key="member.name" class="text-center">
            <div
              class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm h-full flex flex-col items-center transition-transform hover:scale-105"
            >
              <div
                class="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden border-2 border-lime-500"
              >
                <img
                  :src="member.photo"
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <h3 class="font-bold text-xl dark:text-white mb-1">
                {{ member.name }}
              </h3>
              <p
                class="text-gray-600 dark:text-gray-400 mb-3 flex items-center justify-center"
              >
                <Icon :name="member.icon" class="w-4 h-4 mr-1" />
                {{ member.role }}
              </p>
              <p class="text-gray-700 dark:text-gray-300 text-sm flex-grow">
                {{ member.bio }}
              </p>
              <div class="mt-4 flex space-x-2">
                <a href="#" class="text-gray-500 hover:text-lime-600">
                  <Icon name="mdi:linkedin" class="w-5 h-5" />
                </a>
                <a href="#" class="text-gray-500 hover:text-lime-600">
                  <Icon name="mdi:github" class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 text-center">
          <p
            class="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Together, we combine frontend elegance with backend robustness,
            turning our academic knowledge into practical solutions for
            Ethiopian households.
          </p>
        </div>
      </div>
    </section>

    <!-- The Future -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto max-w-4xl text-center">
        <div class="flex justify-center mb-8">
          <Icon
            name="mdi:future"
            class="w-12 h-12 text-lime-600 dark:text-lime-400"
          />
        </div>
        <h2
          class="text-3xl sm:text-4xl font-bold text-lime-600 dark:text-lime-400 mb-8"
        >
          Where We're Going
        </h2>
        <p
          class="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          As we approach graduation in 2025, MaidFinder has become more than a
          school project - it's our first step in revolutionizing service
          matching across Ethiopia.
        </p>

        <div
          class="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-10 max-w-3xl mx-auto"
        >
          <div class="flex justify-center mb-6">
            <Icon name="mdi:handshake" class="w-12 h-12 text-lime-600" />
          </div>
          <h3 class="text-2xl font-bold mb-6 dark:text-white">
            Join Our Journey
          </h3>
          <p
            class="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed"
          >
            Whether you need domestic help or want to collaborate with
            Ethiopia's next generation of tech innovators, we'd love to connect.
          </p>
          <a
            href="#"
            class="inline-flex items-center px-8 py-3 bg-lime-600 hover:bg-lime-700 text-white font-medium rounded-lg transition-colors text-lg"
          >
            <Icon name="mdi:email" class="w-5 h-5 mr-2" />
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const team = [
  {
    name: "Manuhe Wolde",
    role: "Frontend Architect",
    photo: "/manuhe.jpg",
    bio: "Transforms UI designs into seamless user experiences with clean, efficient code",
    icon: "mdi:code-json",
  },
  {
    name: "Gutu Tamiru",
    role: "Backend Engineer",
    photo: "/gutu.jpg",
    bio: "Builds the secure, scalable systems powering our platform",
    icon: "mdi:server",
  },
  {
    name: "Kenaol Bekele",
    role: "Frontend Developer",
    photo: "/kenaol.jpg",
    bio: "Crafts intuitive interfaces that work across all devices",
    icon: "mdi:monitor",
  },
  {
    name: "Abrham Kassa",
    role: "UX Specialist",
    photo: "/abrham.jpg",
    bio: "Ensures every interaction is intuitive and accessible",
    icon: "mdi:palette",
  },
  {
    name: "Habtamu Fentahun",
    role: "Database Architect",
    photo: "/habtamu.jpg",
    bio: "Designs and optimizes our data infrastructure",
    icon: "mdi:database",
  },
];

const images = ref([
  { src: "Team1.jpg", alt: "Team working in university lab" },
  { src: "Team2.jpg", alt: "Team working in university lab" },
  { src: "Team3.jpg", alt: "Team working in university lab" },
  { src: "Team4.jpg", alt: "Team working in university lab" },
  { src: "Team5.jpg", alt: "Team working in university lab" },
]);

const currentImageIndex = ref(0);

onMounted(() => {
  // Change image every 5 seconds
  setInterval(() => {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % images.value.length;
  }, 5000);
});
</script>
