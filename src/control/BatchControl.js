import Control from "./Control";

// Control: 主要功能負責Model、Ref、其他Control的介接

export class BatchControl extends Control {
    // async removeUserBatch(selectRowList) {
    //     for (const row of selectRowList) {
    //         await this.removeUser(row.accountId);
    //     }
    // }
    async batchWork(...args) {
        let array;
        let filterFunc;
        let func;
        if (args.length === 2) {
            array = args[0];
            func = args[1];
        } else if (args.length === 3) {
            array = args[0];
            filterFunc = args[1];
            func = args[2];
        } else {
            console.error(`batchWork args leak`);
            return;
        }
        if (filterFunc) {
            array = array.map(filterFunc);
        }
        for (const element of array) {
            await func.call(this, element);
        }
    }
}