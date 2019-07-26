<template functional>
  <div id="layout">
    <div id="header">
      <slot name="header"></slot>
    </div>
    <div id="body">
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

  #header {
    display: flex;
    flex: 0 0 60px;
    background-color: aqua;
  }

  #body {
    display: flex;
    flex: 1;
    flex-direction: row;
  }

  #nav {
    display: flex;
  }

  #content {
    display: flex;
    flex: 1;
    background-color: blue;
  }
</style>
