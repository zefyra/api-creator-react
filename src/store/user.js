import { createSlice } from '@reduxjs/toolkit'
// import NumberFilter from 'filter/NumberFilter';
// import TimeFilter from 'filter/TimeFilter';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accountId: '',
        // userManageModal BaseInfo -----------------------------------------
        account: '',
        password: '',
        userName: '',
        industry: '',
        phone: '',
        comment: '',
        agent: '',
        sales: '',
        // industryOptionList: [],

        // userManageModal systemAuth -------------------------------------------
        // 已轉移到permission的store，之後刪
        userRole: '',
        systemPermissionList: [],
        systemAuthTablePageSize: 8,
        systemAuthTablePage: 1,
        // systemAuthTable: new TableData(null, 'default'),
        // ps.Redux不支援class物件
    },
    reducers: {
        // initSubscribeData: {
        //     reducer(state, action) {
        //     },
        //     prepare(apiRes) {
        //     }
        // },
        // updatePayByMonth: (state, action) => {
        // },
        updateUserManageBaseInfo: {
            reducer(state, action) {

                state.accountId = action.payload.accountId;

                state.account = action.payload.account || ''; // || ''
                state.password = action.payload.password || '';
                state.userName = action.payload.userName || '';
                state.industry = action.payload.industry || '';
                state.phone = action.payload.phone || '';
                state.comment = action.payload.comment || '';
                state.agent = action.payload.agent || '';
                state.sales = action.payload.sales || '';

                state.userRole = action.payload.userRole || state.userRole;
            },
            prepare(apiRes) {
                // apiRes: '[get]/account-entities/{id}'
                // console.log('apiRes', apiRes)
                if (!apiRes) {
                    return {
                        payload: {},
                    }
                }

                return {
                    payload: {
                        accountId: apiRes.account.id,
                        account: apiRes.account.email,
                        password: '',
                        userName: apiRes.entity.name,
                        industry: `${apiRes.entity.industryID}`,
                        phone: apiRes.account.phoneNumber,
                        comment: apiRes.entity.notes || '',
                        agent: apiRes.entity.agent || '',
                        sales: apiRes.entity.business || '',
                        // --------------------------------------------------
                        userRole: apiRes.account.role,
                    }
                }
            }
        },
        updateUserManageSystemAuth(state, action) {
            const data = action.payload;
            /* data: [{
                enabled: false
                id: 37
                parentResource: null
                resourceName: "accountList"
                roleName: "developer"
            }] */

            const adminResourceMap = {};

            if (state.userRole === 'admin') {
                // admin權限會全開

                data.forEach((permissionItem) => {
                    if (!adminResourceMap[permissionItem.resourceName]) {
                        let item = Object.assign({}, permissionItem);
                        item.roleName = 'admin';
                        item.enabled = true;
                        adminResourceMap[permissionItem.resourceName] = item;
                    }
                });

                // console.log('adminResourceMap', adminResourceMap)

                state.systemPermissionList = Object.keys(adminResourceMap).map((resourceName) => {
                    return adminResourceMap[resourceName];
                });

                // 呼叫另一個reducer刷新計算參數
                // userSlice.caseReducers.initSystemAuthTable(state);
                return;
            }

            const rolePermissionList = data.filter((permissionItem) => {
                return permissionItem.roleName === state.userRole;
            });

            state.systemPermissionList = rolePermissionList;

            // 呼叫另一個reducer刷新計算參數
            // userSlice.caseReducers.initSystemAuthTable(state);

            // console.log('updateUserManageSystemAuth', rolePermissionList)

        },
        updateSystemAuthTablePage(state, action) {
            console.log('updateSystemAuthTablePage', state.systemPermissionList)
            state.systemAuthTablePage = action.payload;
        },
        updateAccount: (state, action) => {
            state.account = action.payload;
        },
        updatePassword: (state, action) => {
            state.password = action.payload;
        },
        updateUserName: (state, action) => {
            state.userName = action.payload;
        },
        updateIndustry: (state, action) => {
            state.industry = action.payload;
        },
        updatePhone: (state, action) => {
            state.phone = action.payload;
        },
        updateComment: (state, action) => {
            state.comment = action.payload;
        },
        updateAgent: (state, action) => {
            state.agent = action.payload;
        },
        updateSales: (state, action) => {
            state.sales = action.payload;
        },
    },
});

export const { updateAccount } = userSlice.actions;
export const { updatePassword } = userSlice.actions;
export const { updateUserName } = userSlice.actions;
export const { updateIndustry } = userSlice.actions;
export const { updatePhone } = userSlice.actions;
export const { updateComment } = userSlice.actions;
export const { updateAgent } = userSlice.actions;
export const { updateSales } = userSlice.actions;
export const { updateIndustryOptionList } = userSlice.actions;
export const { updateUserManageBaseInfo } = userSlice.actions;
// export const { updateUserManageIndustryOptionList } = userSlice.actions;
export const { updateUserManageSystemAuth } = userSlice.actions;
export const { updateSystemAuthTablePage } = userSlice.actions;

export const selectAccountId = (state) => state.user.accountId;

export const selectAccount = (state) => state.user.account;
export const selectPassword = (state) => state.user.password;
export const selectUserName = (state) => state.user.userName;
export const selectIndustry = (state) => state.user.industry;
export const selectPhone = (state) => state.user.phone;
export const selectComment = (state) => state.user.comment;
export const selectAgent = (state) => state.user.agent;
export const selectSales = (state) => state.user.sales;
// export const selectIndustryOptionList = (state) => state.user.industryOptionList;

// export const selectUserManageBaseInfo = (state) => {
//     return {
//         account: state.user.account,
//         password: state.user.password,
//         userName: state.user.userName,
//         industry: state.user.industry,
//         phone: state.user.phone,
//         comment: state.user.comment,
//         agent: state.user.agent,
//         sales: state.user.sales,
//     };
// };

export const selectSystemPermissionList = (state) => state.user.systemPermissionList;
export const selectSystemAuthTablePageSize = (state) => state.user.systemAuthTablePageSize;
export const selectSystemAuthTablePage = (state) => state.user.systemAuthTablePage;

// 輸出到store.js
export default userSlice.reducer;
