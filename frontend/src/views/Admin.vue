<template>
  <div>

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
        <div class="col-md-6">
          <div>
            <div class="row d-flex justify-content-center">
              <div class="col-md-6">
                <img id="user-logo" class="img-fluid" src="@/assets/icons/user(1).png" width="80px" alt="User logo">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row d-flex justify-content-center mt-3">
        <div class="col-md-5">
          <form @submit.prevent="loginAsAdmin">
            <div class="form-group">
              <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required>
            </div>
            <button type="submit" class="btn text-light btn-success">Login as admin <img style="height: 30px; width: 30px;" src="@/assets/icons/key.png" alt="Key"></button>
          </form>
        </div>
      </div>

      <div class="row d-flex justify-content-center mt-4">
        <div class="col-6 col-md-4">
          <router-link class="text-light" :to="{name: 'Login'}">Auth as user</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {adminLogin} from '../../services/auth.services';
import {mapMutations} from "vuex";
import * as keyNames from "@/keynames";

export default {
name: "Admin",
  data: () => {
    return {
      password: ''
    }
  },
  methods: {
    loginAsAdmin: async function(){
      if (this.password.length < 1) return;

      const res = await adminLogin(this.password);

      console.log(res);
      if (res.status === 200){
           this.setLoggedIn(true);
          this.setAccessToken(res.data.accessToken);
          this.setUserId(res.data.userId);
          this.setRole(res.data.role);

          await this.$router.push({name: "AdminIndex"});
      }
    },
    ...mapMutations({
      setLoggedIn: keyNames.MUTATE_USER_LOGGED_IN,
      setAccessToken: keyNames.MUTATE_USER_ACCESS_TOKEN,
      setUserId: keyNames.MUTATE_USER_ID,
      setRole: keyNames.MUTATE_ROLE
    })
  }
 }
</script>

<style scoped>

</style>