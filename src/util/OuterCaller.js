
// 使用方法
// 1.該組件所有DOM都必須加相同的qid做參數辨識
// 2.該組件所有DOM都必須阻擋泡泡事件
// 3.加一個隱藏的<OuterInvoker>物件 (module/outerInvoker)

// const callMap = {};
// const callMap = new Map();

class Awaker {
    callMap = new Map()
    // constructor() {

    // }
    set(key, obj) {
        this.callMap.set(key, obj);
    }
    get(key) {
        return this.callMap.get(key);
    }
    forEach(func) {
        // this.callMap.forEach(function (aaa, bbb) {
        //     console.log('ccccc', aaa, bbb);
        // });
        this.callMap.forEach(func);
    }
}

const callMap = new Awaker();


// 由這個全域的觸發器，負責
document.addEventListener("click", function (e) {
    // console.log('OuterCaller click outter', e.target);
    // console.log('callMap', callMap)

    callMap.forEach((outerCallerObj, qid) => {
        // console.log('outerCallerObj key:', qid, outerCallerObj);
        outerCallerObj.handleOuterClick(e);
    });

}, false); // capture = false 避免註冊2個

export default class OuterCaller {

    // callMap = {};
    // callIndex = 0;

    qid = 0;

    componentRef = null;
    callFunc = null;

    constructor(qid) {
        this.qid = qid;
    }

    registOuterCall(componentRef, func) {

        this.componentRef = componentRef;
        this.callFunc = func;

        if (!callMap.get(this.qid)) {
            // callMap[this.qid] = this;
            callMap.set(this.qid, this);
        } else {
            // 只有在<React.StrictMode>底下，因為會 render 2次時，才會出現
            console.warn(`qid: ${this.qid} has regist in callMap`, '\n(<React.StrictMode> only)');
        }

        // const datePickerPanelDom = document.getElementById(`datePicker_${this.qid}`);
        // datePickerPanelDom.addEventListener('click', function (e) {
        //     e.stopPropagation();
        // });
    }

    handleOuterClick(e) {
        // console.log('handleOuterClick', this.qid);

        this.callFunc(e);
    }
}




export const OuterReminder = class OuterReminder {

    // callMap = {};
    // callIndex = 0;

    qid = 0;
    getShow = null;
    setShow = null;

    componentRef = null;
    callFunc = null;

    constructor(qid, getShow, setShow) {
        // console.log('getShow', getShow)
        // console.log(`regist outer call`, qid);

        this.qid = qid;
        this.getShow = getShow;
        this.setShow = setShow;
        // 若沒有設定nowShow，則設為true，讓他每次都call handleOuterClick

        // 自動註冊進callMap
        if (!callMap.get(this.qid)) {
            callMap.set(this.qid, this);
        } else {
            // 只有在<React.StrictMode>底下，因為會 render 2次時，才會出現
            console.warn(`qid: ${this.qid} has regist in callMap`, '\n(<React.StrictMode> only)');
        }
    }

    // registOuterCall(componentRef, func) {

    //     this.componentRef = componentRef;
    //     this.callFunc = func;

    //     if (!callMap.get(this.qid)) {

    //         // console.log(`registOuterCall regist qid`, this.qid, this);

    //         // callMap[this.qid] = this;
    //         callMap.set(this.qid, this);
    //     } else {
    //         // 只有在<React.StrictMode>底下，因為會 render 2次時，才會出現
    //         console.warn(`qid: ${this.qid} has regist in callMap`, '\n(<React.StrictMode> only)');
    //     }
    // }

    outerCall(e) {
        const targetQid = e.target.getAttribute('qid');
        // console.log(`OuterReminder-${this.qid} outerCall targetQid: ${targetQid}`);
        if (targetQid === this.qid) {
            // 代表點到自己的區塊，不作用
            return;
        }
        // setDropdownShow(false);
        // console.log(`OuterCaller-${this.qid} outerCall`, this.setShow);

        // console.log(`OuterCaller-${this.qid} outerCall`, callMap);

        if (!this.setShow) {
            console.error(`OuterCaller-${this.qid} callFunc not exist`);
            return;
        }

        this.setShow(false);
    }

    handleOuterClick(e) {
        // console.log(`OuterReminder-${this.qid} handleOuterClick`);

        // 判斷當下是否有在顯示，有在顯示才呼叫
        // if (this.getShow) {
        //     const show = this.getShow();
        //     // console.log(`OuterReminder-${this.qid} show`, show);
        //     if (show) {
        //         if (this.callFunc) {
        //             this.callFunc(e);
        //         }
        //     }
        // } else {
        //     // 沒使用getShow: 因為無法取得當前的即時show參數，因此直接呼叫
        //     if (this.callFunc) {
        //         this.callFunc(e);
        //     }
        // }

        // if (!this.callFunc) {
        //     console.error(`OuterCaller-${this.qid} callFunc not exist`);
        //     return;
        // }

        if (!this.getShow) {
            console.error(`OuterCaller-${this.qid} getShow not exist`);
            return this.outerCall(e);
        }

        // console.log(`OuterReminder-${this.qid} getShow`, this.getShow);
        const show = this.getShow();

        // console.log(`OuterReminder-${this.qid} show`, show);

        if (!show) {
            // 代表當下沒再顯示，不需要呼叫
            return;
        }

        this.outerCall(e);
    }

    updateShowState(getShow, setShow) {
        this.getShow = getShow;
        this.setShow = setShow;
    }
}