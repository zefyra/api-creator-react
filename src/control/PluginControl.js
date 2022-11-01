import { DirectKeyEnum } from "enum/Behavior";
import Behavior from "./Behavior";

export default class PluginControl {
    behaviorObj = null;
    constructor(behaviorObj) {
        if (!(behaviorObj instanceof Behavior)) {
            console.error(`PluginControl: behaviorObj is not Behavior`);
            return;
        }
        this.behaviorObj = behaviorObj;

        // 將自己的物件註冊進去
        this.behaviorObj.regist(DirectKeyEnum.consumer, this);

        // 檢查是否符合接口
        // this.behaviorObj.checkInterface();
    }
    getState(stateKey) {
        // 所有操作都要透過behavior
        return this.behaviorObj.getState(stateKey);
    }
    setState(stateKey, val) {
        // 所有操作都要透過behavior
        return this.behaviorObj.setState(stateKey, val);
    }
    reactive(stateKey, srcKey, setFunc) {
        // 所有操作都要透過behavior
        return this.behaviorObj.reactive(stateKey, srcKey, setFunc);
    }
    bindAct(funcName, ...args) {
        if (!this) {
            console.error(`PluginControl bindAct: this is lost`);
            return;
        }
        if (!this[funcName]) {
            console.error(`PluginControl bindAct: function ${funcName} not exist`);
            return;
        }
        return this[funcName].bind(this, ...args);
    }
    act(actionKey, ...args) {
        this.behaviorObj.act(actionKey, ...args);
    }
}