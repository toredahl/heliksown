<template>
  <div id="PlantCollection">
    <div v-if="show">
      <slideshow :title="myCustomTitle" :slides="plants"></slideshow>
    </div>
  </div>
</template>

<script>

import SlideShow from './plants/SlideShow.vue';

export default {
  name: 'PlantCollection',
  data () {
    return {
       plants: [],
       myCustomTitle: "Plantesamling",
       show: false
    }
  },
  components: {
     'slideshow': SlideShow
  },
  created: function () {
      this.getPlants();
  },
  methods: {
    getPlants: function () {
      this.axios.get('api/v1/plants')
      .then(response => {
        if (response.data) {
          this.plants = response.data.plants;
          this.show = true;
        }
      })
    }
  }
}
</script>

<style lang="scss">

  #PlantCollection {
    max-width: 800px;
    margin: 0 auto;
  }

  .thumbs {
      float:left;
      display:inline-block;
      list-style-type:none;
      margin-right: 1rem;
      border: 2px solid gray;
      padding: 0.25rem;
      img {
        max-width: 72px;
        max-height: 72px;
        width: 80%;
        margin: 0 auto;
        display: block;
      }
  }
.card {
  padding: 1rem;
  background: white;
  border: 1px solid black;
  h1 {
      text-transform: lowercase;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }
  .cardHolder {
    img {
      width: auto;
      max-width: 100%;
      margin: 0 auto;
      display: block;
    }
  }

  .buttons {
    margin: 1rem auto;
    width: 20vw;
    clear:both;
  }
  .clearing {clear:both;}
  .auto {overflow:auto;}
  .medium-m {margin: 1rem 0;}
</style>
