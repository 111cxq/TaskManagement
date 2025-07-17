<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="取消原因"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-textarea v-decorator="['success_introduce', {rules:[{required: true, message: '请填写任务取消原因'}]}]"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import qs from 'qs'
import user from '@/store/modules/user'
import axios from 'axios'
import { notification } from 'ant-design-vue'

const fields = ['success_introduce']
const openNotificationWithIcon = (type, message, description) => {
  console.log('信息框调用')
  notification[type]({
    message: message,
    description: description
  })
}
export default {
  name: 'CancelForm',
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
          // 提交发布任务信息
          axios.post(user.state.URL + 'task/delete',
            qs.stringify({
              'job_number': sessionStorage.getItem('username'),
              'job_password': sessionStorage.getItem('password'),
              'id': user.state.task_id,
              'cancel_details': values.success_introduce
            }),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            }).then((response) => {
            console.log(response)
            if (response.data.result === 200) {
              console.log('success')
              openNotificationWithIcon('success', '信息提示框：', '任务已取消成功！')
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
    }
  }
}
</script>
