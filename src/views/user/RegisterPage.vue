<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title>Cadastro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <div class="logo-container">
          <ion-img src="/assets/images/logo_001_512x512.png" class="logo"></ion-img>
        </div>
        <ion-item>
          <ion-input label="Nome" type="text" v-model="name" label-placement="floating"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Email" type="email" placeholder="email@exemplo.com" v-model="email" label-placement="floating"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Senha" type="text" v-model="password" label-placement="floating"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Confirmar Senha" type="text" v-model="passwordConfirmation" label-placement="floating"></ion-input>
        </ion-item>
        <ion-button fill="outline" @click="register" strong="true" class="btn-register">Cadastrar</ion-button>
      </div>
    </ion-content>
    <ion-alert :is-open="isOpen" header="Atenção" sub-header="Credenciais inválidas" message="Tente novamente ou vá para o formulário de recuperação de senha!"
      :buttons="alertButtons" @didDismiss="setOpen(false)"></ion-alert>
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
  IonAlert,
  IonImg
} from '@ionic/vue';
import userService from '@/services/userService';
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const user = ref({})

const router = useIonRouter();

const isOpen = ref(false);
const alertButtons = ['OK'];

async function register() {
  user.value = await userService.register(email.value, password.value);
  console.log(user.value)
  if (user.value.id) {
    router.navigate('/courses');
  }else {
    setOpen(true)
  }
}



const setOpen = (state: boolean) => {
  isOpen.value = state;
};
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
  padding-top: 2em;
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

.btn-register {
  margin: 2em;
  width: 12em;
}

.logo {
  max-width: 6em;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3em;
}

/* .register-actions {
  background-color: rgb(235, 229, 229);
} */

h3 {
  color: #2d4735;
}

.register-actions div {
  margin: 1em;
}
</style>
