<template>
  <div class="deepseek-container">
    <div class="header">
      <h1>华兰DeepSeek知识库</h1>
      <p class="subtitle">基于DeepSeek技术的智能问答系统</p>
    </div>
    <div class="chat-container">
      <div class="message-list" ref="messageList">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div class="avatar">
            <img v-if="msg.role === 'user'" src="@/assets/logo.svg" />
            <img v-else src="@/assets/logo.svg" />
          </div>
          <div class="content">
            <div class="text" v-html="msg.text"></div>
            <div v-if="msg.sources && msg.sources.length > 0" class="sources">
              <div class="source" v-for="(source, i) in msg.sources" :key="i">
                <a-icon type="file-text" /> {{ source.title }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="message assistant">
          <div class="avatar">
            <img src="@/assets/logo.svg" />
          </div>
          <div class="content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="input-area">
        <a-textarea
          v-model="userInput"
          placeholder="输入您的问题..."
          :auto-size="{ minRows: 1, maxRows: 4 }"
          @pressEnter="sendMessage"
        />
        <a-button
          type="primary"
          @click="sendMessage"
          :loading="isLoading"
          icon="send"
        >发送</a-button>
      </div>
    </div>
    <div class="dev-log-panel">
      <div class="dev-log-header">开发日志</div>
      <div class="dev-log-content">
        <p>1. 2025.05.26 华兰DEEPSEEK知识库正式发布</p>
        <p>2. 2025.05.28 调整模型参数，提高运算效率</p>
        <p>3. 2025.05.29 样式大改版，优化用户交互体验</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'

export default {
  setup () {
    const userInput = ref('')
    const messages = ref([])
    const isLoading = ref(false)
    const messageList = ref(null)

    const scrollToBottom = () => {
      nextTick(() => {
        if (messageList.value) {
          messageList.value.scrollTop = messageList.value.scrollHeight
        }
      })
    }

    const sendMessage = async () => {
      if (!userInput.value.trim()) return
      const userMessage = {
        role: 'user',
        text: userInput.value,
        sources: []
      }
      messages.value.push(userMessage)
      userInput.value = ''
      scrollToBottom()
      isLoading.value = true
      messages.value.push({
        role: 'assistant',
        text: '',
        sources: []
      })
      const assistantIndex = messages.value.length - 1
      try {
        const apiUrl = 'http://10.10.1.39:3001/api/v1/workspace/hualan-seek/stream-chat'
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 7J0KWYW-ERM4JCJ-Q1Y6GGS-EPRSEZZ',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            message: userMessage.text,
            mode: 'chat',
            stream: true
          })
        })
        if (!response.ok) throw new Error('请求失败')
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value)
          console.log('buffer', buffer)
          // 处理SSE格式数据
          const lines = buffer.split('\n').filter(line => line.trim() !== '')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6) // 去掉"data: "前缀
                // const jsonData = JSON.parse(jsonStr)
                const jsonData = JSON.parse(jsonStr)
                if (jsonData.type === 'textResponseChunk' && jsonData.textResponse) {
                  // 处理包含特殊标记的内容
                  const formattedText = jsonData.textResponse
                    .replace(/### (.*?)\n/g, '<h3>$1</h3>')
                    .replace(/---/g, '<hr>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>')
                  messages.value[assistantIndex].text += formattedText
                  console.log('1', jsonData.textResponse)
                }
                // if (jsonData.close && jsonData.sources) {
                //   messages.value[assistantIndex].sources = jsonData.sources
                // }
                scrollToBottom()
              } catch (e) {
                console.error('解析JSON失败:', e)
              }
            }
          }
          buffer = lines.length > 0 ? '' : buffer
        }
      } catch (error) {
        messages.value[assistantIndex].text = '请求失败: ' + error.message
      } finally {
        isLoading.value = false
        scrollToBottom()
      }
    }

    return {
      userInput,
      messages,
      isLoading,
      messageList,
      sendMessage
    }
  }
}
</script>

<style scoped>
.deepseek-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.chat-container {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.message-list {
  height: 500px;
  overflow-y: auto;
  padding: 20px;
  background-color: #fafafa;
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.message.user {
  justify-content: flex-end;
}

.avatar {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.content {
  max-width: 80%;
}

.message.user .content {
  text-align: right;
}

.text {
  padding: 12px 16px;
  border-radius: 18px;
  line-height: 1.5;
  display: inline-block;
}

.message.user .text {
  background-color: #1890ff;
  color: white;
}

.message.assistant .text {
  background-color: #f0f0f0;
  color: #333;
}

.sources {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.source {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #e8e8e8;
  background-color: white;
}

.input-area >>> .ant-input {
  border: none;
  box-shadow: none;
}

.input-area >>> .ant-input:focus {
  box-shadow: none;
}

.typing-indicator {
  display: flex;
  padding: 12px 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #666;
  border-radius: 50%;
  margin-right: 4px;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.dev-log-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 250px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dev-log-header {
  padding: 10px 15px;
  background-color: #f0f0f0;
  font-weight: bold;
  border-bottom: 1px solid #e8e8e8;
}

.dev-log-content {
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.dev-log-content p {
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 14px;
}

.text h3 {
  font-size: 1.2em;
  margin: 15px 0 10px;
  color: #333;
}

.text hr {
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 15px 0;
}

.text strong {
  font-weight: bold;
}
</style>
