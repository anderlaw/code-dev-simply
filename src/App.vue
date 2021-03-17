<template>
<Canvas/>
</template>

<script>
import beautify from './tool/beautify'
import Canvas from './components/canvas'
export default {
  name: 'App',
  components: {
    Canvas
  },
  mounted(){
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
    }
    `
    console.log(html);
    beautify.css(scss,css=>{
      console.log(css);
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
