// src/components/SceneManager.js
import scenesData from '../data/main.json';

export default class SceneManager {
  constructor() {
    this.scenes = scenesData.scenes;
    this.startScene = scenesData.metadata.startscene;
    this.state = {};
  }

  getScene(sceneId) {
    return this.scenes[sceneId];
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
