<template>
  <div :class="['container', theme === 'dark' ? 'dark' : '']">
    <h1 class="title">{{ gameTitle }}</h1>
    <p :class="['description', theme === 'dark' ? 'dark' : '']">
      {{ gameDescription }}
    </p>

    <button @click="$emit('start')" class="btn">开始游戏</button>

    <button @click="$emit('toggle-theme')" :class="['btn', 'toggle-btn', theme === 'dark' ? 'dark' : '']">
      切换为 {{ theme === 'light' ? '深色' : '浅色' }}模式
    </button>
  </div>
</template>

<script>
import gameData from '../data/main.json';

export default {
  props: ['theme'],
  data() {
    return {
      gameTitle: gameData.metadata.title,
      gameDescription: gameData.metadata.description
    };
  }
};
</script>

<style scoped>
@import "../assets/style.css";
</style>