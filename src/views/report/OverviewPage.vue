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
        <!-- <div>
          <apexchart width="500" type="bar" :options="options" :series="series"></apexchart>
        </div> -->
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
const courses = ref([])
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
    colors: ["#008FFB"],
    title: {
      text: 'Frequência'
    },
  }
)


const loading = ref<HTMLIonLoadingElement>();

// onIonViewWillEnter(async () => {
//   loading.value = await showLoading();
// })

const chartBarRef = ref();

onIonViewDidEnter(async () => {
  await getCourses();
  series2.value = getDates();

  chartBarRef.value.updateOptions({
    dataLabels: {
      enabled: true,
      formatter: function (value, opt) {
        return value
        // if (!isNaN(value)) {
        //   let newValue = new Intl.NumberFormat("pt-BR", {
        //     maximumFractionDigits: 3,
        //   }).format(value);
        //   return newValue + " " + opt.config.series2[opt.seriesIndex].name;
        // } else {
        //   return value;
        // }
      },
    },




    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // console.log(series);
        // console.log(seriesIndex);
        // console.log(dataPointIndex);
        // console.log(labels.value);
        return labels.value[seriesIndex + 1][dataPointIndex]
      }
    }


    // chart: {
    //   height:
    //     categories.value.length > 1 ? categories.value.length * 130 : 230,
    // },
    // xaxis: {
    //   categories: categories.value,
    // },
  });
})

const getCourses = async function () {
  try {
    loading.value = await showLoading();
    noNetwork.value = false;
    courses.value = await reportService.overview();
    // console.log(courses.value);
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

  // console.log(courses.value);


  let seriesOverview = [];



  for (let y = 1; y <= 7; y++) {


    let dateNow = new Date();
    const oneYearAgo = new Date((new Date(dateNow.getTime())).setDate(dateNow.getDate() - 180));
    const weekDaysDifference = oneYearAgo.getDay();
    // const firstDayOfWeekAYearAgo = new Date(oneYearAgo.setDate(oneYearAgo.getDate() - weekDaysDifference))
    const firstDayOfWeekAYearAgo = new Date((new Date(oneYearAgo.getTime())).setDate(oneYearAgo.getDate() - weekDaysDifference));
    firstDayOfWeekAYearAgo.setDate(firstDayOfWeekAYearAgo.getDate() + y)


    let data = []
    labels.value[y] = [];
    let xIndex = 0;

    for (let x = 0; x <= 180 + weekDaysDifference; x += 7) {
      let date = new Date((new Date(firstDayOfWeekAYearAgo.getTime())).setDate(firstDayOfWeekAYearAgo.getDate() + x)) // new Date(firstDayOfWeekAYearAgo.setDate(firstDayOfWeekAYearAgo.getDate() + xIndex * 7))
      const currentRowDate = new Date((new Date(firstDayOfWeekAYearAgo.getTime())).setDate(firstDayOfWeekAYearAgo.getDate() + x))
      const dateToFound = 
      (currentRowDate.getFullYear() + '-' ) + 
      (currentRowDate.getMonth() < 9 ? '0' + (currentRowDate.getMonth() + 1) : (currentRowDate.getMonth() + 1)) + '-' + 
      (currentRowDate.getDate() < 10 ? '0' + currentRowDate.getDate() : currentRowDate.getDate())
      // console.log(courses.value.overview.played)
      let dataDay = courses.value.overview.played.filter(item => {
        console.log('------------------------------', item.created_at.includes(dateToFound))
        return item.created_at.includes(dateToFound)
      })

      console.log('++++++++', dataDay)


      labels.value[y][xIndex] = dateToFound;

      
      data.push({ x: 'w' + xIndex, y: dataDay.length })
      xIndex++;
    }

    seriesOverview.push({
      name: daysOfWeek[firstDayOfWeekAYearAgo.getDay()],
      data: data
    },)


    // let dateNow = new Date();
    // let dateNow2 = new Date(dateNow.getTime());
    // const oneYearAgo = new Date(dateNow.setDate(dateNow.getDate() - 20));
    // const weekDaysDifference = oneYearAgo.getDay();
    // const firstDayOfWeekAYearAgo = new Date(oneYearAgo.setDate(oneYearAgo.getDate() - weekDaysDifference))
    // firstDayOfWeekAYearAgo.setDate(firstDayOfWeekAYearAgo.getDate() + y)


    // let data = []
    // labels.value[y] = [];
    // let xIndex = 0;

    // for (let x = 0; x <= 20 + weekDaysDifference; x += 7) {
    //   let date = new Date(firstDayOfWeekAYearAgo.setDate(firstDayOfWeekAYearAgo.getDate() + xIndex * 7))
    //   labels.value[y][xIndex] = date;
    //   let dataDay = courses.value.overview.played.filter(item => true)
    //   data.push({ x: 'w' + xIndex, y: parseInt(Math.random() * 100) })
    //   xIndex++;
    // }

    // seriesOverview.push({
    //   name: daysOfWeek[firstDayOfWeekAYearAgo.getDay()],
    //   data: data
    // },)
  }

  return seriesOverview;


  // console.log(date, '=====', '-----')

  // console.log(date, '=====', '-----', date.setFullYear(date.getFullYear() - 1), 'iiiiii', date)

  // console.log('@@@', date.setDate(date.getDate() + 3), '***', date, daysOfWeek[date.getDay()])
  // date.setDate( date.getDate() + 1 );
  // date.setFullYear(date.getFullYear() - 1);
  // $("#searchDateFrom").val((date.getMonth() ) + '/' + (date.getDate()) + '/' + (date.getFullYear()));
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
  await getCourses();
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
}
</style>
