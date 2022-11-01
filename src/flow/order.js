import TableData from "util/TableData"
import TableHeader from "util/TableHeader"
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import { useGetter } from 'store';

import { selectOrderQuery } from 'store/order';

import NumberFilter from 'filter/NumberFilter';
import TimeFilter from 'filter/TimeFilter';
import { useTranslation } from "react-i18next";

const getOrderTableHeader = function (t) {
    const tableHeader = new TableHeader({
        rowSelect: {
            mode: 'singleSelect', // 代表只能單選
        },
        headerExtra: [{ // 額外要載入的欄位
            key: 'invoiceImgUrl',
            fetch: 'order.invoiceImgUrl',
        }],
        header: [{
            label: '',
            key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
            type: 'checkBox',
            mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
        }, {
            label: t('orderId'), //  '訂單編號',
            key: 'orderId',
            type: 'text',
            fetch: 'order.orderId',
        }, {
            label: t('payDate'), //  '付款日期',
            key: 'payDate',
            type: 'text',
            fetch: 'order.payDate',
            filter: new TimeFilter('date', '-'),
        }, {
            label: t('subscribeServiceType'), //  '訂閱服務類型',
            key: 'subscribeServiceType',
            type: 'text',
            fetch: 'order.subscribeServiceType',
            filter: function (type) {
                const typeMap = {
                    'platformSubscribe': '平台訂閱',
                    'moduleSubscribe': '模組訂閱',
                }
                return typeMap[type];
            }
        }, {
            label: t('subscribeServiceName'), //  '訂閱服務名稱',
            key: 'subscribeServiceName',
            type: 'text',
            fetch: 'order.subscribeServiceName',
        }, {
            label: t('userName'), //  '用戶名稱',
            key: 'userName',
            type: 'text',
            fetch: 'order.userName',
        }, {
            label: t('buyingCycle'), //  '購買週期（月）',
            key: 'buyingCycle',
            type: 'text',
            fetch: 'order.buyingCycle',
        }, {
            label: t('orderPrice'), //  '訂單金額',
            key: 'orderPrice',
            type: 'text',
            fetch: 'order.orderPrice',
            filter: new NumberFilter('decimalSeparator'),
        }, {
            label: t('payMethod'), //  '付款方式',
            key: 'payMethod',
            type: 'text',
            fetch: 'order.payMethod',
            filter: function (type) {
                const typeMap = {
                    'creditCard': '信用卡',
                }
                return typeMap[type];
            }
        }, {
            label: t('orderStatus'), //  '訂單狀態',
            key: 'orderStatus',
            type: 'text',
            fetch: 'order.orderStatus',
            filter: function (type) {
                const typeMap = {
                    'notConfirm': '待確認',
                }
                return typeMap[type];
            }
        }, {
            label: t('payStatus'), //  '支付狀態',
            key: 'payStatus',
            type: 'text',
            fetch: 'order.payStatus',
            filter: function (type) {
                const typeMap = {
                    'notPay': '未付款',
                    'hasPay': '已付款',
                }
                return typeMap[type];
            }
        }, {
            label: t('invoiceStatus'), //  '開票狀態',
            key: 'invoiceStatus',
            type: 'text',
            fetch: 'order.invoiceStatus',
            filter: function (type) {
                const typeMap = {
                    'notInvoice': '未開票',
                    'hasInvoice': '已開票',
                }
                return typeMap[type];
            }
        }, {
            label: t('invoiceId'), //  '發票號碼',
            key: 'invoiceId',
            type: 'text',
            fetch: 'order.invoiceId',
            textType: 'urlLink',
            linkHeaderRef: 'invoiceImgUrl',
        }, {
            label: t('createDate'), //  '創建日期',
            key: 'createDate',
            type: 'text',
            fetch: 'order.createDate',
            filter: new TimeFilter('date', '-'),
        }],
    });

    return tableHeader;
}

const fakeApiRes = {
    count: 25,
    page: 1,
    pageSize: 10,
    rows: [{
        order: {
            orderId: 'P220314174517001',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'hasInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210001',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }, {
        order: {
            orderId: 'P220314174517002',
            payDate: new Date().toISOString(),
            subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
            subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
            userName: '小微工作室',
            buyingCycle: 6,
            orderPrice: 2500,
            payMethod: 'creditCard', // 信用卡
            orderStatus: 'notConfirm', // 待確認
            payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
            invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
            invoiceId: 'PT87210002',
            invoiceImgUrl: 'https://www.google.com/',
            createDate: new Date().toISOString()
        }
    }],
};


export class OrderTableFlow {
    tableDataRef = null;
    urlQuery = null;

    tableHeader = null;

    constructor(tableDataRef) {
        if (!tableDataRef) {
            console.error(`tableDataRef not exist on OrderTableFlow constructor`);
            return;
        }
        this.tableDataRef = tableDataRef;
        // 初始化tableData
        this.tableDataRef.current = new TableData(null, 'default');

        // 呼叫API，首次取得API資料
        // this.loadOrder();

        const { t } = useTranslation('order', { keyPrefix: 'table' });
        this.tableHeader = getOrderTableHeader(t);
    }
    setUrlQuery(urlQuery) {
        this.urlQuery = urlQuery;
        this.setTableData(this.getTableData().applyUrlQueryParam(this.urlQuery));
    }
    setTableData(newTableData) {
        if (!this.tableDataRef) {
            console.error(`setTableData: tableDataRef not exist in OrderTableFlow`);
            return;
        }
        this.tableDataRef.current = newTableData;
    }
    getTableData() {
        if (!this.tableDataRef) {
            console.error(`getTableData: tableDataRef not exist in OrderTableFlow`);
            return;
        }
        return this.tableDataRef.current;
    }
    getTableHeader() {
        // console.log('getTableHeader', this.tableHeader);
        if (!this.tableHeader) {
            console.error(`OrderTableFlow getTableHeader: tableHeader not exist`);
            return null;
        }
        return this.tableHeader;
    }

    // getDefaultTableData() {
    //     return new TableData(null, 'default').applyUrlQueryParam(this.urlQuery);
    // }

    // getDefaultTableData() {
    //     return new TableData({
    //         data: [{
    //             orderId: 'P220314174517001',
    //             payDate: new Date().toISOString(),
    //             subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
    //             subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
    //             userName: '小微工作室',
    //             buyingCycle: 6,
    //             orderPrice: 2500,
    //             payMethod: 'creditCard', // 信用卡
    //             orderStatus: 'notConfirm', // 待確認
    //             payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
    //             invoiceStatus: 'hasInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
    //             invoiceId: 'PT87210001',
    //             invoiceImgUrl: 'https://www.google.com/',
    //             createDate: new Date().toISOString()
    //         }, {
    //             orderId: 'P220314174517002',
    //             payDate: new Date().toISOString(),
    //             subscribeServiceType: 'platformSubscribe', // 平台訂閱、模組訂閱
    //             subscribeServiceName: '10,000用戶數', // '10,000用戶數'、'知識庫'、Webhook腳本
    //             userName: '小微工作室',
    //             buyingCycle: 6,
    //             orderPrice: 2500,
    //             payMethod: 'creditCard', // 信用卡
    //             orderStatus: 'notConfirm', // 待確認
    //             payStatus: 'hasPay', // 'notPay' 未付款 'hasPay' 已付款
    //             invoiceStatus: 'notInvoice', // 'notInvoice' 未開票 'hasInvoice' 已開票
    //             invoiceId: 'PT87210002',
    //             invoiceImgUrl: 'https://www.google.com/',
    //             createDate: new Date().toISOString()
    //         }],
    //     }, 'default').applyUrlQueryParam(this.urlQuery);
    // }


    // event------------------------------------------------------------

    tableDataSetterMap = {};
    // 代表是useState生出來的setter，有需要同步刷新各view元件的component時，要跑一遍全部呼叫刷新
    registTableDataSetter(key, setter) {
        this.tableDataSetterMap[key] = setter;
    }

    // 代表要同步更新數值到
    refreshTableData(newTableData) {
        this.setTableData(newTableData);

        // console.log('this.tableDataSetterMap', this.tableDataSetterMap)

        Object.keys(this.tableDataSetterMap).forEach((key) => {
            const setter = this.tableDataSetterMap[key];
            setter(newTableData);
        });
    }

    // event------------------------------------------------------------

    bindInitLoad() {
        return this.handleBindInit.bind(this);
    }

    handleBindInit() {
        this.loadOrder();
        // 綁定useEffect的函式，回傳promise會報錯，因此多疊一層
    }

    loadOrder(newPage = 1, unlock = () => { }) {
        // console.log('loadOrder', newPage, unlock);

        // // 讓industryFilter內部自動呼叫API來初始化參數
        // industryFilter.autoReady().then(() => {
        // return ApiSender.sendApi('[get]/account-entities', {
        //     page: newPage, // API的page參數從1開始
        //     pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
        // });

        // return Promise.resolve();
        const vm = this;

        const tableData = this.getTableData();

        // [未完成]之後要接上真正的API
        return ApiSender.sendApi('[get]/account-entities', {
            page: newPage, // API的page參數從1開始
            pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
        }).then((apiRes) => {
            // [未完成]之後要接上真正的apiRes
            apiRes = fakeApiRes;
            apiRes.page = newPage;

            // 將newTableData內的page參數更新到urlQuery上
            // this.setTableData(new TableData(apiRes, 'crossbot', this.getTableHeader()).navigateUrlQuery(this.urlQuery));
            vm.refreshTableData(new TableData(apiRes, 'crossbot', vm.getTableHeader()).navigateUrlQuery(vm.urlQuery));
            unlock();
        }).catch(new ApiError(function (error, next) {
            unlock();
            next(); // 開啟Alert燈箱
        }).catchAlertMsg());
    }

    bindPageChange() {
        return this.loadOrder.bind(this);
    }

    handleQuery(...args) {
        // console.log('handleQuery', args);
        // const store = getStore();

        const queryData = useGetter(selectOrderQuery);

        // const queryData = selectOrderQuery(store.getState());
        console.log('handleQuery', queryData);

        this.loadOrder();
    }

    bindHandleQuery() {
        return this.handleQuery.bind(this);
    }
}