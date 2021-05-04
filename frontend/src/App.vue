<template>
  <div id="app">
<!--    <div id="nav">
      <router-link to="/">Login</router-link> |
    </div>-->
    <router-view/>
    <footer>
      <cookie-law></cookie-law>
    </footer>
  </div>
</template>

<script>
  import CookieLaw from 'vue-cookie-law';

  export default {
    components: {
      CookieLaw
    }
  }
</script>

<style>
body, html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100%;
  background: #1C5D99;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #1C5D99;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
