import { createSlice } from '@reduxjs/toolkit'
import FamilyEnum from 'enum/social/Family';
import UserCheckEnum from 'enum/social/UserCheck';
import TimeFilter from 'filter/TimeFilter';

export const socialSlice = createSlice({
    name: 'social',
    initialState: {
        tagList: [],
        tagLogic: true, // true => AND ； false => OR
        startDate: '',
        endDate: '',
        markedTimes: null,
        channelList: [],
        // -------------------------------------------------
        selectRow: null,
        // SocialDetailModal-------------------------------------------------
        userName: '',
        protraitUrl: '',
        // Profile-------------------------------------------------
        userCheckList: [{
            value: UserCheckEnum.phone,
        }, {
            value: UserCheckEnum.email,
        }, {
            value: UserCheckEnum.line,
        }, {
            value: UserCheckEnum.facebook,
        }, {
            value: UserCheckEnum.instagram,
        }, {
            value: UserCheckEnum.wechat,
        }],
        /* userCheckList: [{
            value: UserCheckEnum.phone,
        }] */
        firstName: '',
        lastName: '',
        sex: '',
        phone: '',
        birthday: '',
        job: '',
        county: '',
        district: '',
        roadName: '',
        address: '',
        familyMemberList: [],
        // familyMemberList: [{
        //     value: FamilyEnum.grandParents,
        // }],
        remark: '',
        // Channel-------------------------------------------------
        lineId: '',
        facebookId: '',
        instagramId: '',
        wechatId: '',
        // ConsumeBehavior-------------------------------------------------
        consumeStartDate: '',
        consumeEndDate: '',
        consumeStatus: '',
        orderId: '',
    },
    reducers: {
        updateTagList(state, action) { state.tagList = action.payload; },
        updateTagLogic(state, action) { state.tagLogic = action.payload; },
        updateStartDate: {
            reducer: (state, action) => { state.startDate = action.payload; },
            prepare(startDate) {
                return {
                    payload: startDate.toISOString(),
                }
            }
        },
        updateEndDate: {
            reducer: (state, action) => { state.endDate = action.payload; },
            prepare: (endDate) => {
                return {
                    payload: endDate.toISOString(),
                }
            }
        },
        updateMarkedTimes(state, action) { state.markedTimes = action.payload; },
        updateChannelList: {
            reducer: (state, action) => {
                const channelType = action.payload.type;
                const channelActive = action.payload.active;

                if (channelActive) {
                    const existInList = state.channelList.includes(channelType);
                    if (!existInList) {
                        state.channelList.push(channelType);
                    }
                } else {
                    // 從陣列中移除
                    const index = state.channelList.indexOf(channelType);
                    if (index >= 0) {
                        state.channelList.splice(index, 1);
                    }
                }
            },
            prepare: (type, active) => {
                return {
                    payload: {
                        type, active
                    }
                }
            }
        },

        updateCheckedChange: {
            reducer(state, action) {
                state.selectRow = action.payload.checked ? action.payload.row : null;
            },
            prepare(checked, cellInfo) {
                return {
                    payload: {
                        checked,
                        row: cellInfo.getRow(),
                    },
                }
            }
        },
        updateUserName(state, action) { state.userName = action.payload; },
        updateProtraitUrl(state, action) { state.protraitUrl = action.payload; },
        updateUserCheckList(state, action) { state.userCheckList = action.payload; },
        updateFirstName(state, action) { state.firstName = action.payload; },
        updateLastName(state, action) { state.lastName = action.payload; },
        updateSex(state, action) { state.sex = action.payload; },
        updatePhone(state, action) { state.phone = action.payload; },
        updateBirthday: {
            reducer(state, action) {
                state.birthday = action.payload;
            },
            prepare: new TimeFilter('isoString').export('prepare'),
            // prepare(d) {
            //     // console.log('d', d)
            //     let payload;
            //     if (typeof d === 'object') {
            //         payload = d.toISOString();
            //     } else if (typeof d === 'string') {
            //         payload = d;
            //     }
            //     // console.log('payload', payload)
            //     return {
            //         payload: payload,
            //         // payload: d ? d.toISOString() : '',
            //     };
            // },
        },
        updateJob(state, action) { state.job = action.payload; },
        updateCounty(state, action) { state.county = action.payload; },
        updateDistrict(state, action) { state.district = action.payload; },
        updateRoadName(state, action) { state.roadName = action.payload; },
        updateAddress(state, action) { state.address = action.payload; },
        updateFamilyMemberList(state, action) { state.familyMemberList = action.payload; },
        updateFamilyChecked: {
            reducer(state, action) {
                const familyKey = action.payload.familyKey;
                const checked = action.payload.checked;

                const existFamilyIndex = state.familyMemberList.findIndex(familyMember => {
                    /* familyMember: {
                        value: <FamilyEnum>
                    } */
                    return familyMember.value === familyKey;
                });

                if (checked) {
                    if (existFamilyIndex >= 0) {
                        return;
                    }
                    state.familyMemberList.push({
                        value: familyKey,
                    });
                } else {
                    if (existFamilyIndex < 0) {
                        return;
                    }
                    // 從陣列中移除
                    state.familyMemberList.splice(existFamilyIndex, 1);
                }

            },
            prepare(familyKey, checked) {
                return {
                    payload: {
                        familyKey, checked
                    }
                }
            }
        },
        updateRemark(state, action) { state.remark = action.payload; },
        updateUserProfile: {
            reducer(state, action) {
                action.payload.userCheckList && (state.userCheckList = action.payload.userCheckList);
                action.payload.firstName && (state.firstName = action.payload.firstName);
                action.payload.lastName && (state.lastName = action.payload.lastName);
                action.payload.sex && (state.sex = action.payload.sex);
                action.payload.phone && (state.phone = action.payload.phone);
                action.payload.birthday && (state.birthday = action.payload.birthday);

                action.payload.job && (state.job = action.payload.job);
                action.payload.county && (state.county = action.payload.county);
                action.payload.district && (state.district = action.payload.district);
                action.payload.roadName && (state.roadName = action.payload.roadName);
                // action.payload.address && (state.address = action.payload.address);
                action.payload.familyMemberList && (state.familyMemberList = action.payload.familyMemberList);
            },
            prepare(apiRes) {

                // [缺API] API轉接

                // 範例
                let birthday = new Date();
                birthday.setMonth(8);
                birthday.setDate(15);

                return {
                    payload: {
                        userCheckList: [{
                            value: UserCheckEnum.phone,
                        }, {
                            value: UserCheckEnum.email,
                            // }, {
                            //     value: UserCheckEnum.line,
                        }, {
                            value: UserCheckEnum.facebook,
                            // }, {
                            //     value: UserCheckEnum.instagram,
                            // }, {
                            //     value: UserCheckEnum.wechat,
                        }],
                        firstName: '大明',
                        lastName: '王',
                        sex: 'male',
                        phone: '123456789',
                        birthday: birthday.toISOString(),
                        job: '軟體工程師',
                        county: 'A', // 台北市
                        district: 'AD01', // 松山區
                        roadName: '南京東路四段50號11樓',
                        familyMemberList: [{
                            value: FamilyEnum.grandParents,
                        }, {
                            value: FamilyEnum.father,
                        }, {
                            value: FamilyEnum.mother,
                        }, {
                            value: FamilyEnum.sister,
                        }, {
                            value: FamilyEnum.son,
                        }]
                    },
                }
            }
        },

        // ChannelUID----------------------------------------------------------

        updateLineId(state, action) { state.lineId = action.payload; },
        updateFacebookId(state, action) { state.facebookId = action.payload; },
        updateInstagramId(state, action) { state.instagramId = action.payload; },
        updateWechatId(state, action) { state.wechatId = action.payload; },

        // ChannelUID----------------------------------------------------------
        // updateConsumeStartDate(state, action) { state.consumeStartDate = action.payload; },
        updateConsumeStartDate: {
            prepare: new TimeFilter('isoString').export('prepare'),
            reducer(state, action) { state.consumeStartDate = action.payload; },
        },
        updateConsumeEndDate: {
            prepare: new TimeFilter('isoString').export('prepare'),
            reducer(state, action) { state.consumeEndDate = action.payload; }
        },
        updateConsumeStatus(state, action) { 
            console.log('action', action)
            // state.consumeStatus = action.payload; 
        },
        updateOrderId(state, action) { state.orderId = action.payload; },
    },
});

export const { updateTagList } = socialSlice.actions;
export const { updateTagLogic } = socialSlice.actions;
export const { updateStartDate } = socialSlice.actions;
export const { updateEndDate } = socialSlice.actions;
export const { updateMarkedTimes } = socialSlice.actions;
export const { updateChannelList } = socialSlice.actions;

export const { updateCheckedChange } = socialSlice.actions;

export const { updateUserName } = socialSlice.actions;
export const { updateProtraitUrl } = socialSlice.actions;
export const { updateUserCheckList } = socialSlice.actions;
// export const { updateUserChecked } = socialSlice.actions;
export const { updateFirstName } = socialSlice.actions;
export const { updateLastName } = socialSlice.actions;
export const { updateSex } = socialSlice.actions;
export const { updatePhone } = socialSlice.actions;
export const { updateBirthday } = socialSlice.actions;
export const { updateJob } = socialSlice.actions;
export const { updateCounty } = socialSlice.actions;
export const { updateDistrict } = socialSlice.actions;
export const { updateRoadName } = socialSlice.actions;
export const { updateAddress } = socialSlice.actions;
export const { updateFamilyMemberList } = socialSlice.actions;
export const { updateFamilyChecked } = socialSlice.actions;
export const { updateRemark } = socialSlice.actions;
export const { updateLineId } = socialSlice.actions;
export const { updateFacebookId } = socialSlice.actions;
export const { updateInstagramId } = socialSlice.actions;
export const { updateWechatId } = socialSlice.actions;
export const { updateConsumeStartDate } = socialSlice.actions;
export const { updateConsumeEndDate } = socialSlice.actions;
export const { updateConsumeStatus } = socialSlice.actions;
export const { updateOrderId } = socialSlice.actions;


export const { updateUserProfile } = socialSlice.actions;

export const selectTagList = (state) => state.social.tagList;
export const selectTagLogic = (state) => state.social.tagLogic;
export const selectStartDate = (state) => state.social.startDate;
export const selectEndDate = (state) => state.social.endDate;
export const selectMarkedTimes = (state) => state.social.markedTimes;
export const selectChannelList = (state) => state.social.channelList;
export const selectQueryInfo = (state) => {
    return {
        tagList: state.social.tagList,
        tagLogic: state.social.tagLogic,
        startDate: state.social.startDate,
        endDate: state.social.endDate,
        markedTimes: state.social.markedTimes,
        channelList: state.social.channelList,
    }
};
export const selectUserName = (state) => state.social.userName;
export const selectProtraitUrl = (state) => state.social.protraitUrl;
export const selectUserCheckList = (state) => state.social.userCheckList;
export const selectUserChecked = (state) => (checkKey) => {
    // console.log(`selectUserChecked checkKey`, checkKey, state)
    const existCheckItem = state.social.userCheckList.find((userCheckItem) => {
        return userCheckItem.value === checkKey;
    });
    return existCheckItem != null;
};
export const selectFirstName = (state) => state.social.firstName;
export const selectLastName = (state) => state.social.lastName;
export const selectSex = (state) => state.social.sex;
export const selectPhone = (state) => state.social.phone;
export const selectBirthday = (state) => state.social.birthday;
export const selectJob = (state) => state.social.job;
export const selectCounty = (state) => state.social.county;
export const selectDistrict = (state) => state.social.district;
export const selectRoadName = (state) => state.social.roadName;
export const selectAddress = (state) => state.social.address;
export const selectFamilyMemberList = (state) => state.social.familyMemberList;
export const selectFamilyChecked = (state) => (familyKey) => {
    // console.log(`selectFamilyChecked familyKey`, familyKey, state)
    // return true;
    const existFamily = state.social.familyMemberList.find((familyMember) => {
        return familyMember.value === familyKey;
    });
    return existFamily != null;
};
export const selectRemark = (state) => state.social.remark;
export const selectLineId = (state) => state.social.lineId;
export const selectFacebookId = (state) => state.social.facebookId;
export const selectInstagramId = (state) => state.social.instagramId;
export const selectWechatId = (state) => state.social.wechatId;
export const selectConsumeStartDate = (state) => state.social.consumeStartDate;
export const selectConsumeEndDate = (state) => state.social.consumeEndDate;
export const selectConsumeStatus = (state) => state.social.consumeStatus;
export const selectOrderId = (state) => state.social.orderId;


// 輸出到store.js
export default socialSlice.reducer;