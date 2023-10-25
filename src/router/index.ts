import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/folder/:id',
    component: () => import ('../views/FolderPage.vue')
  },
  {
    path: '/home',
    component: () => import ('../views/HomePage.vue')
  },
  {
    path: '/login',
    component: () => import ('../views/user/LoginPage.vue')
  },
  {
    path: '/courses',
    component: () => import ('../views/course/CoursesPage.vue')
  },
  {
    path: '/courses/home/:id',
    component: () => import ('../views/course/CourseHomePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
