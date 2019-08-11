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
    flex: 1;
    flex-direction: column;
  }

  #layout-header {
    display: flex;
    flex: 0 0 60px;
    background-color: aqua;
  }

  #layout-body {
    display: flex;
    flex: 1;
    flex-direction: row;
  }

  #nav {
    overflow: auto;
  }

  #content {
    display: flex;
    flex: 1;
    background-color: blue;
  }
</style>
