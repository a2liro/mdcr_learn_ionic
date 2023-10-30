<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <ion-item>
          <ion-input label="Email" type="email" placeholder="email@exemplo.com" v-model="email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Senha" type="password" v-model="password"></ion-input>
        </ion-item>
        <ion-button color="primary" @click="login">Login</ion-button>
      </div>
      {{ user }}
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
  IonBackButton,
  IonItem,
  IonInput,
  IonButton,
useIonRouter,
} from '@ionic/vue';
import userService from '@/services/userService';
import { ref } from 'vue';

const email = ref('andreliro1945@gmail.com');
const password = ref('12345678');
const user = ref({})

const router = useIonRouter();

async function login() {
   user.value = await userService.login(email.value, password.value);
  if(user) {
    router.navigate('/courses');
  }
}
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
</style>
