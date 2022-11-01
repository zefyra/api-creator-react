import Filter from "./Filter";

export default class TextLimitFilter extends Filter {
    text = '';
    halfShapeLimit = 1;
    fullShapeLimit = 1;
    constructor(halfShapeLimit, fullShapeLimit) {
        super('filtTextLimit');
        // halfShapeLimit: 半形限制字數
        // fullShapeLimit: 全形限制字數
        if (!halfShapeLimit) {
            halfShapeLimit = 1;
        }

        if (!fullShapeLimit) {
            fullShapeLimit = Math.floor(halfShapeLimit / 2)
            // 全形預設是半形字數的一半
        }
        this.halfShapeLimit = halfShapeLimit;
        this.fullShapeLimit = fullShapeLimit;

        // this.text = text;
    }
    // 提供給filt()呼叫的接口
    filtTextLimit(cellVal) {
        if (!cellVal) {
            return '';
        }
        // console.log(`filtTextLimit`, this);
        // console.log(`checkHalfShape ${cellVal} ${this.checkHalfShape(cellVal)}`);
        if (this.checkHalfShape(cellVal)) {
            return cellVal.slice(0, this.halfShapeLimit); // 半形限30字元
        }

        return cellVal.slice(0, this.fullShapeLimit); // 全形限15字元
    }
    static checkHalfShape(text, halfShapeLimit) {

        /* str="中文;；ａ"     
            alert(str.match(/[\u0000-\u00ff]/g))     //半形   
            alert(str.match(/[\u4e00-\u9fa5]/g))     //中文   
            alert(str.match(/[\uff00-\uffff]/g))     //全形   */

        // match會輸出一個陣列，把符合全形、或半形的字塞進每個陣列元素

        const checkLen = halfShapeLimit;

        // 檢查前15個字元，只要超過5成是半形，就以半形計算字數
        let str = text.slice(0, checkLen);

        // console.log(`checkLen`, checkLen, str)

        const matchArr = str.match(/[\u0020-\u00ff]/g); //全形 (0020以前是控制字符，不能使用)

        if (!matchArr) {
            return false; // 代表全都是全形
        }

        // console.log(`${summary} matchArr: ${matchArr.length} ${(matchArr.length / summary.length).toFixed(2)}`, matchArr.length / summary.length >= 0.5)

        return matchArr.length / checkLen >= 0.5;
    }

    checkHalfShape(text) {
        return TextLimitFilter.checkHalfShape(text, this.halfShapeLimit);
    }
}