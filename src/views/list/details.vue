<template>
  <page-header-wrapper
    :title="task.content"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <a-spin :spinning="spinning" size="large">
      <!-- actions -->
      <template>
        <a-button type="primary" @click="back_page()">返回</a-button>
        <a-button type="primary" >主操作</a-button>
      </template>

      <a-card :bordered="false" title="流程进度">
        <a-steps :direction="isMobile && 'vertical' || 'horizontal'" :current="task.task_current" progressDot>
          <a-step>
            <template v-slot:title>
              <span>发布任务</span>
            </template>
            <template v-slot:description>
              <div class="antd-pro-pages-profile-advanced-style-stepDescription">
                总经办<a-icon type="dingding" style="margin-left: 8px;" />
                <div>{{ task.start_date }}</div>
              </div>
            </template>
          </a-step>
          <a-step>
            <template v-slot:title>
              <span>任务初审</span>
            </template>
            <template v-slot:description>
              <div class="antd-pro-pages-profile-advanced-style-stepDescription">
                直属高管<a-icon type="dingding" style="color: rgb(0, 160, 233); margin-left: 8px;" />
              </div>
            </template>
          </a-step>
          <a-step>
            <template v-slot:title>
              <span>任务执行</span>
            </template>
            <template v-slot:description>
              <div class="antd-pro-pages-profile-advanced-style-stepDescription">
                {{ task.executor }}<a-icon type="dingding" style="margin-left: 8px;" />
              </div>
            </template>
          </a-step>
          <a-step>
            <template v-slot:title>
              <span>任务确认</span>
            </template>
            <template v-slot:description>
              <div class="antd-pro-pages-profile-advanced-style-stepDescription">
                总经办<a-icon type="dingding" style="margin-left: 8px;" />
              </div>
            </template>
          </a-step>
          <a-step>
            <template v-slot:title>
              <span>任务完成</span>
            </template>
          </a-step>
        </a-steps>
      </a-card>

      <a-card style="margin-top: 24px" :bordered="false" title="任务信息">
        <a-descriptions>
          <a-descriptions-item label="创建人"> {{ task.creator }} </a-descriptions-item>
          <a-descriptions-item label="任务名称"> {{ task.content }} </a-descriptions-item>
          <a-descriptions-item label="创建时间"> {{ task.start_date }} </a-descriptions-item>
          <a-descriptions-item label="执行人"> {{ task.executor }} </a-descriptions-item>
          <a-descriptions-item label="计划时间"> {{ task.start_date }}  ~ {{ task.end_date }} </a-descriptions-item>
          <a-descriptions-item label="任务详情"> {{ task.details }} </a-descriptions-item>
        </a-descriptions>
        <a-card type="inner" title="任务执行详情">
          <a-descriptions title="任务发布" size="small">
            <a-descriptions-item label="创建人">总经办</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ task.start_date }}</a-descriptions-item>
            <a-descriptions-item label="所属部门">总经办</a-descriptions-item>
            <a-descriptions-item label="任务名称">{{ task.content }}</a-descriptions-item>
            <a-descriptions-item label="任务描述">{{ task.details }}</a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin: 16px 0" />
          <a-descriptions title="任务审核" size="small" :col="1">
            <a-descriptions-item label="审批人">直属高管</a-descriptions-item>
            <a-descriptions-item label="任务预计完成时间">{{ task.end_date }}</a-descriptions-item>
            <a-descriptions-item label="所属部门">所属部门</a-descriptions-item>
            <a-descriptions-item label="任务难度">{{ task.difficulty }}</a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin: 16px 0" />
          <a-descriptions title="任务执行" size="small" :col="2">
            <a-descriptions-item label="执行人">{{ task.executor }}</a-descriptions-item>
            <a-descriptions-item label="完成时间">{{ task.completion_date }}</a-descriptions-item>
            <a-descriptions-item label="所属部门">所属部门</a-descriptions-item>
            <a-descriptions-item label="完成详情">{{ task.completion_details }}</a-descriptions-item>
            <a-descriptions-item label="附带资料">{{ task.Accompanying_information }}</a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin: 16px 0" />
          <a-descriptions title="任务确认" size="small" :col="2">
            <a-descriptions-item label="确认人">总经办</a-descriptions-item>
            <a-descriptions-item label="所属部门">总经办</a-descriptions-item>
          </a-descriptions>
        </a-card>

      </a-card>

    </a-spin>
  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import axios from 'axios'
import qs from 'qs'
import { notification } from 'ant-design-vue'
import user from '@/store/modules/user'

const openNotificationWithIcon = (type, message, description) => {
  console.log('信息框调用')
  notification[type]({
    message: message,
    description: description
  })
}
export default {
  name: 'Details',
  mixins: [baseMixin],
  data () {
    return {
      // 控制页面刷新动画
      spinning: false,
      task: {
        creator: '总经办',
        id: '',
        content: '',
        details: '',
        executor: '',
        executor_name: '',
        executor_id: '',
        start_date: '',
        end_date: '',
        difficulty: '',
        completion_date: '',
        completion_details: '',
        status: '',
        Accompanying_information: '',
        task_current: 1
      },
      tabList: [
        { key: 'detail', tab: '详情' },
        { key: 'rule', tab: '规则' }
      ],
      tabActiveKey: 'detail'
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'agree': '成功',
        'reject': '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        'agree': 'success',
        'reject': 'error'
      }
      return statusTypeMap[type]
    }
  },
  created () {
    this.spinning = true
    console.log('id:', this.$route.params.task_id)
    this.task.id = this.$route.params.task_id
    axios.post(user.state.URL + 'task/book_details',
      qs.stringify({
        'job_number': sessionStorage.getItem('username'),
        'job_password': sessionStorage.getItem('password'),
        'id': this.task.id
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
      if (response.data.result === 200) {
        console.log(',:', response)
        this.task.content = response.data.data.content
        this.task.details = response.data.data.details
        this.task.executor = response.data.data.executor
        this.task.executor_id = response.data.data.executor_id
        this.task.executor_name = response.data.data.executor_name
        this.task.start_date = response.data.data.start_date
        this.task.end_date = response.data.data.end_date
        this.task.difficulty = response.data.data.difficulty
        this.task.completion_date = response.data.data.completion_date
        this.task.completion_details = response.data.data.completion_details
        this.task.status = response.data.data.status
        if (response.data.data.path === 'null') {
          this.task.Accompanying_information = ''
        } else {
          this.task.Accompanying_information = response.data.data.path
          console.log(this.task.Accompanying_information)
        }
        if (this.task.status === '待审核') {
          this.task.task_current = 1
        } else if (this.task.status === '待完成') {
          this.task.task_current = 2
        } else if (this.task.status === '待确认') {
          this.task.task_current = 3
        } else if (this.task.status === '已完成') {
          this.task.task_current = 4
        }
        // 加载动画结束
        this.spinning = false
        openNotificationWithIcon('success', '信息提示框：', '任务列表加载成功！')
      } else {
        console.log('error')
        this.spinning = false
        openNotificationWithIcon('error', '信息提示框：', '与服务器通讯出错啦，请联系管理员！')
      }
    }).catch((error) => {
      console.log(error)
      this.spinning = false
      openNotificationWithIcon('error', '信息提示框：', '请求失败，请检查网络状态！')
    })
  },
  methods: {
    handleTabChange (key) {
      console.log('1')
      this.tabActiveKey = key
    },
    back_page () {
      console.log('back')
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>

.detail-layout {
  margin-left: 44px;
}
.text {
  color: rgba(0, 0, 0, .45);
}

.heading {
  color: rgba(0, 0, 0, .85);
  font-size: 20px;
}

.no-data {
  color: rgba(0, 0, 0, .25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .text {

  }
  .status-list {
    text-align: left;
  }
}
</style>
