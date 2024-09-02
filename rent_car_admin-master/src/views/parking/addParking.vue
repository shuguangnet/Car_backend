<template>
  <div class="addParking">

    <!-- 封装的组件 -->
    <Form ref="Form" :config="form_config" :formData="form_data">

      <!-- 级联选择器 -->
      <template #cityArea>
        <CityArea ref="cityArea" :region.sync="form_data.area" @setMapLocation="setMapLocation"></CityArea>

      </template>

      <!-- 地图 -->
      <template #location>
        <div class="mapContainer">
          <Map ref="map" @setMapLocationByCoord="setMapLocationByCoord" :id="form_data.id"></Map>
        </div>
      </template>
    </Form>

  </div>
</template>

<script>
import Map from "../map/map.vue";
import CityArea from "@/components/Commons/cityArea";
// 引入封装的form组件
import Form from '@/components/Form/form'
export default {
  name: "AddParking",
  components: { Map, CityArea, Form },
  data() {
    return {
      // form组件的配置
      form_config: {
        // 指定表单的一些配置：宽度、行内
        form_config: { label_width: '120px', inline: false},
        form_item_config: [
          { 
            label: '停车场名称', 
            prop: 'parkingName', 
            type: 'input', 
            placeholder: '请输入停车场名称', 
            width: '200px', 
            required: true,
            rules: [
              { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
            ] 
          },
          { 
            label: '区域', 
            prop: 'area', 
            type: 'slot', 
            slotName: 'cityArea', 
            required: true,
            required_msg: '请选择区域'
          },
          { 
            label: '详细地址', 
            prop: 'address', 
            type: 'input', 
            placeholder: '请输入详细地址',
            required: true
          },
          { 
            label: '类型', 
            prop: 'type', 
            type: 'radio', 
            options: [ {label: '室内', value: 0}, {label: '室外', value: 1} ], 
            required: true
          },
          { 
            label: '可停放车辆', 
            prop: 'carsNumber', 
            type: 'input', 
            placeholder: '请输入可停放数量', 
            width: '200px', 
            required: true
          },
          { label: '禁启用', prop: 'enable', type: 'switch' },
          { label: '位置', type: 'slot', slotName: 'location' },
          { 
            label: '经纬度', 
            prop: 'coord', 
            type: 'input', 
            placeholder: '请获取经纬度', 
            width: '200px', 
            disabled: true, 
            required: true
          }
        ],
        // 按钮
        form_handler: [
          { label: '确定', key: 'submit', type: 'primary', handler: () => this.formValidate() },
          { label: '重置', key: 'reset', handler: () => this.resetForm() }
        ]
      },
      // form组件表单数据
      form_data: {
        parkingName: "",
        area: "",
        address: "",
        type: "",
        carsNumber: "",
        enable: true,
        coord: "",
        id: this.$route.query.id
      },
    };
  },
  beforeMount() {
    this.form_data.id && this.getParkingDetail(this.form_data.id);
  },
  mounted() {
    // 接收经纬度
    this.$bus.$on("getLnglat", (lnglat) => {
      this.form_data.coord = lnglat;
    });
  },
  methods: {
    // 提交表单
    formValidate() {
      this.$refs["Form"].$refs.form.validate((valid) => {
        if (valid) {
          // 添加/编辑
          this.form_data.id ? this.parkingEdit() : this.parkingAdd();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 设置地图显示位置
    setMapLocation(address) {
      // setMapCenter是map组件的方法
      this.$refs.map.setMapCenter(address);
    },
    // 重置表单
    resetForm() {
      this.$refs["Form"].$refs.form.resetFields();
      // 清空级联选择器
      this.$refs.cityArea.clearCheckedNodes();
      // 清除点标记
      this.$refs.map.clearMarker();
    },
    // 调用新增停车场接口
    async parkingAdd() {
      let result = await this.$API.parking.parkingAdd(this.form_data);
      if (result.code === 200) {
        this.message("success", result.message);
        this.resetForm();
      } else return this.message(result.message);
    },
    // 获取指定停车场详情
    async getParkingDetail(id) {
      let result = await this.$API.parking.getParkingDetail(id);
      if (result.code === 200) {
        for (const key in result.data) {
          if (this.form_data[key] !== undefined) {
            this.form_data[key] = result.data[key]
          }
        }
        // 省市区显示
        result.data.region = result.data.region.replaceAll(',', ' / ')
        this.$refs.cityArea.cascaderValue(result.data.region)
      }
    },
    // 设置地图中心点标记
    setMapLocationByCoord() {
      this.$refs.map.addMarker(this.form_data.coord)
    },
    // 编辑停车场
    async parkingEdit() {
      const data = this.form_data
      let result = await this.$API.parking.editParking(data)
      if (result.code === 200) {
        this.message('success', result.message)
        this.resetForm();
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
  .mapContainer {
    width: 100%;
    height: 500px;
  }
}
</style>