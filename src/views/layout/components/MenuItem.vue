<template functional>
  <fragment v-if="!props.item.hidden">
    <template v-if="props.item.children.length === 0">
      <router-link
        class="router-link"
        :to="props.item.link.length > 0 ? props.item.link : '/'"
      >
        <el-menu-item v-if="props.item.icon.length === 0" :index="props.item.id">
          {{ props.item.title }}
        </el-menu-item>
        <el-menu-item v-else :index="props.item.id">
          <i :class="props.item.icon"></i>
          <span slot="title">{{ props.item.title }}</span>
        </el-menu-item>
      </router-link>
    </template>

    <el-submenu v-else :index="props.item.id" popper-append-to-body>
      <template slot="title">
        <i :class="props.item.icon"></i>
        <span>{{ props.item.title }}</span>
      </template>
      <menu-item v-for="child of props.item.children" :key="child.id" :item="child" />
    </el-submenu>
  </fragment>
</template>

<script>
  export default {
    name: "menu-item"
  };
</script>

<style lang="less" scoped>
  .router-link {
    &:link {
      text-decoration: none;
    }
  }
</style>
