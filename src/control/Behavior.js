import { DirectKeyEnum } from "enum/Behavior";

// 負責儲存定義、檢查
export default class Behavior {
    // resourceConfig = {};
    /* {
        data: 'resourceModelName',
        data: {
            default: resourceModelName,
        }
    } */
    // 對接resourceObj的設定檔
    defaultModelKey = null;
    actionFuncNameMap = {};

    // ---------------------------------------------

    directMap = {};
    /* directMap: {
        resource: Control.name, // 資源提供者
        consumer: TablePlugin.name, // 消耗者
    }*/
    dataMap = null;
    /* dataMap: {
        tableData: TableData.name,
        tableHeader: TableHeader.name,
    } */
    actionMap = null;

    // resourceMap = {};
    resourceObj = null;
    // consumerMap = {};
    consumerObj = null;
    constructor(resourceConfig) {

        if (resourceConfig) {
            // this.resourceConfig = resourceConfig;
            if (resourceConfig.defaultModelKey) {
                this.defaultModelKey = resourceConfig.defaultModelKey;
            }
            if (resourceConfig.action) {
                this.actionFuncNameMap = resourceConfig.action;
            }
        }

        if (this.direct) {
            this.directMap = this.direct();
        }
        if (this.data) {
            this.dataMap = this.data();
        }
        if (this.action) {
            this.actionMap = this.action();
        }
    }
    checkDataAccess(stateKey, runFuncName) {
        if (!this.resourceObj) {
            console.error(`Behavior ${runFuncName}: resourceObj not exist`);
            return false;
        }

        if (!this.defaultModelKey) {
            console.error(`Behavior ${runFuncName}: defaultModelKey not exist`);
            return false;
        }

        // 檢查存取的合法性
        if (!this.dataMap[stateKey]) {
            console.error(`Behavior ${runFuncName}: stateKey \`${stateKey}\` invalid`);
            return false;
        }

        return true;
    }
    accessModel(modelType, stateKey, runFuncName) {
        if (!this.checkDataAccess(stateKey, runFuncName)) {
            return;
        }
        let modelKey = this.defaultModelKey; // 目前都是'default'
        // console.log('accessModel    modelKey', modelKey)

        const modelObj = this.resourceObj.fetchModel(modelKey);
        // console.log('accessModel    modelObj', modelObj)
        if (!modelObj) {
            console.error(`accessModel: ${this.resourceObj.constructor.name} model \`${modelKey}\``);
            return;
        }
        return modelObj;
    }
    // 存取Model資料一定要透過這裡
    getState(stateKey) {
        const defaultModel = this.accessModel('default', stateKey, 'getState');
        return defaultModel ? defaultModel.getState(stateKey) : undefined;
        // if (!this.checkDataAccess(stateKey, 'getState')) {
        //     return;
        // }
        // const defaultModel = this.resourceObj.fetchModel(this.defaultModelKey);
        // return defaultModel.getState(stateKey);
    }
    setState(stateKey, value) {
        const defaultModel = this.accessModel('default', stateKey, 'getState');
        defaultModel && defaultModel.setState(stateKey, value);
        // if (!this.checkDataAccess(stateKey, 'setState')) {
        //     return;
        // }
        // const defaultModel = this.resourceObj.fetchModel(this.defaultModelKey);
        // defaultModel.setState(stateKey);
    }
    reactive(stateKey, srcKey, setFunc) {
        const defaultModel = this.accessModel('default', stateKey, 'getState');
        return defaultModel ? defaultModel.reactive(stateKey, srcKey, setFunc) : (() => { });
    }
    act(actionKey, ...args) {
        if (!this.actionMap) {
            console.error(`Behavior act: actionMap not exist`);
            return;
        }
        if (!this.actionMap[actionKey]) { // 代表沒有權限使用action
            console.error(`Behavior act: actionKey \`${actionKey}\` not exist`);
            return;
        }
        if (!this.resourceObj) {
            console.error(`Behavior act: resourceObj not exist`);
            return;
        }

        const funcName = this.actionFuncNameMap[actionKey];
        if (!funcName) {
            console.error(`Behavior act: action funcName not exist`);
            return
        }
        // 呼叫物件中的該函式
        this.resourceObj[funcName].call(this.resourceObj, ...args);
    }

    // setResourceConfig(resourceConfig) {
    //     /* resourceConfig: { // 定義所需消耗的各項資源位置
    //         // data: <frameName>
    //         data: 'tableModel', // 叫他自己去resource的'tableModel'找
    //     } */
    //     if (!resourceConfig) {
    //         console.error(`setResourceConfig fail`);
    //         return;
    //     }

    //     this.resourceConfig = resourceConfig;

    //     // data----------------------------------------------
    //     // const newResourceConfig = {};

    //     // if (typeof resourceConfig.data === 'string') {
    //     //     const resourceModelName = resourceConfig.data;
    //     //     // 代表是指定resource那的某個modelName
    //     //     newResourceConfig.data = {
    //     //         default: resourceModelName,
    //     //     };
    //     // }

    //     // this.resourceConfig = newResourceConfig;

    // }
    // this.behaviorObj.regist(PluginControl.name, this);
    regist(directKey, directObj) {

        // const objName = directObj.constructor.name;

        // if (directKey === DirectKeyEnum.resource) {
        //     this.resourceMap[objName] = directObj
        // } else if (directKey === DirectKeyEnum.consumer) {
        //     this.consumerMap[objName] = directObj
        // }
        if (directKey === DirectKeyEnum.resource) {
            this.resourceObj = directObj;
        } else if (directKey === DirectKeyEnum.consumer) {
            this.consumerObj = directObj;
        }

        return this; // 回傳自己的物件用以接下一項設定
    }

    // fetch

    // // 檢查resource是否有提供所有資源
    // checkInterface() {
    //     // 取得預設資源物件
    //     const resourceKeyList = Object.key(this.resourceMap);
    //     if (!resourceKeyList[0]) {
    //         // 代表尚未註冊任何資源
    //         console.log(`checkInterface: fail, no any resource`);
    //         return;
    //     }
    //     const defaultResourceKey = resourceKeyList[0];
    //     const defaultResourceObj = this.resourceMap[defaultResourceKey];
    //     // 取得資源設定檔
    //     if (this.dataMap) { // 代表有data的需求
    //         if (this.resourceConfig.data) { // 代表有設定data要去哪裡抓
    //             const defaultModelName = this.resourceConfig.data.default;

    //             // 檢查資源是否存在
    //             // defaultResourceObj.fetchModel(defaultModelName);

    //             // defaultModelName
    //         }
    //     }

    //     // 檢查是否有提供資源
    // }
}