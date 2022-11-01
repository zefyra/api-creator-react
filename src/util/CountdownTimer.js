
export default class CountdownTimer {
    constructor(props) {
        this.initTime = props.initTime !== undefined ? props.initTime : 10;
        this.remainTime = this.initTime;
        this.intervalTimer = null; // 計時器的setInterval
        this.tickCallback = null;
        this.timeoutCallback = null;

    }

    setInitTime(interval) {
        this.initTime = interval;
    }

    getInterval() {
        return this.remainTime;
    }

    // 設定Tick的callback
    setTickCallback(tickCallback) {
        this.tickCallback = tickCallback;
    }

    // 設定時間到時的callback
    setTimeoutCallback(timeoutCallback) {
        this.timeoutCallback = timeoutCallback;
    }

    start() {
        if (this.intervalTimer) {
            // 代表之前的timer還在跑，還沒清掉
            return;
        }

        this.remainTime = this.initTime;
        if (this.tickCallback) {
            this.tickCallback(this.remainTime);
        }
        this.intervalTimer = setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        this.remainTime -= 1; // 計時器-1

        if (this.tickCallback) {
            this.tickCallback(this.remainTime);
        }

        if (this.remainTime <= 0) {
            // 時間到，停止計時

            clearInterval(this.intervalTimer);
            this.intervalTimer = null;

            if (this.timeoutCallback) {
                this.timeoutCallback();
            }
        }
    }
}