import { createSlice } from '@reduxjs/toolkit'
import LocalAccessor from 'localAccessor';
import RouteManager from 'router/RouteManager';
import CategoryEnum from 'enum/Category'
import PasswordValidEnum from 'enum/login/PasswordValid';
import PasswordValidator from 'validator/PasswordValidator';

// 從localStorage重新載入
// const profile = LocalAccessor.getItem('profile');

const permissionLocalAccessor = new LocalAccessor('permission');
const permissionAccessor = permissionLocalAccessor.getAcceor();

const loginInitialState = {
    account: '',
    password: '',
    pageMode: '',
    token: '',
    accountValid: false,
    // passwordValid: false,
    passwordValidMode: PasswordValidEnum.isEmpty,
    resendButtonDisabled: true,
    registButtonDisabled: true,
    resendVerifyDisabled: true,
    // profile(已轉移，之後拔掉)------------------------------
    // email: profile.email || '',
    // accountId: profile.id || 0,
    // accountEntityId: profile.entityID || 0,
    // role: profile.role || '',
    // userName: profile.username || '',
    // email: '',
    // accountId: '',
    // accountEntityId: '',
    // role: '',
    // userName: '',
    // permission------------------------------
    systemPermissionList: permissionAccessor.getPermissionList('system') || [],
    systemPermissionMap: permissionAccessor.getPermissionMap('system') || {},
    // menu------------------------------
    category: CategoryEnum.system,
};

const passwordValidator = new PasswordValidator();

// 使用toolkit，用設定檔建立redux的結構
// 這是設定檔，會自動把 reducers 切成 loginSlice.actions
// 和 loginSlice.reducer
export const loginSlice = createSlice({
    name: 'login',
    initialState: loginInitialState,
    reducers: {
        updateAccount: (state, action) => {
            state.account = action.payload;

            // 連動刷新registButtonDisabled
            const validateAccount = function (account) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,16}$/g.test(account);
            }
            // 撤掉不必要的判斷式
            // if (state.pageMode === 'regist') {

            // 代表是註冊頁
            state.accountValid = validateAccount(action.payload);

            // 帳號、密碼符合格式，才可以按「註冊按鈕」
            // state.registButtonDisabled = !state.accountValid;
            state.registButtonDisabled = !state.accountValid || !state.passwordValid;
            state.resendVerifyDisabled = !state.accountValid;
        },
        updatePassword: (state, action) => {
            state.password = action.payload;

            // // 代表是註冊頁
            // const getValidMode = function (password) {
            //     /*   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/   */

            //     // 【?=.*】  ==> 代表判斷式成立才會繼續往下判斷，類似於js中的 <boolean> && do();
            //     // 【.】  ==> 代表任意字元  

            //     if (!password) { // null or ""
            //         return PasswordValidEnum.isEmpty;
            //     } else if (password.length < 10) {
            //         return PasswordValidEnum.tooShort;
            //     } else if (password.length > 50) {
            //         return PasswordValidEnum.tooLong;
            //     } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/.test(password)) {
            //         return PasswordValidEnum.requiredCharLost;
            //     }

            //     return PasswordValidEnum.valid;
            // }
            state.passwordValidMode = passwordValidator.getValidState(action.payload);

            // 帳號、密碼符合格式，才可以按「註冊按鈕」
            // state.registButtonDisabled = !state.accountValid || !state.passwordValid;
            state.registButtonDisabled = !state.accountValid || state.passwordValidMode !== PasswordValidEnum.valid;
        },
        updatePageMode: (state, action) => {
            state.pageMode = action.payload;
        },
        updateToken: (state, action) => {
            state.token = action.payload;
        },
        updateResendButtonDisabled: (state, action) => {
            state.resendButtonDisabled = action.payload;
        },
        updateRegistButtonDisabled: (state, action) => {
            state.registButtonDisabled = action.payload;
        },
        updateLogout: (state, action) => {
            state.token = '';
        },
        // updateUserProfile: {
        //     reducer: (state, action) => {
        //         const profileData = action.payload;
        //         state.email = profileData.email;
        //         state.accountId = profileData.id;
        //         state.accountEntityId = profileData.entityID;
        //         state.role = profileData.role;
        //         state.userName = profileData.username;

        //         LocalAccessor.setItem('profile', JSON.stringify({
        //             email: state.email,
        //             accountId: state.accountId,
        //             accountEntityId: state.accountEntityId,
        //             role: state.role,
        //             userName: state.userName,
        //         }));
        //     },
        //     prepare(apiRes) {
        //         /* apiRes: {
        //             activated: null
        //             createdAt: null
        //             email: "thomaswang@reas.com.tw"
        //             enabled: null
        //             entityID: 1
        //             id: 1
        //             lastLoginAt: null
        //             parentID: null
        //             phoneNumber: null
        //             role: "admin"
        //             updatedAt: null
        //             username: null
        //         } */
        //         return {
        //             payload: apiRes
        //         }
        //     }
        // },
        updateUserPermission: {
            reducer: (state, action) => {

                const { data, role } = action.payload;

                console.log(`payload.data`, data)

                // console.log(`data, role`, data, role);

                let rolePermissionList;

                if (role === 'admin') {
                    // admin權限會全開: 要自己組建

                    // console.log('updateUserPermission admin data', data)

                    const adminResourceMap = {};
                    data.forEach((permissionItem) => {
                        if (!adminResourceMap[permissionItem.resourceName]) {
                            let item = Object.assign({}, permissionItem);
                            item.roleName = 'admin';
                            item.enabled = true;
                            adminResourceMap[permissionItem.resourceName] = item;
                        }
                    });

                    // console.log('adminResourceMap', adminResourceMap)

                    rolePermissionList = Object.keys(adminResourceMap).map((resourceName) => {
                        return adminResourceMap[resourceName];
                    });
                } else {
                    // 其他有列在roleName裡面的角色

                    rolePermissionList = data.filter((permissionItem) => {

                        return permissionItem.roleName === role;
                    });
                }

                // console.log('rolePermissionList', rolePermissionList);

                state.systemPermissionList = rolePermissionList;

                const systemPermissionMap = {};
                rolePermissionList.forEach((permissionItem) => {
                    systemPermissionMap[permissionItem.resourceName] = permissionItem;
                });
                // 這個才是實際上用來判斷權限的
                state.systemPermissionMap = systemPermissionMap;

                LocalAccessor.setItem('permission', {
                    type: 'system',
                    permissionMap: systemPermissionMap,
                });
            },
            prepare(apiRes, role) {

                if (!role) {
                    console.error(`updateUserPermission role not exist`);
                }

                // '[get]/permissions' => apiRes
                /* data: [{
                    enabled: false
                    id: 37
                    parentResource: null
                    resourceName: "accountList"
                    roleName: "developer"
                }]*/
                return {
                    payload: {
                        data: apiRes.rows,
                        role,
                    },
                }
            }
        },
        updateCategory: (state, action) => {
            state.category = action.payload;
        },
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
export const { updateAccount, updatePassword, updatePageMode,
    updateToken, updateResendButtonDisabled, updateRegistButtonDisabled,
    updateLogout, updateUserPermission
} = loginSlice.actions;

// updateUserProfile
export const { updateCategory } = loginSlice.actions;

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
export const selectAccount = (state) => state.login.account;
export const selectPassword = (state) => state.login.password;
export const selectPageMode = (state) => state.login.pageMode;
export const selectToken = (state) => state.login.token;
export const selectAccountValid = (state) => state.login.accountValid;
export const selectPasswordValidMode = (state) => state.login.passwordValidMode;
export const selectResendButtonDisabled = (state) => state.login.resendButtonDisabled;
export const selectRegistButtonDisabled = (state) => state.login.registButtonDisabled;
export const selectResendVerifyDisabled = (state) => state.login.resendVerifyDisabled;

export const selectSystemPermissionList = (state) => {
    return state.systemPermissionList;
};
export const selectCategory = (state) => state.login.category;
// export const selectRole = (state) => state.login.role;
// 用來取得permissionItem用的
export const selectGetPermission = (state) => (resourceName) => { // category,

    const permissionItem = state.login.systemPermissionMap[resourceName];
    if (permissionItem) {
        return permissionItem;
    }
    // ...會依序找下去

    return null;
}

// 輸出到store.js
export default loginSlice.reducer
