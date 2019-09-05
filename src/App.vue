<template>
  <div id="app">
    <div class="menu">
      <ul>
        <li><router-link to="/heliksmap">  HeliksMap</router-link></li>
        <li><router-link to="/helloworld"> HelloWorld</router-link></li>
        <li><router-link to="/plantesamling"> Plantesamling</router-link></li>

      </ul>
    </div>
    <br>
    <hr>
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.menu {
  width: 800px;
  margin:auto;
  display:block;
  background: lightyellow;
}

ul  {
  display:inline-block;
}

ul li {
  float:left;
  margin: 1rem;
}

</style>
