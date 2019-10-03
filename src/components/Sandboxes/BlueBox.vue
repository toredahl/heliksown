<template>
  <div class="boxed">
    <div class="blue-box">
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlueBox',
  data () {
    return {
      msg: 'Blue component'
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

.blue-box {
  background: lightblue;
  padding: 0.5rem;
  border: 2px solid skyblue;
}


</style>
