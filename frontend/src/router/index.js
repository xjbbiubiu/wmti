import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import QuizPage from '../pages/QuizPage.vue'
import ResultPage from '../pages/ResultPage.vue'
import EarQuizPage from '../pages/EarQuizPage.vue'

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
  },
  {
    path: '/ear-quiz',
    name: 'ear-quiz',
    component: EarQuizPage
  }
]

const router = createRouter({
  history: createWebHistory('/wmti/'),
  routes
})

export default router
