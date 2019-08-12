<template>
  <Layout>
    <template v-slot:header>
      <layout-header />
    </template>
    <template v-slot:nav>
      <tree-menu :menuList="menuList" />
    </template>
    <template v-slot:content>
      <router-view />
    </template>
  </Layout>
</template>

<script>
  import Layout from "@/views/layout/Layout";
  import Menu from "@/views/layout/Menu";
  import Header from "@/views/layout/Header";
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
