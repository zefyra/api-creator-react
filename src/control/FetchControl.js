import StateModel from 'model/StateModel';
import Control from './Control'

/*
function fetchControl(key, ...args) {
    // console.log(`fetchControl [${key}]`, this);
    if (key === 'confirm') {
        return new ConfirmControl(confirmModalRef);
    } else if (key === 'tip') {
        return new TipControl(tipModalRef);
    } else if (key === 'notify') {
        return new NotifyControl(notifyRef);
    } else if (key === 'regist') {
        const [controlKey, controlObj] = args;
        let controlMap = this;

        // console.log(`regist ${controlKey} controlMap`, controlMap)

        if (!controlMap) {
            controlMap = {};
        }
        // 註冊一個新的Control進來
        controlMap[controlKey] = controlObj;

        return fetchControl.bind(controlMap);
    } else if (this && this[key]) {
        // 回傳內部註冊的control
        return this[key];
    }

    return null;
}*/

export default class FetchControl {
    controlMap = {};
    modelMap = {};

    constructor(fetchControl) {
        if (fetchControl) {
            const fc = fetchControl('entity');
            if (!fc) {
                console.error(`FetchControl constructor: fetchControl entity not exist`);
                return;
            }
            // 手動繼承: 將前一物件的資料繼承下來
            this.controlMap = fc.getControlMap();
            this.modelMap = fc.getModelMap();
        }
    }

    getControlMap() {
        return this.controlMap;
    }
    getModelMap() {
        return this.modelMap;
    }

    setup(controlKey, controlObj) {
        if (typeof controlKey !== 'string') {
            console.error(`<FetchControl> setup: controlKey is not string`);
            return;
        }
        if (controlObj instanceof Control) { // 代表是Control類型的物件
            // 註冊時，即自動輸出一個fetchModel函式到Control物件上
            controlObj.bindFetchModel(this.export('fetchModel'));
            // 自動輸出fetchControl
            controlObj.bindFetchControl(this.export('fetchControl'));
        }

        this.regist(controlKey, controlObj);
        // this.controlMap[controlKey] = controlObj;
    }
    regist(controlKey, controlObj) {
        this.controlMap[controlKey] = controlObj;
    }
    // 將fetchControl的函式生成
    export(type = 'fetchControl') {

        if (type === 'fetchControl') {
            return this.fetchControl.bind(this);
        } else if (type === 'fetchModel') {
            // 將fetchControl的函式生成
            return this.fetchModel.bind(this);
        }

        return null;
    }
    fetchControl(key, ...args) {
        if (key === 'regist') {
            // 兼容舊版的regist方式
            const [controlKey, controlObj] = args;
            this.setup(controlKey, controlObj); // fetchControl('regist')內部會使用setup來註冊，即會自動將fetchControl函式設進Control底層
            return this.export('fetchControl');
        } else if (key === 'entity') {
            // 代表要取出FetchControl物件直接操作
            return this;
        } else if (this.controlMap[key]) {
            // 回傳內部註冊的control
            return this.controlMap[key];
        }
    }
    // Model------------------------------------------------
    setupModel(modelKey, modelObj) {
        if (typeof modelKey !== 'string') {
            console.error(`setupModel: modelKey is not string`);
            return;
        }
        // if (modelObj instanceof StateModel) { // 代表是StateModel類型的物件
        //     // 註冊時，即自動輸出一個fetchModel函式到Control物件上
        //     controlObj.bindFetchModel(this.export('fetchModel'));
        //     // 自動輸出fetchControl
        //     controlObj.bindFetchControl(this.export('fetchControl'));
        // }

        this.modelMap[modelKey] = modelObj;
    }
    // registModel(modelKey, fetchModelObject) {
    //     this.modelMap[modelKey] = fetchModelObject;
    // }
    // 提供輸出的fetchModel函式
    fetchModel(modelKey) {
        if (!this.modelMap[modelKey]) {
            console.error(`<FetchControl> fetchModel: modelKey ${modelKey} not exist in modelMap`);
            return null;
        }
        return this.modelMap[modelKey];
    }
}