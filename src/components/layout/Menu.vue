<template>
  <el-menu
    class="e-menu"
    text-color="#BFCBD9"
    background-color="#304156"
    active-text-color="#FFFFFF"
    mode="vertical"
    :unique-opened="true"
  >
    <menu-item v-for="item of menuList" :key="item.menuId" :item="item" />
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
        default: [],
        require: true
      }
    }
  };
</script>

<style scoped>
  .e-menu {
    border: none;
    width: 210px;
  }
</style>
