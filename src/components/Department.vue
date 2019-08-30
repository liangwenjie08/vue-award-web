<template>
  <treeselect
    :options="departmentList"
    :normalizer="normalizer"
    style="width: 100%;height: 32px;"
    placeholder="部門"
    :defaultExpandLevel="2"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script>
  import { store, mutations } from "@/utils/common_variable";

  export default {
    name: "Department",
    props: ["value"],
    data() {
      return {
        departmentList: []
      };
    },
    computed: {
      storeDepartmentList() {
        return store.departmentList;
      }
    },
    created() {
      const storeDepartmentList = this.storeDepartmentList;
      if(storeDepartmentList.length > 0) {
        this.departmentList = storeDepartmentList;
      } else {
        this.getDepartmentList();
      }
    },
    methods: {
      async getDepartmentList() {
        const res = await this.$axios.request({
          url: "/api/position/dept"
        });
        this.departmentList = res;
        mutations.setDepartmentList(res);
      },
      normalizer(node) {
        return {
          id: node.deptId,
          label: node.deptDesc,
          children: node.children && node.children.length > 0 ? node.children : undefined
        };
      }
    }
  };
</script>

<style scoped>

</style>
