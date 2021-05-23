<template>
    <body id="body">
      <div class="container">
        <div v-if="errors.length > 0">
          <div v-for="error in errors">
            <div class="alert alert-danger">
              {{error}}
            </div>
          </div>
        </div>

        <b-form @submit.prevent="editPost">
          <b-form-group
              id="input-title"
              label="Title:"
              label-for="input-1"
              description="Enter title of your post">
            <b-form-input
                id="input-1"
                type="text"
                name="title"
                v-model="title"
                placeholder="Enter title"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-description" label="Description:" label-for="input-2">
            <b-form-textarea
                id="input-2"
                v-model="description"
                placeholder="Enter something..."
                rows="3"
                name="description"
                max-rows="6"
            ></b-form-textarea>
            <b-form-checkbox
                id="input-3"
                name="public"
                v-model="public"
            >Public</b-form-checkbox>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </div>
    </body>
</template>

<script>
import {updatePost} from '../../services/post.services';

export default {
  name: "EditPost",
  data: () => {
    return {
      title: '',
      description: '',
      public: false,
      errors: [],
      canSend: false,
      post: null
    }
  },
  methods: {
    editPost: async function(){
      this.errors = [];

      if (this.title.length < 1){
        this.errors.push("No puedes dejar el campo del título vacío");
      }

      if (this.description.length < 1){
        this.errors.push("No puedes dejar el campo de la descripción vacío");
      }

      if (this.errors.length === 0) this.canSend = true;

      if (this.canSend) {
        this.post.title = this.title;
        this.post.description = this.description;
        this.post.public = this.public;

        const res = await updatePost(this.post);

        if (res.status === 200){
          this.$snack.success({
            text: res.data.msg,
            button: "OK"
          });

          await this.$router.push({name: "Posts"});
        }
      }
    }
  },
  mounted: function() {
    let post = this.$route.params.post;
    this.post = post;
    this.title = post.title;
    this.description = post.description;
    this.public = post.public;
  }
}
</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>