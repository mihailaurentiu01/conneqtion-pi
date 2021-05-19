<template>
  <div>
      <body id="body">
          <div class="container">
            <div v-if="errors.length > 0">
              <div v-for="error in errors">
                <div class="alert alert-danger">
                  {{error}}
                </div>
              </div>
            </div>

              <b-form @submit.prevent="addPost">
                <b-form-group
                    id="input-title"
                    label="Title:"
                    label-for="input-1"
                    description="Enter title of your post">
                  <b-form-input
                      id="input-1"
                      type="text"
                      name="title"
                      v-model="form.title"
                      placeholder="Enter title"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-description" label="Description:" label-for="input-2">
                  <b-form-textarea
                      id="input-2"
                      v-model="form.description"
                      placeholder="Enter something..."
                      rows="3"
                      name="description"
                      max-rows="6"
                  ></b-form-textarea>
                </b-form-group>

                <b-button type="submit" variant="primary">Submit</b-button>
              </b-form>
            </div>
      </body>
  </div>
</template>

<script>
export default {
  name: "AddPost",
  data: () => {
    return {
      form: {
        title: '',
        description: ''
      },
      errors: [],
      canSend: false
    }
  },
  methods: {
    addPost: function(){
      this.errors = [];

      if (this.form.title.length < 1){
        this.errors.push("No puedes dejar el campo del título vacío");
      }

      if (this.form.description.length < 1){
        this.errors.push("No puedes dejar el campo de la descripción vacío");
      }

      if (this.errors.length === 0) this.canSend = true;

      if (this.canSend){
        // make request
      }
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