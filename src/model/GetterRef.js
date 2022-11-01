import Ref from "./Ref";
import StateRef from "./StateRef";

// 暫時廢棄，不使用，套用失敗，還需要更多的詳細測試
// 前面的失敗，有可能是hide的切換，造成重新render，結果前面綁過的setter函式就被記憶體釋放掉了
// 造成setLabel出來會是undefined

// 未來的計劃: 要加一個【延遲cascade】的功能，在Ref.cascade()和StateModel.cascadeSetter()上，
// 才能避免重新render之後，把原本的綁定洗掉的問題
// => nextTick函數

// TagDecisionCondition.jsx會失敗，恐怕也是render把綁定洗掉的問題

class SetterProxy {
    getterRefObj = null;
    setter = null;
    srcKey = '';
    constructor(getterRefObj, setter, srcKey) {
        if (!(getterRefObj instanceof GetterRef)) {
            console.error(`SetterProxy: getterRefObj is not GetterRef`);
            return;
        }
        if (!setter) {
            console.error(`SetterProxy: setter is not exist`);
            return;
        }
        this.getterRefObj = getterRefObj;
        this.setter = setter;
        this.srcKey = srcKey;
    }
    // 生成丟給原本StateRef的react用的setter函式
    getAcceptor() {
        return this.acceptRef.bind(this);
    }

    // 接收從ref過來的參數異動
    acceptRef(val) {
        const outVal = this.getterRefObj.useGetter(val);
        // 輸出經過getter過濾過的參數
        this.setter(outVal);
    }
}

export default class GetterRef extends Ref {
    refObj = null;
    getter = null;
    args = [];

    srcKey = '';
    constructor(refObj, getter, ...args) {
        if (!(refObj instanceof StateRef)) {
            // 目前只支援StateRef，未來有需要再來開放其他的Ref類型
            console.error(`GetterRef: refObj is not StateRef`);
            return;
        }
        if (typeof getter !== 'function') {
            console.error(`GetterRef: getter is not type of function`);
            return;
        }
        super();

        // 自動取得srcKey
        this.srcKey = refObj.getSrcKey();

        this.refObj = refObj;
        this.getter = getter;
        this.args = args;
    }
    // 複寫的函式，要完全支援StateRef-------------------
    // Ref-----------------------------------------
    getValue() {
        return this.refObj.getValue();
    }
    setValue(val) {
        console.error(`GetterRef: not support setValue`);
        // this.refObj.setValue(val);
    }
    cascade(val) {
        console.error(`GetterRef: not support cascade`);
        // this.refObj.cascade(val);
    }
    drive(srcKey, setter) {
        console.error(`GetterRef: not support drive`);
        // this.refObj.drive(srcKey, setter);
    }
    reactive(srcKey, setter) {
        // 將自己的acceptRef塞進去，讓SetterProxy作為仲介，代理setter的參數異動
        return this.refObj.reactive(srcKey, new SetterProxy(this, setter, srcKey).getAcceptor());
        // return this.refObj.reactive(srcKey, setter);
    }

    // 只提供給<SetterProxy>呼叫，用來使用getter
    useGetter(val) {
        // console.log(`useGetter`, this.args[0])
        return this.getter(val, ...this.args);
    }

    // fetchState() {
    //     // console.log(`fetchState stateKey`, this.stateModel.getState(this.stateKey))
    // }

    // // StateRef--------------------------------------------
    // acceptState(val) {
    //     console.error(`GetterRef: not support acceptState`);
    //     // this.refObj.acceptState(val);
    // }
    // fetchActor() {
    //     console.error(`GetterRef: not support fetchActor`);
    //     // return this.refObj.fetchActor();
    // }
    // acceptReactive(val) {
    //     console.error(`GetterRef: not support acceptReactive`);
    //     // this.refObj.acceptReactive(val);
    // }
}