// import lf & plugins
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import { Menu, DndPanel, Snapshot, SelectionSelect } from '@logicflow/extension'

import { nodes } from './node'
import { edges } from './edge'

// default config generator
import { EditConfig, KeyboardConfig, GridConfig, SelectionConfig, ExtraConfig } from './config.js'

import { listeners } from './listeners.js'
import { menu } from './menu.js'

const methods = {
  // 初始化 LogicFlow
  $_initLf (config = {}) {
    // 画布配置
    this.lf = new LogicFlow({
      container: this.$refs.container,
      // 页面编辑状态选项
      ...new EditConfig(config.edit),
      // 自定义键盘快捷键
      keyboard: new KeyboardConfig(config.keyboard),
      // 网格
      grid: new GridConfig(config.grid),
      // 插件
      plugins: [
        Menu,
        Snapshot,
        DndPanel,
        SelectionSelect
      ]
    })
    this.G_DATA = {
      currentSystemId: 1,
      SystemData: [
        {
          system_id: 1,
          name: "root",
          parent_id: null,
          data: {},
        },
      ],
    },
    this.lf.extension.selectionSelect.setSelectionSense(
      new SelectionConfig(config.selection).isWholeEdge,
      new SelectionConfig(config.selection).isWholeNode,
    )
    this.$_registerNode()
    this.lf.setDefaultEdgeType(new ExtraConfig(config.extra).defaultEdgeType)
    this.$_render()
  },
  // 注册节点
  $_registerNode () {
    // node register
    nodes.forEach((node) => {
      this.lf.register(node)
    })
    // edge register
    edges.forEach((edge) => {
      this.lf.register(edge)
    })
  },
  ...menu,
  ...listeners,
}

export { methods }