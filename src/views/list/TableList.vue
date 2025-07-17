<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!--      新增按钮-->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" disabled="disabled">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <!--      表格主页-->
      <a-table :columns="columns" :data-source="data" bordered>
        <p slot="ope" slot-scope="text, record">
          <a-button type="primary" @click="view(record.name)">查看简历</a-button>
        </p>
      </a-table>
    </a-card>
    <a-modal
      v-model="open"
      :title="preview_title"
      width="100%"
      wrap-class-name="full-modal"
      @ok="previewOK"
    >

      <a-card style="text-align: center">
        <img style="width: 50%;height: 50%" :src="src"/>
      </a-card>
    </a-modal>

  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import JsonData from './static_source.json'

// table的列名
const columns = [
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age
  },
  {
    title: '工龄',
    dataIndex: 'job_age',
    sorter: (a, b) => a.job_age - b.job_age
  },
  {
    title: '学历',
    dataIndex: 'degree'
  },
  {
    title: '部门',
    dataIndex: 'depart',
    filters: [
      {
        text: '网信办',
        value: '网信办'
      },
      {
        text: '工程设备部',
        value: '工程设备部'
      },
      {
        text: '安全环保部',
        value: '安全环保部'
      },
      {
        text: '物料部',
        value: '物料部'
      },
      {
        text: '生产部',
        value: '生产部'
      },
      {
        text: '研发部',
        value: '研发部'
      },
      {
        text: '质量控制部',
        value: '质控部'
      },
      {
        text: '药物警戒部',
        value: '药物警戒部'
      },
      {
        text: '质量保证部',
        value: '质保部'
      },
      {
        text: '财务部',
        value: '财务部'
      },
      {
        text: '人力资源部',
        value: '人力资源部'
      },
      {
        text: '血源部',
        value: '血源部'
      },
      {
        text: '总经办',
        value: '总经办'
      },
      {
        text: '销售部',
        value: '销售部'
      }
    ],
    onFilter: (value, record) => record.depart.includes(value)
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'ope' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      data: [],
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: {
        data: [
          {
            callNo: 947,
            description: '这是一段描述',
            editable: false,
            id: 1,
            key: 1,
            no: 'No 1',
            status: 2,
            updatedAt: '2013-12-17 08:41:05'
          }
        ],
        pageNo: '1',
        pageSize: '10',
        totalCount: '5701',
        totalPage: '571'
      },
      selectedRowKeys: [],
      selectedRows: [],
      // 控制图片展示
      open: false,
      // 图片预览
      src: '',
      // 预览的标题
      preview_title: ''
    }
  },
  created () {
    console.log('axios请求static_source.json文件')
    console.log(JsonData)
    this.data = JsonData
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    // 查看骨干简历
    view (name) {
      const imgName = name + '.png'
      const src = '/post_image/' + imgName
      console.log(src)
      this.open = true
      this.src = src
      this.preview_title = name + '的简历'
    },
    previewOK () {
      this.open = false
    }
  }
}
</script>
