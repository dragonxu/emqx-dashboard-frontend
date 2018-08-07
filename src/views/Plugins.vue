<template>
  <div class="plugins-view">
    <!-- plugin list -->
    <div class="page-title">
      {{ $t('leftbar.plugins') }}
      <el-select
        v-model="nodeName"
        class="select-radius"
        :placeholder="$t('select.placeholder')"
        :disabled="$store.state.loading"
        @change="loadPlugins">
        <el-option
          v-for="node in nodes"
          :key="node.name"
          :label="node.name"
          :value="node.name">
        </el-option>
      </el-select>
    </div>
    <el-table
      v-loading="$store.state.loading"
      border
      :data="enableTableData"
      @filter-change="resetFilter">
      <el-table-column prop="name" width="240" :label="$t('plugins.name')">
      </el-table-column>
      <el-table-column prop="version" width="100" :label="$t('plugins.version')">
      </el-table-column>
      <el-table-column prop="description" min-width="340" :label="$t('plugins.description')">
      </el-table-column>
      <el-table-column
        prop="active"
        width="120"
        :label="$t('plugins.status')"
        :filters="[{ text: $t('plugins.stopped'), value: false }, { text: $t('plugins.running'), value: true }]">
        <template slot-scope="props">
          <span :class="[props.row.active ? 'running' : '', 'status']">
            {{ props.row.active ? $t('plugins.running'): $t('plugins.stopped')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="180" :label="$t('oper.oper')">
        <template slot-scope="props">
          <el-button
            slot="reference"
            size="mini"
            :disabled="props.row.name.indexOf('dashboard') !== -1"
            :type="props.row.active ? 'warning' : 'success'"
            @click="update(props.row)" :plain="true">
            {{ props.row.active ? $t('plugins.stop') : $t('plugins.start') }}
          </el-button>
          <el-button
            type="success"
            size="mini"
            :disabled="props.row.name.includes('dashboard')"
            :plain="true"
            @click="config(props.row)">
            {{ $t('plugins.config') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import {
  Dialog, Input, Checkbox, CheckboxGroup, Select, Option, Button, Table, TableColumn,
  Breadcrumb, BreadcrumbItem, Form, FormItem, Row, Col, Card,
} from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'plugins-view',
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-card': Card,
  },
  data() {
    return {
      filterSet: new Set(),
      tableData: [],
      enableTableData: [],
      nodeName: '',
      nodes: [],
    }
  },
  methods: {
    ...mapActions(['CURRENT_NODE']),
    loadData() {
      this.$httpGet('/nodes').then((response) => {
        this.nodeName = this.$store.state.nodeName || response.data[0].name
        this.nodes = response.data
        this.loadPlugins()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    loadPlugins() {
      this.CURRENT_NODE(this.nodeName)
      if (!this.nodeName) {
        return
      }
      this.$httpGet(`/nodes/${this.nodeName}/plugins`).then((response) => {
        this.tableData = response.data
        this.handleFilter()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    handleFilter() {
      // No need to initialize Set
      this.enableTableData = this.tableData.filter(item => !this.filterSet.has(item.active))
    },
    resetFilter(e) {
      this.filterSet.clear()
      Object.keys(e).forEach((item) => {
        e[item].forEach((active) => {
          this.filterSet.add(!active)
        })
      })
      if (this.filterSet.size === 2) {
        this.filterSet.clear()
      }
      this.handleFilter()
    },
    update(row) {
      const operation = row.active ? 'unload' : 'load'
      this.$httpPut(`/nodes/${this.nodeName}/plugins/${row.name}/${operation}`).then(() => {
        this.$message.success(`${row.active ? this.$t('plugins.stop') : this.$t('plugins.start')}${this.$t('alert.success')}`)
        this.loadPlugins()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
        this.loadPlugins()
      })
    },
    config(row) {
      this.$router.push(`/plugins/${window.btoa(this.nodeName)}/${row.name}`)
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
/* Advanced Config DiaLog */
.plugins-view {
  .el-table {
    margin-top: 24px;
  }
  .el-card {
    &.plugin-config {
      margin-top: 24px;
    }
  }
  .el-row {
    margin-top: 20px;
  }
  .el-dialog {
    .el-button {
      width: 80px;
    }
  }
  .config-area {
    .el-button {
      width: 80px;
    }
  }
  .advanced-key {
    .el-checkbox-group {
      .el-checkbox {
        &:first-child {
          margin-left: 15px;
        }
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>