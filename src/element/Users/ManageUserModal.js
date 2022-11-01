import Modal from 'component/Modal'
import { useState, useEffect } from 'react';
import styled from 'styled-components'
import InputText from 'component/InputText';
import Button from 'component/Button';
import Select from 'component/Select'
import Table from 'component/Table'
import TableData from 'util/TableData';
import { fetchTheme } from 'util/ThemeMixin'
import TableHeader from 'util/TableHeader';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, connect } from 'react-redux';

import {
    selectAccount, selectPassword, selectUserName,
    selectIndustry, selectPhone, selectComment,
    selectAgent, selectSales,
    // selectIndustryOptionList,
    updateAccount, updatePassword, updateUserName,
    updateIndustry, updatePhone, updateComment,
    updateAgent, updateSales,
    selectSystemPermissionList, updateSystemAuthTablePage,
    selectSystemAuthTablePageSize, selectSystemAuthTablePage
} from 'store/user';

const ManageUserModal = ({ setOpenModalRef, className, title, onSave,
    modalType, showTab, industryOptionList, industryOptionListLoading }) => { // userFlow, 

    const { t } = useTranslation('users', { keyPrefix: 'manage' });

    if (!title) {
        title = t('addOrEditUser'); // "新增/編輯"
    }

    if (!setOpenModalRef) {
        setOpenModalRef = () => { }
    }

    const dispatch = useDispatch();

    const account = useSelector(selectAccount);
    const password = useSelector(selectPassword);
    const userName = useSelector(selectUserName);
    const industry = useSelector(selectIndustry);
    const phone = useSelector(selectPhone);
    const comment = useSelector(selectComment);
    const agent = useSelector(selectAgent);
    const sales = useSelector(selectSales);

    const setAccount = val => dispatch(updateAccount(val));
    const setPassword = val => dispatch(updatePassword(val));
    const setUserName = val => dispatch(updateUserName(val));
    const setIndustry = val => dispatch(updateIndustry(val));
    const setPhone = val => dispatch(updatePhone(val));
    const setComment = val => dispatch(updateComment(val));
    const setAgent = val => dispatch(updateAgent(val));
    const setSales = val => dispatch(updateSales(val));

    // const industryOptionListInit = [{
    //     key: 'catering',
    //     label: '餐飲業',
    // }, {
    //     key: 'warehousing',
    //     label: '倉儲業',
    // }, {
    //     key: 'logistics',
    //     label: '物流業',
    // }, {
    //     key: 'ecommerce',
    //     label: '電商',
    // }, {
    //     key: 'software',
    //     label: '軟體業',
    // }];

    // const [industryOptionList, setIndustryOptionList] = useState([]);
    // const industryOptionList = useSelector(selectIndustryOptionList);

    // ps.[錯誤的寫法]載api初始化的工作要調至上層，Modal層只能放View的結構

    // const initIndustryOptionList = function (optionList) {
    //     setIndustryOptionList(optionList);
    // }
    // const onModalOpen = () => () => {
    //     // 在開啟時，都重新去取industryOptionList資料
    //     industryFilter.autoReady(initIndustryOptionList).catch(new ApiError().catchAlertMsg());
    // }

    // ps.[錯誤的寫法]Modal不可以使用useEffect寫法，因為每次開啟Modal時，都會重新跑一次render
    // 會導致執行完setIndustryOptionList以後，又被render洗回預設值

    // --->Modal不能這樣寫，因為Modal時常會重新render
    // useEffect(function () {
    //     industryFilter.autoReady(initIndustryOptionList).catch(new ApiError().catchAlertMsg());
    // }, []);


    if (!showTab) {
        showTab = 'profile';
    }
    const [tabStatus, setTabStatus] = useState(showTab);

    useEffect(function () {
        setTabStatus(showTab);
    }, [showTab]);

    const changeTab = tab => () => {
        setTabStatus(tab);
    }

    const saveUser = () => () => {
        onSave();
    }

    // userAuth --------------------------------------------

    const permisstionTranslation = useTranslation('setting', { keyPrefix: 'defaultAuth' })
    const pt = permisstionTranslation.t;

    const userAuthTableHeader = new TableHeader({
        header: [{
            label: t('moduleName'), // '名稱',
            key: 'resourceName',
            type: 'text',
            filter: function (resourceName) {
                return pt(resourceName);
            }
            // }, {
            //     label: t('category'), // '類別',
            //     key: 'category',
            //     type: 'text',
            // }, {
            //     label: t('startTime'), // '開始時間',
            //     key: 'startTime',
            //     type: 'text',
            //     filter: 'time',
            // }, {
            //     label: t('endTime'), //  '結束時間',
            //     key: 'endTime',
            //     type: 'text',
            //     filter: 'time',
        }, {
            label: t('accountEnable'), //  '操作權限',
            key: 'enabled',
            type: 'text',
            filter: function (val) {
                return val ? 'ON' : 'OFF';
            }
        }],
    });

    const systemPermissionList = useSelector(selectSystemPermissionList);
    const systemAuthTablePageSize = useSelector(selectSystemAuthTablePageSize);
    const systemAuthTablePage = useSelector(selectSystemAuthTablePage);

    // ps.Modal內部只負責管view render，不負責Control，換頁控制丟給Redux去處理
    // 一旦使用Modal，所有參數主導權都放在Redux。
    // Modal內的表格，只依照Redux給的參數進行Render，實現單純的View功能
    const userAuthTableDataInit = {
        page: systemAuthTablePage,
        pageSize: systemAuthTablePageSize,
        data: systemPermissionList,
        // data: [{
        //     moduleName: '訊息推播',
        //     category: '社群管理',
        //     startTime: '2022-07-19T09:15:16.859Z',
        //     endTime: '2022-07-19T09:15:16.859Z',
        //     accountEnable: false,
        // }],
    }
    const userAuthTableData = new TableData(userAuthTableDataInit, 'static');

    const userAuthTableChange = function (newPage) {
        dispatch(updateSystemAuthTablePage(newPage));
    }

    // moduleAuth -----------------------------------

    const moduleAuthTableHeader = new TableHeader({
        header: [{
            label: t('moduleName'), //  '名稱',
            key: 'moduleName',
            type: 'text',
        }, {
            label: t('category'), //  '類別',
            key: 'category',
            type: 'text',
        }, {
            label: t('startTime'), // '開始時間',
            key: 'startTime',
            type: 'text',
            filter: 'time',
        }, {
            label: t('endTime'), // '結束時間',
            key: 'endTime',
            type: 'text',
            filter: 'time',
        }, {
            label: t('accountEnable'), //  '操作權限',
            key: 'accountEnable',
            type: 'toggleSwitch',
        }],
    });

    const moduleAuthTableDataInit = {
        page: 1,
        totalPage: 1,
        data: [{
            moduleName: '訊息推播',
            category: '社群管理',
            startTime: '2022-07-19T09:15:16.859Z',
            endTime: '2022-07-19T09:15:16.859Z',
            accountEnable: false,
        }],
    }

    // const [moduleAuthTableData, setModuleAuthTableData] = useState(new TableData(moduleAuthTableDataInit, 'default'));
    const moduleAuthTableData = new TableData(moduleAuthTableDataInit, 'default', moduleAuthTableHeader);

    // onModalOpen={onModalOpen()}
    return (
        <Modal childRef={ref => (setOpenModalRef(ref))}
            modalWidth={700} modalHeight={700}>
            <div className={className}>
                <div className="manage-user-title">{title}</div>
                <div className="manager-user-container">
                    <div className="manager-user-tab-row">
                        <div className={`manager-user-tab ${tabStatus === 'profile' ? 'active' : ''}`} onClick={changeTab('profile')}>
                            {t('baseInformation')} {/* 基本資料 */}
                        </div>
                        <div className={`manager-user-tab ${tabStatus === 'userAuth' ? 'active' : ''}`} onClick={changeTab('userAuth')}>
                            {t('userAuth')}{/* 用戶權限 */}
                        </div>
                        <div className={`manager-user-tab ${tabStatus === 'moduleAuth' ? 'active' : ''}`} onClick={changeTab('moduleAuth')}>
                            {t('moduleAuth')}{/* 模組權限 */}
                        </div>
                    </div>
                    <div className="manage-user-profile" style={{
                        display: tabStatus === 'profile' ? 'flex' : 'none',
                    }}>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('account')}{/* 帳號 */}
                            </div>
                            <div className="item-content">
                                <InputText value={account} onUpdate={setAccount}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                            </div>
                            <div className="item-content">
                                {t('plsInputAccount')} {/* 請輸入Email作為登入帳號 */}
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('userPassword')} {/* 用戶密碼 */}
                            </div>
                            <div className="item-content">
                                <InputText value={password} onUpdate={setPassword}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('userName')} {/* 用戶名稱 */}
                            </div>
                            <div className="item-content">
                                <InputText value={userName} onUpdate={setUserName}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('industry')} {/* 產業 */}
                            </div>
                            <div className="item-content">
                                <Select value={industry} optionList={industryOptionList}
                                    onUpdate={setIndustry} loading={industryOptionListLoading}></Select>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('phone')} {/* 聯繫電話 */}
                            </div>
                            <div className="item-content">
                                <InputText value={phone} onUpdate={setPhone}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('comment')}{/* 備註 */}
                            </div>
                            <div className="item-content">
                                <InputText value={comment} onUpdate={setComment}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('agent')} {/* 所屬代理商 */}
                            </div>
                            <div className="item-content">
                                <InputText value={agent} onUpdate={setAgent}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('sales')} {/* 所屬業務 */}
                            </div>
                            <div className="item-content">
                                <InputText value={sales} onUpdate={setSales}></InputText>
                            </div>
                        </div>
                    </div>
                    <div className="manage-user-auth" style={{
                        display: tabStatus === 'userAuth' ? 'flex' : 'none',
                    }}>
                        <Table header={userAuthTableHeader} data={userAuthTableData} view={{
                            panel: false,
                        }} onPageChange={userAuthTableChange}>
                        </Table>
                    </div>
                    <div className="manage-module-auth" style={{
                        display: tabStatus === 'moduleAuth' ? 'flex' : 'none',
                    }}>
                        <Table header={moduleAuthTableHeader} data={moduleAuthTableData}>
                        </Table>
                    </div>
                    <div className="save-button-row">
                        <Button type="fill" onClick={saveUser()}>
                            {t('save')}  {/* 儲存 */}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const ManageUserModalInnerStyled = styled(ManageUserModal)`
display: flex;
flex-direction: column;
width: 700px;
/* height: 700px; */
min-height: 700px;

    .manage-user-title {
        display: flex;
        flex-direction: row;
        width: 100%;
        /* margin: 0.5rem 1rem; */

        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        box-sizing: border-box;

        /* background-color: #c2c2c2; */
    }

    .manager-user-container {
        display: flex;
        flex-direction: column;
        
        width: 100%;
        margin: 0.5rem 1rem;

        /* padding: 1rem; */

        .manager-user-tab-row {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .manager-user-tab {
                display: flex;
                justify-content: center;
                align-items: center;

                /* padding: 0.5rem 1rem; */

                width: 100px;
                height: 38px;

                cursor: pointer;
                /* box-sizing: border-box; */
            }
            .manager-user-tab.active {
                border-bottom: 4px solid ${fetchTheme('tabBottom', '#1c7575')};
                /* background-color: red; */
                transform: translateY(2px);
            }
        }

        /* 基本資料 */
        .manage-user-profile {
            display: flex;
            flex-direction: column;

            margin-top: 30px;

            .profile-item-row {
                display: flex;
                flex-direction: row;
                .item-title {
                    width: 180px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    margin: 0.5rem 0.5rem;
                }
                .item-content {
                    margin: 0.5rem 0.5rem;

                }
            }
        }

        /* 用戶權限 */
        .manage-user-auth {

        }

        /* 模組權限 */
        .manage-module-auth {

        }

        .save-button-row {
            display: flex;
            flex-direction: row;

            justify-content: center;
            align-items: center;
            
        }
        
    }

`



export default ManageUserModalInnerStyled;