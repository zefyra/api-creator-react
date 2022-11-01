import Filter from "filter/Filter";



function digitText(val, len) {
    let num = `0000000000000000000000000000000000000000000000000000${val}`;

    // console.log('digitText num', num);
    // console.log('digitText num str', num.length - len);
    return num.slice(num.length - len, num.length);
};


export default class TimeFilter extends Filter {
    // filterKey = ''
    // filterArgs = []
    // constructor(filterKey, args = []) {
    //     super();
    //     if (!this[filterKey]) {
    //         console.error(`TimeFilterNotExistFilterKey: ${filterKey}`);
    //     }

    //     this.filterKey = filterKey;
    //     this.filterArgs = args; // <array>
    // }
    // '2022-08-03T04:35:52.936Z' ===> '2022/03/16'

    // ---------------------------------------------
    date(isoTimeStr, defaultOutput = '') {
        if (!isoTimeStr) {
            // 當進來的參數是null或undefined時，顯示預設輸出
            return defaultOutput;
        }
        const d = new Date(isoTimeStr);

        // val ==> <Date>物件
        return `${d.getFullYear()}/${digitText(d.getMonth() + 1, 2)}/${digitText(d.getDate(), 2)}`;
    }
    time(isoTimeStr, defaultOutput = '') {
        if (!isoTimeStr) {
            // 當進來的參數是null或undefined時，顯示預設輸出
            return defaultOutput;
        }
        const d = new Date(isoTimeStr);

        // val ==> <Date>物件
        return `${d.getFullYear()}/${digitText(d.getMonth() + 1, 2)}/${digitText(d.getDate(), 2)} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }
    clock(isoTimeStr, defaultOutput = '') {
        if (!isoTimeStr) {
            // 當進來的參數是null或undefined時，顯示預設輸出
            return defaultOutput;
        }
        const d = new Date(isoTimeStr);

        return `${d.getHours()}:${d.getMinutes()}`;
    }
    isoString(d) {
        if (typeof d === 'object') {
            return d.toISOString();
        } else if (typeof d === 'string') {
            return d;
        }
        return '';
    }
    // filt(cellVal, row, colIndex) {
    //     // console.log(`filter func: ${this.filterKey} exist`, this[this.filterKey]);
    //     return this[this.filterKey](...this.filterArgs, cellVal, row, colIndex);
    // }
}