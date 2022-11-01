/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { PageTitle } from 'module/layout';
import { useTranslation } from 'react-i18next';

// import { useSelector, useDispatch } from "react-redux";
import FilterPanel, { FilterPanelDash } from "component/FilterPanel"
import TagSelector from "module/tagSelector"
import ToggleSwitch from "component/ToggleSwitch"
import DatePicker from 'component/DatePicker';
import InputText from 'component/InputText';
import Button from 'component/Button';
import { useEffect, useRef, useState } from 'react';
import { AddMessageBroadcastModel, MessageQueryPanelModel, MessageTableModel, SendDetailTableModel } from 'fragment/MessageBroadcast';
import { MessageTableFlow } from 'flow/messageBroadcast';
import Table from 'component/Table';
import SendDetailModal from 'element/MessageBroadcast/SendDetailModal';
import FormModal, { FooterArea } from 'component/FormModal';
import { UserSelector } from 'module/userSelector';


const MessageTablePanel = ({ fetchControl, model, onQuery }) => {

    const { t } = useTranslation('social', { keyPrefix: 'socialFriendPanel' });

    const [tagList, setTagList] = useState(model.getState('tagList'));
    let actTagList = model.reactive('tagList', 'MessageTablePanel', setTagList);

    const [tagLogic, setTagLogic] = useState(model.getState('tagLogic'));
    let actTagLogic = model.reactive('tagLogic', 'MessageTablePanel', setTagLogic);

    const [startDate, setStartDate] = useState(model.getState('startDate'));
    let actStartDate = model.reactive('startDate', 'MessageTablePanel', setStartDate);

    const [endDate, setEndDate] = useState(model.getState('endDate'));
    let actEndDate = model.reactive('endDate', 'MessageTablePanel', setEndDate);

    const [markedTimes, setMarkedTimes] = useState(model.getState('markedTimes'));
    let actMarkedTimes = model.reactive('markedTimes', 'MessageTablePanel', setMarkedTimes);

    const [channelList, setChannelList] = useState(model.getState('channelList'));
    let actChannelList = model.reactive('channelList', 'MessageTablePanel', setChannelList);

    // const onToggleButtonChange = type => active => {
    //     // dispatch(updateChannelList(type, active));
    // }

    return (
        <FilterPanel>
            <SocailFriendPanelStyled>
                <div className="social-friend-row">
                    <div className="title">
                        {/* 篩選標籤 */}
                        {t('filtByTag')}
                    </div>
                    <TagSelector pattern="query"
                        type="queryTagModal" onChange={actTagList}></TagSelector>
                    {/* onConfirm={onQueryTagSelect()} */}
                    {/* 全選，多選框範例 */}
                    {/* <MultiSelectorSample pattern="query" /> */}
                    {/* <InputText placeholder={t('orderId')} pattern="query" value={orderId} onUpdate={actOrderId} /> */}
                </div>
                <div className="social-friend-row">
                    <div className="title">
                        {/* 篩選邏輯 */}
                        {t('filtLogic')}
                    </div>
                    <div className="logic">
                        and
                    </div>
                    <div className="logic-toggle">
                        <ToggleSwitch value={tagLogic} onUpdate={actTagLogic} />
                    </div>
                    <div className="logic">
                        or
                    </div>
                </div>
                <div className="social-friend-row">
                    <div className="social-panel-block">
                        <div className="title">
                            {/* 被標註期間 */}
                            {t('markedPeriod')}
                        </div>
                        {/*開始日期*/}
                        <DatePicker placeholder={t('startDate')} pattern="query" onUpdate={actStartDate}></DatePicker>
                        <FilterPanelDash>-</FilterPanelDash>
                        {/*結束日期*/}
                        <DatePicker placeholder={t('endDate')} pattern="query" onUpdate={actEndDate}></DatePicker>
                    </div>
                    <div className="social-panel-block">
                        <div className="title">
                            {/* 被標註次數 */}
                            {t('markedTimes')}
                        </div>
                        <InputText placeholder={t('markedTimes')} pattern="query" type="integer" max={10000} value={markedTimes} onUpdate={actMarkedTimes} />
                        {/* float的用法 */}
                        {/* <InputText placeholder={t('markedTimes')} pattern="query" type="float" value={markedTimes} onUpdate={actMarkedTimes} /> */}
                    </div>
                </div>
                <div className="footer-row">
                    <div className="social-friend-row">
                        <div className="title">
                            {/* 限定渠道 */}
                            {t('limitChannel')}
                        </div>
                        <div className="social-panel-block channel-block">
                            <Button type="toggle" pattern="small" srcKey="MessageTablePanel_toggle_line"
                                value={model.fetchRef('toggleLine', 'MessageTablePanel_toggle_line')}>
                                LINE
                            </Button>
                            <Button type="toggle" pattern="small" srcKey="MessageTablePanel_toggle_facebook"
                                value={model.fetchRef('toggleFacebook', 'MessageTablePanel_toggle_facebook')}>
                                FB
                            </Button>
                            <Button type="toggle" pattern="small" srcKey="MessageTablePanel_toggle_instagram"
                                value={model.fetchRef('toggleInstagram', 'MessageTablePanel_toggle_instagram')}>
                                IG
                            </Button>
                            <Button type="toggle" pattern="small" srcKey="MessageTablePanel_toggle_wechat"
                                value={model.fetchRef('toggleWechat', 'MessageTablePanel_toggle_wechat')}>
                                WeChat
                            </Button>
                        </div>
                    </div>
                    <div className="query-button-block">
                        <Button type="fill" onClick={onQuery}>{t('query')}</Button>
                    </div>
                </div>
            </SocailFriendPanelStyled>
        </FilterPanel>
    );
}

const SocailFriendPanelStyled = styled.div`
    /* margin-bottom: 1.5rem; */
    display: flex;
    flex-direction: column;

    .social-friend-row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        min-height: 3.5rem;

        .social-panel-block {
            display: flex;
            flex-direction: row;

            flex-wrap: wrap;
        }
        .social-panel-block.channel-block {
            margin-left: 0.75rem;
        }

        & .title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            min-width: 6rem;
            margin: 0 1rem;

            padding: 0 1.5rem;
        }
        & .logic {
            display: flex;
            flex-direction: row;
            width: 4.5rem;

            align-items: center;
            justify-content: center;
        }

        & .logic-toggle {
            display: flex;
            flex-direction: row;
            width: 6rem;

            align-items: center;
            justify-content: center;
        }
    }
    .footer-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        & .query-button-block{
            /* height: 100%; */
            display: flex;
            flex-direction: row;
            align-items: center;

            height: 3.5rem;
        }
    }
`



const MessageTable = ({ tablePlugin, onOpenSendDetail, onOpenAdd, onOpenEdit, onRemove }) => {

    const { t } = useTranslation('social', { keyPrefix: 'messageBroadcast' });

    const [tableData, setTableData] = useState(tablePlugin.getState('tableData'));
    let actTableData = tablePlugin.reactive('tableData', 'MessageTable', setTableData);

    const plginTableHeader = tablePlugin.getState('tableHeader');
    const [tableHeader, setTableHeader] = useState(plginTableHeader);
    let actTableHeader = tablePlugin.reactive('tableHeader', 'MessageTable', setTableHeader);

    useEffect(function () {
        tablePlugin.onTableMount();
    }, []);

    const onTableButtonClick = () => (event, cellInfo) => {
        if (event === 'sendDetail') {
            if (onOpenSendDetail) {
                onOpenSendDetail(cellInfo);
            }
        }
    }

    return (
        <Table header={tableHeader} data={tableData}
            onPageChange={tablePlugin.bindAct('onPageChange')}
            onButtonClick={onTableButtonClick()}
            pageChangeLock>
            {/* 新增 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }} onClick={onOpenAdd}>{t('add')}</Button>
            {/* 編輯 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }} onClick={onOpenEdit}>{t('edit')}</Button>
            {/* 刪除 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }} onClick={onRemove}>{t('remove')}</Button>
        </Table>
    );
}


export default function MessageBroadcast({ fetchControl }) {
    const translationMenu = useTranslation('menu', { keyPrefix: 'social' });

    const { t } = useTranslation('social', { keyPrefix: 'messageBroadcast' });

    const { t: messageSendDetailT } = useTranslation('social', { keyPrefix: 'messageSendDetail' });
    const { t: addMessageFormT } = useTranslation('social', { keyPrefix: 'addMessageForm' });

    console.log('MessageBroadcast render');

    const panelModel = new MessageQueryPanelModel(useRef(null));
    const tableModel = new MessageTableModel(useRef(null), { t });
    const sendDetailTableModel = new SendDetailTableModel(useRef(null), { t: messageSendDetailT });
    const addMessageBroadcastModel = new AddMessageBroadcastModel(useRef(null), { t });

    const messageTableControl = new MessageTableFlow();

    messageTableControl.registModel('panelModel', panelModel);
    messageTableControl.registModel('tableModel', tableModel);
    messageTableControl.registModel('sendDetailModel', sendDetailTableModel);

    const tabList = [{
        label: t('sendDetail'),
        tabKey: 'sendDetail', // SocialDetailTabEnum.userPreference,
    }];

    let formItemList = [{
        label: addMessageFormT('title'), // 標題
        type: 'inputText',
        value: addMessageBroadcastModel.fetchRef('title', 'MessageBroadcastAdd'),
    }, {
        label: addMessageFormT('filtListMethod'), // 篩選名單方式
        type: 'toggleSwitch',
        value: addMessageBroadcastModel.fetchRef('filtListMethod', 'MessageBroadcastAdd'),
        trueLabel: addMessageFormT('user'),
        falseLabel: addMessageFormT('tag')
    }, {
        label: addMessageFormT('selectUser'), // 選擇用戶
        type: 'slot',
        slot: (
            <UserSelector type="formItemSlot" selectMode="multi"
                onChange={addMessageBroadcastModel.reactive('userList', 'MessageBroadcastAdd')}></UserSelector>
        ),
        hide: addMessageBroadcastModel.fetchRef('selectUserHide', 'MessageBroadcastAdd'),
    }, {
        label: addMessageFormT('selectTag'), // 選擇標籤
        type: 'slot',
        slot: (
            <TagSelector type="formItemSlot" pattern="formModal" selectMode="single"
                onChange={addMessageBroadcastModel.reactive('tagList', 'MessageBroadcastAdd')}></TagSelector>
        ),
        hide: addMessageBroadcastModel.fetchRef('selectTagHide', 'MessageBroadcastAdd'),
    }, {
        label: addMessageFormT('sendMethod'), // 傳送方式
        type: 'select',
        optionList: [{
            label: addMessageFormT('manualSend'), // '手動發送',
            value: 'manual',
        }, {
            label: addMessageFormT('specifiedTimeTime'), // '指定時間'
            value: 'specifiedTime',
        }],
        value: addMessageBroadcastModel.fetchRef('sendMethod', 'MessageBroadcastAdd'),
    }, {
        label: addMessageFormT('specifiedDate'), // 指定日期
        type: 'inputText',
        value: addMessageBroadcastModel.fetchRef('specifiedDate', 'MessageBroadcastAdd'),
        hide: addMessageBroadcastModel.fetchRef('specifiedDateHide', 'MessageBroadcastAdd'),
    }, {
        label: addMessageFormT('specifiedTime'), // 指定時間
        type: 'dateTimePicker',
        value: addMessageBroadcastModel.fetchRef('specifiedTime', 'MessageBroadcastAdd'),
        hide: addMessageBroadcastModel.fetchRef('specifiedTimeHide', 'MessageBroadcastAdd'),
    }, {
        label: addMessageFormT('sendChannel'), // 發送渠道
        type: 'inputText',
    }, {
        label: addMessageFormT('messageType'), // 訊息類型
        type: 'select',
        optionList: [{
            label: addMessageFormT('text'),
            value: 'text',
        }],
        value: addMessageBroadcastModel.fetchRef('messageType', 'MessageBroadcastAdd'),
    }, {
        label: addMessageFormT('messsageContent'), // 訊息內容
        type: 'textArea',
        value: addMessageBroadcastModel.fetchRef('messageContentText', 'MessageBroadcastAdd'),
        // }, {
        //     label: t('platformType'), // 平台別
        //     type: 'select',
        //     optionList: PlatformTypeEnum.getAddOptionList(customDataT),
        // }, {
        //     label: customDataT('srcSystem'), // 來源系統
        //     type: 'select',
        //     // 因為optionList的載入會有時間差，因此要丟Ref下去
        //     optionList: fc.fetchModel('customData').fetchRef('srcSystemOptionList', 'CustomDataPage'),
        //     loading: fc.fetchModel('customData').fetchRef('srcSystemOptionListLoading', 'CustomDataPage'),
    }];


    return (
        <PageTitle title={translationMenu.t('messageBroadcast')}>
            <MessageTablePanel model={panelModel} fetchControl={fetchControl}
                onQuery={messageTableControl.bindAct('onPanelQuery')} />
            <MessageTable fetchControl={fetchControl} control={messageTableControl}
                model={tableModel} tablePlugin={messageTableControl.fetchPlugin('tablePlugin')}
                onOpenSendDetail={messageTableControl.bindAct('onOpenSendDetail')}
                onOpenAdd={messageTableControl.bindAct('onOpenAddMessageBroadcast')}></MessageTable>
            {/* , onOpenEdit, onRemove */}
            <SendDetailModal
                tablePlugin={messageTableControl.fetchPlugin('sendDetail')}
                setModalRef={messageTableControl.bindRef('sendDetailModal')}
                title={t('sendDetail')} tabList={tabList}
            ></SendDetailModal>
            <FormModal modalRef={messageTableControl.bindRef('addMessageModal')}
                srcKey="addMessageModal"
                title={t('addMessageBroadcast')} formItemList={formItemList}
                modalHeight={621}
                footerSlot={
                    <FooterArea>
                        <Button type="fill" onClick={messageTableControl.bindAct('onCancelAddMessageBroadcast')}>
                            {t('cancel')}
                        </Button>
                        <div style={{ width: '5rem' }}></div>
                        <Button type="fill" onClick={messageTableControl.bindAct('onSaveAddMessageBroadcast')}>
                            {t('confirm')}
                        </Button>
                    </FooterArea>
                }
                FormModal="cutomDataAdd"
            />
        </PageTitle>
    );
}