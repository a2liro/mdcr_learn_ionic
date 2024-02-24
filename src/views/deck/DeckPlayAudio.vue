<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Voltar" :defaultHref="`/courses/home/${currentDeck.course_id}`"></ion-back-button>
        </ion-buttons>
        <ion-title size="large">Playing audio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div v-show="noNetwork" class="no-network">
        <h3>Não conseguimos conectar a internet</h3>
        <ion-button @click="refreshClick()">
          <ion-icon slot="start" :icon="refreshOutline"></ion-icon>
          Atualizar
        </ion-button>
      </div>
      <div id="container" v-show="!noNetwork">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Audio:</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <audio controls autoplay v-if="card?.audiofile" :id="'audio' + Math.random()" ref="elementAudio">
              <source id="audio-source" ref="elementSource" :src="server + '/' + card?.audiofile" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </ion-card-content>
        </ion-card>

      </div>
    </ion-content>
    <ion-footer v-show="!noNetwork">
      <ion-toolbar>
        <ion-title>
          <ion-button expand="block" fill="outline" @click="$router.push('/deck/play/front/' + card.id)">
            Continue
            <ion-icon slot="end" :icon="chevronForward"></ion-icon>
          </ion-button>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
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
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  onIonViewDidEnter,
  IonFooter,
  IonIcon,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillLeave,
  useIonRouter,
} from '@ionic/vue';
import { chevronForward, refreshOutline } from 'ionicons/icons';

import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import cardStore from '@/stores/cardStore';
import deckStore from '@/stores/deckStore';

import { ref } from 'vue';
import server from '@/config/server';
import { useRoute } from 'vue-router';

const router = useIonRouter();

const route = useRoute();
const card = ref([])
const currentDeck = ref([])

const audioAsset = ref({});
const loading = ref<HTMLIonLoadingElement>();
const noNetwork = ref(false)
const elementSource = ref(null);
const elementAudio = ref(null);

onIonViewDidEnter(async () => {
  await getData()
  if (!currentDeck.value.is_english || currentDeck.value.is_english == 0) {
    router.replace('/deck/play/front/' + card.value.id)
  } else {
    elementSource.value?.addEventListener('error', (event: Event) => {
      noNetwork.value = true
    })
  }
});

const getData = async function () {
  try {
    loading.value = await showLoading();
    noNetwork.value = false;
    card.value = [];
    card.value = await cardStore.getCard();
    currentDeck.value = await deckStore.getCurrentDeck();
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
  location.reload();
};

const refreshClick = async (event: CustomEvent) => {
  location.reload();
};

onIonViewWillLeave(() => {
  if (elementAudio.value) {
    elementAudio.value.pause();
    elementAudio.value.currentTime = 0;
  }
})


</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 3em; */
}

#swiper-categories {
  background-color: rgb(86, 120, 91);
  height: 4em;
  padding-left: 1em;
  padding-right: 1em;
  box-shadow: 1px 8px 15px #9f9f9f;
}

.category-name {
  color: rgb(245, 245, 245);
}

ion-alert.custom-alert {
  --backdrop-opacity: 0.7;
}
</style>

<style>
.custom-alert .alert-button-group {
  padding: 8px;
}

button.alert-button.alert-button-confirm {
  background-color: var(--ion-color-success);
  color: var(--ion-color-success-contrast);
}

.md button.alert-button.alert-button-confirm {
  border-radius: 4px;
}

.ios .custom-alert button.alert-button {
  border: 0.55px solid rgba(var(--ion-text-color-rgb, 0, 0, 0), 0.2);
}

.ios button.alert-button.alert-button-cancel {
  border-right: 0;
  border-bottom-left-radius: 13px;
  border-top-left-radius: 13px;
}

.ios button.alert-button.alert-button-confirm {
  border-bottom-right-radius: 13px;
  border-top-right-radius: 13px;
}
</style>
