<template>
  <div>
    <body id="body">
        <div class="card">
          <div class="card-body d-flex">
            <h5 class="card-title mr-4">{{user.fullName}}</h5>
            <router-link :to="{name: 'Login'}"  class="btn-success p-2 rounded">Auth</router-link>
          </div>
        </div>

    <div class="container">
      <div>
        <div v-if="user.posts !== undefined">
          <div v-if="user.posts.length > 0">
          <div v-for="post in user.posts">
            <div v-if="post !== null">
              <div class="card mb-4">
                <div class="card-header">
                  <div class="row">
                    <div class="col-2 col-md-2 col-lg-1 d-flex justify-content-center">
                      <img src="@/assets/icons/user(1).png" width="40px" alt="User logo">
                    </div>
                    <div class="col-10 col-md-5 col-lg-5">
                      <p class="my-2">{{user.fullName}} - <strong>{{post.post.updatedAt}}</strong></p>
                    </div>
                  </div>
                </div>

                <div class="card-body">
                  <h5 class="card-title">{{ post.post.title }}</h5>
                  <p class="card-text">{{ post.post.description }}</p>
                </div>

                <div class="card-header">
                  <button class="border-0 mr-2"><img src="@/assets/icons/like.png" alt="Like" width="30px"> <span> {{post.post.likes.length}}</span></button>
                  <button  class="border-0 mr-2"><img src="@/assets/icons/comment.png" alt="Like" width="30px"> <span> {{post.post.comments.length}}</span></button>
                </div>

                <div class="mb-5" >
                  <div class="d-flex row">
                    <div class="d-flex flex-column col-md-12">
                      <div class="coment-bottom bg-white p-2 px-4">
                        <div class="d-flex flex-row add-comment-section mt-4 mb-4">
                          <img class="img-fluid img-responsive rounded-circle mr-2" src="@/assets/icons/user(1).png" width="38">
                        </div>

                        <div v-for="(comment, commentIndex) in post.post.comments">
                          <div class="commented-section mt-2">
                            <div class="d-flex flex-row align-items-center commented-user">
                              <h5 class="mr-2">{{comment.username}}</h5><span class="dot mb-1"></span><span class="mb-1 ml-2">{{comment.date}}</span>
                            </div>
                            <div class="comment-text-sm"><span>{{comment.comment}}</span></div>
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
      <div v-else>
        <h1>Nothing found</h1>
      </div>
    </div>
  </div>
</body>
</div>
</template>

<script>
import {requestUserData} from "../../services/index.services";

export default {
  name: "ShowPostsOffline",
  data: () => {
    return {
      user: ''
    }
  },
  async mounted() {
    const id = this.$route.params.id;

    const res = await requestUserData(id);

      if (res.status === 200){
        this.user = res.data.user;

        this.user.posts.map(post => {
          post.post.visible = false;
          return post;
        })
      }
  },
  methods: {

  }
}
</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>