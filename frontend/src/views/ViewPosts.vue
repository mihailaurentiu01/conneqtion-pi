<template>
  <div>
   <body id="body">
        <router-link class="btn-success p-2" :to="{name: 'AddPost'}">Create post</router-link>
   </body>
  </div>
</template>

<script>
export default {
  name: "ViewPosts"
}
</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>