<template>
  <div class="plugins-view">
    <!-- plugin list -->
    <div class="page-title">
      {{ $t('leftbar.plugins') }}
      <div style="float: right">
        <el-input
          v-model="searchValue"
          class="input-radius"
          size="large"
          style="float: right;padding-left: 20px"
          :disabled="$store.state.loading"
          :placeholder="$t('plugins.searchByName')"
          @keyup.enter.native="searchPlugins">
          <i slot="suffix" :class="[iconStatus, 'el-input__icon']" @click="searchPlugins"></i>
        </el-input>

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
    </div>

    <el-table
      v-loading="$store.state.loading"
      border
      :data="enableTableData"
      @filter-change="resetFilter">
      <el-table-column prop="name" width="230" :label="$t('plugins.name')">
        <template slot-scope="props">
          {{ props.row.name }}
          <el-tooltip
            effect="light"
            :content="$t('plugins.tutorial')"
            :open-delay="500"
            placement="top">
            <a
              v-if="!props.row.name.includes('dashboard')
                && !props.row.name.includes('management')
                && getLinks(props.row.name) !== ''"
              class="tutorial"
              href="javascript:;" @click="openLink(props.row)">
              <i class="iconfont icon-bangzhu"></i>
            </a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="version" width="140" :label="$t('plugins.version')">
      </el-table-column>
      <el-table-column prop="description" min-width="340" :label="$t('plugins.description')">
      </el-table-column>
      <el-table-column
        prop="active"
        width="150"
        :label="$t('plugins.status')"
        :filters="[{ text: $t('plugins.stopped'), value: false }, { text: $t('plugins.running'), value: true }]">
        <template slot-scope="props">
          <span :class="[props.row.active ? 'running' : '', 'status']">
            {{ props.row.active ? $t('plugins.running'): $t('plugins.stopped')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="160" :label="$t('oper.oper')">
        <template slot-scope="props">
          <el-button
            slot="reference"
            class="oper"
            size="mini"
            :disabled="props.row.name.indexOf('dashboard') !== -1 || props.row.name.includes('management')"
            :type="props.row.active ? 'warning' : 'success'"
            @click="update(props.row)" :plain="true">
            {{ props.row.active ? $t('plugins.stop') : $t('plugins.start') }}
          </el-button>
          <!-- <el-button
            type="success"
            size="mini"
            :disabled="props.row.name.includes('dashboard') || props.row.name.includes('management')"
            :plain="true"
            @click="config(props.row)">
            {{ $t('plugins.config') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import {
  Input, Select, Option, Button, Table, TableColumn,
  Form, FormItem, Row, Col, Card,
} from 'element-ui'
import { mapActions } from 'vuex'
import { getPluginLink, matchSearch } from '~/common/utils'

export default {
  name: 'plugins-view',
  components: {
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
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
      searchValue: '',
      searchView: false,
    }
  },
  computed: {
    iconStatus() {
      return this.searchView ? 'el-icon-close' : 'el-icon-search'
    },
  },
  methods: {
    ...mapActions(['CURRENT_NODE']),
    loadData() {
      this.searchView = false
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
        this.$message.success(
          `${row.active ? this.$t('plugins.stop') : this.$t('plugins.start')}${this.$t('alert.success')}`,
        )
        this.loadPlugins()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
        this.loadPlugins()
      })
    },
    getLinks(name) {
      return getPluginLink(name)
    },
    openLink(row) {
      const url = this.getLinks(row.name)
      const windowUrl = window.open(url)
      windowUrl.opener = null
    },
    searchPlugins() {
      if (this.searchView) {
        this.searchValue = ''
        this.loadData()
        return
      }
      matchSearch(this.tableData, 'name', this.searchValue).then((res) => {
        if (res) {
          this.enableTableData = res
        }
        this.searchView = true
      }).catch(() => {
        this.searchView = false
      })
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
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
  .oper {
    width: 50px;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .tutorial {
    margin-left: 5px;
    color: #a7a7a7;
    &:hover {
      color: #34C388;
    }
  }
}
</style>
