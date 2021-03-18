<template>
  <div v-html="htmlStr"></div>
</template>

<script>
// 该preview组件是可以拖拽改变尺寸的
/* eslint-disable */
export default {
  props: ['htmlStr', 'cssString'],
  data() {
    return {
      styleTag: document.createElement("style"),
    };
  },
  mounted() {
    document.body.appendChild(this.styleTag);
    this.styleTag.innerText = this.cssString;
  },
  updated() {
    this.styleTag.innerText = this.cssString;
  },
};
</script>

<style></style>
