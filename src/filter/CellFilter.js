
import Filter, { CustomFilter } from "./Filter"


const filterMap = {
    // 範例
    industry: function (industryKey, row, index) {
        const industryMap = {
            catering: '餐飲業',
            warehousing: '倉儲業',
            logistics: '物流業',
            ecommerce: '電商',
            software: '軟體業'
        };

        return industryMap[industryKey];
    },
    // (舊版)
    // 十位數的逗號: 會找出第一個十位數整數，自動加上逗號
    decimalSeparator: function (text) {
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
    },
};

const digitText = (val, len) => {
    let num = `0000000000000000000000000000000000000000000000000000${val}`;

    // console.log('digitText num', num);
    // console.log('digitText num str', num.length - len);
    return num.slice(num.length - len, num.length);
};


const timeFilterMap = {
    time: function (isoString) {
        // isoString: '2022-07-19T09:15:16.859Z'
        const d = new Date(isoString);

        // console.log('time mon', d.getMonth() + 1)
        return `${d.getFullYear()}/${digitText(d.getMonth() + 1, 2)}/${digitText(d.getDate(), 2)}`;
    }
}

export default class CellFilter {

    // Table用來取得欄位的filter函式
    static getFilter(filterKey) {
        if (filterMap[filterKey]) {
            return filterMap[filterKey];
        }
        if (timeFilterMap[filterKey]) {
            return timeFilterMap[filterKey];
        }

        return null; // 代表沒有找到，不使用filter
    }
    static transformCell(headerItem, row, outText) {

        if (!headerItem.transform) {
            return outText;
        }

        // transform: function (row) {
        //     return row.title ? row.title : row.titleDefault;
        // },

        let transformFunc;

        if (typeof headerItem.transform === 'function') {
            transformFunc = headerItem.transform;
        }

        // console.log('transformFunc', transformFunc)
        if (transformFunc) {
            // console.log('transformFunc B', transformFunc)
            return transformFunc(row); // ,new CellInfo // row, headerItem, rowIndex, colIndex
        }

        console.error(`${headerItem.key} not support transform type`, headerItem.transform);
        return outText;
    }
    static filtCell(headerItem, row, outText) {

        if (!headerItem.filter) {
            // 代表沒有設定filter
            return outText;
        }

        let filterFunc;

        if (typeof headerItem.filter === 'function') {
            // 函式型filter
            filterFunc = headerItem.filter;
        } else if (typeof headerItem.filter === 'string') {
            // 字串型filter
            filterFunc = CellFilter.getFilter(headerItem.filter);
        } else if (headerItem.filter instanceof Filter ||
            headerItem.filter instanceof CustomFilter
        ) {
            // 代表是Filter物件
            filterFunc = headerItem.filter.filt.bind(headerItem.filter);
        }

        if (filterFunc) {
            return filterFunc(outText);
        }

        console.error(`${headerItem.key} not support filter type`, headerItem.filter);
        return outText;
    }
}