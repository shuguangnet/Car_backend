<template>
  <div class="carAttr">
    <!-- 表单 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-select v-model="formInline.kwType" placeholder="请选择">
          <el-option label="字段" value="attr_key"></el-option>
          <el-option label="文本" value="attr_value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.keyword"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCarAttr">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 属性 -->
    <div class="attrs">
      <el-button v-for="(item,index) in attrList" :key="index" size="medium">{{item}}</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column label="字段">
        <template slot-scope="scope">
          <span>{{scope.row.attr_key}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文本">
        <template slot-scope="scope">
          <span>{{scope.row.attr_value}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CarAttr",
  data() {
    return {
      formInline: {
        kwType: "",
        keyword: "",
      },
      attrList: [],
      tableData: [],
      loading: false
    };
  },
  mounted() {
    this.getCarAttr()
  },
  methods: {
    // 获取车辆属性列表
    async getCarAttr() {
      let { kwType, keyword} = this.formInline
      let reqData = {}
      if (keyword !== '') {
        reqData[kwType] = keyword
      }
      this.loading = true
      let result = await this.$API.car.getCarAttr(reqData)
      if (result.code === 200) {
        const attrList = []
        result.data.forEach(item => {
          if (!attrList.includes(item.attr_key)) {
            attrList.push(item.attr_key)
          }
        })
        this.attrList = attrList
        this.tableData = result.data
        this.loading = false
      } else {
        this.tableData = []
        this.$message({type: 'warning', message: result.message})
        this.loading = false
      }
    },
    reset() {
      this.formInline.kwType = ''
      this.formInline.keyword = ''
      this.getCarAttr()
    }
  },
};
</script>

<style lang="scss" scoped>
.carAttr {
  padding: 20px;
  .attrs {
    margin-bottom: 10px;
    .el-button--medium {
      margin-bottom: 8px;
    }
  }
}
</style>