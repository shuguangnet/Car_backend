<template>
  <div class="memberList">
    <Form ref="Form" :config="form_configs" :formData="form"> </Form>
    <Table ref="table" :table_config="table_config">
      <template #operation="{ data }">
        <el-button type="primary" size="small" @click="detailmember(data.id)">详情</el-button>
        <el-button
          size="small"
          :loading="data.id === delete_id"
          @click="deleteMember(data.id)"
          >删除</el-button
        >
      </template>
    </Table>

    <!-- 详情 -->
    <MemberDetail ref="dialog"></MemberDetail>
  </div>
</template>

<script>
import Form from "@/components/Form/form";
import Table from "@/components/TableData/table";
import MemberDetail from '@/views/memberManage/memberDetail'
export default {
  name: "MenberList",
  components: { Form, Table, MemberDetail },
  data() {
    return {
      // 表单数据
      form: {
        keyWord: "",
        searchValue: "",
      },
      // 表单配置
      form_configs: {
        form_config: { inline: true },
        form_item_config: [
          {
            label: "关键字",
            prop: "keyWord",
            type: "select",
            options: [
              { label: "用户名", value: "username" },
              { label: "真实姓名", value: "real_name" },
              { label: "身份证号", value: "card_id" },
            ],
          },
          {
            prop: "searchValue",
            type: "input",
            placeholder: "请输入要查询的信息",
          },
        ],
        form_handler: [
          {
            label: "查询",
            type: "primary",
            key: "query",
            handler: () => this.queryCar(),
          },
          {
            label: "重置",
            type: "primary",
            key: "reset",
            handler: () => this.reset(),
          },
        ],
      },
      // 表格配置
      table_config: {
        table_headers: [
          { label: "用户名", prop: "username" },
          { label: "真实姓名", prop: "real_name" },
          { label: "身份证号", prop: "card_id" },
          { label: "租车订单", prop: "rent_order" },
          { label: "预存金额", prop: "deposit" },
          {
            label: "实名认证",
            prop: "isIdentification",
            type: "function",
            callback: (row) => {
              return row.isIdentification ? "已认证" : "-";
            },
          },
          {
            label: "驾驶证",
            prop: "drivingLicence",
            type: "function",
            callback: (row) => {
              return row.drivingLicence ? "已认证" : "-";
            },
          },
          { label: "操作", type: "slot", slotName: "operation" },
        ],
        axios_config: {
          url: "/member/list",
          method: "POST",
        },
        requestData: {
          pageNumber: 1,
          pageSize: 10,
        },
        checkedColumn: true,
        pagination: true,
      },
      delete_id: ""
    };
  },
  mounted() {
    
  },
  methods: {
    // 查询
    queryCar() {
      let { keyWord, searchValue } = this.form;
      // 可能需要提交的数据
      let params = {
        pageNumber: 1,
        pageSize: 10,
      };
      if (keyWord !== "") {
        params[keyWord] = searchValue;
      }
      // 调用获取数据的方法并传递参数
      this.$refs.table.getTableDataWithParams(params);
    },
    // 重置
    reset() {
      this.$refs.Form.$refs.form.resetFields();
      this.queryCar();
    },
    // 删除
    deleteMember(id) {
      this.delete_id = id;
      this.$confirm("是否删除该会员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.member.memberDelete(id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.$refs.table.getTableData();
            this.delete_id = "";
          } else this.delete_id = "";
        })
        .catch(() => {
          this.delete_id = "";
        });
    },
    // 查看详情
    detailmember(id) {
      this.$refs.dialog.open(id)
    }
  },
};
</script>

<style lang="scss" scoped>
.memberList {
  padding: 20px;
}
</style>