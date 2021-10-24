<template>
  <div class="container mx-auto">
    <div class="w-full text-center">
      <h1>Realms Resource Distribution</h1>
      <p>
        There are 50 Wonders scattered throughout the Realms that are not
        represented in this data.
      </p>
    </div>
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js'
import { resources as resourceData } from '@/composables/utils/resourceColours'

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
)

export default defineComponent({
  setup(props, context) {
    const myChart = ref(null)

    const filteredResources = resourceData.filter((d) => {
      return d.value > 1
    })

    const sortedResources = filteredResources.sort((a, b) => {
      return a.value - b.value
    })

    const resources = sortedResources.map((d) => {
      return d.value
    })
    const traitName = sortedResources.map((d) => {
      return d.trait
    })
    const colours = sortedResources.map((d) => {
      return d.colour
    })
    const data = {
      labels: traitName,
      datasets: [
        {
          label: 'My First Dataset',
          data: resources,
          backgroundColor: colours,
          borderColor: '#000',
          hoverOffset: 20,
        },
      ],
    }
    onMounted(() => {
      const ctx = document.getElementById('myChart')
      myChart.value = new Chart(ctx, {
        type: 'pie',
        data,
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              backgroundColor: '#fff',
              bodyColor: '#000',
            },
            legend: {
              position: 'right',
              labels: {
                color: '#fff',
                font: {
                  size: 16,
                  family: 'EB Garamond, serif',
                },
              },
            },
          },
        },
      })
    })

    return { myChart, resources, colours }
  },
})
</script>
