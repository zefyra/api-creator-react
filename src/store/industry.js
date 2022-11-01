import { createSlice } from '@reduxjs/toolkit'
import LocalAccessor from 'localAccessor';

// 從localStorage重新載入
const industryData = LocalAccessor.getItem('industry');

// industryData: {"industryOptionList":[{"value":"1","label":"按摩"},{"value":"2","label":"餐飲"},{"value":"3","label":"零售"}]}

const industryInitialState = {
    hasLoad: industryData != null,
    industryOptionList: industryData != null ? industryData.industryOptionList : [],
};

// 使用toolkit，用設定檔建立redux的結構
// 這是設定檔，會自動把 reducers 切成 loginSlice.actions
// 和 loginSlice.reducer
export const industrySlice = createSlice({
    name: 'industry',
    initialState: industryInitialState,
    reducers: {
        resetIndustry(state, action) {
            state.hasLoad = false;

            state.industryOptionList = [];
        },
        updateIndustryData: {
            reducer: (state, action) => {
                const industryRows = action.payload;
                /*  industryRows=====>
                industryOptionList: [{
                    value: '1',
                    label: '按摩'
                }] */

                state.industryOptionList = industryRows.map((row) => {
                    return {
                        value: `${row.id}`,
                        label: row.name,
                    }
                });

                state.hasLoad = true;

                LocalAccessor.setItem('industry', JSON.stringify({
                    industryOptionList: state.industryOptionList,
                }));
            },
            prepare(apiRes) {
                /* apiRes: {
                    "count": 3,
                    "next": null,
                    "previous": null,
                    "rows": [
                        {
                            "id": 1,
                            "name": "按摩"
                        },
                        {
                            "id": 2,
                            "name": "餐飲"
                        },
                        {
                            "id": 3,
                            "name": "零售"
                        }
                    ]
                }*/

                return {
                    payload: apiRes.rows
                }
            }
        },
    },
});

export const { updateIndustryData } = industrySlice.actions;

export const { resetIndustry } = industrySlice.actions;

// 相當於getter，用來輸出數值
export const selectIndustryOptionList = (state) => state.industry.industryOptionList;
export const selectHasLoad = (state) => state.industry.hasLoad;

// 輸出到store.js
export default industrySlice.reducer
