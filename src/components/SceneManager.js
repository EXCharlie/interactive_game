// src/components/SceneManager.js


export default class SceneManager {
  // 构造函数现在必须接收 gameData
  constructor(gameData) {
    if (!gameData) {

      console.error("SceneManager: 必须提供 gameData 来初始化场景管理器。");
      // throw new Error("SceneManager requires gameData for initialization.");
      this.scenes = {};
      this.startScene = null;
      this.metadata = {}; // 确保 metadata 属性存在
      this.state = {};
      return; // 提前返回，防止使用未定义的数据
    }
    
    this.gameData = gameData; // 保存原始 gameData 以备后用
    this.scenes = gameData.scenes;
    // 确保 metadata 存在，并从中获取 startScene
    this.metadata = gameData.metadata || {};
    this.startScene = this.metadata.startscene || Object.keys(this.scenes)[0]; // 提供默认值
    this.state = {};
  }

  getScene(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene) {
      console.error(`场景 "${sceneId}" 未找到。`);
      // 返回一个默认错误场景或抛出错误
      return { actions: [{ type: 'text', content: `错误：场景"${sceneId}"未找到。` }], type: 'ending', name: '游戏结束', description: '请联系管理员。' };
    }
    return scene;
  }

  applyEffects(effects) {
    let next = null;
    for (const effect of effects) {
      const { actionType } = effect;
      if (actionType === 'jump') {
        next = effect.targetScene;
      } else if (actionType === 'update') {
        this.state[effect.property] = effect.value;
      } else if (actionType === 'condition') {
        const test = this.state[effect.test];
        next = test ? effect.trueTarget : effect.falseTarget;
      }
    }
    return next;
  }

  reset() {
    this.state = {};
  }
}