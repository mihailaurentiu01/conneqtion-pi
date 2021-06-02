<template>
  <div id="app">
    <navbar v-if="loggedIn && role === 'User'" @search="search" @query="searchQuery"></navbar>
    <body v-if="loggedIn && searchEnabled" id="body">
      <div v-if="friendsResult !== null && searchEnabled" >
        <search :friendsResult="friendsResult" @enableSearch="enableSearch" :query="query"></search>
      </div>
    </body>
    <footer>
      <cookie-law></cookie-law>
    </footer>
    <router-view/>
  </div>
</template>

<script>

import CookieLaw from 'vue-cookie-law';
import interceptor from '../services/interceptors/response.interceptor';
import Search from "@/components/Search";
import {mapGetters} from 'vuex';
import Navbar from "@/components/Navbar";
import * as keyNames from '../src/keynames';

  export default {
    components: {
      Navbar,
      Search,
      CookieLaw
    },
    data: () => {
      return {
        friendsResult: null,
        query: '',
        searchEnabled: false
      }
    },
    methods: {
      search(item){
        if (item === undefined) return;
        this.friendsResult = item.friendsFound;
      },
      searchQuery(item){
        this.searchEnabled = true;
        this.query = item;
      },
      enableSearch(val){
        this.searchEnabled = val;
      },
    },
    computed: {
      ...mapGetters({
        loggedIn: keyNames.GET_USER_LOGGED_IN,
        role: keyNames.GET_ROLE
      })
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

#body {
  background: white;
  min-height: 92vh;
}
</style>
