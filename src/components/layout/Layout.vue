<template functional>
  <div id="layout">
    <div id="layout-header">
      <slot name="header"></slot>
    </div>
    <div id="layout-body">
      <div id="nav">
        <slot name="nav"></slot>
      </div>
      <div id="content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  #layout {
    height: 100%;
    width: 100%;

    #layout-header {
      display: flex;
      height: 60px;
      background-color: aqua;
      box-shadow: 0 0 3px 2px gray;
    }

    #layout-body {
      display: flex;
      height: calc(100% - 60px);
      flex-direction: row;
      overflow: auto;
    }

    #nav {
      flex: 0 0 210px;
      overflow: hidden auto;
      box-shadow: 0 0 3px 2px gray;
    }

    #content {
      height: 100%;
      width: calc(100% - 210px);
      padding: 10px;
      background-color: #E7EAED;
      box-sizing: border-box;
    }
  }
</style>
