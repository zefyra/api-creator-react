import Ref from './Ref'
import StateModel from './StateModel';
import LinkRef from './LinkRef';
// export default class StateRef extends Ref {
//     constructor(refObj) {
//         // refObj: <Ref>
//         super(null, null, null, 'stateRef');

//         // this.aaa ='bbb'

//     }
// }

export default class StateRef extends Ref {
    // value = null; // 綁定的數值內容

    srcKey = '';

    stateModel = null;
    stateKey = '';

    // private: 不允許外部直接執行actState
    actState = null;

    // reactiveSetMap = {};

    // ------------------------------------

    constructor(stateModel, stateKey, srcKey) {
        super();
        if (!(stateModel instanceof StateModel)) {
            console.error(`Ref constructor: stateModel is invalid`)
            return;
        }
        // console.log(`create StateRef`, stateModel, stateKey, srcKey);

        this.stateModel = stateModel;
        this.stateKey = stateKey;
        this.srcKey = `stateRef_${srcKey}`;

        // 初始化參數
        // v1
        // this.value = stateModel.getState(stateKey);
        this.setValue(stateModel.getState(stateKey));

        // 綁定參數
        this.actState = stateModel.reactive(stateKey, this.srcKey, this.acceptState.bind(this));
    }
    // // [public] 單純取出參數
    // getValue() {
    //     return this.value;
    // }
    // 用來接收StateModel的cascade傳來的參數
    acceptState(val) {
        // console.log(`acceptState`, val);
        // v1
        // this.value = val;
        this.setValue(val);

        this.cascade(val);
    }
    // // [private]
    // cascade(val, from) {
    //     // from: 若為空，則代表從state過來，直接連動所有綁定Ref的位置即可
    //     // console.log('cascade', this.reactiveSetMap)
    //     // 跑每一個setter做參數的連動
    //     Object.keys(this.reactiveSetMap).forEach((srcKey) => {
    //         const setter = this.reactiveSetMap[srcKey];
    //         // console.log(`run setter ${srcKey}`)
    //         setter(val);
    //     });

    //     if (from === 'reactive') {
    //         // 代表是從Ref綁定reactive的位置，逆向連動回來，因此也要同步修改state
    //         if (this.actState) {
    //             this.actState(val);
    //         }
    //     }
    // }
    // 外部綁定---------------------------------------
    // [public] 雙向綁定
    reactive(srcKey, setter) {
        if (setter) {
            this.drive(srcKey, setter); // 輸出綁定
        }
        // return this.acceptReactive.bind(this); // 輸入綁定
        return this.fetchActor();
    }
    // [public] 單向綁定輸入
    fetchActor() {
        return this.acceptReactive.bind(this); // 輸入綁定
    }
    // [private] 用來接收使用.reactive()綁定的React組件傳來的參數
    acceptReactive(val) {
        this.setValue(val);
        this.cascade(val); // 連動

        // 代表是從Ref綁定reactive的位置，逆向連動回來，因此也要同步修改state
        if (this.actState) {
            this.actState(val);
        }
    }
    // [public] 生成一個Ref，能與此Ref連動
    fetchRef(srcKey, getter) {
        // 未來禁止使用LinkRef
        console.error(`<LinkRef> has been deprecated, please use <GetterRef> replace it.`);
        return new LinkRef('stateRef', this, srcKey, getter);
    }

    getSrcKey() {
        return this.srcKey;
    }
}