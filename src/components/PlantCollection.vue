<template>
  <div id="PlantCollection">
    <!-- container displaying the current slide -->
    <div id="cardContainer" class="cardHolder">
      <img :src="currentSlide" alt="">
      <div class="card" v-html="currentInfoCard"></div>
    </div>
    <!-- thumbnails for all the slides -->
    <div class="auto medium-m">
      <ul id="thumbs">
          <li v-for="(slide, index) in slides">
            <img :src="slide.img" :alt="slide.headline"
                 class="thumbs" @click="displayMe(index)"
                 :id="[`index-${index}`]">
          </li>
      </ul>
    </div>
    <!-- prev & next buttons -->
    <div class="clearing buttons">
      <button id="left" class="btn btn-info" @click="switchSlide(-1)"><</button>
      <button id="right" class="btn btn-info" @click="switchSlide(1)">></button>
        <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlantCollection',
  data () {
    return {
      currentSlide: "https://via.placeholder.com/500.png/09f/fff",
      currentSlideIndex: 0,
      currentInfoCard: "",
      slides: [
        {
          headline: "Philodendron xanadu",
          img: "https://mediasv6.truffaut.com/Articles/jpg/0620000/620220_001_1000.jpg",
          description: "Philodendron xanadu, kan bli ca 150 cm. Opprinnelig fra Brasil, Araceae-familien.",
          aquired: "Passiflora, 2019",
          notes: "Virker ikke som den trenger mye vann, kan og stå langt inne i rommet. Denne har ganske små blader. ",
          price: 700,
          color: null,
          id: 1
        },
        {
          headline: "Monstera adonsonii",
          img: "https://cdn.shopify.com/s/files/1/1706/1307/products/Monstera-adansonii-Philodendron-Monkey-Mask-Large.jpg?v=1557652521",
          description: "Kalles også Monkeyface, er litt mindre enn vanlig deliciosa, men bladene kan bli store på eldre eksemplarer",
          notes: "Har vokst en del sommeren 2019, ",
          aquired: "Solheim gartneri, 2019",
          price: 159,
          color: null,
          id: 2
        },
        {
          headline: "Monstera deliciosa borsigiana",
          img: "https://img.crocdn.co.uk/images/products2/pl/20/00/03/20/pl2000032008.jpg",
          description: "Variegert monstera finnes i to varianter, thai og borsigiana. Thai beholder variegeringen, mens borsigiana kan miste sin, man bør derfor ta vekk grener med helgrønne eller nesten helt grønne blader.",
          notes: "Holder den unna direkte sollys, gjerne 2 meter inn i rommet, i mitt tilfelle blir det nærmere tre",
          aquired: "Floriss, Bryn senter, 2019",
          price: 1200,
          color: null,
          id: 3
        },
        {
          headline: "Philodendron birkin",
          img: "https://www.gardentags.com/plant-encyclopedia/images/40244/philodendron-birkin.jpeg",
          description: "Meget pen philodendron",
          notes: "Alt for dyr, i grunnen, og var attpåtil på salg. Bør ha mye lys for å beholde de hvite stripene",
          aquired: "Wellplanting, 2019",
          price: 900,
          color: null,
          id:4
        }
      ],
    }
  },
    mounted: function() {
      console.log("mounted -> this.currentSlideIndex " + this.currentSlideIndex);
      this.currentSlide = this.slides[this.currentSlideIndex].img;
      this.createCard();
    },
    methods: {
      displayMe: function (index) {
        if(this.slides[index].img){
          this.currentSlide = this.slides[index].img;
          this.currentSlideIndex = index;
          this.createCard();
        }
      },
      switchSlide: function(count) {
        this.currentSlideIndex += count;
        if(this.currentSlideIndex>=this.slides.length){
          this.currentSlideIndex = 0;
        }else if (this.currentSlideIndex < 0){
          this.currentSlideIndex = this.slides.length-1;
        }
        this.currentSlide = this.slides[this.currentSlideIndex].img;
        this.createCard();
      },
      createCard: function() {
        var html = '';
        var slide = this.slides[this.currentSlideIndex];
        html += '<h1>' + slide.headline + '</h1>';
        html += '<span><strong>Beskrivelse: </strong>' + slide.description + '</span><br>';
        html += '<span><strong>Notat: </strong>' + slide.notes + '</span><br>';
        html += '<span><strong>Kjøpt: </strong>' + slide.aquired + '</span>';
        this.currentInfoCard = html;
      }
    }
}
</script>
<style scoped>
#thumbs li {
  float:left;
  display:inline-block;
  list-style-type:none;
  margin-right: 1rem;
}

.card {
  padding: 1rem;
  background: white;
  border: 1px solid black;
}

.cardHolder img{
  width: 100%;
}

.thumbs {
  width: 64px;
  border: 2px solid gray;
  padding: 0.25rem;
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
</style>
