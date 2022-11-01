import ApiSender, { ApiError } from 'apiSender'
import { selectAddQuotaRankForm } from 'store/quotaRank';
import { useTranslation } from "react-i18next";
import TableData from 'util/TableData';
import TableHeader from 'util/TableHeader';

// import NumberFilter from 'filter/NumberFilter';

const getQuotaRankTableHeader = function (t) {

    const tableHeader = new TableHeader({
        rowSelect: {
            mode: 'singleSelect', // 代表只能單選
        },
        headerExtra: [{ // 額外要載入的欄位
            key: 'priceIntervalId',
            fetch: 'id',
        }],
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
            fetch: 'name',
        }, {
            label: t('userNumLimit'), // 用戶數上限
            key: 'userNumLimit',
            type: 'text',
            width: '120px',
            filter: 'decimalSeparator',
            textType: 'editable', // 可修改數值
            valueType: 'number', // 要使用setCellValue需要設定valueType，才有辦法正確設定進去
            fetch: 'userLimit',
        }, {
            label: t('feePerPerson'), //  '用量費/人'
            key: 'feePerPerson',
            type: 'text',
            // filter: new NumberFilter('floatDecimalPlaces', 2),
            textType: 'editable', // 可修改數值
            valueType: 'number',
            width: '300px',
            fetch: 'unitPrice',
        }, {
            label: t('month'), // 月
            key: 'discountPerMonth', // 月付折扣
            type: 'text',
            upperHeaderRef: 'discount', // 指定上層的欄位: 折扣
            // filter: new NumberFilter('floatDecimalPlaces', 2),
            textType: 'editable', // 可修改數值
            valueType: 'number',
            width: '120px',
            fetch: 'monthDiscountRate',
        }, {
            label: t('year'), // 年
            key: 'discountPerYear', // 年付折扣
            type: 'text',
            upperHeaderRef: 'discount', // 指定上層的欄位: 折扣
            // filter: new NumberFilter('floatDecimalPlaces', 2),
            textType: 'editable', // 可修改數值
            valueType: 'number',
            width: '120px',
            fetch: 'yearDiscountRate',
        }, {
            label: t('month'), // 月
            key: 'feePerMonthAfterDiscount',
            type: 'text',
            upperHeaderRef: 'feeAfterDiscount', // 指定上層的欄位: 折扣後費用
            filter: 'decimalSeparator',
            valueType: 'number',
            fetch: 'MonthAmount.discount',
            // transform: function (row) {
            //     const basePrice = Number(row.userNumLimit) * Number(row.feePerPerson)
            //     return basePrice * Number(row.discountPerMonth);
            // },
        }, {
            label: t('year'), // 年
            key: 'feePerYearAfterDiscount',
            type: 'text',
            upperHeaderRef: 'feeAfterDiscount', // 指定上層的欄位: 折扣後費用
            filter: 'decimalSeparator',
            valueType: 'number',
            fetch: 'year.discount',
            // transform: function (row) {
            //     const basePrice = Number(row.userNumLimit) * Number(row.feePerPerson) * 12;
            //     const feePerMonthAfterDiscount = basePrice * Number(row.discountPerYear);
            //     return feePerMonthAfterDiscount;
            // },
        }, {
            label: '', // 啟用/停用
            key: 'enable',
            type: 'toggleSwitch',
            fetch: 'enabled',
        }],
    });
    return tableHeader;
}


// quotaRankTable
export class QuotaRankTableFlow {
    fetchControl = null;

    tableDataRef = null;
    tableHeader = null;
    // tableData = null;

    t = null;

    constructor(tableDataRef) {
        if (!tableDataRef) {
            console.error(`tableDataRef not exist on OrderTableFlow constructor`);
            return;
        }
        this.tableDataRef = tableDataRef;
        // 初始化tableData
        this.tableDataRef.current = new TableData(null, 'default');

        const { t } = useTranslation('pay', { keyPrefix: 'quotaRankManage' });
        this.tableHeader = getQuotaRankTableHeader(t);

        this.t = t;
    }

    setFetchControl(fetchControl) {
        this.fetchControl = fetchControl;
    }

    // tableHeader------------------------------------------------

    getTableHeader() {
        if (!this.tableHeader) {
            console.error(`[QuotaRankTableFlow] getTableHeader: tableHeader not exist`);
            return null;
        }
        return this.tableHeader;
    }

    // tableDataRef------------------------------------------------

    setTableData(newTableData) {
        if (!this.tableDataRef) {
            console.error(`[QuotaRankTableFlow] setTableData: tableDataRef not exist`);
            return;
        }
        this.tableDataRef.current = newTableData;
    }
    getTableData() {
        if (!this.tableDataRef) {
            console.error(`[QuotaRankTableFlow] getTableData: tableDataRef not exist`);
            return;
        }
        return this.tableDataRef.current;
    }

    // -------------------------------------------------

    // event.1 初始化載入table
    handleInitQuotaRank() {
        this.loadQuotaRank();
        // 綁定useEffect的函式，回傳promise會報錯，因此多疊一層
    }

    // event.2 修改文字欄位資料
    onTdEdit(tdValue, cellInfo) {
        const vm = this;
        const t = this.t;
        // console.log(`onTdEdit row<${key}>[${rowIndex}] ===> ${val} `);
        console.log(tdValue, cellInfo.getHeaderKey(), cellInfo.getRowIndex(), cellInfo.getRow());

        let row = cellInfo.getRow();
        const priceIntervalId = row.priceIntervalId;

        // 將新的value塞進該欄位
        const headerKey = cellInfo.getHeaderKey();
        row[headerKey] = tdValue;

        /* row: {
            discountPerMonth: "1.0000"
            discountPerYear: "0.6500"
            enable: false
            feePerPerson: "0.3000"
            priceIntervalId: 1
            rankName: ""
            userNumLimit: 2000
            __originRow: {
                MonthAmount: {
                    amount: 0
                    discount: 600
                    originalPrice: 600
                    tax: 0
                    totalAmount: 0
                },
                year: {
                    amount: 2520
                    discount: 4680
                    originalPrice: 7200
                    tax: 0
                    totalAmount: 2520
                }
                createdAt: null
                enabled: false
                id: 1
                monthDiscountRate: "1.0000"
                name: ""
                taxRate: "0.0000"
                unitPrice: "0.3000"
                userLimit: 2000
                yearDiscountRate: "0.6500"
            }
        } */


        const apiReq = {
            'createdAt': null,
            'enabled': row.enable,
            'id': priceIntervalId,
            'monthDiscountRate': Number(row.discountPerMonth),
            'name': row.rankName,
            'taxRate': 0, // 不管他
            'unitPrice': Number(row.feePerPerson),
            'userLimit': Number(row.userNumLimit),
            'yearDiscountRate': Number(row.discountPerYear),
        }

        ApiSender.sendApi('[put]/price-intervals/{id}', apiReq, {
            apiInnerData: {
                id: priceIntervalId,
            }
        }).then(() => {
            return vm.loadQuotaRank();
        }).then(() => {
            vm.fetchControl('notify').notify(t('quotaRankHasUpdated'));
        }).catch(new ApiError().catchAlertMsg());
    }

    // event.3 修改enable開關
    onEnableChange(checked, cellInfo) {
        this.onTdEdit(checked, cellInfo);
    }

    loadQuotaRank(newPage = 1, unlock = () => { }) {
        const vm = this;
        return ApiSender.sendApi('[get]/price-intervals', {
            // page: newPage, // API的page參數從1開始
            // pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
            // orderBy
            // limit
            // offset
        }).then((apiRes) => {
            apiRes.page = 1;
            apiRes.pageSize = 20;

            vm.refreshTableData(new TableData(apiRes, 'crossbot', vm.getTableHeader()));

            unlock();
        }).catch(new ApiError(function (error, next) {
            unlock();
            next(); // 開啟Alert燈箱
        }).catchAlertMsg());
    }


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
}

// addQuotaRank
export class AddQuotaRankFlow {
    modalPromiseRef = null;
    addRankModalRef = null;

    fetchControl = null;

    t = null;

    constructor(modalPromiseRef, addRankModalRef, t) {
        if (!modalPromiseRef) {
            console.error(`modalPromiseRef not exist on AddQuotaRankFlow constructor`);
            return;
        }
        if (!addRankModalRef) {
            console.error(`addRankModalRef not exist on AddQuotaRankFlow constructor`);
            return;
        }
        this.modalPromiseRef = modalPromiseRef;
        // this.tableDataRef.current = new TableData(null, 'default');

        this.addRankModalRef = addRankModalRef;

        if (!t) {
            console.error(`t not exist on AddQuotaRankFlow constructor`);
            return;
        }
        this.t = t;

    }
    setFetchControl(fetchControl) {
        this.fetchControl = fetchControl;
    }

    setQuotaRankTableFlow(quotaRankTableFlow) {
        this.quotaRankTableFlow = quotaRankTableFlow;
    }

    bindOpenManageUserModalRef() {
        return this.setOpenManageUserModalRef.bind(this);
    }
    setOpenManageUserModalRef(ref) {
        // console.log('setOpenManageUserModalRef', ref);
        this.addRankModalRef.current = ref;
    }

    // [AddFlow] step.1開啟Modal
    openModalAdd() {
        this.addRankModalRef.current.openModal();
        return new Promise((resolve, reject) => {
            this.modalPromiseRef.current = { resolve, reject };
        });
    }

    // [AddFlow] step.2儲存
    onQuotaRankSave(addQuotaRankForm) {
        console.log('onQuotaRankSave', addQuotaRankForm)
        const vm = this;
        // const { t } = useTranslation('quotaRankManage', { keyPrefix: 'table' });

        // const { t } = useTranslation('pay', { keyPrefix: 'quotaRankManage' });
        const t = this.t;

        if (!this.modalPromiseRef.current) {
            return;
        }

        if (this.modalPromiseRef.current) {
            this.modalPromiseRef.current.resolve();
            this.modalPromiseRef.current = null;

            this.addRankModalRef.current.closeModal();
        }

        console.log('addQuotaRankForm', addQuotaRankForm)

        /* addQuotaRankForm: {
           discountByMonth: 1
            discountByYear: 0.85
            feeAfterDiscountByMonth: 100
            feeAfterDiscountByYear: 85
            feePerPerson: 0.1
            rankName: "1000級距"
            userNumLimit: 1000
        } */

        ApiSender.sendApi('[post]/price-intervals', {
            "createdAt": new Date().toISOString(),
            "enabled": true,
            "id": 0,
            "monthDiscountRate": addQuotaRankForm.discountByMonth,
            "name": addQuotaRankForm.rankName,
            "taxRate": 0,
            "unitPrice": addQuotaRankForm.feePerPerson,
            "userLimit": addQuotaRankForm.userNumLimit,
            "yearDiscountRate": addQuotaRankForm.discountByYear,
        }).then((apiRes) => {
            /* apiRes: {
                createdAt: "2022-08-22T08:25:38.058310135Z"
                enabled: false
                id: 1
                monthDiscountRate: "<nil>"
                name: ""
                taxRate: "0.0500"
                unitPrice: "<nil>"
                userLimit: 0
                yearDiscountRate: "<nil>"
            } */
            // console.log('apiRes', apiRes)

            // 刷新表格
            vm.quotaRankTableFlow.loadQuotaRank();

            vm.fetchControl('notify').notify(t('addDoneTip'));
        }).catch(new ApiError().catchAlertMsg());
    }

    // onModalClose
    onModalClose() {
        if (this.addRankModalRef.current) {
            if (this.addRankModalRef.current.reject) {
                this.addRankModalRef.current.reject('close');
                this.addRankModalRef.current = null;
            }
        }
    }
}