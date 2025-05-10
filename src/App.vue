<template>
  <div :class="theme">
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <StartScreen
        v-if="gameState === 'start'"
        :theme="theme"
        @start="startGame"
        @toggle-theme="toggleTheme"
      />
      <GameScreen
        v-if="gameState === 'play'"
        :sceneId="currentScene"
        :theme="theme"
        :manager="manager"
        :typingSpeed="typingSpeed" @restart="restartGame"
      />
    </div>
  </div>
</template>

<script>
import StartScreen from './components/StartScreen.vue';
import GameScreen from './components/GameScreen.vue';
import SceneManager from './components/SceneManager';

export default {
  components: { StartScreen, GameScreen },
  data() {
    return {
      gameState: 'start', // 'start' | 'play'
      currentScene: 'scene1',
      manager: null, // 初始化为 null，在 startGame 时创建
      theme: 'light', // or 'dark'
      typingSpeed: 100 // 新增：默认打字速度，会被 StartScreen 传递的值覆盖
    };
  },
  methods: {
    // 接收 StartScreen 传递过来的 gameData 和 typingSpeed
    startGame(gameData, typingSpeed) {
      if (gameData) {
        this.manager = new SceneManager(gameData); // 使用加载的数据初始化 SceneManager
        this.manager.reset(); // 重置管理器状态
        this.currentScene = this.manager.startScene;
        this.typingSpeed = typingSpeed; // 保存打字速度
        this.gameState = 'play';
      } else {
        console.error("游戏数据未加载，无法开始游戏。");
        // 可以添加用户提示，例如一个Toast或Modal
      }
    },
    restartGame() {
      this.gameState = 'start';
      this.manager = null; // 清空 manager，以便下次开始时重新选择数据源
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    }
  }
};
</script>

<style>
body {
  @apply transition-colors duration-500 ease-in-out;
  /* 确保全局字体设置符合 iOS 风格 */
  font-family: 'PingFang SC', 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>