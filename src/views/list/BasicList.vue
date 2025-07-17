<template>
  <!--  // 面包屑导航-->
  <page-header-wrapper>
    <a-spin :spinning="spinning" size="large">

      <!--    //任务卡片-->
      <a-card :bordered="false" title="任务总览：（点击即可切换查看内容）">
        <a-row>
          <a-col :sm="4" :xs="24" @click="set_task_type('待审核')">
            <info title="待审核任务" :value="count.review" :bordered="true" />
          </a-col>
          <a-col :sm="4" :xs="24" @click="set_task_type('待完成')">
            <info title="待完成任务" :value="count.wait" :bordered="true" />
          </a-col>
          <a-col :sm="4" :xs="24" @click="set_task_type('待确认')">
            <info title="待确认任务" :value="count.confirm" />
          </a-col>
          <a-col :sm="4" :xs="24" @click="set_task_type('已完成')">
            <info title="已完成任务" :value="count.accomplish" />
          </a-col>
          <a-col :sm="4" :xs="24" @click="set_task_type('已放弃')">
            <info title="已放弃任务" :value="count.abandon" />
          </a-col>
          <a-col :sm="4" :xs="24" @click="set_task_type('已取消')">
            <info title="已取消任务" :value="count.cancel" />
          </a-col>
        </a-row>
      </a-card>

      <a-card
        style="margin-top: 24px"
        :bordered="false"
        title="任务列表">
        <!--    顶部切换和搜索-->
        <div slot="extra">
          <a-radio-group v-model="status">
            <a-radio-button value="all" @click="show_task('all')">全部</a-radio-button>
            <a-radio-button value="other" @click="show_task('other')">管辖任务</a-radio-button>
            <a-radio-button value="my" @click="show_task('my')">我的任务</a-radio-button>
          </a-radio-group>
          <!--  &lt;!&ndash;        搜索栏&ndash;&gt;-->
          <!--          <a-input-search style="margin-left: 16px; width: 272px;" />-->
        </div>
        <!--    发布任务按钮-->
        <div class="operate">
          <a-button type="dashed" style="width: 100%" icon="plus" @click="add">发布任务</a-button>
        </div>

        <!--      任务列表-->
        <a-list size="large" :pagination="pagination">
          <a-list-item :key="index" v-for="(item, index) in data">
            <a-list-item-meta :description="item.details">
              <!--            头像-->
              <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
              <!--            任务标题-->
              <a slot="title" @click="to_details(item.task_id)">{{ item.content }}</a>
            </a-list-item-meta>
            <div slot="actions" style="width: 200px">
              <a-button type="primary" shape="round" @click="edit(item)" v-if="item.ratify.change_task === true">编辑任务</a-button>
              <a-button type="primary" shape="round" @click="review(item)" v-if="item.ratify.review_task === true">审核任务</a-button>
              <a-button type="primary" shape="round" @click="review(item)" v-if="item.ratify.change_review === true">修改审核</a-button>
              <a-button type="primary" shape="round" @click="submit(item)" v-if="item.ratify.submit_task === true">执行任务</a-button>
              <a-button type="primary" shape="round" @click="abandon(item)" v-if="item.ratify.abandon_task === true">放弃任务</a-button>
              <a-button type="primary" shape="round" @click="select_to_change(item)" v-if="item.ratify.change_submit === true">修改提交</a-button>
              <a-button type="primary" shape="round" @click="confirm(item)" v-if="item.ratify.confirm_task === true">确认任务</a-button>
            </div>
            <!--          更多-->
            <div slot="actions">
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a-button type="primary" shape="round" @click="cancel(item)" v-if="item.ratify.cancel_task === true">
                      取消任务
                    </a-button>
                  </a-menu-item>
                  <a-menu-item><a>删除</a></a-menu-item>
                </a-menu>
                <a>更多<a-icon type="down"/></a>
              </a-dropdown>
            </div>
            <!--          右侧内容-->
            <div class="list-content">
              <!--            任务归属人-->
              <div class="list-content-item">
                <span>归属人</span>
                <p>{{ item.executor_name }}</p>
              </div>
              <!--            开始时间-->
              <div class="list-content-item">
                <span>开始时间</span>
                <p>{{ item.start_date }}</p>
              </div>
              <!--            当前状态-->
              <div class="list-content-item" style="color: #909399">
                <span>当前状态</span>
                <p>{{ item.status }}</p>
              </div>
              <!--            进度条-->
              <div class="list-content-item">
                <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />
              </div>
            </div>
          </a-list-item>
        </a-list>
      </a-card>
    </a-spin>
    <a-modal v-model="open" title="确认任务完成" @ok="confirm_ok()">
      <p>任务是否已经完成？</p>
      <p>点击“确认”按钮确认完成任务</p>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
// 使用 this.$dialog 封装 modal 组件
import TaskForm from './modules/TaskForm'
import ReviewForm from '@/views/list/modules/ReviewForm.vue'
import SubmitForm from '@/views/list/modules/SubmitForm.vue'
import AbandonForm from '@/views/list/modules/AbandonForm.vue'
import CancelForm from '@/views/list/modules/CancelForm.vue'
import Info from './components/Info'
import axios from 'axios'
import user from '@/store/modules/user'
import qs from 'qs'
import { notification } from 'ant-design-vue'

let data = []
const openNotificationWithIcon = (type, message, description) => {
  console.log('信息框调用')
  notification[type]({
    message: message,
    description: description
  })
}
export default {
  name: 'StandardList',
  components: {
    TaskForm,
    ReviewForm,
    Info
  },
  data () {
    return {
      // 分页所需信息
      pagination: {
        // 是否开启每页数量切换
        showSizeChanger: true,
        // 是否开启跳转允许
        showQuickJumper: true,
        // 每页显示数量
        pageSize: 10,
        // 每页显示数量切换
        pageSizeOptions: ['10', '20', '30', '50'],
        // 页面总数
        total: 51,
        // 当前页面位置
        current: 1,
        // 页面发生变化时的回调
        onChange: this.onPageChange,
        onShowSizeChange: this.onShowSizeChange
      },
      task_type: '待审核', // 当前查询的任务类别
      data,
      spinning: false,
      status: 'all',
      count: [],
      my_task: [],
      other_task: [],
      all_task: [],
      open: false,
      confirm_status: 1
    }
  },
  mounted () {
    // 这里需要一个单独的后台api，用于查询角色的任务详情。
    // 首先是管理的查询，查询所有任务信息，按照时间排序后返回，需要任务标题、任务详情、执行人、开始时间、当前阶段
    this.request_task(this.task_type, this.pagination.current, this.pagination.pageSize)
  },
  methods: {
    set_task_type (type) {
      console.log(type)
      this.task_type = type
      console.log('task_type改变为:', this.task_type)
      this.request_task(this.task_type, this.pagination.current, this.pagination.pageSize)
    },
    add () {
      this.$dialog(TaskForm,
        // component props
        {
          record: {
            'type': 'add'
          },
          on: {
            ok () {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '发布任务',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    // record就是传递的参数
    edit (record) {
      console.log('record', record)
      // 存入要操作的task_id
      user.state.task_id = record.task_id
      this.$dialog(TaskForm,
        // component props
        {
          record,
          on: {
            ok () {
              console.log('edit ok 回调')
            },
            cancel () {
              console.log('edit cancel 回调')
            },
            close () {
              console.log('edit modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '编辑发布任务',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    review (record) {
      console.log('record', record)
      // 存入要操作的task_id
      user.state.task_id = record.task_id
      this.$dialog(ReviewForm,
        // component props
        {
          record,
          on: {
            ok () {
              console.log('review ok 回调')
            },
            cancel () {
              console.log('review cancel 回调')
            },
            close () {
              console.log('review modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '审核任务',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    cancel (record) {
      console.log('cancel id:', record.task_id)
      user.state.task_id = record.task_id
      this.$dialog(CancelForm,
        // component props
        {
          on: {
            ok () {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '取消任务',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    // 这里判断是修改已放弃内容还是修改已完成内容
    select_to_change (record) {
      console.log(record)
      if (record.status === '待确认') {
        console.log('修改已完成内容')
        this.submit(record)
      } else {
        console.log('修改已放弃内容')
        this.abandon(record)
      }
    },
    submit (record) {
      console.log('record', record)
      // 存入要操作的task_id
      user.state.task_id = record.task_id
      this.$dialog(SubmitForm,
        // component props
        {
          record,
          on: {
            ok () {
              console.log('submit ok 回调')
            },
            cancel () {
              console.log('submit cancel 回调')
            },
            close () {
              console.log('submit modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '修改已完成内容',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    confirm (record) {
      console.log('submit:', record)
      // 存入要操作的task_id
      user.state.task_id = record.task_id
      // 判断任务状态
      if (record.status === '已放弃') {
        this.confirm_status = 0
      }
      this.open = true
    },
    confirm_ok () {
      // 提交发布任务信息
      axios.post(user.state.URL + 'task/confirm',
        qs.stringify({
          // 任务状态，1为完成任务的确认，0为放弃任务的确认
          'confirm_status': this.confirm_status,
          'id': user.state.task_id,
          'job_number': sessionStorage.getItem('username'),
          'job_password': sessionStorage.getItem('password')
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          console.log('response')
          console.log(response)
          if (response.data.result === 200) {
            console.log('success')
            openNotificationWithIcon('success', '信息提示框：', '任务已经确认完成！')
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
    },
    abandon (record) {
      console.log('record', record)
      // 存入要操作的task_id
      user.state.task_id = record.task_id
      this.$dialog(AbandonForm,
        // component props
        {
          // 这里的record是指代的渲染上的内容，若渲染没有用到的内容就不会放到record里
          record,
          on: {
            ok () {
              console.log('submit ok 回调')
            },
            cancel () {
              console.log('submit cancel 回调')
            },
            close () {
              console.log('submit modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '修改已放弃内容',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    // 请求任务列表信息
    request_task (type, current, pageSize) {
      console.log('查询的type：', type)
      console.log('查询的current：', current)
      console.log('查询的pageSize：', pageSize)
      // 加载动画开始
      this.spinning = true
      axios.post(user.state.URL + 'task/computer_book',
      // axios.post('http://10.10.1.45:5000/inspection/book_task',
      // axios.post('http://10.10.1.49:5000/task/computer_book',
        qs.stringify({
          'job_number': sessionStorage.getItem('username'),
          'job_password': sessionStorage.getItem('password'),
          'type': type, // 初始默认查询待审核的内容
          'current': current,
          'pageSize': pageSize
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
        if (response.data.result === 200) {
          this.count = response.data.count
          // 设置page信息
          this.pagination.total = response.data.total
          // 重置页面数据
          data = []
          this.my_task = []
          this.other_task = []
          this.all_task = []
          console.log(',:', response)
          // 获取我的任务列表
          if (response.data.my_task !== '') {
            console.log('my不为空')
            response.data.my_task.forEach((item) => {
              console.log(item)
              let percent = 0
              let avator = ''
              if (item.status === '待审核') {
                percent = 10
                avator = '/task_status/任务状态_待审核.png'
              } else if (item.status === '待完成') {
                percent = 33
                avator = '/task_status/任务状态_待完成.png'
              } else if (item.status === '待确认') {
                percent = 66
                avator = '/task_status/任务状态_待确认.png'
              } else if (item.status === '已完成') {
                percent = 100
                avator = '/task_status/任务状态_已完成.png'
              } else if (item.status === '已放弃') {
                percent = 100
                avator = '/task_status/任务状态_已放弃.png'
              } else if (item.status === '已取消') {
                percent = 100
                avator = '/task_status/任务状态_已取消.png'
              }

              const my = {
                content: item.content,
                avatar: avator,
                details: item.details,
                executor: item.executor,
                executor_id: item.executor_id,
                executor_name: item.executor_name,
                task_id: item.id,
                start_date: item.start_date,
                ratify: item.ratify,
                success_time: item.completion_date,
                success_introduce: item.completion_details,
                difficulty: item.difficulty,
                end_time: item.end_date,
                path: item.path,
                status: item.status,
                progress: {
                  value: percent
                }
              }
              this.my_task.push(my)
              this.all_task.push(my)
            })
          } else {
            console.log('my为空')
          }
          // 获取管辖任务列表
          if (response.data.other_task !== '') {
            console.log('other不为空')
            response.data.other_task.forEach((item) => {
              console.log(item)
              let percent = 0
              let avator = '/task_status/任务状态_已完成.png'
              if (item.status === '待审核') {
                percent = 10
                avator = '/task_status/任务状态_待审核.png'
              } else if (item.status === '待完成') {
                percent = 33
                avator = '/task_status/任务状态_待完成.png'
              } else if (item.status === '待确认') {
                percent = 66
                avator = '/task_status/任务状态_待确认.png'
              } else if (item.status === '已完成') {
                percent = 100
                avator = '/task_status/任务状态_已完成.png'
              } else if (item.status === '已放弃') {
                percent = 100
                avator = '/task_status/任务状态_已放弃.png'
              } else if (item.status === '已取消') {
                percent = 100
                avator = '/task_status/任务状态_已取消.png'
              }

              const other = {
                content: item.content,
                avatar: avator,
                details: item.details,
                executor: item.executor,
                executor_id: item.executor_id,
                executor_name: item.executor_name,
                task_id: item.id,
                start_date: item.start_date,
                ratify: item.ratify,
                success_time: item.completion_date,
                success_introduce: item.completion_details,
                difficulty: item.difficulty,
                end_time: item.end_date,
                path: item.path,
                status: item.status,
                progress: {
                  value: percent
                }
              }
              this.other_task.push(other)
              this.all_task.push(other)
            })
          } else {
            console.log('other为空')
          }
          console.log('my:', this.my_task)
          console.log('other:', this.other_task)
          console.log('all:', this.all_task)
          console.log(this.status)
          // 根据分段框的状态值选择显示的内容
          if (this.status === 'all') {
            this.data = this.all_task
          } else if (this.status === 'my') {
            this.data = this.my_task
          } else {
            this.data = this.other_task
          }
          console.log(this.data)
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
    // 切换显示分段器
    show_task (type) {
      console.log('old:', this.status)
      console.log('new:', type)
      this.status = type
      this.data = ''
      if (type === 'all') {
        this.data = this.all_task
      } else if (type === 'my') {
        this.data = this.my_task
      } else {
        this.data = this.other_task
      }
    },
    onShowSizeChange (current, size) {
      console.log('pagesize!')
      console.log('当前current：', current)
      this.pagination.pageSize = size
      console.log('当前size：', size)
      this.request_task(this.task_type, this.pagination.current, this.pagination.pageSize)
    },
    onPageChange (page, pageSize) {
      this.pagination.current = page
      console.log('当前page：', page)
      console.log('当前pagesize：', pageSize)
      this.request_task(this.task_type, this.pagination.current, this.pagination.pageSize)
    },
    to_details (e) {
      console.log(e)
      this.$router.push({ name: 'Details', params: { task_id: e } })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
        line-height: 20px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
</style>
