<template>
  <div>
    <el-button-group>
      <el-button type="plain" size="small" @click="$_selectionSelect">选区</el-button>
      <el-button v-if="controlConfig.zoomIn" type="plain" size="small" @click="$_zoomIn">放大</el-button>
      <el-button v-if="controlConfig.zoomOut" type="plain" size="small" @click="$_zoomOut">缩小</el-button>
      <el-button v-if="controlConfig.zoomReset" type="plain" size="small" @click="$_zoomReset">大小适应</el-button>
      <el-button v-if="controlConfig.translateRest" type="plain" size="small" @click="$_translateRest">定位还原</el-button>
      <el-button v-if="controlConfig.reset" type="plain" size="small" @click="$_reset">还原(大小&定位)</el-button>
      <el-button v-if="controlConfig.undo" type="plain" size="small" @click="$_undo"
        :disabled="undoDisable">撤销</el-button>
      <el-button v-if="controlConfig.redo" type="plain" size="small" @click="$_redo"
        :disabled="redoDisable">重做</el-button>
      <el-button v-if="controlConfig.clear" type="plain" size="small" @click="$_clear">清空</el-button>
      <el-button v-if="controlConfig.reDraw" type="plain" size="small" @click="$_reDraw">重绘</el-button>
    </el-button-group>

    <el-dropdown v-if="controlConfig.exportData" @command="$_exportData" style="display:inline-block; margin-left: -5px;">
      <el-button type="plain" size="small">导出流图</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="global">导出全局数据</el-dropdown-item>
        <el-dropdown-item command="part">导出局部数据</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dropdown v-if="controlConfig.importData" @command="$_importData" style="display:inline-block; margin-left: -5px; margin-right: -5px">
      <el-button type="plain" size="small">载入流图</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="global">载入全局数据</el-dropdown-item>
        <el-dropdown-item command="part_incremental">载入局部数据（增量式）</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-button-group>
      <el-button v-if="controlConfig.importFMECA" type="plain" size="small" @click="$_importFMECA">载入FMECA</el-button>
      <el-button v-if="controlConfig.importSimulink" type="plain" size="small" @click="$_importSimulink">载入Simulink</el-button>
      <el-button v-if="controlConfig.check" type="plain" size="small" @click="$_check">流图评价</el-button>
      <el-button v-if="controlConfig.optimizeCkpt" type="plain" size="small" @click="$_optimizeCkpt">测点优化</el-button>
      <el-button v-if="controlConfig.analyse" type="plain" size="small" @click="$_analyse">故障分析</el-button>
    </el-button-group>

    <el-dialog width="60%" :title="'信号流图模型评价'" :visible.sync="visible" :modal="false">
      <el-descriptions title="性能指标" :column="3" border v-if="dialogType === 'check'">
        <el-descriptions-item label="检出率">
          <span>{{ result.detect_isolat_ratio[0] }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="隔离率">
          <span>{{ result.detect_isolat_ratio[1] }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="冗余度">
          <span>{{ result.detect_isolat_ratio[2] }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-table :data="result.D_mat" size="mini" v-if="dialogType === 'check'" border>
        <el-table-column v-for="k in result.col_names" :label="k === 'row_name' ? '' : k" :key="k" :prop="k">
          <template slot-scope="scope">
            <span v-if="scope.row[k] === 1" style="background-color: red; color: white;">{{ scope.row[k] }}</span>
            <span v-else>{{ scope.row[k] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { importStruct, exportStruct, renderStructColor } from '../utils/struct'
import axios from '../utils/axios'

function ControlConfig (config = {}) {
  const {
    zoomIn = true,
    zoomOut = true,
    zoomReset = true,
    translateRest = true,
    reset = true,
    undo = true,
    redo = true,
    clear = true,
    reDraw = true,
    exportData = true,
    importData = true,
    importFMECA = true,
    importSimulink = true,
    check = true,
    optimizeCkpt = true,
    analyse = true,
  } = config;
  this.zoomIn = zoomIn;
  this.zoomOut = zoomOut;
  this.zoomReset = zoomReset;
  this.translateRest = translateRest;
  this.reset = reset;
  this.undo = undo;
  this.redo = redo;
  this.clear = clear;
  this.reDraw = reDraw;
  this.exportData = exportData;
  this.importData = importData;
  this.importFMECA = importFMECA;
  this.importSimulink = importSimulink;
  this.check = check;
  this.optimizeCkpt = optimizeCkpt;
  this.analyse = analyse;
}

export default {
  name: 'Control',
  props: {
    lf: Object || String,
    G_DATA: Object,
    config: {
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      controlConfig: new ControlConfig(this.config),
      undoDisable: true,
      redoDisable: true,
      visible: false,
      dialogType: 'check',
      result: {
        detect_isolat_ratio: [1, 1, 1, 1],
        col_names: []
      },
    }
  },
  computed: {

  },
  mounted() {
    this.$props.lf.on('history:change', ({ data: { undoAble, redoAble } }) => {
      this.$data.undoDisable = !undoAble
      this.$data.redoDisable = !redoAble
    })
  },
  methods: {
    $_selectionSelect() {
      this.$props.lf.extension.selectionSelect.openSelectionSelect();
      this.$props.lf.once('selection:selected', () => {
        this.lf.extension.selectionSelect.closeSelectionSelect()
      })
    },
    $_zoomIn() {
      this.$props.lf.zoom(true)
    },
    $_zoomOut() {
      this.$props.lf.zoom(false)
    },
    $_zoomReset() {
      this.$props.lf.resetZoom()
    },
    $_translateRest() {
      this.$props.lf.resetTranslate()
    },
    $_reset() {
      this.$props.lf.resetZoom()
      this.$props.lf.resetTranslate()
    },
    $_undo() {
      this.$props.lf.undo()
    },
    $_redo() {
      this.$props.lf.redo()
    },
    $_clear() {
      this.$props.lf.clearData()
    },
    $_reDraw() {
      let data = this.$props.lf.getGraphRawData()
      data.nodes.forEach((node) => {
        node.properties.showType = 'edit'
      })
      this.$props.lf.render(data)
    },

    /**
     * 导出数据
     * @param {'global' | 'part'} type 导出类型
     */
    $_exportData(type) {
      if (type === 'global') {
        // 全局导出
        const data = this.$props.G_DATA;
        let fileName = 'data';
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: fileName,
                placeholder: '请输入文件名',
                autofocus: true
              },
              on: {
                input: (val) => {
                  fileName = val
                }
              }
            })
          },
          onOk: () => {
            const jsonText = JSON.stringify(data, null, 4);
            const blob = new Blob([jsonText], { type: 'text/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = fileName + '.json';
            a.href = url;
            a.click();
            window.URL.revokeObjectURL(url);
          }
        });
      } else if (type === 'part') {
        // 局部导出
        function deepClone(obj) {
          let _obj = JSON.stringify(obj),
            objClone = JSON.parse(_obj);
          return objClone
        }

        let fileName = 'data';
        const data = {
          currentSystemId: deepClone(this.$props.G_DATA.currentSystemId),
          SystemData: []
        }

        // 1.获取当前系统的数据
        let currentSystemData_copy = deepClone(this.$props.G_DATA.SystemData.find(item => item.system_id == data.currentSystemId))
        // 当前系统变为root系统
        currentSystemData_copy.parent_id = null
        // 2. 删除一切输入和输出节点 以及相关的边
        let inputORoutput_nodes = currentSystemData_copy.data.nodes.filter(item => item.type == 'input-node' || item.type == 'output-node')
        // 2.1 删除所有的相关边与节点
        for (let node of inputORoutput_nodes) {

          let edges = currentSystemData_copy.data.edges.filter(item => item.sourceNodeId == node.id || item.targetNodeId == node.id)
          for (let edge of edges) {
            currentSystemData_copy.data.edges.splice(currentSystemData_copy.data.edges.indexOf(edge), 1)
          }
          currentSystemData_copy.data.nodes.splice(currentSystemData_copy.data.nodes.indexOf(node), 1)
        }
        data.SystemData.push(currentSystemData_copy)

        // 3. 递归获取当前系统的所有子系统的数据
        /**
         * 递归获取当前系统的所有子系统的数据
         * @param {number} system_id  当前系统的id
         * @param {object} G_SyatemData 全局数据
         * @param {object} data 需要改变的对象
         */
        function getChildrenSystemData(system_id, G_SystemData, data) {

          let childrenSystems = deepClone(G_SystemData.filter(item => item.parent_id == system_id))
          if (childrenSystems.length > 0) {
            for (let child of childrenSystems) {
              data.SystemData.push(child)
              getChildrenSystemData(child.system_id, G_SystemData, data)
            }
          }
        }
        getChildrenSystemData(data.currentSystemId, this.$props.G_DATA.SystemData, data)

        // 1.
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: fileName,
                placeholder: '请输入文件名',
                autofocus: true
              },
              on: {
                input: (val) => {
                  fileName = val
                }
              }
            })
          },
          onOk: () => {
            const jsonText = JSON.stringify(data, null, 4);
            const blob = new Blob([jsonText], { type: 'text/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = fileName + '.json';
            a.href = url;
            a.click();
            window.URL.revokeObjectURL(url);
          }
        });
      }
    },

    /**
     * 导入数据
     * @param {'global' | 'part_incremental'} mode 导入模式
     */
    $_importData(mode) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onerror = (error) => {
            this.$message.error('读取流图文件解析失败');
          }
          reader.onload = () => {
            const json = reader.result;
            try {
              const data = JSON.parse(json);
              this.$emit("updata-import-data", {
                type: mode,
                value: data
              });
            } catch (e) {
              this.$message.error('读取流图文件解析失败');
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    },

    $_importFMECA() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      input.onchange = async () => {
        const file = input.files && input.files[0];
        if (file) {
          const fd = new FormData();
          fd.append('modelFile', file);
          const { data } = await axios({
            url: '/multi-info-edit/upload-fmeca/',
            method: 'post',
            data: fd,
          });
          this.$emit("updata-import-data", {
            type: 'global',
            value: {
              SystemData: data,
              currentSystemId: 0
            }
          });
        }
      };
      input.click();
    },

    $_importSimulink() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.mdl';
      input.onchange = async () => {
        const file = input.files && input.files[0];
        if (file) {
          const fd = new FormData();
          fd.append('modelFile', file);
          const { data } = await axios({
            url: '/multi-info-edit/upload-simulink/',
            method: 'post',
            data: fd
          });
          this.$emit("updata-import-data", {
            type: 'global',
            value: data,
          });
        }
      };
      input.click();
    },

    $_optimizeCkpt() {
      let data = this.$props.lf.getGraphData()

      if (data.nodes.length === 0) {
        this.$alert('流图为空')
      } else {
        let fd = new FormData()
        fd.append('graphStruct', JSON.stringify(exportStruct(data)))

        axios({
          url: '/multi-info-edit/optimize-graph/',
          method: 'post',
          data: fd
        }).then((res) => {
          (res)
          this.$props.lf.render(importStruct(res.data))
          //this.visible = true
        })
      }
    },

    $_check() {
      let data = this.$props.G_DATA.SystemData

      if (this.$props.lf.getGraphData().nodes.length === 0) {
        this.$alert('流图为空')
      } else {
        let fd = new FormData()
        fd.append('graphStruct', JSON.stringify(data))
        axios({
          url: '/multi-info-edit/check-graph/',
          method: 'post',
          data: fd
        }).then((res) => {
          this.dialogType = 'check'
          this.result.detect_isolat_ratio = res.detect_isolat_ratio
          res.col_names.forEach((colName, index) => {
            if (colName != 'row_name') {
              res.col_names[index] = index+":"+colName
            }
          })
          this.result.col_names = ['row_name', ...res.col_names]
          let D_mat = []
          res.row_names.forEach((rowName, index) => {
            let map = { row_name: rowName }
            res.D_mat[index].forEach((val, i) => {
              map[res.col_names[i]] = val
            })
            D_mat.push(map)
          })
          this.result.D_mat = D_mat

          this.$emit("updata-import-data", {
            type: 'global',
            value: {
              SystemData: renderStructColor(res.data,'check'),
              currentSystemId: this.$props.G_DATA.currentSystemId
            }
          })

          this.visible = true;
          //this.$forceUpdate();
        })
      }
    },

    $_analyse() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      input.onchange = async () => {
        const file = input.files && input.files[0];
        if (file) {
          const data = this.$props.G_DATA.SystemData;
          const fd = new FormData();
          fd.append('graphStruct', JSON.stringify(data));
          fd.append('dataFile', file);
          const { data: res } = await axios({
            url: '/multi-info-analyse/analyse-data/',
            method: 'post',
            data: fd,
          });
          this.$emit("updata-import-data", {
            type: 'global',
            value: {
              SystemData: renderStructColor(res,'analyse'),
              currentSystemId: this.$props.G_DATA.currentSystemId
            }
          });
        }
      };
      input.click();
    },
  }
}
</script>

<style scoped></style>
