<template>
  <treeselect
    :options="departmentList"
    :style="{width: '100%',height: '32px',cursor: disabled ? 'not-allowed' : ''}"
    :normalizer="normalizer"
    placeholder="部門"
    :defaultExpandLevel="2"
    :value="value"
    @input="$emit('input', $event)"
    :disabled="disabled"
  />
</template>

<script>
  import { store, mutations } from "@/utils/common_variable";

  export default {
    name: "TextileDepartment",
    props: {
      value: {
        required: true
      },
      disabled: {
        default: false
      }
    },
    data() {
      return {
        departmentList: []
      };
    },
    computed: {
      storeTextileDepartmentList() {
        return store.textileDepartmentList;
      }
    },
    created() {
      const storeTextileDepartmentList = this.storeTextileDepartmentList;
      if(storeTextileDepartmentList.length > 0) {
        this.departmentList = storeTextileDepartmentList;
      } else {
        this.getDepartmentList();
      }
    },
    methods: {
      async getDepartmentList() {
        const res = await this.$axios.request({
          url: "/department",
          params: {
            tree: true
          }
        });
        this.departmentList = res;
        mutations.setTextileDepartmentList(res);
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children && node.children.length > 0 ? node.children : undefined
        };
      }
    }
  };
</script>
