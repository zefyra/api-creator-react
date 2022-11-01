import ApiSender from "apiSender";
import Modal from "component/Modal";
import Control from "control/Control";
import { TableModalInterface } from "interface/TableModal";
import TableData from "util/TableData";
import { UserSelectorModel } from "./userSelectorModel";


// 使用者選取燈箱的Interface
export class UserSelectModalTableFlow extends TableModalInterface {
    // ref() {
    //     return {
    //         // onChange: true, // 對外的呼叫
    //         // userSelectModal: Modal.name,
    //     }
    // }
    frame() {
        return {
            stateModel: UserSelectorModel.name,
        }
    }

    loadUserSelect(newPage = 1, unlock = () => { }) {
        const vm = this;

        const stateModel = this.fetchModel('stateModel');

        const tagList = stateModel.getState('tagList');

        // console.log(`loadUserSelect tagList`, tagList);

        const checkTagExist = function (accountId) {
            // console.log(`checkTagExist`, accountId)
            return tagList.some((tagItem) => {
                return accountId === tagItem.accountId;
            });
        }

        let searchName = stateModel.getState('searchName');

        const queryParam = {
            page: newPage,
            pageSize: 10,
        }
        searchName && (queryParam.userName = searchName); // 空字串時不塞欄位

        ApiSender.sendApi('[get]/user-select', queryParam, {
            loading: {
                start() {
                    stateModel.setState('userTableLoading', true);
                },
                end() {
                    stateModel.setState('userTableLoading', false);
                }
            }
        }).then((apiRes) => {
            const userSelectTable = new TableData(apiRes, 'crossbot', vm.getTableHeader());

            userSelectTable.filtEach(function (row) {
                row.__rowSelect = checkTagExist(row.accountId);
                // console.log(`row.__rowSelect`, row.__rowSelect);
                return row;
            });
            // console.log(`userSelectTable.tableData`, userSelectTable.tableData)

            vm.refreshTableData(userSelectTable);
        });
    }

    onModalOpen() {
        // console.log('onModalOpen');
        this.loadUserSelect(1);
    }
    onPageChange(newPage, unlink) {
        // console.log('onPageChange');
        this.loadUserSelect(newPage, unlink);
    }

    onCheckedChange(value, cellInfo) {
        // console.log('onCheckedChange', value, cellInfo);

        if (value) {
            this.fetchModel('stateModel').addTag(cellInfo);
        } else {
            const row = cellInfo.getRow()
            this.fetchModel('stateModel').removeTag(row.accountId);
        }
    }

    onConfirm() {
        // 關閉燈箱
        // console.log('onConfirm')

        // this.fetchRef('userSelectModal').closeModal();
        const stateModel = this.fetchModel('stateModel');
        const userSelectModalRef = stateModel.getState('userSelectModal');

        userSelectModalRef.closeModal();
    }

    // 篩選搜尋
    onQuery() {
        // const stateModel = this.fetchModel('stateModel');
        // console.log(`onQuery`, stateModel.getState('searchName'));
        // const searchName = stateModel.getState('searchName');

        this.loadUserSelect(1, (val => val));
    }
}

// 多選
export class UserSelectorControl extends Control {
    ref() {
        return {
            // userSelectModal: Modal.name,
        }
    }
    frame() {
        return {
            stateModel: UserSelectorModel.name,
        }
    }
    onOpenUserSelectModal() {
        const stateModel = this.fetchModel('stateModel');
        const userSelectModalRef = stateModel.getState('userSelectModal');

        // const userSelectModalRef = this.fetchRef('userSelectModal');
        if (userSelectModalRef) {
            userSelectModalRef.openModal();
        }
    }

    onCancelTag(tagItem) {
        // console.log('onCancelTag', tagItem);
        /* tagItem: {
            label: 
            accountId
            row
        } */

        const stateModel = this.fetchModel('stateModel');

        stateModel.removeTag(tagItem.accountId);
    }
}

// export class SingleUserSelectorControl {

// }