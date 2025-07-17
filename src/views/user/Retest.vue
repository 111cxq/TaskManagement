<template>
  <div class="container">
    <div class="header">
      <h1>华兰DEEPSEEK知识库</h1>
    </div>
    <div class="chat-box" id="chat-box" v-html="chatContent"></div>
    <div class="input-group">
      <label for="user-input">你的问题</label>
      <input type="text" id="user-input" v-model="userInput" placeholder="请输入你的问题" :disabled="isLoading" />
    </div>
    <button class="button" @click="sendMessage" :disabled="isLoading">发送</button>
    <router-link style="float:right" class="login" :to="{ name: 'login' }">返回管理系统登录</router-link>
    <div class="loading" v-if="isLoading">
      <div class="spinner"></div>
      等待回复...
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const userInput = ref('')
    const chatContent = ref('')
    const isLoading = ref(false)

    const sendMessage = async () => {
      if (!userInput.value) {
        alert('请输入问题')
        return
      }

      isLoading.value = true

      const apiUrl = 'http://10.10.1.39:3001/api/v1/workspace/hualan-seek/stream-chat' // 替换为实际的 API 地址
      const requestBody = {
        'message': userInput.value,
        'mode': 'chat',
        'userId': 'user-test' // 示例用户ID，实际应用中可以动态获取
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 7J0KWYW-ERM4JCJ-Q1Y6GGS-EPRSEZZ', // 替换为实际的 API 密钥
            'accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          throw new Error('请求失败')
        }

        // 处理流式响应
        const reader = response.body.getReader()
        let partialResponse = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // 将流中的数据解码为文本
          const decoder = new TextDecoder('utf-8')
          const chunk = decoder.decode(value, { stream: true })
          partialResponse += chunk

          // 逐步更新聊天内容
          chatContent.value += partialResponse
        }

        // 添加用户消息到聊天框
        chatContent.value = `用户：${userInput.value}<br><br>` + chatContent.value
      } catch (error) {
        alert('请求失败，请稍后再试', error)
      } finally {
        isLoading.value = false
        userInput.value = '' // 清空输入框
      }
    }

    return {
      userInput,
      chatContent,
      isLoading,
      sendMessage
    }
  }
}
</script>
