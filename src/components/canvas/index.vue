<template>
  <div class="container" style="margin:10px;">
    <input type="file" class="design-input" />
    <div class="icon-box">
      <span class="size-plus iconfont icon-z"></span>
      <span class="size-minus iconfont icon-suoxiao2"></span>
      <span :class="handleType === 'Measure'?'active':''" class="measure iconfont icon-celiang1"></span>
      <span :class="handleType === 'Select'?'active':''" class="select iconfont icon-icon_common_region"></span>
      <span class="iconfont" @click="cropPicture">OK</span>
    </div>
    <div
      class="design-view"
      :style="{ width: imgSize[0] + 'px', height: imgSize[1] + 'px' }"
    >
      <img class="design-img" alt="" />
      <!-- 测量 -->
      <div class="measure-container" v-show="handleType === 'Measure'">
        <div class="line show-h-length">
          <div class="length-value"></div>
        </div>
        <div class="handle-bar"></div>
      </div>
      <!-- 选区 -->
      <div class="select-container" v-show="handleType === 'Select'">
        <!-- 按下拖拉选区、改变大小、改变位置 -->
        <div class="select-box">
          <!-- 悬浮框展示剪切框大小 -->
          <!-- <div class="tooltip-box">
            <div>
              <span class="key">W</span>
              <span>:</span>
              <span class="value_W">253.00</span> PX
            </div>
            <div>
              <span class="key">H</span>
              <span>:</span>
              <span class="value_H">131.40</span> PX
            </div>
          </div> -->
          <!-- 框 -->
          <div class="frame-box">
            <div class="horizontal"></div>
            <div class="vertical"></div>
          </div>

          <!-- 四个中位点 -->
          <div class="dot-box">
            <div class="dot left"></div>
            <div class="dot right"></div>
            <div class="dot top"></div>
            <div class="dot bottom"></div>
          </div>
          <!-- 四条线，作为操作句柄 遮盖住前面所有的同级元素，可忽略其他兄弟元素的事件 -->
          <div class="handle-box">
            <div class="resize_line_left"></div>
            <div class="resize_line_right"></div>
            <div class="resize_line_top"></div>
            <div class="resize_line_bottom"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这是画板组件。
//维持自己的状态，选区完成后输出图片二进制、位置数据给上层组件
export default {
  data() {
    return {
      //图片引用
      imgRef: null,
      //图片尺寸
      imgSize: [375, 667],
      //比例尺
      ratioRuler: 0,
      //Measure|Select
      handleType: "",
      //outputBs64
      
    };
  },
  methods:{
    //初始化测量和选区的事件
    initMeasureAndSelectEvent() {
      //测量操作
      const measureBar = document.querySelector(".measure-container .handle-bar");
      const measureLine = document.querySelector(".measure-container > .line");
      const measureValue = document.querySelector(".measure-container .length-value");
      measureBar.onmousedown = (e) => {
        const startPos = [e.offsetX, e.offsetY];
        measureBar.onmousemove = (e) => {
          const currentPos = [e.offsetX, e.offsetY];
          let xOffset = currentPos[0] - startPos[0];
          let yOffset = currentPos[1] - startPos[1];
  
          //更新测量线和测量值
  
          //处理测量线的位置
          xOffset < 0 && (xOffset = 0);
          yOffset < 0 && (yOffset = 0);
  
          //判断绘制方向（水平和垂直）
          const VOrHDirec = xOffset >= yOffset ? "H" : "V";
  
          if (xOffset >= 0 && yOffset >= 0) {
            measureLine.style.cssText = `left:${startPos[0]}px;top:${startPos[1]}px;`;
            if (VOrHDirec === "H") {
              measureLine.classList.remove("show-v-length");
              measureLine.classList.add("show-h-length");
              measureValue.innerText = (xOffset/(this.imgSize[0]/10)).toFixed(2) + "rem";
  
              measureLine.style.width = xOffset + "px";
              measureLine.style.borderTop = "1px dashed";
            } else {
              measureLine.classList.remove("show-h-length");
              measureLine.classList.add("show-v-length");
              measureValue.innerText = (yOffset/(this.imgSize[0]/10)).toFixed(2) + "rem";
              measureLine.style.height = yOffset + "px";
  
              measureLine.style.borderLeft = "1px dashed";
            }
          }
        };
      };
      measureBar.onmouseup = () => {
        measureBar.onmousemove = null;
      };
  
      //选区操作
      const selectBase = document.querySelector(".select-container");
      const selectBox = document.querySelector(".select-container .select-box");
      const handleBox = document.querySelector(".select-container .handle-box");
      selectBase.onmousedown = (outerE) => {
        const startPos = [outerE.offsetX, outerE.offsetY];
        if (!outerE.target.classList.contains("select-container")) return;
        const startClientPos = [outerE.clientX, outerE.clientY];
        selectBase.onmousemove = (e) => {
          const endClientPos = [e.clientX, e.clientY];
          let xOffset = endClientPos[0] - startClientPos[0];
          let yOffset = endClientPos[1] - startClientPos[1];
  
          xOffset < 0 && (xOffset = 0);
          yOffset < 0 && (yOffset = 0);
          selectBox.style.cssText = `left:${startPos[0]}px;top:${startPos[1]}px;width:${xOffset}px;height:${yOffset}px;`;
        };
      };
      selectBase.onmouseup = () => {
        selectBase.onmousemove = null;
      };
      //改变位置、大小
      handleBox.onmousedown = (outerE) => {
        const style = getComputedStyle(selectBox);
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        const left = parseFloat(style.left);
        const top = parseFloat(style.top);
        //动作类型
        let actionType = "move";
        const classList = outerE.target.classList;
        if (classList.contains("resize_line_left")) {
          actionType = "resizeLeft";
        } else if (classList.contains("resize_line_top")) {
          actionType = "resizeTop";
        } else if (classList.contains("resize_line_right")) {
          actionType = "resizeRight";
        } else if (classList.contains("resize_line_bottom")) {
          actionType = "resizeBottom";
        }
        selectBase.onmousemove = (e) => {
          let xOffset = e.clientX - outerE.clientX;
          let yOffset = e.clientY - outerE.clientY;
          let localLeft = left;
          let localTop = top;
          let localWidth = width;
          let localHeight = height;
          switch (actionType) {
            case "move":
              localLeft = left + xOffset;
              localTop = top + yOffset;
              localLeft < 0 && (localLeft = 0);
              localTop < 0 && (localTop = 0);
              break;
            case "resizeLeft":
              localLeft = left + xOffset;
              localWidth = width - xOffset;
              localLeft < 0 && (localLeft = 0);
              localWidth < 0 && (localWidth = 0);
              break;
            case "resizeTop":
              localTop = top + yOffset;
              localHeight = height - yOffset;
              localTop < 0 && (localTop = 0);
              localHeight < 0 && (localHeight = 0);
              break;
            case "resizeRight":
              localWidth = width + xOffset;
              localWidth < 0 && (localWidth = 0);
              break;
            case "resizeBottom":
              localHeight = height + yOffset;
              localHeight < 0 && (localHeight = 0);
              break;
          }
          selectBox.style.cssText = `left:${localLeft}px;top:${localTop}px;width:${localWidth}px;height:${localHeight}px;`;
        };
      };
      selectBase.onmouseup = () => {
        selectBase.onmousemove = null;
      };
    },
    cropPicture(){
      //剪切图片
      //计算剪切框的位置和大小
      const style = getComputedStyle(document.querySelector('.select-box'));
      const left = parseFloat(style.left)/this.ratioRuler;
      const top = parseFloat(style.top)/this.ratioRuler;
      const width = parseFloat(style.width)/this.ratioRuler;
      const height = parseFloat(style.height)/this.ratioRuler;

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      context.drawImage(this.imgRef,left, top,width, height, 0, 0, width, height);
      var bs64 = canvas.toDataURL("image/jpeg");
      console.log(bs64);
    }
  },
  mounted() {
    //记录图片元素引用
    this.imgRef = document.querySelector(".design-img");

    //图稿插入事件
    document.querySelector(".design-input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const bs64 = e.target.result;
        //show image
        this.imgRef.src = bs64;
        //计算显示图片的比例尺（显示尺寸/原始尺寸）
        const newImg = new Image();
        newImg.onload = () => {
          this.ratioRuler = this.imgSize[0] / newImg.width;
        };
        newImg.src = bs64;
      };
      fileReader.readAsDataURL(file);
    });

    //操作栏点击事件
    document.querySelector(".icon-box").addEventListener("click", (e) => {
      const targte = e.target;
      if (!targte.classList.contains("iconfont")) return; 
      //改变尺寸
      if (targte.className.indexOf("size") != -1) {
        //未初始化设计图
        if (this.ratioRuler === 0) return;
        //计算真实尺寸
        const realImgSize = [
          this.imgSize[0] / this.ratioRuler,
          this.imgSize[1] / this.ratioRuler,
        ];
        //放大
        if (targte.classList.contains("size-plus")) {
          //比例尺累加
          this.ratioRuler += 0.06;
        }else{
          //缩小
          //比例尺缩小
          this.ratioRuler = this.ratioRuler - 0.06 <= 0 ? 0.06 : this.ratioRuler - 0.06;
        }
        
        //真实尺寸基础上修改显示尺寸
        this.imgSize[0] = realImgSize[0] * this.ratioRuler;
        this.imgSize[1] = realImgSize[1] * this.ratioRuler;
      }

      //测量
      if(targte.classList.contains("measure")){
        if(this.handleType != "Measure"){
          this.handleType = "Measure"
        }else if(this.handleType == "Measure"){
          this.handleType = "";
        }
      }
      //选区
      if(targte.classList.contains("select")){
        if(this.handleType != "Select"){
          this.handleType = "Select"
        }else if(this.handleType == "Select"){
          this.handleType = "";
        }
      }
    });

    //初始化操作事件
    this.initMeasureAndSelectEvent();
    
    //输出布局
    /**节点类型-》容器类型涉及到布局
     *
     * 布局：水平，垂直布局
     * 主轴对齐
     * 次轴对齐
     */

    /**
     * demo:从设计图中切一个文本节点。
     */
    // const resolvers = [
    //   {
    //     id: 1,
    //     desc: "水平布局-居中",
    //     ownCss: {
    //       display: "flex",
    //       flexDirection: "row",
    //       justifyContent: "space-between",
    //     },
    //     childCss: {
    //       every: {},
    //       each: [],
    //     },
    //   },
    //   {
    //     id: 2,
    //     desc: "垂直布局",
    //     ownCss: {
    //       display: "flex",
    //       flexDirection: "column",
    //     },
    //   },
    // ];
    // const nodes = [
    //   {
    //     id: 1,
    //     desc: "容器节点",
    //     css: {
    //       width,
    //       height,
    //       padding,
    //       border,
    //       backgroundColor,
    //     },
    //   },
    //   {
    //     id: 2,
    //     desc: "图片节点",
    //     css: {
    //       width,
    //       height,
    //       borderRadius,
    //     },
    //   },
    //   {
    //     id: 3,
    //     desc: "文本节点",
    //     css: {
    //       width,
    //       height,
    //       padding,
    //       fontSize,
    //       lineHeight,
    //       color,
    //     },
    //     property: {
    //       innerText,
    //     },
    //   },
    //   {
    //     id: 4,
    //     desc: "根节点",
    //     css: {
    //       position: "fixed",
    //       left: 0,
    //       top: 0,
    //       right: 0,
    //       bottom: 0,
    //       backgroundColor,
    //     },
    //   },
    //   {
    //     id: 5,
    //     desc: "输入框表单",
    //     css: {
    //       width,
    //       height,
    //       lineHeight,
    //       padding,
    //       color,
    //       fontSize,
    //       border,
    //     },
    //   },
    // ];
    // function echoTextNode() {
    //   //选择了文本节点
    //   let nodeId = 3;
    //   //将配置里的字段作为表单映射到页面上
    //   //回收后再收集起来
    //   let node = {
    //     nodeId: nodeId,
    //     css: {
    //       width: "100px",
    //       height: "100px",
    //       padding: "10px",
    //       fontSize: "18px",
    //       lineHeight: "30px",
    //       color: "red",
    //     },
    //     property: {
    //       innerText: "hello,world!",
    //     },
    //   };
    // }
  },
};
</script>

<style scoped>
@import url(./style.css);
</style>
