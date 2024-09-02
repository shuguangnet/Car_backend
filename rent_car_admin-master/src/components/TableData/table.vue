<template>
  <div>
    <el-table
      :data="tableList"
      tooltip-effect="dark"
      style="width: 100%"
      border
      v-loading="table_loading"
      element-loading-text="正在加载中..."
      class="table"
    >
      <!-- 勾选列 -->
      <el-table-column
        v-if="config.checkedColumn"
        type="selection"
        width="40"
      ></el-table-column>

      <template v-for="config_header in config.table_headers">
        <!-- 需要回调处理值的列 -->
        <el-table-column
          v-if="config_header.type === 'function'"
          :key="config_header.prop"
          :prop="config_header.prop"
          :label="config_header.label"
          :width="config_header.width"
          :align="config_header.align || 'left'"
        >
          <template slot-scope="scope">
            <span>{{
              config_header.callback && config_header.callback(scope.row)
            }}</span>
          </template>
        </el-table-column>

        <!-- 需要放入其他html标签，例如：button、img，使用插槽处理-->
        <el-table-column
          v-else-if="config_header.type === 'slot'"
          :key="config_header.prop"
          :prop="config_header.prop"
          :label="config_header.label"
          :width="config_header.width"
          :align="config_header.align"
        >
          <template slot-scope="scope">
            <slot :name="config_header.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>

        <!-- 纯文本 -->
        <el-table-column
          v-else
          :key="config_header.prop"
          :prop="config_header.prop"
          :label="config_header.label"
          :width="config_header.width"
          :align="config_header.align"
        ></el-table-column>
      </template>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-if="config.pagination"
      :page-sizes="[10, 17, 26, 35]"
      :page-size="pageSize"
      :current-page="pageNumber"
      layout="->, total, sizes, prev, pager, next, jumper"
      background
      class="pagination"
      @size-change="sizeChange"
      @current-change="currentChange"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: ["table_config"],
  data() {
    return {
      // 表格配置
      config: {
        // 表头配置
        table_headers: [],
        // API请求配置
        axios_config: {},
        // 请求参数
        requestData: {},
        // 勾选列
        checkedColumn: true,
        // 分页
        pagination: true,
      },
      // 表格数据
      tableList: [],
      pageSize: 10,
      pageNumber: 1,
      total: 0,
      // 加载效果
      table_loading: false,
    };
  },
  mounted() {
    this.initConfig();
  },
  methods: {
    // 初始化配置
    initConfig() {
      for (const key in this.table_config) {
        if (Object.keys(this.config).includes(key)) {
          this.config[key] = this.table_config[key];
        }
      }
      // 初始化完成后调用接口请求数据
      this.getTableData();
    },
    // 发送请求获取数据
    async getTableData() {
      let { url, method } = this.config.axios_config;
      let reqData = {
        url,
        method,
        data: this.config.requestData,
      };
      this.table_loading = true;
      let result = await this.$API.common.tableData(reqData);
      if (result.code === 200) {
        this.tableList = result.data;
        // 考虑DOM元素渲染
        this.$nextTick(() => {
          // todo something...
        });
        this.total = result.total;
        this.table_loading = false;
      } else {
        this.tableList = []
        this.$message({
            type: 'warning',
            message: result.message
        })
        this.table_loading = false;
      }
    },
    // 有其余参数处理获取数据
    getTableDataWithParams(params = "") {
      if (params) {
        // 有参数更新请求参数
        this.config.requestData = params;
      }
      this.getTableData();
    },
    // 页面大小改变
    sizeChange(value) {
      this.config.requestData.pageSize = value;
      this.getTableData();
    },
    // 当前页改变
    currentChange(value) {
      this.config.requestData.pageNumber = value;
      this.getTableData();
    },
  },
  watch: {
    table_config: {
      immediate: true,
      handler(newValue) {
        // console.log(newValue);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  margin-bottom: 20px;
}
</style>