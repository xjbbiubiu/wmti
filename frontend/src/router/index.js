import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import QuizPage from '../pages/QuizPage.vue'
import ResultPage from '../pages/ResultPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: QuizPage
  },
  {
    path: '/result/:id',
    name: 'result',
    component: ResultPage
  }
]

const router = createRouter({
  history: createWebHistory('/wmti/'),
  routes
})

export default router
