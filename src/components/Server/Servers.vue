<template>
    <div class="col-xs-12 col-sm-8">
      <div v-if="!gameover">
        <ul class="list-group">
            <app-server
                v-for="server in servers"
                :server="server"></app-server>
        </ul>

        <hr>

        <h2 :class="defconLevel">Alert level: {{defcon}}</h2>
        <span class="alert" :class="shakelevel"> {{coreValue}} </span>
        <div class="symbols">

          <div class="dots2" v-if="serious">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div class="dots" v-if="awful">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div class="balls2" v-if="terrible">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div class="dots" v-if="normal">
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

        <div class="booom" v-if="gameover">
          <div id="matrix" class="full-monty">
      			<div class="d1 c1 de" style="left:1%;">q8w<span>1</span>ertyuioklsdfgh<span>j</span>zxc</div>
            <div class="d1 c1 f3" style="left:2%;">q8w<span>1</span>gogogadget<span>j</span>zxc</div>
      			<div class="d3 f1" style="left:4%;">hgd4ldhbc9kpugccsr<span>q</span></div>
      			<div class="d1 f2 c1" style="left:8%;">tr<span>z</span>ews0yfkldf4cvgbhj<span>n</span></div>
            <div class="d1 f2 c1" style="left:10%;">tr<span>z</span>nobodycantell<span>n</span></div>
      			<div class="d2 f6" style="left:12%;">sodhr49wh<span>u</span>yfbsrnlepjh</div>
      			<div class="d4 c3 de" style="left:16%;">fue73<span>s</span>jf0tbkxpowf<span>v</span>n</div>
            <div class="d4 c3 de" style="left:18%;">youcrazy<span>s</span>shineon<span>v</span>n</div>
      			<div class="d2 c1" style="left:20%;">sjdhfgueiwfgivecjowxkwpkpo<span>m</span>vcjoeuur</div>
      			<div class="d8 f2 c1" style="left:24%;">tr<span>z</span>hfggh</div>
      			<div class="d1 c1" style="left:28%;">thgp<span>m</span>srthdvytfv09876t<span>q</span>fgv</div>
      			<div class="d3 de" style="left:32%;">dhiwgfdue<span>s</span>rjm</div>
      			<div class="d4 f7" style="left:36%;">osadh<span>a</span>rshdyfeujm</div>
      			<div class="d2 de" style="left:40%;">fwedjsdjh<span>l</span>gmrghftdercwewergjm</div>
      			<div class="d8 f2" style="left:44%;">sodhr49wh<span>a</span>yfbsrnlepjh</div>
      			<div class="d1 f1" style="left:48%">p00oi<span>0</span>nf5sujhgdgbrjs36gdr<span>g</span>jpo</div>
      			<div class="d4 c1" style="left:52%;">h68kgdetklbf<span>b</span>eswk</div>
      			<div class="d2 de" style="left:56%;">dfrttvb<span>s</span>cfsr</div>
      			<div class="d1 f8 de" style="left:60%;">sgfy<span>b</span>0hfrese<span>4</span>kc</div>
            <div class="d3 f4" style="left:62%;">tell<span>b</span>mewhatyouwant<span>4</span>kc</div>
            <div class="d5 c3 de" style="left:64%;">miso<span>s</span>soup<span>m</span>n</div>
      			<div class="d7 c1" style="left:68%;">sjdhfgueiwfgivecjowxkwpkpo<span>m</span>vcjoeuur</div>
      			<div class="d4 f1 c1" style="left:72%;">tr<span>z</span>hfggh</div>
      			<div class="d2 c1" style="left:76%;">thgp<span>m</span>srthdvytfv09876t<span>q</span>fgv</div>
            <div class="d4 c1" style="left:78%;">thgp<span>m</span>thisisnotthedroids<span>q</span>fgv</div>
      			<div class="d5 f7" style="left:80%;">takeaway<span>d</span>rjm</div>
      			<div class="d8 f6" style="left:84%;">tunafish<span>a</span>galore</div>
            <div class="d6 f1" style="left:84%;">everybodyda<span>n</span>cenow</div>
      			<div class="d3 de" style="left:88%;">swedish<span>l</span>chefisagoodguy</div>
            <div class="d1 f2" style="left:90%;">motto<span>l</span>takeittomenow</div>
            <div class="d6 f3" style="left:92%;">motto<span>l</span>takeittomenow</div>
            <div class="d7 f5" style="left:96%;">psycho<span>a</span>sweetbut</div>
            <div class="d6 f4" style="left:100%">push<span>0</span>itotthelimiteverybody<span>g</span>jpo</div>

      		</div>

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
          {id:1, status: 'Unknown',  timelapse: 100, core: Math.floor(Math.random() * 14) + 10},
          {id:2, status: 'Unknown',  timelapse: 100, core:  Math.floor(Math.random() * 15) + 15},
          {id:3, status: 'Unknown',  timelapse: 100, core:  Math.floor(Math.random() * 13) + 30},
          {id:4, status: 'Unknown',  timelapse: 100, core:  Math.floor(Math.random() * 6) + 25}
        ],
        coreValue: 0,
        normal: true,
        serious: false,
        awful: false,
        terrible: false,
        critical: false,
        explosive: false,
        gameover: false,
        basic: 'shake ',
        shakelevel: '',
        defcon: '',
        defconLevel: 'normal'
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
        }, timeout);
        var secondtimeout = (Math.floor(Math.random() * 7) + 1) * 1000;
        setInterval(function(){
          self.increaseTemperature(id);
        }, secondtimeout);

      });
      serverBus.$on('calculateCore', (current) => {
        self = this;
        self.calculateCore();
      });

    },
    mounted() {
        this.calculateCore();
        this.shakelevel = this.basic;
    },
    watch: {
      coreValue: function() {
        this.normal   = false;
        this.serious  = false;
        this.terrible = false;
        this.awful    = false;
        this.critical = false;
        this.explosive = false;
        if(this.coreValue < 101){
          this.normal = true;
          this.shakelevel = 'shake-little shake-constant';
          this.defcon = 'Normal range - no worries';
          this.defconLevel = 'normal';
        }else if(this.coreValue<151){
          this.serious = true;
          this.shakelevel = 'shake-slow shake-constant';
          this.defcon = 'Serious range - check engines';
          this.defconLevel = 'serious';
        }else if(this.coreValue<181){
          this.awful = true;
          this.shakelevel = 'shake-hard shake-constant';
          this.defcon = 'Awful range - approaching dangerous terrain';
          this.defconLevel = 'awful';
        }else if(this.coreValue<221){
          this.terrible = true;
          this.shakelevel = 'shake-crazy shake-constant';
          this.defcon = 'Terrible range - near critical';
          this.defconLevel = 'terrible';
        }else if(this.coreValue<251){
          this.critical = true;
          this.shakelevel = 'shake-opacity shake-constant';
          this.defcon = 'Situation critical - meltdown imminent!';
          this.defconLevel = 'critical';
        }else if(this.coreValue>250){
          this.gameover = true;
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
              //element.status = coreValue[0];

              element.timelapse = timelapse;
              //element.core = coreValue[1];
              element.core += Math.floor(Math.random() * 3);

              if(element.core < 25){
                element.status = 'Normal';
              }else if (element.core < 35){
                element.status = 'Serious';
              }else if (element.core < 50){
                element.status = 'Awful';
              }else if (element.core < 70){
                element.status = 'Terrible';
              }else if (element.core < 80){
                element.status = 'Meltdown';
              }else if (element.core < 100){
                element.status = 'Critical';
              }

              if(element.core >= 100){
                element.core = 100;
                element.status = 'Critical';
              }
            }
        });
        self.calculateCore();
      },
      increaseTemperature(id){
        let servers = this.servers;
        self = this;
        servers.forEach(function(element) {
            var increase = Math.floor(Math.random() * 3);
            if(id == element.id){
              element.core += increase;
              if(element.core >= 101){
                element.core = 100;
              }
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
        serverBus.$emit('coreTemperatureChanged', true);
      },
      changeStatus() {
        var rnd = Math.floor(Math.random() * 10);
        var singledigit = Math.floor(Math.random() * 10);


        switch(rnd) {
          case 0:
            return ['Awful', 20+singledigit];
            break;
          case 1:
            return ['Serious', 30+singledigit];
            break;
          case 2:
            return ['Critical', 50+singledigit];
            break;
          case 3:
            return ['Terrible', 60+singledigit];
            break;
          case 4:
            return ['Meltdown', 80+singledigit];
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
    width: 96px;
    text-align: center;
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

.normal {
  color: green;
}

.awful {
  color: darkgrey;
  animation:blinkingText 3.5s infinite;
}

.serious {
  color: orange;
  animation:blinkingText 2.5s infinite;
}

.terrible {
  color: crimson;
  animation:blinkingText 1.5s infinite;
}

.critical {
  color: red;
	animation:blinkingText 0.75s infinite;
}

@keyframes blinkingText{
	0%{		color: red;	}
	49%{	color: transparent;	}
	50%{	color: transparent;	}
	99%{	color:transparent;	}
	100%{	color: red;	}
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

.dots2 {
  width: 3.5em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.dots2 div {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background-color: #fc2f70;
  animation: fade 0.8s ease-in-out alternate infinite;
}

.dots2 div:nth-of-type(1) {
  animation-delay: -0.4s;
}

.dots2 div:nth-of-type(2) {
  animation-delay: -0.2s;
}

.balls2 {
  width: 3.5em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.balls2 div {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background-color: #fc2f70;
  transform: translateY(-100%);
  animation: wave 0.8s ease-in-out alternate infinite;
}

.balls2 div:nth-of-type(1) {
  animation-delay: -0.4s;
}

.balls2 div:nth-of-type(2) {
  animation-delay: -0.2s;
}

@keyframes wave {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
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


  @font-face {
			font-family: Katakana;
			src: url('https://s.cdpn.io/26175/MoonBeams-katakana_.TTF');
		}

  #matrix.full-monty, .full-monty {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 3000;
  }

		#matrix{
			margin: 1em auto;
			font-family: Katakana;
			width: 100%;
			height: 100%;
			overflow: hidden;
			background: #000;
			background-image: -webkit-gradient(linear, 0% 90%, 0% 100%, from(rgba(0, 255, 0, 0)), to(rgba(0, 255, 0, 0.1)));
			color: rgba(0, 255, 0, .7);
			text-shadow: rgba(255, 255, 255, .8) 0px 0px 4px;
			position: relative;

		}
		@-webkit-keyframes fade{
		    0%   { opacity: 1; }
		    100% { opacity: 0; }
		}
		@-webkit-keyframes fall{
		   	from {top: -250px;}
			to 	{top: 300px;}
		}



		#matrix div{
			/* writing-mode: tb-rl; - ughh. doesn't work */
			position: absolute;
			top: 0;
			/* arrearance */
			-webkit-transform-origin: 0%;
			-webkit-transform: rotate(90deg);

			/* animation */
			-webkit-animation-name: fall, fade;
			-webkit-animation-iteration-count: infinite; /* use 0 to infinite */
			-webkit-animation-direction: normal; /* default is normal. use 'alternate' to reverse direction */
			-webkit-animation-timing-function: ease-out;
		}
		#matrix span{
			color: rgb(0, 255, 0);
			text-shadow: rgb(255, 255, 255) 0px 0px 5px;
		}
		.f1{
			font-size: 1.2em;
		}
		.f2{
			font-size: .9em;
		}
    .f3 {
      font-size: 36px;
    }

    .f4 {
      font-size: 28px;
    }

    .f5 {
      font-size: 22px;
    }

    .f6 {
      font-size: 44px;
    }

    .f7 {
      font-size: 60px;
    }

		.c1{
			color: rgba(0, 255, 0, .5);
		}
		.d1{
			-webkit-animation-duration: 4s;
		}
		.d2{
			-webkit-animation-duration: 6s;
		}
		.d3{
			-webkit-animation-duration: 8s;
		}
		.d4{
			-webkit-animation-duration: 10s;
		}
		.de{
			-webkit-animation-delay: 3s;
		}

    .d5{
			-webkit-animation-duration: 5s;
		}
		.d7{
			-webkit-animation-duration: 7s;
		}
    .d8{
			-webkit-animation-duration: 3s;
		}


</style>
