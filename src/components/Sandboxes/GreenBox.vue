<template>
  <div class="boxed">
    <div class="green-box">
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GreenBox',
  data () {
    return {
      msg: 'Green component'
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

.green-box {
  background: lightgreen;
  padding: 0.5rem;
  border: 2px solid green;
}


</style>
