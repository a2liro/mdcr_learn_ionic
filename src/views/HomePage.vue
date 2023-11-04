<template>
  <ion-page>

    <ion-content :fullscreen="true">
      <div id="container">
        <div class="logo-container">
          <ion-img src="/assets/images/logo_001_512x512.png" class="logo"></ion-img>
        </div>
        <div class="market-container">
          <ion-img src="/assets/images/undraw_Online_learning.png" class="market-img-001"></ion-img>
        </div>
        <div class="market-title-container">
          <ion-title>Let's learn English together</ion-title>
        </div>
        <ion-button fill="outline" @click="$router.push('/login')" class="btn-login" strong="true">Login</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonButton,
  IonContent,
  IonPage,
  onIonViewWillEnter,
  useIonRouter,
  IonImg,
  IonTitle
} from '@ionic/vue';

import userStore from '@/stores/userStore';

const router = useIonRouter();


onIonViewWillEnter(async () => {
  const userLogged = await userStore.getUser();
  console.log(userLogged)
  if (userLogged) {
    router.navigate('/courses');
  }
})

</script>

<style scoped>
#container {
  /* text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%); */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 3em;
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

.logo {
  max-width: 6em;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3em;
}

.market-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3em;
}

.market-img-001 {
  width: 80%;
  max-width: 26em;
}

.market-title-container {
  margin-bottom: 2em;
  color: #518561;
}

ion-button {
    --background-hover: #9ce0be;
    --background-activated: #88f4be;
    --background-focused: #88f4be;

    --color: #518561;

    --border-radius: 5px;
    --border-color: #518561;
    --border-style: solid;
    --border-width: 1px;

    --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);

    --ripple-color: deeppink;

    --padding-top: 10px;
    --padding-bottom: 10px;
  }

  .btn-login {
  margin: 2em;
  width: 12em;
}

</style>
