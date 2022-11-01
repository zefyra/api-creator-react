

export default class Notify {
    notifyRef = null;
    constructor(notifyRef) {
        this.notifyRef = notifyRef;
    }
    notify(message) {
        if (!this.notifyRef) {
            console.error(`notifyRef not exist`);
            return;
        }
        this.notifyRef.current(message);
        return Promise.resolve();
    }
}