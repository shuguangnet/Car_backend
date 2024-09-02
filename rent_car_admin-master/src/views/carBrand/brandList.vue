<template>
  <div class="carBrand">
    <!-- 表单 -->
    <el-form
      :inline="true"
      :model="carForm"
      ref="brandForm"
      class="demo-form-inline"
    >
      <el-form-item label="车辆品牌" prop="carBrand">
        <el-input
          v-model="carForm.carBrand"
          placeholder="请输入车辆品牌"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBrandList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetBrandList">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加车辆品牌</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="brandList"
      tooltip-effect="dark"
      style="width: 100%"
      border
      v-loading="brand_loading"
      element-loading-text="正在加载中..."
      class="carBrandTable"
    >
      <!-- <el-table-column type="selection" width="40"> </el-table-column> -->
      <el-table-column prop="brand_logo" label="LOGO" width="276">
        <template slot-scope="scope">
          <img class="brand_logo" :src="scope.row.brand_logo" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="brand_name_ch" label="车辆品牌"> </el-table-column>
      <el-table-column prop="enable" label="禁启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            :disabled="switch_id === scope.row.id"
            @change="changeStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="276px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getBrandDetail(scope.row.id)">编辑</el-button>
          <el-button size="small" :loading="scope.row.id === delete_id" @click="deleteBrand(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <Pagination
      :pageSize.sync="pageSize"
      :pageNumber.sync="pageNumber"
      :total="total"
      @getDataList="getBrandList"
    ></Pagination>
    <!-- 对话框 -->
    <Dialog
      :flagVisible.sync="dialogFormVisible"
      @getBrandList="getBrandList"
    ></Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog/addCarBrand.vue";
export default {
  name: "BrandList",
  components: { Dialog },
  data() {
    return {
      // 表单的搜索值
      carForm: {
        carBrand: "",
      },
      // 品牌列表
      brandList: [],
      // 对话框的显示隐藏
      dialogFormVisible: false,
      // 表格数据加载
      brand_loading: false,
      // 当前页
      pageNumber: 1,
      // 每页条数
      pageSize: 10,
      total: 0,
      // 控制开关的禁止状态，优化，防止多次点击请求数据
      switch_id: '',
      delete_id: ''
    };
  },
  mounted() {
    this.getBrandList();
  },
  methods: {
    // 获取品牌列表
    async getBrandList() {
      this.brand_loading = true;
      // 判断是否有参数
      let data = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      // this.carForm.carBrand !== "" ? data.brand = this.carForm.carBrand : data = ''
      if (this.carForm.carBrand !== "") {
        data.brand = this.carForm.carBrand
      }
      let result = await this.$API.brand.getBrandList(data);
      if (result.code === 200) {
        this.brandList = result.data;
        this.total = result.total
        this.brand_loading = false;
        // 品牌列表为空
      } else if (result.code === 201) {
        this.message("warning", result.message);
        this.brandList = [];
        this.brand_loading = false;
        this.total = 0
      } else this.brand_loading = false;
    },
    // 重置表单
    resetBrandList() {
      this.$refs.brandForm.resetFields();
      this.getBrandList();
    },
    // 删除车辆品牌
    deleteBrand(id) {
      this.delete_id = id
      this.$confirm("是否删除该车辆品牌", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
          let result = await this.$API.brand.deleteBrand(id);
          if (result.code === 200) {
            this.message("success", result.message);
            this.delete_id = ''
            this.getBrandList();
          } else this.delete_id = ''
        }).catch(() => { this.delete_id = '' });
    },
    // 修改品牌启用状态
    async changeStatus({ id, status }) {
        this.switch_id = id
        let result = await this.$API.brand.changeStatus(id, status)
        if (result.code === 200) {
          this.message('success', result.message)
          this.switch_id = ''
        } else this.switch_id = ''
    },
    // 获取车辆品牌详情
    async getBrandDetail(id) {
      let result = await this.$API.brand.getBrandDetail(id)
      if (result.code === 200) {
        this.$bus.$emit('brandDetail', result.data)
        this.dialogFormVisible = true
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.carBrand {
  padding: 20px;
}
.brand_logo {
  width: 80px;
  height: 80px;
  // border: 1px solid red;
}
</style>