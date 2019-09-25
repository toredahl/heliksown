<template lang="html">

  <span>

    {{title}}

  </span>

</template>

<script>
export default {
  data: function() {
    return {
      status: 'Sunny not bad in Oslo? Come on'
    }
  },
  props: ['title'],
  methods: {
    displayMe: function(index){
      console.log("displayMe " + index);
    }
  }
}
</script>

<style lang="css" scoped>
</style>
