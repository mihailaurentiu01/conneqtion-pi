<template>
    <div class="container">
      <div class="row">
        <div class="col-md-5  mb-5">
         <h1>&nbsp;</h1>
        </div>
      </div>

      <div class="row">
        <div class="col-md-5  mb-5">
          <h1>&nbsp;</h1>
        </div>
      </div>

      <div class="row">
        <div class="col-md-5  mb-5">
          <h1>&nbsp;</h1>
        </div>
      </div>

      <div class="row d-flex justify-content-center mt-5">
        <div class="col-md-12">
         <div>
           <div class="row d-flex justify-content-center">
             <div class="col-md-6">
                 <img id="user-logo" class="img-fluid" src="@/assets/icons/user(2).png" alt="User logo">
             </div>
           </div>
         </div>

          <div v-if="errors.length > 0">

            <h2 style="color: white">Existen errores. Corrijalos</h2>

            <div v-for="error in errors">
              <div class="alert alert-danger">
                {{error}}
              </div>
            </div>
          </div>

          <div class="row d-flex justify-content-center mt-3">
            <div class="col-md-5">

              <form @submit.prevent="check" novalidate>
                <div class="form-group">
                    <input v-model="email" type="email" class="form-control" id="email" placeholder="E-mail">
                </div>
                <div class="form-group">
                  <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
                </div>
                <button type="submit" class="btn text-light btn-success">Login <img style="height: 30px; width: 30px;" src="@/assets/icons/key.png" alt="Key"></button>
              </form>

            </div>
          </div>

          <div class="row d-flex justify-content-center mt-4">
            <div class="col-6 col-md-4">
              <router-link class="text-light" :to="{name: 'forgot'}">Forgot password?</router-link>
            </div>
            <div class="col-6 col-md-4">
              <router-link class="text-light" :to="{name: 'SignUp'}">Sign Up</router-link>
            </div>
          </div>
        </div>
        <button @click="check">check</button>
      </div>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex';
import * as keyNames from '../keynames';

/*import * as SecureLS from "secure-ls";

let ls = new SecureLS({ isCompression: false });*/

export default {
  name: "Login",
  data: () => {
    return {
      email: '',
      password: '',
      errors: [],
      canLogin: false
    }
  },
  computed:{
    ...mapGetters({
      getLogin: keyNames.GET_USER_LOGGED_IN
    }),
  },
  methods: {
  ...mapMutations({
    activateLogin: keyNames.MUTATE_USER_LOGGED_IN
  }),
    testLogin: function() {

    },
    check: function(){
    this.errors = [];

      let regEmail = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");

      if (!regEmail.test(this.email)){
        this.errors.push("Reglas del correo: 1.No puede dejar el campo vacio. 2. Dominio minimo 2 caracteres.")
      }

      if (!this.password.length > 0){
        this.errors.push("La contraseña no puede estar vacía");
      }

      this.canLogin = this.errors.length === 0;
    }
  }
}

</script>

<style scoped>

#user-logo {height: 120px;}

</style>