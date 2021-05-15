<template>
  <div>
      <div>
        <div class="row p-2">
          <div class="col-md-2">
            <img width="50px" src="@/assets/icons/user(1).png" alt="User profile image">
          </div>
          <div class="col-md-3 d-flex">
            <strong>Name: </strong> <p>{{ notification.userThatSentFriendship.name }}</p>
          </div>

          <div class="col-md-3 d-flex">
            <strong>Location: </strong> <p>{{ notification.userThatSentFriendship.location }}</p>
          </div>

          <div class="col-md-4">
              <button @click="handleFriendRequest(true)" class="btn-success mr-1">Accept</button>
              <button @click="handleFriendRequest(false)" class="btn-danger">Deny</button>
          </div>
        </div>
        <hr>
      </div>
  </div>
</template>

<script>
import {friendRequestStatus} from '../../services/index.services';
import {mapMutations} from 'vuex';

export default {
name: "FriendRequestNotification",
  data: () => {
    return {

    }
  },
  methods: {
    handleFriendRequest: async function(status){
        const {id} = this.notification.userThatSentFriendship;
        const res = await friendRequestStatus({status, userToBeFriendTo: id});

        if (res.status === 200){
          this.$snack.success({
            text: res.data.msg,
            button: "OK"
          });

          this.removeNotification(res.data.userId);
        }
    },
    ...mapMutations(['removeNotification'])
  },
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>