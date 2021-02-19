<template>
  <el-form>
    <!-- 一次性获取数据 -->
    <el-form-item>
      <select-tree v-model="value1"
                   :options="options" />
    </el-form-item>
    <!-- 懒加载获取数据 -->
    <el-form-item>
      <select-tree lazy
                   v-model="value2"
                   url="api/tree"
                   :props="defaultProps" />
    </el-form-item>
  </el-form>
</template>

<script>
import SelectTree from '@/components/widget/SelectTree.vue';

export default {
  components: {
    SelectTree,
  },
  data () {
    return {
      // 默认选中值
      value1: 'A',
      value2: 'A',
      // 数据默认字段
      defaultProps: {
        parent: 'parentId',   // 父级唯一标识
        value: 'id',          // 唯一标识
        label: 'label',       // 标签显示
        children: 'children', // 子级
      },
      // 数据列表
      options: [
        {
          parentId: '0',
          id: 'A',
          label: 'label-A',
          children: [
            {
              parentId: 'A',
              id: 'A-1',
              label: 'label-A-1',
            },
          ],
        },
        {
          parentId: '0',
          value: 'B',
          label: 'label-B',
        },
      ],
    };
  },
};
</script>
