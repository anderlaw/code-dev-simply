export default {
  container: [
    {
      propName: "width",
      propDesc: "宽度",
      propValue: "",
      resolver: (thisObj) => {
        return `${thisObj.propName}:${thisObj.propValue};`;
      },
    },
    {
      propName: "height",
      propDesc: "高度",
      propValue: "",
      resolver: (thisObj) => {
        return `${thisObj.propName}:${thisObj.propValue};`;
      },
    },
  ],
  text:[
    {
      propName: "content",
      propDesc: "内容",
      propValue: "嘻嘻嘻",
      resolver: (thisObj) => {
        return `${thisObj.propName}:${thisObj.propValue};`;
      },
    }
  ]
};
