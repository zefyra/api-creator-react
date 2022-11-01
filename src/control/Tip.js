
export default class Notify {
    tipModalRef = null;
    constructor(tipModalRef) {
        this.tipModalRef = tipModalRef;
    }
    tip(message) {
        if (!this.tipModalRef) {
            console.error(`tipModalRef not exist`);
            return;
        }
        return this.tipModalRef.current.openModal({
            content: message,
        });
    }
}
