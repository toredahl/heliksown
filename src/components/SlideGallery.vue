import Vibrant from 'node-vibrant';

<template id="SlideGallery">
  <div class="viewport" id="app">

    <main class="main">
      <transition name="main__slider">
        <transition-group v-if="loaded" tag="div" class="main__slider" name="main__slide-image" mode="out-in">
          <img class="main__slide-image" alt="" v-for="(slide, index) of slides" :key="index" :src="slide.img" v-if="index === currentActiveSlide" />
        </transition-group>
      </transition>
      <transition-group tag="div" class="main__headline" name="main__headline-span" mode="out-in">
        <span v-for="(slide, index) of slides" :key="index" v-if="index === currentActiveSlide" class="main__headline-span enhanced-bg">{{ slide.headline }}</span
            >
      </transition-group>
    </main>

    <aside class="aside">
      <!-- TODO : catch arrow keys navigation -->
      <transition name="aside__nav">
        <div class="aside__nav" v-if="loaded">
          <button class="aside__button" @click="incrementSlide(-1)">←</button>
          <button class="aside__button" @click="incrementSlide(1)">→</button>
        </div>
      </transition>
      <transition name="aside__slider">
        <transition-group
          v-if="loaded"
          tag="div"
          class="aside__slider"
          name="aside__slide-image"
          mode="out-in"
          ref="aside"
        >
        <img
          class="aside__slide-image"
          alt=""
          v-for="(slide, index) of slides"
          :key="index"
          :src="slide.img"
          v-if="index === nextActiveSlide"
        />
        </transition-group>
      </transition>
      <transition-group tag="div" class="small infobox" name="main__headline-span" mode="out-in">
        <div v-for="(slide, index) of slides" :key="index" v-if="index === currentActiveSlide" class="main__headline-span">
        <h3>  {{ slide.headline }} </h3>
        </div>
        <div v-for="(slide, index) of slides" :key="index" v-if="index === currentActiveSlide" class="">
          <strong>Beskrivelse:</strong> {{ slide.description }} <br>
          <strong>Notis:</strong> {{ slide.notes }} <br>
          <strong>Anskaffet:</strong> {{ slide.aquired }} <br>
          <strong>Pris:</strong> {{ slide.price }}
        </div>
      </transition-group>
      <!--transition name="progress-indicator">
        <ul
          class="progress-indicator"
          :data-slides-count="'0' + slides.length"
          v-if="loaded"
        >
          <li
            v-for="(slide,index) of slides"
            :class="index === currentActiveSlide ? 'progress-indicator__bar  progress-indicator__bar--active' : 'progress-indicator__bar'"
            :key="index"
          ></li>
        </ul>
      </transition -->
    </aside>

  </div>
</template>

<script>

// https://dribbble.com/shots/6566320-Kalli-Hero

export default {
  name: 'SlideGallery',
  data() {
  return {
    loaded: false,
    currentActiveSlide: 0,
    slides: [
      {
        headline: "Philodendron xanadu",
        img: "https://mediasv6.truffaut.com/Articles/jpg/0620000/620220_001_1000.jpg",
        description: "Philodendron xanadu, kan bli ca 150 cm. Opprinnelig fra Brasil, Araceae-familien.",
        aquired: "Passiflora, 2019",
        notes: "Virker ikke som den trenger mye vann, kan og stå langt inne i rommet. Denne har ganske små blader. ",
        price: 700,
        color: null
      },
      {
        headline: "Monstera adonsonii",
        img: "https://cdn.shopify.com/s/files/1/1706/1307/products/Monstera-adansonii-Philodendron-Monkey-Mask-Large.jpg?v=1557652521",
        description: "Kalles også Monkeyface, er litt mindre enn vanlig deliciosa, men bladene kan bli store på eldre eksemplarer",
        notes: "Har vokst en del sommeren 2019, ",
        aquired: "Solheim gartneri, 2019",
        price: 159,
        color: null
      },
      {
        headline: "Monstera deliciosa borsigiana",
        img: "https://img.crocdn.co.uk/images/products2/pl/20/00/03/20/pl2000032008.jpg",
        description: "Variegert monstera finnes i to varianter, thai og borsigiana. Thai beholder variegeringen, mens borsigiana kan miste sin, man bør derfor ta vekk grener med helgrønne eller nesten helt grønne blader.",
        notes: "Holder den unna direkte sollys, gjerne 2 meter inn i rommet, i mitt tilfelle blir det nærmere tre",
        aquired: "Floriss, Bryn senter, 2019",
        price: 1200,
        color: null
      },
      {
        headline: "Philodendron birkin",
        img: "https://www.gardentags.com/plant-encyclopedia/images/40244/philodendron-birkin.jpeg",
        description: "Meget pen philodendron",
        notes: "Alt for dyr, i grunnen, og var attpåtil på salg. Bør ha mye lys for å beholde de hvite stripene",
        aquired: "Wellplanting, 2019",
        price: 900,
        color: null
      }
    ]
  };
},
computed: {
  nextActiveSlide() {
    return this.currentActiveSlide + 1 >= this.slides.length
      ? 0
      : this.currentActiveSlide + 1;
  }
},
mounted() {
  setTimeout(() => {
    this.loaded = true;
  }, 1000);
  this.slides.forEach(slide => {
    Vibrant.from(slide.img)
      .getPalette()
      .then(val => {
        slide.color = val.Vibrant.hex;
      });
  });
  this.$el.style.setProperty(
    "--accent",
    this.slides[this.currentActiveSlide].color
  );
},
updated() {
  this.$el.style.setProperty(
    "--accent",
    this.slides[this.currentActiveSlide].color
  );
  this.$refs.aside.$el.style.setProperty(
    "--accent",
    this.slides[this.nextActiveSlide].color
  );
},
methods: {
    incrementSlide(val) {
      if (val > 0 && this.currentActiveSlide + val < this.slides.length) {
        this.currentActiveSlide += val;
      } else if (val > 0) {
        this.currentActiveSlide = 0;
      } else if (val < 0 && this.currentActiveSlide + val < 0) {
        this.currentActiveSlide = this.slides.length - 1;
      } else {
        this.currentActiveSlide += val;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* write SCSS here */

.html * {
    background: rgba(255, 0, 0, .1);
    box-shadow: 0 0 0 1px red;
}

:root {
  --color--primary: hsl(0, 0%, 100%);
  --color--secondary: hsl(0, 0%, 90%);
  --color--neutral: hsl(0, 0%, 1%);
  --color--background: hsl(300, 3%, 15%);
}
@mixin slide-image {
  position: absolute;
  height: 100%;
  object-fit: cover;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
html {
  font-family: "Inter", sans-serif;
  font-size: calc(95vmin / 100);
}
@supports (font-variation-settings: normal) {
  html {
    font-family: "Inter var", sans-serif;
  }
}
body {
  display: grid;
  min-height: 100vh;
  background: var(--color--background);

  place-items: center;
}
.viewport {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 19.5rem;
  /*width: 95vmin;*/
  height: calc(95rem * (9 / 16));
  background: var(--color--primary);
  box-shadow: 0 1rem 2rem hsla(0, 0%, 0%, 0.2);
  overflow: hidden;
}
.nav {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  left: 0;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  padding: 5rem;
  &-enter,
  &-leave-to {
    transform: translateY(-2rem);
    opacity: 0;
  }
  &-enter-active,
  &-leave-active {
    transition: all 300ms;
  }
  &__brand {
    width: 3rem;
    fill: var(--color--primary);
  }
  &__list {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 15rem;
    justify-content: space-between;
    padding: 0;
    color: var(--color--neutral);
  }
  &__list-item {
    font-weight: 730;
    svg {
      width: 1rem;
      fill: var(--color--neutral);
    }
  }
  &__list-item-link {
    text-decoration: none;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
    &:visited {
      color: var(--color--neutral);
    }
  }
}
.main {
  /*display: grid;
  grid-template-rows: 2fr 1fr; */
  grid-template-areas: "headline" "nav";
  align-items: end;
  a {
    font-weight: 400;
    text-decoration: none;
    color: var(--color--primary);
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
  &__slider {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 70rem;
    height: 100%;
    transition: background 200ms;
    background: var(--color--background);
    background: var(--accent);

    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    &:before {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      content: "";
      opacity: 0.1;
      background: var(--color--background);
    }
    &-enter,
    &-leave-to {
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    }
    &-enter-active,
    &-leave-active {
      transition: all 500ms;
    }
  }
  &__slide-image {
    @include slide-image;
    &-enter {
      transform: scale(1.3);
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    }
    &-leave-to {
      transform: scale(1.3);
      clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
    }
    &-enter-active {
      transition: all 700ms;
      transition-delay: 500ms;
    }
    &-leave-active {
      transition: all 700ms;
    }
  }
  &__headline {
    font-size: 3rem;
    font-weight: 400;
    position: relative;
    z-index: 1;
    width: 50rem;
    padding: 1rem;
    color: var(--color--primary);
    &-span {
      &-enter,
      &-leave-to {
        transform: translateY(1em);
        opacity: 0;
      }
      &-enter-active,
      &-leave-active {
        transition: all 300ms;
      }
      &-enter-active {
        transition-delay: 700ms;
      }
    }
  }
  &__nav {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-area: nav;
    width: 30rem;
    padding: 3rem 5rem;
    color: var(--color--primary);
    &-enter,
    &-leave-to {
      transform: translateY(2rem);
      opacity: 0;
    }
    &-enter-active,
    &-leave-active {
      transition: all 300ms;
    }
  }
}

.enhanced-bg {
  background-color:rgba(255,255,255,.5);
  color: black;
  padding: 0.5rem;
}

.social-links {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 0.4rem;
  align-items: center;
  &:before,
  &:after {
    display: block;
    width: 1rem;
    height: 0.1rem;
    content: "";
    background: var(--color--primary);
  }
  &:before {
    grid-column: 2;
  }
  &:after {
    grid-column: 4;
  }
}
.aside {
  position: relative;
  display: grid;
  padding: 1rem;

  .infobox {
    height: 25rem;
  }

  &__nav {
    position: absolute;
    bottom: 3.5rem;
    right: 3rem;
    transform: translateY(0);
    &-enter,
    &-leave-to {
      transform: translateY(2rem);
      opacity: 0;
    }
    &-enter-active,
    &-leave-active {
      transition: all 300ms;
    }
  }
  &__slider {
    position: relative;
    overflow: hidden;
    height: 15rem;
    margin-top: 1rem;
    background: var(--color--background);
    background: var(--accent);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    &-enter,
    &-leave-to {
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    }
    &-enter-active,
    &-leave-active {
      transition: all 300ms;
      transition-delay: 200ms;
    }
    &:before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      content: "";
      opacity: 0.3;
      background: var(--color--background);
    }
  }
  &__slide-image {
    @include slide-image;

/*    transform: translateX(-10rem);*/

    &-enter {
      /*transform: scale(1.3) translateX(-10rem);*/
      clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    }
    &-leave-to {
      transform: scale(1.3) translateX(-10rem);
      // opacity: 0;

      clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
    }
    &-enter-active {
      transition: all 700ms;
      transition-delay: 600ms;
    }
    &-leave-active {
      transition: all 700ms;
      transition-delay: 200ms;
    }
  }
  &__button {
    font-weight: 900;
    font-size: 2rem;
    width: 8rem;
    height: 2rem;
    margin: 0;
    cursor: pointer;
    border: 0;
    border: 1px solid var(--color--primary);
    outline: 0;
    background: var(--color--primary);
    &:hover,
    &:focus {
      border-color: var(--color--neutral);
    }
    &:active {
      color: var(--color--primary);
      border-color: var(--color--neutral);
      background: var(--color--neutral);
    }
  }
}
.progress-indicator {
  font-size: 0.9rem;
  font-weight: 900;
  position: absolute;
  right: 5rem;
  bottom: -1rem;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  align-items: center;
  justify-content: end;
  transform: translateY(0);
  &-enter,
  &-leave-to {
    transform: translateY(2rem);
    opacity: 0;
  }
  &-enter-active,
  &-leave-active {
    transition: all 300ms;
  }
  &__bar {
    width: 1.25rem;
    height: 1.25rem;
    transition: all 200ms;
    background: var(--color--secondary);
    &--active {
      background: var(--color--neutral);
    }
  }

  &:before,
  &:after {
    color: var(--color--neutral);
  }
  &:before {
    content: "01";
  }
  &:after {
    content: attr(data-slides-count);
  }
}


</style>
