import TableData from "util/TableData";
import TableHeader from "util/TableHeader";
import Behavior from "./Behavior";
import Control from "./Control";
import PluginControl from "./PluginControl";

// 提供需求: 負責定義這項Plugin所依賴的資源
export class TableBehavior extends Behavior {
    // 定義是哪個物件->哪個物件的Behavior依賴檢查
    direct() {
        return {
            resource: Control.name, // 資源提供者
            consumer: TablePlugin.name, // 消耗者
            // source: TablePlugin.name,
            // target: Control.name,
        }
    }
    data() { // data的接口: 會自動去跟resource討
        return {
            tableData: TableData.name,
            tableHeader: TableHeader.name,
            loading: true,
        }
    }
    action() { // 函式的接口
        return {
            loadTable: true,
        };
    }
}


export default class TablePlugin extends PluginControl {
    onPageChange(newPage, unlink) {
        // console.log(`TablePlugin onPageChange`, newPage, unlink);
        this.act('loadTable', newPage, unlink)
    }
    onTableMount() {
        // console.log(`onTableMount`);

        this.act('loadTable', 1, () => { })
    }

    // 寫到這裡要接完所有表格的行為
}