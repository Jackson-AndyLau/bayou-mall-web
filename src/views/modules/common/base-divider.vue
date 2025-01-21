<template>
  <div class="base-divider">
    <div class="divider-line"></div>
  </div>
</template>

<script>
export default {
  name: 'BaseDivider'
}
</script>

<style scoped>
.base-divider {
  display: flex;
  align-items: center;
  padding: 12px;
}

.divider-line {
  flex-grow: 1;
  border-top: 1px solid #ccc;
  height: 0;
}
</style>
