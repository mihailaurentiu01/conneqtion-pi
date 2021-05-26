<template>
  <div>
    <div class="row p-2">
      <div class="col-md-12 d-flex">
        <p>{{notification.msg}}</p> <button @click="okStatus" class="btn-success ml-3">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import {statusAccept} from "../../services/index.services";
import {mapMutations} from "vuex";

export default {
name: "PostLikedNotification",
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods:{
    okStatus: async function(){
      const res = await statusAccept(this.notification.notificationId);

      if (res.status === 200){
        this.removeNotificationById(this.notification.notificationId);
      }
    },
    ...mapMutations([
      'removeNotificationById'
    ])
  }
}
</script>

<style scoped>

</style>