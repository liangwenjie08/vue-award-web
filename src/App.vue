<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
  body,
  html {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  body {
    .el-table th.gutter {
      display: table-cell !important;
    }

    .el-table colgroup.gutter {
      display: table-cell !important;
    }
  }
</style>
