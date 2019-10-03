<template>
  <div class="outer">
      <h1>{{ msg }}</h1>
      <p>Quote</p>
      <div class="">
          <h2 slot="title">Amazingly, {{quoteTitle}} </h2>
          <button @click="selectedComponent = 'appQuote'">Quote</button>
          <button @click="selectedComponent = 'appNew'">New</button>
          <button @click="selectedComponent = 'appAuthor'">Author</button>
      </div>

      <br>

      <p> {{ selectedComponent }}</p>
      <keep-alive>
        <component :is="selectedComponent">
          <p>Default innhold</p>
        </component>
      </keep-alive>

      <hr>

      <!-- <red-box>
        <p slot="title">rød boks</p>
        <span>annet innhold</span>
      </red-box>
      <blue-box>
        blå boks
      </blue-box>
      <green-box>
        grønn boks
      </green-box> -->

        <button @click="selectedBox = 'blueBox'">Blå</button>
        <button @click="selectedBox = 'redBox'">Rød </button>
        <button @click="selectedBox = 'greenBox'">Grønn</button>
        <component :is="selectedBox">
          <p> joda</p>
        </component>
  </div>
</template>

<script>
import Quote from './Sandboxes/Quote.vue';
import New from './Sandboxes/New.vue';
import Author from './Sandboxes/Author.vue';
import BlueBox from './Sandboxes/BlueBox.vue';
import GreenBox from './Sandboxes/GreenBox.vue';
import RedBox from './Sandboxes/RedBox.vue';


export default {
  name: 'HelloWorld',
  data: function () {
    return {
      msg: 'Welcome to Your Vue.js App',
      quoteTitle: 'This is the Quote you are looking for',
      selectedComponent: 'appQuote',
      selectedBox: 'blueBox'
    }
  },
  components: {
    appQuote: Quote,
    appNew: New,
    appAuthor: Author,
    redBox: RedBox,
    blueBox: BlueBox,
    greenBox: GreenBox
  },
  methods: {
      hitch: function () {
        console.log("yeah yaeh");
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  color: gold;
}
.outer {
  border: 1px solid grey;
  box-shadow: 1px 1px 2px black;
  padding: 2rem;
  margin: 1rem 0;
}



</style>
