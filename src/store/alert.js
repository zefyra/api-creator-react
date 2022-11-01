import { createSlice } from '@reduxjs/toolkit'
import ServerCodeFilter from 'filter/ServerCodeFilter';

const serverCodeFilter = new ServerCodeFilter();

// 使用toolkit，用設定檔建立redux的結構
// 這是設定檔，會自動把 reducers 切成 loginSlice.actions
// 和 loginSlice.reducer
export const alertSlice = createSlice({
    name: 'alert',
    initialState: {
        // alertModalState: 'close',
        // alertModalRef: null,
        alertModalShow: 'none',
        alertTitle: '',
        alertContent: '',

        confirmTitle: '',
        confirmContent: '',
    },
    reducers: {
        // updateAlert: (state, action) => {
        //     state.alertModalState = action.payload;
        // },
        // updateAlertModalRef: (state, action) => {
        //     state.alertModalRef = action.payload;
        // },
        updateAlertModalShow: (state, action) => {
            state.alertModalShow = action.payload;
        },
        updateAlertContent: (state, action) => {
            state.alertContent = action.payload;
        },
        // 外部開啟alert: 一般外部呼叫
        openAlertModal: (state, action) => {
            /* action.payload: { // <error>
                msg:
                data:
            } */

            state.alertModalShow = 'open';
            state.alertTitle = action.payload.msg;
            // 暫不使用
            // state.alertContent = action.payload.data; // 傳進來的字串是alert內容

        },
        // // 同 openAlertModal ，由ApiError物件呼叫
        // apiErrorOpenAlertModal: (state, action) => {
        //     /* action.payload: { // <error>
        //         msg:
        //         data:
        //     } */

        //     state.alertModalShow = 'open';
        //     state.alertTitle = action.payload.msg;
        //     state.alertContent = action.payload.data; // 傳進來的字串是alert內容
        // },

        apiErrorOpenAlertModal: {
            reducer(state, action) {
                /* action.payload: { // <error>
                    msg:
                    data:
                } */

                state.alertModalShow = 'open';
                state.alertTitle = action.payload.msg;
                state.alertContent = action.payload.data; // 傳進來的字串是alert內容
            },
            prepare(error) {
                // console.log('apiErrorOpenAlertModal', error)

                let action;
                if (typeof error === 'object') {
                    if (!error.msg && !error.data) {
                        console.error(`apiErrorOpenAlertModal error`, error)
                    }

                    if (error.code) {
                        // 檢查欄位型別
                        action = {
                            payload: {
                                msg: serverCodeFilter.filt(error.code),
                            }
                        };
                    } else {
                        // 檢查欄位型別
                        action = {
                            payload: {
                                msg: typeof error.msg === 'string' ? error.msg : '',
                                data: typeof error.data === 'string' ? error.msg : '',
                            }
                        };
                    }
                } else if (typeof error === 'string') {
                    // 讓字串型態的error也能跳alert
                    action = {
                        payload: {
                            msg: error,
                            data: '',
                        }
                    };
                } else {
                    action = {
                        payload: error,
                    };
                }
                return action;
            },
        },
        // 外部開啟 confirm
        openConfirmModal: (state, action) => {

        }


        // prepare寫法
        // postAdded: {
        //     reducer(state, action) {
        //       state.push(action.payload)
        //     },
        //     prepare(title, content) {
        //       return {
        //         payload: {
        //           id: nanoid(),
        //           title,
        //           content
        //         }
        //       }
        //     }
        //   }
    },
});

// 輸出actions到App.js
export const { updateAlertModalShow } = alertSlice.actions;
export const { updateAlertContent } = alertSlice.actions;
export const { openAlertModal } = alertSlice.actions;
export const { apiErrorOpenAlertModal } = alertSlice.actions;
export const { openConfirmModal } = alertSlice.actions;

// 外部使用action的寫法
// const dispatch = useDispatch();
// dispatch(updateAccount());
// ps. updateAccount() 會回傳 { type: 'login/updateAccount' } 的action定義名稱


// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount))
//   }, 1000)
// }

// 相當於getter，用來輸出數值
export const selectAlertModalShow = (state) => state.alert.alertModalShow;
export const selectAlertContent = (state) => state.alert.alertContent;
export const selectAlertTitle = (state) => state.alert.alertTitle;

export const selectConfirmTitle = (state) => state.alert.confirmTitle;
export const selectConfirmContent = (state) => state.alert.confirmContent;


// 外部的用法
// useSelector(selectAccount)

// 輸出到store.js
export default alertSlice.reducer
