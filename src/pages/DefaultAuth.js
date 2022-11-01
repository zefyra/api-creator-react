import { useState, useEffect, useRef } from 'react';
import styled from "styled-components";

import { useTranslation } from "react-i18next";

import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

import { PageTitle } from "module/layout"
import Table from "component/Table"
import TableData from "util/TableData"
import Button from 'component/Button';
import TableHeader from 'util/TableHeader';

const DefaultAuth = ({ className, fetchControl }) => {

    const { t } = useTranslation('setting', { keyPrefix: 'defaultAuth' });

    const tableHeader = new TableHeader({
        header: [{
            label: t('resourceName'), //  '權限名稱',
            key: 'resourceName',
            type: 'text',
        }, {
            label: t('notPayedUser'), //  '未付費用戶',
            key: 'user', // 'notPayedUser',
            type: 'toggleSwitch',
        }, {
            label: t('payedUser'), //  '付費用戶',
            key: 'premiumUser', // 'payedUser',
            type: 'toggleSwitch',
        }, {
            label: t('developer'), //  '開發者',
            key: 'developer',
            type: 'toggleSwitch',
        }],
    });


    /*
    let tableDataInit = { // <Table>接受的資料格式
        page: 1,
        totalPage: 1,
        data: [{
            authName: t('aaa'), // "帳號列表",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('bbb'), // "用戶帳號",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('ccc'), // "用戶子帳號",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('ddd'), // "帳號開發者",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('eee'), // "log紀錄",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('fff'), // "歷史發送訊息",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('ggg'), // "帳號操作訊息",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('hhh'), // "模組商店",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('iii'), // "模組管理",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('jjj'), // "用量級距管理",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('kkk'), // "已購模組",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('lll'), // "我的訂單",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('mmm'), // "平台參數",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('nnn'), // "資料介接",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('ooo'), // "設定",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('ppp'), // "支付相關",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('qqq'), // "預設權限",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }, {
            authName: t('rrr'), // "其他設定",
            notPayedUser: false,
            payedUser: false,
            developer: false,
        }],
    };

     const [tableData, setTableData] = useState(new TableData(tableDataInit, 'default'));

    */
    const [tableData, setTableData] = useState(new TableData());

    useEffect(function () {
        ApiSender.sendApi('[get]/permissions', null).then((apiRes) => {

            // console.log(`permissions apiRes`, apiRes);
            /* data: [{
                enabled: false
                id: 37
                parentResource: null
                resourceName: "accountList"
                roleName: "developer"
            }]
            ====> 手動轉換成表格的格式
            { // <Table>接受的資料格式
                page: 1,
                totalPage: 1,
                data: [{
                    authName: t('aaa'), // "帳號列表",
                    user: false,
                    premiumUser: false,
                    developer: false,
                }]
            } */

            const permissionTypeRowMap = {};
            apiRes.rows.forEach((permissionItem) => {
                if (!permissionTypeRowMap[permissionItem.resourceName]) {
                    permissionTypeRowMap[permissionItem.resourceName] = {
                        resourceName: t(permissionItem.resourceName), // "帳號列表",
                        user: false,
                        premiumUser: false,
                        developer: false,
                        permissionItemMap: {
                            /* premiumUser: {
                                ....原本的物件
                            } */
                        },
                    }
                }

                permissionTypeRowMap[permissionItem.resourceName][permissionItem.roleName] = permissionItem.enabled;
                permissionTypeRowMap[permissionItem.resourceName].permissionItemMap[permissionItem.roleName] = permissionItem;
            });

            let permissionTypeRowList = Object.keys(permissionTypeRowMap).map((resourceName) => {
                return permissionTypeRowMap[resourceName];
            });

            // console.log('permissionTypeRowList', permissionTypeRowList)

            const permissionTableData = new TableData({
                page: 1,
                totalPage: 1,
                data: permissionTypeRowList,
            }, 'default', tableHeader)

            // console.log('permissionTableData', permissionTableData)

            setTableData(permissionTableData);

        }).catch(new ApiError().catchAlertMsg());

    }, []);

    const onCheckedChange = () => (checked, cellInfo) => {
        // console.log('onCheckedChange', checked, cellInfo, checkMap);
        // console.log('permissionItemMap', cellInfo.getRow().permissionItemMap);
        // console.log('getHeaderItem', cellInfo.getHeaderItem());

        const headerItem = cellInfo.getHeaderItem();

        const roleName = headerItem.key;

        const permissionItem = cellInfo.getRow().permissionItemMap[roleName];
        // console.log('permissionItem', permissionItem)

        /* permissionItem: {
            enabled: false
            id: 4
            parentResource: null
            resourceName: "moduleManage"
            roleName: "user"
        } */

        const newPermissionData = {
            enabled: checked,
            id: permissionItem.id,
            parentResource: permissionItem.parentResource,
            resourceName: permissionItem.resourceName,
            roleName: permissionItem.roleName,
        };

        ApiSender.sendApi('[put]/permissions', [newPermissionData]).then((apiRes) => {
            // 權限已更新
            fetchControl('notify').notify(t('notifyHaveUpdatePermission'));
        });
    };

    // 換頁事件，代表要load新的頁面
    const onPageChange = function () {
    }

    // const onSaveDefaultAuth = () => () => {
    //     console.log('onSaveDefaultAuth')
    // }

    // 儲存
    // const tableFooterSlot = (
    //     <div className="button-row">
    //         <Button type="fill" mode="primary" onClick={onSaveDefaultAuth()}>{t('save')}</Button>
    //     </div>
    // );

    return (
        <div className={className}>
            {/* footerSlot={tableFooterSlot} */}
            <Table header={tableHeader} data={tableData} onCheckedChange={onCheckedChange()}
                onPageChange={onPageChange()} >
            </Table>
        </div>
    );
}


const DefaultAuthStyled = styled(DefaultAuth)`
    display: flex;
    flex-direction: column;

    width: 100%; // 自動填滿
    /* width: auto; // 自動服貼 */

    justify-content: center;
    align-items: flex-start;

    /* background-color: #7065cb; */

    .button-row {
        display: flex;
        flex-direction: row;
        width: 100%; // 自動填滿

        justify-content: center;
        align-items: center;
    }

`

export default function DefaultAuthExport({ fetchControl }) {
    const { t } = useTranslation('menu', { keyPrefix: 'subItem' })

    return (
        <PageTitle title={t('defaultAuth')}>
            <DefaultAuthStyled fetchControl={fetchControl} />
        </PageTitle>
    );
}