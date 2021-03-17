<template>
<Canvas/>
</template>

<script lang="ts">
import alertStr from './tool/log'
import beautify from './tool/beautify'
import Canvas from './components/canvas/index.vue'
export default {
  name: 'App',
  components: {
    Canvas
  },
  mounted(){
    alertStr("123");
    const html = beautify.html(`
    <div>
    哈哈哈哈
      </div>
    `)
    const scss = `
    body{
      color:red;
      h1{
        color:green;
      }
    }`;
    console.log(html);
    beautify.css(scss,(css: any)=>{
      console.log(css);
    })
  }
}
</script>

<style>
</style>
