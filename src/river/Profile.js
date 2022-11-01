import ApiSender, { ApiError } from "apiSender";
import Control from "control/Control";
import { selectHasLoadProfile, updateUserProfile } from "store/profile";


export default class ProfileControl extends Control {

    setup() {
        return {
            dispatch: true,
            carry: true, // 接收store的參數
        };
    }

    autoLoadUserProfile() {
        const vm = this;

        const hasLoadProfile = this.carry(selectHasLoadProfile);

        console.log(`autoLoadUserProfile hasLoadProfile`, hasLoadProfile);

        if (hasLoadProfile) {
            return Promise.resolve();
        }

        // 1.取得accountId
        return ApiSender.sendApi('[get]/accounts/profile').then((apiRes) => {

            // 將profile資料存下來
            vm.dispatch(updateUserProfile(apiRes));

            return Promise.resolve();
        }).catch(new ApiError().catchAlertMsg())
    }
}