<template>
  <div style="width:240px;height:800px;background:red;"></div>
  <Canvas style="width:600px;height:800px;background:green;"/>
  <Preview style="width:600px;height:800px;background:pink;" :htmlStr="htmlString" :cssString="cssString"></Preview>
  <div style="width:300px;height:800px;background:orange;"></div>

</template>

<script>
import beautify from "./tool/beautify.js";
import Canvas from "./components/canvas/index.vue";
import Preview from "./components/Preview.vue";
export default {
  name: "App",
  components: {
    Canvas,
    Preview,
  },
  data() {
    return {
      htmlString: "",
      cssString: "",
    };
  },
  mounted() {
    this.htmlString = beautify.html(`
    <div>
    哈哈哈哈
      </div>
    `);

    beautify.css(
      `
    body{
      color:red;
      h1{
        color:green;
      }
    }`,
      (css) => {
            this.cssString = css;
      },
    );
  },
};
</script>

<style>
#app{
  display: flex;
  justify-content: space-between;
}

</style>
