import { createSlice } from '@reduxjs/toolkit'
import NumberFilter from 'filter/NumberFilter';
import TimeFilter from 'filter/TimeFilter';

// 使用toolkit，用設定檔建立redux的結構
// 這是設定檔，會自動把 reducers 切成 loginSlice.actions
// 和 loginSlice.reducer
export const subscribeSlice = createSlice({
    name: 'subscribe',
    initialState: {

        // v1 DEMO
        // quotaRankList: [
        //     {
        //         value: 10, // slider的數值
        //         label: '1000',
        //         comment: '1,000用戶',
        //         quota: 1000, // 額度數值
        //         pricePerPerson: 0.1,
        //     },
        //     {
        //         value: 20,
        //         label: '5,000',
        //         comment: '5000用戶',
        //         quota: 5000,
        //         pricePerPerson: 0.1,
        //     },
        //     {
        //         value: 36,
        //         label: '10K',
        //         comment: '10,000用戶',
        //         quota: 10000,
        //         pricePerPerson: 0.09,
        //     },
        //     {
        //         value: 44,
        //         label: '20K',
        //         comment: '20,000用戶',
        //         quota: 20000,
        //         pricePerPerson: 0.09,
        //     },
        //     {
        //         value: 56,
        //         label: '100K',
        //         comment: '100,000用戶',
        //         quota: 100000,
        //         pricePerPerson: 0.08,
        //     },
        //     {
        //         value: 66,
        //         label: '500K',
        //         comment: '500,000用戶',
        //         quota: 500000,
        //         pricePerPerson: 0.08,
        //     },
        // ],
        // payMode: 'year', // 'month' 月付/年付: 會與payByMonth連動
        // payByMonth: false, // 月付/年付: 綁定ToggleSwitch，false=>'year', true=>'month'
        // nowSubscribeUsersNum: 10500, // 目前訂閱用戶數
        // forwardBuyingQuotaLimit: 50000, // 預先購買級距上限
        // pricePerPerson: 0.1, // 每人N元
        // quotaRankPrice: 4800, // 該級距總價
        // quotaRankSliderValue: 20, // 購買級距Slider數值
        // rankQuota: 5000, // 選擇訂閱用戶級距
        // endDateNowPlan: new Date().toISOString(), // 當前方案結束日期
        // startDateNextPlan: new Date().toISOString(), // 下個方案開始日期
        // endDateNextPlan: new Date().toISOString(), // 下個方案結束日期
        // debitedDateNextPlan: new Date().toISOString(), // 下個方案扣款日期
        // originPrice: 46560, // 原價
        // payByYearDiscountRate: 0.2, // 8折折扣的比例
        // payByYearDiscount: 9312, // 年繳8折優惠
        // priceAfterDiscount: 0, // 折扣後的價錢
        // taxRate: 0.05, // 稅金(比率)
        // tax: 1862.153, // 稅金
        // totalPrice: 27248, // 總金額

        // v2: 測試
        payByYearDiscountRate: 0.2, // 8折折扣的比率
        payByMonthDiscountRate: 0, // 月繳的折扣比率 沒折扣=>0
        taxRate: 0, // 稅金(比率) 0.05
        quotaRankList: [],

        payMode: 'year', // 'month' 月付/年付: 會與payByMonth連動
        payByMonth: false, // 月付/年付: 綁定ToggleSwitch，false=>'year', true=>'month'
        nowSubscribeUsersNum: 0, // 目前訂閱用戶數
        forwardBuyingQuotaLimit: 0, // 預先購買級距上限
        pricePerPerson: 0.1, // 每人N元
        quotaRankPrice: 0, // 該級距總價
        quotaRankSliderValue: 0, // 購買級距Slider數值
        rankQuota: 0, // 選擇訂閱用戶級距
        endDateNowPlan: new Date().toISOString(), // 當前方案結束日期
        startDateNextPlan: new Date().toISOString(), // 下個方案開始日期
        endDateNextPlan: new Date().toISOString(), // 下個方案結束日期
        debitedDateNextPlan: new Date().toISOString(), // 下個方案扣款日期
        originPrice: 0, // 原價
        payByYearDiscount: 0, // 年繳8折優惠
        priceAfterDiscount: 0, // 折扣後的價錢
        tax: 0, // 稅金
        totalPrice: 0, // 總金額
    },
    reducers: {
        initSubscribeData: {
            reducer(state, action) {
                // 載入日期參數-----------------------------------
                state.endDateNowPlan = action.payload.endDateNowPlan;
                state.startDateNextPlan = action.payload.startDateNextPlan;
                state.endDateNextPlan = action.payload.endDateNextPlan;
                state.debitedDateNextPlan = action.payload.debitedDateNextPlan;

                // 載入參數-----------------------------------

                // 篩選出合法級距條件式: 大於【目前用戶數】的方案
                const filtValidRank = function (rankItem) {
                    return rankItem.quota > state.nowSubscribeUsersNum;
                };

                // 目前訂閱用戶數
                state.nowSubscribeUsersNum = action.payload.nowSubscribeUsersNum;

                state.quotaRankList = action.payload.quotaRankList.map((rankItem) => {
                    return rankItem;
                }).filter(filtValidRank);
                // 限制僅顯示大於目前用戶數的方案
                // }).filter((rankItem) => {
                //     // 限制僅顯示大於目前用戶數的方案
                //     return rankItem.quota > state.nowSubscribeUsersNum;
                // });

                // state.payByMonth = action.payload.payMode === 'month';
                // state.payMode = action.payload.payMode;
                const defaultPayMode = 'year';
                state.payByMonth = defaultPayMode === 'month';
                state.payMode = defaultPayMode;

                state.taxRate = action.payload.taxRate;


                // 依照目前用戶數，選定當前的級距-----------------------------------
                const rankItem = state.quotaRankList.find(filtValidRank);
                // const rankItem = state.quotaRankList.find((rankItem) => {
                //     // 找出大於【目前用戶數】的方案
                //     return rankItem.quota > state.nowSubscribeUsersNum;
                // });

                if (!rankItem) {
                    // 代表已超出列表中額度最高的方案
                    console.error('initSubscribeData not found bigger quotaRankItem');
                    return;
                }

                // 8折折扣的比例
                state.payByYearDiscountRate = rankItem.payByYearDiscountRate;
                state.payByMonthDiscountRate = rankItem.payByMonthDiscountRate;

                // 初始化slider數值
                state.quotaRankSliderValue = rankItem.value;
                // console.log('state.quotaRankSliderValue', state.quotaRankSliderValue);

                // 呼叫另一個reducer刷新計算參數
                subscribeSlice.caseReducers.refreshData(state);
            },
            prepare(apiRes) {

                /*
                ===>
                payload: {
                    quotaRankList: [
                        {
                            value: 10, // slider的數值
                            label: '1000',
                            comment: '1,000用戶',
                            quota: 1000, // 額度數值
                            pricePerPerson: 0.1,
                        },
                    ],
                    payMode: 'month',
                    taxRate: 0.05,
                    nowSubscribeUsersNum: 10050
                } */
                return {
                    payload: {
                        quotaRankList: apiRes.quotaRankList,
                        payMode: apiRes.payMode,
                        taxRate: apiRes.taxRate,
                        nowSubscribeUsersNum: apiRes.nowSubscribeUsersNum, // 目前訂閱用戶數
                        endDateNowPlan: apiRes.endDateNowPlan,
                        startDateNextPlan: apiRes.startDateNextPlan,
                        endDateNextPlan: apiRes.endDateNextPlan,
                        debitedDateNextPlan: apiRes.debitedDateNextPlan,
                    }
                }
            }
        },
        updatePayByMonth: (state, action) => {
            state.payByMonth = action.payload;
            state.payMode = action.payload ? 'month' : 'year';

            // console.log('updatePayByMonth: state.quotaRankList', state.quotaRankList);

            subscribeSlice.caseReducers.refreshData(state);
        },
        refreshData: (state, action = {}) => {
            let rankItem = action.payload;
            if (!rankItem) {
                // 代表沒指定rankItem，自動從當前的sliderValue抓出來
                rankItem = state.quotaRankList.find((rankItem) => {
                    return rankItem.value === state.quotaRankSliderValue; // 以當前的sliderValue重新計算
                });
            }
            if (!rankItem) {
                console.error('refreshData not found rankItem, quotaRankSliderValue is invalid');
                return;
            }
            // console.log('refreshData rankItem quota', rankItem.quota);

            // step2
            state.forwardBuyingQuotaLimit = rankItem.quota; // 預先購買級距上限
            state.pricePerPerson = rankItem.pricePerPerson; // 每人N元
            // 該級距總價

            // 月份數量(年繳是12個月)
            const monthNum = state.payMode === 'year' ? 12 : 1;
            state.quotaRankPrice = Math.ceil(rankItem.quota * rankItem.pricePerPerson * monthNum);

            // 該級距的折扣比率
            state.payByYearDiscountRate = rankItem.payByYearDiscountRate;
            state.payByMonthDiscountRate = rankItem.payByMonthDiscountRate;

            // step3
            state.rankQuota = rankItem.quota; // 選擇訂閱用戶級距
            state.originPrice = state.quotaRankPrice; // 原價

            // 計算優惠後的價格
            if (state.payMode === 'year') {
                // 年繳8折優惠
                state.payByYearDiscount = Math.floor(state.originPrice * state.payByYearDiscountRate); // payByYearDiscountRate: 0.2
            } else { // state.payMode === 'month'
                state.payByYearDiscount = Math.floor(state.originPrice * state.payByMonthDiscountRate);
            }

            // 折扣後的價錢
            state.priceAfterDiscount = state.originPrice - state.payByYearDiscount;
            state.tax = Math.ceil(state.taxRate * state.priceAfterDiscount); // 稅金
            state.totalPrice = state.priceAfterDiscount + state.tax;   // 總金額
        },
        updateQuotaRankSliderValue: (state, action) => {
            state.quotaRankSliderValue = action.payload;

            // 滑動Slider級距方案，重算所有數值
            // 呼叫另一個reducer刷新參數
            subscribeSlice.caseReducers.refreshData(state);
        },
    },
});

// 輸出actions到App.js
export const { updatePayByMonth } = subscribeSlice.actions;
export const { updateQuotaRankSliderValue } = subscribeSlice.actions;
export const { initSubscribeData } = subscribeSlice.actions;

const decimalSeparatorFilter = new NumberFilter('decimalSeparator');

// 相當於getter，用來輸出數值
export const selectQuotaRankList = (state) => state.subscribe.quotaRankList;
export const selectPayByYearDiscountRate = (state) => {
    return Math.floor(state.subscribe.payByYearDiscountRate * 100);
};

export const selectPayMode = (state) => state.subscribe.payMode;

export const selectPayByMonth = (state) => state.subscribe.payByMonth;
export const selectNowSubscribeUsersNum = (state) => state.subscribe.nowSubscribeUsersNum;

export const selectForwardBuyingQuotaLimit = (state) => state.subscribe.forwardBuyingQuotaLimit;
export const selectPricePerPerson = (state) => state.subscribe.pricePerPerson;
export const selectQuotaRankPrice = (state) => state.subscribe.quotaRankPrice;
export const selectQuotaRankSliderValue = (state) => state.subscribe.quotaRankSliderValue;

const dateFilter = new TimeFilter('date');
export const selectEndDateNowPlan = (state) => dateFilter.filt(state.subscribe.endDateNowPlan);
export const selectStartDateNextPlan = (state) => dateFilter.filt(state.subscribe.startDateNextPlan);
export const selectEndDateNextPlan = (state) => dateFilter.filt(state.subscribe.endDateNextPlan);
export const selectDebitedDateNextPlan = (state) => dateFilter.filt(state.subscribe.debitedDateNextPlan);

export const selectPriceAfterDiscount = (state) => decimalSeparatorFilter.filt(state.subscribe.priceAfterDiscount);



// 選擇訂閱用戶級距
export const selectRankQuota = (state) => decimalSeparatorFilter.filt(`${state.subscribe.rankQuota}`);
export const selectOriginPrice = (state) => decimalSeparatorFilter.filt(state.subscribe.originPrice);
export const selectPayByYearDiscount = (state) => decimalSeparatorFilter.filt(state.subscribe.payByYearDiscount);

const percentFilter = new NumberFilter('percent');
export const selectTaxRate = (state) => (`(${percentFilter.filt(state.subscribe.taxRate)})`);
export const selectTax = (state) => decimalSeparatorFilter.filt(state.subscribe.tax);

export const selectTotalPrice = (state) => decimalSeparatorFilter.filt(state.subscribe.totalPrice);

// 輸出到store.js
export default subscribeSlice.reducer;
