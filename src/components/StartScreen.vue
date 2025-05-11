//src/components/StartScreen.vue:
<template>
  <div :class="['container', theme === 'dark' ? 'dark' : '']">
    <h1 class="title">{{ gameTitle }}</h1>
    <p :class="['description', theme === 'dark' ? 'dark' : '']">
      {{ gameDescription }}
    </p>

    <div class="data-source-selector">
      <label for="dataSource" class="selector-label">选择数据源:</label>
      <select id="dataSource" v-model="selectedDataSource" @change="loadGameData" class="selector">
        <option value="data/main.json">主数据 (main.json)</option>
        <option value="data/main copy.json">无法逃离的星期八demo (main copy.json)</option>
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
      selectedDataSource: 'data/main.json', // 默认选中项
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
          speedValue =60;
          break;
        case 'fast':
          speedValue =0;
          break;
        case 'normal':
          speedValue =40;
          break;
      }
      this.$emit('start', this.loadedGameData, speedValue);
    }
  }
};
</script>

<style scoped>
@import "../assets/style.css";


</style>