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
        <el-button type="primary" @click="getParkingList" :loading="loading"
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
    <el-button type="danger" class="deleteAll">全部删除</el-button>
    <!-- 表格 -->
    <el-table
      :data="parkingList"
      tooltip-effect="dark"
      style="width: 100%"
      border
      v-loading="table_loading"
      class="parkingTable"
    >
      <el-table-column type="selection" width="40"> </el-table-column>
      <el-table-column
        prop="parkingName"
        label="停车场名称"
        width="120"
      ></el-table-column>
      <el-table-column prop="type" label="类型" width="120"> </el-table-column>
      <el-table-column prop="area" label="区域"></el-table-column>
      <el-table-column prop="carsNumber" label="可停放车辆"></el-table-column>
      <el-table-column prop="enable" label="禁启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            active-color="#13ce66"
            @change="changeEnable(scope.row.id, scope.row.enable)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="位置">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="small"
            @click="showMap(scope.row)"
            >查看地图</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editParking(scope.row.id)">编辑</el-button>
          <el-button size="small" @click="deleteParking(scope.row.id)"
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
      @getParkingList="getParkingList"
    ></Pagination>
    <!-- 地图 -->
    <MapDialog :dialogVisibleMap.sync="dialogVisibleMap" :parkingData="parkingData"></MapDialog>
  </div>
</template>

<script>
import CityArea from "@/components/Commons/cityArea";
import MapDialog from '@/components/Dialog/mapDialog'

export default {
  name: "ParkingList",
  components: { CityArea, Map, MapDialog },
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
      // 当前页
      pageNumber: 1,
      // 每页条数
      pageSize: 10,
      total: 0,
      // 停车场数据
      parkingList: [],
      // 加载效果
      loading: false,
      // 地图显示
      dialogVisibleMap: false,
      // 传给地图弹窗的数据
      parkingData: {},
      // 表格加载
      table_loading: false
    };
  },
  beforeMount() {
    this.getParkingList();
  },
  methods: {
    // 获取停车场列表
    async getParkingList() {
      this.loading = true;
      this.table_loading = true
      let { area, type, enable, keyName, keyWord } = this.formInline;
      // 可能需要提交的数据
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
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
      let result = await this.$API.parking.getParkingList(reqData);
      if (result.code === 200) {
        // this.message('success', result.message)
        // 数据处理
        result.data.forEach((item) => {
          item.type === 1 ? (item.type = "室外") : (item.type = "室内");
          item.area += item.address;
          if (item.area.slice(0, 2) === item.area.slice(2, 4)) {
            item.area = item.area.slice(2, item.area.length);
          }
        });
        this.parkingList = result.data;
        this.total = result.total;
        this.loading = false;
        this.table_loading = false
      } else {
        this.parkingList = [];
        this.message("warning", result.message);
        this.loading = false;
        this.table_loading = false
      }
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.cityArea.clearCheckedNodes();
      this.parkingList = []
      this.pageSize = 10
      this.pageNumber = 1
      this.getParkingList()
    },
    // 删除停车场
    deleteParking(id) {
      this.$confirm("是否删除该停车场", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let result = await this.$API.parking.deleteParking(id);
        if (result.code === 200) {
          this.getParkingList();
          return this.$message({
            type: "success",
            message: "删除成功!",
          });
        }
      });
    },
    // 查看位置
    showMap(data) {
      this.dialogVisibleMap = true
      this.parkingData = data
    },
    // 编辑
    editParking(id) {
      this.$router.push({name: 'AddParking', query: {id}})
    },
    // 修改禁启用状态
    async changeEnable(id, enable) {
      let result = await this.$API.parking.changeEnable(id, enable)
      if (result.code === 200) {
        this.message('success', result.message)
      }
    }
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