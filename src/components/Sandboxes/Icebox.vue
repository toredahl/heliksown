<template>
  <div class="boxed">
    <h1>{{ msg }}</h1>

    
  </div>
</template>

<script>
export default {
  name: 'Icebox',
  data () {
    return {
      msg: 'Welcome Icebox'
    }
  },
  methods: {
      methodMan: function () {
        alert("Hello, Ice!");
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  h1, h2 {
    font-weight: normal;
  }
  .boxed {
    border: 1px solid grey;
    box-shadow: 1px 1px 2px black;
    padding: 2rem;
  }

</style>
