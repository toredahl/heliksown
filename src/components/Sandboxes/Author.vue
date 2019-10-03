<template>
  <div class="boxed">
    <h1>{{ msg }}</h1>
    <p>Dette er author component, blir den hentet korrekt?</p>
    <button type="button" name="button" @click="counter++">Teller</button>
    <p>{{counter}}</p>
  </div>
</template>

<script>
export default {
  name: 'Author',
  data () {
    return {
      msg: 'Author component',
      counter: 0
    }
  },
  created() {
    console.log("created. skjer bare en gang");
  },
  deactivated() {
    console.log("Author ble deaktivert");
  },
  activated() {
    console.log("Author ble RE-aktivert");
  },
  methods: {

    }
  }
</script>

<style scoped>

.outer {
  border: 1px solid grey;
  box-shadow: 1px 1px 2px gold;
  padding: 2rem;
  margin: 1rem 0;
}

</style>
