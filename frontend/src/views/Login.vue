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

      <div v-if="$route.params.message">
        <b-alert show variant="success"><b-icon icon="exclamation-circle-fill" variant="success"></b-icon> {{$route.params.message}}</b-alert>
      </div>

      <div v-if="$route.params.error">
        <b-alert show variant="danger"><b-icon icon="exclamation-circle-fill" variant="danger"></b-icon> {{$route.params.error}}</b-alert>
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
      </div>
    </div>
</template>

<script>
import {mapMutations} from 'vuex';
import {doLogin} from '../../services/auth.services';
import * as keyNames from '../keynames';

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
  methods: {
    ...mapMutations({
      setLoggedIn: keyNames.MUTATE_USER_LOGGED_IN,
      setAccessToken: keyNames.MUTATE_USER_ACCESS_TOKEN
    }),
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

      if (this.canLogin){
        let fnLogin = async (cb) => {
          let status = await doLogin({email: this.email, password: this.password})

          cb(status);
        }

        fnLogin((data) => {
          if (data.data.status === 200){
            this.setLoggedIn(true);
            this.setAccessToken(data.data.accessToken);

            this.$router.push({name: "Index"});
          }else if (data.data.status === 404){
            this.$router.push({name: "Login", params: {error: "No user has been found with the given email"}, query: {email: this.email}});
          } else if (data.data.status === 401){
            this.$router.push({name: "Login", params: {error: "Password doesn't match the given email"}, query: {email: this.email}});
          }
        })
      }
    }
  }

}

</script>

<style scoped>

#user-logo {height: 120px;}

</style>