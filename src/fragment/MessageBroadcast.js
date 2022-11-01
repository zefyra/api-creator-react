import ChannelTypeEnum from "enum/ChannelType";
import { TableSelectModeEnum } from "enum/Table";
import TimeFilter from "filter/TimeFilter";
import StateModel from "model/StateModel";
import TableData from "util/TableData";
import TableHeader from "util/TableHeader";


let dateTimeFilter = new TimeFilter('time', '-');

export class MessageQueryPanelModel extends StateModel {
    data() {
        return {
            tagList: [],
            tagLogic: true, // true => AND ； false => OR
            startDate: '',
            endDate: '',
            markedTimes: null,
            channelList: [],

            toggleLine: false,
            toggleFacebook: true,
            toggleInstagram: true,
            toggleWechat: true,
        }
    }
    sight() {
        return {
            toggleLine: {
                channelList: true,
            },
            toggleFacebook: {
                channelList: true,
            },
            toggleInstagram: {
                channelList: true,
            },
            toggleWechat: {
                channelList: true,
            }
        }
    }
    watch() {
        const onToggleChanged = (channelType) => (enable) => {
            let channelList = this.getState('channelList');

            const index = channelList.findIndex(type => type === channelType);

            if (enable) { // 代表要加入元素
                if (index < 0) { // 代表不在陣列裡面
                    channelList.push(channelType);
                }
            } else { // 代表要取出元素
                if (index >= 0) { // 代表有在陣列內
                    channelList.splice(index, 1);
                }
            }

            this.setState('channelList', channelList);
        }

        return {
            toggleLine: onToggleChanged(ChannelTypeEnum.line),
            toggleFacebook: onToggleChanged(ChannelTypeEnum.facebook),
            toggleInstagram: onToggleChanged(ChannelTypeEnum.instagram),
            toggleWechat: onToggleChanged(ChannelTypeEnum.wechat),
        }
    }
    getQuery() {
        return {
            tagList: this.getState('tagList'),
            tagLogic: this.getState('tagLogic'),
            startDate: this.getState('startDate'),
            endDate: this.getState('endDate'),
            markedTimes: this.getState('markedTimes'),
            channelList: this.getState('channelList'),
        }
    }
}

const getSendDetailTableHeader = function (t) {
    return new TableHeader({
        // rowSelect: {
        //     // mode: 'singleSelect', // 代表只能單選
        //     mode: TableSelectModeEnum.multi,
        // },
        // upperHeader: {
        //     bindUserNum: { // <key>
        //         // key: 'bindUserNum',
        //         label: t('bindedUserNum'), // '已綁定用戶數',
        //         type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
        //     },
        // },
        // headerExtra: [{ // 額外要載入的欄位
        //     key: 'accountId',
        //     fetch: 'account.id',
        // }, {
        //     key: 'accountEntityId',
        //     fetch: 'entity.id',
        // }],
        // buttonColumn: {
        //     action: { // <key> ==> 'action'
        //         buttonItemList: [{
        //             type: 'button',
        //             label: t('sendDetail'), // '發送明細',
        //             event: 'sendDetail',
        //             buttonType: 'fill',
        //             buttonMode: 'primary',
        //             buttonPattern: 'buttonColumn',
        //             // visibleChecker: function (rowData) {
        //             //     return true;
        //             // },
        //         }],
        //     }
        // },
        header: [{
            label: t('sendTime'), //  '發送時間',
            key: 'sendTime',
            type: 'text',
            fetch: 'sendTime',
            filter: dateTimeFilter,
        }, {
            label: t('sendMethod'), //  '發送方式',
            key: 'sendMethod',
            type: 'text',
            fetch: 'sendMethod',
        }, {
            label: t('contactPersonNum'), //  '接觸人數',
            key: 'contactPersonNum',
            type: 'text',
            fetch: 'contactPersonNum',
        }, {
            label: t('sendChannel'), //  '發送渠道',
            key: 'sendChannel',
            type: 'text',
            fetch: 'sendChannel',
        }, {
            label: t('sendPlatformName'), //  '發送平台名稱',
            key: 'sendPlatformName',
            type: 'text',
            fetch: 'sendPlatformName',
        }, {
            label: t('sendPlatformNowState'), //  '發送平台當前狀態',
            key: 'sendPlatformNowState',
            type: 'text',
            fetch: 'sendPlatformNowState',
        }],
    });
}

const getMessageTableHeader = function (t) {
    return new TableHeader({
        rowSelect: {
            // mode: 'singleSelect', // 代表只能單選
            mode: TableSelectModeEnum.multi,
        },
        // upperHeader: {
        //     bindUserNum: { // <key>
        //         // key: 'bindUserNum',
        //         label: t('bindedUserNum'), // '已綁定用戶數',
        //         type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
        //     },
        // },
        // headerExtra: [{ // 額外要載入的欄位
        //     key: 'accountId',
        //     fetch: 'account.id',
        // }, {
        //     key: 'accountEntityId',
        //     fetch: 'entity.id',
        // }],
        buttonColumn: {
            action: { // <key> ==> 'action'
                buttonItemList: [{
                    type: 'button',
                    label: t('sendDetail'), // '發送明細',
                    event: 'sendDetail',
                    buttonType: 'fill',
                    buttonMode: 'primary',
                    buttonPattern: 'buttonColumn',
                    // visibleChecker: function (rowData) {
                    //     return true;
                    // },
                }],
            }
        },
        header: [{
            label: '',
            key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
            type: 'checkBox',
            // mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
        }, {
            label: t('action'), //  '操作',
            key: 'action',
            type: 'buttonColumn',
            buttonColumnRef: 'action',
            width: '180px',
        }, {
            label: t('title'), //  '標題',
            key: 'title',
            type: 'text',
            fetch: 'title',
            // fetch: 'account.username',
        }, {
            label: t('filtListMethod'), //  '篩選名單方式',
            key: 'filtListMethod',
            type: 'text',
            fetch: 'filtListMethod',
        }, {
            label: t('filtTag'), //  '篩選標籤',
            key: 'filtTag',
            type: 'text',
            fetch: 'filtTag',
            filter: function (tagList) {
                // console.log('filtTag', tagList)
                // return '';
                return tagList.toString();
            }
        }, {
            label: t('sendTarget'), //  '發送對象',
            key: 'sendTarget',
            type: 'text',
            fetch: 'sendTarget',
            filter: function (tagList) {
                // console.log('sendTarget', tagList)
                // return '';
                return tagList.toString();
            }
        }, {
            label: t('sendMethod'), //  '傳送方式',
            key: 'sendMethod',
            type: 'text',
            fetch: 'sendMethod',
        }, {
            label: t('targetListNum'), //  '目標名單數',
            key: 'targetListNum',
            type: 'text',
            fetch: 'targetListNum',
        }, {
            label: t('contactListNum'), //  '接觸名單數',
            key: 'contactListNum',
            type: 'text',
            fetch: 'contactListNum',
        }, {
            label: t('sendTimes'), //  '發送次數',
            key: 'sendTimes',
            type: 'text',
            fetch: 'sendTimes',
        }, {
            label: t('sendContent'), //  '傳送內容(文字)',
            key: 'sendContent',
            type: 'text',
            fetch: 'sendContent',
            width: '160px'
        }, {
            label: t('imageFile'), //  '圖檔',
            key: 'imageFile',
            type: 'text',
            fetch: 'imageFile',
        }, {
            label: 'DM', //  'DM',
            key: 'dm',
            type: 'text',
            fetch: 'dm',
        }, {
            label: t('questionnaire'), //  '問卷',
            key: 'questionnaire',
            type: 'text',
            fetch: 'questionnaire',
        }, {
            label: t('createTime'), //  '創建時間',
            key: 'createTime',
            type: 'text',
            fetch: 'createTime',
            filter: dateTimeFilter,
        }, {
            label: t('sendTime'), //  '發送時間',
            key: 'sendTime',
            type: 'text',
            fetch: 'sendTime',
            filter: dateTimeFilter,
        }, {
            label: t('updateTime'), //  '更新時間',
            key: 'updateTime',
            type: 'text',
            fetch: 'updateTime',
            filter: dateTimeFilter,
        }],
    });
}

export class MessageTableModel extends StateModel {
    data(initObj = {}) {
        return {
            tableData: new TableData(null, 'default'),
            tableHeader: getMessageTableHeader(initObj.t || (val => val)),
        }
    }
}

export class SendDetailTableModel extends StateModel {
    data(initObj = {}) {
        return {
            tableData: new TableData(null, 'default'),
            tableHeader: getSendDetailTableHeader(initObj.t || (val => val)),
            loading: false,
        }
    }
}

export class AddMessageBroadcastModel extends StateModel {
    data(initObj = {}) {
        return {
            title: '',
            filtListMethod: true, // 篩選名單方式: true: 用戶  false: 標籤
            tagList: [],
            userList: [],
            sendMethod: 'manual', // 'manual' 手動發送  ; 'specifiedTime' 指定時間
            // sendChannel
            // messageType
            // messsageContent

            specifiedDate: '',
            specifiedTime: '',

            messageType: 'text', // 訊息類型: 文字
            messageContentText: '', // 訊息內容(文字)

            // ------------------------------------------
            selectUserHide: false, // 選擇用戶
            selectTagHide: true, // 選擇標籤

            specifiedDateHide: true,
            specifiedTimeHide: true,
        }
    }
    sight() {
        return {
            filtListMethod: {
                selectUserHide: true,
                selectTagHide: true,
            },
            sendMethod: {
                specifiedDateHide: true,
                specifiedTimeHide: true,
            },
            specifiedTime: {},
        }
    }
    watch() {
        return {
            filtListMethod(val) {
                this.setState('selectUserHide', !val);
                this.setState('selectTagHide', val);
            },
            sendMethod(val) {
                console.log(`watch sendMethod`, val)
                if (val === 'specifiedTime') {
                    this.setState('specifiedDateHide', false);
                    this.setState('specifiedTimeHide', false);
                } else {
                    this.setState('specifiedDateHide', true);
                    this.setState('specifiedTimeHide', true);
                }
            },
            specifiedTime(val) {
                console.log(`specifiedTime watch`, val);
            }
        }
    }
}