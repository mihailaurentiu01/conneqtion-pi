<template>
  <div>
    <navbar @search="search"></navbar>
    <body id="body">
        <div v-if="friendsResult !== null">
          <search :friendsResult="friendsResult"></search>
        </div>
    </body>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Search from "@/components/Search";


export default {
  name: "Index",
  components: {Search, Navbar},
  data: () => {
    return {
      friendsResult: null
    }
  },
  methods: {
    search(item){
     this.friendsResult = item.friendsFound;
    // console.log(item)
    }
  }
}

</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>