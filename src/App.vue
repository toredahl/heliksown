<template>
  <div id="app">
    <div class="menu">
      <ul>
        <li><router-link to="/heliksmap">  HeliksMap</router-link></li>
        <li><router-link to="/helloworld"> HelloWorld</router-link></li>
        <li><router-link to="/plantesamling"> Plantesamling</router-link></li>
        <li><router-link to="/bildegalleri"> Bildegalleri</router-link></li>
      </ul>
    </div>
    <br>
    <hr>
    <div class="center-area">
      <img class="logo" src="./assets/logo.png">
      <router-view/>
    </div>

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
  color: #2c3e50;
  margin-top: 20px;
}

.center-area {
  width: 1440px;
  margin: 0 auto;
  display: block;
}

.logo {
  margin: 1rem auto;
  display:block;
}

.menu {
  width: 1400px;
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
