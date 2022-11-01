import ApiSender, { ApiError } from "apiSender";
import Modal from "component/Modal";
import Control from "control/Control"
import TablePlugin, { TableBehavior } from "control/TablePlugin";
import { DirectKeyEnum } from "enum/Behavior";
// import { DirectKeyEnum } from "enum/Behavior";
import { MessageQueryPanelModel, MessageTableModel, SendDetailTableModel } from "fragment/MessageBroadcast"
import TableData from "util/TableData";

export class MessageTableFlow extends Control {
    constructor() {
        super();

        this.registPlugin(
            'tablePlugin',
            new TablePlugin(new TableBehavior({ // 提供資源
                defaultModelKey: 'tableModel', // 自動將Behavior的data()接到這個ModelKey
                action: {
                    loadTable: 'loadMessages', // <actionKey>: <Control內函式名稱)
                },
            }).regist(DirectKeyEnum.resource, this))
        );

        this.registPlugin(
            'sendDetail',
            new TablePlugin(new TableBehavior({ // 提供資源
                defaultModelKey: 'sendDetailModel', // 自動將Behavior的data()接到這個ModelKey
                action: {
                    loadTable: 'loadSendDetail', // <actionKey>: <Control內函式名稱)
                },
            }).regist(DirectKeyEnum.resource, this))
        );
    }
    ref() {
        return {
            sendDetailModal: Modal.name,
            addMessageModal: Modal.name,
        }
    }
    plugin() {
        return {
            tablePlugin: TablePlugin.name,
            sendDetail: TablePlugin.name,
        }
    }
    circuit() {
        return {
            table: true,
        }
    }
    frame() {
        return {
            panelModel: MessageQueryPanelModel.name,
            tableModel: MessageTableModel.name,
            sendDetailModel: SendDetailTableModel.name,
        }
    }
    onPanelQuery() {
        const panelModel = this.fetchModel('panelModel');
        console.log('onPanelQuery', panelModel.getQuery());
    }
    preload() {
        return Promise.resolve();
    }
    loadMessages(newPage = 1, unlock = (() => { })) {
        const vm = this;

        const tableModel = this.fetchModel('tableModel');
        const tableData = tableModel.getState('tableData');
        const tableHeader = tableModel.getState('tableHeader');

        vm.preload().then(() => {

            return ApiSender.sendApi('[get]/message-broadcast', {
                page: newPage, // API的page參數從1開始
                pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
            });
        }).then((apiRes) => {

            tableModel.setState('tableData', new TableData(apiRes, 'crossbot', tableHeader));
            unlock();
        }).catch(new ApiError(function (error, next) {
            unlock();
            next(); // 開啟Alert燈箱
        }).catchAlertMsg());
    }
    onOpenSendDetail(cellInfo) {
        console.log('onOpenSendDetail', cellInfo);

        const sendDetailModalRef = this.fetchRef('sendDetailModal');
        if (sendDetailModalRef) {
            sendDetailModalRef.openModal();

            this.loadSendDetail(1, () => { });
        }
    }
    loadSendDetail(newPage, unlock) {
        const vm = this;

        const tableModel = this.fetchModel('sendDetailModel');
        const tableData = tableModel.getState('tableData');
        const tableHeader = tableModel.getState('tableHeader');
        tableModel.setState('loading', true);

        vm.preload().then(() => {
            return ApiSender.sendApi('[get]/message-broadcast/detail', {
                page: newPage, // API的page參數從1開始
                pageSize: tableData.getPageSize(), // 使用當前設定的pageSize呼叫API
            });
        }).then((apiRes) => {

            tableModel.setState('tableData', new TableData(apiRes, 'crossbot', tableHeader));
            // tableModel.setState('loading', false);
            setTimeout(function () {
                tableModel.setState('loading', false);
            }, 1000)
            unlock();
        }).catch(new ApiError(function (error, next) {
            unlock();
            next(); // 開啟Alert燈箱
        }).catchAlertMsg());
    }
    onOpenAddMessageBroadcast() {
        const addMessageModalRef = this.fetchRef('addMessageModal');
        if (addMessageModalRef) {
            addMessageModalRef.openModal();
        }
    }
    // 取消
    onCancelAddMessageBroadcast() {
        const addMessageModalRef = this.fetchRef('addMessageModal');
        console.log('onSaveAddMessageBroadcast')

        addMessageModalRef.closeModal();
    }
    // 儲存
    onSaveAddMessageBroadcast() {
        const addMessageModalRef = this.fetchRef('addMessageModal');
        console.log('onSaveAddMessageBroadcast');
        addMessageModalRef.closeModal();
    }
}