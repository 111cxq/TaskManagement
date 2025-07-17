import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 5701

const serverList = (options) => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: tmpKey,
      no: 'No ' + tmpKey,
      description: '这是一段描述',
      callNo: Mock.mock('@integer(1, 999)'),
      status: Mock.mock('@integer(0, 3)'),
      updatedAt: Mock.mock('@datetime'),
      editable: false
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const projects = () => {
  return builder({
    'data': [{
      id: 1,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      title: '测试任务111111111',
      description: '那是一种内在的东西， 他们到达不了，也无法触及的',
      status: 1,
      owner: 'XX部经理 xxx',
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 2,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      title: '测试任务2222222',
      description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
      status: 1,
      owner: 'XX部经理 xxx',
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 3,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      title: '测试任务3333333',
      description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
      status: 1,
      owner: 'XX部总监 xxx',
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 4,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      title: '测试任务44444',
      description: '那时候我只会想自己想要什么，从不想自己拥有什么',
      status: 1,
      owner: 'XX部总监 xxx',
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 5,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      title: '测试任务55555',
      description: '凛冬将至',
      status: 1,
      owner: 'XX部经理 xxx',
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 6,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
      title: '测试任务66666666',
      description: '生命就像一盒巧克力，结果往往出人意料',
      status: 1,
      owner: 'XX部经理 xxx',
      updatedAt: '2018-07-26 00:00:00'
    }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 6,
    'totalCount': 57
  })
}

const activity = () => {
  return builder([{
    id: 1,
    user: {
      nickname: '安妮',
      avatar: 'https://game.gtimg.cn/images/lol/act/img/champion/Annie.png'
    },
    project: {
      name: '巫溪浆站',
      action: '创建',
      event: '2024巫溪第一季度采浆计划'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 2,
    user: {
      nickname: '薇恩',
      avatar: 'https://game.gtimg.cn/images/lol/act/img/champion/Vayne.png'
    },
    project: {
      name: '华兰重庆',
      action: '创建',
      event: '2024维修学习计划'
    },
    time: '2018-08-23 09:35:37'
  },
  {
    id: 3,
    user: {
      nickname: '霞',
      avatar: 'https://game.gtimg.cn/images/lol/act/img/champion/Xayah.png'
    },
    project: {
      name: '华兰重庆',
      action: '创建',
      event: '网信年度巡检计划'
    },
    time: '2017-05-27 00:00:00'
  },
  {
    id: 4,
    user: {
      nickname: '永恩',
      avatar: 'https://game.gtimg.cn/images/lol/act/img/champion/Yone.png'
    },
    project: {
      name: '云阳浆站',
      action: '更新',
      event: '2024云阳第一季度采浆计划'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 5,
    user: {
      nickname: '佐伊',
      avatar: 'https://game.gtimg.cn/images/lol/act/img/champion/Zoe.png'
    },
    project: {
      name: '开州浆站',
      action: '创建',
      event: '2024开州第一季度采浆计划'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 6,
    user: {
      nickname: '洛',
      avatar: 'https://game.gtimg.cn/images/lol/act/img/champion/Rakan.png'
    },
    project: {
      name: '华兰重庆',
      action: '创建',
      event: '2024砍树计划'
    },
    time: '2018-08-23 14:47:00'
  }
  ])
}

const teams = () => {
  return builder([{
    id: 1,
    name: '科学搬砖组',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
  },
  {
    id: 2,
    name: '程序员日常',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
  },
  {
    id: 1,
    name: '设计天团',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
  },
  {
    id: 1,
    name: '中二少女团',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png'
  },
  {
    id: 1,
    name: '骗你学计算机',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png'
  }
  ])
}

const radar = () => {
  return builder([{
    item: '引用',
    '个人': 70,
    '团队': 30,
    '部门': 40
  },
  {
    item: '口碑',
    '个人': 60,
    '团队': 70,
    '部门': 40
  },
  {
    item: '产量',
    '个人': 50,
    '团队': 60,
    '部门': 40
  },
  {
    item: '贡献',
    '个人': 40,
    '团队': 50,
    '部门': 40
  },
  {
    item: '热度',
    '个人': 60,
    '团队': 70,
    '部门': 40
  },
  {
    item: '引用',
    '个人': 70,
    '团队': 50,
    '部门': 40
  }
  ])
}

Mock.mock(/\/service/, 'get', serverList)
Mock.mock(/\/list\/search\/projects/, 'get', projects)
Mock.mock(/\/workplace\/activity/, 'get', activity)
Mock.mock(/\/workplace\/teams/, 'get', teams)
Mock.mock(/\/workplace\/radar/, 'get', radar)
