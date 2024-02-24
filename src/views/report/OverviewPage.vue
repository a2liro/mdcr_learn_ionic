<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
          <!-- <ion-back-button defaultHref="/home" text="Voltar"></ion-back-button> -->
        </ion-buttons>
        <ion-title>Relatórios - Overview</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div v-if="noNetwork" class="no-network">
        <h3>Não conseguimos conectar a internet</h3>
        <ion-button @click="getCourses()">
          <ion-icon slot="start" :icon="refreshOutline"></ion-icon>
          Atualizar
        </ion-button>
      </div>
      <div id="container" v-else>
        <div id="chart">
          <apexchart ref="chartBarRef" type="heatmap" height="350" :options="chartOptions" :series="series2"></apexchart>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  onIonViewDidEnter,
  IonCol,
  IonGrid,
  IonRow,
  loadingController,
  IonButton,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
} from '@ionic/vue';
import reportService from '@/services/reportService';
import { refreshOutline } from 'ionicons/icons';


import { ref } from 'vue';
import server from '@/config/server';
import LoginPageVue from '../user/LoginPage.vue';
const overview = ref([])
const noNetwork = ref(false)

const options = ref(
  {
    chart: {
      id: 'vuechart-example'
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    }
  },
)

const series = ref(
  [{
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91]
  }]
)

const series2 = ref<Object[]>([])

const chartOptions = ref(
  {
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false
    },
    // colors: ["#076200"],
    title: {
      text: 'Frequência',
    },
    plotOptions: {
              heatmap: {
                radius: 1,
                enableShades: true,
                colorScale: {
                  ranges: [{
                      from: 0,
                      to: 50,
                      color: '#45f238'
                    },
                    {
                      from: 51,
                      to: 100,
                      color: '#0fb302'
                    },
                    {
                      from: 101,
                      to: 150,
                      color: '#0e9903'
                    },
                    {
                      from: 151,
                      to: 200,
                      color: '#076200'
                    },
                    {
                      from: 201,
                      to: 300,
                      color: '#064501'
                    },
                    {
                      from: 301,
                      to: 2000,
                      color: '#e80000'
                    },
                  ],
                },
            
              }
            },

  }
)


const loading = ref<HTMLIonLoadingElement>();

// onIonViewWillEnter(async () => {
//   loading.value = await showLoading();
// })

const chartBarRef = ref();

onIonViewDidEnter(async () => {
  await fillChart()
})

const fillChart = async function() {
  await getCourses();
  series2.value = getDates();

  chartBarRef.value.updateOptions({
    dataLabels: {
      enabled: true,
      formatter: function (value, opt) {
        return value
        if (!isNaN(value)) {
          let newValue = new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 3,
          }).format(value);
          return newValue + " " + opt.config.series2[opt.seriesIndex].name;
        } else {
          return value;
        }
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return labels.value[seriesIndex + 1][dataPointIndex] + ': ' + series[seriesIndex][dataPointIndex]
      }
    }
  });
}

const getCourses = async function () {
  try {
    loading.value = await showLoading();
    noNetwork.value = false;
    overview.value = await reportService.overview();
    loading.value?.dismiss();
  } catch (error) {
    noNetwork.value = true
    loading.value?.dismiss();
  }
}

const labels = ref([]);

const getDates = function () {

  const daysOfWeek = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
  }

  let seriesOverview = [];



  for (let y = 1; y <= 7; y++) {


    let dateNow = new Date();
    const oneYearAgo = new Date((new Date(dateNow.getTime())).setDate(dateNow.getDate() - 180));
    const weekDaysDifference = oneYearAgo.getDay();
    const firstDayOfWeekAYearAgo = new Date((new Date(oneYearAgo.getTime())).setDate(oneYearAgo.getDate() - weekDaysDifference));
    firstDayOfWeekAYearAgo.setDate(firstDayOfWeekAYearAgo.getDate() + y)


    let data = []
    labels.value[y] = [];
    let xIndex = 0;

    for (let x = 0; x <= 180 + weekDaysDifference; x += 7) {
      let date = new Date((new Date(firstDayOfWeekAYearAgo.getTime())).setDate(firstDayOfWeekAYearAgo.getDate() + x)) // new Date(firstDayOfWeekAYearAgo.setDate(firstDayOfWeekAYearAgo.getDate() + xIndex * 7))
      const currentRowDate = new Date((new Date(firstDayOfWeekAYearAgo.getTime())).setDate(firstDayOfWeekAYearAgo.getDate() + x))
      const dateToFound =
        (currentRowDate.getFullYear() + '-') +
        (currentRowDate.getMonth() < 9 ? '0' + (currentRowDate.getMonth() + 1) : (currentRowDate.getMonth() + 1)) + '-' +
        (currentRowDate.getDate() < 10 ? '0' + currentRowDate.getDate() : currentRowDate.getDate())
      let dataDay = overview.value.overview.played.filter(item => {
        return item.created_at.includes(dateToFound)
      })

      labels.value[y][xIndex] = dateToFound;

      data.push({ x: 'w' + xIndex, y: dataDay[0]?.total ?? 0 })
      xIndex++;
    }

    seriesOverview.push({
      name: daysOfWeek[firstDayOfWeekAYearAgo.getDay()],
      data: data
    },)
  }

  return seriesOverview;

}


const showLoading = async function () {
  const loading = await loadingController.create({
    message: 'Loading...',
    mode: 'ios',
    translucent: true,
  });

  loading.present();
  return loading
}

const handleRefresh = async (event: CustomEvent) => {
  await fillChart()

  event.target.complete();
};

</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-card {
  cursor: pointer;
  color: #076200;
}
</style>
