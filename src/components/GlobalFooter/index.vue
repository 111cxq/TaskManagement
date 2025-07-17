<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="http://www.hualanbio.com/" target="_blank">华兰生物工程股份有限公司</a>
      <a href="http://10.10.10.10/portal.php" target="_blank">华兰生物工程重庆有限公司</a>
      <a href="http://10.10.9.100:5000/index/" target="_blank">工程部设备管理平台</a>
    </template>
    <template v-slot:copyright>
      <a @click="connect_us()" target="_blank">Design By 严晓豪（前端） && 汪伟（后端）</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  },
  methods: {
    connect_us () {
      this.$router.push({ path: '/account/ConnectUs' })
    }
  }
}
</script>
