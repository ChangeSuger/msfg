/**
 * 页面编辑状态选项 参考 http://logic-flow.org/api/editConfigModelApi.html
 */
export function EditConfig (config = {}) {
  const {
    isSilentMode = false,
    stopZoomGraph = false,
    stopScrollGraph = false,
    stopMoveGraph = false,
    adjustEdge = false,
    adjustEdgeMiddle = false,
    adjustEdgeStartAndEnd = false,
    adjustNodePosition = true,
    hideAnchors = false,
    nodeTextEdit = false,
    edgeTextEdit = false,
    nodeTextDraggable = false,
    edgeTextDraggable = false,
    metaKeyMultipleSelected = false,
  } = config;

  // 是否为静默模式
  this.isSilentMode = isSilentMode;

  // 禁止缩放画布
  this.stopZoomGraph = stopZoomGraph;

  // 禁止鼠标滚动移动画布
  this.stopScrollGraph = stopScrollGraph;

  // 禁止拖动画布
  this.stopMoveGraph = stopMoveGraph;

  // 允许调整边
  this.adjustEdge = adjustEdge;

  // 只对折线生效，只允许调整边的中间线段，不允许调整与起点终点相连的线段
  this.adjustEdgeMiddle = adjustEdgeMiddle;

  // 允许调整边起点/终点
  this.adjustEdgeStartAndEnd = adjustEdgeStartAndEnd;

  // 允许拖动节点
  this.adjustNodePosition = adjustNodePosition;

  // 隐藏节点所有锚点
  this.hideAnchors = hideAnchors;

  // 允许节点文本可以编辑
  this.nodeTextEdit = nodeTextEdit;

  // 允许边文本可以编辑
  this.edgeTextEdit = edgeTextEdit;

  // 允许节点文本可以拖拽
  this.nodeTextDraggable = nodeTextDraggable;

  // 允许边文本可以拖拽
  this.edgeTextDraggable = edgeTextDraggable;

  // 允许按照 meta 键多选元素
  this.metaKeyMultipleSelected = metaKeyMultipleSelected;
}

/**
 * 自定义键盘快捷键 参考 http://logic-flow.org/guide/basic/keyboard.html
 */
export function KeyboardConfig (config = {}) {
  const { enabled = true } = config;
  this.enabled = enabled;
}

/**
 * 网格配置 参考 http://logic-flow.org/guide/basic/grid.html
 */
export function GridConfig (_config = {}) {
  const {
    enabled = true,
    size = 10,
    visible = true,
    type = 'mesh',
    config = {},
  } = _config;

  const {
    color = '#eeeeee',
    thickness = 1,
  } = config;

  this.enabled = enabled;
  this.size = size;
  this.visible = visible;
  this.type = type;
  this.config = {
    color: color,
    thickness: thickness,
  };
}

/**
 * 选区配置
 */
export function SelectionConfig (config = {}) {
  const {
    isWholeEdge = true,
    isWholeNode = true,
  } = config;

  this.isWholeEdge = isWholeEdge;
  this.isWholeNode = isWholeNode;
}

/**
 * 杂项配置
 */
export function ExtraConfig (config = {}) {
  const {
    defaultEdgeType = 'custom-edge',
  } = config;

  this.defaultEdgeType = defaultEdgeType;
}
