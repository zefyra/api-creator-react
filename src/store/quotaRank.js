import { createSlice } from '@reduxjs/toolkit'

export const quotaRankSlice = createSlice({
    name: 'quotaRank',
    initialState: {
        // AddQuotaRankModal------------------------------------------
        rankName: '',
        userNumLimit: 0,
        // userNumLimitNum: 0,
        feePerPerson: 1,
        // feePerPersonNum: 1,
        discountByMonth: 1,
        // discountByMonthNum: 1,
        discountByYear: 1,
        // discountByYearNum: 1,
        feeAfterDiscountByMonth: 0,
        // feeAfterDiscountByMonthNum: 0,
        feeAfterDiscountByYear: 0,
        // feeAfterDiscountByYearNum: 0,
    },
    reducers: {
        updateRankName(state, action) { state.rankName = action.payload; },
        // 原版: 沒有使用InputText type="integer"的情況
        // updateUserNumLimit(state, action) {
        //     // if (!action.payload) {
        //     //     state.userNumLimit = '0';
        //     //     state.userNumLimitNum = 0;
        //     //     return;
        //     // }
        //     // if (!integerValidator.validate(action.payload)) {
        //     //     return;
        //     // }
        //     // action.payload = removeLeadingZeroFilter.filt(action.payload);
        //     // state.userNumLimit = action.payload;
        //     // state.userNumLimitNum = Number(action.payload);
        // },
        updateUserNumLimit(state, action) {
            // const val = Number(action.payload);
            const val = action.payload;
            if (val > 1000000) {
                // 上限100萬
                return;
            }

            state.userNumLimit = val;
            // state.userNumLimitNum = val;

            // 呼叫另一個reducer刷新計算參數
            quotaRankSlice.caseReducers.freshPrice(state);
        },
        /* 原版: 沒有使用InputText type="float"的情況
        updateFeePerPerson(state, action) {
            if (!value) {
                return output('0');
            }

            if (!action.payload) {
                state.feePerPerson = '1';
                state.feePerPersonNum = 1;
                return;
            }
            if (!floatValidator.validate(action.payload)) {
                return;
            }
            action.payload = removeLeadingZeroFilter.filt(action.payload);
            state.feePerPerson = action.payload;
            state.feePerPersonNum = Number(action.payload);
        }, */
        updateFeePerPerson(state, action) {
            const val = action.payload;
            // let val = Number(action.payload);
            if (val > 10000) {
                // 上限1萬
                return;
            }
            // if (val === 0) {
            //     // 刪除時，自動設成1，禁止設定成0
            //     action.payload = '1';
            //     val = 1;
            // }

            state.feePerPerson = val;
            // state.feePerPerson = action.payload;
            // state.feePerPersonNum = val;

            // 呼叫另一個reducer刷新計算參數
            quotaRankSlice.caseReducers.freshPrice(state);
        },
        updateDiscountByMonth(state, action) {
            const val = action.payload;
            // let val = Number(action.payload);
            if (val > 10000) {
                // 上限1萬
                return;
            }
            // state.discountByMonth = action.payload;
            // state.discountByMonthNum = val;

            state.discountByMonth = val;

            // 呼叫另一個reducer刷新計算參數
            quotaRankSlice.caseReducers.freshPrice(state);
        },
        updateDiscountByYear(state, action) {
            const val = action.payload;
            // let val = Number(action.payload);
            if (val > 10000) {
                // 上限1萬
                return;
            }
            // console.log('updateDiscountByYear', action.payload, val)
            // state.discountByYear = action.payload;
            // state.discountByYearNum = val;

            state.discountByYear = val;

            // 呼叫另一個reducer刷新計算參數
            quotaRankSlice.caseReducers.freshPrice(state);
        },
        freshPrice(state, action) {
            // console.log('freshPrice');
            const basePrice = state.userNumLimit * state.feePerPerson;

            const feeMonth = basePrice * state.discountByMonth;
            const feeYear = basePrice * 12 * state.discountByYear;

            state.feeAfterDiscountByMonth = feeMonth;
            state.feeAfterDiscountByYear = feeYear;
        },
    }
});

export const selectRankName = (state) => state.quotaRank.rankName;
export const selectUserNumLimit = (state) => state.quotaRank.userNumLimit;
export const selectFeePerPerson = (state) => state.quotaRank.feePerPerson;
export const selectDiscountByMonth = (state) => state.quotaRank.discountByMonth;
export const selectDiscountByYear = (state) => state.quotaRank.discountByYear;
export const selectFeeAfterDiscountByMonth = (state) => state.quotaRank.feeAfterDiscountByMonth;
export const selectFeeAfterDiscountByYear = (state) => state.quotaRank.feeAfterDiscountByYear;

export const selectAddQuotaRankForm = (state) => {
    return {
        rankName: state.quotaRank.rankName,
        userNumLimit: state.quotaRank.userNumLimit,
        feePerPerson: state.quotaRank.feePerPerson,
        discountByMonth: state.quotaRank.discountByMonth,
        discountByYear: state.quotaRank.discountByYear,
        feeAfterDiscountByMonth: state.quotaRank.feeAfterDiscountByMonth,
        feeAfterDiscountByYear: state.quotaRank.feeAfterDiscountByYear,
    };
};


export const { updateRankName } = quotaRankSlice.actions;
export const { updateUserNumLimit } = quotaRankSlice.actions;
export const { updateFeePerPerson } = quotaRankSlice.actions;
export const { updateDiscountByMonth } = quotaRankSlice.actions;
export const { updateDiscountByYear } = quotaRankSlice.actions;
// export const { updateFeeAfterDiscountByMonth } = quotaRankSlice.actions;
// export const { updateFeeAfterDiscountByYear } = quotaRankSlice.actions;

// export const { blurDiscountByYear } = quotaRankSlice.actions;

// 輸出到store.js
export default quotaRankSlice.reducer;