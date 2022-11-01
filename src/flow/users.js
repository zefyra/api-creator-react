
import ApiSender, { ApiError } from "apiSender";
import Modal from "component/Modal";
import Control from "control/Control";
import { UserManageModel, UserProfileModel } from "fragment/Users";
import { selectAccountId as selectProfileAccountId } from "store/profile";
import ProfileControl from "river/Profile";
import {
    selectAccountId,
    selectAccount,
    selectPassword,
    selectUserName,
    selectIndustry,
    selectPhone,
    selectComment,
    selectAgent,
    selectSales,
    updateUserManageBaseInfo
} from "store/user";
import IndustryControl from "river/Industry";
// import { selectIndustryOptionList } from "store/industry";
import { BatchControl } from "control/BatchControl";
import TableData from "util/TableData";
// import Flow from "./flow"

class UserFlow { // extends Flow
    baseInfo = null;
    /* baseInfo = {
        account,
        password,
        userName,
        industry,
        phone,
        comment,
        agent,
        sales,
    }*/

    // [public] 基本資料: 由ManageUserModal存進來的資料
    setUserManageBaseInfo(baseInfo) {
        // console.log('setUserManageBaseInfo', baseInfo);
        this.baseInfo = Object.assign({}, baseInfo);
    }

    getUserManageBaseInfo() {
        return this.baseInfo;
        // const newObj = {};
        // Object.keys(this.baseInfo).forEach((key) => {
        //     const val = this.baseInfo[key];
        //     newObj[key] = val === '' ? null : val;
        // });
        // return newObj;
    }
}


export class CreateUserFlow extends UserFlow {
    createUser() {
        const userManageBaseInfo = this.baseInfo;

        const accountEntityObject = {
            account: {
                email: userManageBaseInfo.account,
                password: userManageBaseInfo.password,
                username: userManageBaseInfo.userName,
                phoneNumber: userManageBaseInfo.phone,
                activated: true,
                createdAt: new Date().toISOString(),
                enabled: true,
                id: null,
                lastLoginAt: null,
                parentID: null,
                updatedAt: new Date().toISOString(),
            },
            entity: {
                agent: userManageBaseInfo.agent,
                business: userManageBaseInfo.sales,
                dueDate: null,
                id: null, // 0
                industryID: Number(userManageBaseInfo.industry),
                name: userManageBaseInfo.userName,
                notes: userManageBaseInfo.comment,
                numOfSubAccounts: null,
                phoneNumber: userManageBaseInfo.phone,
                platforms: null,
                /* [{
                    name: '',
                    numOfFans: 0,
                }]*/
                quota: null,
                usage: null,
            }
        }

        return ApiSender.sendApi('[post]/account-entities', accountEntityObject).then((apiRes) => {
            // console.log('[post]/account-entities post', apiRes);
            return Promise.resolve();
        }).catch(new ApiError().catchAlertMsg());
    }
}

export class UserProfileFlow extends Control {
    constructor(stateModel) {
        super();
        console.log(`construct UserProfileFlow`);
        this.registControl('profile', new ProfileControl());
        this.registModel('stateModel', stateModel);
    }
    setup() {
        return {
            carry: true,
        }
    }
    ref() {
        return {
            profileT: true,
            // saveTipModal: 'TipModalControl',
        }
    }
    frame() {
        return {
            stateModel: UserProfileModel.name,
        }
    }
    circuit() {
        return {
            profile: ProfileControl.name,
            tip: true,
        }
    }

    bindRef(...args) {
        console.log(`bindRef ${args[0]}`);
        super.bindRef(...args);
    }

    onProfilePageMount() {
        const vm = this;
        // console.log('onProfilePageMount', this.fetchControl('profile'));

        this.initIndustryOptionList();

        this.fetchControl('profile').autoLoadUserProfile().then(() => {
            const accountId = vm.carry(selectProfileAccountId);

            return ApiSender.sendApi('[get]/account-entities/{id}', null, {
                apiInnerData: {
                    id: accountId,
                }
            });
        }).then((apiRes) => {

            // vm.fetchModel('stateModel').setAccountEntity(apiRes);
            vm.fetchModel('stateModel').saveAccountProfile(apiRes);
        }).catch(new ApiError().catchAlertMsg());

    }
    initIndustryOptionList() {
        // console.log('initIndustryOptionList');
        const vm = this;

        this.fetchModel('stateModel').setState('industryOptionListLoading', true);

        ApiSender.sendApi('[get]/industries', null).then((apiRes) => {
            /* {
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
            const industryOptionList = apiRes.rows.map((row) => {
                return {
                    value: `${row.id}`,
                    label: row.name,
                };
            });

            vm.fetchModel('stateModel').setState('industryOptionList', industryOptionList)
            vm.fetchModel('stateModel').setState('industryOptionListLoading', false);

            return Promise.resolve();

        }).catch(new ApiError().catchAlertMsg());
    }


    onFormSaved() {
        const vm = this;

        const t = this.fetchRef('profileT');

        this.fetchControl('tip').tip(t('form.checkIfSave')).then((action) => {
            if (action !== 'confirm') {
                return Promise.reject('cancel');
            }
            vm.saveProfile();
        }).catch((action) => {
            if (action === 'cancel') {
            }
        });
    }
    saveProfile() {
        const vm = this;
        const profileForm = this.fetchModel('stateModel').getProfileForm();
        /* profileForm: {
            account
            password
            userName
            industry
            phone
            role
        } */

        // 1.取得accountEntityId
        // const accountEntityId = vm.carry(selectAccountEntityId);

        // const accountEntityId = vm.carry(select     AccountId);
        const accountId = vm.carry(selectProfileAccountId);

        /*
        let apiReq = {
            "account": {
                "activated": null,
                "createdAt": null, // "2022-08-05T06:28:55.51129Z",
                // "email": profileForm.account, // profileForm.account, // account, // "himidi4359@aregods.com",
                "email": null,
                "enabled": null,
                "id": null,
                "lastLoginAt": null,
                "parentID": null,
                "password": profileForm.password ? profileForm.password : null,
                "phoneNumber": profileForm.phone,
                "updatedAt": null,
                "username": null, // "himidi_aaaa"
            },
            "entity": {
                "id": null,
                "name": profileForm.userName,
                // "industry": Number(profileForm.industry),
                // "industryID": Number(profileForm.industry),
                // "phoneNumber": profileForm.phone,
                "phoneNumber": null,
                "business": null,
                "agent": null,
                "notes": null,
                "industry": profileForm.industry ? Number(profileForm.industry) : null, // null
                // "industry": null,
                // "industryID": {
                //     "id": profileForm.industry ? Number(profileForm.industry) : null, // null
                // },
                "industryID": null,
                "numOfSubAccounts": null,
                "platforms": null,
                "program": null
            }
        }
        */
        let apiReq = {
            "account": {
                "password": profileForm.password ? profileForm.password : null,
                "phoneNumber": profileForm.phone,
            },
            "entity": {
                "name": profileForm.userName,
                "industryID": profileForm.industry ? Number(profileForm.industry) : null, // null
                // "business": profileForm.phone,
            }
        }

        ApiSender.sendApi('[put]/account-entities/{id}', apiReq, {
            apiInnerData: {
                id: accountId,
            }
        }).then((apiRes) => {
            return Promise.resolve();
        }).catch(new ApiError(function (error, next) {

            if (error === 'cancel') {
                // 不執行next，就不會跳Alert
                return;
            }
            console.error(error);

            next(); // 代表只開啟燈箱就結束
            // next(error); // 代表繼續將error往上拋
        }).catchAlertMsg());
    }
}

export class UserManageFlow extends BatchControl {
    constructor(...args) {
        super(...args);
        console.log(`UserManageFlow construct`);
        this.registControl('industry', new IndustryControl());
    }
    circuit() {
        return {
            industry: IndustryControl.name,
            confirm: true,
            notify: true,
        }
    }
    frame() {
        return {
            stateModel: UserManageModel.name,
        }
    }
    setup() {
        return {
            dispatch: true,
            carry: true,
        }
    }
    ref() {
        return {
            addUserModal: Modal.name,
            editUserModal: Modal.name,
            userTableT: true,
            // loadUser: true,
            urlQuery: true,
        }
    }
    onRowSelectCheckedChange(checked, cellInfo, cellMap) {
        console.log(`onRowSelectCheckedChange [${cellInfo.getRowIndex()}]${cellInfo.getRow().account}`)
        // cellMap: <CellMap>
        const selectedRowList = [];

        for (const cellInfo of cellMap) {
            if (cellInfo.getRowChecked()) {
                // 若有選取，則加入陣列
                selectedRowList.push(cellInfo.getRow());
            }
        }
        console.log('selectedRowList', selectedRowList)
        this.fetchModel('stateModel').setState('selectRowList', selectedRowList);

        // console.log('selectRowList',
        // this.fetchModel('stateModel').getState('selectRowList'));

    }
    onToggleSwitchChange(checked, cellInfo, cellMap) {
        // console.log('onToggleSwitchChange', checked, cellInfo, cellMap)
        const vm = this;

        const userTableT = this.fetchRef('userTableT');

        const row = cellInfo.getRow();

        // console.log(`onToggleSwitchChange[${row.accountId}]`, row.account);

        ApiSender.sendApi('[put]/account-entities/{id}/toggle-enabled', {
            enabled: checked,
        }, {
            apiInnerData: {
                id: row.accountId
            }
        }).then(() => {
            // '帳號已更新'
            vm.fetchControl('notify').notify(userTableT('haveToggleAccountEnableNotify'));

            // loadUser
            // console.log('onToggleSwitchChange over')
        }).catch(new ApiError().catchAlertMsg());

        /* function (error, next) {
            console.log('ccc error', error);

            // 重新載入當下的頁面
            loadUser(1, () => { });
        }*/

        // '帳號已更新'
        // fetchControl('notify').notify(t('haveToggleAccountEnableNotify'));
    }
    // 初始化表格內的資料
    onMountUserTable() {
        this.loadUsers(1, () => { });
    }
    loadUsers(newPage, unlock) {
        const vm = this;

        const stateModel = this.fetchModel('stateModel');
        const tableData = stateModel.getState('tableData');
        const tableHeader = stateModel.getState('tableHeader');

        // const urlQuery = this.fetchRef('urlQuery');
        // console.log('loadUsers urlQuery', urlQuery)

        // console.log('loadUsers tableData', tableData)

        // // 讓industryFilter內部自動呼叫API來初始化參數
        // industryFilter.autoReady().then(() => {
        vm.autoLoadIndustryOptionList().then(() => {

            return ApiSender.sendApi('[get]/account-entities', {
                page: newPage, // API的page參數從1開始
                pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
            });
        }).then((apiRes) => {
            // 將newTableData內的page參數更新到urlQuery上
            // .navigateUrlQuery(urlQuery) ==> 會導致page被重刷的BUG
            // 之後要把urlQuery的取得，塞到底下去


            stateModel.setState('tableData', new TableData(apiRes, 'crossbot', tableHeader));
            // actTableData(new TableData(apiRes, 'crossbot', tableHeader).navigateUrlQuery(urlQuery));
            unlock();
        }).catch(new ApiError(function (error, next) {
            unlock();
            next(); // 開啟Alert燈箱
        }).catchAlertMsg());
    }
    onPageChange(newPage, unlock) {
        // console.log('onPageChange', newPage)
        // console.log('onPageChange unlock', unlock)

        this.loadUsers(newPage, unlock);
    }
    refreshTable() {
        const stateModel = this.fetchModel('stateModel');
        const tableData = stateModel.getState('tableData');
        // const tableHeader = stateModel.getState('tableHeader');

        this.loadUsers(tableData.getNowPage(), () => { });
    }
    autoLoadIndustryOptionList() {
        const vm = this;
        vm.fetchModel('stateModel').setState('industryOptionListLoading', true);
        return this.fetchControl('industry').autoLoad().then(() => {
            // const industryOptionList = vm.carry(selectIndustryOptionList);
            const industryOptionList = [];

            vm.fetchModel('stateModel').setState('industryOptionList', industryOptionList);
            vm.fetchModel('stateModel').setState('industryOptionListLoading', false);

            return Promise.resolve();
        });
    }
    // 開啟「新增使用者」
    onClickAddUser() {
        // 清空資料
        this.dispatch(updateUserManageBaseInfo(null));

        // 自動載入產業列表
        this.autoLoadIndustryOptionList();

        // 優先開啟燈箱，避免UI沒反應
        this.fetchRef('addUserModal').openModal();
    }
    onClickRemoveUser() {
        const vm = this;
        const selectRowList = this.fetchModel('stateModel').getState('selectRowList');
        console.log('selectRowList', selectRowList)
        const t = this.fetchRef('userTableT');

        const firstRow = selectRowList[0] || { userName: '' };

        // const loadUsers = this.fetchRef('loadUser');

        // `確認要刪除『${selectRow.userName}』用戶？`
        this.fetchControl('confirm')
            .confirm(`${t('confirmDeleteA')}${firstRow.account}...${t('confirmDeleteB')}`)
            .then((action) => {
                if (action !== 'confirm') {
                    return Promise.resolve();
                }
                // 批次執行removeUser
                return vm.batchWork(selectRowList, row => row.accountId, this.removeUser).then(() => {
                    // 刷新表格
                    vm.loadUsers(1, () => { });
                });
            });
    }
    // 刪除單一筆使用者
    removeUser(accountId) {
        return ApiSender.sendApi('[delete]/account-entities/{id}', null, {
            apiInnerData: {
                id: accountId,
            }
        }).then((apiRes) => {
            return Promise.resolve();
        }).catch(new ApiError().catchAlertMsg());
    }
    // 開啟「編輯使用者」
    onCellButtonClickEdit(cellInfo) {
        const userRow = cellInfo.getRow();

        const vm = this;

        this.fetchRef('editUserModal').openModal();

        // 自動載入產業列表
        this.autoLoadIndustryOptionList();

        ApiSender.sendApi('[get]/account-entities/{id}', null, {
            apiInnerData: {
                id: userRow.accountId,
            }
        }).then((apiRes) => {
            vm.dispatch(updateUserManageBaseInfo(apiRes));
        });
    }
    onSubmitEditUser() {
        const vm = this;
        /*
        let apiReq = {
            "account": {
                "activated": null,
                "createdAt": null, // "2022-08-05T06:28:55.51129Z",
                "email": this.carry(selectAccount), // account, // "himidi4359@aregods.com",
                "enabled": null,
                "id": null,
                "lastLoginAt": null,
                "parentID": null,
                "password": this.carry(selectPassword),
                "phoneNumber": this.carry(selectPhone),
                "updatedAt": null,
                "username": this.carry(selectUserName), // "himidi_aaaa"
            },
            "entity": {
                "id": null,
                "name": this.carry(selectUserName),
                "industryID": Number(this.carry(selectIndustry)),
                "phoneNumber": this.carry(selectPhone),
                "business": this.carry(selectSales),
                "agent": this.carry(selectAgent),
                "notes": this.carry(selectComment),
                "industry": null,
                // "industry": {
                //     "id": Number(this.carry(selectIndustry)),
                // },
                "numOfSubAccounts": null,
                "platforms": null,
                "program": null
            }
        }*/
        let apiReq = {
            "account": {
                "password": this.carry(selectPassword) || null,
                "phoneNumber": this.carry(selectPhone),
            },
            "entity": {
                "name": this.carry(selectUserName),
                "industryID": Number(this.carry(selectIndustry)),
                "business": this.carry(selectSales),
                "agent": this.carry(selectAgent),
                "notes": this.carry(selectComment),
            }
        }

        return ApiSender.sendApi('[put]/account-entities/{id}', apiReq, {
            apiInnerData: {
                id: this.carry(selectAccountId),
            }
        }).then(() => {
            this.fetchRef('editUserModal').closeModal();
            // 刷新表格
            vm.refreshTable();
        }).catch(new ApiError().catchAlertMsg());

        /*
                manageUserFlowEdit.setUserManageBaseInfo(userManageBaseInfo);
                manageUserFlowEdit.updateUserData().then((apiRes) => {
                    editUserModalRef.closeModal();
        
                    // 刷新表格
                    setUserRefreshTrigger(!userRefreshTrigger);
                });
                */
    }
    // 開啟模組
    onCellButtonClickModule(cellInfo) {
        this.onCellButtonClickEdit(cellInfo);
    }

}


/* userRow: {
    "userName": "YDG",
    "account": "ficiya6149@deitada.com",
    "industry": 2,
    "userRole": "user",
    "createTime": "2022-10-06T06:41:44.349826Z",
    "subUserNum": 0,
    "lineAtUserNum": [{ "name": "Facebook", "numOfFans": 0 }],
    "fbUserNum": [{"name": "Facebook", "numOfFans": 0 },{ "name": "LINE", "numOfFans": 0 },{ "name": "Instagram", "numOfFans": 0 },{ "name": "WeChat", "numOfFans": 0}],
    "igUserNum": [{"name": "Facebook", "numOfFans": 0 },{ "name": "LINE", "numOfFans": 0 },{ "name": "Instagram", "numOfFans": 0 },{ "name": "WeChat", "numOfFans": 0}],
    "quantityPlan": null,
    "expiredTime": null,
    "overUserNum": {
        "quota": null,
        "usage": null,
        "dueDate": null
    },
    "accountEnable": true,
    "accountId": 23,
    "accountEntityId": 18,
    "__originRow": {
        "account": {
            "id": 24,
            "email": "ficiya6149@deitada.com",
            "username": "YDG",
            "enabled": true,
            "role": "user",
            "activated": true,
            "phoneNumber": "0987654321",
            "lastLoginAt": null,
            "parentID": null,
            "createdAt": "2022-10-06T06:41:44.349826Z",
            "updatedAt": "2022-10-07T02:11:43.002939Z"
        },
        "entity": {
            "id": 19,
            "name": "YDG",
            "industry": {
                "id": 2,
                "name": "餐飲"
            },
            "business": "YYYC001",
            "agent": "YYY001",
            "notes": "YYYYYY",
            "platforms": [
                {
                "name": "Facebook",
                "numOfFans": 0
                },
                {
                "name": "LINE",
                "numOfFans": 0
                },
                {
                "name": "Instagram",
                "numOfFans": 0
                },
                {
                "name": "WeChat",
                "numOfFans": 0
                }
            ],
            "program": {
                "quota": null,
                "usage": null,
                "dueDate": null
            },
            "industryID": 2,
            "numOfSubAccounts": 0,
            "phoneNumber": "0987654321"
        },
        "isPrimary": true
    }
} */