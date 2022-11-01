export default class Filter {
    filterKey = ''
    filterArgs = []
    constructor(filterKey, ...args) {
        // console.log('Filter filterKey', filterKey, args)

        if (!this[filterKey]) {
            console.error(`FilterNotExistFilterKey: ${filterKey}`);
            return;
        }

        this.filterKey = filterKey;
        this.filterArgs = args; // <array>
    }
    filt(cellVal) {
        if (!this[this.filterKey]) {
            console.error(`filt function ${this.filterKey} not exist`);
            return;
        }

        // console.log(`filter func: ${this.filterKey} exist`, this[this.filterKey]);
        // v1: filterArgs擺前面
        // return this[this.filterKey](...this.filterArgs, cellVal, row, colIndex);

        // v2: filterArgs移到中間
        return this[this.filterKey](cellVal, ...this.filterArgs);
    }
    filtPrepare(cellVal) {
        const val = this.filt(cellVal);

        return {
            payload: val,
        }
    }
    export(outMode) {
        if (outMode === 'prepare') {
            return this.filtPrepare.bind(this);
        }
        return this.filt.bind(this);
    }
}

export class CustomFilter {
    filt(inputStr) {
        if (!inputStr) {
            return '';
        }
        return inputStr;
    }
}