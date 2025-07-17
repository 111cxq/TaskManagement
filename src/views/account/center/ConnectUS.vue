<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="'https://game.gtimg.cn/images/lol/act/img/champion/Yuumi.png'">
            </div>
            <div class="username">严晓豪</div>
            <div class="bio">有我有你，一鼓作气</div>
          </div>
          <div class="account-center-detail">
            <p>
              <i class="title"></i>前端工程师
            </p>
            <p>
              <i class="group"></i>华兰生物－重庆公司－网信办
            </p>
            <p>
              <i class="address"></i>
              <span>重庆市</span>
              <span>涪陵区</span>
            </p>
            <p>
              <i class="bi bi-phone"></i>
              <span>189 9688 7541</span>
            </p>
          </div>
          <a-divider/>

          <div class="account-center-tags">
            <div class="tagsTitle">标签</div>
            <div>
              <template v-for="(tag, index) in tags_yxh">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                  <a-tag
                    :key="tag"
                    :closable="index !== 0"
                    :close="() => handleTagClose_yxh(tag)"
                  >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                </a-tooltip>
                <a-tag
                  v-else
                  :key="tag"
                  :closable="index !== 0"
                  :close="() => handleTagClose_yxh(tag)"
                >{{ tag }}</a-tag>
              </template>
            </div>
          </div>
          <a-divider :dashed="true"/>

          <div class="account-center-team">
            <div class="teamTitle">团队</div>
            <a-spin :spinning="teamSpinning">
              <div class="members">
                <a-row>
                  <a-col :span="12" v-for="(item, index) in teams" :key="index">
                    <a>
                      <a-avatar size="small" :src="item.avatar"/>
                      <span class="member">{{ item.name }}</span>
                    </a>
                  </a-col>
                </a-row>
              </div>
            </a-spin>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="'https://game.gtimg.cn/images/lol/act/img/champion/Teemo.png'">
            </div>
            <div class="username">汪伟</div>
            <div class="bio">看万本书不如行百里路</div>
          </div>
          <div class="account-center-detail">
            <p>
              <i class="title"></i>后端工程师&自控工程师
            </p>
            <p>
              <i class="group"></i>华兰生物－重庆公司－网信办
            </p>
            <p>
              <i class="address"></i>
              <span>重庆市</span>
              <span>涪陵区</span>
            </p>
            <p>
              <i class="ion-iphone"></i>
              <span>177 4995 8499</span>
            </p>
          </div>
          <a-divider/>

          <div class="account-center-tags">
            <div class="tagsTitle">标签</div>
            <div>
              <template v-for="(tag, index) in tags_ww">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                  <a-tag
                    :key="tag"
                    :closable="index !== 0"
                    :close="() => handleTagClose_ww(tag)"
                  >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                </a-tooltip>
                <a-tag
                  v-else
                  :key="tag"
                  :closable="index !== 0"
                  :close="() => handleTagClose_ww(tag)"
                >{{ tag }}</a-tag>
              </template>
            </div>
          </div>
          <a-divider :dashed="true"/>

          <div class="account-center-team">
            <div class="teamTitle">团队</div>
            <a-spin :spinning="teamSpinning">
              <div class="members">
                <a-row>
                  <a-col :span="12" v-for="(item, index) in teams" :key="index">
                    <a>
                      <a-avatar size="small" :src="item.avatar"/>
                      <span class="member">{{ item.name }}</span>
                    </a>
                  </a-col>
                </a-row>
              </div>
            </a-spin>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import { AppPage, ArticlePage, ProjectPage } from './page'

export default {
  components: {
    RouteView,
    PageView,
    AppPage,
    ArticlePage,
    ProjectPage
  },
  data () {
    return {
      tags_yxh: ['很有想法的', '专注设计', '摸鱼达人', '想涨薪', '有动力的'],
      tags_ww: ['很有想法的', '专注设计', '逻辑缜密', '暴富', '海纳百川'],

      tagInputVisible: false,
      tagInputValue: '',

      teams: [],
      teamSpinning: true,

      noTitleKey: 'app'
    }
  },
  computed: {

  },
  mounted () {
    this.getTeams()
  },
  methods: {
    getTeams () {
      setTimeout(() => {
        this.teams = [{
            avatar: 'https://www.dmoe.cc/random.php',
            name: '软件开发团'
          }]
        this.teamSpinning = false
      }, 1000)
    },

    handleTagClose_yxh (removeTag) {
      this.tags_yxh = this.tags_yxh.filter(tag => tag !== removeTag)
    },
    handleTagClose_ww (removeTag) {
      this.tags_ww = this.tags_ww.filter(tag => tag !== removeTag)
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>
