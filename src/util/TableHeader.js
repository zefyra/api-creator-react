
/* headerDataObj: {
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
            buttonColumn: {
                action: { // <key> ==> 'action'
                    width: '300px',
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
            // headerExtra用例-------------------------------------
            headerExtra: [{ // 額外要載入的欄位
                key: 'invoiceImgUrl',
                fetch: 'order.invoiceImgUrl',
            }],
            // header用例-------------------------------------
            header: [{
                label: '',
                key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                type: 'checkBox',
                mode: 'singleSelect',
            }, {
                label: t('rankName'),
                key: 'rankName',
                type: 'text', // 一般文字
            }, {
                label: t('invoiceStatus'), //  '開票狀態',
                key: 'invoiceStatus',
                type: 'text',
                filter: function (type) {
                    const typeMap = {
                        'notInvoice': '未開票',
                        'hasInvoice': '已開票',
                    }
                    return typeMap[type];
                }
            }, {
                label: '',
                key: 'enable',
                type: 'toggleSwitch', // 開關
            }, {
                label: t('invoiceId'),
                key: 'invoiceId',
                type: 'text',
                fetch: 'invoice.id', // 代表TableData初始化時，要從哪個欄位取資料
                textType: 'urlLink', // 文字連結
                linkHeaderRef: 'invoiceImgUrl', // 連結的URL
            }],
        } */

import { TableSelectModeEnum } from "enum/Table";

export default class TableHeader {
    rowSelect = null;
    /* rowSelect: {
        mode: 'singleSelect', // 代表只能單選
    },*/
    upperHeader = null;
    /* upperHeader: {
        discount: { // <key>
            // key: 'discount',
            label: t('discount'), // 折扣
            type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
        },
        feeAfterDiscount: {
            label: t('feeAfterDiscount'), // 折扣後費用
            type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
        }
    }, */
    buttonColumn = null;
    /* buttonColumn: {
        action: { // <key> ==> 'action'
            width: '300px',
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
            }],
        }
    },*/
    header = null;
    headerExtra = null;

    rowSelectHeaderItem = null;

    fetchInfoList = null;

    constructor(headerDataObj = {}) {
        this.rowSelect = headerDataObj.rowSelect;
        this.upperHeader = headerDataObj.upperHeader;
        this.buttonColumn = headerDataObj.buttonColumn;
        this.header = headerDataObj.header || []; // 此為必要欄位
        // 自動加入rowSelect的設定
        this.header = this.autoAddRowSelectMode(this.header, headerDataObj);

        // 取得預設的rowSelect欄位，若沒有抓到則是null
        this.rowSelectHeaderItem = this.autoGetDefaultRowSelectHeaderItem(this.header);

        this.validateInitHeader(this.header);
        this.headerExtra = headerDataObj.headerExtra; // 額外要載入的欄位

        // 建立headerIndexMap
        let headerIndexMap = {};
        this.header.forEach((headerItem, headerIndex) => {
            headerIndexMap[headerItem.key] = headerIndex;
        });

        this.headerIndexMap = headerIndexMap;
        this.initFetchInfoList(); // 初始化fetchInfoList
    }

    // [public] 外部取得預設的__rowSelect headerItem
    getDefaultRowSelectHeaderItem() {
        return this.rowSelectHeaderItem;
    }
    checkRowSelectEnable() {
        return this.rowSelectHeaderItem != null;
    }

    autoGetDefaultRowSelectHeaderItem(header) {
        return header.find((headerItem) => {
            return headerItem.key === '__rowSelect';
        }) || null;
    }

    // 對應舊版 rowSelect設定檔的寫法
    autoAddRowSelectMode(header, headerDataObj) {
        let rowSelectMode;
        if (headerDataObj.rowSelect) {
            if (headerDataObj.rowSelect.mode) {
                rowSelectMode = headerDataObj.rowSelect.mode;
            }
        }

        if (!rowSelectMode) {
            return header;
        }

        header.forEach((eachHeaderItem) => {
            if (eachHeaderItem.key === '__rowSelect') {
                // 要自動加入 __rowSelect 的headerItem
                eachHeaderItem.selectMode = rowSelectMode;
            }
        });

        return header;
    }

    validateInitHeader(header) {

        let keyMap = {};

        // 檢查key是否有重複
        header.forEach((headerItem) => {
            if (!keyMap[headerItem.key]) {
                keyMap[headerItem.key] = true;
            } else {
                console.error(`Header key invalid: key \`${headerItem.key}\` is duplicate in TableHeader`);
            }
        });
    }

    // 初始化fetchInfoList
    initFetchInfoList() {
        if (!this.header) {
            console.error(`header not exist at initFetchInfoList`);
            return;
        }

        const fetchInfoList = [];
        // fetchInfoList: [ [<key1>, <key2>], ... ]
        this.header.forEach((headerItem, headerIndex) => { // , headerIndex
            if (!headerItem.fetch) {
                // 只跑有fetch欄位的header
                return;
            }

            const fetchUri = headerItem.fetch;
            // fetchKey: 'account.username'

            const fetchKeyList = fetchUri.split('.');
            fetchInfoList.push({
                headerItem: headerItem,
                headerIndex: headerIndex,
                fetchKeyList: fetchKeyList,
            });
        });


        // 跑額外的隱藏欄位
        if (this.headerExtra) {

            const prevLen = fetchInfoList.length;

            this.headerExtra.forEach((headerItem, headerIndex) => {
                const fetchUri = headerItem.fetch;
                const fetchKeyList = fetchUri.split('.');
                fetchInfoList.push({
                    headerItem: headerItem,
                    headerIndex: prevLen + headerIndex,
                    fetchKeyList: fetchKeyList,
                });
            })
        }

        this.fetchInfoList = fetchInfoList;
    }

    getHeaderItemValueType(headerKey) {
        if (typeof headerKey === 'string') {
            const headerIndex = this.headerIndexMap[headerKey];
            const headerItem = this.header[headerIndex];

            if (headerItem) {
                return headerItem.valueType || 'string'; // valueType預設為 'string'
            }
        }
        // typeof headerKey === 'number'

        return null;
    }

    forEachColFetch(handleCol) {
        if (!this.fetchInfoList) {
            console.error(`fetchInfoList not exist at forEachColFetch`);
            return;
        }

        this.fetchInfoList.forEach((fetchInfo) => {
            /* fetchInfo: {
                headerItem: headerItem,
                headerIndex: headerIndex,
                fetchKeyList: [ 'account', 'username' ],
            } */

            handleCol(fetchInfo.fetchKeyList, fetchInfo.headerItem, fetchInfo.headerIndex);
        });
    }
    // getRowSelectMode() {
    //     if (!this.rowSelect) {
    //         return TableSelectModeEnum.multi;
    //     }
    //     if (!this.rowSelect.mode) {
    //         return TableSelectModeEnum.multi;
    //     }
    //     return this.rowSelect.mode;
    // }
}