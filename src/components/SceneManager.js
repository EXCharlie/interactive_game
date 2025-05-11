export default class SceneManager {
  constructor(gameData) {
    if (!gameData) {
      console.error("SceneManager: 必须提供 gameData 来初始化场景管理器。");
      this.scenes = {};
      this.startScene = null;
      this.metadata = {};
      this.state = {};
      return;
    }
    
    this.gameData = gameData;
    this.scenes = gameData.scenes;
    this.metadata = gameData.metadata || {};
    this.startScene = this.metadata.startscene || Object.keys(this.scenes)[0];
    this.state = {}; // 初始化游戏状态
  }

  getScene(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene) {
      console.error(`场景 "${sceneId}" 未找到。`);
      return { actions: [{ type: 'text', content: `错误：场景"${sceneId}"未找到。` }], type: 'ending', name: '游戏结束', description: '请联系管理员。' };
    }
    return scene;
  }

  applyEffects(effects) {
    let next = null;
    for (const effect of effects) {
      const { actionType } = effect;
      if (actionType === 'jump') {
        next = effect.targetScene; // 这是选项效果中的跳转
      } else if (actionType === 'update') {
        // 'update' action 的 value 字段无需额外处理，JavaScript 会直接存储其原始类型（字符串、数字、布尔等）
        this.state[effect.property] = effect.value;
      } else if (actionType === 'condition') {
        // 这是选项效果中的条件跳转，与新的 'conditiontext' action 不同
        const test = this.state[effect.test];
        next = test ? effect.trueTarget : effect.falseTarget;
      }
    }
    return next;
  }

  /**
   * 评估条件字符串，支持字符串和数字的比较。
   * 例如: "favorite==='西瓜'", "score > 100", "isComplete"
   * @param {string} conditionString 要评估的条件表达式。
   * @returns {boolean} 条件评估结果。
   */
  evaluateCondition(conditionString) {
      try {
          // 正则表达式用于匹配简单的比较：属性名 运算符 值
          // 例如：`favorite === '西瓜'` 或 `score > 100`
          const regex = /^(\w+)\s*(===|!==|<=|<|>=|>)\s*(.+)$/;
          const match = conditionString.match(regex);

          if (match) {
              const propertyName = match[1];
              const operator = match[2];
              let valueToCompareStr = match[3].trim(); // 值（字符串形式）

              // 判断值的实际类型（字符串、数字、布尔）并进行转换
              let valueToCompare;
              if ((valueToCompareStr.startsWith("'") && valueToCompareStr.endsWith("'")) ||
                  (valueToCompareStr.startsWith('"') && valueToCompareStr.endsWith('"'))) {
                  // 如果是字符串字面量（带引号），去除引号
                  valueToCompare = valueToCompareStr.slice(1, -1);
              } else if (!isNaN(parseFloat(valueToCompareStr)) && isFinite(valueToCompareStr)) {
                  // 如果是数字（并且是有限的数字），转换为浮点数
                  valueToCompare = parseFloat(valueToCompareStr);
              } else if (valueToCompareStr === 'true' || valueToCompareStr === 'false') {
                  // 如果是布尔值字面量
                  valueToCompare = valueToCompareStr === 'true';
              } else {
                  // 其他情况，例如未加引号的字符串，或预期在状态中查找的变量名（虽然不推荐在此处直接处理变量名）
                  valueToCompare = valueToCompareStr;
              }

              const stateValue = this.state[propertyName]; // 获取状态中的属性值

              switch (operator) {
                  case '===': return stateValue === valueToCompare;
                  case '!==': return stateValue !== valueToCompare;
                  case '<=': return stateValue <= valueToCompare;
                  case '<': return stateValue < valueToCompare;
                  case '>=': return stateValue >= valueToCompare;
                  case '>': return stateValue > valueToCompare;
                  default:
                      console.warn(`Unsupported operator in condition: ${operator}`);
                      return false;
              }
          } else {
              // 处理条件只是一个状态属性名的情况，例如 "isComplete"
              // 这将返回该属性的布尔值（如果存在）
              if (typeof this.state[conditionString] !== 'undefined') {
                  return !!this.state[conditionString]; // 将值强制转换为布尔值
              }
              console.warn(`Could not parse condition or unknown state property: ${conditionString}`);
              return false;
          }
      } catch (e) {
          console.error(`Error evaluating condition "${conditionString}":`, e);
          return false;
      }
  }

  reset() {
    this.state = {};
  }
}