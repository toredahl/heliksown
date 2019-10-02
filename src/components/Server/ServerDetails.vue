<template>
    <div class="col-xs-12 col-sm-4">
        <p v-if="!server">Vennligst velg en server</p>
        <p v-else>Server {{server.id}} valgt - Status:: {{server.status}} Tidshorisont::  {{server.timelapse}}</p>
        <hr>
        <!-- <button @click="resetStatus">Endre til normal</button> -->
        <div @click="resetStatus" class="button_cont" align="center"><span class="example_a" >Senk temperatur</span></div>

    </div>
</template>

<script>

  import { serverBus } from '../../main';

  export default {
    data: function() {
      return {
        server: null
      }
    },
    methods: {
      resetStatus(){
          this.server.status = 'Normal';
          this.server.core = 0;
          serverBus.$emit('calculateCore', 'current');
      }
    },
    created() {
      serverBus.$on('serverSelected', (server) => {
        this.server = server;
        serverBus.$emit('serverUpdates', this.server.id, this.server.timelapse);
      });
    }
  }

</script>

<style>
  .example_a {
    color: #fff !important;
    text-transform: uppercase;
    text-decoration: none;
    background: #ed3330;
    padding: 20px;
    border-radius: 5px;
    display: inline-block;
    border: none;
    transition: all 0.4s ease 0s;
  }

</style>
