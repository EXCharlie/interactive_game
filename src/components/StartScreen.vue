<template>
  <div :class="['container', theme === 'dark' ? 'dark' : '']">
    <h1 class="title">{{ gameTitle }}</h1>
    <p :class="['description', theme === 'dark' ? 'dark' : '']">
      {{ gameDescription }}
    </p>

    <div class="data-source-selector">
      <label for="dataSource" class="selector-label">选择数据源:</label>
      <select id="dataSource" v-model="selectedDataSource" @change="loadGameData" class="selector">
        <option value="/data/main.json">主数据 (main.json)</option>
        <option value="/data/main copy.json">无法逃离的星期八demo (main copy.json)</option>
      </select>
    </div>

    <div class="typing-speed-selector">
      <label for="typingSpeed" class="selector-label">选择打字速度:</label>
      <select id="typingSpeed" v-model="selectedTypingSpeed" class="selector">
        <option value="slow">慢</option>
        <option value="normal">正常</option>
        <option value="fast">非常快</option>
      </select>
    </div>

    <button @click="startGameCombined" class="btn" :disabled="!loadedGameData">
      开始游戏
    </button>
    <button @click="$emit('toggle-theme')" :class="['btn', 'toggle-btn', theme === 'dark' ? 'dark' : '']">
      切换为 {{ theme === 'light' ? '深色' : '浅色' }}模式
    </button>
  </div>
</template>

<script>
export default {
  props: ['theme'],
  data() {
    return {
      gameTitle: '加载中...', // 初始状态
      gameDescription: '请选择一个数据源...', // 初始状态
      selectedDataSource: '/data/main.json', // 默认选中项
      loadedGameData: null, // 用于存储已加载的游戏数据
      selectedTypingSpeed: 'normal' 
    };
  },
  created() {
    // 组件创建时加载默认数据
    this.loadGameData();
  },
  methods: {
    async loadGameData() {
      this.gameTitle = '加载中...';
      this.gameDescription = '请稍候...';
      this.loadedGameData = null; // 加载新数据前清空
      try {
        // 使用 fetch API 从公共目录加载 JSON 文件
        const response = await fetch(this.selectedDataSource);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gameData = await response.json();
        this.loadedGameData = gameData; // 存储加载的数据
        this.gameTitle = gameData.metadata.title;
        this.gameDescription = gameData.metadata.description;
      } catch (error) {
        console.error("Failed to load game data:", error);
        this.gameTitle = '加载失败';
        this.gameDescription = '无法加载游戏数据。请检查文件路径或网络连接。';
        this.loadedGameData = null; // 加载失败时清空数据
      }
    },
    startGameCombined() { 
      let speedValue;
      switch(this.selectedTypingSpeed){
        case 'slow':
          speedValue =80;
          break;
        case 'fast':
          speedValue =0;
          break;
        case 'normal':
          speedValue =50;
          break;
      }
      this.$emit('start', this.loadedGameData, speedValue);
    }
  }
};
</script>

<style scoped>
@import "../assets/style.css";

/* 新增的数据源选择器样式 */
.data-source-selector {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 280px; /* 限制宽度，符合 iOS 风格 */
  margin-left: auto;
  margin-right: auto;
}

/* 新增的打字速度选择器样式，与数据源选择器类似 */
.typing-speed-selector {
  margin-bottom: 20px; /* 留出一些间距 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 280px; /* 限制宽度，符合 iOS 风格 */
  margin-left: auto;
  margin-right: auto;
}

.selector-label {
  font-size: 16px;
  color: #3a3a3c; /* iOS gray */
  font-weight: 500;
  /* 确保字体符合 iOS 风格 */
  font-family: 'PingFang SC', 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.dark .selector-label {
  color: #c7c7cc; /* iOS dark gray */
}

.selector {
  padding: 10px 15px;
  border-radius: 12px; /* 圆角 */
  border: 1px solid #d1d1d6; /* 柔和的边框 */
  background-color: #f2f2f7; /* 浅色背景 */
  font-size: 16px;
  color: #1c1c1e; /* 深色文字 */
  appearance: none; /* 移除默认选择器箭头 */
  -webkit-appearance: none;
  -moz-appearance: none;
  /* 自定义下拉箭头，使用 SVG data URI */
  background-image: url('data:image/svg+xml;utf8,<svg fill="%238e8e93" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  width: 100%; /* 填充父容器宽度 */
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); /* 柔和的内阴影 */
  /* 确保字体符合 iOS 风格 */
  font-family: 'PingFang SC', 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.dark .selector {
  background-color: #2c2c2e; /* 深色背景 */
  border-color: #3a3a3c; /* 深色边框 */
  color: #f2f2f7; /* 浅色文字 */
  /* 深色模式下的自定义下拉箭头 */
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23c7c7cc" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
}

.selector:focus {
  border-color: #007aff; /* 聚焦时高亮边框 */
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2); /* 柔和的蓝色光晕 */
}

/* 确保 option 元素在深色模式下也有正确的背景和文字颜色 */
.selector option {
  background-color: #f2f2f7;
  color: #1c1c1e;
}

.dark .selector option {
  background-color: #2c2c2e;
  color: #f2f2f7;
}

/* 禁用按钮样式 */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #a8a8a8;
}

.dark .btn:disabled {
  background-color: #505050;
}

</style>