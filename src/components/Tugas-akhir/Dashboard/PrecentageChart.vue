<script setup>
import { computed } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

// Ambil data valid dan belum divalidasi dari chartValue
const props = defineProps({
  chartValue: {
    type: Array,
    default: () => [],
    required: true,
  },
});

// Misal: chartValue = [valid, belumValidasi]
const centerLabel = computed(() => {
  const [valid = 0, belum = 0] = props.chartValue;
  return {
    valid,
    total: valid + belum,
  };
});

// Plugin custom untuk label tengah
const centerText = {
  id: "centerText",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { left, top, width, height },
    } = chart;
    ctx.save();

    const valid = centerLabel.value.valid;
    const total = centerLabel.value.total;
    const validText = String(valid);
    const totalText = " / " + total;

    // Gunakan diameter chart (rata-rata width dan height)
    const diameter = Math.min(width, height);

    // Scaling font size berdasarkan diameter
    let validFontPercent = diameter < 200 ? 0.18 : 0.22;
    let totalFontPercent = diameter < 200 ? 0.08 : 0.1;

    let validFontSize = Math.max(Math.round(diameter * 0.1), 8); // 22% dari diameter
    let totalFontSize = Math.max(Math.round(diameter * 0.05), 6); // 10% dari diameter

    // Batas maksimum agar tidak terlalu besar
    validFontSize = Math.min(validFontSize, 32);
    totalFontSize = Math.min(totalFontSize, 18);

    let validFont = `bold ${validFontSize}px Poppins`;
    let totalFont = `${totalFontSize}px Poppins`;

    // Maksimum lebar label (misal 70% diameter)
    const maxLabelWidth = diameter * 0.7;

    ctx.font = validFont;
    let validWidth = ctx.measureText(validText).width;
    ctx.font = totalFont;
    let totalWidth = ctx.measureText(totalText).width;
    let totalLabelWidth = validWidth + totalWidth;

    // Perkecil font sampai muat
    while (
      totalLabelWidth > maxLabelWidth &&
      validFontSize > 6 &&
      totalFontSize > 6
    ) {
      validFontSize -= 1;
      totalFontSize -= 1;
      validFont = `bold ${validFontSize}px Poppins`;
      totalFont = `${totalFontSize}px Poppins`;
      ctx.font = validFont;
      validWidth = ctx.measureText(validText).width;
      ctx.font = totalFont;
      totalWidth = ctx.measureText(totalText).width;
      totalLabelWidth = validWidth + totalWidth;
    }

    const startX = left + width / 2 - totalLabelWidth / 2;
    const centerY = top + height / 2;

    ctx.font = validFont;
    ctx.fillStyle = "#222";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(validText, startX, centerY);

    ctx.font = totalFont;
    ctx.fillStyle = "#888";
    ctx.fillText(totalText, startX + validWidth, centerY);

    ctx.restore();
  },
};

ChartJS.register(ArcElement, Tooltip, Legend, centerText);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const data = computed(() => ({
  labels: ["Valid", "Belum Validasi"],
  datasets: [
    {
      data: props.chartValue,
      backgroundColor: ["#62B2FD", "#9BDFC4"],
    },
  ],
}));
</script>

<template>
  <div class="w-full h-[30vh] min-h-[100px] max-h-[400px]">
    <Doughnut :data="data" :options="options" />
  </div>
</template>
