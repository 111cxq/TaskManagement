<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
// import storage from 'store'
// import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  beforeMount () {
    console.log('session,name', sessionStorage.getItem('name'))
    if (sessionStorage.getItem('name') !== null) {
      console.log('1')
      setTimeout(() => {
        this.currentUser = {
          name: sessionStorage.getItem('name')
          // name: '123'
        }
      }, 1500)
    } else {
      console.log('2')
      setTimeout(() => {
        this.currentUser = {
          // name: sessionStorage.getItem('name')
          name: '错误访问请点击这里手动登出！！'
        }
      }, 1500)
      // storage.remove(ACCESS_TOKEN)
      sessionStorage.removeItem('ACCESS_TOKEN')
      this.$router.push('login')
      this.$message('123')
    }
    console.log(this.currentUser)
  }
}
</script>
