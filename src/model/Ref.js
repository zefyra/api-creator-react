
// import uniqid from 'uniqid';
// import StateModel from './StateModel';
// import Link from './Link';

// export default class Ref {
//     value = null; // 綁定的數值內容

//     uid = '';
//     stateModel = null;
//     stateKey = '';

//     // private: 不允許外部直接執行actState
//     actState = null;

//     reactiveSetMap = {};

//     // ------------------------------------

//     constructor(stateModel, stateKey, srcKey, type = 'ref') {
//         if (type !== 'ref') {
//             // 代表要以其他模式建構
//             return;
//         }
//         if (!(stateModel instanceof StateModel)) {
//             console.error(`Ref constructor: stateModel is invalid`)
//             return;
//         }
//         // this.uid = uniqid();

//         this.stateModel = stateModel;
//         this.stateKey = stateKey;
//         this.srcKey = srcKey;

//         // 初始化參數
//         this.value = stateModel.getState(stateKey);

//         // 綁定參數
//         this.actState = stateModel.reactive(stateKey, `ref_${srcKey}`, this.acceptState.bind(this));
//     }
//     // [public] 單純取出參數
//     getValue() {
//         return this.value;
//     }
//     // 用來接收StateModel的cascade傳來的參數
//     acceptState(val) {
//         // console.log(`acceptState`, val);
//         this.value = val;

//         this.cascade(val);
//     }
//     // [private]
//     cascade(val, from) {
//         // from: 若為空，則代表從state過來，直接連動所有綁定Ref的位置即可

//         // console.log('cascade', this.reactiveSetMap)

//         // 跑每一個setter做參數的連動
//         Object.keys(this.reactiveSetMap).forEach((srcKey) => {
//             const setter = this.reactiveSetMap[srcKey];

//             // console.log(`run setter ${srcKey}`)
//             setter(val);
//         });

//         if (from === 'reactive') {
//             // 代表是從Ref綁定reactive的位置，逆向連動回來，因此也要同步修改state
//             if (this.actState) {
//                 this.actState(val);
//             }
//         }
//     }
//     // 外部綁定---------------------------------------
//     // [public] 雙向綁定
//     reactive(srcKey, setter) {
//         this.reactiveSetMap[srcKey] = setter; // 將setter註冊進來
//         return this.acceptReactive.bind(this);
//     }
//     // [private] 用來接收使用.reactive()綁定的React組件傳來的參數
//     acceptReactive(val) {
//         this.value = val;
//         this.cascade(val, 'reactive'); // 連動
//     }
//     // [public] 生成一個Ref，能與此Ref連動
//     link() {
//         return new Link(this);
//     }
// }

export default class Ref {
    value = null; // 綁定的數值內容
    reactiveSetMap = {};
    // [public] 單純取出參數
    getValue() {
        return this.value;
    }
    // [protected] // 只允許子物件使用
    setValue(val) {
        this.value = val;
    }
    // [protected]
    cascade(val) { // , excludeMap
        // from: 若為空，則代表從state過來，直接連動所有綁定Ref的位置即可

        // console.log(`${this.srcKey} cascade`, val, this.reactiveSetMap)


        // 跑每一個setter做參數的連動
        Object.keys(this.reactiveSetMap).forEach((srcKey) => {
            const setter = this.reactiveSetMap[srcKey];

            // console.log(`Ref[${this.constructor.name}](${this.srcKey}) cascade <${srcKey}>`);
            // if (excludeMap && excludeMap[srcKey]) {
            //     console.log(`exclude srcKey:`, srcKey);
            //     // 代表在排除清單裡，不做cascade，避免迴力鏢效應
            //     return;
            // }
            // console.log(`run setter ${srcKey}`)
            setter(val);
        });
    }
    // [protected]註冊綁定setter，讓參數被改動時，也會一併呼叫這個setter
    drive(srcKey, setter) {
        // console.log(`drive regist srcKey: ${srcKey}`);

        // console.log(`drive ${srcKey}`, setter);

        this.reactiveSetMap[srcKey] = setter;
    }
    reactive(srcKey, setter) {
        // 未使用，由上層來覆寫
        console.error(`${this.constructor.name} should override reactive`);
    }
    fetchRef() {
        console.error(`${this.constructor.name} should override fetchRef`);
        // 未使用，由上層來實作
    }
}