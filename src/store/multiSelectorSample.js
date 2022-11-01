import { createSlice } from '@reduxjs/toolkit'

// 全選多選框範例，若有將技術應用到其他位置，可刪除

export const multiSelectorSampleSlice = createSlice({
    name: 'multiSelectorSample',
    initialState: {
        allTagCategoryChecked: -1, // 0: 'notAll', -1: 'none', 1: 'all'
        tagCategoryCheckedMap: {},
        tagCategoryList: [],
        // tagCategoryList: [{
        //     label: '全部',
        //     value: 'all',
        // }, {
        //     label: '用戶屬性',
        //     value: 'user',
        // }, {
        //     label: '商品服務屬性',
        //     value: 'productService',
        // }, {
        //     label: '交易屬性',
        //     value: 'trade',
        // }, {
        //     label: '用戶行為',
        //     value: 'userAction',
        // }, {
        //     label: '販促活動',
        //     value: 'bigSale',
        // }],
        searchTagKey: '',
    },
    reducers: {
        updateTagCategoryList(state, action) {
            // console.log('updateTagCategoryList', action.payload)

            const tagCategoryList = action.payload;
            const tagCategoryCheckedMap = {};
            tagCategoryList.forEach((item) => {
                tagCategoryCheckedMap[item.value] = false;
            });

            state.tagCategoryList = tagCategoryList;
            state.tagCategoryCheckedMap = tagCategoryCheckedMap;
        },
        updateTagCategoryChecked: {
            reducer(state, action) {
                console.log('updateTagCategoryChecked action', action.payload)
                state.tagCategoryCheckedMap[action.payload.value] = action.payload.checked;
                multiSelectorSampleSlice.caseReducers.refreshAllTagCategoryChecked(state);
            },
            prepare(value, checked) {
                return {
                    payload: {
                        value: value,
                        checked,
                    }
                }
            }
        },
        updateAllTagCategoryChecked(state, action) {
            const checked = state.allTagCategoryChecked === 0 ? true : action.payload;
            state.allTagCategoryChecked = checked ? 1 : -1;

            const newCheckedMap = Object.assign({}, state.tagCategoryCheckedMap);

            Object.keys(newCheckedMap).forEach((key) => {
                newCheckedMap[key] = checked;
            });

            state.tagCategoryCheckedMap = newCheckedMap;
        },
        refreshAllTagCategoryChecked(state, action) {
            // console.log('refreshAllTagCategoryChecked')
            let checkedCount = 0;
            const keyList = Object.keys(state.tagCategoryCheckedMap);
            keyList.forEach((key) => {
                if (state.tagCategoryCheckedMap[key] === true) {
                    checkedCount += 1;
                }
            });

            if (checkedCount === 0) {
                state.allTagCategoryChecked = -1;
            } else if (checkedCount === keyList.length) {
                state.allTagCategoryChecked = 1;
            } else {
                state.allTagCategoryChecked = 0;
            }
        },
        updateSearchTagKey(state, action) { state.searchTagKey = action.payload; },
    },
});


export const selectTagCategoryList = (state) => state.multiSelectorSample.tagCategoryList;
export const selectAllTagCategoryChecked = (state) => state.multiSelectorSample.allTagCategoryChecked;
export const selectTagCategoryCheckedMap = (state) => state.multiSelectorSample.tagCategoryCheckedMap;
export const selectSearchTagKey = (state) => state.multiSelectorSample.searchTagKey;

export const { updateTagCategoryList } = multiSelectorSampleSlice.actions;
export const { updateTagCategoryChecked } = multiSelectorSampleSlice.actions;
export const { updateAllTagCategoryChecked } = multiSelectorSampleSlice.actions;
export const { updateSearchTagKey } = multiSelectorSampleSlice.actions;

export default multiSelectorSampleSlice.reducer;