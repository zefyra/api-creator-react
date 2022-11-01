
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

// import { openAlertModal } from 'store/alert';

import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { PageTitle } from "module/layout"

// import InputText from "component/InputText";
import FilterPanel, { FilterPanelComment } from "component/FilterPanel"
// import DatePicker from "component/DatePicker"
import Button from "component/Button"

import Table from "component/Table"
import TableData from "util/TableData"
import TableHeader from "util/TableHeader";
import NumberFilter from "filter/NumberFilter";

// import ToggleSwitch from "component/ToggleSwitch"
// import CheckBox from "component/CheckBox"

// import { modal as modalThemeObject } from 'theme/reas'
import AddQuotaRankModal from "element/QuotaRankManage/AddQuotaRankModal"
import { modal as modalThemeObject } from 'theme/reas'

import { AddQuotaRankFlow, QuotaRankTableFlow } from 'flow/quotaRank'

const QuotaRankTable = ({ className, fetchControl, refreshTrigger }) => {

    const { t } = useTranslation('pay', { keyPrefix: 'quotaRankManage' });

    /*
    const tableHeader = new TableHeader({
        rowSelect: {
            mode: 'singleSelect', // 代表只能單選
        },
        upperHeader: {
            discount: { // <key>
                // key: 'discount',
                label: t('discount'), // 折扣
                type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
            },
            feeAfterDiscount: {
                label: t('feeAfterDiscount'), // 折扣後費用
                type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
            }
        },
        header: [{
            label: '',
            key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
            type: 'checkBox',
            mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
        }, {
            label: t('rankName'), // 級距名稱
            key: 'rankName',
            type: 'text',
            width: '300px',
            filter: 'decimalSeparator', // 自動加逗號
            textType: 'editable', // 可修改數值
        }, {
            label: t('userNumLimit'), // 用戶數上限
            key: 'userNumLimit',
            type: 'text',
            width: '120px',
            filter: 'decimalSeparator',
            textType: 'editable', // 可修改數值
            valueType: 'number', // 要使用setCellValue需要設定valueType，才有辦法正確設定進去
        }, {
            label: t('feePerPerson'), //  '用量費/人'
            key: 'feePerPerson',
            type: 'text',
            filter: new NumberFilter('floatDecimalPlaces', 2),
            textType: 'editable', // 可修改數值
            valueType: 'number',
            width: '300px',
        }, {
            label: t('month'), // 月
            key: 'discountPerMonth', // 月付折扣
            type: 'text',
            upperHeaderRef: 'discount', // 指定上層的欄位: 折扣
            filter: new NumberFilter('floatDecimalPlaces', 2),
            textType: 'editable', // 可修改數值
            valueType: 'number',
            width: '120px',
        }, {
            label: t('year'), // 年
            key: 'discountPerYear', // 年付折扣
            type: 'text',
            upperHeaderRef: 'discount', // 指定上層的欄位: 折扣
            filter: new NumberFilter('floatDecimalPlaces', 2),
            textType: 'editable', // 可修改數值
            valueType: 'number',
            width: '120px',
        }, {
            label: t('month'), // 月
            key: 'feePerMonthAfterDiscount',
            type: 'text',
            upperHeaderRef: 'feeAfterDiscount', // 指定上層的欄位: 折扣後費用
            filter: 'decimalSeparator',
            valueType: 'number',
        }, {
            label: t('year'), // 年
            key: 'feePerYearAfterDiscount',
            type: 'text',
            upperHeaderRef: 'feeAfterDiscount', // 指定上層的欄位: 折扣後費用
            filter: 'decimalSeparator',
            valueType: 'number',
        }, {
            label: '', // 啟用/停用
            key: 'enable',
            type: 'toggleSwitch',
        }],
    });
*/

    /* 初期測試用的資料
        let tableDataInit = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                rankName: '10000用戶級距',
                userNumLimit: 10000,
                feePerPerson: 0.2,
                discountPerMonth: 1,
                discountPerYear: 0.8,
                feePerMonthAfterDiscount: 2000,
                feePerYearAfterDiscount: 19200,
                enable: false,
            }, {
                rankName: '50000用戶級距',
                userNumLimit: 50000,
                feePerPerson: 0.1,
                discountPerMonth: 1,
                discountPerYear: 0.8,
                feePerMonthAfterDiscount: 5000,
                feePerYearAfterDiscount: 48000,
                enable: false,
            }, {
                rankName: '100000用戶級距',
                userNumLimit: 100000,
                feePerPerson: 0.1,
                discountPerMonth: 1,
                discountPerYear: 0.8,
                feePerMonthAfterDiscount: 5000,
                feePerYearAfterDiscount: 48000,
                enable: false,
            }, {
                rankName: '500000用戶級距',
                userNumLimit: 500000,
                feePerPerson: 0.1,
                discountPerMonth: 1,
                discountPerYear: 0.8,
                feePerMonthAfterDiscount: 5000,
                feePerYearAfterDiscount: 48000,
                enable: false,
            }, {
                rankName: '1000000用戶級距',
                userNumLimit: 1000000,
                feePerPerson: 0.1,
                discountPerMonth: 1,
                discountPerYear: 0.8,
                feePerMonthAfterDiscount: 5000,
                feePerYearAfterDiscount: 48000,
                enable: false,
            }],
        }*/

    const quotaRankTableFlow = fetchControl('quotaRankTable');
    const tableHeader = quotaRankTableFlow.getTableHeader();


    // v1
    // const [tableData, setTableData] = useState(new TableData(tableDataInit, 'mockserver'));

    // v2
    const [tableData, setTableData] = useState(quotaRankTableFlow.getTableData());

    // const [tableData, setTableData] = useState(quotaRankTableFlow.getTableData());
    // 將view的tableData的setter註冊進去，這樣才能同步刷新
    quotaRankTableFlow.registTableDataSetter('QuotaRankTable', setTableData);

    // 換頁事件，代表要load新的頁面
    const onPageChange = function () {
        // return loadUsers.bind(null);
    }

    const [selectRow, setSelectRow] = useState(null);
    const onCheckedChange = () => (checked, cellInfo) => {

        // console.log(`onCheckedChange [${headerItem.key}] ${rowIndex} => ${checked}`, row)
        // if (headerItem.key === '__rowSelect') {
        //     setSelectRow(checked ? row : null); // 打勾時將點選的row塞進去，取消時設為null
        // }

        // console.log(`onCheckedChange [${headerItem.key}] ${rowIndex} => ${checked}`, row)

        const headerKey = cellInfo.getHeaderKey();

        if (headerKey === '__rowSelect') {
            // console.log(`select Row:`, cellInfo);
            setSelectRow(checked ? cellInfo.getRow() : null); // 打勾時將點選的row塞進去，取消時設為null
        } else if (headerKey === 'enable') {
            // console.log(`enable Row:`, checked);
            fetchControl('quotaRankTable').onEnableChange(checked, cellInfo);
        }

    }


    const onClickAddQuotaRank = () => () => {
        fetchControl('addQuotaRank').openModalAdd();
    }
    const onClickRemoveQuotaRank = () => () => {
        // openElementModal('add');
        console.log('onClickRemoveQuotaRank')

        if (!selectRow) {
            // '必須選取一個用量級距項目'
            fetchControl('tip').tip(t('deleteFail_itemNotSelect'));
            return;
        }

        // `確認要刪除用量級距『${'cccccc'}』？`
        fetchControl('confirm').confirm(`${t('deleteConfirmA')}${selectRow.rankName}${t('deleteConfirmB')}`).then((action) => {
            if (action === 'confirm') {

                console.log('delete select quotaRank');

                // 刷新表格
                // loadUsers(nowPage, () => { });

                // '已刪除該用量級距'
                fetchControl('tip').tip(t('deleteDoneTip'))
            }
        });
    }

    /*
    // 舊版: 單純只更新畫面
    const onTdEdit = () => (val, key, rowIndex) => {
        console.log(`onTdEdit row<${key}>[${rowIndex}] ===> ${val} `);

        // 生成一個新的TableData物件
        const newTableData = new TableData(tableData, 'tableData');

        newTableData.setCellValue(rowIndex, key, val);

        // 更新tableData參數，直接整個Table重render
        setTableData(newTableData);
    }*/

    // const onSaveQuotaRank = () => () => {
    //     // console.log('onSaveQuotaRank');

    //     // `確認儲存送出？`
    //     fetchControl('confirm').confirm(`${t('saveConfirm')}`).then((action) => {
    //         if (action === 'confirm') {
    //             // 刷新表格
    //             // loadUsers(nowPage, () => { });

    //             // console.log(`send tableData`, tableData);

    //             // '已成功儲存'
    //             fetchControl('tip').tip(t('saveDoneTip'));
    //         }
    //     });
    // }

    // const tableFooterSlot = (
    //     <div className="quota-rank-table-footer">
    //         <div></div>
    //         <Button type="fill" mode="primary" onClick={onSaveQuotaRank()}>{t('save')}</Button>
    //     </div>
    // );

    // footerSlot={tableFooterSlot}

    return (
        <div className={className}>
            <Table header={tableHeader} data={tableData} onCheckedChange={onCheckedChange()} onPageChange={onPageChange()} onTdEdit={quotaRankTableFlow.onTdEdit.bind(quotaRankTableFlow)}>
                {/* 新增 */}
                <Button type="table" mode="default" onClick={onClickAddQuotaRank()}>{t('addQuotaRank')}</Button>
                {/* 刪除 */}
                <Button type="table" mode="default" onClick={onClickRemoveQuotaRank()}>{t('removeQuotaRank')}</Button>
            </Table>
        </div>
    );
}

const QuotaRankTableStyled = styled(QuotaRankTable)`
display: flex;
flex-direction: column;

width: 100%; // 自動填滿

justify-content: center;
align-items: flex-start;
    .quota-rank-table-footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
`

function QuotaRankManage({ fetchControl }) {
    const TranslationMenu = useTranslation('menu', { keyPrefix: 'system' });
    const { t } = useTranslation('pay', { keyPrefix: 'quotaRankAdd' });

    // const [addRankModalRef, setAddRankModalRef] = useState(null);

    const addQuotaRankFlow = new AddQuotaRankFlow(useRef(null), useRef(null), t);
    const quotaRankTableFlow = new QuotaRankTableFlow(useRef(null));

    // 將flow註冊給addFlow
    addQuotaRankFlow.setQuotaRankTableFlow(quotaRankTableFlow);


    // // 綁定url上的get參數的頁數
    // tableFlow.setUrlQuery(useUrlQuery());

    useEffect(() => quotaRankTableFlow.handleInitQuotaRank(), []); // 觸發首次的API載入
    // quotaRankTableFlow.bindInitLoad()


    // const setOpenManageUserModalRef = modalType => ref => {
    //     if (modalType === 'add') {
    //         setAddRankModalRef(ref);
    //     }
    // }

    // const addRankModalPromise = useRef(null);

    // const elemetDo = (commandType, row) => {
    //     if (commandType === 'openModalAdd') {
    //         addRankModalRef.openModal();
    //         return new Promise((resolve, reject) => {
    //             addRankModalPromise.current = { resolve, reject };
    //         });
    //     }
    // }

    // const onQuotaRankSave = () => () => {
    //     // addRankModalPromise.current
    //     // console.log('onQuotaRankSave');

    //     if (addRankModalPromise.current) {
    //         addRankModalPromise.current.resolve();
    //         addRankModalPromise.current = null;

    //         addRankModalRef.closeModal();
    //     }
    // };

    // const onModalClose = () => () => {
    //     // console.log('onModalClose', addRankModalPromise.current);

    //     if (addRankModalPromise.current) {
    //         addRankModalPromise.current.reject('close');
    //         addRankModalPromise.current = null;
    //     }
    // }

    // 將Flow註冊到fetchControl上
    let newFetchControl = fetchControl('regist', 'addQuotaRank', addQuotaRankFlow);
    newFetchControl = newFetchControl('regist', 'quotaRankTable', quotaRankTableFlow);

    quotaRankTableFlow.setFetchControl(newFetchControl);
    addQuotaRankFlow.setFetchControl(newFetchControl);

    return (
        <PageTitle title={TranslationMenu.t('quotaRankManage')}>
            <QuotaRankTableStyled fetchControl={newFetchControl} />
            {/* elemetDo={elemetDo} */}

            {/* setOpenModalRef={setOpenManageUserModalRef('add')} */}
            {/* 新增級距 */}
            <AddQuotaRankModal fetchControl={newFetchControl} modalType="add"
                setOpenModalRef={addQuotaRankFlow.bindOpenManageUserModalRef()}
                title={t('addQuotaRank')}
                theme={modalThemeObject} onModalClose={addQuotaRankFlow.onModalClose()} />
            {/* onSave={onQuotaRankSave('add')} */}
            {/* setOpenModalRef={setOpenManageUserModalRef('add')} */}
            {/* fetchControl={fetchControl} */}
        </PageTitle>
    );
}

export default QuotaRankManage; 