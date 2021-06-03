<template>
  <div>
    <navbar></navbar>
      <body id="body">
        <div v-if="users !== null">
            <div v-if="users.length > 0">
              <div class="container d-md-flex">
                <div v-for="(user, index) in users" :key="index">
                  <div class="card mb-2 mr-4" style="width: 18rem;">
                    <div class="card-body">
                      <h5 class="card-title">{{user.fullName}}</h5>

                      <p class="card-text"><strong>Location: </strong> {{user.location}}</p>
                      <p class="card-text"><strong>Email: </strong> {{user.email}}</p>

                      <button v-if="!user.isBanned" @click="banUserId(user, true)" class="btn btn-danger mr-2">Ban</button>
                      <button v-if="user.isBanned" @click="banUserId(user, false)" class="btn btn-danger mr-2">UnBan</button>

                      <button class="btn btn-success" @click="userPosts(user._id, user)">Display posts</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <div class="form-floating">
          <textarea class="form-control" v-model="message" placeholder="Send a global message" id="floatingTextarea"></textarea>
          <button @click="sendGlobalMessage" class="btn btn-success rounded mt-2 ml-2">Global Message</button>
        </div>

        <div v-if="posts !== null">
          <div v-if="posts.length > 0">
            <div v-for="(post, postIndex) in posts">
              <div v-if="post !== null">
                <div class="card mb-4 mt-3">
                  <div class="card-header">
                    <div class="row">
                      <div class="col-2 col-md-2 col-lg-1 d-flex justify-content-center">
                        <img src="@/assets/icons/user(1).png" width="40px" alt="User logo">
                      </div>
                      <div class="col-10 col-md-5 col-lg-5">
                        <p class="my-2">{{user.fullName}} - <strong>{{post.updatedAt}}</strong></p>
                      </div>
                    </div>
                  </div>

                  <div class="card-body">
                    <h5 class="card-title">{{ post.title }}</h5>
                    <p class="card-text">{{post.description}}</p>
                  </div>

                  <div class="card-header">
                    <button @click="post.visible = !post.visible"  class="border-0 mr-2"><img src="@/assets/icons/comment.png" alt="Like" width="30px"> <span> {{post.comments.length}}</span></button>
                    <button @click="deleteUsrPost(post, postIndex)"  class="btn-danger rounded p-1">Delete</button>
                  </div>

                </div>
              </div>

              <div class="container">
                <div class="mb-5" v-if="post.visible">
                  <div class="d-flex row">
                    <div class="d-flex flex-column col-md-12">
                      <div class="coment-bottom bg-white p-2 px-4">
                        <div class="d-flex flex-row add-comment-section mt-4 mb-4">

                        </div>

                        <div v-for="(comment, commentIndex) in post.comments">
                          <div class="commented-section mt-2">
                            <div class="d-flex flex-row align-items-center commented-user">
                              <h5 class="mr-2">{{comment.username}}</h5><span class="dot mb-1"></span><span class="mb-1 ml-2">{{comment.date}}</span>
                            </div>
                            <div class="comment-text-sm"><span>{{comment.comment}}</span></div>
                            <button @click="deleteUsrComment(post, comment._id)" class="btn-danger">Delete</button>

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


      </body>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import {getAllUsers, getUserPosts, deleteUserComment, deleteUserPost, banUser, globalMessage} from '../../services/admin.services';

export default {
  name: "AdminIndex",
  components: {Navbar},
  data: () => {
    return {
      users: null,
      posts: null,
      user: null,
      message: ''
    }
  },
  methods: {
    userPosts: async function(userId, user){
      const res = await getUserPosts(userId);

      if (res.status === 200){
        this.posts = res.data.posts.map(post => {
          post.visible = false;
          return post;
        });

        this.user =  user;
      }
    },
    deleteUsrComment: async function(post, commentId) {
      const res = await deleteUserComment(post._id, commentId);

      if (res.status === 200){
        post.comments.splice(res.data.index, 1);

        this.$snack.success({
          text: res.data.msg,
          button: "OK"
        });
      }
    },
    deleteUsrPost: async function(post, index) {
      const res = await deleteUserPost(post._id);

      if (res.status === 200){
        this.posts.splice(index, 1);

        this.$snack.success({
          text: res.data.msg,
          button: "OK"
        });
      }
    },
    banUserId: async function(user, ban) {
      const res = await banUser(user._id, ban);

      if (res.status === 200){
        this.$snack.success({
          text: res.data.msg,
          button: "OK"
        });
        user.isBanned = res.data.ban;
      }
    },
    sendGlobalMessage: async function(){
      if (this.message.length < 1) return;

      const res = await globalMessage(this.message);

      if (res.status === 200){
        this.$snack.success({
          text: res.data.msg,
          button: "OK"
        });

        this.message = '';
      }
    }
  },
  async mounted() {
    const res = await getAllUsers();

    if (res.status === 200){
      this.users = res.data.users;
    }
  }
}
</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>