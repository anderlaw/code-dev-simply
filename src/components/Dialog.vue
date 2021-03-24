<template>
  <div class="dialog-layout" v-show="visible">
    <div class="dialog-container">
      <button class="close-btn" @click="closeDialog">X</button>
      <div class="title">新建节点</div>
      <div class="content">
        <div class="form-item" v-for="(prop,index) in localNode" :key="index">
          <div class="key">{{ prop.propDesc }}</div>
          <input class="value" type="text" v-model="prop.propValue">
        </div>
      </div>
      <div style="text-align:center;margin-top:20px;">
        <button @click="doIt">确定</button>
      </div>
      
    </div>
  </div>
</template>

<script>

import resolver from '../resolver'
export default {
  props:['visible','createType'],
  data(){
    return {
      localNode:{}
    }
  },
  methods:{
    closeDialog(){
      this.$emit('dialogWillClose')
    },
    doIt(){

    }
  },
  mounted(){
    // console.log(this.createType);
  },
  updated(){
    if(this.visible){
      this.localNode = resolver[this.createType]
    }
  }
}
</script>

<style scoped>
.dialog-layout{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.dialog-container{
  background-color: rgba(0,0,0,.5);
  margin-top: 20vh;
  margin-left: 50%;
  width: 320px;
  transform: translateX(-50%);
  color: #ecf5ff;
  padding: 30px 10px;
  border-radius: 6px;
}
.title{
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
.close-btn{
  float: right;
  margin-right: 10px;
}

.form-item{
  font-size: 18px;
  display: flex;
  align-items: center;
  padding: 6px 10px;
}
.form-item .key{
  width: 80px;
}
.form-item .value{
  font-size: 18px;
}
</style>