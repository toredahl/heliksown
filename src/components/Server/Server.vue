<template>

    <li
        class="list-group-item"
        :class="'status-' + server.status"
        style="cursor: pointer"
        @click="serverSelected"
      >
        <!-- Server #{{ server.id }}  Core temperature:  {{server.core}}  Status: {{server.status}} -->
        <div class="meter" :class="currentLevel">
          <span :style="corevalue"> {{server.core}}°C </span>
        </div>
    </li>



</template>

<script>
  import { serverBus } from '../../main';

  export default {
    data() {
      return {
        corevalue: 'width:0%;',
        core: 0,
        currentLevel: ''
      }
    },
    created(){
      serverBus.$on('coreTemperatureChanged', (coretemp) => {
        this.calculateTemperature();
      });
    },
    mounted() {
      this.core = this.server.core;
      this.calculateTemperature();
    },
    props:['server'],
    watch: {
    },
    methods: {
      calculateTemperature(){
        this.corevalue = 'width:' + this.server.core + '%;';
        if(this.server.core <10){
            this.currentLevel = 'green shake-basic';
        }else if (this.server.core <25){
          this.currentLevel = 'green shake-basic shake-constant';
        }else if (this.server.core <40){
          this.currentLevel = 'yellow shake-little shake-constant';
        }else if (this.server.core <60){
          this.currentLevel = 'orange shake-slow shake-constant';
        }else if (this.server.core <80){
          this.currentLevel = 'orange shake-hard shake-constant';
        }else {
          this.currentLevel = 'red shake-opacity shake-constant';
        }

      },
      serverSelected: function() {
        this.server.timelapse = Math.floor(Math.random() * 15) + 5;
        serverBus.$emit('serverSelected', this.server);
      }
    }
  }

</script>

<style>

  .list-group-item, .list-group-item:after, .list-group-item:before {
    box-sizing:content-box;
  }

  ul li.list-group-item {
    paddding: 0.5rem;
  }

  .meter span {
    text-align: center;
  }

/* .status-Normal {
  background: green;
}

.status-Critical {
  background: #F64C72;
  color: darkblue;
}

.status-Unknown {
  background: #FBEEC1;
}

.status-Awful {
  background: #659DBD;
  color: green;
}

.status-Terrible {
  background: #DAAD86;
  color: black;
}

.status-Meltdown {
  background: #553D67;
  color: red;
}

.status-Explosive {
  background: black;
  color: silver;
} */


</style>
