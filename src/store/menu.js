// import { createSlice } from '@reduxjs/toolkit'

// // 使用toolkit，用設定檔建立redux的結構
// // 這是設定檔，會自動把 reducers 切成 loginSlice.actions
// // 和 loginSlice.reducer
// export const menuSlice = createSlice({
//     name: 'menu',
//     initialState: {
//         category: 'systemManage'
//     },
//     reducers: {
//         updateCategory: (state, action) => {
//             state.category = action.payload;
//         },
//     },
// });

// // 輸出actions到App.js
// export const { updateCategory } = menuSlice.actions;

// // 相當於getter，用來輸出數值
// export const selectCategory = (state) => state.menu.category;
// // 外部的用法 ===> useSelector(selectCategory)

// // 輸出到store.js
// export default menuSlice.reducer
