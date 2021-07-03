<template>
    <PlayerIndex/>
</template>

<script>
    import PlayerIndex from './components/PlayerIndex.vue'

export default {
  name: 'App',
  components: {
      PlayerIndex
  }
}
</script>

<style lang="stylus">
    body
        margin 0

    em
        font-style normal

    ul
        list-style-type none
        padding 0
        margin 0

    /*#app {*/
    /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    /*}*/
</style>
