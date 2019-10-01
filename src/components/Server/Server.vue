<template>

    <li
        class="list-group-item"
        :class="'status-' + server.status"
        style="cursor: pointer"
        @click="serverSelected"
      >
        Server #{{ server.id }}  Core temperature:  {{server.core}}  Status: {{server.status}}
    </li>

</template>

<script>
  import { serverBus } from '../../main';

  export default {
    data() {
      return {
      }
    },
    props:['server'],
    methods: {
      serverSelected: function() {
        this.server.timelapse = Math.floor(Math.random() * 15) + 5;
        serverBus.$emit('serverSelected', this.server);
      }
    }
  }

</script>

<style>

.status-Normal {
  background: green;
}

.status-Critical {
  background: red;
}

.status-Unknown {
  background: yellow;
}

.status-Awful {
  background: pink;
  color: green;
}

.status-Terrible {
  background: grey;
  color: black;
}

.status-Meltdown {
  background: blue;
  color: red;
}

.status-Explosive {
  background: black;
  color: white;
}


</style>
