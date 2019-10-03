<template>
  <div class="boxed">
    <h1>{{ msg }}</h1>
    
    <button type="button" name="button" @click="methodMan">Vanilla ICE!</button>
  </div>
</template>

<script>
export default {
  name: 'Vanilla',
  data () {
    return {
      msg: 'Welcome Vanilla'
    }
  },
  methods: {
      methodMan: function () {
        alert("Hello, Vanilla!");
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
