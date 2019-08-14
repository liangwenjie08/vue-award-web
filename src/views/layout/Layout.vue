<template>
  <Layout>
    <template v-slot:header>
      <layout-header />
    </template>
    <template v-slot:nav>
      <tree-menu :menuList="menuList" />
    </template>
    <template v-slot:content>
      <div id="container">
        <router-view />
      </div>
    </template>
  </Layout>
</template>

<script>
  import Layout from "@/components/layout/Layout";
  import Menu from "@/components/layout/Menu";
  import Header from "@/components/layout/Header";
  import { TREE_MENU } from "@/api/homeAPI";

  export default {
    name: "home",
    components: {
      Layout,
      "tree-menu": Menu,
      "layout-header": Header
    },
    data() {
      return {
        menuList: []
      };
    },
    methods: {
      async getMenuList() {
        try {
          const response = await this.$axios.request({
            url: TREE_MENU,
            method: this.$axios.method.GET
          });
          this.menuList = response;
        } catch(e) {
          this.menuList = [];
        }
      }
    },
    mounted() {
      this.getMenuList();
    }
  };
</script>

<style scoped>
  #container {
    height: 100%;
    width: 100%;
    padding: 10px;
    background-color: white;
    box-shadow: 0 0 1px gray;
    overflow: auto;
    box-sizing: border-box;
  }
</style>
