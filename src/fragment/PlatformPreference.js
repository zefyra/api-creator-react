import ChannelButtonEnum from "enum/platformPreference/ChannelButton";
import ChannelTypeEnum from "enum/ChannelType";
import StateModel from "model/StateModel";

const getNoBindChannelInfo = function (t) {
    let noBindChannelInfoMap = {
        [ChannelTypeEnum.instagram]: {
            channelType: 'instagram',
            titleLabel: t('InstagramOfficialAccount'),
            bindButtonLabel: t('bindInstagram'), // 綁定
            reauthorizeButtonLabel: t('reauthorize'), // 重新授權
            removeBindButtonLabel: t('removeBind'), // 解除綁定
            // isBind: false,
        },
        [ChannelTypeEnum.facebook]: {
            channelType: 'facebook',
            titleLabel: t('FacebookOfficialAccount'),
            bindButtonLabel: t('bindFacebook'),
            reauthorizeButtonLabel: t('reauthorize'), // 重新授權
            removeBindButtonLabel: t('removeBind'), // 解除綁定
            // isBind: false,
        },
        [ChannelTypeEnum.line]: {
            channelType: 'line', // 用來開啟綁定Modal
            questionType: 'lineQuestion', // 用來開啟問題Modal
            titleLabel: t('LineOfficialAccount'),
            bindButtonLabel: t('bindLine'),
            reauthorizeButtonLabel: t('reauthorize'), // 重新授權
            removeBindButtonLabel: t('removeBind'), // 解除綁定
            // isBind: false,
        },
        [ChannelTypeEnum.wechat]: {
            channelType: 'wechat',
            titleLabel: t('WeChatOfficialAccount'),
            bindButtonLabel: t('bindWeChat'),
            reauthorizeButtonLabel: t('reauthorize'), // 重新授權
            removeBindButtonLabel: t('removeBind'), // 解除綁定
            // isBind: false, // 後面會添加進去
        },
    }
}


const getBtn = function (channelType, btnType, t) {
    // console.log('getBtn', channelType, btnType)
    // btnType: <ChannelButtonEnum>
    // channelType: <ChannelTypeEnum>

    // const reauthorizeBtn = { type: ChannelButtonEnum.reauthorize, label: 'bindInstagram' }
    // const removeBindBtn = { type: ChannelButtonEnum.removeBind };

    // const bindBtn = { type: ChannelButtonEnum.bind };

    let buttonInfoMap = {
        [ChannelTypeEnum.instagram]: {
            [ChannelButtonEnum.bind]: t('bindInstagram'), // 綁定
            [ChannelButtonEnum.reauthorize]: t('reauthorize'), // 重新授權
            [ChannelButtonEnum.removeBind]: t('removeBind'), // 解除綁定
        },
        [ChannelTypeEnum.facebook]: {
            [ChannelButtonEnum.bind]: t('bindFacebook'), // 綁定
            [ChannelButtonEnum.reauthorize]: t('reauthorize'), // 重新授權
            [ChannelButtonEnum.removeBind]: t('removeBind'), // 解除綁定
        },
        [ChannelTypeEnum.line]: {
            [ChannelButtonEnum.bind]: t('bindLine'), // 綁定
            [ChannelButtonEnum.reauthorize]: t('reauthorize'), // 重新授權
            [ChannelButtonEnum.removeBind]: t('removeBind'), // 解除綁定
        },
        [ChannelTypeEnum.wechat]: {
            [ChannelButtonEnum.bind]: t('bindWeChat'), // 綁定
            [ChannelButtonEnum.reauthorize]: t('reauthorize'), // 重新授權
            [ChannelButtonEnum.removeBind]: t('removeBind'), // 解除綁定
        },
    }

    const buttonChannelMap = buttonInfoMap[channelType];
    const buttonLabel = buttonChannelMap[btnType];

    return { type: btnType, label: buttonLabel };
}

const getChannelTitle = function (channelType, t) {
    let titleInfoMap = {
        [ChannelTypeEnum.instagram]: t('InstagramOfficialAccount'),
        [ChannelTypeEnum.facebook]: t('InstagramOfficialAccount'),
        [ChannelTypeEnum.line]: t('InstagramOfficialAccount'),
        [ChannelTypeEnum.wechat]: t('InstagramOfficialAccount'),
    }

    return titleInfoMap[channelType];
}


export class ChannelInfo {
    channelType = '';
    buttonList = [];
    isBind = false;

    t = null;
    bindComment = '';
    title = '';

    constructor(obj) {
        // buildType,
        // if (buildType === 'manual') { // 手動生
        const { channelType, isBind, t } = obj;

        this.channelType = channelType;
        this.isBind = isBind;
        this.t = t;
        // const { t } = useTranslation('pay', { keyPrefix: 'platformPreference' });

        this.bindComment = isBind ? this.t('noBindComment') : ''; // 後面是已綁定的訊息內容
        // noBindComment: '您尚未授權CrossBot取得帳號權限，請完成授權動作'

        if (isBind) {
            this.buttonList = [getBtn(channelType, ChannelButtonEnum.reauthorize, t),
            getBtn(channelType, ChannelButtonEnum.removeBind, t)];
        } else {
            this.buttonList = [getBtn(channelType, ChannelButtonEnum.bind, t)];
        }

        this.title = getChannelTitle(channelType, t);
    }
    getChannelType() {
        return this.channelType;
    }
    getIsBind() {
        return this.isBind;
    }
    getTitle() {
        return this.title;
    }
    getButtonList() {
        return this.buttonList;
    }
    getBindComment() {
        return this.bindComment;
    }
    getSort() {
        const channelSortMap = {
            [ChannelTypeEnum.line]: 1,
            // line_noBind: 2,
            [ChannelTypeEnum.facebook]: 3,
            // facebook_noBind: 4,
            [ChannelTypeEnum.instagram]: 5,
            // instagram_noBind: 6,
            [ChannelTypeEnum.wechat]: 7,
            // wechat_noBind: 8,
        };

        let sortNum = channelSortMap[this.getChannelType()];
        if (this.getIsBind()) {
            sortNum += 1;
        }
        return sortNum;
    }
}


export default class PlatformPreferenceModel extends StateModel {
    data(initObj = {}) {
        // const { t } = useTranslation('pay', { keyPrefix: 'platformPreference' });
        return {
            // 測試用
            // channelList: [new ChannelInfo({
            //         channelType: ChannelTypeEnum.line,
            //         isBind: false, t: initObj.t
            //     })]
            t: initObj.t,
            channelList: [],
        }
    }

    convertChannelRow(channelRow) {
        console.log('convertChannelRow', channelRow)
        const t = this.getState('t');

        return new ChannelInfo({
            channelType: ChannelTypeEnum.line, // [未完成]之後這裡還要串，不見得是Line
            isBind: true, t: t,
        });
    }

    autoAddBlankChannel(channelList) {
        const t = this.getState('t');

        const blankChannelList = [new ChannelInfo({
            channelType: ChannelTypeEnum.line,
            isBind: false, t: t,
            // }), // 由於目前只支持LINE綁定，因此其他先隱藏
            // new ChannelInfo({
            //     channelType: ChannelTypeEnum.instagram,
            //     isBind: false, t: t,
            // }),
            // new ChannelInfo({
            //     channelType: ChannelTypeEnum.facebook,
            //     isBind: false, t: t,
            // }),
            // new ChannelInfo({
            //     channelType: ChannelTypeEnum.wechat,
            //     isBind: false, t: t,
        })];

        return blankChannelList.concat(channelList);
    }

    sortChannelList(channelList) {
        channelList.sort(function (channelInfoA, channelInfoB) {
            return channelInfoA.getSort() - channelInfoB.getSort();
        });
        return channelList
    }
}

export class LineBindModel extends StateModel {
    data() {
        return {
            channelId: '',
            channelSecret: '',
            accessToken: '',
        }
    }
    getBindData() {
        return {
            channelId: this.getState('channelId'),
            channelSecret: this.getState('channelSecret'),
            accessToken: this.getState('accessToken'),
        }
    }
}