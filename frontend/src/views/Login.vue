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
              <form>
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
      </div>
    </div>
</template>

<script>
export default {
name: "Login"
}
</script>

<style scoped>
#user-logo {height: 120px;}

</style>