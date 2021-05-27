<template>
  <div>
    <body id="body">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{user.fullName}}</h5>
          <div class="row d-flex justify-content-between">
            <div class="col-md-4">
              <div class="form-group d-flex">
                <input type="email" v-model="newEmail" placeholder="New Email" name="email" id="email" class="form-control mr-2">
                <button @click="changeMail" class="btn-success rounded d-inline">Change</button>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-group d-flex">
                <input type="password" v-model="newPassword" placeholder="New Password" name="password" id="password" class="form-control mr-2">
                <button @click="changePass" class="btn-success rounded d-inline">Change</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </div>
</template>

<script>
import {requestUserData} from '../../services/index.services';
import {changeEmail} from '../../services/index.services';
import {mapGetters} from 'vuex';
import * as keyNames from '../keynames';
import {changePassword} from '../../services/index.services';

export default {
  name: "Profile",
  data: () => {
    return  {
      user: '',
      newEmail: "",
      newPassword: ''
    }
  },
  methods: {
    changeMail: async function(){
      if (this.newEmail.length < 1) return;

      const res = await changeEmail(this.getUserId, this.newEmail);

      if (res === undefined){
        this.$snack.success({
          text: "El correo indicado no está disponible. No se ha cambiado tu email",
          button: "OK"
        });

        return;
      }

      if (res.status === 200){
        this.$snack.success({
          text: "Correo modificado con éxito",
          button: "OK"
        });
      }
    },
    changePass: async function(){
      if (this.newPassword.length < 1) return;

      const res = await changePassword(this.newPassword);

      if (res.status === 200){
          this.$snack.success({
            text: "Contraseña modificada con éxito",
            button: "OK"
          });
        }
    }
  },
  async beforeMount() {
    const res = await requestUserData(this.getUserId);

    if (res.status === 200){
      this.user = res.data.user;
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