<template>
  <!--  creating the collection frameset -->

    <!-- <div id="plantorama" class="full-width"> -->
<div class="container">

  <div class="item">

         <div class="card">
           <h2>test 1 </h2>
           <p>testorama <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni quia sint mollitia unde velit vero omnis, cumque, voluptatum libero quo excepturi dicta atque animi id praesentium quod iste, sapiente neque!</span><span>Dicta deleniti nobis aliquam quod unde, quaerat sit amet beatae! Nam nesciunt culpa in dicta praesentium natus porro architecto perspiciatis inventore, quibusdam, ullam sed ducimus illum harum fugit, quam molestiae.</span></p>
         </div>

         <div class="thumbnails">
           <ul class="menu">
             <li>test-1</li>
             <li>test-2</li>
             <li>test-3</li>
             <li>test-4</li>
             <li>test-5</li>
           </ul>
         </div>

    </div>

    <div class="item">
         <h2>test 2</h2>
         <p>testorama Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis assumenda quo veritatis aperiam suscipit. Reprehenderit itaque, ad vel beatae. Alias, similique qui vitae molestias odio voluptate laudantium odit vero quas!</p>
    </div>

</div>


</template>

<script>
export default {
  name: "Collection",
  data () {
    return {
      test: "this is how de do it",
      one: "this is aside from it all",
      slides: [
      {
        headline: "Philodendron xanadu",
        img: "https://mediasv6.truffaut.com/Articles/jpg/0620000/620220_001_1000.jpg",
        description: "Philodendron xanadu, kan bli ca 150 cm. Opprinnelig fra Brasil, Araceae-familien.",
        aquired: "Passiflora, 2019",
        notes: "Virker ikke som den trenger mye vann, kan og stå langt inne i rommet. Denne har ganske små blader. ",
        price: 700,
        color: null,
        id: 1
      },
      {
        headline: "Monstera adonsonii",
        img: "https://cdn.shopify.com/s/files/1/1706/1307/products/Monstera-adansonii-Philodendron-Monkey-Mask-Large.jpg?v=1557652521",
        description: "Kalles også Monkeyface, er litt mindre enn vanlig deliciosa, men bladene kan bli store på eldre eksemplarer",
        notes: "Har vokst en del sommeren 2019, ",
        aquired: "Solheim gartneri, 2019",
        price: 159,
        color: null,
        id: 2

      },
      {
        headline: "Monstera deliciosa borsigiana",
        img: "https://img.crocdn.co.uk/images/products2/pl/20/00/03/20/pl2000032008.jpg",
        description: "Variegert monstera finnes i to varianter, thai og borsigiana. Thai beholder variegeringen, mens borsigiana kan miste sin, man bør derfor ta vekk grener med helgrønne eller nesten helt grønne blader.",
        notes: "Holder den unna direkte sollys, gjerne 2 meter inn i rommet, i mitt tilfelle blir det nærmere tre",
        aquired: "Floriss, Bryn senter, 2019",
        price: 1200,
        color: null,
        id: 3
      },
      {
        headline: "Philodendron birkin",
        img: "https://www.gardentags.com/plant-encyclopedia/images/40244/philodendron-birkin.jpeg",
        description: "Meget pen philodendron",
        notes: "Alt for dyr, i grunnen, og var attpåtil på salg. Bør ha mye lys for å beholde de hvite stripene",
        aquired: "Wellplanting, 2019",
        price: 900,
        color: null,
        id:4
      }
    ]
  };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

html * {
    background: rgba(255, 0, 0, .1);
    box-shadow: 0 0 0 1px red;
}

.wrapper {
  grid-template-rows: 3vw 50vw 3vw;
}

.container {
  display: grid;
  grid-template-columns: repeat(1, 3fr 1fr);
  grid-gap: 1rem;
}

.item {
  padding: 1rem;
}

.coral {
  background-color: coral;
}

.thumbnails {
  align-items:end;
}

#thumbs li {
  float:left;
  display:inline-block;
  list-style-type:none;
  margin-right: 1rem;
}

#card {
  background-color: gold;
  min-height: 40vh;
}

.thumbs {
  width: 64px;
  border: 2px solid gray;
  padding: 0.25rem;
}

.img-holder {
  background-color: lightyellow;
}
.card-text {
  background-color: lightgreen;
}


</style>
