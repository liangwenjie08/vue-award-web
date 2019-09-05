<template functional>
  <div id="table-form-layout">
    <div class="table-layout">
      <slot name="table"></slot>
    </div>
    <div class="form-layout">
      <slot name="form"></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
  #table-form-layout {
    display: flex;
    height: calc(100% - 50px);
    flex-flow: row nowrap;

    .table-layout {
      width: calc(100% - 250px);
      margin-right: 10px;
      height: 100%;
    }

    .form-layout {
      width: 250px;
      overflow: auto;
      height: 100%;
      border: 1px solid #EBEEF5;
      box-sizing: border-box;
      padding: 5px;
    }
  }
</style>
