<template>
  <div>
    <h3>You are searching</h3>

    <h2>Your friends</h2>
    <div v-if="friends.length > 0">
      <div v-for="friend in friends">
        <p>{{friend.fullName}} - {{friend.email}}</p>
      </div>
    </div>
    <hr>
    <h2>Results</h2>
    <div v-if="friendsResult.length > 0">
        <div v-for="(friend, index) in friendsResult">
          <div>
            <p><strong>Name:</strong> {{friend.fullName}}. <strong>Age:</strong> {{friend.birthDate}} <strong>Location: </strong> {{friend.location}}
              <strong>Online: </strong> {{friend.online ? 'yes' : 'no' }}</p>
            <button @click="tryAddFriend(index)" class="btn-success d-inline">Add friend</button>
          </div>
        </div>
    </div>
    <div v-else>
      <h2>There are NO results</h2>
    </div>
  </div>
</template>

<script>
import {addFriend} from '../../services/index.services';

export default {
  name: "Search",
  data: () => {
    return {
      friends: []
    }
  },
  methods: {
    tryAddFriend: async function(index) {
      let backData = await addFriend(this.friendsResult[index].id);
      socket.on("friends", data => {

        if (data.action === "Added Friend"){
          this.addFriend(data.who);
        }

        console.log(data);
      })
    },
    addFriend(user) {
      this.friends.push(user);
    }
  },
  mounted() {


  },
  props: {
    friendsResult: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>