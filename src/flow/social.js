import ApiSender, { ApiError } from 'apiSender'
import { useGetter } from 'store';

import { useTranslation } from "react-i18next";
import TableData from 'util/TableData';
import TableHeader from 'util/TableHeader';

// import NumberFilter from 'filter/NumberFilter';

import TableControl from 'control/Table'
import EnumFilter from 'filter/EnumFilter';
import { MsgReceiveStatusEnum } from 'enum/Social';
import TimeFilter from 'filter/TimeFilter';

import { selectQueryInfo } from 'store/social'

import Control from 'control/Control'

import {
    selectUserName, updateUserName,
    selectProtraitUrl, updateProtraitUrl,
    // selectUserCheckList, updateUserCheckList,
    // selectFirstName, updateFirstName,
    // selectLastName, updateLastName,
    // selectSex, updateSex,
    // selectPhone, updatePhone,
    // selectBirthday, updateBirthday,
    // selectJob, updateJob,
    // selectCounty, updateCounty,
    // selectDistrict, updateDistrict,
    // selectAddress, updateAddress,
    // selectFamilyMemberList, updateFamilyMemberList,
    // selectRemark, updateRemark,
    updateUserProfile,
} from "store/social"
import UserCheckEnum from 'enum/social/UserCheck';
import { ConsumeStatusEnum } from 'enum/social/ConsumeStatus';

const getSocialFriendTableHeader = function (t) {

    const tableHeader = new TableHeader({
        rowSelect: {
            mode: 'singleSelect', // 代表只能單選
        },
        upperHeader: { // 上層header，不會被算做資料欄
            channelUid: { // <key>
                label: t('channelUid'), // '渠道UID',
                type: 'upperHeader'
            },
            channelSubscribeState: { // <key>
                label: t('channelSubscribeState'), // '渠道訂閱狀態',
                type: 'upperHeader'
            },
        },
        // headerExtra: [{ // 額外要載入的欄位
        //     key: 'priceIntervalId',
        //     fetch: 'id',
        // }],
        header: [{
            label: '',
            key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
            type: 'checkBox',
            mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
            width: '50px',
        }, {
            label: t('userName'), // 用戶名
            key: 'userName',
            type: 'text',
            width: '120px',
        }, {
            label: t('portrait'), // 頭像
            key: 'portraitUrl',
            type: 'img',
            width: '120px',
            imgStyle: { // 用來設定圖像的style
                width: '50px',
                height: '50px',
            },
            clickable: true,
        }, {
            label: t('msgReceiveStatus'), // 訊息接收狀態
            key: 'msgReceiveStatus',
            type: 'text',
            width: '120px',
            filter: new EnumFilter(MsgReceiveStatusEnum, t),
        }, {
            label: t('userRelationKey'), // 會員關聯鍵值
            key: 'userRelationKey',
            type: 'text',
            width: '120px',
        }, {
            label: t('coordinate'), // 所在座標
            key: 'coordinate',
            type: 'text',
            width: '120px',
        }, {
            label: t('coordinateLastRefreshTime'), // 座標最後刷新時間
            key: 'coordinateLastRefreshTime',
            type: 'text',
            width: '120px',
            filter: new TimeFilter('time'),
        }, {
            label: 'LINE', // LINE
            key: 'channelUidLine',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelUid', // 上層: 渠道UID
        }, {
            label: 'FB', // FB
            key: 'channelUidFacebook',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelUid', // 上層: 渠道UID
        }, {
            label: 'IG', // IG
            key: 'channelUidInstagram',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelUid', // 上層: 渠道UID
        }, {
            label: 'Wechat', // WeChat
            key: 'channelUidWechat',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelUid', // 上層: 渠道UID
        }, {
            label: 'LINE', // LINE
            key: 'channelSubscribeStateLine',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelSubscribeState', // 上層: 渠道訂閱狀態
        }, {
            label: 'FB', // FB
            key: 'channelSubscribeStateFacebook',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelSubscribeState', // 上層: 渠道訂閱狀態
        }, {
            label: 'IG', // IG
            key: 'channelSubscribeStateInstagram',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelSubscribeState', // 上層: 渠道訂閱狀態
        }, {
            label: 'Wechat', // WeChat
            key: 'channelSubscribeStateWechat',
            type: 'text',
            width: '120px',
            upperHeaderRef: 'channelSubscribeState', // 上層: 渠道訂閱狀態
        }, {
            label: t('firstGet'), // 初次取得
            key: 'firstGet',
            type: 'text',
            width: '120px',
            filter: new TimeFilter('time'),
        }, {
            label: t('lastContact'), // 最近互動
            key: 'lastContact',
            type: 'text',
            width: '120px',
            filter: new TimeFilter('time'),
        }, {
            label: t('createTime'), // 創建時間
            key: 'createTime',
            type: 'text',
            width: '120px',
            filter: new TimeFilter('time'),
        }]
    });
    return tableHeader;
}

export class SocialFriendTableFlow extends TableControl {
    t = null;
    constructor(tableDataRef) {
        const { t } = useTranslation('social', { keyPrefix: 'socialFriendTable' });
        super(tableDataRef, getSocialFriendTableHeader(t));

        this.t = t;
    }
    circuit() {
        return {
            // tagSelector: true, // 註冊 tagSelector Control的存取權限
        }
    }

    bindMount() {
        // Override底層的bindMount: 實作bintMount，設定loadSocial函式進行呼叫
        return super.bindMount(this.loadSocial);
    }

    loadSocial(newPage = 1, unlock = () => { }) {
        // console.log('loadSocial', newPage, unlock);
        const vm = this;

        /*
        

        const tableData = this.getTableData();

        // [未完成]之後要接上真正的API
        return ApiSender.sendApi('[get]/account-entities', {
            page: newPage, // API的page參數從1開始
            pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
        }).then((apiRes) => {
            // [未完成]之後要接上真正的apiRes
            apiRes = fakeApiRes;
            apiRes.page = newPage;

            // 將newTableData內的page參數更新到urlQuery上
            // this.setTableData(new TableData(apiRes, 'crossbot', this.getTableHeader()).navigateUrlQuery(this.urlQuery));
            vm.refreshTableData(new TableData(apiRes, 'crossbot', vm.getTableHeader()).navigateUrlQuery(vm.urlQuery));
            unlock();
        }).catch(new ApiError(function (error, next) {
            unlock();
            next(); // 開啟Alert燈箱
        }).catchAlertMsg());
        */

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                userName: '張三',
                // portraitUrl: 'https://icon-library.com/images/gaming-icon/gaming-icon-2.jpg',
                portraitUrl: '/assets/image/gaming-icon-2.jpg',
                msgReceiveStatus: 'noBlock',
                userRelationKey: '',
                coordinate: '41.40338,2.17403',
                coordinateLastRefreshTime: new Date().toISOString(),
                channelUidLine: '5ebcbbadd45fcc3a74959176',
                channelUidFacebook: '5ebcbbadd45fcc3a74959176',
                channelUidInstagram: '5ebcbbadd45fcc3a74959176',
                channelUidWechat: '5ebcbbadd45fcc3a74959176',
                channelSubscribeStateLine: '三國志討論版(已封鎖)',
                channelSubscribeStateFacebook: '霹靂討論版',
                channelSubscribeStateInstagram: '金庸討論版',
                channelSubscribeStateWechat: '劍俠情緣討論版',
                firstGet: new Date().toISOString(),
                lastContact: new Date().toISOString(),
                createTime: new Date().toISOString(),
            }],
        }

        vm.refreshTableData(new TableData(tableDataSample, 'default', vm.getTableHeader()));
        // .navigateUrlQuery(vm.urlQuery)

        return Promise.resolve();
    }

    onQuery() {
        const queryInfo = useGetter(selectQueryInfo);
        console.log('onQuery', queryInfo)

        /* selectQueryInfo: {
            channelList: (2) ['facebook', 'instagram']
            endDate: "2022-08-12T09:39:54.474Z"
            markedTimes: 8
            startDate: "2022-08-09T09:39:54.429Z"
            tagList: [
                {label: 'shohan_1_2', value: 'shohan_1_2', active: false}
                {label: 'shohan_1_7', value: 'shohan_1_7', active: false}
                {label: 'shohan_1_6', value: 'shohan_1_6', active: false}
                {label: 'aaaaaa_3_2', value: 'aaaaaa_3_2', active: false}
            ]
            tagLogic: true // true === 'or' ; false === 'and'
        } */

        // 重新載入表格資料
        this.loadSocial();
    }
}


export class SocialDetailFlow extends Control {
    modalRef = null;
    constructor(modalRef) {
        super();
        this.modalRef = modalRef;
    }
    setup() {
        return {
            dispatch: true,
            // useSelector: true,
        };
    }
    // frame() {
    //     return {};
    // }
    circuit() {
        return {
            tagSelector: true, // 註冊 tagSelector Control的存取權限
            userProfile: true,
        }
    }
    bindModalRef(modalRef) {
        if (!this.modalRef) {
            console.error(`bindModalRef: modalRef not exist`);
            return;
        }
        this.modalRef.current = modalRef;
    }

    openModal() {
        if (!this.modalRef) {
            console.error(`bindModalRef: modalRef not exist`);
            return;
        }
        this.modalRef.current.openModal();
    }

    // --------------------------------------------------------------

    // act.1 點擊頭像
    onPortraitClick(cellInfo) {
        // console.log(`onPortraitClick row`, cellInfo.getRow());

        // 開啟Modal
        this.openModal();

        // 執行tagSelector內的載入介面

        // [缺API]要再串API，取得該使用的tagList以及

        // [DetailModal] 載入row相關資料(名稱、頭像)
        this.onLoadDetailInfo(cellInfo);

        // [TagSelector] 載入標籤類別
        this.fetchControl('tagSelector').onLoadSocialFriendTagSelector(cellInfo);

        // [UserProfile]
        this.fetchControl('userProfile').onloadUserProfile(cellInfo);
    }

    // 載入row相關資料(名稱、頭像)
    onLoadDetailInfo(cellInfo) {
        const row = cellInfo.getRow();
        // console.log(`onLoadDetailInfo row`, cellInfo.getRow());

        this.dispatch(updateUserName(row.userName));
        this.dispatch(updateProtraitUrl(row.portraitUrl));
    }
}


export class SocialUserProfileFlow extends Control {
    t = null;

    // constructor() {
    //     super();
    //     const { t } = useTranslation('social', { keyPrefix: 'socialUserProfile' });
    //     this.t = t;
    // }

    setup() {
        return {
            dispatch: true,
        }
    }

    // act.1 載入該使用者的【用戶樣貌】資料
    onloadUserProfile() {
        // this.dispatch(updateUserName('aaaaa'));
        // this.dispatch(updateProtraitUrl(row.portraitUrl));


        // [缺API]這裡要載入使用者資訊

        // this.dispatch(updateUserCheckList([{
        //     value: UserCheckEnum.phone,
        // }, {
        //     value: UserCheckEnum.email,
        // }, {
        //     value: UserCheckEnum.line,
        // }]));

        // this.dispatch(updateBirthday(new Date()));

        let apiRes;

        this.dispatch(updateUserProfile(apiRes));

    }

    // act.2 儲存該使用者的【用戶樣貌】資料
    onSaveUserProfile() {
        console.log('onSaveUserProfile')
    }
}




const getConsumeBehaviorTableHeader = function (t) {

    const tableHeader = new TableHeader({
        // rowSelect: {
        //     mode: 'singleSelect', // 代表只能單選
        // },
        // headerExtra: [{ // 額外要載入的欄位
        //     key: 'priceIntervalId',
        //     fetch: 'id',
        // }],
        header: [{
            label: t('consumeDate'), // 消費日期
            key: 'consumeDate',
            type: 'text',
            width: '80px',
            filter: new TimeFilter('date', '-'),
        }, {
            label: t('consumeTime'), // 消費時段
            key: 'consumeTime',
            type: 'text',
            width: '50px',
            filter: new TimeFilter('clock', '-'),
        }, {
            label: t('consumeBehavior'), // 消費行為
            key: 'consumeStatus',
            type: 'text',
            width: '80px',
            filter: new EnumFilter(ConsumeStatusEnum, t),
        }, {
            label: t('consumePriceRank'), // 消費金額區間
            key: 'consumePriceRank',
            type: 'text',
            width: '100px',
        }, {
            label: t('orderId'), // 訂單編號
            key: 'orderId',
            type: 'text',
            width: '120px',
        }],
    });
    return tableHeader;
}

// quotaRankTable
export class ConsumeBehaviorTableFlow extends TableControl {
    t = null;

    constructor(tableDataRef) {
        const { t } = useTranslation('social', { keyPrefix: 'consumeBehavior' });
        // console.log('getConsumeBehaviorTableHeader(t)', getConsumeBehaviorTableHeader(t))
        super(tableDataRef, getConsumeBehaviorTableHeader(t));
        this.t = t;
    }

    onPageChange(newPage, unlink = () => { }) {
        console.log('onPageChange');

    }

    bindMount() {
        // Override底層的bindMount: 實作bintMount，設定loadSocial函式進行呼叫
        return super.bindMount(this.loadConsumBehavior);
    }

    loadConsumBehavior(newPage = 1, unlock = () => { }) {

        let tableDataSample = { // <Table>接受的資料格式
            page: 1,
            totalPage: 1,
            data: [{
                consumeDate: new Date(),
                consumeTime: new Date(),
                consumeStatus: ConsumeStatusEnum.hasOrdered,
                consumePriceRank: '1,500',
                orderId: '2022010164',
            }, {
                consumeDate: new Date(),
                consumeTime: new Date(),
                consumeStatus: ConsumeStatusEnum.hasOrdered,
                consumePriceRank: '1,500',
                orderId: '2022010164',
            }],
        }

        this.refreshTableData(new TableData(tableDataSample, 'default', this.getTableHeader()));
        return Promise.resolve();
    }
}