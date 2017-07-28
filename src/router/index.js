import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Article from '@/components/Article'
import Login from '@/components/Login'
import Post from '@/components/Post'
import User from '@/components/User'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/article/:id',
      component: Article
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/post',
      component: Post
    },
    {
      path: '/user',
      component: User
    }
  ]
})
