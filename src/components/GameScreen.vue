<template>
  <div :class="['container', theme === 'dark' ? 'dark' : '']" ref="container">
    <div class="message-list" ref="messageList">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="message"
        :class="msg.type === 'choice' ? 'message-choice' : 'message-text'"
      >
        {{ msg.content }}
      </div>
    </div>

    <div v-if="typingText" class="typing">
      {{ typingText }}
    </div>

    <div v-if="currentAction?.type === 'options'" class="choices">
      <button
        v-for="(opt, index) in currentAction.options"
        :key="index"
        class="btn choice-btn"
        @click="handleOption(opt)"
      >
        {{ opt.text }}
      </button>
    </div>

    <div v-if="currentAction?.type === 'ending'" class="ending">
      <h2 class="ending-title">{{ currentAction.name }}</h2>
      <p class="ending-desc">{{ currentAction.description }}</p>
      <button
        @click="$emit('restart')"
        class="btn return-btn"
      >
        返回开始界面
      </button>
    </div>
  </div>
</template>

<script>
import SceneManager from './SceneManager';

export default {
  props: ['sceneId', 'theme'],
  data() {
    return {
      manager: new SceneManager(),
      currentActionIndex: 0,
      currentActions: [],
      currentAction: null,
      typingText: '',
      messages: [],
      isTyping: false
    };
  },
  watch: {
    sceneId(newId) {
      this.loadScene(newId);
    }
  },
  mounted() {
    this.loadScene(this.sceneId);
  },
  methods: {
    loadScene(sceneId) {
      const scene = this.manager.getScene(sceneId);
      this.currentActions = scene.actions;
      this.currentActionIndex = 0;
      this.typingText = '';
      this.nextAction();
    },
    nextAction() {
      if (this.currentActionIndex >= this.currentActions.length) {
        this.currentAction = null;
        return;
      }

      const action = this.currentActions[this.currentActionIndex];
      this.currentAction = action;

      if (action.type === 'text') {
        this.typingText = '';
        this.isTyping = true;
        this.typeOut(action.content, () => {
          this.messages.push({ content: action.content, type: 'text' });
          this.isTyping = false;
          this.scrollToBottom();
          this.currentActionIndex++;
          this.nextAction();
        });
      } else if (action.type === 'delay') {
        setTimeout(() => {
          this.currentActionIndex++;
          this.nextAction();
        }, action.duration || 1000);
      } else if (action.type === 'options' || action.type === 'ending') {
        // 等待用户选择或显示结局
      }
    },
    typeOut(text, done) {
      let i = 0;
      const speed = 30;
      const interval = setInterval(() => {
        if (i < text.length) {
          this.typingText += text[i];
          i++;
        } else {
          clearInterval(interval);
          this.typingText = ''; 
          done();
        }
      }, speed);
    },
    handleOption(opt) {
      this.messages.push({ content: `→ 你选择了：${opt.text}`, type: 'choice' });
      this.scrollToBottom();
      const next = this.manager.applyEffects(opt.effects);
      this.loadScene(next);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.messageList;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    }
  }
};
</script>

<style scoped>
@import "../assets/style.css";

.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 48px 24px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
  /* overflow-y: auto;
  height: 100vh;
  box-sizing: border-box; */
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  overflow-y: auto;
}

.message {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  transition: background 0.3s ease;
  word-break: break-word;
}

.message-text {
  background-color: #ffffff;
  color: #1c1c1e;
}

.message-choice {
  background-color: #f2f2f7;
  color: #8e8e93;
  font-style: italic;
  font-size: 14px;
  text-align: right;
}

.dark .message-text {
  background-color: #1c1c1e;
  color: #f2f2f7;
}

.dark .message-choice {
  background-color: #2c2c2e;
  color: #c7c7cc;
}

.typing {
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #e5f0ff;
  color: #007aff;
  animation: pulse 1.5s infinite;
}

.dark .typing {
  background-color: #0a84ff;
  color: white;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.choice-btn {
  background-color: #007aff;
  color: white;
  padding: 10px;
  border-radius: 12px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.choice-btn:hover {
  background-color: #005fce;
}

.ending {
  margin-top: 48px;
  text-align: center;
}

.ending-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}

.ending-desc {
  font-size: 16px;
  color: #6e6e73;
}

.return-btn {
  margin-top: 24px;
  background-color: #3a3a3c;
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.return-btn:hover {
  background-color: #2c2c2e;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>
