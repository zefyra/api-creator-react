import StateModel from "./StateModel";

export default class WatchSensor {
    stateModelObj = null;
    sightObj = null;
    constructor(stateModelObj, stateKey, sightMap) {
        if (!(stateModelObj instanceof StateModel)) {
            console.error(`WatchSensor: stateModelObj is not StateModel`);
            return;
        }
        this.stateModelObj = stateModelObj;
        if (!sightMap) {
            console.error(`WatchSensor: sightMap not exist`);
            return;
        }
        if (!sightMap[stateKey]) {
            console.error(`WatchSensor: stateKey \`${stateKey}\` sight is lost`);
            return;
        }
        this.sightObj = sightMap[stateKey];
    }
    // 檢查是否有迴路
    static validateSightMap(sightMap) {
        // sightMap: 樹狀結構

        /*

        let routeMap = {};

        // 樹狀結構檢查晚點再寫
        let invalidStateKey;
        let invalidTargetKey;

        const checkNextRoute = function (stateKey) {
            const sightObj = sightMap[stateKey];
            // sightObj: 這是下一層

            // 檢查路徑是否重複
            if (routeMap[stateKey]) {
                // 代表路徑重複
                invalidStateKey = stateKey;
                return; // 結束遞迴s
            }

            for (const targetKey in sightObj) {

                if (invalidStateKey) {
                    // 代表有問題: 結束遞迴
                    return;
                }

                if (sightMap[targetKey]) {
                    // 代表有下一層
                    routeMap[targetKey] = true; // 放麵包屑
                    checkNextRoute(targetKey);
                }
            }
        }

        for (const stateKey in sightMap) {
            routeMap = {};
            for (const targetKey in sightMap[stateKey]) {

                if (sightMap[targetKey]) {
                    // 代表有下一層
                    routeMap[targetKey] = true; // 放麵包屑
                    checkNextRoute(targetKey); // 繼續往下
                } else {
                    // 沒有下一層

                }

                // if (routeMap[targetKey]) {
                //     invalidStateKey = stateKey;
                //     invalidTargetKey = targetKey;
                //     break;
                // }
                // routeMap[targetKey] = true;
            }
            if (invalidStateKey) {
                break;
            }
        }

        if (invalidStateKey) {
            console.error(`WatchSensor: stateKey \`${invalidStateKey}\` sight validate fail at targetKey`)
            return false; // 代表存在迴路，有問題
        }
        */
        return true;
    }
    setState(stateKey, value) {
        if (!this.sightObj[stateKey]) {
            console.error(`WatchSensor: stateKey \`${stateKey}\` access invalid`);
            return;
        }

        this.stateModelObj.setState(stateKey, value);
    }
    getState(stateKey) {
        // 取資料不用檢查sight設定
        return this.stateModelObj.getState(stateKey);
    }
}