<template>
  <div class="node-panel">
    <div
      class="red-ui-palette-node ui-draggable ui-draggable-handle"
      @mousedown="$_dragNode(item)"
      v-for="(item, index) in nodeList"
      :key="index"
      :style="{ backgroundColor: item.properties.typeColor }"
    >
      <div class="red-ui-palette-label">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';

export default {
  name: 'NodePanel',
  props: {
    lf: Object,
    nodeList: Array,
    G_DATA: Object
  },
  methods: {
    $_dragNode(item) {
      if (item.type == 'subsystem-node') {
        const system_id = this.$props.G_DATA.SystemData.at(-1).system_id + 1;

        const properties = {
          tableName: "",
          SubsystemId: system_id,
          fields: {
            input: 0,
            output: 0
          }
        }

        this.$props.lf.dnd.startDrag({
          text: "子系统" + system_id,
          type: item.type,
          properties: properties
        })

      } else if (item.type == 'input-node') {
        // 禁止在根系统中创建输入或者输出节点
        let current_system = this.$props.G_DATA.SystemData.find(item => item.system_id == this.$props.G_DATA.currentSystemId)
        if (current_system.parent_id == null) {
          Message({
            message: '禁止在根系统中创建输入或者输出节点',
            type: 'warning'
          });
          return
        }

        // 1.获取当前画布中 存在多少个input-node
        let input_node_num = this.$props.lf.getGraphData().nodes.filter(item => item.type == 'input-node').length
        // 2.修改所属子系统的input
        this.$emit("updata-g-data-subsystem", {
          system_id: this.$props.G_DATA.currentSystemId,
          type: 'input',
          value: input_node_num + 1
        })
        // 3.开始拖拽
        item.properties.index = input_node_num + 1
        this.$props.lf.dnd.startDrag({
          type: item.type,
          text: item.text + (input_node_num + 1),
          properties: item.properties
        })
      } else if (item.type == 'output-node') {
        // 禁止在根系统中创建输入或者输出节点
        let current_system = this.$props.G_DATA.SystemData.find(item => item.system_id == this.$props.G_DATA.currentSystemId)
        if (current_system.parent_id == null) {
          Message({
            message: '禁止在根系统中创建输入或者输出节点',
            type: 'warning'
          });
          return
        }

        // 1.获取当前画布中 存在多少个input-node
        let output_node_num = this.$props.lf.getGraphData().nodes.filter(item => item.type == 'output-node').length
        // 2.修改所属子系统的output
        this.$emit("updata-g-data-subsystem", {
          system_id: this.$props.G_DATA.currentSystemId,
          type: 'output',
          value: output_node_num + 1
        })
        // 3.开始拖拽
        item.properties.index = output_node_num + 1
        this.$props.lf.dnd.startDrag({
          type: item.type,
          text: item.text + (output_node_num + 1),
          properties: item.properties
        })
      }

      else {
        this.$props.lf.dnd.startDrag({
          type: item.type,
          text: item.text,
          properties: item.properties
        })
      }
    }
  },
}
</script>

<style scoped>
.node-panel {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 150px;
  padding: 20px 10px 10px 10px;
  background-color: white;
  box-shadow: 0 0 10px 1px rgb(228, 224, 219);
  border-radius: 6px;
  z-index: 101;
}

.red-ui-palette-node {
  cursor: move;
  background: #fff;
  margin: 10px auto;
  height: 25px;
  border-radius: 5px;
  border: 1px solid #999;
  background-position: 5% 50%;
  background-repeat: no-repeat;
  width: 120px;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}

.red-ui-palette-label {
  color: #333;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
