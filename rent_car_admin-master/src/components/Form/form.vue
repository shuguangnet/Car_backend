<template>
  <div>

    <el-form ref="form" :model="formData" :label-width="config.form_config.label_width" :inline="config.form_config.inline">

        <el-form-item v-for="item in config.form_item_config" :key="item.prop" :rules="item.rules" :label="item.label" :prop="item.prop">
            <!-- 输入框类型 -->
            <el-input v-if="item.type === 'input'" v-model.trim="formData[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" :style="{ width: item.width}"></el-input>

            <!-- 插槽类型 -->
            <slot v-if="item.type === 'slot'" :name="item.slotName"></slot>
            
            <!-- 单选类型 -->
            <el-radio-group v-if="item.type === 'radio'" v-model="formData[item.prop]">
                <el-radio v-for="radio in item.options" :key="radio.value" :label="radio.value">{{ radio.label }}</el-radio>
            </el-radio-group>

            <!-- 开关类型 -->
            <el-switch v-if="item.type === 'switch'" v-model="formData[item.prop]" active-color="#13ce66"></el-switch>

            <!-- 下拉框类型 -->
            <el-select v-if="item.type === 'select'" v-model="formData[item.prop]" :placeholder="item.placeholder">
                <el-option v-for="option in item.options" :key="option.id || option.value" :label="option.label" :value="option.value">
                </el-option>
            </el-select>

            <!-- 富文本编辑器 -->
            <div v-if="item.type === 'richText'" ref="editorDom"></div>
        </el-form-item>


        <!-- 按钮 -->
        <el-form-item>
            <el-button v-for="item in config.form_handler" :key="item.key" :type="item.type" @click="item.handler && item.handler()">
                {{item.label}}
            </el-button>
        </el-form-item>

    </el-form>

  </div>
</template>

<script>
import E from "wangeditor";
export default {
    name: 'Form',
    props: ['config', 'formData'],
    data() {
        return {
            required_msg: {
                'input': '请输入',
                'radio': '请选择',
                'select': '请选择'
            },
            // 富文本
            editor: null,
        }
    },
    mounted() {
        this.config.form_item_config.forEach(item => {
            if (item.type === 'richText') {
                this.createEditor()
                return false
            }
        })
        
    },
    methods: {
        // 初始化form数据
        initForm() {
            this.config.form_item_config.forEach(item => {
                // rules规则
                if (item.required) this.rules(item);
            })
        },
        rules(item) {
            const requiredRules = [{ required: true, message: item.required_msg || `${this.required_msg[item.type]}${item.label}`, trigger: "change" }]
            // 其他规则
            if (item.rules && item.rules.length > 0) {
                item.rules = requiredRules.concat(item.rules)
            } else {
                item.rules = requiredRules
            }
           
        },
        // 创建富文本
        createEditor() {
            this.editor = new E(this.$refs.editorDom);
            this.editor.create();
        },
        // 清空富文本内容
        clearText() {
            this.editor.txt.clear()
        }
    },
    watch: {
        config: {
            immediate: true,
            handler(newValue) {
                this.initForm()
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>