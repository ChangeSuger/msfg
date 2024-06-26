/**
 * 自定义菜单栏 参考 http://logic-flow.org/guide/extension/component-menu.html
 */
export const menu = {
  $_render() {
    // 自定义常规右键菜单
    this.lf.extension.menu.setMenuConfig({
      // 节点右键菜单
      nodeMenu: [
        {
          text: '删除',
          callback: (node) => {
            this.lf.deleteNode(node.id)
            // 删除子系统需要特殊处理
            if (node.type === "subsystem-node") {
              // 1.在G_DATA中删除该子系统,递归的删除该子系统下的所有节点
              function deleteSubsystem(delete_system_id, G_DATA) {

                G_DATA.SystemData = G_DATA.SystemData.filter((item) => {
                  return item.system_id !== delete_system_id
                })

                let list_systems = G_DATA.SystemData.filter((item) => {
                  return item.parent_id == delete_system_id
                })

                list_systems.forEach((item) => {
                  deleteSubsystem(item.system_id, G_DATA)
                })
              }

              deleteSubsystem(node.properties.SubsystemId, this.G_DATA)

              // 2. 更新module tree
              this.module_tree = this.getModuleTree(this.G_DATA.SystemData)
            } else if (node.type === "input-node") {
              // 1. 将剩余input节点的index重新排序和命名
              let graph_data = this.lf.getGraphData()
              let input_nodes = graph_data.nodes.filter((item) => {
                return item.type === "input-node"
              })

              input_nodes.forEach((item, index) => {
                item.properties.index = index + 1
                item.text = "输入" + (index + 1)
              })
              // 2. 将父系统中的子系统组件的input属性更新


              // 根据子系统的id找到父系统
              let parent_id = this.G_DATA.SystemData.find(item => item.system_id == this.G_DATA.currentSystemId).parent_id
              if (parent_id != null) {
                let parent_system = this.G_DATA.SystemData.find(item => item.system_id == parent_id)

                // 更新parent_system的中对应子系统的input或output
                let subsystem_node = parent_system.data.nodes.find(item => item.properties.SubsystemId == this.G_DATA.currentSystemId)
                subsystem_node.properties.fields.input = input_nodes.length
                // 更新parent_system的中对应子系统的input或output连线的锚点数据
                // 1. 删除相关连线
                let input_anchors = subsystem_node.anchors.filter(item => item.type == "left")
                let delete_edge_index = parent_system.data.edges.findIndex(item => item.targetAnchorId == input_anchors[node.properties.index - 1].id)
                if (delete_edge_index != -1) {
                  parent_system.data.edges.splice(delete_edge_index, 1)
                }

                // 2. 重排其他连线的顺序
                for (let i = node.properties.index; i < input_anchors.length; i++) {
                  let edge_index = parent_system.data.edges.findIndex(item => item.targetAnchorId == input_anchors[i].id)
                  if (edge_index != -1) {
                    parent_system.data.edges[edge_index].targetAnchorId = input_anchors[i - 1].id
                  }
                }
              }


              // 3. 重新渲染页面
              this.lf.render(graph_data)
            } else if (node.type === "output-node") {
              // 1. 将剩余input节点的index重新排序和命名
              let graph_data = this.lf.getGraphData()
              let output_nodes = graph_data.nodes.filter((item) => {
                return item.type === "output-node"
              })

              output_nodes.forEach((item, index) => {
                item.properties.index = index + 1
                item.text = "输出" + (index + 1)
              })
              // 2. 将父系统中的子系统组件的input属性更新

              // 根据子系统的id找到父系统
              let parent_id = this.G_DATA.SystemData.find(item => item.system_id == this.G_DATA.currentSystemId).parent_id
              if (parent_id != null) {
                let parent_system = this.G_DATA.SystemData.find(item => item.system_id == parent_id)

                // 更新parent_system的中对应子系统的input或output
                let subsystem_node = parent_system.data.nodes.find(item => item.properties.SubsystemId == this.G_DATA.currentSystemId)
                subsystem_node.properties.fields.output = output_nodes.length
                // 更新parent_system的中对应子系统的input或output连线的锚点数据
                // 1. 删除相关连线
                let output_anchors = subsystem_node.anchors.filter(item => item.type == "right")
                let delete_edge_index = parent_system.data.edges.findIndex(item => item.sourceAnchorId == output_anchors[node.properties.index - 1].id)
                if (delete_edge_index != -1) {
                  parent_system.data.edges.splice(delete_edge_index, 1)
                }
                // 2. 重排其他连线的顺序
                for (let i = node.properties.index; i < output_anchors.length; i++) {
                  let edge_index = parent_system.data.edges.findIndex(item => item.sourceAnchorId == output_anchors[i].id)
                  if (edge_index != -1) {
                    parent_system.data.edges[edge_index].sourceAnchorId = output_anchors[i - 1].id
                  }
                }

              }
              // 3. 重新渲染页面
              this.lf.render(graph_data)

            }
            // 删除 输入或输出节点需要特殊处理
          }
        },
        {
          text: '编辑节点属性',
          callback: (node) => {
            this.lf.graphModel.eventCenter.emit('node:edit', node)
          }
        }
      ],
      // 边右键菜单
      edgeMenu: [
        {
          text: '删除',
          callback: (edge) => {
            this.lf.deleteEdge(edge.id)
          }
        }
      ]
    })
    // 自定义选区右键菜单
    this.lf.extension.menu.setMenuByType({
      type: 'lf:defaultSelectionMenu',
      menu: [
        {
          text: '删除',
          callback: (select) => {
            select.nodes.map((item) => {
              this.lf.deleteNode(item.id)
              // 删除子系统需要特殊处理
              if (item.type === "subsystem-node") {
                // 1.在G_DATA中删除该子系统,递归的删除该子系统下的所有节点
                function deleteSubsystem(delete_system_id, G_DATA) {

                  G_DATA.SystemData = G_DATA.SystemData.filter((item) => {
                    return item.system_id !== delete_system_id
                  })

                  let list_systems = G_DATA.SystemData.filter((item) => {
                    return item.parent_id == delete_system_id
                  })

                  list_systems.forEach((item) => {
                    deleteSubsystem(item.system_id, G_DATA)
                  })
                }

                deleteSubsystem(item.properties.SubsystemId, this.G_DATA)

                // 2. 更新module tree
                this.module_tree = this.getModuleTree(this.G_DATA.SystemData)
              } else if (item.type === "input-node") {
                // 1. 将剩余input节点的index重新排序和命名
                let graph_data = this.lf.getGraphData()
                let input_nodes = graph_data.nodes.filter((item) => {
                  return item.type === "input-node"
                })

                input_nodes.forEach((item, index) => {
                  item.properties.index = index + 1
                  item.text = "输入" + (index + 1)
                })
                // 2. 将父系统中的子系统组件的input属性更新

                // 根据子系统的id找到父系统
                let parent_id = this.G_DATA.SystemData.find(item => item.system_id == this.G_DATA.currentSystemId).parent_id
                let parent_system = this.G_DATA.SystemData.find(item => item.system_id == parent_id)

                // 更新parent_system的中对应子系统的input或output

                parent_system.data.nodes.find(item => item.properties.SubsystemId == this.G_DATA.currentSystemId).properties.fields.input = input_nodes.length

                // 3. 重新渲染页面
                this.lf.render(graph_data)
              } else if (item.type === "output-node") {
                // 1. 将剩余input节点的index重新排序和命名
                let graph_data = this.lf.getGraphData()
                let output_nodes = graph_data.nodes.filter((item) => {
                  return item.type === "output-node"
                })

                output_nodes.forEach((item, index) => {
                  item.properties.index = index + 1
                  item.text = "输出" + (index + 1)
                })
                // 2. 将父系统中的子系统组件的input属性更新

                // 根据子系统的id找到父系统
                let parent_id = this.G_DATA.SystemData.find(item => item.system_id == this.G_DATA.currentSystemId).parent_id
                let parent_system = this.G_DATA.SystemData.find(item => item.system_id == parent_id)

                // 更新parent_system的中对应子系统的input或output

                parent_system.data.nodes.find(item => item.properties.SubsystemId == this.G_DATA.currentSystemId).properties.fields.output = output_nodes.length

                // 3. 重新渲染页面
                this.lf.render(graph_data)
              }
              // 删除 输入或输出节点需要特殊处理
            })
            select.edges.map((item) => { this.lf.deleteEdge(item.id) })
          }
        },
      ]
    })
    this.lf.render({})
    this.$_LfEvent()
  }
}