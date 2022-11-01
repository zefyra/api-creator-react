import { createSlice } from '@reduxjs/toolkit'
// import NumberFilter from 'filter/NumberFilter';
// import TimeFilter from 'filter/TimeFilter';

// 測試用的級距資料，API串好之後刪
let quotaInfoListApiOut = { // <Table>接受的資料格式
    //     page: 1,
    //     totalPage: 1,
    count: 6,
    page: 1,
    pageSize: 10,
    rows: [{ // 故意放在前面，測試排序
        rankName: '100000用戶級距',
        userNumLimit: 100000,
        feePerPerson: 0.1,
        discountPerMonth: 1,
        discountPerYear: 0.8,
        feePerMonthAfterDiscount: 5000,
        feePerYearAfterDiscount: 48000,
        enable: false,
    }, {
        rankName: '1000用戶級距',
        userNumLimit: 1000,
        feePerPerson: 0.2,
        discountPerMonth: 1,
        discountPerYear: 0.8,
        feePerMonthAfterDiscount: 2000,
        feePerYearAfterDiscount: 19200,
        enable: false,
    }, {
        rankName: '5000用戶級距',
        userNumLimit: 5000,
        feePerPerson: 0.1,
        discountPerMonth: 1,
        discountPerYear: 0.8,
        feePerMonthAfterDiscount: 5000,
        feePerYearAfterDiscount: 48000,
        enable: false,
    }, {
        rankName: '10000用戶級距',
        userNumLimit: 10000,
        feePerPerson: 0.1,
        discountPerMonth: 1,
        discountPerYear: 0.8,
        feePerMonthAfterDiscount: 5000,
        feePerYearAfterDiscount: 48000,
        enable: false,
    }, {
        rankName: '25000用戶級距',
        userNumLimit: 25000,
        feePerPerson: 0.1,
        discountPerMonth: 1,
        discountPerYear: 0.8,
        feePerMonthAfterDiscount: 5000,
        feePerYearAfterDiscount: 48000,
        enable: false,
    }, {
        rankName: '50000用戶級距',
        userNumLimit: 50000,
        feePerPerson: 0.1,
        discountPerMonth: 1,
        discountPerYear: 0.8,
        feePerMonthAfterDiscount: 5000,
        feePerYearAfterDiscount: 48000,
        enable: false,
    }],
}



export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        // Panel------------------------------------------
        orderId: '',
        startDate: '',
        endDate: '',
        orderStatus: '',
        payStatus: '',
        invoiceStatus: '',
        // Table------------------------------------------
        selectRow: null,
        // QuotaInfoPanel------------------------------------------
        nextQuotaPlan: 50000, // 下期級距方案(人)
        nextDefaultPrice: 48000,// 下次預設收費($)
        tax: 240, // 稅金
        totalPrice: 48240,// 總金額
        nowBindUserNum: 12000, //  目前已綁定用戶數
        isNowBindUserNumExcess: true, // 超出上限(目前已綁定用戶數)
        nowQuota: 10000, // 當前購買級距
        suggestQuota: 50000, // 建議購買級距上限
        quotaInfoList: [],
    },
    reducers: {
        filtOrderTable(state, action) {

        },
        updateOrderId(state, action) {
            state.orderId = action.payload;
        },
        updateStartDate: {
            reducer: (state, action) => {
                // console.log('updateStartDate action.payload', action.payload);
                state.startDate = action.payload;
            },
            prepare: (date) => {
                // state.startDate = action.payload;

                return {
                    payload: date.toISOString(),
                };
            }
        },
        updateEndDate: {
            reducer: (state, action) => {
                state.endDate = action.payload;
            },
            prepare: (date) => {
                return {
                    payload: date.toISOString(),
                };
            }
        },
        updateOrderStatus(state, action) {
            state.orderStatus = action.payload;
        },
        updatePayStatus(state, action) {
            state.payStatus = action.payload;
        },
        updateInvoiceStatus(state, action) {
            state.invoiceStatus = action.payload;
        },
        updateCheckedChange: {
            reducer: (state, action) => {
                if (!action.payload.checked) {
                    state.selectRow = null;
                    return;
                }

                // console.log('row', action.payload.row)
                state.selectRow = action.payload.row;
            },
            prepare: (checked, cellInfo) => {
                return {
                    payload: {
                        checked: checked,
                        row: cellInfo.getRow()
                    },
                };
            }
        },
        updateNextQuotaPlan(state, action) { state.nextQuotaPlan = action.payload; },
        updateNextDefaultPrice(state, action) { state.nextDefaultPrice = action.payload; },
        updateTax(state, action) { state.tax = action.payload; },
        updateTotalPrice(state, action) { state.totalPrice = action.payload; },
        updateNowBindUserNum(state, action) { state.nowBindUserNum = action.payload; },
        updateIsNowBindUserNumExcess(state, action) { state.isNowBindUserNumExcess = action.payload; },
        updateNowQuota(state, action) { state.nowQuota = action.payload; },
        updateSuggestQuota(state, action) { state.suggestQuota = action.payload; },
        loadQuotaInfoList: {
            reducer: (state, action) => {
                state.quotaInfoList = action.payload;
            },
            prepare: (apiRes) => {
                // 先用假的串，之後刪
                apiRes = quotaInfoListApiOut;

                let list = quotaInfoListApiOut.rows;
                /* list: [{
                    userNumLimit: 100000,
                },{
                    userNumLimit: 1000,
                }] */

                list.sort(function (quotaInfoA, quotaInfoB) {
                    return quotaInfoA.userNumLimit - quotaInfoB.userNumLimit;
                });

                return {
                    payload: list,
                };
            }
        }
    }
});


export const selectOrderId = (state) => state.order.orderId;
export const selectStartDate = (state) => state.order.startDate;
export const selectEndDate = (state) => state.order.endDate;
export const selectOrderStatus = (state) => state.order.orderStatus;
export const selectPayStatus = (state) => state.order.payStatus;
export const selectInvoiceStatus = (state) => state.order.invoiceStatus;
export const selectSelectRow = (state) => state.order.selectRow;
export const selectOrderQuery = (state) => {
    return {
        orderId: state.order.orderId,
        startDate: state.order.startDate,
        endDate: state.order.endDate,
        orderStatus: state.order.orderStatus,
        payStatus: state.order.payStatus,
        invoiceStatus: state.order.invoiceStatus,
    };
};
export const selectNextQuotaPlan = (state) => state.order.nextQuotaPlan;
export const selectNextDefaultPrice = (state) => state.order.nextDefaultPrice;
export const selectTax = (state) => state.order.tax;
export const selectTotalPrice = (state) => state.order.totalPrice;
export const selectNowBindUserNum = (state) => state.order.nowBindUserNum;
export const selectIsNowBindUserNumExcess = (state) => state.order.isNowBindUserNumExcess;
export const selectNowQuota = (state) => state.order.nowQuota;
export const selectSuggestQuota = (state) => state.order.suggestQuota;
export const selectQuotaInfoList = (state) => state.order.quotaInfoList;
// export const aaaaaaaaa = (state) => state.order.aaaaaa;
// export const aaaaaaaaa = (state) => state.order.aaaaaa;
// export const aaaaaaaaa = (state) => state.order.aaaaaa;
// export const aaaaaaaaa = (state) => state.order.aaaaaa;
// export const aaaaaaaaa = (state) => state.order.aaaaaa;
// export const aaaaaaaaa = (state) => state.order.aaaaaa;

export const { updateOrderId } = orderSlice.actions;
export const { updateStartDate } = orderSlice.actions;
export const { updateEndDate } = orderSlice.actions;
export const { updateOrderStatus } = orderSlice.actions;
export const { updatePayStatus } = orderSlice.actions;
export const { updateInvoiceStatus } = orderSlice.actions;
export const { updateCheckedChange } = orderSlice.actions;
export const { loadQuotaInfoList } = orderSlice.actions;
export const { updateNextQuotaPlan } = orderSlice.actions;
export const { updateNextDefaultPrice } = orderSlice.actions;
export const { updateTax } = orderSlice.actions;
export const { updateTotalPrice } = orderSlice.actions;
export const { updateNowBindUserNum } = orderSlice.actions;
export const { updateIsNowBindUserNumExcess } = orderSlice.actions;
export const { updateNowQuota } = orderSlice.actions;
export const { updateSuggestQuota } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;
// export const { aaaaaaaaa } = orderSlice.actions;

// 輸出到store.js
export default orderSlice.reducer;