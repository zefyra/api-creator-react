import Ref from './Ref'


// 有BUG，會無法cascade，暫時禁止使用LinkRef

// 使用StateRef.fetchRef()，會造成後續追蹤困難，禁止使用LinkRef


const defualtFilter = (refVal) => {
    // 此處不使用this，為純函式
    return refVal;
}

// 可指定條件下，與Ref連動
export default class LinkRef extends Ref {
    srcKey = '';
    filter = null;

    actStateRef = null;
    constructor(from, refObj, srcKey, filter) {
        // refObj: <StateRef>
        super();

        if (!from) {
            console.error(`LinkRef constructor: from not exist`);
            return;
        }
        if (!srcKey) {
            console.error(`LinkRef constructor: srcKey not exist`);
            return;
        }
        // if (!filter) {
        //     console.error(`LinkRef constructor: filter not exist`);
        //     return;
        // }
        if (!(refObj instanceof Ref)) {
            console.error(`LinkRef constructor: refObj is not Ref`);
            return;
        }

        if (from === 'stateRef') {
            this.constructFromStateRef(refObj, srcKey, filter)
        } else {
            console.error(`LinkRef constructor: constructor from not support`);
        }
    }
    constructFromStateRef(refObj, srcKey, filter) {
        if (filter) {
            this.filter = filter;
        } else {
            this.filter = defualtFilter;
        }

        this.srcKey = `linkRef_${srcKey}`;

        // 從目標Ref上取得初始value
        this.setValue(this.filter(refObj.getValue()));

        // 與目標的Ref綁定
        this.actStateRef = refObj.reactive(this.srcKey, this.acceptRef.bind(this));
        // `linkRef_${srcKey}`
    }
    // 接收從Ref過來的參數異動
    acceptRef(val) {
        // console.log('acceptRef', val);

        val = this.filter(val);
        // console.log('acceptRef out', val);

        this.setValue(val); // 修改變數

        this.cascade(val); // 連動外部已註冊的setter
    }
    // [public] 提供外部雙向綁定功能
    reactive(srcKey, setter) {
        this.drive(srcKey, setter);
        return this.acceptReactive.bind(this, srcKey);
    }
    // [private] 接收外部reactive綁定傳來的異動
    acceptReactive(srcKey, val) {
        this.setValue(val);
        this.cascade(val); // 連動其他外部綁定

        // ps.是否有辦法排除自己(?)，避免迴力鏢效應

        if (this.actStateRef) {
            this.actStateRef(val);
        }
    }
}