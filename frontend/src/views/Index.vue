<template>
  <div>
    <navbar @search="search" @query="searchQuery"></navbar>
    <body id="body">
        <div v-if="friendsResult !== null && searchEnabled" >
          <search :friendsResult="friendsResult" @enableSearch="enableSearch" :query="query"></search>
        </div>
<!--    <button @click="showId">show id</button>-->
    </body>
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Search from "@/components/Search";
import  {mapGetters, mapMutations} from 'vuex';
import * as keyNames from '../keynames';
import clientSocket from 'socket.io-client';
import axios from 'axios';
import {pendingNotifications} from '../../services/index.services';

export default {
  name: "Index",
  components: {Search, Navbar},
  data: () => {
    return {
      friendsResult: null,
      query: '',
      searchEnabled: true
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
    ...mapMutations({
      addNotification: keyNames.MUTATE_NOTIFICATIONS
    }),
    ...mapMutations([
        'removeNotification'
    ])
  },
  mounted() {
    const socket = clientSocket.connect("http://localhost:3000");

    socket.on("receivedFriendship " + this.getUserId, data => {
      const {msg} = data;

      this.$snack.success({
        text: msg,
        button: "OK"
      });

    });

    socket.on("receivedNotification " + this.getUserId, data => {
      this.addNotification({userThatSentFriendship: data.userThatSentFriendship, type: data.type});
    });

    socket.on("friendThatRequested " + this.getUserId, data => {

      this.$snack.success({
        text: data.msg,
        button: "OK"
      });

      this.removeNotification(data.userId)
    })
  },
  beforeMount: async function() {
    const pendingNotif = await pendingNotifications();
    const {notifications} = pendingNotif.data;

    if (notifications.length >  0){
      notifications.map(notification => {
        //friendThatRequested
        if (notification.type === "friendship"){
          this.addNotification({notificationId: notification._id, userThatSentFriendship: notification.notification.userThatSentFriendship, type: notification.type});
        }else if (notification.type === "friendshipStatus"){
          this.addNotification({notificationId: notification._id, msg: notification.notification.msg, userId: notification.notification.id, type: notification.type});
        }
      });

      this.$snack.success({
        text: "You have pending notifications",
        button: "OK"
      });
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