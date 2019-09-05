<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2> HELIKS ON A MAP </h2>
    <div class="center-fold">

      <strong>Eres Tú</strong>

    </div>

  </div>
</template>

<script>
export default {
  name: 'HeliksMap',
  data () {
    return {
      msg: 'Heliks på Kartet'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}

.center-fold {
    vertical-align: middle;
    text-align: center;
    margin: 0 auto;
    width: 1000px;
    display: block;
    color: skyblue;
    font-size: 18x;
    border: 1px solid gold;
    padding: 1rem;
}

</style>
