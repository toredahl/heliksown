<template>

    <li
        class="list-group-item"
        :class="'status-' + server.status"
        style="cursor: pointer"
        @click="serverSelected"
      >
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
      console.log("initiating temperature loss server " + this.server.id);
      this.server.timelapse = Math.floor(Math.random() * 20) + 5;
      serverBus.$emit('serverSelected', this.server);
    },
    props:['server'],
    watch: {
    },
    methods: {
      calculateTemperature(){
        this.corevalue = 'width:' + this.server.core + '%;';
        if(this.server.core <25){
            this.currentLevel = 'green';
        }else if (this.server.core <40){
          this.currentLevel = 'yellow shake-little shake-constant';
        }else if (this.server.core <60){
          this.currentLevel = 'orange shake shake-constant';
        }else if (this.server.core <70){
          this.currentLevel = 'pink shake-slow shake-constant';
        }else if (this.server.core <80){
          this.currentLevel = 'violet shake-hard shake-constant';
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

</style>
