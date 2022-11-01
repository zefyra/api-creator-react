import ReactModel from 'model/ReactModel';
import { useMutator, useGetter } from 'store';
import PluginControl from './PluginControl';

// Control: 主要功能負責Model、Ref、其他Control的介接

export default class Control {
    className = ''; // 繼承Control的類別名稱

    // 驗證存取權限的設定檔-------------------------------------
    frameMap = {};
    circuitMap = {};
    setupMap = {};
    refMap = {};
    /* refMap: {
        formModal: Modal.name,
    } */
    pluginMap = {};

    // -------------------------------------

    fetchControlFunc = null;
    fetchModelFunc = null;

    dispatchFunc = null;
    carryFunc = null;


    // local storage--------------------------
    localControlMap = {};

    localModelMap = {};

    localRefMap = {}; // 真正儲存ref物件的位置

    localPluginMap = {};

    constructor() {
        this.className = this.constructor.name; // 繼承Control的類別名稱

        if (this.circuit) { // 自動執行上層的circuit()函式，取得存取權限請求
            this.circuitMap = this.circuit() || {};
        }
        if (this.frame) { // 自動執行上層的frame()函式，取得存取權限請求
            this.frameMap = this.frame() || {};
        }
        if (this.ref) {
            this.refMap = this.ref() || {};
        }
        if (this.setup) {
            this.setupMap = this.setup() || {};

            if (this.setupMap['dispatch']) {
                this.dispatchFunc = useMutator();
            }
            if (this.setupMap['carry']) {
                this.carryFunc = useGetter;
            }
        }
        if (this.plugin) {
            this.pluginMap = this.plugin() || {};
        }
    }
    registPlugin(pluginName, pluginObj) {
        if (!(pluginObj instanceof PluginControl)) {
            console.error(`Control registPlugin: pluginObj ${pluginName} is not PluginControl`);
            return;
        }

        if (!this.pluginMap[pluginName]) {
            console.error(`Control registPlugin: pluginName ${pluginName} not exist`);
            return;
        }

        if (typeof this.pluginMap[pluginName] === 'string') {
            // 代表有設定要物件名稱檢查
            const pluginClassName = this.pluginMap[pluginName];
            if (pluginObj.constructor.name !== pluginClassName) {
                console.error(`Control registPlugin: pluginClassName ${pluginClassName} not match`);
                return;
            }
        }

        this.localPluginMap[pluginName] = pluginObj;
    }
    // bindPluginAct(pluginName, funcName, ...args) {
    //     const pluginObj = this.localPluginMap[pluginName];
    //     if (!pluginObj) {
    //         console.error(`bindPluginAct: pluginObj \`${pluginName}\` is lost`);
    //         return;
    //     }
    //     if (!pluginObj[funcName]) {
    //         console.error(`bindPluginAct: function ${funcName} not exist`);
    //         return;
    //     }
    //     return pluginObj[funcName].bind(pluginObj, ...args);
    // }

    // bindEvent 未來要將Event切出來時，改用bindEvent，event本身只是key，
    // 然後event再自己對應到action
    bindAct(funcName, ...args) {
        if (!this) {
            console.error(`Control bindAct: this is lost`);
            return;
        }
        if (!this[funcName]) {
            console.error(`Control bindAct: function ${funcName} not exist`);
            return;
        }
        return this[funcName].bind(this, ...args);
    }

    // [public]用來綁定取得modal的ref
    bindRef(refName) {
        return this.acceptRef.bind(this, refName);
    }
    // [private]
    acceptRef(refName, ref) {
        // console.log(`[${this.constructor.name}]acceptRef`, refName, ref);
        // if (!ref) 代表底層要解除綁定
        if (!this.refMap[refName]) {
            console.error(`[${this.constructor.name}]Control acceptRef: refName \`${refName}\` is not valid`);
            // 代表ref()沒有設定該項目，因此禁止接收
            return;
        }

        const refInfo = this.refMap[refName];
        if (ref != null && typeof refInfo === 'string') {
            // 代表要檢查物件型別
            if (ref.constructor.name !== refInfo) {
                // refInfo: Modal.name
                console.error(`Control acceptRef: ref \`${refName}\` className \`${ref.constructor.name}\` is not match \`${refInfo}\``);
                return;
            }
        }

        // console.log(`acceptRef`, refName, ref);
        this.localRefMap[refName] = ref;
        // console.log(`acceptRef`, this.localRefMap);
    }
    // [public] Component直接註冊
    registRef(refName, ref) {
        this.acceptRef(refName, ref);
    }

    // [public] 外部呼叫來註冊fetchControl
    bindFetchControl(fetchControl) {
        !fetchControl && console.error(`[${this.constructor.name}]Control bindFetchControl: fetchControl not exist`);
        this.fetchControlFunc = fetchControl;
    }
    // 由FetchControl的regist函式呼叫，會自動綁定fetchModel函式
    bindFetchModel(fetchModel) {
        this.fetchModelFunc = fetchModel;
    }

    registControl(controlKey, control) {
        if (!controlKey) {
            console.error(`Control registControl: controlKey is invalid`)
            return;
        }
        if (!(control instanceof Control)) {
            console.error(`Control registControl: control is invalid`)
            return;
        }
        const circuitInfo = this.circuitMap[controlKey];
        if (typeof circuitInfo === 'string') {
            // 代表有設定circuit物件型別: 註冊時，要檢查型別
            const objectClassName = circuitInfo;
            if (control.constructor.name !== objectClassName) {
                console.error(`Control registControl: control is not instance of \`${objectClassName}\``);
                return;
            }
        }

        this.localControlMap[controlKey] = control;
    }

    registModel(modelKey, model) {
        if (!modelKey) {
            console.error(`Control registModel: modelKey is invalid`)
            return;
        }
        if (!(model instanceof ReactModel)) {
            console.error(`Control registModel: model is invalid`)
            return;
        }
        const frameInfo = this.frameMap[modelKey];
        if (typeof frameInfo === 'string') {
            // 代表有設定circuit物件型別: 註冊時，要檢查型別
            const objectClassName = frameInfo;
            if (model.constructor.name !== objectClassName) {
                console.error(`Control registModel: model is not instance of \`${objectClassName}\``);
                return;
            }
        }

        this.localModelMap[modelKey] = model;
    }

    regist(key, obj) {
        // 依照obj的類型，決定要註冊什麼
        if (obj instanceof Control) {
            return this.registControl(key, obj);
        } else if (obj instanceof ReactModel) {
            return this.registModel(key, obj);
        } else {
            if (!obj) {
                console.error(`Control regist: obj is not exist`);
            } else if (!obj.constructor) {
                console.error(`Control regist: obj is not class object`);
            } else {
                console.error(`Control regist: object class name \`${obj.constructor.name}\` is not support`);
            }
        }
    }

    // protected ---------------------------------------------------------

    // 必須要被fetchControl執行regist註冊進去，才能使用
    fetchControl(...args) {
        const controlKey = args[0];

        // 限制跨域的fetchControl存取
        if (!this.circuit) {
            // 提醒沒有設定circuit
            console.error(`[${this.className}] Control fetchControl: circuit not exist, when call \"${controlKey}\"`);
            return null;
        }
        if (!this.circuitMap[controlKey]) {
            console.error(`[${this.className}]: circuit "${controlKey}" is invalid`);
            return null;
        }

        // Local的fetchControl------------------------------------

        if (this.localControlMap[controlKey]) {
            // 代表local有已註冊的control，直接回傳
            return this.localControlMap[controlKey];
        }


        // 全域的fetchControl------------------------------------

        if (!this.fetchControlFunc) {
            console.error('control/Control fetchControl: fetchControlFunc not exist');
            // 代表尚未執行 fetchControl('regist', <key>, <Control>) 或 fc.setup(<Control>);
            return;
        }

        // 由於FetchControl物件在執行this.export()時，會將自己的物件的this掛載上去
        // 因此所有輸出的fetchControl函式都會指到相同的物件實體
        return this.fetchControlFunc(...args);
    }
    fetchModel(...args) {
        // 限制跨域的fetchModel存取
        if (!this.frame) {
            // 提醒沒有設定frame
            console.error(`[${this.className}]: frame not exist`);
            return null;
        }
        const modelKey = args[0];
        if (!this.frameMap[modelKey]) {
            console.error(`[${this.className}]: frame "${modelKey}" is invalid`);
            return null;
        }

        // Local的fetchControl------------------------------------

        if (this.localModelMap[modelKey]) {
            // 代表local有已註冊的model，直接回傳
            return this.localModelMap[modelKey];
        }

        if (!this.fetchModelFunc) {
            console.error('control/Control fetchControl: fetchModelFunc not exist');
            // 代表尚未執行 fetchControl('regist', <key>, <Control>) 或 fc.setup(<Control>);
            return;
        }

        return this.fetchModelFunc(...args);
    }
    fetchRef(refName) {
        // console.log(`[${this.constructor.name}]fetchRef`, refName, this.localRefMap);
        // fetchMode: 提取模式
        // 限制跨域的fetchControl存取
        if (!this.ref) {
            // 提醒沒有設定ref()
            console.error('Control fetchRef: ref() not exist');
            return null;
        }
        if (!this.refMap[refName]) {
            // 代表沒有權限
            console.error(`[${this.className}] Control fetchRef: ref "${refName}" is not valid`);
            return null;
        }

        // Local的fetchControl------------------------------------
        // console.log(' this.localRefMap', this.localRefMap);

        if (this.localRefMap[refName]) {
            // 代表local有已註冊的control，直接回傳
            const refData = this.localRefMap[refName];
            if (!refData) {
                console.error(`[${this.className}] Control fetchRef: ref "${refName}" not exist`);
            }
            return refData;
        }

        console.error(`[${this.className}] Control fetchRef: localRefMap not have refName \`${refName}\``);

        return null;
    }
    fetchRefSafe(refName, safeCallback) {
        if (!this.ref) {
            // 提醒沒有設定ref()
            console.error('Control fetchRef: ref() not exist');
            return null;
        }
        if (!this.refMap[refName]) {
            // 代表沒有權限
            console.error(`[${this.className}] Control fetchRef: ref "${refName}" is not valid`);
            return null;
        }

        // ----------------------------------------------------------

        // 安全提取: 存在ref時才執行safeCallback
        if (this.localRefMap[refName]) {
            safeCallback(this.localRefMap[refName]);
        }
        return;
    }
    fetchPlugin(pluginName) {
        if (!this.pluginMap[pluginName]) {
            console.error(`Control fetchPlugin: pluginName ${pluginName} not exist`);
            return;
        }

        return this.localPluginMap[pluginName];
    }
    dispatch(...args) {
        if (!this.setupMap['dispatch']) {
            console.error(`[${this.constructor.name}] dispatch setup is invalid`);
            return;
        }
        if (!this.dispatchFunc) {
            console.error(`[${this.constructor.name}] dispatchFunc not exist`);
            return;
        }
        this.dispatchFunc(...args);
    }
    carry(storeSelectorFunc) {
        // if (!storeSelectorFunc) {
        //     console.error('storeSelectorFunc not exist');
        //     return null;
        // }
        if (!this.setupMap['carry']) {
            console.error(`[${this.constructor.name}] carry setup is invalid`);
            return;
        }
        if (!this.carryFunc) {
            console.error(`[${this.constructor.name}] carryFunc not exist`);
            return;
        }
        return this.carryFunc(storeSelectorFunc);
    }
    getControlName() {
        return this.className;
    }
}