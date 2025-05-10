//src/App.vue
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
        @restart="restartGame"
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
      manager: new SceneManager(),
      theme: 'light' // or 'dark'
    };
  },
  methods: {
    startGame() {
      this.manager.reset();
      this.currentScene = this.manager.startScene;
      this.gameState = 'play';
    },
    restartGame() {
      this.gameState = 'start';
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
}
</style>
