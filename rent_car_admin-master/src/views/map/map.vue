<template>
  <div id="map_container"></div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
window._AMapSecurityConfig = {
  securityJsCode: "2d2a5f5eaef9995554d8b572561136b1",
};
// 导入方法
import { getLnglat, tranLnglat, setMarker, removeMarker } from "./common";
export default {
  name: "Map",
  data() {
    return {
      map: null,
      lnglat: "",
      // 地图的状态
      mapStatus: false
    };
  },
  beforeMount() {
    this.initMap();
  },
  mounted() {
    // this.initMap();
  },
  props: ['id'],
  methods: {
    initMap() {
      AMapLoader.load({
        key: "02b3b7548cbd3fb6cbae4b49374abdfb",
        version: "2.0",
        plugins: ["AMap.Geocoder", "AMap.Marker"], // 需要用到的高德插件
      }).then((AMap) => {
          this.map = new AMap.Map("map_container", {
            viewMode: "3D",
            zoom: 18,
            center: [116.404765, 39.918052], //初始化地图中心点位置
          });
          // 地图加载完成
          this.map.on('complete', () => {
            this.mapLoad()
            this.mapCoord()
            this.mapStatus = true
          })
          // 点击地图获取经纬度
          this.map.on("click", (e) => {
            const lnglat = getLnglat(e);
            this.lnglat = lnglat;
            // 将经纬度传给父组件
            this.$bus.$emit("getLnglat", lnglat);
            // 添加覆盖物
            this.addMarker(lnglat);
          });
        }).catch((e) => {
          console.log(e);
        });
    },
    // 设置地图显示中心
    setMapCenter(address) {
      this.mapStatus && tranLnglat(this.map, address);
    },
    // 添加覆盖物
    addMarker(lnglat) {
      setMarker(this.map, lnglat);
    },
    // 清除点标记
    clearMarker() {
      removeMarker(this.map);
    },
    // 地图加载完成后调用方法
    mapLoad() {
      this.$emit('mapComplete')
    },
    mapCoord() {
      this.id && this.$emit('setMapLocationByCoord')
    }
  },
  // 销毁地图
  beforeDestroy() {
    this.map && this.map.destroy()
    this.map = null
  }
};
</script>

<style lang="scss" scoped>
#map_container {
  width: 100%;
  height: 100%;
}
</style>