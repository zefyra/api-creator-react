// 用來

export default class ConfirmControl {
    confirmModalRef = null;
    constructor(confirmModalRef) {
        this.confirmModalRef = confirmModalRef;
    }
    confirm(message) {
        if (!this.confirmModalRef) {
            console.error(`confirmModalRef not exist`);
            return;
        }
        return this.confirmModalRef.current.openModal({
            content: message, //  `確認要刪除『${selectRow.userName}』用戶？`
        });
    }
}