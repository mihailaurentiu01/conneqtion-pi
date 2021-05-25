<template>
  <div>
   <body id="body">
        <router-link class="btn-success p-2" :to="{name: 'AddPost'}">Create post</router-link>

        <div class="container">
          <div>
            <div v-if="posts.length > 0">
              <div v-for="post in posts">
                <div v-if="post !== null">
                <div class="card mb-4">
                  <div class="card-header">
                    <div class="row">
                      <div class="col-2 col-md-2 col-lg-1 d-flex justify-content-center">
                        <img src="@/assets/icons/user(1).png" width="40px" alt="User logo">
                      </div>
                      <div class="col-10 col-md-5 col-lg-5">
                        <p class="my-2">{{user}} - <strong>{{post.updatedAt}}</strong></p>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">{{ post.title }}</h5>
                    <p class="card-text">{{post.description}}</p>
                  </div>
                  <div class="card-header">
                    <button class="border-0 mr-2"><img src="@/assets/icons/like.png" alt="Like" width="30px"> <span> {{post.likes.length}}</span></button>

                    <button @click="post.visible = !post.visible" class="border-0 mr-2"><img src="@/assets/icons/comment.png" alt="Like" width="30px"> <span> {{post.comments.length}}</span></button>

                    <router-link :to="{name: 'EditPost', params: {post: post, id: post._id}}" class="btn-success rounded mr-1 p-2">Edit</router-link>
                    <button @click="deletePost(post._id)"  class="btn-danger rounded p-1">Delete</button>
                  </div>

                  <div class="mb-5" v-if="post.visible">
                    <div class="d-flex row">
                      <div class="d-flex flex-column col-md-12">
                        <div class="coment-bottom bg-white p-2 px-4">
                          <div class="d-flex flex-row add-comment-section mt-4 mb-4">
                            <img class="img-fluid img-responsive rounded-circle mr-2" src="@/assets/icons/user(1).png" width="38">
                            <input type="text" class="form-control mr-3" v-model="comment" placeholder="Add comment">
                            <button class="btn btn-primary" @click="addUserComment(post._id)" type="button">Comment</button>
                          </div>

                          <div v-for="(comment, commentIndex) in post.comments">
                            <div class="commented-section mt-2">
                              <div class="d-flex flex-row align-items-center commented-user">
                                <h5 class="mr-2">{{comment.username}}</h5><span class="dot mb-1"></span><span class="mb-1 ml-2">{{comment.date}}</span>
                              </div>
                              <div class="comment-text-sm"><span>{{comment.comment}}</span></div>
                                <button @click="deleteUsrComment(post._id, comment._id, commentIndex)"  class="btn-danger" v-if="comment.userId === getUserId">Delete</button>
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

   </body>
  </div>
</template>

<script>
import {addComment, deleteComment, getAllPost} from '../../services/post.services';
import {deletePost} from '../../services/post.services';
import {mapGetters} from "vuex";
import * as keyNames from "@/keynames";

export default {
  name: "ViewPosts",
  data: () => {
    return {
      posts: [],
      user: null,
      comment: '',
      loading: true
    }
  },
  methods: {
    deleteUsrComment: async function(postId, commentId, comIndex){
      const res = await deleteComment(postId, commentId, comIndex);

      if (res.status === 200){
        const {index} = res.data;
        this.posts.map(post => {
            post.comments.splice(index, 1);
        });

        this.$snack.success({
          text: res.data.msg,
          button: "OK"
        });
      }
    },
    deletePost: async function(postId){
      //const {id} = this.$route.query;
      const res = await deletePost(postId);

      if (res.status === 200){
        this.$router.push({name: 'Posts', query: {id: postId, delete: 'yes'}});

        this.posts = res.data.posts;
        console.log("deleted")
        //this.posts.splice(res.data.index, 1);

        this.$snack.success({
          text: res.data.msg,
          button: "OK"
        });
      }
    },
    addUserComment: async function(postId){

      if (this.comment.length < 1) return;

      const res = await addComment(postId, this.comment);

      if (res.status === 200){
        this.comment = "";
        const {postId} = res.data.comment;

        this.posts.map(post => {
            if (post !== null){
              if (post._id.toString() === postId.toString()){
                post.comments.push(res.data.comment);
              }
            }
        })
      }
    }
  },
  async mounted() {
    const res = await getAllPost();

    if (res.status === 200){
      this.posts = res.data.posts.map(post => {
        post.visible = false;
        return post;
      });

      this.user = res.data.user;
      this.loading = false;
    }

    if (this.$route.params.msg){
      this.$snack.success({
        text: this.$route.params.msg,
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