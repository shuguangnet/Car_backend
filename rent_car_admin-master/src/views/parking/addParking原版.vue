<template>
  <div class="addParking">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="停车场名称" prop="parkingName">
        <el-input
          v-model="form.parkingName"
          placeholder="请输入停车场名称"
          class="inputParking"
        ></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <CityArea
          ref="cityArea"
          :region.sync="form.area"
          @setMapLocation="setMapLocation"
        ></CityArea>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          v-model="form.address"
          placeholder="请输入详细地址"
          @blur="setMapLocation(form.address)"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model.number="form.type">
          <el-radio :label="0">室内</el-radio>
          <el-radio :label="1">室外</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆" prop="carsNumber">
        <el-input
          v-model.number="form.carsNumber"
          placeholder="请输入可停放数量"
          class="inputParking"
        ></el-input>
      </el-form-item>
      <el-form-item label="禁启用">
        <el-switch v-model="form.enable" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item label="位置">
        <div id="mapContainer">
           <!-- @setMapLocationByCoord="setMapLocationByCoord" -->
          <Map ref="map" @setMapLocationByCoord="setMapLocationByCoord" :id="form.id"></Map>
        </div>
      </el-form-item>
      <el-form-item label="经纬度" prop="coord">
        <el-input
          v-model="form.coord"
          placeholder="请获取经纬度"
          disabled
          class="inputParking"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading"
          >确定</el-button
        >
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Map from "../map/map.vue";
import CityArea from "@/components/Commons/cityArea";
export default {
  name: "AddParking",
  components: { Map, CityArea },
  data() {
    return {
      // 表单数据
      form: {
        parkingName: "",
        area: "",
        address: "",
        type: "",
        carsNumber: "",
        enable: true,
        coord: "",
        id: this.$route.query.id
      },
      // 验证规则
      rules: {
        parkingName: [
          { required: true, message: "请输入停车场名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        carsNumber: [
          { required: true, type: "number", message: "请输入可停放数量" },
        ],
        area: [{ required: true, message: "请选择区域", trigger: "change" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        coord: [{ required: true, message: "请获取经纬度", trigger: "blur" }],
      },
      // 按钮的loading效果
      loading: false,
    };
  },
  beforeMount() {
    this.form.id && this.getParkingDetail(this.form.id);
  },
  mounted() {
    // 接收经纬度
    this.$bus.$on("getLnglat", (lnglat) => {
      this.form.coord = lnglat;
    });
  },
  methods: {
    // 设置地图显示位置
    setMapLocation(address) {
      // setMapCenter是map组件的方法
      this.$refs.map.setMapCenter(address);
    },
    // 提交表单
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 添加/编辑
          this.form.id ? this.parkingEdit() : this.parkingAdd();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs["form"].resetFields();
      // 清空级联选择器
      this.$refs.cityArea.clearCheckedNodes();
      // 清除点标记
      this.$refs.map.clearMarker();
    },
    // 调用新增停车场接口
    async parkingAdd() {
      this.loading = true;
      let result = await this.$API.parking.parkingAdd(this.form);
      if (result.code === 200) {
        this.message("success", result.message);
        this.resetForm();
        this.loading = false;
      } else return this.message(result.message);
    },
    // 获取指定停车场详情
    async getParkingDetail(id) {
      let result = await this.$API.parking.getParkingDetail(id);
      if (result.code === 200) {
        for (const key in result.data) {
          if (this.form[key] !== undefined) {
            this.form[key] = result.data[key]
          }
        }
        // 省市区显示
        result.data.region = result.data.region.replaceAll(',', ' / ')
        this.$refs.cityArea.cascaderValue(result.data.region)
      }
    },
    // 设置地图中心点标记
    setMapLocationByCoord() {
      this.$refs.map.addMarker(this.form.coord)
    },
    // 编辑停车场
    async parkingEdit() {
      this.loading = true;
      const data = this.form
      let result = await this.$API.parking.editParking(data)
      if (result.code === 200) {
        this.message('success', result.message)
        this.resetForm();
        this.loading = false;
        this.$router.push({name: 'ParkingList'})
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.addParking {
  padding: 20px;
  .inputParking {
    width: 200px;
  }
  #mapContainer {
    width: 100%;
    height: 500px;
  }
}
</style>