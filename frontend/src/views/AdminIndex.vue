<template>
  <div>
    <navbar></navbar>
      <body id="body">
      </body>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  name: "AdminIndex",
  components: {Navbar},
  mounted() {
  }
}
</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>