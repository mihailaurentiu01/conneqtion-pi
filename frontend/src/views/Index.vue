<template>
  <div>
    <navbar></navbar>
    <body id="body">
        <h1>Friends list</h1>
    </body>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  name: "Index",
  components: {Navbar},

}

</script>

<style scoped>
#body {
  background: white;
  min-height: 92vh;
}
</style>