export default class RenderOnce {

    static runOnlyAtMmount(mountCounterRef, callback) {
        if (process.env.REACT_APP_STRICT_MODE) {
            if (mountCounterRef.current < 1) {
                mountCounterRef.current += 1;
                return;
            } else if (mountCounterRef.current === 1) {
                // 嚴格模式下，只會跑第二次
                mountCounterRef.current += 1;
                callback();
                return;
            }
            return;
        } else {
            // 非嚴格模式
            callback();
            return;
        }
    }

    // 代表啟動的render不執行
    static runAfterMmount(mountCounterRef, callback) {
        // console.log(`runAfterMmount REACT_APP_STRICT_MODE`, process.env.REACT_APP_STRICT_MODE)

        // 原本只要擋第一次的寫法
        // const isMounted = useRef(false);
        // if (isMounted.current) {
        //     if (onCheckedChange) {
        //         onCheckedChange(row, rowIndex, checked, checkMap);
        //     }
        // } else {
        //     isMounted.current = true;
        // }

        if (process.env.REACT_APP_STRICT_MODE) {
            // 代表目前處於嚴格模式，前面2次的執行必須擋下
            if (mountCounterRef.current >= 2) {
                callback();
                return;
            }
        } else {
            // 代表目前處於一般模式，只擋下第一次初始化時的render
            if (mountCounterRef.current >= 1) {
                callback();
                return;
            }
        }

        mountCounterRef.current += 1;
    }
}