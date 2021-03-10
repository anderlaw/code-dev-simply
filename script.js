    
    //以默认尺寸渲染设计图
    const currentSize = [375,667];
    const designViewRe = document.querySelector('.design-view');
    function updateDesignViewSize(){
      designViewRe.style.cssText=`width:${currentSize[0]}px;height:${currentSize[1]}px;`
    }
    updateDesignViewSize();
    // const sizeList = [
    //   {
    //     name:"iPhone 6/7/8",
    //     size:[375,667]
    //   },{
    //     name:"iPhone X",
    //     size:[375,812]
    //   },{
    //     name:"iPhone 6/7/8 Plus",
    //     size:[414,736]
    //   }
    //   //待扩展...
    // ]

    //设计图稿处理相关
    let imageSize = [0,0];
    document.querySelector('.design-input').addEventListener('change',e=>{
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e)=>{
        //show image
        document.querySelector('.design-img').src = e.target.result;
        //计算图片原始尺寸
        const newImg = new Image();
        newImg.onload = function(){
          imageSize = [
            newImg.width,
            newImg.height
          ];
        }
        newImg.src =  e.target.result;
      }
      fileReader.readAsDataURL(file)
    })
    
    
    //操作栏部分
    let measurable = false;
    document.querySelector('.icon-box').addEventListener('click',e=>{
      const targte = e.target;
      if(!targte.classList.contains('iconfont')) return;

      //改变尺寸
      if(targte.classList.contains('plus')){
        if(imageSize[0] === 0)return;
        const currentRatio = currentSize[0]/imageSize[0].toFixed(4);
        //直接当前图片的显示尺寸
        const newRatio = currentRatio + 0.06;
        currentSize[0] = imageSize[0]*newRatio;
        currentSize[1] = imageSize[1]*newRatio;
        //更新DOM中图片尺寸
        updateDesignViewSize();
      }
      if(targte.classList.contains('minus')){
        
        if(imageSize[0] === 0)return;
        const currentRatio = currentSize[0]/imageSize[0].toFixed(4);
        //直接当前图片的显示尺寸
        const newRatio = currentRatio - 0.06 <= 0 ? 0.06:currentRatio - 0.06;
        currentSize[0] = imageSize[0]*newRatio;
        currentSize[1] = imageSize[1]*newRatio;
        //更新DOM中图片尺寸
        updateDesignViewSize();
      }

      //测量长度
      if(targte.classList.contains('measure')){
        measurable = !measurable;
        let displayValue = "none"
        if(measurable){
          displayValue = 'block'
        }
        document.querySelector('.measure-box').style.display = displayValue;
      }
    })
    const measureBar = document.querySelector('.measure-box .handle-bar');
    const measureLine = document.querySelector('.measure-box > .line');
    const measureValue = document.querySelector('.measure-box .length-value');
    measureBar.onmousedown = e=>{
      const startPos = [e.offsetX,e.offsetY]
      measureBar.onmousemove = e=>{
        const currentPos = [e.offsetX,e.offsetY];
        let xOffset = currentPos[0]-startPos[0];
        let yOffset = currentPos[1]-startPos[1];

        //更新测量线和测量值

        //处理测量线的位置
        xOffset < 0 && (xOffset = 0);
        yOffset < 0 && (yOffset = 0);

        //判断绘制方向（水平和垂直）
        const VOrHDirec = xOffset >= yOffset ? "H":"V";
        
        
        if(xOffset >= 0 && yOffset >= 0){
          measureLine.style.cssText = `left:${startPos[0]}px;top:${startPos[1]}px;`
          if(VOrHDirec === 'H'){
            measureLine.classList.remove("show-v-length");
            measureLine.classList.add("show-h-length");
            measureValue.innerText = xOffset+"rem";
            
            measureLine.style.width = xOffset+'px';
            measureLine.style.borderTop = '1px dashed';
          }else{
            
            measureLine.classList.remove("show-h-length");
            measureLine.classList.add("show-v-length");
            measureValue.innerText = yOffset+"rem";
            measureLine.style.height = yOffset+'px';
            
            measureLine.style.borderLeft = '1px dashed';
          }
        }
      }
    }
    measureBar.onmouseup = e=>{
      measureBar.onmousemove = null;
    }
    /**
     * /@output
     * 输出 图像的二进制数据、尺寸信息（rem），选区的尺寸信息（rem）
     * 
     * 
     * 修改：去掉下拉框，添加放大、缩小按钮和选区按钮
     * 1.rem配置以图片的10分之一为一个rem,只需计算图像切片占整个图片的宽度百分比，换算为rem.
     * 2.原始图像尺寸数据（协助输出图片切片）
     * 4.当前比例尺
     * 3.选区位置、大小信息
     * 
     * 切片工具（选完提示应用or取消，应用则生成切片）、测量尺（测量水平和垂直距离）
     * */