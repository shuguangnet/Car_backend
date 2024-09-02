<template>
    <el-pagination
      :page-sizes="[10, 17, 26, 35]"
      :page-size="pageSize"
      :current-page="pageNumber"
      layout="->, total, sizes, prev, pager, next, jumper"
      background
      class="pagination"
      @size-change="sizeChange"
      @current-change="currentChange"
      :total="total">
    </el-pagination>
</template>

<script>
export default {
    name: 'Pagination',
    props: ['total', 'pageSize', 'pageNumber'],
    methods: {
      sizeChange(value) {
        this.$emit('update:pageSize', value)
        this.$emit('getDataList')
      },
      currentChange(value) {
        this.$emit('update:pageNumber', value)
        this.$emit('getDataList')
      }
    },
}
</script>

<style lang="scss" scoped>
  .pagination {
    margin-top: 20px;
  }
</style>