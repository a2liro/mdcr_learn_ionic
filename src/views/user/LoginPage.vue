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
      
      <div v-if="noNetwork" class="no-network">
        <h3>Não conseguimos conectart a internet</h3>
        <ion-button @click="showLoginContent()">
          <ion-icon slot="start" :icon="refreshOutline"></ion-icon>
          Atualizar
        </ion-button>
      </div>
      <div id="container" v-else>
        <div class="logo-container">
          <ion-img src="/assets/images/logo_001_512x512.png" class="logo"></ion-img>
        </div>
        <ion-item>
          <ion-input label="Email" type="email" placeholder="email@exemplo.com" v-model="email"
            label-placement="floating"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input label="Senha" type="password" v-model="password" label-placement="floating"></ion-input>
        </ion-item>
        <ion-button fill="outline" @click="login" strong="true" class="btn-login">Login</ion-button>
        <h3>Ou</h3>
        <div class="register-actions">
          <div><a href="/recovery-password">Recuperar senha!</a></div>
          <div><a href="/register">Registre-se!</a></div>
        </div>
      </div>
    </ion-content>
    <ion-alert :is-open="isOpen" header="Atenção" sub-header="Credenciais inválidas"
      message="Tente novamente ou vá para o formulário de recuperação de senha!" :buttons="alertButtons"
      @didDismiss="setOpen(false)"></ion-alert>
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
  IonImg,
  loadingController,
  onIonViewWillEnter,
  onIonViewDidEnter,
  IonIcon,
} from '@ionic/vue';
import userService from '@/services/userService';
import { onMounted, ref } from 'vue';
import { refreshOutline } from 'ionicons/icons';

const email = ref('');
const password = ref('');
const user = ref({})

const router = useIonRouter();

const isOpen = ref(false);
const alertButtons = ['OK'];
const loading = ref<HTMLIonLoadingElement>();
const noNetwork = ref(false)

onIonViewWillEnter(async () => {
  loading.value = await showLoading(150);
})

onIonViewDidEnter(async () => {
  await loading.value?.dismiss()
})

async function login() {

  try {
    noNetwork.value = false;
    loading.value = await showLoading(0)
    user.value = await userService.login(email.value, password.value);
    if (user.value?.user?.id) {
      loading.value.dismiss();
      router.navigate('/courses');
    } else {
      setOpen(true)
    }
    loading.value?.dismiss();
  } catch (error) {
    noNetwork.value = true
    console.log(error.message)
    loading.value?.dismiss();
  }

}

const setOpen = (state: boolean) => {
  isOpen.value = state;
};

const showLoading = async function (duration) {
  const loading = await loadingController.create({
    message: 'Loading...',
    mode: 'ios',
    translucent: true,
    duration: duration,
  });

  loading.present();
  return loading
}

const showLoginContent = async function () {
  noNetwork.value = false;
}


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

.btn-login {
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

.no-network ion-button {
  --color: #fcfcfc;
}
</style>
