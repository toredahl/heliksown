<template>
    <div class="col-xs-12 col-sm-6">
        <p v-if="!server">Vennligst velg en server</p>
        <p v-else>Server at {{server.id}} valgt {{server.status}} timelapse {{server.timelapse}}</p>
        <hr>
        <button @click="resetStatus">Endre til normal</button>
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


</style>
