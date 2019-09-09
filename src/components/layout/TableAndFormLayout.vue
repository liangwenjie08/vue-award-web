<template functional>
  <div v-bind="data.attrs" id="table-form-layout">
    <div class="table-layout">
      <div class="table">
        <slot name="table"></slot>
      </div>
      <div class="pagination">
        <slot name="pagination"></slot>
      </div>
    </div>
    <div class="form-layout">
      <slot name="form"></slot>
    </div>
  </div>
</template>

<style lang="less">
  #table-form-layout {
    display: flex;
    /*height: calc(100% - 50px);*/
    flex-flow: row nowrap;

    .table-layout {
      width: calc(100% - 250px);
      margin-right: 10px;
      height: 100%;

      .table {
        height: calc(100% - 32px);
      }

      .pagination {
        height: 32px;
      }
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
