<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="预计完成时间"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-date-picker
        style="width: 100%"
        valueFormat="YYYY-MM-DD"
        v-decorator="['end_time', {rules:[{required: true, message: '请选择预计完成时间'}]}]"
      />
    </a-form-item>
    <a-form-item
      label="任务难度"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-select v-decorator="['difficulty', {rules:[{required: true, message: '请选择任务难度'}]}]" placeholder="请选择任务难度">
        <a-select-option value="1">1星难度</a-select-option>
        <a-select-option value="2">2星难度</a-select-option>
        <a-select-option value="3">3星难度</a-select-option>
        <a-select-option value="4">4星难度</a-select-option>
        <a-select-option value="5">5星难度</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import qs from 'qs'
import user from '@/store/modules/user'
import axios from 'axios'
import { notification } from 'ant-design-vue'

const fields = ['end_time', 'difficulty']

const openNotificationWithIcon = (type, message, description) => {
  console.log('信息框调用')
  notification[type]({
    message: message,
    description: description
  })
}
export default {
  name: 'ReviewForm',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      id: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this)
    }
  },
  mounted () {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
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
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('开始提交')
          console.log('values：', values)
          axios.post(user.state.URL + 'task/ratify',
            qs.stringify({
              'job_number': sessionStorage.getItem('username'),
              'job_password': sessionStorage.getItem('password'),
              'end_time': values.end_time,
              'difficulty': values.difficulty,
              'id': user.state.task_id
            }),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            }).then((response) => {
            console.log(response)
            if (response.data.result === 200) {
              console.log('success')
              openNotificationWithIcon('success', '信息提示框：', '任务审批成功！')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            } else {
              console.log('error')
              openNotificationWithIcon('error', '信息提示框：', '您的输入有误，请检查后重新提交！')
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
    }
  }
}
</script>
<style scoped>
.icon-wrapper {
  position: relative;
  padding: 0 30px;
}

.icon-wrapper .anticon {
  position: absolute;
  top: -2px;
  width: 16px;
  height: 16px;
  line-height: 1;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.25);
}

.icon-wrapper .anticon:first-child {
  left: 0;
}

.icon-wrapper .anticon:last-child {
  right: 0;
}
</style>
