<template>
  <el-cascader
    v-model="regionValue"
    :options="region_options"
    :props="region_options_props"
    :placeholder="initCascaderValue"
    @change="changeCascader"
    @clearCheckedNodes="clearCheckedNodes"
  ></el-cascader>
</template>

<script>
import { getCity } from "@/api/common";
export default {
  name: "CityArea",
  data() {
    const _this = this
    return {
      initCascaderValue: '请选择省市区',
      // 地址代码
      address: [],
      // 地址数据
      addressData: {},
      regionValue: "",
      // 级联数据
      region_options: [],
      // 级联动态加载配置
      region_options_props: {
        lazy: true,
        async lazyLoad(node, resolve) {
          const { level } = node;
          // 请求参数
          const requestData = {};
          let levelType = {
            0: { type: "province" },
            1: { type: "city", code: "province_code" },
            2: { type: "area", code: "city_code" },
          };
          if (levelType[level].code) {
            requestData[levelType[level].code] = node.value;
          }
          requestData.type = levelType[level].type;
          let result = await getCity(requestData);
          if (result.code === 200) {
            const data = result.data;
            // 类型
            const type = levelType[level].type
            // 对省市区进行展示处理
            data.forEach((item) => {
              item.value = item[type + '_code']
              item.label = item[type + '_name']
              item.leaf = level >= 2
            });
            // 存储省市区数据
            _this.addressData[type] = data
            resolve(data);
          }
          // 获取地址
          if (level !== 0) {
            _this.getAddress(node)
          }
        },
      },
    };
  },
  props: ["region"],
  methods: {
    // 区域改变事件
    changeCascader(value) {
      // 将修改的值传递给父组件
      this.$emit("update:region", value.join());
      // 最后一级区县的数据
      const area_code = value[value.length - 1]
      const area_name = this.addressData.area.filter(item => item.value === area_code)[0].label
      this.address[2] = area_name
      this.$emit('setMapLocation', this.address.join(""))
    },
    // 将选择的地址放入数组中
    getAddress(node) {
      const index = node.level - 1
      this.address[index] = node.label
    },
    // 清空级联数据
    clearCheckedNodes() {
      this.regionValue = ''
    },
    // 省市区的显示值
    cascaderValue(value) {
      this.initCascaderValue = value
    }
  },
};
</script>

<style>
</style>