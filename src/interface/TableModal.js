import TableControl from "control/Table";
import Interface from "./Interface";



// 若要使用TableModal Component，就需要實作這些class
export class TableModalInterface extends TableControl {
    constructor(...args) {
        super(...args);
        if (this.constructor === TableModalInterface) {
            console.error(`Cannot contruct Interface instances directly`);
            return;
        }

        new Interface(this); // 做Interface相關的檢查
    }
    implements() { // 這些是需要實作的function
        return {
            // Control-----------------------------------
            // bindAct: true, // 純紀錄、上層不必實作
            // registTableDataSetter: true, // 純紀錄、上層不必實作
            // TableControl-----------------------------------
            // getTableHeader: true, // 純紀錄、上層不必實作
            // getTableData: true, // 純紀錄、上層不必實作
            // upper -----------------------------------
            onModalOpen: true,
            onPageChange: true,
            onButtonClick: 'optional',
            bindModalRef: 'optional',
            onCheckedChange: 'optional',
            // onButtonClick: true,
            // bindModalRef: true, // 'optional'

            // [未完成]要有個optonal
        }
    }

    // bindMount(loadingFunc) {
    //     if (!loadingFunc) {
    //         console.error(`TableModalControl bindMount: must have loadingFunc`);
    //     }
    // }
}