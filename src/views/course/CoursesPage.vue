<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text="Voltar"></ion-back-button>
        </ion-buttons>
        <ion-title>Cursos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <ion-grid>
          <ion-row>
            <ion-col size="12" size-md="4" size-lg="3" v-for="course in courses" :key="course">
              <ion-card @click="$router.push('/courses/home/' + course.id)">
                <img alt="Course logo" :src="server + '/' + course.thumbnail" />
                <ion-card-header>
                  <!-- <ion-card-title>{{ course.name }}</ion-card-title> -->
                  <ion-card-subtitle>{{ course.name }}</ion-card-subtitle>
                </ion-card-header>

                <!-- <ion-card-content>
            Nothing here
          </ion-card-content> -->
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

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
  IonBackButton,
  IonItem,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  onIonViewDidEnter,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/vue';
import userService from '@/services/userService';
import courseService from '@/services/courseService';

import { ref } from 'vue';
import server from '@/config/server';
const email = ref('andreliro1945@gmail.com');
const password = ref('12345678');
const courses = ref([])

onIonViewDidEnter(async () => {
  console.log('teste');
  courses.value = await courseService.getCourses();
  console.log('ccccccccccccc', courses.value)
});

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
