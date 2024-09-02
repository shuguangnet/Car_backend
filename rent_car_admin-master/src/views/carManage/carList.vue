<template>
  <div class="carList">
    <Form ref="Form" :config="form_configs" :formData="form">
      <!-- 省市区 -->
      <template #cityArea>
        <CityArea ref="cityArea" :region.sync="form.area"></CityArea>
      </template>
    </Form>
    <Table ref="table" :table_config="table_config">
      <!-- 品牌LOGO -->
      <template #brand_logo="{ data }">
        <img :src="data.brand_logo" :alt="data.brand_name_ch" style="width: 80px;height: 80px">
      </template>
      <!-- 车辆缩略图片 -->
      <template #car_image="{ data }">
        <img :src="data.car_image" style="width: 80%">
      </template>
      <!-- 禁启用 -->
      <template #enable="{ data }">
        <el-switch active-color="#13ce66" v-model="data.enable" :disabled="switch_id === data.id"  @change="changeEnable(data.id, data.enable)"></el-switch>
      </template>
      <!-- 编辑/删除 -->
      <template #operation="{ data }">
         <!-- @click="editParking(data.id)"  -->
        <el-button type="primary" size="small" @click="editCar(data.id)">编辑</el-button>
        <el-button size="small" :loading="data.id === delete_id" @click="deleteCar(data.id)">删除</el-button>
      </template>
    </Table>
  </div>
</template>

<script>
import Form from '@/components/Form/form'
import Table from '@/components/TableData/table'
import CityArea from '@/components/Commons/cityArea'
export default {
  name: "CarList",
  components: { Form, CityArea, Table },
  data() {
    return {
      // 表单数据
      form: {
        area: "",
        gears: "",
        enable: "",
        searchValue: "",
      },
      // 表单配置
      form_configs: {
        form_config: { inline: true },
        form_item_config: [
          { label: '城市', prop: 'area', type: 'slot', slotName: 'cityArea', placeholder: "请选择省市区" },
          { label: '类型', prop: 'gears', type: 'select', options: [ { label: '自动档', value: 'auto'}, { label: '手动档', value: 'hand'} ] },
          { label: '禁启用', prop: 'enable', type: 'select', options: [ { label: '禁用', value: false}, { label: '启用', value: true} ]},
          { prop: 'searchValue', type: 'input', placeholder: "请输入车辆品牌"}
        ],
        form_handler: [
          { label: '查询', type: 'primary', key: 'query', handler: () => this.queryCar()},
          { label: '重置', type: 'primary', key: 'reset', handler: () => this.reset()},
          { label: '新增', type: 'success', key: 'add', handler: () => this.addCar()},
          { label: '下载', type: 'success', key: 'download', handler: () => this.download()},
        ]
      },
      // 表格配置
      table_config: {
        table_headers: [
          { label: "车牌号", prop: "number"},
          { label: "车辆品牌", prop: "brand_name_ch"},
          { label: "车辆型号", prop: "model"},
          { label: "品牌LOGO", prop: "brand_logo", type: "slot", slotName: "brand_logo"},
          { label: "车辆图片", prop: "car_image", type: "slot", slotName: "car_image"},
          { label: "年检", prop: "checked", type: 'function', width: 80,
            callback: (row) => {
              return row.checked ? '已年检' : '未年检'
          }},
          { label: "能源类型", prop: "energy", type: 'function',
            callback: (row) => {
              return row.energy === 1 ? "电动" : row.energy === 2 ? "汽油" : '混合动力'
            }},
          { label: "禁启用", prop: "enable", type: "slot", slotName: "enable"},
          { label: "车辆档位", prop: "gears", type: 'function',
            callback: (row) => {
              return row.gears === 'auto' ? '自动档' : '手动档'
          }},
          { label: "停车场", prop: "parkingName"},
          { label: "区域", prop: "region"},
          { label: "操作", type: "slot", slotName: "operation", width: 160},
        ],
        axios_config: {
          url: '/car/list',
          method: 'POST'
        },
        requestData: {
          pageNumber: 1,
          pageSize: 10
        },
        checkedColumn: true,
        pagination: true,
      },
      // 防止网络慢，多次点击的
      delete_id: '',
      switch_id: ''
    };
  },
  methods: {
    // 删除车辆
    deleteCar(id) {
      this.delete_id = id
      this.$confirm('是否删除该车辆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let result = await this.$API.car.carDelete(id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$refs.table.getTableData();
          this.delete_id = ''
        } else this.delete_id = ''
      }).catch(() => {this.delete_id = ''});
    },
    // 修改禁启用状态
    async changeEnable(id, enable) {
      let result = await this.$API.car.changeEnable(id, enable)
      if (result.code === 200) {
        this.message("success", result.message);
        this.switch_id = ''
      } else this.switch_id = ''
    },
    // 查询车辆
    queryCar() {
      let { area, gears, enable, searchValue} = this.form;
      // 可能需要提交的数据
      let params = {
        pageNumber: 1,
        pageSize: 10,
        area,
        gears,
        enable,
        brandName: searchValue
      };
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
    reset() {
      this.$refs.Form.$refs.form.resetFields()
      this.$refs.cityArea.clearCheckedNodes();
      this.queryCar()
    },
    // 跳转到添加车辆
    addCar() {
      this.$router.push( {name: 'AddCar'} )
    },
    // 下载
    download() {
      const h = this.$createElement;
        this.$notify({
          title: '下载失败',
          type: 'warning',
          message: ('下载不会做，以后在做'),
          duration: 4500
        });
    },
    // 编辑
    editCar(id) {
      this.$router.push({ name: 'AddCar', query: { id }})
    }
  },
};
</script>

<style lang="scss" scoped>
.carList {
  padding: 20px;
}
</style>