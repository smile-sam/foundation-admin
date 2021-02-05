<template>
  <div class="canvas">

    <el-button type="primary">
      <el-icon type="home" /> Primary
    </el-button>
    <el-button>Default</el-button>
    <el-button type="dashed">
      Dashed
    </el-button>
    <el-button type="danger">
      Danger
    </el-button>
    <el-config-provider :auto-insert-space-in-button="false">
      <el-button type="primary">
        按钮
      </el-button>
    </el-config-provider>
    <el-button type="primary">
      按钮
    </el-button>
    <el-button type="link">
      Link
    </el-button>
    <div>
      <el-tabs @change="callback">
        <el-tab-pane key="1" tab="Tab 1">
          <div class="icons-list">

          </div>
        </el-tab-pane>
        <el-tab-pane key="2" tab="Tab 2" force-render>
          Content of Tab Pane 2
        </el-tab-pane>
        <el-tab-pane key="3" tab="Tab 3">
          Content of Tab Pane 3
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <div style="width: 500px">
        <el-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
          <el-radio-button value="top">
            Horizontal
          </el-radio-button>
          <el-radio-button value="left">
            Vertical
          </el-radio-button>
        </el-radio-group>
        <el-tabs
          :tab-position="mode"
          :style="{ height: '200px' }"
          @prevClick="callback"
          @nextClick="callback"
        >
          <el-tab-pane v-for="i in 30" :key="i" :tab="`Tab-${i}`"> Content of tab {{ i }} </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div>
      <el-collapse v-model="activeKey" @change="changeActivekey">
        <el-collapse-item key="1" header="This is panel header 1">
          <el-collapse default-active-key="4">
            <el-collapse-item key="4" header="This is panel nest panel">
              <p>{{ text }}</p>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
        <el-collapse-item key="2" header="This is panel header 2" :disabled="false">
          <p>{{ text }}</p>
        </el-collapse-item>
        <el-collapse-item key="3" header="This is panel header 3">
          <p>{{ text }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-row>
      <el-col :span="12">
        col-12
      </el-col>
      <el-col :span="12">
        col-12
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Example',
  components: {

  },
  data() {
    return {
      mode: 'top',
      activeKey: [],
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`

    }
  },
  methods: {
    changeActivekey(key) {
      console.log(key)
    },
    callback(key) {
      console.log(key)
    }
  }
}
</script>

<style scoped>
  .canvas{
    width: 100%;
    height: 100%;
    background-color: azure;
  }
  .icons-list ::v-deep(.anticon) {
    margin-right: 6px;
    font-size: 24px;
  }
</style>
