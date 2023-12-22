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
        <div>
          <apexchart width="500" type="bar" :options="options" :series="series"></apexchart>
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
import courseService from '@/services/courseService';
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


const loading = ref<HTMLIonLoadingElement>();

// onIonViewWillEnter(async () => {
//   loading.value = await showLoading();
// })

onIonViewDidEnter(async () => {
  await getCourses();
})

const getCourses = async function () {
  try {
    loading.value = await showLoading();
    noNetwork.value = false;
    courses.value = await courseService.getCourses();
    loading.value?.dismiss();
  } catch (error) {
    noNetwork.value = true
    loading.value?.dismiss();
  }
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
