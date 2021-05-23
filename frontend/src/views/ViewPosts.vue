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
                    <router-link :to="{name: 'EditPost', params: {post: post, id: post._id}}" class="btn-success rounded mr-1 p-2">Edit</router-link>
                    <button @click="deletePost(post._id)"  class="btn-danger rounded p-1">Delete</button>
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
import {getAllPost} from '../../services/post.services';
import {deletePost} from '../../services/post.services';

export default {
  name: "ViewPosts",
  data: () => {
    return {
      posts: [],
      user: null,
      loading: true
    }
  },
  methods: {
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
    }
  },
  async mounted() {
    const res = await getAllPost();

    if (res.status === 200){
      this.posts = res.data.posts;
      this.user = res.data.user;
      this.loading = false;
    }

    if (this.$route.params.msg){
      this.$snack.success({
        text: this.$route.params.msg,
        button: "OK"
      });
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