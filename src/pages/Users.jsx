/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

import { useSelector, useDispatch } from "react-redux";

import { useTranslation } from "react-i18next";

import { PageTitle } from "module/layout"

import InputText from "component/InputText";
import FilterPanel from "component/FilterPanel"
import { FilterPanelDash } from "component/FilterPanel"
import DatePicker from "component/DatePicker"
import Button from "component/Button"

import Table from "component/Table"

import ManageUserModal from "element/Users/ManageUserModal"

import Notification from "component/Notification"

import { modal as modalThemeObject } from 'theme/reas'
import TableHeader from "util/TableHeader"

import IndustryFilter from "filter/IndustryFilter"
import TimeFilter from "filter/TimeFilter";
import RoleFilter from "filter/RoleFilter";

import { UserManageFlow } from "flow/users"

import { useUrlQuery } from "util/UrlQuery";
import { UserManageModel } from 'fragment/Users';
import { TableSelectModeEnum } from 'enum/Table';

let industryFilter = new IndustryFilter('industry');
let dateFilter = new TimeFilter('date', '-');
// dateFilter.setDefaultOutput('')

const UsersFilterPanel = () => {
    // const inputTextPanelStyle = {
    //     height: '2.3rem',
    //     width: '220px',
    //     marginLeft: '0.5rem',
    //     marginRight: '0.5rem',
    //     marginTop: '0.5rem',
    //     marginBottom: '0.5rem'
    // };
    const [userName, setUserName] = useState('');
    const [account, setAccount] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleQuery = () => () => {
        console.log('handleQuery', userName, account, startDate, endDate)
    }

    const { t } = useTranslation('users', { keyPrefix: 'panel' });

    return (
        <FilterPanel>
            {/*用戶名稱*/}
            <InputText placeholder={t('userName')} pattern="query" value={userName} onUpdate={setUserName} />
            {/*帳號*/}
            <InputText placeholder={t('account')} pattern="query" value={account} onUpdate={setAccount} />

            {/*開始日期*/}
            <DatePicker placeholder={t('startDate')} pattern="query" onUpdate={setStartDate}></DatePicker>

            <FilterPanelDash>-</FilterPanelDash>
            {/*結束日期*/}
            <DatePicker placeholder={t('endDate')} pattern="query" onUpdate={setEndDate}></DatePicker>
            {/* 篩選 */}
            <Button type="fill" mode="default" pattern="query" onClick={handleQuery()}>{t('query')}</Button>
        </FilterPanel>
    );
}

const UsersTable = ({ fetchControl, control, model }) => {
    // userRefreshTrigger
    if (!(model instanceof UserManageModel)) {
        console.error(`model is not UserManageModel`);
        return (<div></div>)
    }
    if (!(control instanceof UserManageFlow)) {
        console.error(`control is not UserManageFlow`);
        return (<div></div>)
    }

    const { t } = useTranslation('users', { keyPrefix: 'table' });

    const tableHeader = model.getState('tableHeader');
    /*
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
            filter: industryFilter,
            fetch: 'entity.industry.id',
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
            filter: new ArrayFilter('objectArray', 'name', 'LINE', 'numOfFans'),
            // { "name": "Facebook", "numOfFans": 0 } ==> 0
        }, {
            label: 'FB',
            key: 'fbUserNum',
            type: 'text',
            upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            fetch: 'entity.platforms',
            filter: new ArrayFilter('objectArray', 'name', 'Facebook', 'numOfFans'),
        }, {
            label: 'IG',
            key: 'igUserNum',
            type: 'text',
            upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            fetch: 'entity.platforms',
            filter: new ArrayFilter('objectArray', 'name', 'Instagram', 'numOfFans'),
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
            filter: dateFilter,
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
    }); */

    // const urlQuery = useUrlQuery();
    // // console.log('registRef urlQuery', urlQuery)
    // control.registRef('urlQuery', urlQuery);

    // new TableData(null, 'default').applyUrlQueryParam(urlQuery)
    const [tableData, setTableData] = useState(model.getState('tableData'));
    let actTableData = model.reactive('tableData', 'UsersUserTable', setTableData);

    /*
    function loadUsers(newPage, unlock) {

        // 讓industryFilter內部自動呼叫API來初始化參數
        industryFilter.autoReady().then(() => {

            return ApiSender.sendApi('[get]/account-entities', {
                page: newPage, // API的page參數從1開始
                pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
            });
        }).then((apiRes) => {
            // 將newTableData內的page參數更新到urlQuery上
            actTableData(new TableData(apiRes, 'crossbot', tableHeader).navigateUrlQuery(urlQuery));
            unlock();
        }).catch(new ApiError(function (error, next) {
            unlock();
            next(); // 開啟Alert燈箱
        }).catchAlertMsg());
    }
    */


    // 註冊進ref，讓control可以直接呼叫loadUser
    // control.registRef('loadUser', loadUsers);

    // 換頁事件，代表要load新的頁面
    // const onPageChange = function () {
    //     control.onPageChange();
    // };
    // const onPageChange = function () {
    //     return loadUsers.bind(null);
    // }

    // // 刷新User表格
    // useEffect(function () {
    //     // 初始化 & Trigger刷新當前頁面
    //     loadUsers(tableData.getNowPage(), () => { });
    // }, [userRefreshTrigger]);

    const onCheckedChange = () => (checked, cellInfo, cellMap) => {

        const headerKey = cellInfo.getHeaderKey();
        if (headerKey === '__rowSelect') {
            // 預設的列選取
            control.onRowSelectCheckedChange(checked, cellInfo, cellMap);
        } else if (headerKey === 'accountEnable') {
            control.onToggleSwitchChange(checked, cellInfo, cellMap);
        }
    }

    const onButtonClick = () => (event, cellInfo) => {
        if (event === 'edit') {
            control.onCellButtonClickEdit(cellInfo);
        } else if (event === 'module') {
            control.onCellButtonClickModule(cellInfo);
        }
    }

    return (
        <Table header={tableHeader} data={tableData} onCheckedChange={onCheckedChange()} onPageChange={control.bindAct('onPageChange')}
            pageChangeLock onButtonClick={onButtonClick()}>
            <Button type="table" mode="default" onClick={control.bindAct('onClickAddUser')}>{t('addUser')}</Button>
            <Button type="table" mode="default" onClick={control.bindAct('onClickRemoveUser')}
                disabled={model.fetchRef('removeBtnDisabled', 'UsersTable')} srcKey="removeUserButton">{t('removeUser')}</Button>
        </Table>
    );
}


function UsersPage({ fetchControl, userManageControl, userManageModel }) {
    const translationMenu = useTranslation('menu', { keyPrefix: 'system' });
    const { t } = useTranslation('users', { keyPrefix: 'manage' });


    const urlQuery = useUrlQuery();
    userManageControl.registRef('urlQuery', urlQuery);

    useEffect(function () {
        userManageControl.onMountUserTable();
    }, [])

    const [showTab, setShowTab] = useState('profile');

    const onUserManageSave = modalType => () => {
        if (modalType === 'add') {
        } else if (modalType === 'edit') {
            userManageControl.onSubmitEditUser();
        }
    }
    return (
        <PageTitle title={translationMenu.t('accountList')}>
            <UsersFilterPanel></UsersFilterPanel>
            <UsersTable fetchControl={fetchControl}
                control={userManageControl} model={userManageModel}></UsersTable>

            {/* "新增用戶" */}
            <ManageUserModal modalType="add" title={t('addUser')}
                setOpenModalRef={userManageControl.bindRef('addUserModal')}
                onSave={onUserManageSave('add')} theme={modalThemeObject}
                industryOptionList={userManageModel.fetchRef('industryOptionList', 'ManageUserModalAdd')}
                industryOptionListLoading={userManageModel.fetchRef('industryOptionListLoading', 'ManageUserModalAdd')}
            ></ManageUserModal>
            {/* "編輯用戶" */}
            <ManageUserModal modalType="edit" title={t('editUser')}
                setOpenModalRef={userManageControl.bindRef('editUserModal')}
                onSave={onUserManageSave('edit')} showTab={showTab}
                theme={modalThemeObject}
                industryOptionList={userManageModel.fetchRef('industryOptionList', 'ManageUserModalEdit')}
                industryOptionListLoading={userManageModel.fetchRef('industryOptionListLoading', 'ManageUserModalEdit')}
            ></ManageUserModal>
        </PageTitle>
    );
}



export default function Users({ fetchControl }) {

    const { t: userTableT } = useTranslation('users', { keyPrefix: 'table' });

    const userManageModel = new UserManageModel(useRef(null), { t: userTableT });
    const userManageControl = new UserManageFlow();
    userManageControl.registModel('stateModel', userManageModel);
    userManageControl.bindFetchControl(fetchControl);
    userManageControl.registRef('userTableT', userTableT);

    return (
        <UsersPage fetchControl={fetchControl} userManageControl={userManageControl}
            userManageModel={userManageModel}></UsersPage>
    )
}