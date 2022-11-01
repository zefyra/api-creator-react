import ArrayElementModel from "./ArrayElementModel";
import ReactModel from "model/ReactModel";

// 陣列容器: 需要useRef提供記憶體空間的陣列型容器

// Array容器，可用來放入多個model，讓每個model負責控制各自的component組件
export default class ArrayModel extends ReactModel {
    arrayStateRef = null;

    constructor(arrayStateRef) {
        super();
        if (!arrayStateRef) {
            console.error(`ArrayModel: arrayStateRef is not exist`)
            return;
        }
        this.arrayStateRef = arrayStateRef;

        if (!Array.isArray(this.arrayStateRef.current)) {
            console.error(`ArrayModel: arrayStateRef.current is not array`);
            return;
        }
    }

    data() {
        return {
            array: [],
        };
    }

    getState(stateKey) {
        if (stateKey !== 'array') {
            console.error(`ArrayModel getState: stateKey \`${stateKey}\` is invalid`)
            return
        }
        return this.arrayStateRef.current;
    }
    setState(stateKey, value) {
        if (stateKey !== 'array') {
            console.error(`ArrayModel setState: stateKey \`${stateKey}\` is invalid`)
            return;
        }
        return this.arrayStateRef.current = value;
    }

    // public -----------------------------------------

    // 置換掉整個State陣列
    setArray(stateArray) {
        this.setState('array', stateArray.map((arrayElementModel) => {
            if (!(arrayElementModel instanceof ArrayElementModel)) {
                console.error(`ArrayModel setArray: stateArray element is not instance of ArrayElementModel`)
                return null;
            }
            return arrayElementModel;
        }));
        // 使用ReactModel連動所有註冊進來的setter
        this.cascadeSetter('array', this.arrayStateRef.current);
    }

    // registArraySetter(srcKey, setter) {
    //     // 利用ReactModel的功能註冊進去
    //     this.registSetter('array', srcKey, setter);
    // }

    // push item on array start
    unshift(...objArr) {
        let modelArr = this.getState('array');
        this.setState('array', objArr.concat(modelArr));
        this.cascadeSetter('array', this.getState('array'));
    }
    // private -----------------------------------------
}