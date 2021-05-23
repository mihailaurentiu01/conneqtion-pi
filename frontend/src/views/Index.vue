<template>
  <div>
    <body id="body">
        <div class="container">
          <div v-if="friendsPosts.length > 0">
            <div>
              <div v-for="post in friendsPosts">
                <div v-if="post !== null">
                  <div v-for="postData in post.posts">
                    <div v-if="postData !== null">
                      <div class="card mb-4">
                        <div class="card-header">
                          <div class="row">
                            <div class="col-3 col-md-2 col-lg-1 d-flex justify-content-center">
                              <img src="@/assets/icons/user(1).png" width="40px" alt="User logo">
                            </div>
                            <div class="col-9 col-md-5 col-lg-5">
                              <p class="my-2">{{post.friend}} - <strong>{{postData.createdAt}}</strong></p>
                            </div>
                            <div class="col-md-2 mt-2">
                              <p><strong>{{postData.public ? 'Public' : 'Private'}}</strong></p>
                            </div>
                          </div>
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">{{ postData.title }}</h5>
                          <p class="card-text">{{postData.description}}</p>
                        </div>
                        <div class="card-header">
                          <p><strong>Likes: </strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import {getFriendsPosts} from '../../services/post.services';

export default {
  name: "Index",
  components: {Search, Navbar},
  data: () => {
    return {
      friendsResult: null,
      query: '',
      searchEnabled: true,
      friendsPosts: [],
      loading: true
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
    ]),
    addPost(post){
      this.friendsPosts.push(post);
    }
  },
  async mounted() {
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
    });

    // Request friends posts
    const friendsPostsInfo = await getFriendsPosts();

    if (friendsPostsInfo.status === 200){
      //this.friendsPosts = friendsPostsInfo.data.postsData;
      const filtered = friendsPostsInfo.data.postsData.filter(val => {
        return val.posts.filter(post => {
          return post !== null;
        });
      });

      this.friendsPosts = filtered;
      this.loading = false;
    }
  },
  beforeMount: async function() {
    const socket = clientSocket.connect("http://localhost:3000");

    socket.on("friendAddedNewPost " + this.getUserId, data => {
      this.addPost(data.post);
      this.$snack.success({
        text: data.post.friend + " added a new post!",
        button: "OK"
      });
    })


    socket.on("friendUpdatedPost " + this.getUserId, data => {
      this.friendsPosts.map(post => {
        post.posts.map(postData => {
          if (postData._id.toString() === data.post._id.toString()){
            postData.title = data.post.title;
            postData.description = data.post.description;
            postData.public = data.post.public;
          }
        })
      });

      this.$snack.success({
        text: data.friend + " updated a post!",
        button: "OK"
      });
    })

    socket.on("friendDeletedPost " + this.getUserId, data => {
     this.friendsPosts.splice(data.index, 1);

      this.$snack.success({
        text: data.friend + " deleted a post!",
        button: "OK"
      });
    })

    const pendingNotif = await pendingNotifications();
    const {notifications} = pendingNotif.data;

    if (notifications.length >  0){
      notifications.map(notification => {
        //friendThatRequested
        console.log(notification)
        if (notification.notification.type === "friendship"){
          this.addNotification({notificationId: notification._id, userThatSentFriendship: notification.notification.userThatSentFriendship, type: notification.notification.type});
        }else if (notification.notification.type === "friendshipStatus"){
          this.addNotification({notificationId: notification._id, msg: notification.notification.msg, userId: notification.notification.id, type: notification.notification.type});
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
      getUserId: keyNames.GET_USER_ID,
      getNotifications: keyNames.GET_NOTIFICATIONS
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