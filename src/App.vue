<template>
  <!-- <div style="width:240px;height:800px;background:red;"></div>
  <Canvas style="width:600px;height:800px;background:green;"/>
  <Preview style="width:600px;height:800px;background:pink;" :htmlStr="htmlString" :cssString="cssString"></Preview>
  <div style="width:300px;height:800px;background:orange;"></div> -->
  <div class="header">
    <div class="logo">Coding Simplify!</div>
    <div class="icon-btn_container">
      <!-- 设计模式 -->
      <div
        class="icon-item"
        :class="viewMode === 'Design' ? 'active' : ''"
        v-on:click="viewMode = 'Design'"
      >
        <span class="iconfont icon-design-tool-pen-station1"></span>
        <span class="icontext">设计稿</span>
      </div>
      <!-- 预览模式 -->
      <div
        class="icon-item"
        :class="viewMode === 'Preview' ? 'active' : ''"
        v-on:click="viewMode = 'Preview'"
      >
        <span class="iconfont icon-yulan"></span>
        <span class="icontext">效果预览</span>
      </div>
      <div>|</div>
      <div class="icon-item">
        <span class="iconfont icon-daochu1"></span>
        <span class="icontext">导出</span>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="tree-container">
      <div class="left-bar">
        <div class="icon-item" @click="createNode('container')" data-tooltip="添加容器节点">
          <span class="iconfont icon-box"></span>
        </div>
        <div class="icon-item" @click="createNode('text')" data-tooltip="添加文本节点">
          <span class="iconfont icon-text"></span>
        </div>
        <div class="icon-item" @click="createNode('image')" data-tooltip="添加图像节点">
          <span class="iconfont icon-image"></span>
        </div>
      </div>
      <vue-tree-plugin 
      @onNodeClick="handleNodeClick"
      :data="treeData" />
    </div>
    <div class="view-container">
      <div class="no-img-tip" v-if="!imgInserted">请插入设计图</div>
      <div class="content-box">
        <!-- 设计图 -->
        <div v-show="viewMode === 'Design'" class="design-container">
          <!-- <img
            style="width:400px"
            src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2564044480,3741788506&fm=15&gp=0.jpg"
            alt=""
          /> -->
          <Canvas @bs65Made="cacheBs64Data"/>
        </div>
        <!-- 预览图 -->
        <div
          v-show="viewMode === 'Preview'"
          :style="previewProps"
          class="preview-container"
        >
          <div class="resizable-handle resizable-n"></div>
          <div class="resizable-handle resizable-e"></div>
          <div class="resizable-handle resizable-s"></div>
          <div class="resizable-handle resizable-w"></div>
          <!-- 代码组件 -->
        </div>
      </div>
    </div>
    <div class="prop-container"></div>
  </div>
  <Dialog 
  :visible="showDialog"
  :createType="createType"
  @dialogWillClose="showDialog=false"
  />
</template>

<script>
// import beautify from "./tool/beautify.js";
import Canvas from "./components/canvas/index.vue";
import Dialog from './components/Dialog'
// import Preview from "./components/Preview.vue";
export default {
  name: "App",
  components: {
    Canvas,
    Dialog,
    // Preview,
  },
  data() {
    return {
      //视图模式,设计模式、预览模式
      viewMode: "Preview",
      //是否导入设计图
      imgInserted: false,
      //预览窗口的尺寸和位置
      previewProps: {
        marginTop: null,
        marginLeft: null,
        width: null,
        height: null,
      },
      showDialog:false,
      createType:"",
      treeData: [
        {
          name: "page",
          desc: "测试节点",
          isLeaf: false,
          children: [],
        },
      ],
      currentPos:"",//当前激活节点的位置
      bs64Data:"",
      //
    };
  },
  methods: {
    cacheBs64Data(data){
      this.bs64Data = data;
      console.log(data);
    },
    initPreviewEvent() {
      //拖拽事件
      const previewBox = document.querySelector(".preview-container");

      let mouseDownTargetList = null;
      let width = 0;
      let height = 0;
      let marginTop = 0;
      let marginLeft = 0;
      let downEvent;
      let moveEvent;
      const mouseMoveHandler = (event) => {
        moveEvent = event;
        const offsetX = moveEvent.clientX - downEvent.clientX;
        const offsetY = moveEvent.clientY - downEvent.clientY;
        if (mouseDownTargetList.contains("resizable-w")) {
          //左,更改marginLeft和width
          this.previewProps.width = width - offsetX + "px";
          this.previewProps.marginLeft = marginLeft + offsetX + "px";
        } else if (mouseDownTargetList.contains("resizable-n")) {
          //上,更改marginTop和height
          this.previewProps.height = height - offsetY + "px";
          this.previewProps.marginTop = marginTop + offsetY + "px";
        } else if (mouseDownTargetList.contains("resizable-e")) {
          //右,更改width
          this.previewProps.width = width + offsetX + "px";
        } else if (mouseDownTargetList.contains("resizable-s")) {
          //下,更改height
          this.previewProps.height = height + offsetY + "px";
        }
      };
      previewBox.onmousedown = (event) => {
        //侦测resizable
        if (!event.target.classList.contains("resizable-handle")) return;
        //记录event目标的classList
        downEvent = event;
        mouseDownTargetList = event.target.classList;
        //计算鼠标按下时的位置和长宽
        const cptStyle = getComputedStyle(previewBox);
        width = parseFloat(cptStyle.width);
        height = parseFloat(cptStyle.height);
        marginTop = parseFloat(cptStyle.marginTop);
        marginLeft = parseFloat(cptStyle.marginLeft);

        //监听
        document.body.addEventListener("mousemove", mouseMoveHandler);
      };
      document.body.addEventListener("mouseup", () => {
        document.body.removeEventListener("mousemove", mouseMoveHandler);
      });
    },
    handleNodeClick(pos){
      this.currentPos = pos;
    },
    // 新建节点
    createNode(nodeType){
      this.showDialog = true;
      this.createType = nodeType
    }
  },
  mounted() {
    this.initPreviewEvent();
  },
};
</script>

<style scoped>
@import url(./App.css);
</style>
