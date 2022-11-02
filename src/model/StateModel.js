
/* <StateModel>寫法範例

[Model]寫法: 需要自定一個繼承<StateModel>的class

export default class TagSelectorModel extends StateModel {
    data() {
        return {
            tagCategory: null, // 當前選擇的標籤類別
            tagCategoryList: [],
        };
    }

    getter寫法:
        getter觸發器的寫法:
            由於使用到多個參數進行比對，因此必須設定當這些參數刷新時，就必須觸發getter刷新

            1. state.tagList: 使用到Model中的參數，因此必須掛上ref: 'tagList'，
            才會在Model更新時，連帶更新

            寫法[Model - getter]=====================
            tagButtonStatus: new ModelGetter({
                ref: ['tagList', 'selectedTagList'],
            }),
            ===============================


            2. tagItem: 這個參數由View當中傳下來的，因此在View當中必須設定感應器，
            在tagItem改變時，也要同步觸發刷新。

            寫法[View]=====================
            useEffect(function () {
                // 當tagItem改變時，也必須刷新active
                fetchModel('tagSelector').refreshGetter(setterConnect);
            }, [tagItem]);
            ===============================

    getters() {
        function tagButtonStatus(state, tagItem, index) {
            const tagList = state.tagList;

            const existTag = tagList.find((userTagItem) => {
                return tagItem.value === userTagItem.value;
            });

            return existTag ? TagButtonGearEnum.marked : TagButtonGearEnum.noMark;
        }

        return {
            tagButtonStatus: new ModelGetter({
                ref: ['tagList', 'selectedTagList'],
                getter: tagButtonStatus.bind(this),
            }),
        }
    }
}

[Control]寫法: 要有一個繼承<Control>的class

export default class TagSelectorControl extends TableControl {
    aaaa(){
        // 內部可直接呼叫fetchModel來
        this.fetchModel('tagSelector').setState('selectedTagList', newSelectedTagList)
    }
}

[View]寫法: 需要使用setupModel將Model註冊進<FetchControl>物件
是因為有setupModel註冊進去，其他地方才能直接使用fetchModel提取

const fc = new FetchControl(fetchControl);
// 註冊Model
const tagSelectorModel = new TagSelectorModel(useRef(null));
// 在fetchControl註冊Model
fc.setupModel('tagSelector', tagSelectorModel);
*/

import ReactModel from "./ReactModel";
import Ref from "./Ref";
import StateRef from "./StateRef";
import WatchSensor from "./WatchSensor";


const WARNING_LOG = false;

export class SetterConnection {
    getterKey = '';
    constructor({ getterKey, srcKey, setter, args }) {
        this.getterKey = getterKey;
        this.srcKey = srcKey;
        this.setter = setter;
        this.args = args;
    }
    run(getter, state) {
        // console.log(`[${this.getterKey}] ${this.srcKey}`)
        const newValue = getter(state, ...this.args);
        this.setter(newValue);
    }
    getGetterKey() {
        return this.getterKey;
    }
    getSrcKey() {
        return this.srcKey;
    }
}

export class ModelGetter {
    ref = '';
    delay = null;
    getter = null;
    constructor({ ref, delay, getter }) {
        this.ref = ref;
        this.delay = delay;
        this.getter = getter;
    }

    runSetters(stateModelObj, stateKey, newState, getterKey) {
        const vm = this;
        if (!(stateModelObj instanceof StateModel)) {
            console.error(`ModelGetter: stateModelObj is not StateModel`)
            return;
        }
        const getterSetterMap = stateModelObj.getGetterSetterMap();
        const setterMap = getterSetterMap[getterKey];
        if (!setterMap) {
            // 代表該getterKey尚未註冊任何setter，沒有參數需要連動
            WARNING_LOG && console.warn(`when ${stateKey} is triggered, getterKey: ${getterKey} no setterMap`, getterSetterMap);
            return;
        }
        // console.log(`sensor: ${getterKey}`, Object.keys(setterMap).length);
        // 跑每個setterHandle
        Object.keys(setterMap).forEach((srcKey) => {
            const setterConnect = setterMap[srcKey];
            // console.log(`run srcKey: ${srcKey}`);

            setterConnect.run(vm.getter, newState);
        });
    }

    trigger(stateModelObj, stateKey, newState, getterKey) {
        if (!(stateModelObj instanceof StateModel)) {
            console.error(`ModelGetter trigger: stateModelObj is not StateModel`)
            return;
        }
        // if (!(setterConnectObj instanceof SetterConnection)) {
        //     console.error(`ModelGetter trigger: stateModelObj is not StateModel`)
        //     return;
        // }
        const vm = this;
        if (this.delay) {
            // 代表有設定要延遲觸發
            setTimeout(function () {
                vm.runSetters(stateModelObj, stateKey, newState, getterKey)
            }, this.delay);
            return;
        }
        this.runSetters(stateModelObj, stateKey, newState, getterKey)
    }
}




export default class StateModel extends ReactModel {
    className = '';

    // registMap = {};

    // 用來存放上層View的setter----------------
    // stateMap = {};
    /* stateMap = {
        <stateKey>: {
            <srcKey>: function (){
                // <setter>
            }
        }
    } */

    stateRef = null;
    /* stateRef.current = {
        <stateKey>: <value>
    } */

    // 用來提供data()參數
    beforeCreateObj = null;

    // 內部提供的getters-----------------------
    getterMap = {};
    /* getterMap: {
        <getterKey>: {
            ref: <refStateKey>,
            // ref: 'tagCategoryRadioActiveMap', // 代表要綁定的欄位
            getter: <getter>,
            // getter: tagCategoryRadioActive.bind(this),
        }
    } */

    getterSensorMap = {};
    /* getterSensorMap: {
        <refStateKey>: [ <getterKey>, <getterKey>... ]
    } */

    getterSetterMap = {};
    /* getterSetterMap: {
        <getterKey>: {
            <srcKey>: <SetterConnection>
        }
    } */

    // Ref物件管理-------------------------
    refMap = {};
    /* refMap: {
        <stateKey>: { // 'srcSystemOptionList'
            <srcKey>: <Ref> // 'CustomDataPage'
        }
    } */

    // 監控--------------------------------------
    watchMap = {};

    sightMap = {};

    // 過濾--------------------------------------

    filterMap = null; // {};

    constructor(initialStateRef, beforeCreateObj) {
        super(beforeCreateObj);
        this.className = this.constructor.name; // 繼承StateModel的類別名稱
        if (!initialStateRef) {
            console.error(`StateModel constructor: initialStateRef not exist`)
            return;
        }
        this.stateRef = initialStateRef;
        this.beforeCreateObj = beforeCreateObj;

        // 取得上層的data
        const data = this.fetchInitialData();

        // 檢查初始化data
        this.validateInitialData(data);

        // this.initRegistMap(data);

        if (this.getters) {
            const getterMap = this.getters();
            if (typeof getterMap !== 'object') {
                console.error(`getterMap must be object`)
                return;
            }
            this.getterMap = getterMap;
            this.loadGetters(getterMap);
        }

        if (this.watch) {
            // 安裝監控
            const watchMap = this.watch();
            if (typeof watchMap !== 'object') {
                console.error(`watchMap must be object`)
                return;
            }
            this.watchMap = watchMap;

            if (!this.sight) {
                // `stateKey ${stateKey}`
                console.log(`StateModel: ${this.constructor.name} sight not exist`);
                return;
            }
            this.sightMap = this.sight();

            const sightValid = WatchSensor.validateSightMap(this.sightMap);
            if (!sightValid) {
                console.error(`[${this.constructor.name}] StateModel: sight validate fail`);
            }
        }

        if (this.filter) {
            const filterMap = this.filter();
            if (typeof filterMap !== 'object') {
                console.error(`filterMap must be object`)
                return;
            }
            this.filterMap = filterMap;
        }
    }

    // // [private]
    // getInitData() {
    //     // 取得上層的data
    //     if (!this.data) {
    //         console.error(`StateModel constructor: data() not exist`)
    //         return {}; // [Fix]0907 沒有data時，使用空物件
    //     }
    //     return this.data(this.beforeCreateObj);
    // }

    // [private]
    validateInitialData(data) {
        // console.log(`init data`, data)
        if (typeof data !== 'object') {
            console.error(`StateModel constructor: data is not object`, typeof data);
            return;
        }

        if (!this.stateRef.current) {
            // 只有當為null的時候，才會自動存入初始值
            // 否則因為每次重新render都會重新執行一次constructor，會導致每次render都重新以初始值覆蓋
            this.stateRef.current = data; // 將檢查過後的data存入 initialStateRef
        }
    }

    // [private]
    loadGetters(getterMap) {
        // if (!this.getters) {
        //     return;
        // }
        // const getterMap = this.getters();
        // if (typeof getterMap !== 'object') {
        //     console.error(`getterMap must be object`)
        //     return;
        // }

        // this.getterMap = getterMap;


        // const vm = this;

        // const registGetterRef = function (refStateKey, getterKey) {
        //     if (!vm.getterSensorMap[refStateKey]) {
        //         vm.getterSensorMap[refStateKey] = [];
        //     }
        //     vm.getterSensorMap[refStateKey].push(getterKey);
        // }

        // Object.keys(this.getterMap).forEach((getterKey) => {
        //     let ref = this.getterMap[getterKey].ref;
        //     let refArray;
        //     if (typeof ref === 'string') {
        //         refArray = [ref];
        //     } else if (Array.isArray(ref)) {
        //         refArray = ref;
        //     } else {
        //         return;
        //     }
        //     refArray.forEach((refStateKey) => {
        //         registGetterRef(refStateKey, getterKey);
        //     });
        // });
        // console.log('loadGetters', getterMap)

        const vm = this;

        const registGetterRef = function (refStateKey, getterKey) {
            if (!vm.getterSensorMap[refStateKey]) {
                vm.getterSensorMap[refStateKey] = [];
            }
            vm.getterSensorMap[refStateKey].push(getterKey);
        }

        Object.keys(getterMap).forEach((getterKey) => {
            let ref = getterMap[getterKey].ref;
            let refArray;
            if (typeof ref === 'string') {
                refArray = [ref];
            } else if (Array.isArray(ref)) {
                refArray = ref;
            } else {
                return;
            }
            refArray.forEach((refStateKey) => {
                registGetterRef(refStateKey, getterKey);
            });
        });
    }
    /*
        // 1.單向綁定輸出到View: 註冊後，資料可單向輸出到View
        // ps.會直接與同名的state欄位進行綁定
        registSetter(stateKey, srcKey, setter) {
            // stateKey: 代表欄位名稱，若更新了該欄位的資料，則有註冊該欄位名稱的所有setter都應該更新
            // srcKey: 代表不同位置的setter
    
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
    
            if (!this.registMap[stateKey]) {
                console.error(`StateModel registSetter: stateKey \`${stateKey}\` is not in state data`);
            }
    
            if (!this.stateMap[stateKey]) {
                this.stateMap[stateKey] = {}
            }
            this.stateMap[stateKey][srcKey] = setter;
        }
        // 2.單向綁定輸入到Model: 會執行setState
        fetchActor(stateKey, srcKey) {
            // srcKey暫時沒有作用，以後可能會用於管理綁定
            return this.actState.bind(this, stateKey);
        }
        actState(stateKey, val) {
            this.setState(stateKey, val);
        }
        // 3.雙向綁定: 從setter函式輸出，並從回傳一個可輸入的actor函式
        reactive(stateKey, srcKey, setter) {
            if (!this.registMap[stateKey]) {
                console.error(`StateModel reactive: stateKey \`${stateKey}\` is not in state data`);
            }
            this.registSetter(stateKey, srcKey, setter);
            return this.fetchActor(stateKey, srcKey);
        }
        */
    // 4.綁定getter輸出(由Model觸發)
    connectGetter(setterConnect) {
        if (!(setterConnect instanceof SetterConnection)) {
            console.error(`connectGetter: setterConnect is invalid`);
            return;
        }

        // 將 SetterConnection 註冊進去
        const getterKey = setterConnect.getGetterKey();
        const srcKey = setterConnect.getSrcKey();
        if (!this.getterSetterMap[getterKey]) {
            this.getterSetterMap[getterKey] = {};
        }
        this.getterSetterMap[getterKey][srcKey] = setterConnect;
    }
    // 5.刷新getter輸出(由View觸發)

    refreshGetterBySetterConnect(setterConnect) {
        if (!(setterConnect instanceof SetterConnection)) {
            console.error(`connectGetter: setterConnect is invalid`);
            return;
        }

        // 確認該setterConnect已註冊完成
        const getterKey = setterConnect.getGetterKey();
        const srcKey = setterConnect.getSrcKey();

        if (!this.getterSetterMap[getterKey]) {
            console.error(`refreshGetter: getterSetterMap getterKey not exist`);
            return;
        }
        const setterMap = this.getterSetterMap[getterKey];
        if (!setterMap[srcKey]) {
            console.error(`refreshGetter: getterSetterMap setterMap, srcKey not exist`);
            return;
        }

        // 刷新該欄位---------------------------------------

        if (!this.stateRef.current) {
            return;
        }
        const state = this.stateRef.current;
        // 取得getter
        const getterObj = this.getterMap[getterKey];
        if (!getterObj) {
            WARNING_LOG && console.warn(`getterKey: ${getterKey} not have getter`);
            return;
        }

        setterConnect.run(getterObj.getter, state);
    }

    refreshGetterByGetterKey(getterKey) {
        // console.log('refreshGetterByGetterKey', getterKey);
        const setterMap = this.getterSetterMap[getterKey];
        if (!setterMap) {
            WARNING_LOG && console.warn(`setterMap not exist at refreshGetterByGetterKey`);
            return;
        }
        const vm = this;
        Object.keys(setterMap).forEach((srcKey) => {
            const setterConnectObj = setterMap[srcKey];
            vm.refreshGetterBySetterConnect(setterConnectObj);
        });
    }

    refreshGetter(setterConnect) {
        if (setterConnect instanceof SetterConnection) {
            return this.refreshGetterBySetterConnect(setterConnect);
        } else if (typeof setterConnect === 'string') {
            return this.refreshGetterByGetterKey(setterConnect);
        }
        console.error(`setterConnect type not support`);

        /*
        
                if (!(setterConnect instanceof SetterConnection)) {
                    console.error(`connectGetter: setterConnect is invalid`);
                    return;
                }
        
                // 確認該setterConnect已註冊完成
                const getterKey = setterConnect.getGetterKey();
                const srcKey = setterConnect.getSrcKey();
        
                if (!this.getterSetterMap[getterKey]) {
                    console.error(`refreshGetter: getterSetterMap getterKey not exist`);
                    return;
                }
                const setterMap = this.getterSetterMap[getterKey];
                if (!setterMap[srcKey]) {
                    console.error(`refreshGetter: getterSetterMap setterMap, srcKey not exist`);
                    return;
                }
        
                // 刷新該欄位---------------------------------------
        
                if (!this.stateRef.current) {
                    return;
                }
                const state = this.stateRef.current;
                // 取得getter
                const getterObj = this.getterMap[getterKey];
                if (!getterObj) {
                    WARNING_LOG && console.warn(`getterKey: ${getterKey} not have getter`);
                    return;
                }
        
                setterConnect.run(getterObj.getter, state);
                */
    }

    // -----------------------------------------------------
    setState(stateKey, value) {

        // console.log(`setState`, stateKey, value)

        // 檢查欄位名稱是否合法
        if (!this.validateStateKey(stateKey)) {
            console.error(`StateModel setState: stateKey "${stateKey}" is invalid`);
            return;
        }

        if (!this.stateRef) {
            console.error(`StateModel setState: stateRef not exist`);
            return;
        }
        const prevValue = this.stateRef.current[stateKey];

        // 刷新state物件----------------------------------------
        let newState = Object.assign({}, this.stateRef.current);
        newState[stateKey] = value;
        this.stateRef.current = newState;

        // 自動執行watch監控觸發
        this.autoWatch(stateKey, prevValue, value);

        value = this.autoFilt(stateKey, prevValue, value);

        // 連動已註冊的setter-------------------------------------
        this.cascadeSetter(stateKey, value);

        // 連動getter-------------------------------------
        this.cascadeGetters(stateKey, value, newState);
    }
    autoFilt(stateKey, prevValue, value) {
        if (!this.filterMap){
            return value;
        }
        if (!this.filterMap[stateKey]) {
            return value;
        }

        return this.filterMap[stateKey](value);
    }
    autoWatch(stateKey, prevValue, value) {

        const watchFunc = this.watchMap[stateKey];
        if (!watchFunc) {
            // 代表該stateKey沒有安裝監控
            return;
        }

        if (prevValue !== value) {
            // 參數有異動，觸發watch
            watchFunc.call(new WatchSensor(this, stateKey, this.sightMap), value, prevValue);
        }
    }
    getState(stateKey) {
        if (!this.stateRef) {
            console.error(`StateModel getState: stateRef not exist`);
            return;
        }
        return this.stateRef.current[stateKey];
    }
    // 回傳一個可以連動綁定的Ref物件
    fetchRef(stateKey, srcKey) {
        if (!srcKey) {
            console.error(`fetchRef: srcKey not exist`)
            return;
        }
        // ref的管理
        if (!this.refMap[stateKey]) {
            this.refMap[stateKey] = {};
        }
        if (this.refMap[stateKey][srcKey]) {
            // 代表該來源已經取過一次了，直接回傳舊有的Ref物件，避免生成一大堆用不到的
            return this.refMap[stateKey][srcKey];
        }

        // console.log(`fetchRef ${stateKey}`)
        // const newRefObj = new Ref(this, stateKey, srcKey);
        const newRefObj = new StateRef(this, stateKey, srcKey);

        // 即使同一處重複執行getRef(有可能重新render)，也不會把原本的Ref洗掉，而是會維持原有的物件
        this.refMap[stateKey][srcKey] = newRefObj;

        return newRefObj;
    }
    // -----------------------------------------------------------------
    /*
    // 連動綁定的View setter
    cascadeViewSetter(stateKey, value) {
        const setterMap = this.stateMap[stateKey];

        // console.log(`cascadeViewSetter`, this.stateMap, this);

        if (!setterMap) {
            // 代表View沒有註冊任何setter，有可能是內部系統欄位
            WARNING_LOG && console.warn(`StateModel setState: stateKey "${stateKey}" not have setterMap`);
            return;
        }

        // 連動所有註冊過的setter
        Object.keys(setterMap).forEach((srcKey) => {
            // 更新每個srcKey(來源)
            if (setterMap[srcKey]) {
                setterMap[srcKey](value);
                // console.log(`stateKey: ${stateKey} run src`, srcKey);
            }
        });
    }
    */
    // 連動Model裡的getter，以及綁定該getter的View setter
    cascadeGetters(stateKey, value, newState) {
        const vm = this;
        if (!this.getterSensorMap[stateKey]) {
            // 代表沒有註冊要連動的getter
            // console.log('aaaaa');
            return;
        }
        // 跑每個已使用ref註冊的getter
        this.getterSensorMap[stateKey].forEach((getterKey) => {

            // 取得getter----------------------------
            const getterObj = vm.getterMap[getterKey];
            if (!getterObj) {
                // 代表沒找到getter
                // console.log('bbbb');
                return;
            }
            /* getterObj: {
                ref: 'tagCategoryRadioActiveMap', // <refStateKey>
                delay: 1000,
                getter: tagCategoryRadioActive.bind(this), // <getter>,
            } */

            // getterObj.trigger(vm, vm.getterSetterMap, getterKey, stateKey, newState);
            // const setterConnectObj = vm.getSetterConnection(getterKey, stateKey);
            getterObj.trigger(vm, stateKey, newState, getterKey);
        });
    }
    getGetterSetterMap() {
        return this.getterSetterMap;
    }
}