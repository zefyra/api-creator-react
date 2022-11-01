// import Filter from "filter/Filter";
import SuspenseFilter from "./SuspenseFilter";
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js


export default class IndustryFilter extends SuspenseFilter {
    industryMap = {};
    apiRes = null;

    constructor(...args) {
        // 將指定要執行的函式名稱註冊進去

        // super(<args>, <workFuncName>, <outFuncName>)
        super(args, 'handleLoadIndustry', 'outputIndustryApiRes');
    }

    industry(industryId) {
        return this.industryMap[industryId] || '';
    }

    buildIndustryMapFromApiRes(apiRes) {
        /* apiRes = {
            "count": 3,
            "rows": [{
                "id": 1,
                "name": "按摩"
            }, {
                "id": 2,
                "name": "餐飲"
            }, {
                "id": 3,
                "name": "零售"
            }]
        }*/

        const industryMap = {};
        apiRes.rows.forEach((industryItem) => {
            // 建構industryMap
            industryMap[industryItem.id] = industryItem.name;
        });

        this.industryMap = industryMap;

        return Promise.resolve(apiRes);
    }

    callIndustryApi() {
        return ApiSender.sendApi('[get]/industries', null);
        // return ApiSender.sendApi('[get]/industries', null).then((apiRes) => {
        //     /* "rows": [{
        //         "id": 1,
        //         "name": "按摩"
        //     }, {
        //         "id": 2,
        //         "name": "餐飲"
        //     }, {
        //         "id": 3,
        //         "name": "零售"
        //     }]
        //     =====>
        //     [{
        //         key: '1',
        //         label: '按摩'
        //     }]
        //     */
        //     // console.log('autoReady apiRes', apiRes)


        //     // if (!apiRes.rows) {
        //     //     // 輸出optionList
        //     //     callback([]);
        //     //     return Promise.resolve(apiRes);
        //     // }

        //     let optionList = apiRes.rows.map((industryItem) => {
        //         return {
        //             key: `${industryItem.id}`,
        //             label: industryItem.name,
        //         };
        //     });

        //     // 輸出optionList
        //     callback(optionList);

        //     return Promise.resolve(apiRes);
        // }).then(this.buildIndustryMapFromApiRes.bind(this)).catch(new ApiError().catchAlertMsg());
    }

    // [廢棄]
    // buildOptionList(callback, apiRes) {
    //     /* "rows": [{
    //         "id": 1,
    //         "name": "按摩"
    //     }, {
    //         "id": 2,
    //         "name": "餐飲"
    //     }, {
    //         "id": 3,
    //         "name": "零售"
    //     }]
    //     =====>
    //     [{
    //         key: '1',
    //         label: '按摩'
    //     }]
    //     */
    //     // console.log('autoReady apiRes', apiRes)


    //     // if (!apiRes.rows) {
    //     //     // 輸出optionList
    //     //     callback([]);
    //     //     return Promise.resolve(apiRes);
    //     // }

    //     let optionList = apiRes.rows.map((industryItem) => {
    //         return {
    //             key: `${industryItem.id}`,
    //             label: industryItem.name,
    //         };
    //     });

    //     console.log(`out optionList`, optionList);

    //     // 輸出optionList
    //     callback(optionList);

    //     return Promise.resolve(apiRes);
    // }

    outputIndustryApiRes() {
        return Promise.resolve(this.apiRes);
    }

    // (被註冊進waitingWork)
    handleLoadIndustry() { // callback = () => {}
        // ps.丟進autoReady的參數，會直接導到這裡

        return this.callIndustryApi()
            .then((apiRes) => {
                this.apiRes = apiRes;
                return Promise.resolve(apiRes);
            }).then(this.buildIndustryMapFromApiRes.bind(this))
            .catch(new ApiError().catchAlertMsg());
    }
}