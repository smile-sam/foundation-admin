<template>
  <div class="containers">
    <div class="canvas" ref="canvas" />
    <!-- <div id="js-properties-panel" class="panel property-panel"></div> -->
    <panel v-if="bpmnModeler" :modeler="bpmnModeler" />
    <!-- <div class="action"> -->
      <!-- 关于打开文件的这个我使用了Element的文件上传组件，在上传前钩子获取到文件然后读取文件内容 -->
      <!-- <el-upload class="upload-demo" :before-upload="openBpmn">
        <el-button icon="el-icon-folder-opened"></el-button>
      </el-upload>
      <el-button class="new" icon="el-icon-circle-plus" @click="newDiagram"></el-button>
      <el-button icon="el-icon-download" @click="downloadBpmn"></el-button>
      <el-button icon="el-icon-picture" @click="downloadSvg"></el-button>
    </div> -->


    <ul class="buttons">
      <li>
        <a href="javascript:" @click="$refs.refFile.click()">加载本地BPMN文件</a>
        <input type="file" id="files" ref="refFile" style="display: none" @change="loadXML" />
      </li>

      <!-- <li>
        <a href="javascript:" @click="saveXML" title="保存为bpmn">保存为BPMN文件</a>
      </li>

      <li>
        <a href="javascript:" @click="saveSVG" title="保存为svg">保存为SVG图片</a>
      </li> -->
      <li>
        <a href="javascript:" ref="saveXML" title="保存为bpmn">保存为BPMN文件</a>
      </li>
      <li>
        <a href="javascript:" ref="saveSvg" title="保存为svg">保存为SVG图片</a>
      </li>
       <li>
        <a href="javascript:" @click="save" title="保存">保存</a>
      </li>

    </ul>
  </div>
</template>

<script>
// import Modeler from 'bpmn-js/lib/Viewer'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import transactionBoundariesModule from 'bpmn-js-transaction-boundaries';
import { xmlStr } from '../../mock/newXmlStr'
import customTranslate from './custom-translate/custom-translate'
import { done } from 'nprogress'

// import panel from './custom-panel/custom-panel';
import panel from './custom-panel/custom-properties-panel';
var customTranslateModule = { translate: [ 'value', customTranslate ] };

export default {
  data(){
    return {    
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: xmlStr
   }
  },
  
  components: {
    panel
  },
  methods: {
    async save() {
        const result = await this.bpmnModeler.saveXML({ format: true });
        this.$store.dispatch('flowable/save', {name: 'level.bpmn', xmlStr: result.xml}).then(() => {
          this.$router.push({ path: this.redirect || '/' })
        }).catch(() => {
          
        })
    },
    init() {
      const canvas = this.$refs.canvas;
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
          //添加控制板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules:[
          // propertiesPanelModule,
          // propertiesProviderModule,
          transactionBoundariesModule,
  　　　　 customTranslateModule
  　　　],
        // needed if you'd like to maintain camunda:XXX properties in the properties panel
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      });
      
    // 监听流程图改变事件
    const that = this;
    this.bpmnModeler.on("commandStack.changed", function() {
      that.saveSVG(function(err, svg) {
        that.setEncoded(downloadSvgLink, "diagram.svg", err ? null : svg);
      });
      that.saveDiagram(function(err, xml) {
        that.setEncoded(downloadLink, "diagram.bpmn", err ? null : xml);
      });
    });


      this.createNewDiagram();
    },
    async createNewDiagram() {
      try {
        const result = await this.bpmnModeler.importXML(this.xmlStr);
        const { warnings } = result;
        console.log(warnings);

        this.success();
      } catch (err) {
        console.log(err.message, err.warnings);
      }
    },
    success() {
      this.addBpmnListener();
    },
    async loadXML() {
      const that = this;
      const file = this.$refs.refFile.files[0];

      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        that.xmlStr = this.result;
        that.createNewDiagram();
      };
    },
    async addBpmnListener() {
      const that = this;
      const downloadLink = this.$refs.saveXML;
      const downloadSvgLink = this.$refs.saveSvg;

      async function opscoffee() {
        try {
          const result = await that.saveSVG();
          const { svg } = result;

          that.setEncoded(downloadSvgLink, "ops-coffee.svg", svg);
        } catch (err) {
          console.log(err);
        }

        try {
          const result = await that.saveXML();
          const { xml } = result;
          that.setEncoded(downloadLink, "ops-coffee.bpmn", xml);
        } catch (err) {
          console.log(err);
        }
      }

      opscoffee();
      this.bpmnModeler.on("commandStack.changed", opscoffee);
    },
    async saveSVG(done) {
      try {
        const result = await this.bpmnModeler.saveSVG(done);
        return result;
      } catch (err) {
        console.log(err);
      }
    },
    async saveXML(done) {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true }, done);
        return result;
      } catch (err) {
        console.log(err);
      }
    },
    setEncoded(link, name, data) {
      const encodedData = encodeURIComponent(data);

      if (data) {
        link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
        link.download = name;
      }
    },

    openBpmn(file) {
      const reader = new FileReader();
      // 读取File对象中的文本信息，编码格式为UTF-8
      reader.readAsText(file, "utf-8");
      reader.onload = () => {
        //读取完毕后将文本信息导入到Bpmn建模器
        this.createNewDiagram(reader.result);
      };
      return false;
    },
    newDiagram() {
      this.createNewDiagram(this.bpmnTemplate);
    },



  },
  
  async mounted() {
    this.init();
  }
}
</script>


<style scoped>


 /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
  /* @import './css/app.less'; */
  /* .containers{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    .canvas{
      width: 100%;
      height: 100%;
    }
    .bjs-powered-by {
      display: none;
    }
  }
  .canves {
  width: 100%;
  height: 100vh;
} */

/* .containers {
  background: white;
  overflow: auto;
  background-image: linear-gradient(
      90deg,
      rgba(220, 220, 220, 0.5) 6%,
      transparent 0
    ),
    linear-gradient(rgba(192, 192, 192, 0.5) 6%, transparent 0);
  background-size: 12px 12px;
  width: 100%;
  height: calc(100vh - 82px);
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
} */
.containers {
  width: 100%;
  height: calc(100vh - 82px);
}
.canvas {
   width: 100%;
height: 100%;
} 
.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
.buttons li {
  display: inline-block;
  margin: 5px;
}
.buttons li a {
  color: #333;
  background: #fff;
  cursor: pointer;
  padding: 8px;
  border: 1px solid #ccc;
  text-decoration: none;
}
.property-panel{
    position: absolute;
    right: 0px;
    top: 0;
    border-left: 1px solid #cccccc;
    padding: 20px 0;
    width: 300px;
    height: 100%;

}

.bpmn-js-properties-panel {
  position: absolute;
  top: 0;
  right: 0px;
  width: 300px;
}

.action {
  position: fixed;
  bottom: 110px;
  left: 100px;
  display: flex;
}
.upload-demo {
  margin-right: 10px;
}

</style>