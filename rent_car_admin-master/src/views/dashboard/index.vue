<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->

    <Echarts ref="echarts"></Echarts>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Echarts from './echarts.vue'
export default {
  name: 'Dashboard',
  components: {Echarts},
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // margin: 30px;
    padding: 0 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
