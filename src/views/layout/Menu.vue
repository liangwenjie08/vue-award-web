<template>
  <el-menu
    class="e-menu"
    text-color="#BFCBD9"
    background-color="#304156"
    active-text-color="#FFFFFF"
    mode="vertical"
    :unique-opened="true"
  >
    <menu-item v-for="item of menuList" :key="item.id" :item="item" />
  </el-menu>
</template>

<script>
  import MenuItem from "./MenuItem.vue";

  export default {
    name: "Menu",
    components: {
      "menu-item": MenuItem
    },
    props: {
      menuList: {
        require: true
      }
    },
    created() {

    }
  };
</script>

<style scoped>
  .e-menu {
    border: none;
    flex: 0 0 200px;
  }
</style>
