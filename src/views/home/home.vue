<template>
  <Layout>
    <template v-slot:nav>
      <tree-menu :menuList="menuList" />
    </template>
  </Layout>
</template>

<script>
  import Layout from "@/views/layout/Layout";
  import Menu from "@/views/layout/components/Menu";

  export default {
    name: "home",
    components: {
      Layout,
      "tree-menu": Menu
    },
    data() {
      return {
        menuList: [
          {
            "id": "73E20BA9-eAfB-3565-eC5f-293366EF753A",
            "title": "首页",
            "link": "/admin",
            "icon": "el-icon-s-home",
            "hidden": false,
            "children": []
          },
          {
            "id": "159E492C-ac5f-e4f7-b0Bc-Fc11F03fF3db",
            "title": "组件",
            "link": "",
            "icon": "el-icon-menu",
            "hidden": false,
            "children": [
              {
                "id": "Fc4b85B8-dF29-7Ade-AEfF-68eaE7822Ba8",
                "title": "数字跳动",
                "link": "/admin/components/count-to",
                "icon": "",
                "hidden": false,
                "children": []
              },
              {
                "id": "AfC42Bd7-7eE5-6157-84d6-d6AB5A1e14e2",
                "title": "小组件",
                "link": "/admin/components/mixin",
                "icon": "",
                "hidden": false,
                "children": []
              },
              {
                "id": "A8F1b6C2-Fd1e-e98b-F444-268ACD6BC6F6",
                "title": "返回顶部",
                "link": "/admin/components/back-to-top",
                "icon": "",
                "hidden": false,
                "children": []
              },
              {
                "id": "A2fBB5B3-4Be6-76CB-f2f9-9f2DfAeF5d43",
                "title": "拖拽",
                "link": "/admin/components/drag",
                "icon": "",
                "hidden": false,
                "children": []
              },
              {
                "id": "e8CEdD12-3CF6-a6E5-6973-De9A9C0ecb4e",
                "title": "sticky",
                "link": "/admin/components/sticky",
                "icon": "",
                "hidden": false,
                "children": []
              }
            ]
          }
        ]
      };
    }
  };
</script>

<style scoped>

</style>