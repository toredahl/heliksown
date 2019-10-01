<template>
    <div class="col-xs-12 col-sm-6">
        <ul class="list-group">
            <app-server
                v-for="server in servers"
                :server="server"></app-server>
        </ul>
        <hr>
        <h2>Alert level: </h2>
        <span class="alert"> {{coreValue}} </span>
        <div class="symbols">


        <div class="balls" v-if="terrible">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div class="dots" v-if="serious">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <svg viewBox="25 25 50 50" v-if="critical">
          <circle cx="50" cy="50" r="20"></circle>
        </svg>

        <svg viewBox="0 0 50 50" v-if="explosive">
          <circle class="ring" cx="25" cy="25" r="20"></circle>
          <circle class="ball" cx="25" cy="5" r="3.5"></circle>
        </svg>


        </div>

    </div>
</template>

<script>

  import Server from './Server.vue';
  import { serverBus } from '../../main';

  export default {
    data: function() {
      return {
        servers: [
          {id:1, status: 'Awful', timelapse: 100, core: 20},
          {id:2, status: 'Critical',  timelapse: 100, core: 40},
          {id:3, status: 'Unknown',  timelapse: 100, core: 11},
          {id:4, status: 'Terrible',  timelapse: 100, core: 30}
        ],
        coreValue: 0,
        normal: true,
        serious: false,
        terrible: false,
        critical: false,
        explosive: false
      }
    },
    components: {
      appServer: Server
    },
    created() {
      serverBus.$on('serverUpdates', (id, timelapse) => {
        let timeout = timelapse * 1000;
        self = this;
        setTimeout(function() {
           self.updateServer(id, timelapse);
        }, timeout)
      });
      serverBus.$on('calculateCore', (current) => {
        self = this;
        self.calculateCore();
      });

    },
    mounted() {
        this.calculateCore();
    },
    watch: {
      coreValue: function() {

        this.normal   = false;
        this.serious  = false;
        this.terrible = false;
        this.critical = false;
        this.explosive = false;
        if(this.coreValue <10){
          this.normal = true;
        }else if(this.coreValue<51){
          this.serious = true;
        }else if(this.coreValue<101){
          this.terrible = true;
        }else if(this.coreValue<200){
          this.critical = true;
        }else{
          this.explosive = true;
        }
      }
    },
    methods: {
      updateServer(id, timelapse){
        let servers = this.servers;
        self = this;
        servers.forEach(function(element) {
            if(id == element.id){
              let coreValue = self.changeStatus();
              console.log(coreValue);
              element.status = coreValue[0];
              element.timelapse = timelapse;
              element.core = coreValue[1];
            }
        });
        self.calculateCore();
      },
      calculateCore() {
        let servers = this.servers;
        self = this;
        self.coreValue = 0;
        servers.forEach(function(element) {
          self.coreValue += element.core;
        });
      },
      changeStatus() {
        var rnd = Math.floor(Math.random() * 10);
        switch(rnd) {
          case 0:
            return ['Awful', 20];
            break;
          case 1:
            return ['Serious', 10];
            break;
          case 2:
            return ['Critical', 40];
            break;
          case 3:
            return ['Terrible', 30];
            break;
          case 4:
            return ['Meltdown', 80];
            break;
          case 9:
            return ['Explosive', 100];
            break;
          default:
            var current = Math.floor(Math.random() * 25);
            return ['Unknown', current];
            break;
          }
      }
    }
}
</script>

<style>

  h2  {
    margin-top: 1rem;
  }

  .symbols {
    margin-left: 1rem;
  }

  .alert{
    font-size: 40px;
    border: 2px solid red;
    padding: 1rem;
    display: inline-block;
  }

  .balls {
  width: 4em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.balls div {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background-color: #fc2f70;
}

.balls div:nth-of-type(1) {
  transform: translateX(-100%);
  animation: left-swing 0.5s ease-in alternate infinite;
}

.balls div:nth-of-type(3) {
  transform: translateX(-95%);
  animation: right-swing 0.5s ease-out alternate infinite;
}

@keyframes left-swing {
  50%,
  100% {
    transform: translateX(95%);
  }
}

@keyframes right-swing {
  50% {
    transform: translateX(-95%);
  }
  100% {
    transform: translateX(100%);
  }
}

.dots {
  width: 3em;
  height: 3em;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
}

.dots > div {
  width: 0.5em;
  height: 0.5em;
  background-color: #3cefff;
  border-radius: 50%;
  animation: fade 1.5s alternate ease-in-out infinite;
}

.dots > div:nth-of-type(2),
.dots > div:nth-of-type(4) {
  animation-delay: 0.25s;
}

.dots > div:nth-of-type(3),
.dots > div:nth-of-type(5),
.dots > div:nth-of-type(7) {
  animation-delay: 0.5s;
}

.dots > div:nth-of-type(6),
.dots > div:nth-of-type(8) {
  animation-delay: 0.75s;
}

.dots > div:nth-of-type(9) {
  animation-delay: 1s;
}

@keyframes fade {
  to {
    opacity: 0.2;
  }
}

.box {
  perspective: 120px;
}

.plane {
  width: 2em;
  height: 2em;
  background-color: #fc2f70;
  transform: rotate(0);
  animation: flip 1s infinite;
}

@keyframes flip {
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(180deg) rotateX(180deg);
  }
}
svg {
  width: 3.75em;
  animation: 1.5s spin ease infinite;
}

.ring {
  fill: none;
  stroke: hsla(341, 97%, 59%, 0.3);
  stroke-width: 2;
}

.ball {
  fill: #fc2f70;
  stroke: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

svg {
  width: 3.75em;
  transform-origin: center;
  animation: rotate 2s linear infinite;
}

circle {
  fill: none;
  stroke: #fc2f70;
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dashoffset: -125px;
  }
}


</style>
