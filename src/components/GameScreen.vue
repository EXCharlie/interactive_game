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
export default {
  props: ['sceneId', 'theme', 'manager', 'typingSpeed'],
  data() {
    return {
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
    },
  },
  mounted() {
    if (this.manager) {
      this.loadScene(this.sceneId);
    } else {
      console.error("GameScreen: SceneManager prop is missing or null.");
      this.messages.push({ content: "游戏加载失败，请返回开始界面并确保数据已选择。", type: 'text' });
      this.currentAction = { type: 'ending', name: '加载错误', description: '无法初始化游戏场景管理器。' };
    }
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
        // 等待用户选择或显示结局，不需要立即处理下一个 action
      } else if (action.type === 'jump') { // 处理 'jump' action
        if (action.targetSceneId) {
          this.loadScene(action.targetSceneId); // 直接跳转到目标场景
          // loadScene 会重置场景并开始处理新的 actions，因此这里无需再递增 currentActionIndex 或调用 nextAction
        } else {
          console.error("Jump action missing targetSceneId:", action);
          this.currentActionIndex++; // 如果跳转无效，则继续下一个 action
          this.nextAction();
        }
        return; // 停止当前场景的后续 action 处理
      } else if (action.type === 'conditiontext') { // 处理 'conditiontext' action
        if (this.manager && action.condition) {
          // 使用 SceneManager 来评估条件
          if (this.manager.evaluateCondition(action.condition)) {
            // 如果条件为真，则显示文本内容
            this.typingText = '';
            this.isTyping = true;
            if (action.content) {
                this.typeOut(action.content, () => {
                    this.isTyping = false;
                    this.scrollToBottom();
                    this.currentActionIndex++;
                    this.nextAction();
                });
            } else {
                // 如果没有内容，则直接跳过打字效果，处理下一个 action
                this.isTyping = false;
                this.currentActionIndex++;
                this.nextAction();
            }
          } else {
            // 如果条件为假，则跳过内容显示，直接处理下一个 action
            this.currentActionIndex++;
            this.nextAction();
          }
        } else {
          console.error("Conditiontext action missing manager or condition:", action);
          this.currentActionIndex++; // 如果条件文本无效，则继续下一个 action
          this.nextAction();
        }
      }
    },
    typeOut(text, done) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          if (text[i] === '\n') {
            this.messages.push({ content: this.typingText, type: 'text' });
            this.typingText = '';
            this.scrollToBottom();
          } else {
            this.typingText += text[i];
          }
          i++;
        } else {
          this.messages.push({ content: this.typingText, type: 'text' });
            this.typingText = '';
            this.scrollToBottom();
          clearInterval(interval);
          done();
        }
      }, this.typingSpeed);
    },
    handleOption(opt) {
      this.messages.push({ content: `→ 你选择了：${opt.text}`, type: 'choice' });
      this.scrollToBottom();

        const next = this.manager.applyEffects(opt.effects);
        if (next) {
          this.loadScene(next);
        }else{
          this.currentActionIndex++;
          this.nextAction();
        }
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


@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>