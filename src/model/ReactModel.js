
const WARNING_LOG = false;

export default class ReactModel {
    // stateRef = null; // ReactModel不負責資料存取

    initData = {};

    registMap = {};

    // 用來存放上層View的setter----------------
    stateMap = {};
    /* stateMap = {
        <stateKey>: {
            <srcKey>: function (){
                // <setter>
            }
        }
    } */

    constructor(initObj) {
        // 取得上層的data
        const data = this.data(initObj);
        this.initData = data;

        // 檢查初始化data
        // this.validateInitialData(data);

        this.initRegistMap(data);
    }

    // abstract 抽象函式，上層若有用到，則必須override這些函式 --------------------------------------------
    setState(stateKey, value) {
        // 必須由上層實作資料的存取面
        console.error(`ReactModel: ${this.constructor.name} should override setState() function`);
    }
    // mutState(stateKey, value) {
    //     console.error(`ReactModel: ${this.constructor.name} should override mutState() function`);
    // }
    getState(stateKey) {
        // 必須由上層實作資料的存取面
        console.error(`ReactModel: ${this.constructor.name} should override getState() function`);
    }
    fetchRef(stateKey, srcKey) {
        console.error(`ReactModel: ${this.constructor.name} should override fetchRef() function`);
    }
    data() {
        console.error(`ReactModel: ${this.constructor.name} should override data() function`);
        return {};
    }

    // [private]--------------------------------------------
    // 這這裡接收reactive綁定的參數
    actState(stateKey, val) {
        // 這個函式會由fetchActor做綁定
        this.setState(stateKey, val);
    }

    // public --------------------------------------------

    // 3.雙向綁定: 從setter函式輸出，並從回傳一個可輸入的actor函式
    reactive(stateKey, srcKey, setter) {
        if (!this.registMap[stateKey]) {
            console.error(`ReactModel reactive: stateKey \`${stateKey}\` is not in state data, ${this.constructor.name} must add it`);
        }
        if (setter) {
            // 有setter才需要綁上去
            this.registSetter(stateKey, srcKey, setter);
        }
        // console.log(`reactive`, stateKey, srcKey, this.stateMap);
        // this.registSetter(stateKey, srcKey, setter);
        return this.fetchActor(stateKey, srcKey);
    }

    // protected 由子物件實作功能時呼叫-----------------------------------

    // 連動綁定的View setter
    cascadeSetter(stateKey, value, excludeSrcKey) {

        // console.log(`cascadeSetter ${stateKey}`, this.stateMap);
        const setterMap = this.stateMap[stateKey];

        if (!setterMap) {
            // 代表View沒有註冊任何setter，有可能是內部系統欄位
            // WARNING_LOG && console.warn(`ReactModel cascadeViewSetter: stateKey "${stateKey}" not have setterMap`);
            return;
        }

        // 連動所有註冊過的setter
        Object.keys(setterMap).forEach((srcKey) => {
            // console.log(`ReactModel[${this.constructor.name}] cascade <${stateKey}>`);

            // 更新每個srcKey(來源)
            if (setterMap[srcKey]) {
                setterMap[srcKey](value);
                // console.log(`stateKey: ${stateKey} run src`, srcKey);
            }
        });
    }

    // 子物件內部用來驗證用的
    validateStateKey(stateKey) {
        return this.registMap[stateKey] === true;
    }

    // 清除指定stateKey所有註冊的setter
    clearSetter(stateKey) {
        if (!stateKey) {
            // 代表全部清掉

            Object.keys(this.stateMap).forEach((eachStateKey) => {
                this.stateMap[eachStateKey] = null;
            });
            return;
        }
        // 清掉指定欄位的setterMap
        this.stateMap[stateKey] = null;
        return;
    }

    fetchInitialData() {
        return this.initData;
    }

    // private 內部綁定使用---------------------------------------------------

    // 2.單向綁定輸入到Model: 會執行setState
    fetchActor(stateKey, srcKey) {
        // srcKey暫時沒有作用，以後可能會用於管理綁定
        return this.actState.bind(this, stateKey);
    }

    // [protected]
    // 1.單向綁定輸出到View: 註冊後，資料可單向輸出到View
    // ps.會直接與同名的state欄位進行綁定
    // 今後外部禁止外部使用registSetter，外部一律使用reactive代替
    registSetter(stateKey, srcKey, setter) {
        // stateKey: 代表欄位名稱，若更新了該欄位的資料，則有註冊該欄位名稱的所有setter都應該更新
        // srcKey: 代表不同位置的setter

        if (!this.registMap[stateKey]) {
            console.error(`StateModel registSetter: stateKey \`${stateKey}\` is not in state data`);
        }

        if (!this.stateMap[stateKey]) {
            this.stateMap[stateKey] = {}
        }
        this.stateMap[stateKey][srcKey] = setter;
    }

    initRegistMap(data) {
        const vm = this;
        Object.keys(data).forEach((key) => {
            // 註冊進去，用來檢查存進去的欄位名稱是否合法
            vm.registMap[key] = true;
        });
    }
}






// // 取得上層函式名稱進行註冊
// // 'use strict';
// const fnNameMatcher = /([^(]+)@|at ([^(]+) \(/;
// function fnName(str) {
//     const regexResult = fnNameMatcher.exec(str);
//     return regexResult[1] || regexResult[2];
// }

// const logLines = (new Error().stack).split('\n');
// const callerName = fnName(logLines[2]);
// console.log('caller', callerName);
// console.log('caller error', (new Error()).stack);