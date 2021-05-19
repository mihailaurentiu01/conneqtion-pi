<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Search from "@/components/Search";
export default {
  name: "Posts",
  components: {Search, Navbar},
  data: () => {
    return {
      friendsResult: null,
      query: '',
      searchEnabled: true
    }
  },
  methods: {
    search(item) {
      if (item === undefined) return;
      this.friendsResult = item.friendsFound;
    },
    searchQuery(item) {
      this.searchEnabled = true;
      this.query = item;
    },
    enableSearch(val) {
      this.searchEnabled = val;
    },
  }
}
</script>

<style scoped>

</style>