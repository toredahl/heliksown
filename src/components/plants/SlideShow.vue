<template>
  <div id="SlideShow">
    <h1>{{title}}</h1>
    <!-- container displaying the current slide => the data populated from outside -->
    <div id="cardContainer" class="cardHolder">
      <div class="main-image">
        <img :src="currentSlide" alt="">
      </div>
      <div class="card" v-html="currentInfoCard"></div>
    </div>
    <!-- end current slide container -->

    <!-- thumbnails for all the slides -->
    <div class="auto medium-m">
      <div id="thumbs" v-if="showThumbs">
        <span v-for="(slide, index) in this.slideList" class="thumbs" @click="displayMe(index)" :title="slide[1].navn">
          <img :src="slide[1].bildeurl" >
        </span>
      </div>
    </div>
    <!-- end thumbnails -->

    <!-- prev & next buttons -->
    <div class="clearing buttons">
      <button id="left" class="btn btn-info" @click="switchSlide(-1)"><</button>
      <button id="right" class="btn btn-info" @click="switchSlide(1)">></button>
    </div>
    <!-- end prev & next buttons -->

  </div>
</template>

<script>

import Thumbnail from './Thumbnail.vue';

export default {
  name: 'SlideShow',
  data () {
    return {
      placeHolderImg: "https://via.placeholder.com/500.png/09f/fff",
      currentSlideIndex: 0,
      currentSlide: "",
      currentInfoCard: "",
      thumbsGrid: "",
      slideList: [],
      showThumbs: false
    }
  },
  props: {
    title: String,
    slides: Array
  },
  components: {
    'thumbnail': Thumbnail
  },
  created() {
    this.slideList = this.slides;
    this.showThumbs = true;
  },
  watch: {
    slideList: function() {
      this.currentSlide = this.slideList[this.currentSlideIndex][1].bildeurl;
      this.createSlide();
    }
  },
  methods: {
    displayMe: function (index) {
      var slide = this.slideList[index];
      slide = slide[1];
      if(slide.bildeurl){
        this.currentSlide = slide.bildeurl;
        this.currentSlideIndex = index;
        this.createSlide();
      }
    },
    switchSlide: function(count) {
      this.currentSlideIndex += count;
      if(this.currentSlideIndex>=this.slideList.length){
        this.currentSlideIndex = 0;
      }else if (this.currentSlideIndex < 0){
        this.currentSlideIndex = this.slideList.length-1;
      }
      this.currentSlide = this.slideList[this.currentSlideIndex][1].bildeurl;
      this.createSlide();
    },
    createSlide: function() {
      var html = '';
      var slide = this.slideList[this.currentSlideIndex];
      slide = slide[1];
      html += '<h2>' + slide.navn + '</h2>';
      html += '<i>' + slide.latinsknavn + ' | ' +  slide.kultivar + '</i>';
      html += '<span class="order">' + slide.orden + '</span>';
      html += '<dl>';
      html += '<dt>Beskrivelse: </dt><dd>' + slide.beskrivelse + '</dd>';
      html += '<dt>Notat: </dt><dd>' + slide.notat + '</dd>';
      html += '<dt>Ervervet: </dt><dd>' + slide.ervervet + '</dd>';
      html += '</dl>';
      this.currentInfoCard = html;
    }
  }
}
</script>

<style lang="scss">
  #cardContainer {
    height: 72vh;
  }

  #thumbs {
    overflow: scroll;
  }

  .main-image {
    height: 44vh;
    align-items: center;
    display: flex;
    img {
      max-width: 600px;
      // height: 100%;
      // display: block;
      // margin: 0 auto;
    }
  }

  .thumbs {
      float:left;
      display:inline-block;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      border: 2px solid #ccc;
      padding: 0.25rem;
      height: 72px;
      width: 72px;
      &:last-of-type {
        margin-right: 0;
      }
      img {
        max-height: 60px;
        margin: 0 auto;
        display: block;
      }
  }
.card {
  padding: 1rem;
  background: white;
  border: 1px solid #ccc;
  h2 {
      text-transform: lowercase;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  p {
    margin-bottom: 0.15rem;
  }

  .order {
    color: darkseagreen;
    font-weight: 600;
  }

  dl {
    dt {
      color: #888;
      font-weight: 600;
    }
    dd {
      color: #888;
      font-weight: 400;
    }
  }

}
  .cardHolder {
    img {
      width: auto;
      max-width: 500px;
      max-height: 40vh;
      margin: 0 auto;
      display: block;
    }
  }

  .clearing {
    clear:both;
  }

  .buttons {
    margin: 1rem auto;
    width: 20vw;
    clear:both;
  }

  .auto {
    overflow:auto;
  }

  .medium-m {
    margin: 1rem 0;
  }

@media (max-width: 680px) {

  #cardContainer {
    height: auto;
  }

  .main-image {
    height: 30vh;
  }

  .cardHolder {
      img {
        max-width: 260px;
        max-height: 25vh;
    }
  }
}

</style>
