import TableData from 'util/TableData';
import TableHeader from 'util/TableHeader';
import Control from './Control';
// import TableHeader from 'util/TableHeader';

export default class TableControl extends Control {
    tableDataRef = null;
    tableHeader = null;

    tableDataSetterMap = {}

    constructor(tableDataRef, tableHeader) {
        super();
        if (!tableDataRef) {
            console.error(`tableDataRef not exist on OrderTableFlow constructor`);
            return;
        }


        if (tableHeader && !(tableHeader instanceof TableHeader)) {
            console.error(`TableControl constructor: tableHeader is invalid`);
            return;
        }

        this.tableDataRef = tableDataRef;
        // 初始化tableData
        this.tableDataRef.current = new TableData(null, 'default', tableHeader);

        this.tableHeader = tableHeader;
    }

    // tableHeader------------------------------------------------

    // [public]
    getTableHeader() {
        if (!this.tableHeader) {
            console.error(`[${this.className}] getTableHeader: tableHeader not exist`);
            return null;
        }
        return this.tableHeader;
    }

    // tableDataRef------------------------------------------------

    // [public]
    setTableData(newTableData) {
        if (!this.tableDataRef) {
            console.error(`[${this.className}] setTableData: tableDataRef not exist`);
            return;
        }
        this.tableDataRef.current = newTableData;
    }
    // [public]
    getTableData() {
        if (!this.tableDataRef) {
            console.error(`[${this.className}] getTableData: tableDataRef not exist`);
            return;
        }
        return this.tableDataRef.current;
    }

    // tableDataSetterMap------------------------------------------------

    // [public]
    // 代表是useState生出來的setter，有需要同步刷新各view元件的component時，要跑一遍全部呼叫刷新
    registTableDataSetter(key, setter) {
        this.tableDataSetterMap[key] = setter;
    }

    // [protected] 用來提供內部刷新，同步更新table數值到所有註冊的setter
    refreshTableData(newTableData) {
        if (!(newTableData instanceof TableData)) {
            console.log(`refreshTableData fail: newTableData is not instanceof TableData`);
            return;
        }
        // 更新自己內部的tableData
        this.setTableData(newTableData);

        // 更新所有註冊的setter
        Object.keys(this.tableDataSetterMap).forEach((key) => {
            const setter = this.tableDataSetterMap[key];
            setter(newTableData);
        });
    }

    // Life Cycle------------------------------------------------

    // [public] 綁定初始化表格的函式，通常會綁在useEffect上，上層必須override此函式來使用
    // 寫法===> useEffect(tableFlow.bindMount(), []); // 觸發首次的API載入
    // Flow寫法===> bindMount() {
    //     return super.bindMount(this.loadCustomSchema);
    // }
    bindMount(loadingFunc) {

        // console.log('Table bindMount', loadingFunc)
        if (!loadingFunc) {
            return () => { };
        }

        function buildLoadingFunc(loadingFunc) { // , ...args ==> useEffect傳入的參數
            loadingFunc.call(this);
        }

        return buildLoadingFunc.bind(this, loadingFunc);
    }

}
