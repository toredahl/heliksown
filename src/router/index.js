import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HeliksMap from '@/components/HeliksMap'
import PlantCollection from '@/components/PlantCollection'
import SlideGallery from '@/components/SlideGallery'

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
    },
    {
      path: '/bildegalleri',
      name: 'SlideGallery',
      component: SlideGallery
    }
  ]
})
