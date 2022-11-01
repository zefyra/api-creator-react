import ArrayElementModel from "./ArrayElementModel";
import Ref from "model/Ref";

export default class ArrayElementRef extends Ref {

    // private: 不允許外部直接執行actState
    actState = null;

    constructor(stateModel, stateKey, srcKey) {
        if (!(stateModel instanceof ArrayElementModel)) {
            console.error(`Ref constructor: stateModel is invalid`)
            return;
        }
        super();
        this.actState = stateModel.reactive(stateKey, `arrayElementRef_${srcKey}`, this.acceptState.bind(this));

        // 將Ref內部參數初始化，提取來源state的參數
        this.setValue(stateModel.getState(stateKey));
    }
    // 用來接收ArrayElementModel的cascade傳來的參數
    acceptState(val) {
        this.setValue(val);
        this.cascade(val);
    }
    reactive(srcKey, setter) {
        // console.log('ArrayElementRef reactive', srcKey, setter)
        this.drive(srcKey, setter); // 輸出綁定
        return this.fetchActor(srcKey);
        // return this.acceptReactive.bind(this); // 輸入綁定
    }
    // 2.單向綁定輸入到Model: 會執行setState
    fetchActor(srcKey) {
        return this.acceptReactive.bind(this, srcKey); // 輸入綁定
    }
    // [private] 用來接收使用.reactive()綁定的React組件傳來的參數
    acceptReactive(srcKey, val) {
        this.setValue(val);
        this.cascade(val); // 連動getter
        // 已棄用 excludeMap: { [srcKey]: true }

        // 代表是從Ref綁定reactive的位置，逆向連動回來，因此也要同步修改來源
        if (this.actState) {
            this.actState(val);
        }
    }
}