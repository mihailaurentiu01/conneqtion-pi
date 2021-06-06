<template>
  <div>
    <body id="body">

     <div class="container-fluid">
       <div class="row">
         <div class="col-md-12 d-flex justify-content-end">


          <div v-if="userData !== null" >
            <div>
              <h1>Online Now</h1>
            </div>
            <div class="row ml-2">
              <div v-if="userData.friends.length > 0" style="z-index: 1" class="border position-absolute rounded">
                <div v-for="friend in userData.friends" v-if="friend.userId.online && friend.status === 3">
                  <div class="col-12">
                    <router-link class="mb-2 btn" :to="{name: 'Chat', params: {with: friend.userId}}">{{friend.userId.fullName}}</router-link>
                  </div>
                </div>
              </div>
            </div>

          </div>

         </div>
       </div>
     </div>

        <div class="container">
          <router-link :to="{name: 'AddPost'}" class="btn btn-success mb-3">Create Post</router-link>

          <div v-if="friendsPosts.length > 0">
            <div>
              <div v-for="post in friendsPosts">
                <div v-if="post !== null">
                  <div v-for="(postData, index) in post.posts">
                    <div v-if="postData !== null">
                      <div class="card mb-4 mt-4">
                        <div class="card-header">
                          <div class="row">
                            <div class="col-3 col-md-2 col-lg-1 d-flex justify-content-center">
                              <img src="@/assets/icons/user(1).png" width="40px" alt="User logo">
                            </div>
                            <div class="col-9 col-md-5 col-lg-5">
                              <p class="my-2">{{post.friend}} - <strong>{{postData.updatedAt}}</strong></p>
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
                          <button @click="like(postData._id, index)" class="border-0 mr-2"><img src="@/assets/icons/like.png" alt="Like" width="30px"> <span> {{postData.likes.length}}</span></button>
                          <button @click="postData.visible = !postData.visible" class="border-0"><img src="@/assets/icons/comment.png" alt="Like" width="30px"> <span> {{postData.comments.length}}</span></button>
                        </div>

                        <div class="mb-5" v-if="postData.visible">
                          <div class="d-flex row">
                            <div class="d-flex flex-column col-md-12">
                              <div class="coment-bottom bg-white p-2 px-4">
                                <div class="d-flex flex-row add-comment-section mt-4 mb-4">
                                  <img class="img-fluid img-responsive rounded-circle mr-2" src="@/assets/icons/user(1).png" width="38">
                                  <input type="text" class="form-control mr-3" v-model="comment" placeholder="Add comment">
                                  <button class="btn btn-primary" @click="addUserComment(postData._id)" type="button">Comment</button>
                                </div>

                                <div v-for="(comment, commentIndex) in postData.comments">
                                  <div class="commented-section mt-2">
                                    <div class="d-flex flex-row align-items-center commented-user">
                                      <h5 class="mr-2">{{comment.username}}</h5><span class="dot mb-1"></span><span class="mb-1 ml-2">{{comment.date}}</span>
                                    </div>
                                    <div class="comment-text-sm"><span>{{comment.comment}}</span>     </div>
                                      <button @click="deleteUsrComment(postData._id, comment._id, commentIndex)" class="btn-danger" v-if="comment.userId === getUserId">Delete</button>
                                    <hr>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
import {pendingNotifications, requestUserData} from '../../services/index.services';
import {getFriendsPosts} from '../../services/post.services';
import {likePost} from '../../services/post.services';
import {addComment, deleteComment} from '../../services/post.services';


export default {
  name: "Index",
  components: {Search, Navbar},
  data: () => {
    return {
      friendsResult: null,
      query: '',
      comment: '',
      searchEnabled: true,
      friendsPosts: [],
      loading: true,
      showComments: false,
      userData: null
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
    },
    toggle: function(){
      this.showComments = !this.showComments;
    },
    like: async function(postId, index){
      const res = await likePost(postId, this.getUserId, index);

      if (res.status === 200){
        if (!res.data.alreadyLiked){
          this.friendsPosts.map (post => {
              if (post.posts[res.data.index] !== undefined){
                post.posts[res.data.index].likes.push({user: this.getUserId});
              }
            //post.posts[res.data.index].likes.push({user: this.getUserId});
          })
        }else{
          this.friendsPosts.map(post => {
            if (post.posts[res.data.index] !== undefined){
              const index = post.posts[res.data.index].likes.findIndex(individualPost => {
                return individualPost.user.toString() === this.getUserId.toString();
              });

                post.posts[res.data.index].likes.splice(index, 1);
            }
          })
        }
      }
    },
    addUserComment: async function(postId){
      if (this.comment.length < 1) return;

      const res = await addComment(postId, this.comment);

      if (res.status === 200){
        this.comment = "";
        const {postId} = res.data.comment;

        this.friendsPosts.map(post => {
          post.posts.map(postData => {

            if (postData !== null){
              if (postData._id.toString() === postId.toString()){
                postData.comments.push(res.data.comment);
              }
            }

          })
        })
      }
    },
    deleteUsrComment: async function(postId, commentId, comIndex){
      const res = await deleteComment(postId, commentId, comIndex);

      if (res.status === 200){
        const {index} = res.data;
        this.friendsPosts.map(post => {
          post.posts.map(postsData => {
            if (postsData !== undefined && postsData !== null){
              postsData.comments.splice(index, 1);
            }
          })
        })

        this.$snack.success({
          text: res.data.msg,
          button: "OK"
        });
      }
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
      const index = this.getNotifications.findIndex(notification => {
        return notification.userThatSentFriendship !== null && notification.userThatSentFriendship.id.toString() === data.userThatSentFriendship.id.toString();
      })

      if (index < 0){
        this.addNotification({userThatSentFriendship: data.userThatSentFriendship, type: data.type});
      }
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
        if (val !== null && val !== undefined){
          return val.posts.filter(post => {
            if (post !== null){
              post.visible = false;
              return post;
            }
          });
        }
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
            postData.updatedAt = data.post.updatedAt;
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
    });

    socket.on("startedChat " + this.getUserId, data => {
      console.log(this.$route)

      if (this.$route.name !== "Chat"){
        this.$snack.success({
          text: data.msg,
          button: "OK"
        });
      }
    });

    socket.on("onlineNow " + this.getUserId, data => {
      if (this.userData !== null){
        this.userData.friends.push({userId: data.friend.userId._doc});
      }

      this.$snack.success({
        text: data.msg,
        button: "OK"
      });

    });

    socket.on("offlineNow " + this.getUserId, data => {
      if (this.userData !== null){
        const index = this.userData.friends.findIndex(friend => friend.userId._id.toString() === data.id);

        if (index >= 0){
          this.userData.friends[index].userId.online = false;
        }
      }
    });

    socket.on("globalMessage " + this.getUserId, data => {
      this.$snack.success({
        text: "Admin Message: " + data.msg,
        button: "OK"
      });
    });

    const pendingNotif = await pendingNotifications();
    const {notifications} = pendingNotif.data;

    if (notifications.length >  0){
      notifications.map(notification => {
        //friendThatRequested
        if (notification.notification.type === "friendship"){
          this.addNotification({notificationId: notification._id, userThatSentFriendship: notification.notification.userThatSentFriendship, type: notification.notification.type});
        }else if (notification.notification.type === "friendshipStatus"){
          this.addNotification({notificationId: notification._id, msg: notification.notification.msg, userId: notification.notification.id, type: notification.notification.type});
        } else if (notification.notification.type === "postLikeStatus"){
          this.addNotification({notificationId: notification._id, msg: notification.notification.msg, type: notification.type, userId: notification.notification.user})
        } else if (notification.notification.type === "postMessageStatus"){
          this.addNotification({notificationId: notification._id, msg: notification.notification.msg, type: notification.type, userId: notification.notification.user})
        } else if (notification.notification.type === "chatMessage"){
          this.addNotification({notificationId: notification._id, msg: notification.notification.msg, type: notification.type, userId: notification.notification.user})
        } else if (notification.notification.type === "adminMessage"){
          this.addNotification({notificationId: notification._id, msg: notification.notification.msg, type: notification.type, userId: notification.notification.user})
        }
      });

      this.$snack.success({
        text: "You have pending notifications",
        button: "OK"
      });
    }

    const getUserData = await requestUserData(this.getUserId);

    if (getUserData.status === 200){
      this.userData = getUserData.data.user;
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