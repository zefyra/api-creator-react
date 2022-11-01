import ArrayElementRef from "./ArrayElementRef";
import ReactModel from "../../model/ReactModel";

// 依賴於ArrayModel，用於ArrayModel內部的陣列元素

export default class ArrayElementModel extends ReactModel {
    state = null;

    refMap = {};

    constructor(initStateObj) {
        super(initStateObj);
        this.state = Object.assign({}, this.fetchInitialData());
        if (!this.state) {
            console.error(`ArrayElementModel: state is null`);
        }
    }

    // -----------------------------------------------

    // 實作底層的
    getState(stateKey) {
        // console.log(`getState`);
        return this.state[stateKey];
    }
    // 實作底層的setState
    setState(stateKey, value, excludeSrcKey) {
        // 連動已註冊的setter-------------------------------------
        this.cascadeSetter(stateKey, value, excludeSrcKey);

        this.state[stateKey] = value;
    }
    // // 修改底層的參數，但不觸發cascade
    // mutState(stateKey, value) {
    //     this.state[stateKey] = value;
    // }
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

        // const newRefObj = new Ref(this, stateKey, srcKey);
        const newRefObj = new ArrayElementRef(this, stateKey, srcKey);

        // 即使同一處重複執行getRef(有可能重新render)，也不會把原本的Ref洗掉，而是會維持原有的物件
        this.refMap[stateKey][srcKey] = newRefObj;

        return newRefObj;
    }
}