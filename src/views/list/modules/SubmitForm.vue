<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="完成时间"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-date-picker
        style="width: 100%"
        valueFormat="YYYY-MM-DD"
        v-decorator="['success_time', {rules:[{required: true, message: '请选择完成时间'}]}]"
      />
    </a-form-item>

    <a-form-item
      label="完成情况"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-textarea v-decorator="['success_introduce', {rules:[{required: true, message: '请填写任务完成情况'}]}]"></a-textarea>
    </a-form-item>
    <a-form-item
      label="上传文件"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <div class="clearfix">
        <a-upload
          v-model="file_list"
          :before-upload="beforeUpload"
          list-type="picture-card"
          :max-count="1"
          @preview="preview"
          :remove="remove"
        >
          <div v-if="upload_control">
            <p style="font-size: 60px;margin-top: -40px;margin-bottom: -30px">+</p>
            <div style="margin-top: 8px">Upload</div>
          </div>
        </a-upload>
        <p>提示：文件仅支持上传一个，图片带大图预览效果。</p>
        <p>重新上传图片会覆盖原有图片</p>
        <a-modal :visible="previewVisible" title="预览" :footer="null" @cancel="preview_cancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import user from '@/store/modules/user'
import axios from 'axios'
import { notification } from 'ant-design-vue'

const fields = ['success_time', 'success_introduce']
const openNotificationWithIcon = (type, message, description) => {
  console.log('信息框调用')
  notification[type]({
    message: message,
    description: description
  })
}
export default {
  name: 'SubmitForm',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      file_list: [],
      upload_control: true,
      previewImage: '',
      previewVisible: false
    }
  },
  mounted () {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
    console.log(this.record)
    this.file_path = this.record.path.split('-')[1]
  },
  methods: {
    onOk () {
      console.log('监听了 modal ok 事件')
      return new Promise(resolve => {
        resolve(true)
        this.handleSubmit()
      })
    },
    onCancel () {
      console.log('监听了 modal cancel 事件')
      return new Promise(resolve => {
        resolve(true)
      })
    },
    // 提交发布任务内容
    handleSubmit () {
      console.log('handle submit')
      const { form: { validateFields } } = this
      console.log('validate check')
      validateFields((errors, values) => {
        console.log('validate pass')
        if (!errors) {
          console.log('开始提交')
          console.log('values：', values)
          const formData = new FormData()
          formData.append('job_number', sessionStorage.getItem('username'))
          formData.append('job_password', sessionStorage.getItem('password'))
          formData.append('id', user.state.task_id)
          formData.append('success_time', values.success_time)
          formData.append('success_introduce', values.success_introduce)
          formData.append('status', '待确认')
            console.log('1', this.file_list.length)
          if (this.file_list.length === 0) {
            formData.append('file', '')
              console.log('文件空')
          } else {
            formData.append('file', this.file_list.value[0])
            console.log('文件有')
          }
          // 提交发布任务信息
          axios.post(user.state.URL + 'task/submit',
          // axios.post('http://10.10.1.45:5000/inspection/test_test',
            formData,
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            }).then((response) => {
            console.log(response)
            if (response.data.result === 200) {
              console.log('success')
              openNotificationWithIcon('success', '信息提示框：', '您提交的完成任务内容已经成功保存！')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            } else {
              console.log('error')
              openNotificationWithIcon('error', '信息提示框：', response.data.mes)
            }
          }).catch((error) => {
            console.log(error)
            openNotificationWithIcon('error', '信息提示框：', '请求失败，请检查网络状态！')
          })
        } else {
          console.log('error')
          openNotificationWithIcon('warn', '信息提示框：', '您提交的任务信息有误，请检查是否有空项！')
        }
      })
    },
    beforeUpload (file) {
      this.file_list.value = [...(this.file_list.value || []), file]
      this.$message.info('最多支持上传一个文件')
      console.log('length:', this.file_list.value.length)
      this.upload_control = this.file_list.value.length < 1
      return false
    },
    remove () {
      console.log('remove')
      this.$message.warn('您点击了删除文件')
      this.file_list = []
      this.upload_control = true
    },
    preview (file) {
      console.log('preview')
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    preview_cancel () {
      console.log('preview cancel')
      this.previewImage = ''
      this.previewVisible = false
    }
  }
}
</script>
