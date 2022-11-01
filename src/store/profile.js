import { createSlice } from '@reduxjs/toolkit'
import LocalAccessor from 'localAccessor';
import RouteManager from 'router/RouteManager';
import CategoryEnum from 'enum/Category'

// 從localStorage重新載入
const profile = LocalAccessor.getItem('profile');

const profileInitialState = {
    hasLoadProfile: profile.entityID != null ? true : false,
    // profile------------------------------
    email: profile.email || '',
    accountId: profile.id || 0,
    accountEntityId: profile.entityID || 0,
    role: profile.role || '',
    userName: profile.username || '',
};

// 使用toolkit，用設定檔建立redux的結構
// 這是設定檔，會自動把 reducers 切成 loginSlice.actions
// 和 loginSlice.reducer
export const profileSlice = createSlice({
    name: 'profile',
    initialState: profileInitialState,
    reducers: {
        resetProfile(state, action) {
            // console.log('resetProfile')

            state.hasLoadProfile = false;

            state.email = '';
            state.accountId = 0;
            state.accountEntityId = 0;
            state.role = '';
            state.userName = '';
        },
        updateUserProfile: {
            reducer: (state, action) => {
                const profileData = action.payload;
                state.email = profileData.email;
                state.accountId = profileData.id;
                state.accountEntityId = profileData.entityID;
                state.role = profileData.role;
                state.userName = profileData.username;

                state.hasLoadProfile = true; // 標記: 已載入

                LocalAccessor.setItem('profile', JSON.stringify({
                    email: state.email,
                    accountId: state.accountId,
                    accountEntityId: state.accountEntityId,
                    role: state.role,
                    userName: state.userName,
                }));
            },
            prepare(apiRes) {
                /* apiRes: {
                    activated: null
                    createdAt: null
                    email: "thomaswang@reas.com.tw"
                    enabled: null
                    entityID: 1
                    id: 1
                    lastLoginAt: null
                    parentID: null
                    phoneNumber: null
                    role: "admin"
                    updatedAt: null
                    username: null
                } */
                return {
                    payload: apiRes
                }
            }
        },
    },
});

export const { updateUserProfile } = profileSlice.actions;
export const { resetProfile } = profileSlice.actions;
/*
    email: profile.email || '',
    accountId: profile.id || 0,
    accountEntityId: profile.entityID || 0,
    role: profile.role || '',
    userName: profile.username || '',*/

// 相當於getter，用來輸出數值
export const selectEmail = (state) => state.profile.email;
export const selectAccountId = (state) => state.profile.accountId;
export const selectAccountEntityId = (state) => state.profile.accountEntityId;
export const selectRole = (state) => state.profile.role;
export const selectUserName = (state) => state.profile.userName;

export const selectHasLoadProfile = (state) => state.profile.hasLoadProfile;


// 輸出到store.js
export default profileSlice.reducer
