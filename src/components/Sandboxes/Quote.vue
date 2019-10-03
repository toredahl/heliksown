<template>
  <div class="testorama">

    <div class="title">
        <slot name="title"></slot>
    </div>
    <hr>
    <h3>Another one strikes the dust</h3>
    <slot name="content"></slot>
    <hr>
    <h3>unamed slot:</h3>

  </div>
</template>

<script>
export default {
  name: 'Quote',
  data () {
    return {
      msg: 'Welcome Vanilla'
    }
  },
  methods: {
      methodMan: function () {
        alert("Hello, Method Man!");
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  .title {
    font-variant: italic;
  }

</style>
