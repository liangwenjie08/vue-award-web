<template functional>
  <el-table
    ref="tableBoxRef"
    :data="props.data"
    border
    height="100%"
    style="width:100%;"
    tooltip-effect="light"
    size="mini"
  >
    <slot></slot>
  </el-table>
</template>
