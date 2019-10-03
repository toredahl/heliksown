<template>
  <div class="boxed">
    <div class="red-box">
        <slot name="title"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'New',
  data () {
    return {
      msg: 'New component'
    }
  },
  methods: {

    }
  }
</script>

<style scoped>

.boxed {
  border: 1px solid grey;
  box-shadow: 1px 1px 2px black;
  padding: 1rem;
  margin: 1rem 0;
}

.red-box {
  background: pink;
  padding: 0.5rem;
  border: 2px solid red;
}


</style>
