import { TableSelectModeEnum } from "enum/Table";
import RoleFilter from "filter/RoleFilter";
import TimeFilter from "filter/TimeFilter";
import StateModel from "model/StateModel";
import TableData from "util/TableData";
import TableHeader from "util/TableHeader";
import PasswordValidator from "validator/PasswordValidator";

const platformFilter = platformName => platforms => {
    /* "platforms": [
    {
        "name": "Facebook",
        "numOfFans": 0
    },
    {
        "name": "Line", 
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
],*/
    // console.log('platforms', platforms)
    if (!platforms) {
        console.error(`platformFilter: platforms not exist`);
        return '';
    }
    const platformObj = platforms.find(obj => obj.name === platformName);
    return platformObj ? platformObj.numOfFans : '';
}



export class UserProfileModel extends StateModel {
    data(initObj = {}) {
        return {
            industryOptionList: [],
            industryOptionListLoading: false,
            // -----------------------------------
            account: '',
            password: '',
            userName: '',
            industry: '',
            phone: '',
            role: '',
            // ------------------------------------
            passwordComment: '',
            passwordValid: true,
            passwordValidator: new PasswordValidator(initObj.passwordT),
        }
    }
    sight() {
        return {
            password: {
                passwordComment: true,
                passwordValid: true,
            }
        }
    }
    watch() {
        return {
            password: function (password) {
                // console.log(`watch password`, password)

                const passwordValidator = this.getState('passwordValidator');

                if (!password) { // 空字串時，代表不改密碼，valid為true
                    this.setState('passwordComment', '');
                    this.setState('passwordValid', true);
                    return;
                }

                const passwordValid = passwordValidator.validate(password);
                this.setState('passwordValid', passwordValid);

                const validateComment = passwordValidator.getValidateComment(password);
                this.setState('passwordComment', validateComment);
            }
        }
    }
    saveAccountProfile(apiRes) {
        this.setState('account', apiRes.account.email || '');
        this.setState('password', '');
        this.setState('userName', apiRes.entity.name || ''); // apiRes.account.username

        this.setState('industry', `${apiRes.entity.industry.id}` || '');

        this.setState('phone', apiRes.account.phoneNumber || '');

        this.setState('role', apiRes.account.role || ''); // 'admin', 'user', 'subUser', 'premiumUser', 'developer'
    }
    /*
    setAccountEntity(apiRes) {
        this.setState('account', apiRes.account.email || '');
        // console.log(`account`, apiRes.account.email);
        this.setState('password', '');
        this.setState('userName', apiRes.account.username || '');
        // console.log(`userName`, apiRes.account.username);

        this.setState('industry', apiRes.entity.industryID || '');
        // console.log(`industry`, apiRes.entity.industryID);

        this.setState('phone', apiRes.account.phoneNumber || '');
        // console.log(`phone`, apiRes.account.phoneNumber);

        this.setState('role', apiRes.account.role || ''); // 'admin', 'user', 'subUser', 'premiumUser', 'developer'
        // console.log(`role`, apiRes.account.role);
    }*/
    getProfileForm() {
        return {
            account: this.getState('account'),
            password: this.getState('password'),
            userName: this.getState('userName'),
            industry: this.getState('industry'),
            phone: this.getState('phone'),
            role: this.getState('role'),
        }
    }
}


// 使用者列表

const getUserTableHeader = function (t) {
    const tableHeader = new TableHeader({
        rowSelect: {
            // mode: 'singleSelect', // 代表只能單選
            mode: TableSelectModeEnum.multi,
        },
        upperHeader: {
            bindUserNum: { // <key>
                // key: 'bindUserNum',
                label: t('bindedUserNum'), // '已綁定用戶數',
                type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
            },
        },
        headerExtra: [{ // 額外要載入的欄位
            key: 'accountId',
            fetch: 'account.id',
        }, {
            key: 'accountEntityId',
            fetch: 'entity.id',
        }],
        buttonColumn: {
            action: { // <key> ==> 'action'
                buttonItemList: [{
                    type: 'button',
                    label: t('edit'), // '編輯',
                    event: 'edit',
                    buttonType: 'fill',
                    buttonMode: 'primary',
                    buttonPattern: 'buttonColumn',
                    visibleChecker: function (rowData) {
                        return true;
                    },
                }, {
                    type: 'button',
                    label: t('module'), // '模組',
                    event: 'module',
                    buttonType: 'fill',
                    buttonMode: 'primary',
                    buttonPattern: 'buttonColumn',
                }],
            }
        },
        header: [{
            label: '',
            key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
            type: 'checkBox',
            // mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
        }, {
            label: t('userName'), //  '用戶名稱',
            key: 'userName',
            type: 'text',
            fetch: 'account.username',
        }, {
            label: t('account'), //  '帳號',
            key: 'account',
            type: 'text',
            fetch: 'account.email',
        }, {
            label: t('industry'), //  '產業',
            key: 'industry',
            type: 'text',
            // filter: 'industry', // 自動採用指定filter函式
            // fetch: 'entity.industry.name',

            // filter: industryFilter, // 要補
            fetch: 'entity.industry.id',
            filter(val) {
                return val; // 要補
            }
        }, {
            label: t('userRole'), //  '用戶角色',
            key: 'userRole',
            type: 'text',
            filter: new RoleFilter('roleName'),
            fetch: 'account.role',
        }, {
            label: t('createTime'), //  '創建時間',
            key: 'createTime',
            type: 'text',
            filter: 'time',
            fetch: 'account.createdAt',
        }, {
            label: t('subAccountNum'), //  '子帳號數',
            key: 'subUserNum',
            type: 'text',
            fetch: 'entity.numOfSubAccounts',
        }, {
            label: 'LINE@', // 已綁定用戶數 - LINE@
            key: 'lineAtUserNum',
            type: 'text',
            upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            fetch: 'entity.platforms',
            // filter: new ArrayFilter('objectArray', 'name', 'LINE', 'numOfFans'),
            // { "name": "Facebook", "numOfFans": 0 } ==> 0
            filter: platformFilter('Line'),
        }, {
            label: 'FB',
            key: 'fbUserNum',
            type: 'text',
            upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            fetch: 'entity.platforms',
            // filter: new ArrayFilter('objectArray', 'name', 'Facebook', 'numOfFans'),
            filter: platformFilter('Facebook'),
        }, {
            label: 'IG',
            key: 'igUserNum',
            type: 'text',
            upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            fetch: 'entity.platforms',
            // filter: new ArrayFilter('objectArray', 'name', 'Instagram', 'numOfFans'),
            /* "platforms": [
                {
                    "name": "Facebook",
                    "numOfFans": 0
                },
                {
                    "name": "Line", 
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
            ],*/
            filter: platformFilter('Instagram'),
        }, {
            label: t('quotaPlan'), //  '用量方案',
            key: 'quantityPlan',
            type: 'text',
            fetch: 'entity.program.quota',
            filter: function (val) {
                return val == null ? '-' : val;
            },
        }, {
            label: t('expiredTime'), //  '到期時間',
            key: 'expiredTime',
            type: 'text',
            fetch: 'entity.program.dueDate',
            filter: new TimeFilter('date', '-'),
        }, {
            label: t('overQuotaUserNum'), //  '超量人數',
            key: 'overUserNum',
            type: 'text',
            fetch: 'entity.program',
            filter: function (program) {
                //  program: {
                //     "quota": null,
                //     "usage": null,
                //     "dueDate": null
                // }
                if (!program) {
                    return '';
                }

                if (!program.quota || !program.usage) {
                    return '-';
                }

                return Math.max(program.usage - program.quota, 0);
            },
        }, {
            label: t('enableOrDisable'), //  '開通/停用',
            key: 'accountEnable',
            type: 'toggleSwitch',
            fetch: 'account.enabled',
            // filter: function (enabled) {
            //     // 還要再串上參數
            //     return true;
            // }
        }, {
            label: t('action'), //  '操作',
            key: 'action',
            type: 'buttonColumn',
            buttonColumnRef: 'action',
            width: '300px',
        }],
    });
    return tableHeader;
}


export class UserManageModel extends StateModel {
    data(initObj = {}) {

        return {
            selectRowList: [],
            industryOptionList: [],
            industryOptionListLoading: false,

            removeBtnDisabled: true,

            tableData: new TableData(null, 'default'),

            tableHeader: getUserTableHeader(initObj.t || (val => val)),
        };
    }
    sight() { // 用來設定watch可存取的範圍
        return {
            selectRowList: {
                removeBtnDisabled: true,
            }
        }
    }
    watch() {
        return {
            selectRowList: function (rowList) {
                // console.log(`watch selectRowList`, rowList)
                if (!rowList) {
                    this.setState('removeBtnDisabled', true);
                    return;
                }
                if (rowList.length === 0) { // 未選取
                    this.setState('removeBtnDisabled', true);
                    return;
                } else {
                    this.setState('removeBtnDisabled', false);
                }
            }
        }
    }
    // addSelectRow
}