<template>
  <div class="containexr">
        <app-header></app-header>
        <hr>
        <div class="row">
            <servers></servers>
            <app-server-details></app-server-details>
        </div>
        <hr>
        <app-footer></app-footer>
    </div>
</template>

<script>
import Header from './Shared/Header.vue';
   import Footer from './Shared/Footer.vue';
   import Servers from './Server/Servers.vue';
   import ServerDetails from './Server/ServerDetails.vue';

   export default {
       components: {
           appHeader: Header,
           Servers,
           'app-server-details': ServerDetails,
           'app-footer': Footer
       }
   }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #Stops {
    max-width: 800px;
    margin: 0 auto;
  }

  .thumbs {
      float:left;
      display:inline-block;
      list-style-type:none;
      margin-right: 1rem;
      border: 2px solid gray;
      padding: 0.25rem;
      img {
        max-width: 72px;
        max-height: 72px;
        width: 80%;
        margin: 0 auto;
        display: block;
      }
  }
.card {
  padding: 1rem;
  background: white;
  border: 1px solid black;
  h1 {
      text-transform: lowercase;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }
  .cardHolder {
    img {
      width: auto;
      max-width: 100%;
      margin: 0 auto;
      display: block;
    }
  }

  .buttons {
    margin: 1rem auto;
    width: 20vw;
    clear:both;
  }
  .clearing {clear:both;}
  .auto {overflow:auto;}
  .medium-m {margin: 1rem 0;}
</style>
