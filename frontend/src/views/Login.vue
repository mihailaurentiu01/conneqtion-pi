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

          <div class="row d-flex justify-content-center mt-3">
            <div class="col-md-5">
              <form @submit.prevent="testLogin">
                <div class="form-group">
                  <input type="text" class="form-control" id="username" placeholder="Username">
                </div>
                <div class="form-group">
                  <input type="password" class="form-control" id="password" placeholder="Password">
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

import * as SecureLS from "secure-ls";

let ls = new SecureLS({ isCompression: false });

export default {
name: "Login",
  data: () => {
    return {

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

      /*let email = "test@test.es";
      let password = "1";
      let accesstoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDhiMDg0MmJiMGY1OTFiZDRkNmViNTkiLCJpYXQiOjE2MTk3ODI3NjUsImV4cCI6MTYxOTc4MzA2NX0.4owgxJwqWpeWfjQj1KaqXJrDfBzX0ohF6hNgNMWniUc";
      fetch("http://localhost:3000/v1/auth/login", {
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          email,
          password
        }),
        method: "POST",
        credentials: "include"
      }).then(result => {
        return result.json();
      }).then(jsonResult => {
        console.log(jsonResult);
      }).catch(err => console.log(err))*/

      this.activateLogin(true);
    },
    check: function(){
      console.log(ls.get("vuex"))
    }
  }
}
</script>

<style scoped>
#user-logo {height: 120px;}

</style>