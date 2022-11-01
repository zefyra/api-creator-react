import ApiSender, { ApiError } from "apiSender";
import Control from "control/Control";
import ChannelTypeEnum from "enum/ChannelType";
import PlatformPreferenceModel, { LineBindModel } from "fragment/PlatformPreference";

import { selectAccountEntityId } from "store/profile";

export default class PlatformPreferenceFlow extends Control {
    setup() {
        return {
            // dispatch: true,
            carry: true,
        }
    }
    ref() {
        return {
            lineModal: true,
            lineQuestionModal: true,
        }
    }
    frame() {
        return {
            stateModel: PlatformPreferenceModel.name,
            lineBindModel: LineBindModel.name,
        }
    }

    // 初始化
    onChannelListMount() {
        const vm = this;

        const stateModel = this.fetchModel('stateModel');

        const accountEntityId = this.carry(selectAccountEntityId);

        let channelList = [];

        ApiSender.sendApi('[get]/entities/{entity_id}/platforms', null, {
            apiInnerData: {
                entity_id: accountEntityId,
            }
        }).then((apiRes) => {

            console.log('onChannelListMount apiRes', apiRes)

            // 轉成channelList格式
            channelList = apiRes.rows.map((row) => {
                return stateModel.convertChannelRow(row);
            });
            // 自動加入4個渠道未綁定的ChannelInfo
            channelList = stateModel.autoAddBlankChannel(channelList);
            // 自動排序
            channelList = stateModel.sortChannelList(channelList);

            stateModel.setState('channelList', channelList);
        }).catch(new ApiError().catchAlertMsg())
    }
    // 點擊綁定
    onClickBind(channelInfo) {
        if (channelInfo.getChannelType() === 'line') {
            this.fetchRef('lineModal').openModal();
        }
    }
    // 點擊問號
    onClickQuestion(channelInfo) {
        console.log(`onClickQuestion`, channelInfo)

        if (channelInfo.getChannelType() === 'line') {
            this.fetchRef('lineQuestionModal').openModal();
        }
    }

    // 解除綁定
    onClickRemoveBind(channelInfo) {
        console.log(`onClickRemoveBind`, channelInfo)
    }

    // 重新授權
    onClickReauthorize(channelInfo) {
        console.log(`onClickReauthorize`, channelInfo)
    }

    // 關閉Line綁定Modal
    onLineModalCancel() {
        // console.log('onLineModalCancel');
        this.fetchRef('lineModal').closeModal();
    }
    // 關閉Line問題Modal
    onLineQuestionModalCancel() {
        // console.log('onLineQuestionModalCancel');
        this.fetchRef('lineQuestionModal').closeModal();
    }

    // Line綁定Modal儲存
    onLineModalSave() {
        const vm = this;
        // console.log('onLineModalSave');

        const lineBindModel = this.fetchModel('lineBindModel');

        const data = lineBindModel.getBindData();
        // console.log(`lineBindData`, data);
        /* data: {
            accessToken: "cccc"
            channelId: "aaaa"
            channelSecret: "bbbb"
        }*/

        const accountEntityId = this.carry(selectAccountEntityId);

        // console.log(`send [post]/entities/${accountEntityId}/platforms`);

        ApiSender.sendApi('[post]/entities/{entity_id}/platforms', {
            platformID: 2, // 'Line'
            params: {
                token: data.accessToken
            }
        }, {
            apiInnerData: {
                entity_id: accountEntityId,
            }
        }).then((apiRes) => {
            return Promise.resolve();
        }).catch(new ApiError().catchAlertMsg())

        vm.fetchRef('lineModal').closeModal();
    }

    // Line綁定Modal儲存
    onLineQuestionModalSave() {
        console.log('onLineQuestionModalSave');
        this.fetchRef('lineQuestionModal').closeModal();
    }

}