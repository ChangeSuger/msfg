import { RectNode, RectNodeModel, h } from '@logicflow/core'
import { getColorRGB_check, getColorRGB_analyse } from '../../utils/struct'
import { getBytesLength } from '../../utils/methods'


class RedNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData (data) {
    super.initNodeData(data)
    this.width = 100
    this.height = 30
    this.radius = 6
    this.defaultFill = this.properties.typeColor
  }
  /**
   * 动态设置数据，区别于初始化的数据设定，该部分会响应数据变化(每次properties发生变化会触发)
   */
  setAttributes () {
    if (this.text.value) {
      let width = 30 + getBytesLength(this.text.value) * 9
      width = Math.ceil(width / 20) * 20
      if (width < 100) {
        width = 100
      }
      this.width = width
      this.properties.width = width
    }
    this.text.x = this.x
    this.text.y = this.y
    if (this.properties.showType === 'check') {
      this.defaultFill = getColorRGB_check(this.properties.collision, this.properties.fuzzible, this.properties.detectable, this.properties.typeColor)
    } else if (this.properties.showType === 'analyse') {
      this.defaultFill = getColorRGB_analyse(this.properties.state, this.properties.fuzzy_state)
    }
  }
  updateText (val) {
    super.updateText(val)
    this.setAttributes()
  }
  /**
   * 重写节点样式
   */
  getNodeStyle () {
    const style = super.getNodeStyle()
    const dataStyle = this.properties.style || {}
    if (this.isSelected) {
      style.strokeWidth = Number(dataStyle.borderWidth) || 2
      style.stroke = dataStyle.borderColor || '#ff7f0e'
    } else {
      style.strokeWidth = Number(dataStyle.borderWidth) || 1
      style.stroke = dataStyle.borderColor || '#999'
    }
    style.fill = dataStyle.backgroundColor || this.defaultFill
    return style
  }
  /**
   * 重写定义锚点
   */
  getDefaultAnchor () {
    const { x, y, id, width, height } = this
    const anchors = [
      {
        x: x + width / 2,
        y: y,
        id: `${id}_right`,
        type: "right"
      },
      {
        x: x - width / 2,
        y: y,
        id: `${id}_left`,
        type: "left"
      }
    ]
    return anchors
  }
  /**
   *
   */
  getOutlineStyle () {
    const style = super.getOutlineStyle()
    style.stroke = 'transparent'
    style.hover.stroke = 'transparent'
    return style
  }
  /**
   * 导出时处理导出的数据
   */
  getData () {
    const data = super.getData()
    data.properties.ui = 'node-red'
    data.anchors = this.anchors
    return data
  }
}


class RedNodeView extends RectNode {
  /**
   * 1.1.7版本后支持在view中重写锚点形状。
   * 重写锚点新增
   */
  getAnchorShape (anchorData) {
    const { x, y, type } = anchorData
    return h("rect", {
      x: x - 5,
      y: y - 5,
      width: 10,
      height: 10,
      className: 'custom-anchor'
    })
  }
  getShape () {
    const {
      text,
      x,
      y,
      width,
      height,
      radius
    } = this.props.model
    const style = this.props.model.getNodeStyle()
    return h(
      'g',
      {
        className: 'lf-red-node'
      },
      [
        h('rect', {
          ...style,
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
          rx: radius,
          ry: radius
        }),
      ]
    )
  }
}


export default {
  type: 'red-node',
  model: RedNodeModel,
  view: RedNodeView
}
