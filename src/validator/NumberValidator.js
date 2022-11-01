export default class NumberValidator {
    validateType = ''

    // float
    underDot = 2;

    // integer
    allowNegative = false;

    max = null;
    hasMax = false;
    min = null;
    hasMin = false;
    // numberInterval = false; // 要是true，才會檢查最大最小值
    constructor(validateType, option = {}) {
        this.validateType = validateType;
        /* validateType: 
        float: 預設小數點下2位
        integer: 預設是正整數
        */


        this.option = option;

        if (validateType === 'float') {
            // 可設定小數點下N位
            this.underDot = option.underDot ? option.underDot : 2;
        } else if (validateType === 'integer') {
            // 可設定是否允許負數
            this.allowNegative = option.allowNegative ? option.allowNegative : false;
        }

        if (option.max) {
            this.max = option.max;
            this.hasMax = true;
        }
        if (option.min) {
            this.min = option.min;
            this.hasMin = true;
        }
    }

    validate(val) {
        if (!this[this.validateType]) {
            console.error(`validateType: ${this.validateType} not exist`)
            return null;
        }
        let valid = this[this.validateType](val);
        if (!valid) {
            return valid;
        }
        // 代表格式驗證有過，繼續往下檢查數值
        valid = this.validateNumberInterval(val, valid);
        return valid;
    }
    validateNumberInterval(val, valid) {
        if (this.hasMin) {
            // 代表有需要檢查最小值
            if (val < this.min) {
                // 小於最小值，不通過
                return false;
            }
        }
        if (this.hasMax) {
            // 代表有需要檢查最大值
            if (val > this.max) {
                // 大於最大值，不通過
                return false;
            }
        }

        return valid;
    }
    float(str) {
        // console.log(`flot: ${str}`, new RegExp(`^[0-9]+\\.?[0-9]{0,2}$`).test(str))
        // 浮點數validator
        // return new RegExp(`^[0-9]+\\.?[0-9]{0,2}$`).test(str);
        // 可支持到小數點下8位
        // return new RegExp(`^[0-9]+\\.?[0-9]{0,8}$`).test(str);
        return new RegExp(`^[0-9]+\\.?[0-9]{0,${this.underDot}}$`).test(str);
        // return new RegExp(`^[0-9]+\\.?[0-9]{0,${this.underDot}}$`).test(str);
        // return /^[0-9]+\.?[0-9]{0,2}$/.test(str);
    }
    integer(str) {
        // if (str === '0') {
        //     return true;
        // }
        // console.log('integer', new RegExp(`^[0-9]*$`).test(str))
        return new RegExp(`^[0-9]*$`).test(str);
        // return /^[1-9][0-9]*$/.test(action.payload)
    }
}