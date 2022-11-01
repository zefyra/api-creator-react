/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { PageTitle } from "module/layout"
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from 'react';

import FilterPanel, { FilterPanelDash, FilterPanelTail, FilterPanelTitle } from 'component/FilterPanel';
import { useNavigate } from 'react-router-dom';
import { TagCategorySelectModel, TagCreateModel, TagListTableModel } from 'fragment/Tag';
import { TagCategorySelectFlow, TagCreateFlow, TagListTableFlow } from 'flow/tag';
import Table from 'component/Table';
import TagSelector from 'module/tagSelector';
import DatePicker from 'component/DatePicker';
import InputText from 'component/InputText';
import Button from 'component/Button';
import Board from 'component/Board';
import FormModal, { FooterArea } from 'component/FormModal';
import TextLimitFilter from 'filter/TextLimitFilter';
import TableModal from 'component/TableModal';
import { useUrlQuery } from 'util/UrlQuery';

const BoardInfoContainerStyled = styled.div`
display: flex;
flex-direction: column;

padding: 1rem 1.5rem;
`

const BoardInfoRow = styled.div`
    display: flex;
    flex-direction: row;
`

const TagManageInfo = () => {
    const { t } = useTranslation('tag', { keyPrefix: 'infoPanel' });
    return (
        <Board>
            <BoardInfoContainerStyled>
                <BoardInfoRow>
                    {t('statement1')}
                </BoardInfoRow>
                <BoardInfoRow>
                    {t('statement2')}
                </BoardInfoRow>
                <BoardInfoRow>
                    {t('statement3')}
                </BoardInfoRow>
            </BoardInfoContainerStyled>
        </Board>
    );
}

const TagManagePanel = ({ control }) => {
    if (!(control instanceof TagListTableFlow)) {
        console.error(`TagManagePanel: control is not TagListTableFlow`);
    }

    const { t } = useTranslation('tag', { keyPrefix: 'filtPanel' });

    const [taggedTimes, setTaggedTimes] = useState(null);

    return (
        <FilterPanel pattern="panel">
            {/* 篩選標籤 */}
            <FilterPanelTitle title={t('filtTag')} pattern="panel" titleWidth="5.5rem">
                <TagSelector pattern="panel" type="queryTagModal" />
                {/* onChange={onTagSelectChange()} */}
            </FilterPanelTitle>
            {/* 被標注期間 */}
            <FilterPanelTitle title={t('taggedPeriod')} pattern="panel" titleWidth="5.5rem">
                {/*開始日期*/}
                <DatePicker placeholder={t('startDate')} pattern="panel"></DatePicker>
                {/* onUpdate={actStartDate} */}
                <FilterPanelDash pattern="panel">-</FilterPanelDash>
                {/*結束日期*/}
                <DatePicker placeholder={t('endDate')} pattern="panel"></DatePicker>
                {/* onUpdate={actEndDate} */}
            </FilterPanelTitle>
            {/* 被標注次數 */}
            <FilterPanelTitle pattern="panel" title={t('taggedTimes')} titleWidth="5.5rem">
                <InputText type="integer" pattern="panel" value={taggedTimes} onUpdate={setTaggedTimes}></InputText>
            </FilterPanelTitle>
            {/* 限定渠道 */}
            <FilterPanelTitle pattern="panel" title={t('limitChannel')} titleWidth="5.5rem">
                <Button type="toggle" pattern="small raw" onChange={control.bindAct('onToggleButtonChange', 'line')}
                    importStyle={{ marginRight: '1.5rem' }}>
                    LINE
                </Button>
                <Button type="toggle" pattern="small raw" onChange={control.bindAct('onToggleButtonChange', 'facebook')}
                    importStyle={{ marginRight: '1.5rem' }}>
                    FB
                </Button>
                <Button type="toggle" pattern="small raw" onChange={control.bindAct('onToggleButtonChange', 'instagram')}
                    importStyle={{ marginRight: '1.5rem' }}>
                    IG
                </Button>
                <Button type="toggle" pattern="small raw" onChange={control.bindAct('onToggleButtonChange', 'wechat')}
                    importStyle={{ marginRight: '1.5rem' }}>
                    WeChat
                </Button>
            </FilterPanelTitle>
            <FilterPanelTail pattern="panel">
                <Button pattern="panel" type="fill">{t('query')}</Button>
            </FilterPanelTail>
        </FilterPanel>
    );
}

const TagManageTable = ({ control }) => {

    const { t } = useTranslation('tag', { keyPrefix: 'tagList' });

    // const navigate = useNavigate();

    const [tableData, setTableData] = useState(control.getTableData());
    control.registTableDataSetter(control.getControlName(), setTableData);

    const urlQuery = useUrlQuery();

    const onButtonClick = () => (event, cellInfo) => {
        if (event === 'viewTagDecisionCondition') {

            const tagRow = cellInfo.getRow();
            // console.log('tagRow', tagRow);

            urlQuery.nav('/tagConditionList', {
                id: tagRow.id
            });
        }
    }

    return (
        <Table header={control.getTableHeader()} data={tableData} onButtonClick={onButtonClick()}>
            {/* 新增 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagCreateOpen')}>{t('create')}</Button>
            {/* 編輯 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagEditOpen')}>{t('edit')}</Button>
            {/* 刪除 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagDelete')}>{t('delete')}</Button>
            {/* 重新取得標籤 */}
            <Button type="table" mode="default" onClick={control.bindAct('onGetTagListAgain')}>{t('getTagAgain')}</Button>
        </Table>
    );
}

const CreateTagModal = ({ control, model }) => {
    if (!(control instanceof TagCreateFlow)) {
        console.error(`CreateTagModal: control is not TagCategorySelectFlow`);
        return (<div></div>);
    }
    if (!(model instanceof TagCreateModel)) {
        console.error(`CreateTagModal: model is not TagCategorySelectModel`);
        return (<div></div>);
    }

    const { t } = useTranslation('tag', { keyPrefix: 'createTag' })

    let formItemList = [{
        label: t('tagCategory'), // 標籤分類
        type: 'inputButton', // 可輸入字串的按鈕
        buttonLabel: t('select'),
        inputText: model.fetchRef('tagCategoryName', `CreateTagModal_tagCategory`),
        // inputText: '中文中文中文中文中文中文中文中文中文中文中文中文',
        filter: new TextLimitFilter(15, 10),
        onButtonClick: control.bindAct('onTagCategoryModalOpen'),
        textWidth: '210px',
    }, {
        label: t('tagNameZh'), // 標籤名稱(中)
        type: 'inputText',
        value: model.fetchRef('tagNameZh', `CreateTagModal_tagNameZh`),
    }, {
        label: t('tagNameEn'), // 標籤名稱(英)
        type: 'inputText',
        value: model.fetchRef('tagNameEn', `CreateTagModal_tagNameEn`),
    }, {
        label: t('describe'), // 說明
        type: 'textArea',
        value: model.fetchRef('describe', `CreateTagModal_describe`),
    }]

    // formWidth="400px"

    return (
        <FormModal modalRef={control.bindRef('tagCreateModal')}
            title={t('createTag')} formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="CreateTagModal"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAdd')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAdd')}>{t('confirm')}</Button>
                </FooterArea>
            }
        >
        </FormModal>
    )
}

export default function TagList({ fetchControl }) {

    const { t: menuT } = useTranslation('menu');
    const { t } = useTranslation('tag', { keyPrefix: 'tagList' });
    const { t: selectTagCategoryT } = useTranslation('tag', { keyPrefix: 'selectTagCategory' });
    // const { t: customDataT } = useTranslation('dataCollection', { keyPrefix: 'customData' });

    const fc = fetchControl('entity');

    const tagListTableModel = new TagListTableModel(useRef(null), { t });
    const tagListTableControl = new TagListTableFlow(useRef(null),
        tagListTableModel.getState('tableHeader'), tagListTableModel);

    const tagCreateControl = new TagCreateFlow(useRef(null));
    const tagCreateModel = new TagCreateModel(useRef(null));

    tagCreateControl.registModel('stateModel', tagCreateModel);

    tagListTableControl.registControl('tagCreate', tagCreateControl);

    const tagCategorySelectModel = new TagCategorySelectModel(useRef(null), { t: selectTagCategoryT });
    const tagCategorySelectControl = new TagCategorySelectFlow(useRef(null),
        tagCategorySelectModel.getState('tableHeader'));

    tagCategorySelectControl.registModel('stateModel', tagCategorySelectModel);
    tagCategorySelectControl.registControl('tagCreate', tagCreateControl);

    tagCreateControl.registControl('tagCategorySelect', tagCategorySelectControl);

    useEffect(tagListTableControl.bindMount(), []);

    return (
        <PageTitle title={menuT('social.tagList')}>
            <TagManagePanel control={tagListTableControl} />
            <TagManageTable control={tagListTableControl} />
            <TagManageInfo />
            {/* 新增標籤類別 */}
            <CreateTagModal control={tagCreateControl} model={tagCreateModel} />
            {/* 選擇標籤類別 */}
            <TableModal
                modalRef={tagCategorySelectControl.bindRef('selectTagCategory')}
                control={tagCategorySelectControl}
                srcKey="tagCategorySelect"
                loading={tagCategorySelectModel.fetchRef('loading', 'tagCategorySelect')}
            ></TableModal>
        </PageTitle>
    )
}
