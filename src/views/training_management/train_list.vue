<template>
  <div id="train_list">
    <textile-department v-model="deptId"></textile-department>
  </div>
</template>

<script>
  export default {
    name: "train_list",
    data() {
      return {
        deptId: undefined
      };
    },
  };
</script>

<style scoped>

</style>
