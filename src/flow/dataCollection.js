import TableControl from "control/Table";
import PlatformTypeEnum from "enum/dataCollection/PlatformType";
import DataCategoryEnum from "enum/dataCollection/DataCategory";
import CellInfo from "util/CellInfo";
import TableData from "util/TableData";
import TableHeader from "util/TableHeader";

// Control: 'customData'
export class CustomDataFlow extends TableControl {
    addSchemaModalRef = null;
    frame() {
        return {
            'customData': true,
        };
    }

    // Schema Panel----------------------------------------------

    initLoadSrcSystemOptionList() {

        const vm = this;
        setTimeout(function () {
            vm.fetchModel('customData').setState('srcSystemOptionList', [{
                label: '春水堂',
                value: 'shunsuidou',
            }, {
                label: '老賴茶棧',
                value: 'laicha',
            }, {
                label: '大苑子',
                value: 'dayouzu',
            }, {
                label: '50藍',
                value: '50lan',
            }]);

            // 標記已載入完成
            vm.fetchModel('customData').setState('srcSystemOptionListLoading', false);
        }, 5000);
    }

    // Panel執行篩選
    onQuery() {
        const queryObj = this.fetchModel('customData').getPanelQuery();
        console.log('onQuery', queryObj);
    }

    // Schema action--------------------------------------
    bindAddSchemaModalRef(modalRef) {
        this.addSchemaModalRef = modalRef;
    }

    // Schema Table--------------------------------------------

    // mounted
    bindMount() {
        return super.bindMount(this.loadCustomSchema);
    }


    loadCustomSchema(newPage = 1, unlock = () => { }) {

        // console.log('loadCustomSchema', newPage)
        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                recipe_id: '',
                platformType: PlatformTypeEnum.ec,
                srcSystem: 'shop001',
                schemaFormat: '交易紀錄',
                statusCode: '1',
                dataNameEn: 'EC_Order',
                dataNameZh: '訂單紀錄',
                totalDataAmount: 413,
                doneDataAmount: 413,
                changeSyncSrcSystem: true,
                createTime: dStr,
                updateTime: dStr,
                __subTable: DataCategoryEnum.transactionLog,
            }, {
                recipe_id: '',
                platformType: PlatformTypeEnum.crm,
                srcSystem: 'shop002',
                schemaFormat: '會員資料',
                statusCode: '2',
                dataNameEn: 'member',
                dataNameZh: '會員資料',
                totalDataAmount: 1153,
                doneDataAmount: 0,
                changeSyncSrcSystem: true,
                createTime: dStr,
                updateTime: dStr,
                __subTable: DataCategoryEnum.memberData,
            }, {
                recipe_id: '',
                platformType: PlatformTypeEnum.erp,
                srcSystem: 'shop002',
                schemaFormat: '商品分類',
                statusCode: '2',
                dataNameEn: 'Categories',
                dataNameZh: '商品分類',
                totalDataAmount: 23,
                doneDataAmount: 20,
                changeSyncSrcSystem: true,
                createTime: dStr,
                updateTime: dStr,
                __subTable: DataCategoryEnum.productCategory,
            }, {
                recipe_id: '',
                platformType: PlatformTypeEnum.pos,
                srcSystem: 'shop002',
                schemaFormat: '商品資料',
                statusCode: '2',
                dataNameEn: 'Product',
                dataNameZh: '商品資料',
                totalDataAmount: 240,
                doneDataAmount: 22,
                changeSyncSrcSystem: true,
                createTime: dStr,
                updateTime: dStr,
                __subTable: DataCategoryEnum.productData,
            }, {
                recipe_id: '',
                platformType: PlatformTypeEnum.pos,
                srcSystem: 'shop002',
                schemaFormat: '分店門市',
                statusCode: '2',
                dataNameEn: 'Product',
                dataNameZh: '分店門市',
                totalDataAmount: 199,
                doneDataAmount: 19,
                changeSyncSrcSystem: true,
                createTime: dStr,
                updateTime: dStr,
                __subTable: DataCategoryEnum.branchShop,
            }],
        }

        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));
        // .navigateUrlQuery(vm.urlQuery)

        return Promise.resolve();
    }

    // 選取列
    onSchemaTableSelectChange(checked, cellInfo) {
        // console.log('onSchemaTableSelectChange',aaa, bbb, ccc)


        if (!checked) {
            this.fetchModel('customData').updateSubTable('');
            return;
        }

        const row = cellInfo.getRow();

        if (!row.__subTable) {
            console.error(`row __subTable field not exist`, row);
            return;
        }

        // 讀取tableDataSample塞入的__subTable做識別
        this.fetchModel('customData').updateSubTable(row.__subTable);
    }

    // 換頁
    onSchemaTablePageChange() {

    }

    // 新增
    onSchemaCreateOpen() {
        // console.log('onSchemaCreate', this.addSchemaModalRef)
        if (!this.addSchemaModalRef) {
            console.error(`CustomDataFlow: addSchemaModalRef not exist`);
            return;
        }
        this.addSchemaModalRef.openModal();
    }

    // 新增 > 取消
    onSchemaCreateModalCancel() {
        console.log('onSchemaCreateModalCancel');
        if (!this.addSchemaModalRef) {
            console.error(`CustomDataFlow: addSchemaModalRef not exist`);
            return;
        }
        this.addSchemaModalRef.closeModal();
    }
    // 新增 > 確認
    onSchemaCreateModalConfirm() {
        console.log('onSchemaCreateModalConfirm');
        if (!this.addSchemaModalRef) {
            console.error(`CustomDataFlow: addSchemaModalRef not exist`);
            return;
        }
        this.addSchemaModalRef.closeModal();
    }

    // 同步
    onSchemaSync() {

    }

    // 重新比對
    onSchemaCompareAgain() {

    }

    // 清除資料
    onSchemaClearData() {

    }

    // 刪除
    onSchemaDelete() {

    }
}

// 對應<CustomDataFieldTable>組件
// 下方那個Table的基本模板，所有SubTable都要實做這個template
export class SubTableControl extends TableControl {
    // controlName = '';
    stateModel = null;

    tabTableControlMap = {};
    /* tabTableControlMap: {
        gatewayUid: <ModalTableControl>
    } */
    constructor(stateRef, modelObj) {
        if (!modelObj) {
            console.error(`SubTableControl contructor fail: modelObj not exist`);
            return;
        }

        // 初始化TableControl
        super(stateRef, modelObj.getTableHeader())
        // this.controlName = this.constructor.name;

        this.stateModel = modelObj;
    }
    onTablePageChange() {
        console.log('onTablePageChange')
    }
    bindMount(lodingFunc) {
        if (!lodingFunc) {
            return () => { };
        }

        return super.bindMount(lodingFunc);
    }
    // template
    onButtonClick(event, cellInfo) {
        // console.log('onButtonClick', event, cellInfo)
    }

    bindModalRef() {

    }

    getStateModel() {
        return this.stateModel;
    }
    setStateModel(stateModel) {
        this.stateModel = stateModel;
    }

    setTabTableControlMap(controlMap) {
        const allPass = Object.keys(controlMap).every((key) => {
            return controlMap[key] instanceof ModalTableControl;
        });
        if (!allPass) {
            console.error(`setTabTableControlMap: not all object is instanceof ModalTableControl`);
            return;
        }
        this.tabTableControlMap = controlMap;
    }
    getTabTableControl(tabKey) {
        // console.log(`getTabTableControl`, this)

        return this.tabTableControlMap[tabKey];
    }
    runEachTabTableControl(callback) {
        Object.keys(this.tabTableControlMap).forEach((tabKey) => {
            callback(this.tabTableControlMap[tabKey], tabKey);
        });
    }
    // getControlName() {
    //     return this.controlName;
    // }
}

// Control: 'customField'
export class MemberDataTableFlow extends SubTableControl {
    bindMount() {
        return super.bindMount(this.loadingMemberData);
    }
    loadingMemberData(newPage = 1, unlink = () => { }) {
        // console.log('loadingMemberData')
        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                key: '',
                memberId: '0910639222',
                lastName: '李',
                firstName: '沉淵',
                memberRank: 'vip2',
                sex: 'male',
                birthday: dStr,
                identityNumber: 'F123456789',
                account: 'selfindex',
                gatewayUid: '',
                emailArray: '',
                addressArray: '',
                phoneArray: '',
                job: 'information',
                family: '1,5,6,8',
                registDate: dStr,
                lastLoginDate: dStr
            }],
        }
        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));


        return Promise.resolve();
    }
    onButtonClick(event, cellInfo) {
        this.onViewInfo(cellInfo);
    }

    onViewInfo(cellInfo) {
        const headerKey = cellInfo.getHeaderKey();

        // 跑每個control將資料設定進去
        this.runEachTabTableControl(function (modalTableControl) {
            // modalTableControl: <ModalTableControl>
            modalTableControl.saveCellInfo(cellInfo);
            modalTableControl.mountTable(cellInfo);
        });

        this.getStateModel().setState('tab', headerKey);

        // 開啟Modal
        const modalRef = this.getStateModel().getState('modalRef');
        if (!modalRef) {
            console.error(`modalRef not exist`);
            return;
        }
        modalRef.openModal();
    }

    // Modal-----------------------------------------
    bindModalRef(ref) {
        // console.log('bindModalRef', ref)
        this.getStateModel().setState('modalRef', ref);
    }
}

// 對應<TabTable>組件
// Modal內部每個Tab的Table基本模板，所有Tab都要實做它
export class ModalTableControl extends TableControl {
    // stateModel = null;
    // constructor(stateRef, modelObj) {
    //     // 初始化TableControl
    //     super(stateRef, modelObj.getTableHeader())
    //     this.stateModel = modelObj;
    // }

    // controlName = '';
    cellInfo = null;
    constructor(stateRef, modelObj) {
        super(stateRef, modelObj.getTableHeader());
        // this.controlName = this.constructor.name;
    }

    onPageChange() {

    }
    // getControlName() {
    //     return this.controlName;
    // }

    // 單純儲存cellInfo
    saveCellInfo(cellInfo) {
        // cellInfo: 來自SubTable的<CellInfo>
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`saveCellInfo fail: cellInfo is not instanceof CellInfo`);
            return;
        }
        this.cellInfo = cellInfo;
    }
    mountTable(cellInfo) {
        // cellInfo: 來自SubTable的<CellInfo>
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }
    }
}

// DataCategory: MemberData
export class GatewayUidTableFlow extends ModalTableControl {
    // constructor(stateRef) {
    //     super(stateRef, GatewayUidTableHeader);
    // }

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                id: '00213',
                type: 'LINE',
                uid: '5a3a1fe8011b35034cd54e14',
            }, {
                id: '00213',
                type: 'LINE',
                uid: '5a3a1fe8011b35034cd54e25',
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}

// DataCategory: MemberData
export class EmailArrayTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                id: '00213',
                type: '1',
                email: 'aaaa@bbb.cccc',
                description: '公司',
            }, {
                id: '00214',
                type: '2',
                email: 'zzzz@bbb.ccc',
                description: '公司',
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}

// DataCategory: MemberData
export class AddressArrayTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                id: '0021322',
                type: '0',
                nation: '台灣',
                county: '台北市',
                region: '中正區',
                address: '和平西路二段33號6F'
            }, {
                id: '0021322',
                type: '2',
                nation: '台灣',
                county: '台北市',
                region: '中正區',
                address: '和平西路二段33號6F'
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}

// DataCategory: MemberData
export class PhoneArrayTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                id: '00213',
                type: '1',
                number: '02-4432-3345',
                extension: '22',
                description: '家裡'
            }, {
                id: '00214',
                type: '1',
                number: '0915990111',
                extension: '',
                description: '個人手機'
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}


// Control: 'customField'(CustomData)
export class TransactionLogTableFlow extends SubTableControl {
    bindMount() {
        return super.bindMount(this.loadingTransactionLog);
    }
    loadingTransactionLog(newPage = 1, unlink = () => { }) {
        // console.log('loadingMemberData')
        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                key: '',
                memberId: '0910539222',
                orderId: '200310002',
                shopId: '',
                branchId: '',
                status: '已付款',
                productArray: '',
                freight: '200',
                productPrice: '2,300',
                totalPrice: '2,500',
                invoiceNumber: 'XX-85194056',
                orderCreateTime: dStr,
                payTime: dStr
            }, {
                key: '',
                memberId: '0910539222',
                orderId: '200310002',
                shopId: '',
                branchId: '',
                status: '已付款',
                productArray: '',
                freight: '200',
                productPrice: '2,300',
                totalPrice: '2,500',
                invoiceNumber: 'XX-85194056',
                orderCreateTime: dStr,
                payTime: dStr
            }],
        }
        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));

        return Promise.resolve();
    }
    onButtonClick(event, cellInfo) {
        this.onViewInfo(cellInfo);
    }

    onViewInfo(cellInfo) {
        const headerKey = cellInfo.getHeaderKey();

        // 跑每個control將資料設定進去
        this.runEachTabTableControl(function (modalTableControl) {
            // modalTableControl: <ModalTableControl>
            modalTableControl.saveCellInfo(cellInfo);
            modalTableControl.mountTable(cellInfo);
        });

        this.getStateModel().setState('tab', headerKey);

        // 開啟Modal
        const modalRef = this.getStateModel().getState('modalRef');
        if (!modalRef) {
            console.error(`modalRef not exist`);
            return;
        }
        modalRef.openModal();
    }

    // Modal-----------------------------------------
    bindModalRef(ref) {
        // console.log('bindModalRef', ref)
        this.getStateModel().setState('modalRef', ref);
    }
}


// DataCategory: TransactionLog
export class ProductArrayTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                productCategoryId: '31',
                categoryName: '女性上衣',
                productId: 'S2031',
                barcode: '',
                productName: '運動型黑色背心',
                brand: 'gg',
                currency: 'VND',
                amount: 1,
                unitPrice: 400,
                totalPrice: 400,
            }, {
                productCategoryId: '22',
                categoryName: '男性褲子',
                productId: 'S2032',
                barcode: '',
                productName: '牛仔褲',
                brand: 'HK',
                currency: 'VND',
                amount: 1,
                unitPrice: 250,
                totalPrice: 400,
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}


// Control: 'customField'(CustomData)
export class productCategoryTableFlow extends SubTableControl {
    bindMount() {
        return super.bindMount(this.loadingTransactionLog);
    }
    loadingTransactionLog(newPage = 1, unlink = () => { }) {
        // console.log('loadingMemberData')
        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                productCategoryId: '001',
                upperCategoryId: '',
                productCategoryName: '女性上衣',
                productNum: 62,
                createTime: dStr,
                lastUpdateTime: dStr,
            }, {
                productCategoryId: '002',
                upperCategoryId: '',
                productCategoryName: '男性上衣',
                productNum: 40,
                createTime: dStr,
                lastUpdateTime: dStr
            }, {
                productCategoryId: '003',
                upperCategoryId: '001',
                productCategoryName: '外出',
                productNum: 22,
                createTime: dStr,
                lastUpdateTime: dStr
            }],
        }
        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));


        return Promise.resolve();
    }
    onButtonClick(event, cellInfo) {
        this.onViewInfo(cellInfo);
    }

    onViewInfo(cellInfo) {
        const headerKey = cellInfo.getHeaderKey();

        // 跑每個control將資料設定進去
        this.runEachTabTableControl(function (modalTableControl) {
            // modalTableControl: <ModalTableControl>
            modalTableControl.saveCellInfo(cellInfo);
            modalTableControl.mountTable(cellInfo);
        });

        this.getStateModel().setState('tab', headerKey);

        // 開啟Modal
        const modalRef = this.getStateModel().getState('modalRef');
        if (!modalRef) {
            console.error(`modalRef not exist`);
            return;
        }
        modalRef.openModal();
    }

    // Modal-----------------------------------------
    bindModalRef(ref) {
        // console.log('bindModalRef', ref)
        this.getStateModel().setState('modalRef', ref);
    }
}

// Control: 'customField'(CustomData)
export class ProductDataTableFlow extends SubTableControl {
    bindMount() {
        return super.bindMount(this.loadingTransactionLog);
    }
    loadingTransactionLog(newPage = 1, unlink = () => { }) {
        // console.log('loadingMemberData')
        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                productId: 'BC12003',
                barcode: '',
                categoryId: '001',
                productName: 'HK圓領上衣',
                brand: '三歐',
                supplier: '俱全國際',
                specArray: '',
                stockArray: '',
                priceArray: '',
                satisfaction: '',
                createTime: dStr,
                lastUpdateTime: dStr
            }, {
                productId: 'BC12003',
                barcode: '',
                categoryId: '002',
                productName: 'HK高領上衣',
                brand: '三歐',
                supplier: '俱全國際',
                specArray: '',
                stockArray: '',
                priceArray: '',
                satisfaction: '',
                createTime: dStr,
                lastUpdateTime: dStr
            }, {
                productId: 'BC12003',
                barcode: '',
                categoryId: '003',
                productName: 'HK_V領上衣',
                brand: '三歐',
                supplier: '俱全國際',
                specArray: '',
                stockArray: '',
                priceArray: '',
                satisfaction: '',
                createTime: dStr,
                lastUpdateTime: dStr
            }],
        }
        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));


        return Promise.resolve();
    }
    onButtonClick(event, cellInfo) {
        this.onViewInfo(cellInfo);
    }

    onViewInfo(cellInfo) {
        const headerKey = cellInfo.getHeaderKey();

        // 跑每個control將資料設定進去
        this.runEachTabTableControl(function (modalTableControl) {
            // modalTableControl: <ModalTableControl>
            modalTableControl.saveCellInfo(cellInfo);
            modalTableControl.mountTable(cellInfo);
        });

        this.getStateModel().setState('tab', headerKey);

        // 開啟Modal
        const modalRef = this.getStateModel().getState('modalRef');
        if (!modalRef) {
            console.error(`modalRef not exist`);
            return;
        }
        modalRef.openModal();
    }

    // Modal-----------------------------------------
    bindModalRef(ref) {
        // console.log('bindModalRef', ref)
        this.getStateModel().setState('modalRef', ref);
    }
}

// DataCategory: ProductData
export class SpecArrayTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                size: 'M',
                color: '灰',
                weight: '',
                volume: '',
                unit: '件',
                other1: '',
                other2: '',
                other3: '',
            }, {
                size: 'L',
                color: '灰',
                weight: '',
                volume: '',
                unit: '件',
                other1: '',
                other2: '',
                other3: '',
            }, {
                size: 'XXL',
                color: '灰',
                weight: '',
                volume: '',
                unit: '件',
                other1: '',
                other2: '',
                other3: '',
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}

// DataCategory: ProductData
export class StockArrayTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                orderBaseNum: 20,
                stockNum: 100,
                stockLimit: 500,
                stockSafe: 50,
                shelfLifeDays: 30,
            }, {
                orderBaseNum: 20,
                stockNum: 100,
                stockLimit: 500,
                stockSafe: 100,
                shelfLifeDays: 30,
            }, {
                orderBaseNum: 20,
                stockNum: 100,
                stockLimit: 500,
                stockSafe: 100,
                shelfLifeDays: 30,
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}

// DataCategory: ProductData
export class PriceArrayTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                currency: 'VND',
                purchasePrice: 100,
                retailPrice: 200,
                discountPrice: 180,
            }, {
                currency: 'VND',
                purchasePrice: 100,
                retailPrice: 200,
                discountPrice: 180,
            }, {
                currency: 'VND',
                purchasePrice: 150,
                retailPrice: 250,
                discountPrice: 230,
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}

// DataCategory: ProductData
export class SatisfactionTableFlow extends ModalTableControl {

    // 實作mountTable的內容
    mountTable(cellInfo) {
        if (!(cellInfo instanceof CellInfo)) {
            console.log(`mountTable fail: cellInfo is not instanceof CellInfo`);
            return;
        }

        const row = cellInfo.getRow();

        // cellInfo: 來自SubTable的<CellInfo>
        // console.log(`GatewayUidTableFlow mountTable`, row)

        const dStr = new Date().toISOString();

        const vm = this;

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                time: dStr,
                grade: 3.5,
                memberId: '',
            }, {
                time: dStr,
                grade: 4,
                memberId: '',
            }, {
                time: dStr,
                grade: 4.5,
                memberId: '',
            }],
        }
        this.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()))
    }
}

// Control: 'customField'(CustomData)
export class BranchShopTableFlow extends SubTableControl {

    bindMount() {
        return super.bindMount(this.loadingTransactionLog);
    }
    loadingTransactionLog(newPage = 1, unlink = () => { }) {
        // console.log('loadingMemberData')
        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                shopId: 'BC120003',
                shopName: '來來軒',
                branchId: '1001',
                branchShopName: 'JustKtchen內湖店',
                taxIdNum: '82899761',
                phone: '',
                county: '台北市',
                district: '中正區',
                address: '重慶南路三段22號1樓',
                latitude: '',
                longitude: '',
                createTime: dStr,
                lastUpdateTime: dStr,
            }],
        }
        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));


        return Promise.resolve();
    }
    onButtonClick(event, cellInfo) {
        this.onViewInfo(cellInfo);
    }

    onViewInfo(cellInfo) {
        const headerKey = cellInfo.getHeaderKey();

        // 跑每個control將資料設定進去
        this.runEachTabTableControl(function (modalTableControl) {
            // modalTableControl: <ModalTableControl>
            modalTableControl.saveCellInfo(cellInfo);
            modalTableControl.mountTable(cellInfo);
        });

        this.getStateModel().setState('tab', headerKey);

        // 開啟Modal
        const modalRef = this.getStateModel().getState('modalRef');
        if (!modalRef) {
            console.error(`modalRef not exist`);
            return;
        }
        modalRef.openModal();
    }

    // Modal-----------------------------------------
    bindModalRef(ref) {
        // console.log('bindModalRef', ref)
        this.getStateModel().setState('modalRef', ref);
    }
}


// Control: 'customField'(SharedData)
export class SharedDataFlow extends TableControl {
    addSchemaModalRef = null;
    frame() {
        return {
            // 'customData': true,
            'sharedData': true,
        };
    }

    // Schema Panel----------------------------------------------

    initLoadSrcSystemOptionList() {

        const vm = this;
        setTimeout(function () {
            vm.fetchModel('sharedData').setState('srcSystemOptionList', [{
                label: '春水堂',
                value: 'shunsuidou',
            }, {
                label: '老賴茶棧',
                value: 'laicha',
            }, {
                label: '大苑子',
                value: 'dayouzu',
            }, {
                label: '50藍',
                value: '50lan',
            }]);

            // 標記已載入完成
            vm.fetchModel('sharedData').setState('srcSystemOptionListLoading', false);
        }, 3000);
    }

    // Panel執行篩選
    onQuery() {
        // const queryObj = this.fetchModel('customData').getPanelQuery();
        // console.log('onQuery', queryObj);
    }

    // Schema action--------------------------------------
    bindAddSchemaModalRef(modalRef) {
        this.addSchemaModalRef = modalRef;
    }

    // Schema Table--------------------------------------------

    // mounted
    bindMount() {
        return super.bindMount(this.loadSharedSchema);
    }


    loadSharedSchema(newPage = 1, unlock = () => { }) {

        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                recipe_id: '',
                platformType: PlatformTypeEnum.ec,
                srcSystem: 'crossbot',
                schemaFormat: '外在環境參數',
                statusCode: '1',
                dataNameEn: 'festival',
                dataNameZh: '節日',
                totalDataAmount: 28,
                createTime: dStr,
                updateTime: dStr,
                __subTable: DataCategoryEnum.externEnvironmentParam,
            }],
        }

        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));


        return Promise.resolve();
    }

    // 選取列
    onSchemaTableSelectChange(checked, cellInfo) {
        // console.log('onSchemaTableSelectChange', checked, cellInfo)

        if (!checked) {
            this.fetchModel('sharedData').updateSubTable('');
            return;
        }

        const row = cellInfo.getRow();

        if (!row.__subTable) {
            console.error(`row __subTable field not exist`, row);
            return;
        }

        // 讀取tableDataSample塞入的__subTable做識別
        this.fetchModel('sharedData').updateSubTable(row.__subTable);
    }

    // 換頁
    onSchemaTablePageChange() {

    }

    // 新增
    onSchemaCreateOpen() {
        // console.log('onSchemaCreate', this.addSchemaModalRef)
        if (!this.addSchemaModalRef) {
            console.error(`CustomDataFlow: addSchemaModalRef not exist`);
            return;
        }
        this.addSchemaModalRef.openModal();
    }

    // 新增 > 取消
    onSchemaCreateModalCancel() {
        // console.log('onSchemaCreateModalCancel');
        if (!this.addSchemaModalRef) {
            console.error(`CustomDataFlow: addSchemaModalRef not exist`);
            return;
        }
        this.addSchemaModalRef.closeModal();
    }
    // 新增 > 確認
    onSchemaCreateModalConfirm() {
        // console.log('onSchemaCreateModalConfirm');
        if (!this.addSchemaModalRef) {
            console.error(`CustomDataFlow: addSchemaModalRef not exist`);
            return;
        }
        this.addSchemaModalRef.closeModal();
    }

    // 同步
    onSchemaSync() {

    }

    // 重新比對
    onSchemaCompareAgain() {

    }

    // 清除資料
    onSchemaClearData() {

    }

    // 刪除
    onSchemaDelete() {

    }
}

export class ExternEnvironmentParamTableFlow extends SubTableControl {
    bindMount() {
        return super.bindMount(this.loadingEnvParam);
    }
    loadingEnvParam(newPage = 1, unlink = () => { }) {
        // console.log('loadingEnvParam')
        const vm = this;

        const dStr = new Date().toISOString();

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                festivalName: '端午節',
                startTime: dStr,
                endTime: dStr,
            }, {
                festivalName: '中秋節',
                startTime: dStr,
                endTime: dStr,
            }, {
                festivalName: '父親節',
                startTime: dStr,
                endTime: dStr,
            }],
        }
        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));


        return Promise.resolve();
    }
    onButtonClick(event, cellInfo) {
        // this.onViewInfo(cellInfo);
    }

    onViewInfo(cellInfo) {
        // const headerKey = cellInfo.getHeaderKey();

        // // 跑每個control將資料設定進去
        // this.runEachTabTableControl(function (modalTableControl) {
        //     // modalTableControl: <ModalTableControl>
        //     modalTableControl.saveCellInfo(cellInfo);
        //     modalTableControl.mountTable(cellInfo);
        // });

        // this.getStateModel().setState('tab', headerKey);

        // // 開啟Modal
        // const modalRef = this.getStateModel().getState('modalRef');
        // if (!modalRef) {
        //     console.error(`modalRef not exist`);
        //     return;
        // }
        // modalRef.openModal();
    }

    // Modal-----------------------------------------
    bindModalRef(ref) {
        // // console.log('bindModalRef', ref)
        // this.getStateModel().setState('modalRef', ref);
    }
}