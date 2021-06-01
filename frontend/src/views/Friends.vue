<template>
    <div>
      <body id="body">
          <div class="container">
            <div v-if="user.friends !== undefined">
            <div v-if="user.friends.length > 0">
              <div v-for="friend in user.friends">
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">{{friend.userId.fullName}}</h5>
                    <p class="card-text"><strong>Status: </strong> {{friend.status === 3 ? 'Friends' : friend.status === 2 ? friend.userId.fullName + ' is considering your friend request.' : 'This user requested you to be his friend'}}</p>
                    <p>{{friend.userId.online ? 'Online Now' : 'Offline'}}</p>
                    <button v-if="friend.status === 3" @click="delFriend(friend.userId._id)" class="btn btn-danger mr-3">Delete</button>
                    <router-link v-if="friend.status === 3" class="btn btn-success" :to="{name: 'Chat', params: {with: friend.userId}}">Chat / Send Message</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </div>
</template>

<script>
import {requestUserData, deleteFriend} from "../../services/index.services";
import {mapGetters} from 'vuex';
import * as keyNames from '../keynames';

export default {
  name: "Friends",
  data: () => {
    return {
      user: ''
    }
  },
  methods: {
    delFriend: async function(friendId){
      const res = await deleteFriend(friendId);

      if (res.status === 200){
        const {index} = res.data;
        this.user.friends.splice(index, 1);
      }
    }
  },
  async beforeMount() {
    if (this.loggedIn){
        const res = await requestUserData(this.userId);

      if (res.status === 200){
        this.user = res.data.user;
      }
    }
  },
  computed: {
    ...mapGetters({
      userId: keyNames.GET_USER_ID,
      loggedIn: keyNames.GET_USER_LOGGED_IN
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