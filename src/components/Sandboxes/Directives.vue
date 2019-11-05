<template>
    <div class="container">
        <div class="row">
            <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <h1>Directives Exercise</h1>
                <!-- Exercise -->
                <!-- Build a Custom Directive which works like v-on (Listen for Events) -->

                <div id="baseexample">
                  <p>Scroll down the page</p>
                  <p v-pin="1">Make a note</p>
                  <p v-pin="2">Make a note 2</p>
                  <p v-pin=3>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi quae laboriosam nihil tempora eius, esse, architecto impedit sapiente et optio provident placeat recusandae possimus natus fugiat dolorem ducimus, assumenda pariatur.</p>
                  <p v-pin="4">Aut incidunt saepe rem, consectetur. Perspiciatis beatae ea repellendus autem sint impedit accusamus similique quia alias esse eligendi, laudantium recusandae doloremque. Odit reprehenderit, suscipit error quis facilis similique animi enim.</p>
                  <p v-pin="5">Voluptatem fuga tenetur iusto ratione, libero architecto. Dolore explicabo deserunt, commodi pariatur, sequi sit saepe fugiat omnis placeat numquam repellendus natus animi aperiam quidem dignissimos fuga voluptas labore. Quae, omnis.</p>

                </div>


                <div class="mousetrap"
                  v-customOn:mouseenter="mouseEnter"
                  v-customOn:mouseleave="mouseLeave"

                >
                    Tagetes
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {

        data: {
          msg: "Tell me more",
        },
        directives: {
            'pin': {
              bind: function (el, binding, vnode) {

                  el.onclick = function() {

                    let offset = binding.value * 200
                    el.style.position = 'fixed'
                    el.style.top = offset + 50 + 'px'
                    el.style.right = '50px'
                    el.style.padding = '8px'
                    el.style.backgroundColor = 'yellow'
                    el.style.border = '3px solid black'
                    el.style.boxShadow = '10px 11px 12px -2px rgba(46,4,46,0.85);'
                    el.style.width = '200px'
                    el.style.height = '200px'
                    el.style.overflow = 'scroll'
                    el.style.fontVariant = 'italic'

              }
            }
          },
          'customOn': {
              bind: function (el, binding, vnode) {
                  const type = binding.arg;
                  const fn = binding.value;
                  el.addEventListener(type, fn);
              }
          }
        },
        methods: {
          clicked() {
            alert("hang on");
          },
          mouseEnter() {
            console.log("yes we entered");
          },
          mouseLeave() {
            console.log("yes we left");
          }
        }


    }
</script>

<style>
  .mousetrap {
    height: 100px;
    width: 100px;
    border: 1px solid black;
    border-radius: 5px;
    background: orange;
  }

</style>
