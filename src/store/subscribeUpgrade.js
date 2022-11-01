import { createSlice } from '@reduxjs/toolkit'
import NumberFilter from 'filter/NumberFilter';
import TimeFilter from 'filter/TimeFilter';

export const subscribeUpgradeSlice = createSlice({
    name: 'subscribeUpgrade',
    initialState: {
        quotaRankList: [],
        taxRate: 0, // 稅金(比率) 0.05
        nowSubscribeUsersNum: 0, // 目前訂閱用戶數

        orderQuota: 0, // 使用者當前訂閱的級距 (unexpiredOrder)
        payMode: 'year', // 'month' 月付/年付: 會與payByMonth連動 (unexpiredOrder)
        orderPrice: 0, // 總金額: 該訂單的購買總額 (unexpiredOrder)
        orderRemainDays: 1, // 剩餘天數 (unexpiredOrder)

        orderPricePerDay: 0, // 訂單單日金額
        orderPriceRemain: 0, // 訂單剩餘殘值金額

        pricePerPerson: 0.1, // 每人N元

        quotaRankSliderValue: 0, // 購買級距Slider數值
        rankQuota: 0, // 預先購買級距上限 // 選擇訂閱用戶級距

        quotaRankPrice: 0, // 該級距總價
        quotaRankPricePerDay: 0, // 該級距單日的價格
        quotaRankPriceRemain: 0, // 該級距剩餘N天的價格

        priceGap: 0, // 應補差價
        tax: 0, // 稅金
        totalPrice: 0, // 總金額

        endDateNowPlan: new Date().toISOString(), // 當前方案結束日期
        startDateNextPlan: new Date().toISOString(), // 下個方案開始日期
        endDateNextPlan: new Date().toISOString(), // 下個方案結束日期
        debitedDateNextPlan: new Date().toISOString(), // 下個方案扣款日期



    },
    reducers: {
        initUpgradeData: {
            reducer(state, action) {
                // 拆包-------------------------------------
                const unexpiredOrder = action.payload.unexpiredOrder;
                // 檢查參數-------------------------------------
                if (unexpiredOrder.remainDays <= 0) {
                    // 剩餘天數不能為0
                    console.error('unexpiredOrder remainDays cannot be 0');
                    return;
                }

                // 載入日期參數-----------------------------------
                state.endDateNowPlan = action.payload.endDateNowPlan;
                state.startDateNextPlan = action.payload.startDateNextPlan;
                state.endDateNextPlan = action.payload.endDateNextPlan;
                state.debitedDateNextPlan = action.payload.debitedDateNextPlan;

                // 載入級距參數-----------------------------------

                // 使用者當前訂閱的級距
                state.orderQuota = unexpiredOrder.quota;
                // 篩選出合法級距條件式: 必須大於當前級距
                const filtValidRank = function (rankItem) {
                    return rankItem.quota > state.orderQuota;
                };
                // 付費方案(年繳/月繳): 沿用之前的付費方案，不能變更
                state.payMode = unexpiredOrder.payMode;
                // 訂單總額
                state.orderPrice = unexpiredOrder.price;
                // 剩餘天數
                state.orderRemainDays = unexpiredOrder.remainDays;

                // 目前訂閱用戶數
                state.nowSubscribeUsersNum = action.payload.nowSubscribeUsersNum;
                // 目前稅率
                state.taxRate = action.payload.taxRate;
                // 方案列表
                state.quotaRankList = action.payload.quotaRankList.map((rankItem) => {
                    return rankItem;
                }).filter(filtValidRank);

                // 選定當前的級距-----------------------------------
                const rankItem = state.quotaRankList.find(filtValidRank);

                if (!rankItem) {
                    // 代表已超出列表中額度最高的方案
                    console.error('initUpgradeData not found bigger quotaRankItem');
                    return;
                }

                // 初始化slider數值
                state.quotaRankSliderValue = rankItem.value;

                // 呼叫另一個reducer刷新計算參數
                subscribeUpgradeSlice.caseReducers.refreshData(state);
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
                        nowSubscribeUsersNum: apiRes.nowSubscribeUsersNum, // 目前訂閱用戶數
                        taxRate: apiRes.taxRate,
                        endDateNowPlan: apiRes.endDateNowPlan,
                        startDateNextPlan: apiRes.startDateNextPlan,
                        endDateNextPlan: apiRes.endDateNextPlan,
                        debitedDateNextPlan: apiRes.debitedDateNextPlan,
                        unexpiredOrder: apiRes.unexpiredOrder,
                    }
                };
            },
        },
        updateQuotaRankSliderValue: (state, action) => {
            state.quotaRankSliderValue = action.payload;

            // 滑動Slider級距方案，重算所有數值
            // 呼叫另一個reducer刷新參數
            subscribeUpgradeSlice.caseReducers.refreshData(state);
        },
        refreshData: (state, action = {}) => {
            // 檢查參數-------------------------------------
            if (state.orderRemainDays <= 0) {
                // 剩餘天數不能為0
                console.error('orderRemainDays cannot be 0');
                return;
            }

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
            state.rankQuota = rankItem.quota; // 選擇訂閱用戶級距
            state.pricePerPerson = rankItem.pricePerPerson; // 每人N元

            // 月份數量(年繳是12個月)
            const monthNum = state.payMode === 'year' ? 12 : 1;
            // 該級距總價
            state.quotaRankPrice = Math.ceil(rankItem.quota * rankItem.pricePerPerson * monthNum);

            // 單位日價格 = 級距總價格 / 天數
            state.quotaRankPricePerDay = state.payMode === 'year' ? (state.quotaRankPrice / 365) : (state.quotaRankPrice / 30);
            // 新級距餘額 = 單位日價格 * 剩餘天數
            state.quotaRankPriceRemain = Math.ceil(state.quotaRankPricePerDay * state.orderRemainDays);

            // 計算剩餘殘值
            state.orderPricePerDay = state.payMode === 'year' ? (state.orderPrice / 365) : (state.orderPrice / 30);
            // 原級距餘額(剩餘殘值) = 單位日價格 * 剩餘日數
            state.orderPriceRemain = Math.floor(state.orderPricePerDay * state.orderRemainDays);

            // 應補價差 = 新級距餘額 - 原級距餘額(剩餘殘值)
            state.priceGap = state.quotaRankPriceRemain - state.orderPriceRemain;

            state.tax = Math.ceil(state.taxRate * state.priceGap); // 稅金
            state.totalPrice = state.priceGap + state.tax;   // 總金額
        },
    }
});

// 輸出actions到App.js
export const { initUpgradeData } = subscribeUpgradeSlice.actions;
export const updateQuotaRankSliderValue_u = subscribeUpgradeSlice.actions.updateQuotaRankSliderValue;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;
// export const { updatePayByMonth } = subscribeUpgradeSlice.actions;


// 相當於getter，用來輸出數值

const decimalSeparatorFilter = new NumberFilter('decimalSeparator');

export const selectQuotaRankList_u = (state) => state.subscribeUpgrade.quotaRankList;
const percentFilter = new NumberFilter('percent');
export const selectTaxRate_u = (state) => (`(${percentFilter.filt(state.subscribeUpgrade.taxRate)})`);

export const selectQuotaRankSliderValue_u = (state) => state.subscribeUpgrade.quotaRankSliderValue;

export const selectPayMode_u = (state) => state.subscribeUpgrade.payMode;
export const selectNowSubscribeUsersNum_u = (state) => state.subscribeUpgrade.nowSubscribeUsersNum;
export const selectPricePerPerson_u = (state) => state.subscribeUpgrade.pricePerPerson;

// Debug用參數
const floatDecimalPlacesTwo = new NumberFilter('floatDecimalPlaces', 2);
export const selectOrderPrice_u = (state) => state.subscribeUpgrade.orderPrice;
// export const selectOrderPricePerDay_u = (state) => state.subscribeUpgrade.orderPricePerDay;
export const selectOrderPricePerDay_u = (state) => (`${floatDecimalPlacesTwo.filt(state.subscribeUpgrade.orderPricePerDay)}`);

export const selectOrderQuota_u = (state) => state.subscribeUpgrade.orderQuota;
export const selectOrderRemainDays_u = (state) => state.subscribeUpgrade.orderRemainDays;
export const selectOrderPriceRemain_u = (state) => state.subscribeUpgrade.orderPriceRemain;


export const selectRankQuota_u = (state) => state.subscribeUpgrade.rankQuota;
export const selectQuotaRankPrice_u = (state) => decimalSeparatorFilter.filt(state.subscribeUpgrade.quotaRankPrice);
export const selectQuotaRankPricePerDay_u = (state) => (`${floatDecimalPlacesTwo.filt(state.subscribeUpgrade.quotaRankPricePerDay)}`);
export const selectQuotaRankPriceRemain_u = (state) => state.subscribeUpgrade.quotaRankPriceRemain;
export const selectPriceGap_u = (state) => state.subscribeUpgrade.priceGap;
export const selectTax_u = (state) => state.subscribeUpgrade.tax;
export const selectTotalPrice_u = (state) => state.subscribeUpgrade.totalPrice;

const dateFilter = new TimeFilter('date');
export const selectEndDateNowPlan_u = (state) => dateFilter.filt(state.subscribeUpgrade.endDateNowPlan);
export const selectStartDateNextPlan_u = (state) => dateFilter.filt(state.subscribeUpgrade.startDateNextPlan);
export const selectEndDateNextPlan_u = (state) => dateFilter.filt(state.subscribeUpgrade.endDateNextPlan);
export const selectDebitedDateNextPlan_u = (state) => dateFilter.filt(state.subscribeUpgrade.debitedDateNextPlan);

// 輸出到store.js
export default subscribeUpgradeSlice.reducer;
