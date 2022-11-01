import ApiSender, { ApiError } from "apiSender";
import Control from "control/Control";
import { selectHasLoad, updateIndustryData } from "store/industry";

export default class IndustryControl extends Control {
    setup() {
        return {
            dispatch: true,
            carry: true, // 接收store的參數
        };
    }

    autoLoad() {
        const vm = this;

        const hasLoad = this.carry(selectHasLoad);
        if (hasLoad) {
            return Promise.resolve();
        }

        // 測試延遲
        // const wait = () => {
        //     return new Promise((resolve) => {
        //         setTimeout(function () {
        //             resolve();
        //         }, 3000);
        //     })
        // }

        return ApiSender.sendApi('[get]/industries', null).then((apiRes) => {
            vm.dispatch(updateIndustryData(apiRes));
            
            // return wait();
            return Promise.resolve();
        }).catch(new ApiError().catchAlertMsg());
    }
}