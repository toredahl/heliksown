<template>
  <div class="container-grid">
    <header>A Responsive Three Column Grid</header>
    <nav class="middle">
      <ul>
        <li><router-link to="/heliksmap">  HeliksMap</router-link></li>
        <li><router-link to="/helloworld"> HelloWorld</router-link></li>
        <li><router-link to="/plantesamling"> Plantesamling</router-link></li>
      </ul>
    </nav>

    <div class="wrapper">

      <div class="left">
        <div class="thin-box"> {{advice}} </div>
        <!-- <button type="button" name="button" @click="getAdvice">ADVICE ME</button> -->
      </div>

      <div class="middle">
          <router-view/>
      </div>

      <div class="right">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla esse totam odio deserunt, distinctio, repellat cumque ex sequi.
        Dolor non, magnam nobis quae quibusdam facere cum labore dignissimos vero ab!
        div>*2>lorem*3
      </div>

      <div class="full">
        Note: the html * style is to be able to see where each container starts and ends.
      </div>

    </div>

</div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data () {
    return {
      advice: 'ADVICE',
      endpoint: 'https://api.adviceslip.com/advice'
    }
  },
  methods: {
    getAdvice: function() {
      axios.get(this.endpoint)
        .then(response => {
          this.advice = response.data.slip.advice;
        })
        .catch(error => {
            console.log('-----error-------');
            console.log(error);
        })
    },
    initAdvicer: function() {
      setTimeout(function(){ this.getAdvice() }, 3000);
    }
  },
  mounted: function() {
    this.getAdvice();
  },
  created: function() {
    // need to use arrow function for setInterval to work...
    setInterval(() => {
        this.getAdvice();
      }, 30000);
  }
}
</script>

<style>

body {
  font-family: 'Quicksand', sans-serif;
  font-weight: 400;
}

#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}
.thin-box {
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-weight: 300;
}

.hoverama {
  position: absolute;
  left: 0;
  bottom: 0;
}

body {
  font-family: 'Quicksand', sans-serif;
  font-weight: 400;
}

h1 {
  padding: 0.75rem;
}

body .hide {
  display: none;
}

.container-grid {
  max-width: 1880px;
  margin: 0 auto;
}

.html * {
    background: rgba(255, 0, 0, .1);
    box-shadow: 0 0 0 1px red;
}

.main-head {
  grid-area: header;
}
.content {
  grid-area: content;
}
.main-nav {
  grid-area: nav;
}
.side {
  grid-area: sidebar;
}
.ad {
  grid-area: ad;
}
.main-footer {
  grid-area: footer;
}

.wrapper {
  display: grid;
  grid-gap: 20px;
  grid-template-areas:
    "header"
    "nav"
    "content"
    "sidebar"
    "ad"
    "footer";
   height: 100vh;
}

nav ul li {
      margin-right: 2rem;
       padding: 0.5rem;
}

@media (min-width: 500px) {

  .wrapper {
    grid-template-columns: 1fr 3fr;
    grid-template-areas:
      "header  header"
      "nav     nav"
      "sidebar content"
      "ad      footer";
  }

  nav ul {
    display: flex;
    justify-content: space-between;
  }
}

@media (min-width: 700px) {
  .wrapper {
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-areas:
      "header header  header"
      "nav    content sidebar"
      "nav    content ad"
      "footer footer  footer"
   }
   nav ul {
     flex-direction: row;
       grid-column: col-start 3 / span 8;
   }
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  grid-gap: 20px;
}

.left {
  grid-column: col-start / span 2;
  grid-row: 1;
}

.middle {
  grid-column: col-start 3 / span 8;
  grid-row: 1;
}

.right {
  grid-column: col-start 11 / span 2;
  grid-row: 1
}

.full {
  grid-column: col-start  / span 12;
  grid-row: 2
}

.middle,.left,.right {
    padding:1rem;
}

@media (max-width: 900px) {

  .middle {
      grid-column: col-start  / span 12;
  }
  .left {
    grid-row:2;
    grid-column: col-start  / span 12;
  }

  .right {
    grid-row:3;
    grid-column: col-start  / span 12;
  }

  .full {
    grid-row:4;
  }
}

</style>
