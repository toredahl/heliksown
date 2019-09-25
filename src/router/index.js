import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HeliksMap from '@/components/HeliksMap'
import PlantCollection from '@/components/PlantCollection'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/heliksmap',
      name: 'HeliksMap',
      component: HeliksMap
    },
    {
      path: '/plantesamling',
      name: 'PlantCollection',
      component: PlantCollection
    }
  ]
})
