import Filter from "filter/Filter";

/* SuspenseFilter的作用，是在尚未載好資料前，會在autoReady停住
，所有呼叫autoReady的地方都會卡在那裡，等他載好，載以後一口氣執行所有後續任務。

載好前: 都會停在autoReady的位置。
載好後: 一口氣執行所有autoReady擋住的後續任務。
載好以後才呼叫autoReady: 會直接略過下載步驟。
*/


export default class SuspenseFilter extends Filter {

    waitingWork = null;
    outputWork = null;

    ready = false;
    suspensePromise = null;
    suspense = null;

    constructor(args, workFuncName, outFuncName) {
        super(...args);

        if (workFuncName && this[workFuncName]) {
            // 初始化waitingWork
            this.waitingWork = this[workFuncName].bind(this);
        } else {
            console.error(`workFuncName: ${workFuncName} not exist`);
        }

        if (outFuncName && this[outFuncName]) {
            // 初始化outFuncName
            this.outputWork = this[outFuncName].bind(this);
        } else {
            console.error(`outFuncName: ${outFuncName} not exist`);
        }
        // console.log(`outFuncName: ${outFuncName} this.outputWork`, this.outputWork)
    }

    handleOutputWork() {

        // console.log('handleOutputWork outputWork', this.outputWork)

        if (!this.outputWork) {
            // 代表沒有設定outputWork
            return Promise.resolve();
        }

        return this.outputWork();
    }

    resolveSuspense() {
        const { resolve, reject } = this.suspense;

        this.suspense = null;
        this.suspensePromise = null;

        this.handleOutputWork().then((outputData) => {
            resolve(outputData);
        });
    }

    autoSuspense(doNext) {

        const vm = this;
        if (!this.suspensePromise) {
            // 沒有懸念，直接往下走

            this.suspensePromise = new Promise((resolve, reject) => {
                vm.suspense = { resolve, reject };
            });

            doNext();

            return this.suspensePromise;
            // return Promise.resolve();
        }
        // 有懸念，要等一下
        return this.suspensePromise;
    }

    // waitingWark完成工作以後要call這個函式
    handleReady() {
        this.ready = true;
    }

    autoReady(...args) {
        const vm = this;
        if (this.ready) {
            // console.log('is ready');

            // 代表已準備完成，可直接略過此程序
            // return Promise.resolve();
            return this.handleOutputWork();
        }

        return this.autoSuspense(function () {

            if (!vm.waitingWork) {
                console.error('waitingWork is not exist');
                return;
            }

            // 將waitingWork取出執行
            let handleWork = vm.waitingWork;
            vm.waitingWork = null;

            handleWork(...args).then(() => {
                vm.handleReady();
                vm.resolveSuspense();
            });
        });

        // 使用範例
        // return new Promise((resolve, reject) => {
        //     console.log('industry filter init once');
        //     setTimeout(function () {
        //         console.log('init complete');
        //         resolve();
        //     }, 2000);
        // });
    }
}