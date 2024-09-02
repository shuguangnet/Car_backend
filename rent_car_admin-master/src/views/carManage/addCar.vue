<template>
  <div class="addCar">
    <Form ref="Form" :config="config" :formData="form">
      <!-- 缩略图 -->
      <template #images>
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
          :modal="true"
          :close-on-click-modal="false"
        >
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </template>
      <!-- 保养日期 -->
      <template #date>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.date"
              :editable="false"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col :span="5">
            <span>下次保养日期：{{ nextDate }}</span>
          </el-col>
        </el-row>
      </template>
      <!-- 能源类型 -->
      <template #energy>
        <el-radio-group v-model="form.energy">
          <el-radio :label="1">电</el-radio>
          <el-radio :label="2">油</el-radio>
          <el-radio :label="3">混合动力</el-radio>
        </el-radio-group>
        <div v-if="form.energy == 1 || form.energy == 3">
          <div>电量：</div>
          <el-col :span="8">
            <el-slider v-model="form.emass" show-input> </el-slider>
          </el-col>
        </div>
        <br />
        <div v-if="form.energy == 2 || form.energy == 3">
          <div>油量：</div>
          <el-col :span="8">
            <el-slider v-model="form.omass" show-input></el-slider>
          </el-col>
        </div>
      </template>
      <!-- 车辆属性 -->
      <template #carAttr>
        <el-tag
          :key="tag"
          v-for="tag in car_attr"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+ 添加属性对象</el-button
        >
      </template>
      <!-- 租赁价格 -->
      <template #price>
        <el-col :span="3">
          <div>月租</div>
          <el-input-number
            v-model="form.mRent"
            controls-position="right"
            :min="0"
            :max="3000"
          ></el-input-number>
        </el-col>
        <el-col :span="3">
          <div>日租</div>
          <el-input-number
            v-model="form.dRent"
            controls-position="right"
            :min="0"
            :max="120"
          ></el-input-number>
        </el-col>
        <el-col :span="3">
          <div>小时租</div>
          <el-input-number
            v-model="form.hRent"
            controls-position="right"
            :min="0"
            :max="20"
          ></el-input-number>
        </el-col>
      </template>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/Form/form";
export default {
  name: "AddCar",
  components: { Form },
  data() {
    return {
      // 表单数据
      form: {
        // 车辆品牌
        brand_id: "",
        // 停车场
        parking_id: "",
        // 车辆型号
        model: "",
        // 车牌号
        number: "",
        // 车架号
        vin: "",
        // 发动机号
        engineNum: "",
        // 年检
        checked: "",
        // 日期
        date: "",
        // 档位
        gears: "",
        // 能源类型
        energy: "",
        // 电量
        emass: 100,
        // 油量
        omass: 100,
        // 可行驶公里数
        km: "",
        // 日租、月租、小时租
        mRent: "",
        dRent: "",
        hRent: "",
        // 禁启用
        enable: "",
      },
      // 表单配置
      config: {
        form_config: { label_width: "80px" },
        form_item_config: [
          {
            label: "车辆品牌",
            prop: "brand_id",
            type: "select",
            placeholder: "请选择车辆品牌",
            required: true,
            options: [],
          },
          {
            label: "停车场",
            prop: "parking_id",
            type: "select",
            placeholder: "请选择停车场",
            required: true,
            options: [],
          },
          {
            label: "车辆型号",
            prop: "model",
            type: "input",
            placeholder: "请输入车辆型号",
            required: true,
          },
          {
            label: "车牌号",
            prop: "number",
            type: "input",
            placeholder: "请输入车牌号",
            required: true,
          },
          {
            label: "车架号",
            prop: "vin",
            type: "input",
            placeholder: "请输入车架号",
          },
          { label: "缩略图", type: "slot", slotName: "images", required: true },
          {
            label: "发动机号",
            prop: "engineNum",
            type: "input",
            placeholder: "请输入发动机号",
          },
          {
            label: "年检",
            prop: "checked",
            type: "radio",
            options: [
              { label: "未年检", value: 0 },
              { label: "已年检", value: 1 },
            ],
            required: true,
            required_msg: "是否年检",
          },
          { label: "保养日期", prop: "date", type: "slot", slotName: "date" },
          {
            label: "档位",
            prop: "gears",
            type: "radio",
            options: [
              { label: "手动挡", value: "hand" },
              { label: "自动挡", value: "auto" },
            ],
            required: true,
          },
          {
            label: "能源类型",
            prop: "energy",
            type: "slot",
            slotName: "energy",
            required: true,
            required_msg: "请选择能源类型",
          },
          {
            label: "行驶公里",
            prop: "km",
            type: "input",
            placeholder: "请输入可行驶公里数",
            required: true,
            disabled: true,
            width: "200px",
          },
          {
            label: "车辆属性",
            type: "slot",
            slotName: "carAttr",
            required: true,
          },
          {
            label: "车辆描述",
            type: "richText",
          },
          {
            label: "租赁价格",
            type: "slot",
            slotName: "price",
            required: true,
            required_msg: "请输入租赁价格",
          },
          {
            label: "禁启用",
            prop: "enable",
            type: "radio",
            options: [
              { label: "禁用", value: 0 },
              { label: "启用", value: 1 },
            ],
            required: true,
          },
        ],
        form_handler: [
          {
            label: "确定",
            type: "primary",
            key: "submit",
            handler: () => this.submitForm(),
          },
          { label: "重置", key: "reset", handler: () => this.resetForm() },
        ],
      },
      // 上传图片相关
      disabled: false,
      dialogPreviewVisible: false,
      dialogImageUrl: "",
      uploadURL: this.$store.state.app.uploadURL,
      fileList: [],
      isOldFile: true,
      // 车辆属性
      car_attr: [],
      inputVisible: false,
      inputValue: "",
      id: this.$route.query.id,
    };
  },
  mounted() {
    this.getBrandList();
    this.getParkingList();
    this.id && this.getCarDetail();
  },
  methods: {
    // 获取车辆品牌列表
    async getBrandList() {
      let result = await this.$API.car.getBrandList();
      if (result.code === 200) {
        result.data.forEach((item) => {
          item.value = item.id;
          item.label = item.brand_name_ch;
        });
        this.config.form_item_config[0].options = result.data;
      } else this.$message.error("获取品牌列表失败");
    },
    // 获取停车场列表
    async getParkingList() {
      let result = await this.$API.car.getParkingList();
      if (result.code === 200) {
        result.data.forEach((item) => {
          item.label = item.parkingName;
          item.value = item.id;
        });
        this.config.form_item_config[1].options = result.data;
      } else this.$message.error("获取停车场列表失败");
    },
    // 提交表单
    submitForm() {
      // 校验
      this.$refs.Form.$refs.form.validate(async (valid) => {
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
        this.editCar(this.fileList[0].url);
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
        this.id ? this.editCar(imgUrl) : this.addCar(imgUrl);
      } else {
        this.$message.error(response.message);
      }
    },
    // 图片移除
    handleRemove(file) {
      this.fileList = [];
      this.isOldFile = false;
    },
    // 图片改变
    uploadChange(file, fileList) {
      this.fileList = fileList;
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogPreviewVisible = true;
      this.dialogImageUrl = file.url;
    },
    // 添加车辆
    async addCar(imgUrl) {
      // 参数处理
      const data = {};
      for (const key in this.form) {
        if (
          this.form[key] !== "" &&
          this.form[key] !== undefined &&
          this.form[key] !== null
        ) {
          data[key] = this.form[key];
        }
      }
      data.car_image = imgUrl;
      const attrArr = [];
      this.car_attr.forEach((item) => {
        attrArr.push({
          attr_key: item.split("：")[0],
          attr_value: item.split("：")[1] || "",
        });
      });
      data.car_attr = JSON.stringify(attrArr);
      data.car_desc = this.$refs.Form.$refs.editorDom[0].innerText;
      data.km = Number(data.km);
      data.enable ? (data.enable = true) : (data.enable = false);
      data.nextDate = this.nextDate;
      if (data.energy == 2) {
        data.emass = 0;
      }
      if (data.energy == 1) {
        data.omass = 0;
      }
      // 发送请求
      let result = await this.$API.car.carAdd(data);
      if (result.code === 200) {
        this.message("success", result.message);
        this.resetForm();
      }
    },
    // 重置表单
    resetForm() {
      this.$refs["Form"].$refs.form.resetFields();
      this.handleRemove();
      this.form.mRent = 0;
      this.form.hRent = 0;
      this.form.dRent = 0;
      this.$refs.Form.clearText();
      this.car_attr = [];
    },
    // 车辆属性相关操作方法
    handleClose(tag) {
      this.car_attr.splice(this.car_attr.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      // const inputArr = inputValue.split('：')
      if (inputValue) {
        this.car_attr.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 获取车辆详情
    async getCarDetail() {
      let result = await this.$API.car.getCarDetail(this.id);
      if (result.code === 200) {
        for (const key in result.data) {
          if (key in this.form) {
            if (key === "enable") {
              result.data[key] = result.data[key] ? 1 : 0;
            }
            this.form[key] = result.data[key];
          }
        }
        this.fileList.push({
          name: result.data.model,
          url: result.data.car_image,
        });
        const attrData = [];
        result.data.car_attr.forEach((item) => {
          attrData.push(item.attr_key + "：" + item.attr_value);
        });
        this.car_attr = attrData;
        this.$refs.Form.editor.txt.html(result.data.car_desc);
      }
    },
    // 编辑车辆信息
    async editCar(car_image) {
      // 参数处理
      const data = {};
      for (const key in this.form) {
        if (
          this.form[key] !== "" &&
          this.form[key] !== undefined &&
          this.form[key] !== null
        ) {
          data[key] = this.form[key];
        }
      }
      data.car_image = car_image;
      const attrArr = [];
      this.car_attr.forEach((item) => {
        attrArr.push({
          attr_key: item.split("：")[0],
          attr_value: item.split("：")[1] || "",
        });
      });
      data.car_attr = JSON.stringify(attrArr);
      data.car_desc = this.$refs.Form.$refs.editorDom[0].innerText;
      data.km = Number(data.km);
      data.enable ? (data.enable = true) : (data.enable = false);
      data.nextDate = this.nextDate;
      if (data.energy == 2) {
        data.emass = 0;
      }
      if (data.energy == 1) {
        data.omass = 0;
      }
      data.id = this.id;
      // 发送请求
      let result = await this.$API.car.carEdit(data);
      if (result.code === 200) {
        this.message("success", result.message);
        this.resetForm();
        this.$router.back();
      }
    },
  },
  computed: {
    nextDate() {
      if (this.form.date) {
        let date = this.form.date.split("-");
        date[0] = date[0] * 1 + 1;
        return (date == "1" ? "" : date.join("-")) || undefined;
      }
      return "";
    },

  },
  watch: {
    "form.emass":  {
      immediate: true,
      handler(newValue) {
        if (this.form.energy === 3) {
          this.form.km = parseInt((newValue + this.form.omass) / 2 * 6.72)
        } else {
          this.form.km = parseInt(newValue * 6.72)
        }
      }
    },
    "form.omass":  {
      immediate: true,
      handler(newValue) {
        if (this.form.energy === 3) {
          this.form.km = parseInt((newValue + this.form.emass) / 2 * 6.72)
        } else {
          this.form.km = parseInt(newValue * 6.72)
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.addCar {
  padding: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>