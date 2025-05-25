<template>
  <div @mousedown.self="handleBackdropClick"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-11/12 max-w-md p-6 bg-white card-rounded">
      <div class="flex items-center justify-between ">
        <p class="body2-bold">{{ headText }}</p>
        <button @click="close" class="p-2 rounded-full hover:bg-placeholder/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-6 h-6 align-top">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p class="mt-2 body4-bold text-black/60">{{ bodyText }}</p>
      <div class="flex gap-2 mt-4">
        <Button v-if="showCancel" variant="danger" @click="close" class="flex-1">
          {{ cancelText }}
        </Button>
        <Button v-if="showSubmit" variant="primary" :disabled="countdown > 0" @click="submit" class="relative flex-1">
          {{ submitText }} <span v-if="countdown > 0">({{ countdown }})</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Button from '@/components/Tugas-akhir/Button.vue';

const props = defineProps({
  headText: {
    type: String,
    default: 'Pastikan blablabla!'
  },
  bodyText: {
    type: String,
    default: 'Anda tidak dapat blablabla.'
  },
  submitText: {
    type: String,
    default: 'Submit'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showSubmit: {
    type: Boolean,
    default: true
  },
  enableTimer: {
    type: Boolean,
    default: true
  },
  timerDuration: {
    type: Number,
    default: 5
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  }
});

// Event emitter
const emit = defineEmits(['submit', 'close']);

// State
const countdown = ref(0);
let timerInterval = null;

// Methods
const startTimer = () => {
  if (props.enableTimer) {
    countdown.value = props.timerDuration;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value -= 1;
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
  }
};

const close = () => {
  clearInterval(timerInterval);
  emit('close');
};

const handleBackdropClick = () => {
  if (props.closeOnClickOutside) {
    close();
  }
};

const submit = () => {
  if (countdown.value === 0) {
    emit('submit');
    close();
  }
};


// Clean up timer when component is unmounted
onUnmounted(() => {
  clearInterval(timerInterval);
});

onMounted(() => {
  // Start the timer when the modal is opened
  startTimer();
});

</script>

<style scoped>
/* Optional: Add animation for countdown */
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.absolute {
  animation: pulse 1s infinite;
}
</style>