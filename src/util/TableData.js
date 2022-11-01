
import TableHeader from "./TableHeader"
import UrlQuery from "util/UrlQuery";

export default class TableData {
    mode = 'default';
    page = 1;
    totalPage = 1;
    tableData = [];

    tableHeader = null; // <TableHeader>

    originTableData = []; // apiRes抓出來的rows原始陣列
    pageSize = 0;

    // tableKey = '';
    paginationShow = true;

    urlQuery = null;

    constructor(data, mode = 'defualt', tableHeader) {

        this.mode = mode;
        // apiResData ---------------------------------------
        if (mode === 'mockserver' || mode === 'default') {
            const apiResData = data;
            // api-mock-server的格式: 本機端測試用
            /* apiResData: {
                page
                totalPage
                data
            }*/
            if (apiResData) {
                this.page = apiResData.page || 1;
                this.totalPage = apiResData.totalPage || 1;
                this.tableData = apiResData.data;
                this.tableHeader = tableHeader || null;
                this.pageSize = 10;
            } else {
                this.page = 1;
                this.totalPage = 1;
                this.tableData = [];
                this.tableHeader = tableHeader || null;
                this.pageSize = 10;
            }
        } else if (mode === 'static') {
            let rowList = data.data.map(row => row);
            this.page = data.page || 1;
            this.pageSize = data.pageSize || 10;
            this.totalPage = Math.ceil(rowList.length / this.pageSize);
            this.tableData = this.buildStaticTableData(rowList, this.page, this.pageSize);
            this.originTableData = rowList;

            // ps.目前沒在用

        } else if (mode === 'tableData') {
            // 代表是從其他的TableData物件重新生一個新的

            this.mode = data.getMode();

            this.page = data.getNowPage();
            this.totalPage = data.getTotalPage();
            this.tableData = data.getTableData();
            this.tableHeader = data.getTableHeader();
            this.pageSize = data.getPageSize();
            this.originTableData = data.getOriginTableData();

            // console.log(`mode tableData: tableData`, data)

        } else if (mode === 'crossbot') {
            // crossbot表格格式

            // console.log('crossbot TableData', JSON.stringify(data));
            /* data: {
                "count": 44,
                "rows": [{
                    "account": {
                        "id": 15,
                        "email": "hello@reas.com.tw",
                    },
                    "entity": {
                        "id": 0,
                        "name": null,
                    }
                }],
                page: 1, // <=== 追加
                pageSize: 10,  // <=== 追加
            }*/

            if (data.page === undefined || !data.pageSize) {
                // 允許page = 0，0代表第一頁
                console.error(`TableData construct fail by page, or pageSize not exist`);
                return;
            }

            this.page = data.page; // server的page參數從1開始

            // 計算出totalPage(總共有幾頁)
            this.pageSize = data.pageSize;
            this.totalPage = Math.ceil(data.count / data.pageSize);

            // 設定TableHeader物件
            this.setTableHeader(tableHeader);
            // console.log('this.tableHeader', this.tableHeader)

            this.originTableData = data.rows;
            this.tableData = this.convertSchemaRows(data.rows); // 將rows多層物件結構中，提取依照tableHeader的設定合成物件
        }

        // tableKey-------------------------------------

        // this.tableKey = tableKey;


        // 自動判斷是否要顯示Pagination-------------------------------------

        // console.log(`tableKey==>${this.tableKey} table page: ${this.page}   totalPage: ${this.totalPage}`)

        if (this.page === 1 && this.totalPage === 1) {
            this.paginationShow = false;
        } else {
            this.paginationShow = true;
        }
    }

    applyUrlQueryParam(urlQuery) {
        if (!(urlQuery instanceof UrlQuery)) {
            console.error(`applyUrlQueryParam fail`);
            return;
        }

        if (urlQuery.value.page) {
            this.page = urlQuery.value.page;
        }

        if (urlQuery.value.pageSize) {
            this.pageSize = urlQuery.value.pageSize;
        }

        this.urlQuery = urlQuery;

        return this;
    }

    // 用來將呼叫urlQuery.applyTableData包進TableData
    navigateUrlQuery(urlQuery) {
        // 原本拆開來的寫法
        // const newTableData = new TableData(apiRes, 'crossbot', tableHeader);
        // // 將newTableData內的page參數更新到urlQuery上
        // urlQuery.applyTableData(newTableData);

        if (!urlQuery) {
            console.warn(`navigateUrlQuery: urlQuery not exist`);
            return this;
        }

        urlQuery.applyTableData(this);
        return this;
    }

    getMode() {
        return this.mode;
    }

    getTableData() {
        return this.tableData || [];
    }

    getOriginTableData() {
        return this.originTableData || [];
    }

    buildStaticTableData(rowList, page, pageSize) {
        const startIndex = (page - 1) * pageSize;

        // console.log('buildStaticTableData rowList', rowList)
        // console.log('buildStaticTableData', startIndex, startIndex + pageSize)

        return rowList.slice(startIndex, startIndex + pageSize);
    };

    changeStaticTablePage(newPage) {
        // console.log('changeStaticTablePage', newPage, this.originTableData);
        this.page = newPage;
        this.tableData = this.buildStaticTableData(this.originTableData, this.page, this.pageSize);

        // console.log('changeStaticTablePage', newPage, this.tableData);
    }

    getNowPage() {
        if (this.page === undefined) {
            console.error('tableData getNotPage fail');
            return 1;
        }

        return this.page;
    }

    getPageSize() {
        return this.pageSize;
    }

    applyUrlQuery() {

    }

    applyDefaultPageSize(urlQuery) {
        // console.log('getDefaultPageSize', urlQuery)

        const defaultPageSize = 10;
        if (!urlQuery) {
            return defaultPageSize;
        }

        if (!(urlQuery instanceof UrlQuery)) {
            console.error('TableData: getDefaultPageSize fail, urlQuery is invalid');
            return defaultPageSize;
        }

        const queryValue = urlQuery.value;
        return queryValue.pageSize || defaultPageSize; // 預設pageSize是10
    }

    getTotalPage() {
        if (this.totalPage === undefined) {
            console.error('tableData getTotalPage fail');
            return 1;
        }
        return this.totalPage;
    }

    getPaginationShow() {
        return this.paginationShow;
    }

    // 修改某格的數值
    setCellValue(rowIndex, key, val) {
        // 該列的row生成一個新的
        const newRow = Object.assign({}, this.tableData[rowIndex]);

        let valueType;
        if (this.tableHeader) {
            valueType = this.tableHeader.getHeaderItemValueType(key);
        }

        if (valueType) {
            if (valueType === 'string') {
                newRow[key] = val;
            } else if (valueType === 'number') {
                newRow[key] = Number(val);
            } else {
                console.warn(`<TableData> setCellValue headerKey: ${key} valueTypeUnknown`);

                // 沒有讀取到valueType
                newRow[key] = val;
            }
        } else {
            // 沒有讀到valueType資料，只好直接塞入
            newRow[key] = val;
        }

        // 將row整個至換掉
        this.tableData[rowIndex] = newRow;
    }

    getTableHeader() {
        return this.tableHeader;
    }

    getRow(index) {
        return this.tableData[index];
    }

    setTableHeader(tableHeader) {
        if (!(tableHeader instanceof TableHeader)) {
            console.error(`setTableHeader fail`)
            return;
        }
        this.tableHeader = tableHeader;
    }

    convertSchemaRows(rows) {
        /*
        "rows": [
            {
            "account": {
                "id": 15,
                "email": "hello@reas.com.tw",
                "username": null,
                "phoneNumber": null,
                "enabled": true,
                "parentID": null,
                "lastLoginAt": null,
                "createdAt": "2022-06-30T08:48:13.015636Z",
                "updatedAt": null,
                "activated": null,
                "password": ""
            },
            "entity": {
                "id": 0,
                "name": null,
                "industryID": null,
                "phoneNumber": null,
                "business": null,
                "agent": null,
                "notes": null,
                "industry": {
                "id": 0,
                "name": ""
                },
                "numOfSubAccounts": 0,
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
                }
            }
            },
            {
            "account": {
                "id": 16,
                "email": "charlottew@gmail.com.tw",
                "username": null,
                "phoneNumber": null,
                "enabled": true,
                "parentID": null,
                "lastLoginAt": null,
                "createdAt": "2022-07-04T09:06:33.934406Z",
                "updatedAt": null,
                "activated": null,
                "password": ""
            },
            "entity": {
                "id": 0,
                "name": null,
                "industryID": null,
                "phoneNumber": null,
                "business": null,
                "agent": null,
                "notes": null,
                "industry": {
                "id": 0,
                "name": ""
                },
                "numOfSubAccounts": 0,
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
                }
            }
            }
        ]*/

        if (!this.tableHeader) {
            console.error(`tableHeader not exist at convertSchemaRows`);
            return;
        }

        const vm = this;

        // 跑每筆資料
        const tableData = rows.map(this.fetchTableRow.bind(this));

        // const tableData = rows.map((rowItem) => {
        //     return vm.fetchTableRow(rowItem);
        // });

        return tableData
    }

    // 轉換單一筆Row
    fetchTableRow(rowItem) {
        // rowItem: 伺服器載下來的單一筆資料格式
        /* rowItem: {
            account: {..},
            entity: {..},
        } */

        const rowData = {};

        // 跑每個Col: 每一個有fetch欄位的header資料
        this.tableHeader.forEachColFetch(function (fetchKeyList, headerItem, headerIndex) {

            // console.log('headerItem', headerItem)   

            let cellData;

            const fetchIndexEnd = fetchKeyList.length - 1;

            // 跑物件的每一層
            let obj = rowItem;
            // fetchKeyList.forEach((fetchKey, index) => {
            for (let index = 0; index < fetchKeyList.length; index += 1) {
                const fetchKey = fetchKeyList[index];

                if (index === fetchIndexEnd) {
                    // 代表已是最後一層，直接取資料
                    cellData = obj[fetchKey]
                } else {
                    // 代表未到最後一層，檢查是否有下一層
                    const nextObj = obj[fetchKey];
                    if (!nextObj) {
                        // 代表下一層的物件遺失
                        console.warn(`[TableData] fetchTableRow: nextObj not exist (${fetchKey} of ${headerItem.fetch})`);
                        // 塞入空字串
                        cellData = '';

                        // console.error(`nextObj is lost! fetch rowItem fail in ${fetchKey} of ${headerItem.fetch} at fetchTableRow`);
                        break;
                    }
                    // 有下一層，將下一層的物件塞進obj
                    obj = nextObj;
                }
            }

            rowData[headerItem.key] = cellData;
        });

        // 將原始資料留下
        rowData.__originRow = Object.assign({}, rowItem);

        return rowData;
    }

    filtEach(filterFunc) {
        let newTableData = this.tableData.map(filterFunc);
        this.tableData = newTableData;
    }

}