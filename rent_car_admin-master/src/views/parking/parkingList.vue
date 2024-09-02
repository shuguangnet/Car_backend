<template>
  <div class="parkingList">
    <!-- 表单 -->
    <el-form
      :inline="true"
      ref="formInline"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="区域" prop="area">
        <CityArea ref="cityArea" :region.sync="formInline.area"></CityArea>
      </el-form-item>
      <el-form-item label="类型" label-width="50px" prop="type">
        <el-select v-model="formInline.type" placeholder="请选择类型">
          <el-option label="室内" :value="0"></el-option>
          <el-option label="室外" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="禁启用" label-width="60px" prop="enable">
        <el-select v-model="formInline.enable" placeholder="请选择">
          <el-option label="禁用" :value="false"></el-option>
          <el-option label="启用" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" label-width="60px" prop="keyName">
        <el-select v-model="formInline.keyName" placeholder="请选择">
          <el-option label="停车场名称" value="parkingName"></el-option>
          <el-option label="详细区域" value="address"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="keyWord">
        <el-input
          v-model="formInline.keyWord"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <el-form-item class="search">
        <el-button type="primary" @click="search" :loading="loading"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetForm('formInline')"
          >重置</el-button
        >
      </el-form-item>
      <el-form-item>
        <router-link to="/parking/addParking">
          <el-button type="primary">新增停车场</el-button>
        </router-link>
      </el-form-item>
    </el-form>
   

    <Table ref="table" :table_config="table_config">
      <!-- 禁启用 -->
      <template #enable="{ data }">
        <el-switch
          active-color="#13ce66"
          v-model="data.enable"
          :disabled="switch_id === data.id"
          @change="changeEnable(data.id, data.enable)"
        ></el-switch>
      </template>

      <!-- 查看地图 -->
      <template #coord="{ data }">
        <el-button type="success" size="small" @click="showMap(data)"
          >查看地图</el-button
        >
      </template>

      <!-- 操作：编辑删除 -->
      <template #operation="{ data }">
        <el-button type="primary" size="small" @click="editParking(data.id)"
          >编辑</el-button
        >
        <el-button size="small" :loading="data.id === delete_id" @click="deleteParking(data.id)">删除</el-button>
      </template>
    </Table>
    <!-- 地图 -->
    <MapDialog
      :dialogVisibleMap.sync="dialogVisibleMap"
      :parkingData="parkingData"
    ></MapDialog>
  </div>
</template>

<script>
import CityArea from "@/components/Commons/cityArea";
import MapDialog from "@/components/Dialog/mapDialog";
// 封装的table组件
import Table from "@/components/TableData/table";

export default {
  name: "ParkingList",
  components: { CityArea, Map, MapDialog, Table },
  data() {
    return {
      // 表单的一些数据
      formInline: {
        area: "",
        type: "",
        enable: "",
        keyName: "",
        keyWord: "",
      },
      // 加载效果
      loading: false,
      // 地图显示
      dialogVisibleMap: false,
      // 传给地图弹窗的数据
      parkingData: {},
      // 组件的配置
      table_config: {
        table_headers: [
          { label: "停车场名称", prop: "parkingName" },
          {
            label: "类型",
            prop: "type",
            type: "function",
            // width: 80,
            callback: (row) => {
              return row.type ? "室外" : "室内";
            },
          },
          {
            label: "区域",
            prop: "area",
            type: "function",
            callback: (row) => {
              let region = row.area + row.address;
              if (region.slice(0, 2) === region.slice(2, 4)) {
                region = region.slice(2, region.length);
              }
              return region;
            },
          },
          { label: "可停放车辆", prop: "carsNumber" },
          {
            label: "禁启用",
            prop: "enable",
            type: "slot",
            slotName: "enable",
          },
          {
            label: "位置",
            prop: "coord",
            type: "slot",
            slotName: "coord",
          },
          {
            label: "操作",
            prop: "operation",
            type: "slot",
            slotName: "operation",
          },
        ],
        // 请求API
        axios_config: {
          url: "/parking/list",
          method: "POST",
        },
        // 请求参数
        requestData: {
          pageNumber: 1,
          pageSize: 10,
        },
        // 是否需要勾选列，不写默认true
        checkedColumn: true,
        // 是否需要分页，不写默认true
        pagination: true,
      },
      // 优化，网络请求删除多次点击
      delete_id: '',
      switch_id: ''
    };
  },

  methods: {
    // 搜索
    search() {
      this.loading = true;
      let { area, type, enable, keyName, keyWord } = this.formInline;
      // 可能需要提交的数据
      let params = {
        pageNumber: 1,
        pageSize: 10,
        area,
        type,
        enable,
      };
      if (keyName) params[keyName] = keyWord;
      // 要提交的数据
      let reqData = {};
      for (const key in params) {
        if (params[key] !== "") {
          reqData[key] = params[key];
        }
      }
      // 调用获取数据的方法并传递参数
      this.$refs.table.getTableDataWithParams(reqData);
      this.loading = false;
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.cityArea.clearCheckedNodes();
      this.search()
    },
    // 删除停车场
    deleteParking(id) {
      this.delete_id = id
      this.$confirm("是否删除该停车场", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let result = await this.$API.parking.deleteParking(id);
        if (result.code === 200) {
          this.$refs.table.getTableData();
          this.delete_id = ''
          return this.$message({
            type: "success",
            message: "删除成功!",
          });
        } else this.delete_id = ''
      });
    },
    // 查看位置
    showMap(data) {
      this.dialogVisibleMap = true;
      this.parkingData = data;
    },
    // 编辑
    editParking(id) {
      this.$router.push({ name: "AddParking", query: { id } });
    },
    // 修改禁启用状态
    async changeEnable(id, enable) {
      this.switch_id = id
      let result = await this.$API.parking.changeEnable(id, enable);
      if (result.code === 200) {
        this.message("success", result.message);
        this.switch_id = ''
      } else this.switch_id = ''
    },
  },
};
</script>

<style lang="scss" scoped>
.parkingList {
  padding: 20px;
  width: 100%;
  .deleteAll {
    margin-bottom: 20px;
  }
}
</style>