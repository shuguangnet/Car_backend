<template>
  <el-dialog
    :title="parkingData.parkingName"
    :visible="dialogVisibleMap"
    width="70%"
    :close-on-click-modal="false"
    @close="close"
    style="padding: 0"
  >
    <div class="mapDialog"><Map v-if="dialogVisibleMap" @mapComplete="addMarker" ref="map"></Map></div>
  </el-dialog>
</template>

<script>
import Map from '@/views/map/map'
export default {
    name: 'mapDiglog',
    components: { Map },
    props: ['dialogVisibleMap', 'parkingData'],
    methods: {
        close() {
            this.$emit('update:dialogVisibleMap', false)
        },
        // 添加点标记，在地图加载完成后调用
        addMarker() {
          this.$refs.map.addMarker(this.parkingData.coord)
        }
    },
};
</script>

<style lang="scss" scoped>
    .mapDialog {
    width: 100%;
    height: 650px;
  }
</style>