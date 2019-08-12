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

<style scoped>
  #layout {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
  }

  #layout-header {
    display: flex;
    flex: 0 0 60px;
    background-color: aqua;
    box-shadow: 0 0 3px 2px gray;
  }

  #layout-body {
    display: flex;
    height: 100%;
    flex-direction: row;
    overflow: auto;
  }

  #nav {
    flex: 0 0 210px;
    overflow: auto;
    box-shadow: 0 0 3px 2px gray;
  }

  #content {
    display: flex;
    flex: 1;
    padding: 10px;
  }
</style>
