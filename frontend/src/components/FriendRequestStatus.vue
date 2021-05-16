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
import {statusAccept} from '../../services/index.services';
import {mapGetters, mapMutations} from 'vuex';
import * as keyNames from '../keynames';

export default {
  name: "FriendRequestStatus",
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  methods: {
    okStatus: async function(){
      const res = await statusAccept(this.notification.notificationId);

      if (res.status === 200){
        this.removeNotification(this.userId + "status");
      }
    },
    ...mapMutations([
      'removeNotification'
    ])
  },
  computed: {
    ...mapGetters({
      userId: keyNames.GET_USER_ID
    })
  }
}
</script>

<style scoped>

</style>