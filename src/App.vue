<template>
  <div class="container-grid">
    <header class="hide">A Responsive Twelve Column Grid</header>
    <nav>
      <ul>
        <li><router-link to="/heliksmap">  HeliksMap</router-link></li>
        <li><router-link to="/helloworld"> HelloWorld</router-link></li>
        <li><router-link to="/plantesamling"> Plantesamling</router-link></li>
      </ul>
    </nav>

    <div class="wrapper">

      <div class="left">
        <h3>advice</h3>
        <div class="thin-box"> {{advice}} </div>
      </div>

      <div class="middle">
          <router-view/>
      </div>

      <div class="right">
        <h3>{{category}}</h3>
        <div class="question-box"> {{question}} </div>
        <br>
        <div class="answer-box" v-if="showQuestion">
          {{answer}}
        </div>
      </div>

      <div class="full hide">
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
      advice: 'Advice',
      endpoint: 'https://api.adviceslip.com/advice',
      question: 'This is the question',
      category: 'Category',
      answer: 'The answer will follow',
      questions: [],
      showQuestion: true,
      counter: 0,
      q_endpoint: '/api/v1/questions'
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
    },
    getQuestion: function() {
      axios.get(this.q_endpoint)
        .then(response => {
          this.questions = response.data.qcollection;
        })
        .catch(error => {
            console.log('-----error-------');
            console.log(error);
        })
    },
    setAnswer: function(){
      this.answer = "currentAnswer";
    },
    setQuestion: function(){
      var self = this;
      this.question = this.questions[this.counter].question;
      this.category = this.questions[this.counter].category.title;
      this.answer = "Answer will follow..."; //
      var currentAnswer = this.questions[this.counter].answer;
      setTimeout(function(){
        self.showQuestion = true;
        self.answer = currentAnswer.toUpperCase();
      }, 8000);
      this.counter++;
      if(this.counter>=this.questions.length){
        this.counter = 0;
      }
    }
  },
  mounted: function() {
    this.getAdvice();
    this.getQuestion();
  },
  watch: {
    questions: function() {
      this.setQuestion();
      setInterval(() => {
        this.setQuestion();
      }, 16000);
    }
  },
  created: function() {
    // need to use arrow function for setInterval to work...
    setInterval(() => {
        this.getAdvice();
      }, 30000);
  }
}
</script>

<style lang="scss">
  $menu-blue: #00008b;
  $menu-border: #fff;

  body {
    font-family: 'Quicksand', sans-serif;
    font-weight: 400;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 20px;
  }
  .thin-box, .question-box, .answer-box {
    border: 1px solid #ccc;
    color: #444;
    padding: 0.5rem;
    font-weight: 300;
    box-shadow: 10px 10px 5px -8px rgba(0,0,0,0.75);
  }
  .hoverama {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .answer-box {
    font-style: italic;
  }

  h1 {
    padding: 0;
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

.wrapper {
  display: grid;
  grid-gap: 20px;
   height: 100vh;
}

nav {
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  grid-gap: 10px;
  ul {
    list-style-type: none;
    grid-column: col-start 3;
    li {
      background: $menu-blue;
      border-radius: 18px;
      padding: 0.5rem 1rem;
      margin: 1.5rem 0.75rem;
      border: 1px solid $menu-border;
      &:hover {
        background: white;
        border: 1px solid $menu-blue;
        a {
          color: $menu-blue;
          text-decoration: none;
        }
      }
      a {
        color: white;
      }
    }
  }
}

@media (min-width: 500px) {

  .wrapper {
    grid-template-columns: 1fr 3fr;
  }

  nav ul {
    display: flex;
    justify-content: space-between;
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

@media (max-width: 680px) {
  body{
    font-size: 80%;
  }
  nav {
    ul {
      grid-column: col-start 1;
      padding-left: 1rem;
      li{
        padding: 0.25rem .5rem;
        border: 1px solid #fff;
        text-align: center;
        margin: 0.5rem 0;
      }
    }
  }
}

</style>
