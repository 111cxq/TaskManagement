<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="任务名称"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['content', {rules:[{required: true, message: '请输入任务名称'}]}]" />
    </a-form-item>
    <a-form-item
      label="开始时间"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-date-picker
        style="width: 100%"
        valueFormat="YYYY-MM-DD"
        v-decorator="['start_date', {rules:[{required: true, message: '请选择开始时间'}]}]"
      />
    </a-form-item>
    <a-form-item
      label="任务负责人"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <!--      设置搜索框搜索的属性为label,默认是value-->
      <a-select
        v-decorator="['executor', {rules:[{required: true, message: '请选择负责人'}]}]"
        show-search
        placeholder="请选择负责人"
        optionFilterProp="label"
      >
        <a-select-option v-for="item in executor_list" :value="item.value" :key="item.value" :label="item.label">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="任务描述"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-textarea v-decorator="['details', {rules:[{required: true, message: '请填写任务详情'}]}]"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import qs from 'qs'
import user from '@/store/modules/user'
import axios from 'axios'
import { notification } from 'ant-design-vue'

const fields = ['content', 'start_date', 'executor', 'details']
const openNotificationWithIcon = (type, message, description) => {
  console.log('信息框调用')
  notification[type]({
    message: message,
    description: description
  })
}
export default {
  name: 'TaskForm',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      // 调用当前表单的用途是新增还是修改
      type: 'add',
      // 负责人列表
      executor_list: [],
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
    console.log(this.record)
    if (this.record.type === 'add') {
      this.type = 'add'
      console.log('add type')
    } else {
      this.type = 'update'
      console.log('update type')
    }
    console.log('编辑信息：', this.record)
    console.log('请求负责人列表')
    // 请求执行人列表渲染
    axios.post(user.state.URL + 'task/group',
      qs.stringify({
        'job_number': sessionStorage.getItem('username'),
        'job_password': sessionStorage.getItem('password'),
        'type': 'post_list'
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        console.log(response.data)
        if (response.data.result === 200) {
          // 处理返回的负责人列表
          response.data.post_list.forEach((item) => {
            item.children.forEach((i) => {
              // 这里重组了执行人列表,其中label表示显示的内容,value用于搜索label,number才是实际的工号用于标识
              const list = {
                value: i.value,
                label: i.text
              }
              this.executor_list.push(list)
            })
          })
        } else {
          console.log('error')
        }
      }).catch((error) => console.log(error))
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
          let SendData
          // 处理修改任务时需要任务ID的情况
          if (this.type === 'update') {
            SendData = {
              'id': user.state.task_id,
              'job_number': sessionStorage.getItem('username'),
              'job_password': sessionStorage.getItem('password'),
              'content': values.content,
              'type': this.type,
              'details': values.details,
              'executor': values.executor,
              'start_time': values.start_date
            }
          } else {
            SendData = {
              'job_number': sessionStorage.getItem('username'),
              'job_password': sessionStorage.getItem('password'),
              'content': values.content,
              'type': this.type,
              'details': values.details,
              'executor': values.executor,
              'start_time': values.start_date
            }
          }
          console.log(SendData)
          // 提交发布任务信息
          axios.post(user.state.URL + 'task/',
            qs.stringify(SendData),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              }
            }).then((response) => {
            console.log('response')
            console.log(response)
            if (response.data.result === 200) {
              console.log('success')
              openNotificationWithIcon('success', '信息提示框：', '您提交的任务已经成功保存！')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            } else {
              console.log('error400')
              openNotificationWithIcon('error', '信息提示框：', response.data.mes)
            }
          }).catch((error) => {
            console.log(error)
            openNotificationWithIcon('error', '信息提示框：', '请求失败，请检查网络状态！')
          })
        } else {
          console.log('error404')
          openNotificationWithIcon('warn', '信息提示框：', '您提交的任务信息有误，请检查是否有空项！')
        }
      })
    }
  }
}
</script>
