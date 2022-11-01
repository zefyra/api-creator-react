import ArrayElementRef from "./ArrayElementRef";
import ReactModel from "../../model/ReactModel";

// 不需要useRef的記憶體空間，儲存位置依賴於其他Model內部的陣列型Model

export default class ListModel extends ReactModel {
    length = 0;
    state = null;

    refMap = {};

    constructor(initArray) {
        super(initArray);
        this.state = Object.assign({}, this.fetchInitialData());
        if (!this.state) {
            console.error(`ListModel: state is null`);
        }
    }

    data(initArray) {
        return {
            model: null, // 用來執行cascade
            array: initArray || [],
        };
    }

    getState(stateKey) {
        // 限制只能存取array
        if (stateKey !== 'array') {
            console.error(`ListModel getState: stateKey \`${stateKey}\` is invalid`)
            return
        }
        return this.state.array;
    }
    setState(stateKey, value) {
        // 限制只能存取array
        if (stateKey !== 'array') {
            console.error(`ListModel setState: stateKey \`${stateKey}\` is invalid`)
            return;
        }

        this.length = value.length;

        this.cascadeSetter(stateKey, value);

        return this.state.array = value;
    }

    // 提供<DecisionMain>呼叫
    map(callback) {
        return this.state.array.map(callback);
    }
    // 提供<DecisionMain>呼叫
    filter(callback) {
        return this.state.array.filter(callback);
    }
    forEach(callback) {
        return this.state.array.forEach(callback);
    }
    push(val) {
        let array = this.state.array;
        array.push(val);
        const newArray = array.map(ele => ele);
        this.setState('array', newArray);
    }
    remove(index) {
        let array = this.state.array;
        array.splice(index, 1);
        this.setState('array', array.map(ele => ele));
    }
    get(index) {
        return this.state.array[index];
    }
    // reactive(stateKey, srcKey, setter) {
    //     // console.log('ListModel reactive',args )
    //     // return super.reactive(...args);
    //     // if (stateKey !== 'model') {
    //     //     return super.reactive(stateKey, srcKey, setter);
    //     // }
    //     return super.reactive(stateKey, srcKey, setter);
    // }
    // -----------------------------------------------

    // // 實作底層的
    // getState(stateKey) {
    //     // console.log(`getState`);
    //     return this.state[stateKey];
    // }
    // // 實作底層的setState
    // setState(stateKey, value, excludeSrcKey) {
    //     // 連動已註冊的setter-------------------------------------
    //     this.cascadeSetter(stateKey, value, excludeSrcKey);
    //     this.state[stateKey] = value;
    // }

    // // 置換掉整個State陣列
    // setArray(stateArray) {
    //     this.setState('array', stateArray.map((arrayElementModel) => {
    //         if (!(arrayElementModel instanceof ArrayElementModel)) {
    //             console.error(`ArrayModel setArray: stateArray element is not instance of ArrayElementModel`)
    //             return null;
    //         }
    //         return arrayElementModel;
    //     }));
    //     // 使用ReactModel連動所有註冊進來的setter
    //     this.cascadeSetter('array', this.arrayStateRef.current);
    // }

    // registArraySetter(srcKey, setter) {
    //     // 利用ReactModel的功能註冊進去
    //     this.registSetter('array', srcKey, setter);
    // }

    // // push item on array start
    // unshift(...objArr) {
    //     let modelArr = this.getState('array');
    //     this.setState('array', objArr.concat(modelArr));
    //     this.cascadeSetter('array', this.getState('array'));
    // }


    // fetchRef(stateKey, srcKey) {
    //     if (!srcKey) {
    //         console.error(`fetchRef: srcKey not exist`)
    //         return;
    //     }
    //     // ref的管理
    //     if (!this.refMap[stateKey]) {
    //         this.refMap[stateKey] = {};
    //     }
    //     if (this.refMap[stateKey][srcKey]) {
    //         // 代表該來源已經取過一次了，直接回傳舊有的Ref物件，避免生成一大堆用不到的
    //         return this.refMap[stateKey][srcKey];
    //     }
    //     // const newRefObj = new Ref(this, stateKey, srcKey);
    //     const newRefObj = new ArrayElementRef(this, stateKey, srcKey);
    //     // 即使同一處重複執行getRef(有可能重新render)，也不會把原本的Ref洗掉，而是會維持原有的物件
    //     this.refMap[stateKey][srcKey] = newRefObj;
    //     return newRefObj;
    // }
}