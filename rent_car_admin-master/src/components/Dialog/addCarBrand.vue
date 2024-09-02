<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    @close="close"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-form :model="form" ref="dialogBrand" :rules="rules">
      <el-form-item label="品牌中文" label-width="120px" prop="brand_name_ch">
        <el-input v-model="form.brand_name_ch" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="品牌英文" label-width="120px" prop="brand_name_en">
        <el-input v-model="form.brand_name_en" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="LOGO" label-width="120px">
        <el-upload
          :action="uploadURL"
          name="img"
          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-change="uploadChange"
          list-type="picture-card"
          ref="upload"
          :auto-upload="false"
          :limit="1"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.url" />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且只能上传一张图片
          </div>
        </el-upload>
        <el-dialog
          width="40%"
          top="8vh"
          :visible.sync="dialogPreviewVisible"
          :modal="false"
          :close-on-click-modal="false"
        >
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="类型" label-width="120px" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "AddCarBrand",
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 对话框的显示隐藏
      dialogVisible: false,
      // 表单的数据
      form: {
        brand_name_ch: "",
        brand_name_en: "",
        status: "",
      },
      id: "",
      // 上传图片相关
      disabled: false,
      dialogPreviewVisible: false,
      dialogImageUrl: "",
      uploadURL: this.$store.state.app.uploadURL,
      fileList: [],
      isOldFile: true,
      // 校验规则
      rules: {
        brand_name_ch: [
          {
            required: true,
            message: "请输入车辆品牌（中文）",
            trigger: "blur",
          },
        ],
        brand_name_en: [
          {
            required: true,
            message: "请输入车辆品牌（英文）",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    // 父组件传递的品牌详细数据
    this.$bus.$on("brandDetail", (data) => {
      this.form.brand_name_ch = data.brand_name_ch;
      this.form.brand_name_en = data.brand_name_en;
      this.form.status = data.status;
      this.id = data.id;
      this.fileList.push({ name: data.brand_name_en, url: data.brand_logo });
    });
  },
  methods: {
    // 关闭对话框方法
    close() {
      // 清空表单
      this.$refs.dialogBrand.resetFields();
      // 移除upload的图片
      this.$refs.upload.clearFiles();
      // 关闭对话框
      this.$emit("update:flagVisible", false);
      this.id = "";
      this.dialogImageUrl = "";
      this.form.brand_name_ch = "";
      this.form.brand_name_en = "";
      this.form.status = "";
      this.fileList = [];
      this.isOldFile = true
    },
    // 提交表单
    submitForm() {
      // 校验
      this.$refs.dialogBrand.validate(async (valid) => {
        if (valid) {
          this.upload();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 图片上传
    upload() {
      if (this.isOldFile && this.fileList.length !== 0 && this.id) {
        this.editBrand(this.fileList[0].url)
      } else {
        this.fileList.length === 0
        ? this.message("warning", "请上传图片")
        : this.$refs.upload.submit();
      }
    },
    // 图片上传成功
    uploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        const imgUrl = response.imgUrl;
        // 调用新增品牌接口
        this.id ? this.editBrand(imgUrl) : this.addBrand(imgUrl);
      } else {
        this.$message.error(response.message);
      }
    },
    // 新增车辆品牌
    async addBrand(brand_logo) {
      // 参数处理
      let data = JSON.parse(JSON.stringify(this.form));
      this.form.status === "" && delete data.status;
      data.brand_logo = brand_logo;
      let result = await this.$API.brand.addBrand(data);
      if (result.code === 200) {
        this.message("success", result.message);
        this.close();
        // 重新获取一次列表
        this.$emit("getBrandList");
      }
    },
    // 编辑车辆品牌
    async editBrand(brand_logo) {
      // 参数处理
      let data = JSON.parse(JSON.stringify(this.form));
      this.form.status === "" && delete data.status;
      data.brand_logo = brand_logo;
      data.id = this.id;
      let result = await this.$API.brand.editBrand(data);
      if (result.code === 200) {
        this.message("success", result.message);
        this.close();
        // 重新获取一次列表
        this.$emit("getBrandList");
      }
    },
    // 图片移除
    handleRemove(file) {
      this.fileList = [];
      this.isOldFile = false
    },
    // 图片改变
    uploadChange(file, fileList) {
      this.fileList = fileList;
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogPreviewVisible = true;
      this.dialogImageUrl = file.url;
    }
  },
  computed: {
    title() {
      return this.id ? "编辑车辆品牌" : "新增车辆品牌";
    },
  },
  // 监听是否隐藏
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  padding-left: 120px;
}
</style>