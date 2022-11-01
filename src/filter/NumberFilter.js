import Filter from "filter/Filter";

export default class NumberFilter extends Filter {
    // filterKey = ''
    // filterArgs = []
    // constructor(filterKey, ...args) { // args = []
    //     // console.log(`${filterKey} args`, args);
    //     super(filterKey, ...args);
    //     // if (!this[filterKey]) {
    //     //     console.error(`NumberFilterNotExistFilterKey: ${filterKey}`);
    //     // }

    //     // this.filterKey = filterKey;
    //     // this.filterArgs = args; // <array>
    // }
    // 保留小數位數
    // floatDecimalPlaces(digitLen, num) { // , row, colIndex
    floatDecimalPlaces(num, digitLen) { // , row, colIndex
        if (!num) {
            return '';
        }

        console.log('floatDecimalPlaces', num, digitLen);
        return num.toFixed(digitLen);
    }
    // 整數逗號
    decimalSeparator(text) {
        text = `${text}`;

        return text.replace(/\d+/, function (match, capture) {// $0, $1, $2, $3
            // $0: regExp物件中的原始字串
            // $1: index ，相當於indexOf的回傳結果
            // $2: 被拿來replace的原始字串 ex.相當於errOut.
            // $3: 目前不知道幹嘛用

            // $0: <afeafefa3>
            // $1: 0
            // $2: <afeafefa3>_agentNameI<afeafefa3>nputError
            // $3: undefined

            // console.log(`match=${match}`);

            let nowNumStr = match;
            let newNumStr = '';
            while (nowNumStr && (nowNumStr.length - 3) > 0) {
                // console.log(`nowNumStr=${nowNumStr}`);
                let numPartStr = nowNumStr.slice(nowNumStr.length - 3, nowNumStr.length);

                // console.log(`numPartStr=${numPartStr}`);

                newNumStr = `,${numPartStr}${newNumStr}`;

                // 將最後三位數剔除
                nowNumStr = nowNumStr.slice(0, nowNumStr.length - 3)
            }

            // 代表還有剩餘，把剩餘的也接上
            if (nowNumStr.length !== 0) {
                newNumStr = `${nowNumStr}${newNumStr}`;
            }

            return newNumStr;
        });
    }
    // 轉成百分比
    percent(floatNum) {
        return `${Math.floor(floatNum * 100)}%`;
    }
    // 公制整數 1000 => 1K 、 1,000,000 => 1M
    metricPrefix(intNum) {
        let numStr = `${intNum}`;

        if (numStr.length <= 4) {
            // 未達10000，直接回傳，不轉換
        } else if (numStr.length <= 6) {
            if (numStr.slice(numStr.length - 3, numStr.length) === '000') {
                // 代表後3位都是0，置換成K

                numStr = numStr.slice(0, numStr.length - 3).concat('K');
                return numStr;
            }
        } else if (numStr.length <= 9) {
            if (numStr.slice(numStr.length - 6, numStr.length) === '000000') {
                // 代表後3位都是0，置換成K

                numStr = numStr.slice(0, numStr.length - 6).concat('M');
                return numStr;
            }
        }

        return numStr;
    }
    // 消除開頭的0
    removeLeadingZero(intStr) {
        intStr = intStr.replace(/^0+/, '');
        if (intStr === '') {
            return '0';
        }
        if (intStr[0] === '.') {
            // 代表不小心把0.1111開頭的 0 消掉了
            return `0${intStr}`;
        }
        return intStr;
        // return "014".replace(/^0+/, '')
    }
    // filt(cellVal, row, colIndex) {
    //     // console.log(`filter func: ${this.filterKey} exist`, this[this.filterKey]);
    //     return this[this.filterKey](...this.filterArgs, cellVal, row, colIndex);
    // }
}