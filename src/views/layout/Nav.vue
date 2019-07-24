<template>
  <div>
    <tree-menu />
  </div>
</template>

<script>
  import Menu from "./components/Menu"
  export default {
    name: "Nav",
    components: {
      "tree-menu": Menu
    }
  };
</script>

<style scoped>

</style>