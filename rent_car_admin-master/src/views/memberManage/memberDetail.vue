<template>
  <el-dialog
    title="会员信息"
    :visible.sync="dialogVisible"
    width="30%"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div class="text">
      <el-row>
        <el-col :span="5">用户名</el-col>
        <el-col :span="16">{{memberInfo.username}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">真实姓名</el-col>
        <el-col :span="16">{{memberInfo.real_name || '未认证'}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">手机号</el-col>
        <el-col :span="16">{{memberInfo.phone || '未绑定'}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">身份证号</el-col>
        <el-col :span="16">{{memberInfo.card_id || '未认证'}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">预存金额</el-col>
        <el-col :span="16">{{memberInfo.deposit}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">银行卡号</el-col>
        <el-col :span="16">{{memberInfo.bank_number || '未绑定'}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">驾驶证</el-col>
        <el-col :span="16">{{memberInfo.drivingLicence_id || '未绑定'}}</el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "memberDetail",
  data() {
    return {
      dialogVisible: false,
      memberInfo: {}
    };
  },
  methods: {
    close() {
      this.dialogVisible = false;
    },
    open(id) {
      this.dialogVisible = true;
      this.getMemberInfo(id);
    },
    // 获取会员信息
    async getMemberInfo(id) {
        let result = await this.$API.member.getMemberDetail(id)
        if (result.code === 200) {
            this.memberInfo = result.data
        } else {
            this.$message.error(result.message)
        }
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
    height: 100%;
    font-size: 18px;
}
</style>