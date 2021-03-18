<template>
  <!-- <div style="width:240px;height:800px;background:red;"></div>
  <Canvas style="width:600px;height:800px;background:green;"/>
  <Preview style="width:600px;height:800px;background:pink;" :htmlStr="htmlString" :cssString="cssString"></Preview>
  <div style="width:300px;height:800px;background:orange;"></div> -->
<div class="header">
</div>
<div class="container">
  <div class="tree-container">

  </div>
  <div class="view-container">
    <div class="content-box">

    </div>
  </div>
  <div class="prop-container">

  </div>
</div>

</template>

<script>
// import beautify from "./tool/beautify.js";
// import Canvas from "./components/canvas/index.vue";
// import Preview from "./components/Preview.vue";
export default {
  name: "App",
  components: {
    // Canvas,
    // Preview,
  },
  data() {
    return {
      htmlString: "",
      cssString: "",
    };
  },
  mounted() {
  },
};
</script>

<style>
@import url(./App.css);
</style>
