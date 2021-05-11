<template>
  <div>
    <navbar @search="search" @query="searchQuery"></navbar>
    <body id="body">
        <div v-if="friendsResult !== null">
          <search :friendsResult="friendsResult" :query="query"></search>
        </div>

    <button @click="showId">show id</button>
    </body>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Search from "@/components/Search";
import  {mapGetters} from 'vuex';
import * as keyNames from '../keynames';
import axios from 'axios';
import clientSocket from 'socket.io-client';
export default {
  name: "Index",
  components: {Search, Navbar},
  data: () => {
    return {
      friendsResult: null,
      query: ''
    }
  },
  methods: {
    search(item){
      if (item === undefined) return;
     this.friendsResult = item.friendsFound;
    },
    searchQuery(item){
      this.query = item;
    },
    showId: function(){
      console.log(this.getUserId);

     /* axios.get("/v1/user/pendingFriends").then(res => console.log(res)).catch(err => console.log(err));

      const socket = clientSocket.connect("localhost:3000");

      socket.on("pending " + this.getUserId, data => {
        console.log(data.msg);
      })*/
    }
  },
  computed: {
    ...mapGetters({
      getUserId: keyNames.GET_USER_ID
    })
  }
}

</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>