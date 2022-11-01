/** @jsxImportSource @emotion/react */
// 偷偷告訴 babel 從 @emotion/react 來引入 runtime jsx
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
// module
import { PageTitle } from "module/layout"
import TagSelector from "module/tagSelector"
// 全選，多選框範例
import MultiSelectorSample from "module/multiSelectorSample"
// component
import InputText from "component/InputText";
import FilterPanel from "component/FilterPanel"
import { FilterPanelDash, FilterPanelTitle } from "component/FilterPanel"
import DatePicker from "component/DatePicker"
import Button from "component/Button"
import Select from "component/Select"
import Table from "component/Table"
import HrLine from "component/HrLine"
import ToggleSwitch from "component/ToggleSwitch"
// element
import SocialDetailModal from "element/SocialFriendManage/SocialDetailModal"
// util
import { useUrlQuery } from "util/UrlQuery";
// flow
import { SocialFriendTableFlow, SocialDetailFlow } from "flow/social"
// store
import {
    selectTagList, updateTagList,
    selectTagLogic, updateTagLogic,
    selectStartDate, updateStartDate,
    selectEndDate, updateEndDate,
    selectMarkedTimes, updateMarkedTimes,
    selectChannelList, updateChannelList,
    updateCheckedChange
} from "store/social"



// import { board as boardThemeObject } from "theme/reas"
// import ThemeMixin, { fetchTheme } from "util/ThemeMixin";

// import { OrderTableFlow } from 'flow/order'
// import NumberFilter from "filter/NumberFilter";

// const decimalSeparatorFilter = new NumberFilter('decimalSeparator');


const SocailFriendPanel = ({ fetchControl, className }) => {

    const dispatch = useDispatch();

    const tagList = useSelector(selectTagList);
    const tagLogic = useSelector(selectTagLogic);
    const startDate = useSelector(selectStartDate);
    const endDate = useSelector(selectEndDate);
    const markedTimes = useSelector(selectMarkedTimes);
    const channelList = useSelector(selectChannelList);

    const actTagList = val => dispatch(updateTagList(val));
    // const actTagList = val => {
    //     console.log('actTagList', val);
    //     // dispatch(updateTagList(val));
    // }
    const actTagLogic = val => dispatch(updateTagLogic(val));
    const actStartDate = val => dispatch(updateStartDate(val));
    const actEndDate = val => dispatch(updateEndDate(val));
    const actMarkedTimes = val => dispatch(updateMarkedTimes(val));

    const { t } = useTranslation('social', { keyPrefix: 'socialFriendPanel' });

    const onToggleButtonChange = type => active => {
        dispatch(updateChannelList(type, active));
    }

    // const onQueryTagSelect = () => tagList => {
    //     console.log('onQueryTagSelect', tagList);
    // }

    return (
        <FilterPanel>
            <div className={className}>
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
                            <Button type="toggle" pattern="small" onChange={onToggleButtonChange('line')}>
                                LINE
                            </Button>
                            <Button type="toggle" pattern="small" onChange={onToggleButtonChange('facebook')}>
                                FB
                            </Button>
                            <Button type="toggle" pattern="small" onChange={onToggleButtonChange('instagram')}>
                                IG
                            </Button>
                            <Button type="toggle" pattern="small" onChange={onToggleButtonChange('wechat')}>
                                WeChat
                            </Button>
                        </div>
                    </div>
                    <div className="query-button-block">
                        <Button type="fill" onClick={fetchControl('socialFriendTable').bindAct('onQuery')}>{t('query')}</Button>
                    </div>
                </div>
            </div>
        </FilterPanel>
    );
}

const SocailFriendPanelStyled = styled(SocailFriendPanel)`
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


const SocailFriendTable = ({ fetchControl }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation('social', { keyPrefix: 'socialFriendTable' })

    const socialFriendTableFlow = fetchControl('socialFriendTable');

    const tableHeader = socialFriendTableFlow.getTableHeader();
    const [tableData, setTableData] = useState(socialFriendTableFlow.getTableData());

    // 將view的tableData的setter註冊進去，這樣才能同步刷新
    socialFriendTableFlow.registTableDataSetter('socialFriendTable', setTableData);

    const actCheckedChange = (...args) => dispatch(updateCheckedChange(...args));

    const onImageClick = () => cellInfo => {
        if (cellInfo.getHeaderKey() === 'portraitUrl') {
            // console.log('onImageClick portraitUrl', cellInfo)
            fetchControl('socialDetail').onPortraitClick(cellInfo);
        }
    }

    // onPageChange={orderTableFlow.bindPageChange()}
    return (
        <Table header={tableHeader} data={tableData}
            onCheckedChange={actCheckedChange}
            onImageClick={onImageClick()}
            pageChangeLock>
            {/* 獲取Line用戶 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }}>{t('getLineUsers')}</Button>
            {/* onClick={onClickPayAgain()} */}
            {/* 獲取FB用戶 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }}>{t('getFacebookUsers')}</Button>
            {/* 獲取IG用戶 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }}>{t('getInstagramUsers')}</Button>
            {/* 獲取WeChate用戶 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }}>{t('getWechatUsers')}</Button>
            {/* 匯出 */}
            <Button type="table" mode="default" importStyle={{
                paddingH: '1rem',
            }}>{t('export')}</Button>
        </Table>
    );
}


function SocialFriendManage({ fetchControl }) {
    const translationMenu = useTranslation('menu', { keyPrefix: 'social' });
    const tableFlow = new SocialFriendTableFlow(useRef(null));
    const socialDetailFlow = new SocialDetailFlow(useRef(null));

    // 綁定url上的get參數的頁數
    // tableFlow.setUrlQuery(useUrlQuery());

    useEffect(tableFlow.bindMount(), []); // 觸發首次的API載入

    // 將tableFlow註冊到fetchControl上
    fetchControl = fetchControl('regist', 'socialFriendTable', tableFlow);
    fetchControl = fetchControl('regist', 'socialDetail', socialDetailFlow);

    return (
        <PageTitle title={translationMenu.t('socialFriendManage')}>
            <SocailFriendPanelStyled fetchControl={fetchControl} />
            <SocailFriendTable fetchControl={fetchControl} />
            <SocialDetailModal fetchControl={fetchControl} />
        </PageTitle>
    )
}
export default SocialFriendManage;







