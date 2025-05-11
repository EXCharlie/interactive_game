<template>
  <div> 
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
</template>

<script>
import StartScreen from './components/StartScreen.vue';
import GameScreen from './components/GameScreen.vue';
import SceneManager from './components/SceneManager';

export default {
  components: { StartScreen, GameScreen },
  data() {
    return {
      gameState: 'start', 
      currentScene: 'scene1',
      manager: null,
      theme: 'light',
      typingSpeed: 100 
    };
  },
  watch: {
    // 监听 theme 数据的变化
    theme(newTheme) {
      if (newTheme === 'dark') {
        document.body.classList.add('dark-theme'); // 添加 dark-theme 类
      } else {
        document.body.classList.remove('dark-theme'); // 移除 dark-theme 类
      }
    }
  },
  mounted() {
    if (this.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  },
  methods: {
    startGame(gameData, typingSpeed) {
      if (gameData) {
        this.manager = new SceneManager(gameData);
        this.manager.reset();
        this.currentScene = this.manager.startScene;
        this.typingSpeed = typingSpeed;
        this.gameState = 'play';
      } else {
        console.error("游戏数据未加载，无法开始游戏。");
      }
    },
    restartGame() {
      this.gameState = 'start';
      this.manager = null;
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    }
  }
};
</script>

<style>

body.dark-theme {
  background-color: #121214;
}

body {

  font-family: 'PingFang SC', 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

</style>