<template>
  <div>
    <div class="container">
      <button class="btn-success p-2 my-4" @click="back"><- Go Back</button>
      <h3>You are searching for '{{query}}'</h3>
      <hr>
        <div v-if="friendsResult.length > 0">
          <h2>Results - People</h2>
          <div v-for="(friend, index) in friendsResult">
            <div class="border rounded p-2 mb-4">
              <div class="row">
                <div class="col-md-1 mt-2 d-none d-md-block">
                  <img width="50px" src="@/assets/icons/user(1).png" alt="User profile image">
                </div>
                <div class="col-md-1 mt-2 d-block d-md-none d-flex justify-content-center">
                  <img width="80px" src="@/assets/icons/user(1).png" alt="User profile image">
                </div>

                <div class="col-md-2 d-none d-md-block">
                  <p><strong>Name:</strong> {{friend.fullName}}</p>
                  <p><strong>Location: </strong> {{friend.location}}</p>
                </div>

                <div class="col-md-2 d-block d-md-none mt-3 mr-3 d-flex justify-content-center">
                  <p class="mr-3"><strong>Name:</strong> {{friend.fullName}}</p>
                  <p><strong>Location: </strong> {{friend.location}}</p>
                </div>

                <div class="col-md-4 mt-3 d-none d-md-block">
                  <button :ref='"btn-pc" + index' @click="tryAddFriend(index)" class="btn-success rounded d-inline">Add friend <img width="20px" src="@/assets/icons/add-user.png" alt="Add friend"></button>
                </div>

                <div class="col-md-6 mt-2 d-block d-md-none">
                  <button :ref='"btn-phone" + index' @click="tryAddFriend(index)" class="btn-success rounded btn-block">Add friend <img width="20px" src="@/assets/icons/add-user.png" alt="Add friend"></button>
                </div>

              </div>
            </div>
          </div>
          <hr>
        </div>
        <div v-else>
          <h2>There are NO results</h2>
        </div>
      </div>
    </div>
</template>

<script>
import {addFriend} from '../../services/index.services'
import {mapGetters} from 'vuex';
import * as keyNames from '../keynames';
import clientSocket from "socket.io-client";

export default {
  name: "Search",
  data: () => {
    return {

    }
  },
  methods: {
    tryAddFriend: async function(index) {
      let friendShipStatus = await addFriend(this.friendsResult[index].id);

      if (friendShipStatus.status === 200){
        this.$snack.success({
          text: friendShipStatus.data.message,
          button: "OK"
        });

        this.$refs["btn-pc"+index][0].disabled = "disabled";
        this.$refs["btn-phone"+index][0].disabled = "disabled";

        // Add notification


      }
    },
    back: function(){
      this.emit("enableSearch", false);
    },
    emit (eventName, value) {
      this.$emit(eventName, value)
      this.$nextTick()
    },
  },
  mounted(){
    const socket = clientSocket.connect("http://localhost:3000");

   socket.on("receivedFriendship " + this.getUserId, data => {
      const {msg} = data;

      this.$snack.success({
        text: msg,
        button: "OK"
      });

      let index = this.friendsResult.findIndex(f => f.id === data.id);
      this.friendsResult.splice(index, 1);
    });
  },
  computed: {
    ...mapGetters({
      getUserId: keyNames.GET_USER_ID
    })
  },
  props: {
    friendsResult: {
      type: Array,
      required: true
    },
    query: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>