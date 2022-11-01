import TimeFilter from "filter/TimeFilter";
import StateModel from "model/StateModel";
import TableData from "util/TableData";
import TableHeader from "util/TableHeader";

let dateFilter = new TimeFilter('date', '-');
let dateTimeFilter = new TimeFilter('time', '-');

export class CustomDataModel extends StateModel {
    // constructor(...args) {
    //     // super(...args);
    // }
    getPanelQuery() {
        const startDate = this.getState('startDate');
        if (startDate) {
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);
        }
        const endDate = this.getState('endDate');
        if (endDate) {
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);
        }
        return {
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            platformType: this.getState('platformType'),
            dataCategory: this.getState('dataCategory'),
            dataStatus: this.getState('dataStatus'),
            srcSystem: this.getState('srcSystem'),
        };
    }
    data({ t }) {
        return {
            startDate: null,
            endDate: null,
            platformType: '',
            dataCategory: '',
            dataStatus: '',
            srcSystem: '',
            srcSystemOptionList: [],
            srcSystemOptionListLoading: true,
            // schema table-------------------------------
            tableData: new TableData(),
            tableHeader: new TableHeader({
                rowSelect: {
                    mode: 'singleSelect', // 代表只能單選
                },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                header: [{
                    label: '',
                    key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                    type: 'checkBox',
                    mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
                }, {
                    label: 'recipe_id',
                    key: 'recipe_id',
                    type: 'text',
                    width: '80px',
                    // filter: 'decimalSeparator', // 自動加逗號
                    // textType: 'editable', // 可修改數值
                    // fetch: 'name',
                }, {
                    label: t('platformType'), // 平台別
                    key: 'platformType',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('srcSystem'), // 來源系統
                    key: 'srcSystem',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('schemaFormat'), // 資料欄位格式
                    key: 'schemaFormat',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('statusCode'), // 狀態代碼
                    key: 'statusCode',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('dataNameEn'), // 資料名稱(英文)
                    key: 'dataNameEn',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('dataNameZh'), // 資料名稱(中文)
                    key: 'dataNameZh',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('totalDataAmount'), // 總資料筆數
                    key: 'totalDataAmount',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('doneDataAmount'), // 已完成資料筆數
                    key: 'doneDataAmount',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('changeSyncSrcSystem'), // 變更同步至來源系統
                    key: 'changeSyncSrcSystem',
                    type: 'toggleSwitch',
                    width: '80px',
                }, {
                    label: t('createTime'), // 成立時間
                    key: 'createTime',
                    type: 'text',
                    width: '80px',
                    filter: dateFilter,
                }, {
                    label: t('updateTime'), // 更新時間
                    key: 'updateTime',
                    type: 'text',
                    width: '80px',
                    filter: dateFilter,
                }],
            }),
            // subTable -----------------------------
            subTable: '',
        }
    }

    getTableHeader() {
        return this.getState('tableHeader');
    }

    getTableData() {
        return this.getState('tableData');
    }

    // dispatch
    updateSubTable(val) {
        this.setState('subTable', val);
    }
}

// SubTableModel: [MemberData]
export class MemberDataTableModel extends StateModel {
    // constructor(...args) {
    //     // super(...args);
    // }
    data({ t }) {
        return {
            tableData: new TableData(),
            tableHeader: new TableHeader({
                // rowSelect: {
                //     mode: 'singleSelect', // 代表只能單選
                // },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                buttonColumn: {
                    gatewayUid: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('memberData.view'), // '檢視',
                            event: 'viewGatewayUid',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                    emailArray: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('memberData.view'), // '檢視',
                            event: 'viewEmailArray',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                    addressArray: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('memberData.view'), // '檢視',
                            event: 'viewAddressArray',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                    phoneArray: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('memberData.view'), // '檢視',
                            event: 'viewPhoneArray',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                    // family: { // <key> ==> 'action'
                    //     buttonItemList: [{
                    //         type: 'button',
                    //         label: t('memberData.view'), // '檢視',
                    //         event: 'edit',
                    //         buttonType: 'fill',
                    //         buttonMode: 'default',
                    //         buttonPattern: 'buttonColumn',
                    //         // visibleChecker: function (rowData) {
                    //         //     return true;
                    //         // },
                    //     }],
                    // }
                },
                header: [{
                    //     label: '',
                    //     key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                    //     type: 'checkBox',
                    //     mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
                    // }, {
                    label: 'key',
                    key: 'key',
                    type: 'text',
                    width: '100px',
                }, {
                    label: t('memberData.memberId'), // 會員ID
                    key: 'memberId',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.lastName'), // 姓氏
                    key: 'lastName',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.firstName'), // 名子
                    key: 'firstName',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.memberRank'), // 會員層級
                    key: 'memberRank',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.sex'), // 性別
                    key: 'sex',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.birthday'), // 生日
                    key: 'birthday',
                    type: 'text',
                    width: '160px',
                    filter: dateFilter,
                }, {
                    label: t('memberData.identityNumber'), // 身分證字號
                    key: 'identityNumber',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.account'), // 帳號
                    key: 'account',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.gatewayUid'), // 渠道UID
                    key: 'gatewayUid',
                    type: 'buttonColumn',
                    width: '160px',
                }, {
                    label: t('memberData.emailArray'), // E-mail陣列
                    key: 'emailArray',
                    type: 'buttonColumn',
                    width: '160px',
                }, {
                    label: t('memberData.addressArray'), // 地址陣列
                    key: 'addressArray',
                    type: 'buttonColumn',
                    width: '160px',
                }, {
                    label: t('memberData.phoneArray'), // 電話陣列
                    key: 'phoneArray',
                    type: 'buttonColumn',
                    width: '160px',
                }, {
                    label: t('memberData.job'), // 職業
                    key: 'job',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.family'), // 家庭成員
                    key: 'family',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('memberData.registDate'), // 註冊日期
                    key: 'registDate',
                    type: 'text',
                    width: '160px',
                    filter: dateTimeFilter,
                }, {
                    label: t('memberData.lastLoginDate'), // 最後登入日期
                    key: 'lastLoginDate',
                    type: 'text',
                    width: '160px',
                    filter: dateTimeFilter,
                }],
            }),
            // --------------------------------------
            modalRef: null,
            modalTitle: t('dataCategory.memberData'),
            tab: '',
        };
    }
    getTableHeader() {
        return this.getState('tableHeader');
    }
    getTableData() {
        return this.getState('tableData');
    }
}

// SubTable: MemberData
export class GatewayUidTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: 'id',
                key: 'id',
                type: 'text',
                width: '80px',
            }, {
                label: 'type',
                key: 'type',
                type: 'text',
                width: '80px',
            }, {
                label: 'UID',
                key: 'uid',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTable: MemberData
export class EmailArrayTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: 'id',
                key: 'id',
                type: 'text',
                width: '80px',
            }, {
                label: 'type',
                key: 'type',
                type: 'text',
                width: '80px',
            }, {
                label: 'Eamil',
                key: 'email',
                type: 'text',
                width: '80px',
            }, {
                label: 'description',
                key: 'description',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTable: MemberData
export class AddressArrayTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: 'id',
                key: 'id',
                type: 'text',
                width: '80px',
            }, {
                label: 'type',
                key: 'type',
                type: 'text',
                width: '80px',
            }, {
                label: t('nation'), // 國家
                key: 'nation',
                type: 'text',
                width: '80px',
            }, {
                label: t('county'), // 縣市
                key: 'county',
                type: 'text',
                width: '80px',
            }, {
                label: t('region'), // 區域
                key: 'region',
                type: 'text',
                width: '80px',
            }, {
                label: t('address'), // 地址
                key: 'address',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTable: MemberData
export class PhoneArrayTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: 'id',
                key: 'id',
                type: 'text',
                width: '80px',
            }, {
                label: 'type',
                key: 'type',
                type: 'text',
                width: '80px',
            }, {
                label: 'number',
                key: 'number',
                type: 'text',
                width: '80px',
            }, {
                label: 'extension',
                key: 'extension',
                type: 'text',
                width: '80px',
            }, {
                label: 'description',
                key: 'description',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTableModel: [TransactionLog]
export class TransactionLogTableModel extends StateModel {
    // constructor(...args) {
    //     // super(...args);
    // }
    data({ t }) {
        return {
            tableData: new TableData(),
            tableHeader: new TableHeader({
                // rowSelect: {
                //     mode: 'singleSelect', // 代表只能單選
                // },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                buttonColumn: {
                    productArray: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('transactionLog.view'), // '檢視',
                            event: 'viewProductArray',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                },
                header: [{
                    //     label: '',
                    //     key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                    //     type: 'checkBox',
                    //     mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
                    // }, {
                    label: 'key',
                    key: 'key',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.memberId'), // 會員ID
                    key: 'memberId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.orderId'), // 訂單編號
                    key: 'orderId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.shopId'), // 商家ID
                    key: 'shopId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.branchId'), // 分店ID
                    key: 'branchId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.status'), // 狀態
                    key: 'status',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.productArray'), // 商品陣列
                    key: 'productArray',
                    type: 'buttonColumn',
                    width: '140px',
                }, {
                    label: t('transactionLog.freight'), // 運費
                    key: 'freight',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.productPrice'), // 商品金額
                    key: 'productPrice',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.totalPrice'), // 總金額
                    key: 'totalPrice',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.invoiceNumber'), // 發票編號
                    key: 'invoiceNumber',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('transactionLog.orderCreateTime'), // 訂單成立時間
                    key: 'addressArray',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }, {
                    label: t('transactionLog.payTime'), // 付款時間
                    key: 'payTime',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }],
            }),
            // --------------------------------------
            modalRef: null,
            modalTitle: t('dataCategory.transactionLog'),
            tab: '',
        };
    }
    getTableHeader() {
        return this.getState('tableHeader');
    }
    getTableData() {
        return this.getState('tableData');
    }
}

// SubTable: TransactionLog
export class ProductArrayTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: t('productCategoryId'), // 商品分類編號
                key: 'productCategoryId',
                type: 'text',
                width: '80px',
            }, {
                label: t('categoryName'), // 分類名稱
                key: 'categoryName',
                type: 'text',
                width: '80px',
            }, {
                label: t('productId'), // 商品ID
                key: 'productId',
                type: 'text',
                width: '80px',
            }, {
                label: t('barcode'), // 國際條碼
                key: 'barcode',
                type: 'text',
                width: '80px',
            }, {
                label: t('productName'), // 商品名稱
                key: 'productName',
                type: 'text',
                width: '80px',
            }, {
                label: t('brand'), // 品牌
                key: 'brand',
                type: 'text',
                width: '80px',
            }, {
                label: t('currency'), // 幣別
                key: 'currency',
                type: 'text',
                width: '80px',
            }, {
                label: t('amount'), // 數量
                key: 'amount',
                type: 'text',
                width: '80px',
            }, {
                label: t('unitPrice'), // 商品單價
                key: 'unitPrice',
                type: 'text',
                width: '80px',
            }, {
                label: t('productTotalPrice'), // 總價
                key: 'totalPrice',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTableModel: [ProductCategory]
export class ProductCategoryTableModel extends StateModel {
    // constructor(...args) {
    //     // super(...args);
    // }
    data({ t }) {
        return {
            tableData: new TableData(),
            tableHeader: new TableHeader({
                // rowSelect: {
                //     mode: 'singleSelect', // 代表只能單選
                // },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                // buttonColumn: {
                //     productList: { // <key> ==> 'action'
                //         buttonItemList: [{
                //             type: 'button',
                //             label: t('productCategory.view'), // '檢視',
                //             event: 'viewProductList',
                //             buttonType: 'fill',
                //             buttonMode: 'default',
                //             buttonPattern: 'buttonColumn',
                //         }],
                //     },
                // },
                header: [{
                    label: t('productCategory.productCategoryId'), // 商品分類ID
                    key: 'productCategoryId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productCategory.upperCategoryId'), // 上層分類ID
                    key: 'upperCategoryId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productCategory.productCategoryName'), // 商品分類名稱
                    key: 'productCategoryName',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productCategory.productNum'), // 商品數
                    key: 'productNum',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productCategory.createTime'), // 成立時間
                    key: 'createTime',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }, {
                    label: t('productCategory.lastUpdateTime'), // 最後更新時間
                    key: 'lastUpdateTime',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }],
            }),
            // --------------------------------------
            modalRef: null,
            modalTitle: t('dataCategory.productCategory'),
            tab: '',
        };
    }
    getTableHeader() {
        return this.getState('tableHeader');
    }
    getTableData() {
        return this.getState('tableData');
    }
}

// SubTableModel: [ProductData]
export class ProductTableModel extends StateModel {
    // constructor(...args) {
    //     // super(...args);
    // }
    data({ t }) {
        return {
            tableData: new TableData(),
            tableHeader: new TableHeader({
                // rowSelect: {
                //     mode: 'singleSelect', // 代表只能單選
                // },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                buttonColumn: {
                    specArray: { // 商品規格陣列
                        buttonItemList: [{
                            type: 'button',
                            label: t('productData.view'), // '檢視',
                            event: 'viewSpecArray',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                    stockArray: { // 商品庫存陣列
                        buttonItemList: [{
                            type: 'button',
                            label: t('productData.view'), // '檢視',
                            event: 'viewStockArray',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                    priceArray: { // 商品價格陣列
                        buttonItemList: [{
                            type: 'button',
                            label: t('productData.view'), // '檢視',
                            event: 'viewPriceArray',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                    satisfaction: { // 滿意度
                        buttonItemList: [{
                            type: 'button',
                            label: t('productData.view'), // '檢視',
                            event: 'viewSatisfaction',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                },
                header: [{
                    label: t('productData.productId'), // 商品ID
                    key: 'productId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productData.barcode'), // 國際條碼
                    key: 'barcode',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productData.categoryId'), // 所屬分類ID
                    key: 'categoryId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productData.productName'), // 商品名稱
                    key: 'productName',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productData.brand'), // 品牌
                    key: 'brand',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productData.supplier'), // 供應商
                    key: 'supplier',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('productData.specArray'), // 商品規格陣列
                    key: 'specArray',
                    type: 'buttonColumn',
                    width: '140px',
                }, {
                    label: t('productData.stockArray'), // 商品庫存陣列
                    key: 'stockArray',
                    type: 'buttonColumn',
                    width: '140px',
                }, {
                    label: t('productData.priceArray'), // 商品價格陣列
                    key: 'priceArray',
                    type: 'buttonColumn',
                    width: '140px',
                }, {
                    label: t('productData.satisfaction'), // 滿意度
                    key: 'satisfaction',
                    type: 'buttonColumn',
                    width: '140px',
                }, {
                    label: t('productData.createTime'), // 成立時間
                    key: 'createTime',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }, {
                    label: t('productData.lastUpdateTime'), // 最後更新時間
                    key: 'lastUpdateTime',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }],
            }),
            // --------------------------------------
            modalRef: null,
            modalTitle: t('dataCategory.product'),
            tab: '',
        };
    }
    getTableHeader() {
        return this.getState('tableHeader');
    }
    getTableData() {
        return this.getState('tableData');
    }
}

// SubTable: ProductData
export class SpecArrayTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: t('size'), // 尺寸
                key: 'size',
                type: 'text',
                width: '80px',
            }, {
                label: t('color'), // 顏色
                key: 'color',
                type: 'text',
                width: '80px',
            }, {
                label: t('weight'), // 重量
                key: 'weight',
                type: 'text',
                width: '80px',
            }, {
                label: t('volume'), // 材積
                key: 'volume',
                type: 'text',
                width: '80px',
            }, {
                label: t('unit'), // 單位
                key: 'unit',
                type: 'text',
                width: '80px',
            }, {
                label: t('other1'), // 其他1
                key: 'other1',
                type: 'text',
                width: '80px',
            }, {
                label: t('other2'), // 其他2
                key: 'other2',
                type: 'text',
                width: '80px',
            }, {
                label: t('other3'), // 其他3
                key: 'other3',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTable: ProductData
export class StockArrayTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: t('orderBaseNum'), // 訂貨基數
                key: 'orderBaseNum',
                type: 'text',
                width: '80px',
            }, {
                label: t('stockNum'), // 目前庫存
                key: 'stockNum',
                type: 'text',
                width: '80px',
            }, {
                label: t('stockLimit'), // 庫存上限
                key: 'stockLimit',
                type: 'text',
                width: '80px',
            }, {
                label: t('stockSafe'), // 安全庫存
                key: 'stockSafe',
                type: 'text',
                width: '80px',
            }, {
                label: t('shelfLifeDays'), // 保值期(天)
                key: 'shelfLifeDays',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTable: ProductData
export class PriceArrayTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: t('currency'), // 幣別
                key: 'currency',
                type: 'text',
                width: '80px',
            }, {
                label: t('purchasePrice'), // 進貨價
                key: 'purchasePrice',
                type: 'text',
                width: '80px',
            }, {
                label: t('retailPrice'), // 零售價
                key: 'retailPrice',
                type: 'text',
                width: '80px',
            }, {
                label: t('discountPrice'), // 折扣價
                key: 'discountPrice',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTable: ProductData
export class SatisfactionTableModel {
    tableHeader = null;
    constructor(stateRef, { t }) {
        this.tableHeader = new TableHeader({
            header: [{
                label: t('time'), // 時間
                key: 'time',
                type: 'text',
                width: '120px',
                filter: dateFilter,
            }, {
                label: t('grade'), // 評分
                key: 'grade',
                type: 'text',
                width: '80px',
            }, {
                label: t('memberId'), // 會員ID
                key: 'memberId',
                type: 'text',
                width: '80px',
            }]
        });
    }
    getTableHeader() {
        return this.tableHeader;
    }
}

// SubTableModel: [BranchShop]
export class BranchShopTableModel extends StateModel {
    // constructor(...args) {
    //     // super(...args);
    // }
    data({ t }) {
        return {
            tableData: new TableData(),
            tableHeader: new TableHeader({
                // rowSelect: {
                //     mode: 'singleSelect', // 代表只能單選
                // },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                // buttonColumn: {
                //     specList: { // 商品規格陣列
                //         buttonItemList: [{
                //             type: 'button',
                //             label: t('branchShop.view'), // '檢視',
                //             event: 'viewSpecList',
                //             buttonType: 'fill',
                //             buttonMode: 'default',
                //             buttonPattern: 'buttonColumn',
                //         }],
                //     },
                // },
                header: [{
                    label: t('branchShop.shopId'), // 商家ID
                    key: 'shopId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.shopName'), // 商家名稱
                    key: 'shopName',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.branchId'), // 分店ID
                    key: 'branchId',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.branchShopName'), // 分店名稱
                    key: 'branchShopName',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.taxIdNum'), // 統編
                    key: 'sex',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.phone'), // 電話
                    key: 'phone',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.county'), // 縣市
                    key: 'county',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.district'), // 區域
                    key: 'district',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.address'), // 地址
                    key: 'address',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.latitude'), // 座標Lat(緯度)
                    key: 'latitude',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.longitude'), // 座標Lng(經度)
                    key: 'longitude',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('branchShop.createTime'), // 成立時間
                    key: 'createTime',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }, {
                    label: t('branchShop.lastUpdateTime'), // 最後更新時間
                    key: 'lastUpdateTime',
                    type: 'text',
                    width: '80px',
                    filter: dateTimeFilter,
                }],
            }),
            // --------------------------------------
            modalRef: null,
            modalTitle: t('dataCategory.product'),
            tab: '',
        };
    }
    getTableHeader() {
        return this.getState('tableHeader');
    }
    getTableData() {
        return this.getState('tableData');
    }
}


export class SheredDataModel extends StateModel {
    data({ t }) {
        return {
            startDate: null,
            endDate: null,
            platformType: '',
            dataCategory: '',
            dataStatus: '',
            srcSystem: '',
            srcSystemOptionList: [],
            srcSystemOptionListLoading: true,
            // schema table-------------------------------
            tableData: new TableData(),
            tableHeader: new TableHeader({
                rowSelect: {
                    mode: 'singleSelect', // 代表只能單選
                },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                header: [{
                    label: '',
                    key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                    type: 'checkBox',
                    mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
                }, {
                    label: 'recipe_id',
                    key: 'recipe_id',
                    type: 'text',
                    width: '80px',
                    // filter: 'decimalSeparator', // 自動加逗號
                    // fetch: 'name',
                }, {
                    label: t('platformType'), // 平台別
                    key: 'platformType',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('srcSystem'), // 來源系統
                    key: 'srcSystem',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('schemaFormat'), // 資料欄位格式
                    key: 'schemaFormat',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('statusCode'), // 狀態代碼
                    key: 'statusCode',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('dataNameEn'), // 資料名稱(英文)
                    key: 'dataNameEn',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('dataNameZh'), // 資料名稱(中文)
                    key: 'dataNameZh',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('totalDataAmount'), // 總資料筆數
                    key: 'totalDataAmount',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('createTime'), // 成立時間
                    key: 'createTime',
                    type: 'text',
                    width: '80px',
                    filter: dateFilter,
                }, {
                    label: t('updateTime'), // 更新時間
                    key: 'updateTime',
                    type: 'text',
                    width: '80px',
                    filter: dateFilter,
                }],
            }),
            // subTable -----------------------------
            subTable: '',
        }
    }

    getPanelQuery() {
        const startDate = this.getState('startDate');
        if (startDate) {
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);
        }
        const endDate = this.getState('endDate');
        if (endDate) {
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);
        }
        return {
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            platformType: this.getState('platformType'),
            dataCategory: this.getState('dataCategory'),
            dataStatus: this.getState('dataStatus'),
            srcSystem: this.getState('srcSystem'),
        };
    }

    getTableHeader() {
        return this.getState('tableHeader');
    }

    getTableData() {
        return this.getState('tableData');
    }

    // dispatch
    updateSubTable(val) {
        this.setState('subTable', val);
    }
}


// SubTable Model: externEnvironmentParam
export class ExternEnvironmentParamTableModel extends StateModel {
    data({ t }) {
        return {
            tableData: new TableData(),
            tableHeader: new TableHeader({
                // rowSelect: {
                //     mode: 'singleSelect', // 代表只能單選
                // },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                // buttonColumn: {
                //     phoneArray: { // <key> ==> 'action'
                //         buttonItemList: [{
                //             type: 'button',
                //             label: t('memberData.view'), // '檢視',
                //             event: 'viewPhoneArray',
                //             buttonType: 'fill',
                //             buttonMode: 'default',
                //             buttonPattern: 'buttonColumn',
                //         }],
                //     },
                // },
                header: [{
                    label: t('externEnvironmentParam.festivalName'), // 節日名稱
                    key: 'festivalName',
                    type: 'text',
                    width: '160px',
                }, {
                    label: t('externEnvironmentParam.startTime'), // 開始時間
                    key: 'startTime',
                    type: 'text',
                    width: '160px',
                    filter: dateTimeFilter,
                }, {
                    label: t('externEnvironmentParam.endTime'), // 結束時間
                    key: 'endTime',
                    type: 'text',
                    width: '160px',
                    filter: dateTimeFilter,
                }],
            }),
            // --------------------------------------
            modalRef: null,
            modalTitle: t('dataCategory.externEnvironmentParam'),
            tab: '',
        };
    }
    getTableHeader() {
        return this.getState('tableHeader');
    }
    getTableData() {
        return this.getState('tableData');
    }
}
