// import lf & plugins
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import { Menu, Group, DndPanel, Snapshot, SelectionSelect } from '@logicflow/extension'

import { nodes } from './node'
import { edges } from './edge'
import SubSystem from './group/SubSystem.js'

// import commonConfig
import { editConfig, keyboardConfig, gridConfig, extraConfig } from './config.js'

import { listeners } from './listeners.js'
import { menu } from './menu.js'

const methods = {
  // 初始化 LogicFlow
  $_initLf () {
    // 画布配置
    const lf = new LogicFlow({
      container: this.$refs.container,
      // 页面编辑状态选项
      ...editConfig,
      // 自定义键盘快捷键
      keyboard: keyboardConfig,
      // 网格
      grid: gridConfig.enabled ? gridConfig : false,
      // 插件
      plugins: [
        Menu,
        Group,
        Snapshot,
        DndPanel,
        SelectionSelect
      ]
    })
    this.G_DATA = {
      currentSystemId: 1,
      SystemData: [
        {
          system_id:1,
          name:"root",
          parent_id:null,
          data:{},
        },
      ],
    },
    this.lf = lf
    this.lf.extension.selectionSelect.setSelectionSense(extraConfig.SelectionSense.isWholeEdge, extraConfig.SelectionSense.isWholeNode)
    this.$_registerNode()
  },
  // 注册节点
  $_registerNode () {
    // node register
    nodes.forEach((node) => {
      this.lf.register(node)
    })
    // group register
    this.lf.register(SubSystem)
    // edge register
    edges.forEach((edge) => {
      this.lf.register(edge)
    })

    this.lf.setDefaultEdgeType(extraConfig.defaultEdgeType)
    this.$_render()
  },
  ...menu,
  ...listeners,
}

export { methods }