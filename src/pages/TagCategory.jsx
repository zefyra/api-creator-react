
/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { PageTitle } from "module/layout"
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from 'react';

import Board from 'component/Board';
import FormModal, { FooterArea } from 'component/FormModal';
import FilterPanel, { FilterPanelDash, FilterPanelTail, FilterPanelTitle } from 'component/FilterPanel';
import DatePicker from 'component/DatePicker';
import InputText from 'component/InputText';
import TagSelector from 'module/tagSelector';
import Button from 'component/Button';
import Table from 'component/Table';
import { ImportSchemaTableModel, TagCategoryAddModel, TagCategoryTableModel, UpperCategoryTableModel } from 'fragment/Tag';
import { ImportSchemaTableFlow, TagCategoryAddFlow, TagCategoryTableFlow, UpperCategoryTableFlow } from 'flow/tag';
import CreateMethodEnum from 'enum/tag/CreateMethodEnum';
import TextLimitFilter from 'filter/TextLimitFilter';
import TableModal from 'component/TableModal';
import { TableModalInterface } from 'interface/TableModal';
import CheckBox from 'component/CheckBox';
import Select from 'component/Select';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { updateTagDecisionTagCategoryOriginRow, updateTagDecisionTagCategoryRow } from 'store/tag';
import { useUrlQuery } from 'util/UrlQuery';

const BoardInfoContainerStyled = styled.div`
display: flex;
flex-direction: column;

/* width: 100%; */
padding: 1rem 1.5rem;
`

const BoardInfoRow = styled.div`
    display: flex;
    flex-direction: row;

    /* width: 100%; */
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

const TagManagePanel = () => {
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
            <FilterPanelTail pattern="panel">
                <Button pattern="panel" type="fill">{t('query')}</Button>
            </FilterPanelTail>
        </FilterPanel>
    );
}

const TagManageTable = ({ control }) => {
    const { t } = useTranslation('tag', { keyPrefix: 'tagCategory' });

    // const navigate = useNavigate();

    const [tableData, setTableData] = useState(control.getTableData());
    control.registTableDataSetter(control.getControlName(), setTableData);

    // const dispatch = useDispatch();

    const urlQuery = useUrlQuery();

    const onButtonClick = () => (event, cellInfo) => {
        // console.log('onButtonClick')
        if (event === 'viewTagDecisionCondition') {
            // 標籤判斷條件檢視
            // control.onViewTagDecisionCondition(cellInfo);

            const tagCategoryRow = cellInfo.getRow();
            console.log('cellInfo row', cellInfo.getRow());

            // dispatch(updateTagDecisionTagCategoryRow(cellInfo.getRow()));
            // dispatch(updateTagDecisionTagCategoryOriginRow(cellInfo.getOriginRow()));

            // navigate('/tagDecisionCondition');

            urlQuery.nav('/tagDecisionCondition', {
                id: tagCategoryRow.id,
            });

            return;
        }
    }

    return (
        <Table header={control.getTableHeader()} data={tableData} onButtonClick={onButtonClick()}>
            {/* 新增 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagCategoryCreateOpen')}>{t('create')}</Button>
            {/* 編輯 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagCategoryEditOpen')}>{t('edit')}</Button>
            {/* 刪除 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagCategoryDelete')}>{t('delete')}</Button>
        </Table>
    );
}

const UpdateFrequencyStyled = styled.div`
display: flex;
flex-direction: column;
    & .row {
        display: flex;
        flex-direction: row;
        & .input-text-block {
            display: flex;

            margin-right: 0.5rem;
        }
        & .input-unit-block {
            display: flex;

        }
    }
    & .comment-row {
        display: flex;
        flex-direction: row;

        & .comment {
            display: flex;

        }
        & .variable {
            display: flex;

            margin-left: 0.5rem;
            margin-right: 0.5rem;

            color: #287bf0;
        }
    }
`

const UpdateFrequency = ({ control, model }) => {
    const { t } = useTranslation('tag', { keyPrefix: 'tagCategory' });

    const tagAmountRef = model.fetchRef('categoryTagAmount', 'UpdateFrequency');
    const [tagAmount, setTagAmount] = useState(tagAmountRef.getValue());
    tagAmountRef.reactive('UpdateFrequency', setTagAmount);

    const updateFrequencyRef = model.fetchRef('updateFrequency', 'UpdateFrequency')
    const [updateFrequency, setUpdateFrequency] = useState(updateFrequencyRef.getValue());
    const actUpdateFrequency = updateFrequencyRef.reactive('UpdateFrequency', setUpdateFrequency);

    // let actUpdateFrequency = function (val) {
    //     console.log(`actUpdateFrequency`, val);
    //     mutUpdateFrequency(val);

    //     setTimeout(function () {
    //         console.log('aaaa updateFrequency', model.getState('updateFrequency'));
    //     }, 500)
    // }

    return (
        <UpdateFrequencyStyled>
            <div className="row">
                <div className="input-text-block">
                    <InputText type="integer" value={updateFrequency}
                        onUpdate={actUpdateFrequency} srcKey="UpdateFrequency">
                    </InputText>
                </div>
                <div className="input-unit-block">
                    {t('minute')}
                </div>
            </div>
            <div className="comment-row">
                <div className="comment">
                    {t('updateFrequencyCommentA')}
                </div>
                <div className="variable">
                    {tagAmount}
                </div>
                <div className="comment">
                    {t('updateFrequencyCommentB')}
                </div>
            </div>
        </UpdateFrequencyStyled>
    );
}

const ApplyRangeStyled = styled.div`
display: flex;
flex-direction: column;

width: 100%;

    & .row {
        display: flex;
        flex-direction: row;

        align-items: flex-start;

        /* height: 3rem; */

        margin-bottom: 0.5rem;

        & .checkbox-block {
            padding-top: 0.35rem;
        }

        & .row-label {
            display: flex;
            flex-direction: row;

            align-items: center;
            /* height: 100%; */

            margin-top: 0.35rem;

            margin-left: 0.5rem;
            margin-right: 0.5rem;
        }

        & .content-block {
            display: flex;
            flex-direction: column;

            & .comment {

            }
        }
    }
    
    & .row.tail {
        margin-bottom: 0;
    }
`

const ApplyRange = ({ control, model }) => {

    const { t } = useTranslation('tag', { keyPrefix: 'tagCategory' })

    const [byIndustryChecked, setByIndustryChecked] = useState(true);
    const [byUserChecked, setByUserChecked] = useState(false);

    const actByIndustryChecked = setByIndustryChecked;
    const actByUserChecked = setByUserChecked;

    useEffect(function () {
        // 勾選框未勾起時鎖定下拉
        model.setState('applyIndustryDisabled', !byIndustryChecked);
    }, [byIndustryChecked]);

    useEffect(function () {
        // 勾選框未勾起時鎖定下拉
        model.setState('applyUserDisabled', !byUserChecked);
    }, [byUserChecked]);

    const onUpdate = type => val => {
        if (type === 'byIndustry') {

            if (!val && !byUserChecked) {
                return;
            }
            actByIndustryChecked(val);
        } else if (type === 'byUser') {

            if (!val && !byIndustryChecked) {
                return;
            }
            actByUserChecked(val);
        }
    }

    const byIndustrySelected = model.fetchRef('applyIndustry', 'ApplyRange');
    const byIndustryOptionList = model.fetchRef('applyIndustryOptionList', 'ApplyRange');
    const byIndustryLoading = model.fetchRef('applyIndustryLoading', 'ApplyRange');
    const applyIndustryDisabled = model.fetchRef('applyIndustryDisabled', 'ApplyRange');

    const applyUser = model.fetchRef('applyUser', 'ApplyRange');
    const applyUserDisabled = model.fetchRef('applyUserDisabled', 'ApplyRange');

    return (
        <ApplyRangeStyled>
            <div className="row">
                <div className="checkbox-block">
                    <CheckBox pattern="formModal" value={byIndustryChecked} onUpdate={onUpdate('byIndustry')}></CheckBox>
                </div>
                <div className="row-label">{t('byIndustry')}</div>
                <div className="content-block">
                    <Select value={byIndustrySelected} optionList={byIndustryOptionList}
                        onUpdate={control.bindAct('onApplyIndustryChanged')}
                        loading={byIndustryLoading} srcKey="ApplyRange_byIndustry"
                        disabled={applyIndustryDisabled}
                    ></Select>
                    {/* <div className="comment">
                        {t('applyIndustryComment')}
                    </div> */}
                </div>
            </div>
            <div className="row tail">
                <div className="checkbox-block">
                    <CheckBox pattern="formModal" value={byUserChecked} onUpdate={onUpdate('byUser')}></CheckBox>
                </div>
                <div className="row-label">{t('byUser')}</div>
                <div className="content-block">
                    <InputText value={applyUser} onUpdate={control.bindAct('onApplyUserChanged')}
                        disabled={applyUserDisabled}></InputText>
                    <div className="comment">
                        {t('applyUserComment')}
                    </div>
                </div>
            </div>
        </ApplyRangeStyled >
    )
}

const CreateTagCategoryModal = ({ control, model, bindModalRef }) => {
    // control: <TagCategoryAddFlow>

    const { t } = useTranslation('tag', { keyPrefix: 'tagCategory' });


    const tagCreateMethodRef = model.fetchRef('tagCreateMethod', `CreateTagCategoryModal_tagCreateMethod`);
    const importSchemaLockRef = tagCreateMethodRef.fetchRef(`importSchemaLock`, val => val !== CreateMethodEnum.fromDataCollection);

    let formItemList = [{
        label: t('upperCategory'), // 上級分類
        type: 'inputButton', // 可輸入字串的按鈕
        buttonLabel: t('input'),
        inputText: model.fetchRef('upperCategory', `CreateTagCategoryModal_upperCategory`),
        // inputText: '中文中文中文中文中文中文中文中文中文中文中文中文',
        filter: new TextLimitFilter(15, 10),
        onButtonClick: control.bindAct('onUpperCategoryModalOpen'),
        textWidth: '210px',
    }, {
        label: t('tagCategoryZh'), // 標籤分類(中)
        type: 'inputText',
        value: model.fetchRef('tagCategoryZh', `CreateTagCategoryModal_tagCategoryZh`),
    }, {
        label: t('tagCategoryEn'), // 標籤分類(英)
        type: 'inputText',
        value: model.fetchRef('tagCategoryEn', `CreateTagCategoryModal_tagCategoryEn`),
    }, {
        label: t('tagCreateMethod'), // 標籤建立方式
        type: 'select',
        optionList: CreateMethodEnum.getOptionList(t),
        value: tagCreateMethodRef,
        comment: t('tagCreateMethodComment'),
    }, {
        label: t('importSchema'), // 匯入資料表
        type: 'inputButton',
        buttonLabel: t('input'),
        inputText: model.fetchRef('importSchema', `CreateTagCategoryModal_importSchema`),
        // filter: new TextLimitFilter(15, 10),
        onButtonClick: control.bindAct('onImportSchemaModalOpen'),
        hide: importSchemaLockRef,
        placeholder: t('plsSelectSchema'),
        comment: t('importSchemaComment'),
    }, {
        label: t('schemaField'), // 資料表欄位
        type: 'select',
        optionList: model.fetchRef('schemaFieldOptionList', `CreateTagCategoryModal_schemaFieldOptionList`),
        value: model.fetchRef('schemaField', `CreateTagCategoryModal_schemaField`),
        loading: model.fetchRef('schemaFieldOptionListLoading', `CreateTagCategoryModal_schemaFieldOptionListLoading`),
        placeholder: t('plsSelectField'),
        hide: importSchemaLockRef,
    }, {
        label: t('applyRange'), // 適用範圍
        type: 'slot',
        slot: (
            <ApplyRange control={control} model={model}></ApplyRange>
        ),
    }, {
        label: t('updateFrequency'), // 更新頻率
        type: 'slot',
        slot: (
            <UpdateFrequency control={control} model={model}></UpdateFrequency>
        ),
    }, {
        label: t('tagDecisionCondition'), // 標籤判斷條件
        type: 'inputButton',
        buttonLabel: t('input'),
        inputText: model.fetchRef('tagDecisionCondition', `CreateTagCategoryModal`),
        // filter: new TextLimitFilter(15, 10),
        onButtonClick: control.bindAct('onTagDecisionConditionOpen'),
        // hide: importSchemaLockRef,
        // placeholder: t('plsSelectSchema'),
        comment: t('tagDecisionConditionComment'),
    }];

    // footerSlot={
    //     <FooterArea>
    //         <Button type="fill" onClick={fetchControl('customData').bindAct('onSchemaCreateModalCancel')}>{customDataT('cancel')}</Button>
    //         <div style={{ width: '5rem' }}></div>
    //         <Button type="fill" onClick={fetchControl('customData').bindAct('onSchemaCreateModalConfirm')}>{customDataT('confirm')}</Button>
    //     </FooterArea>
    // }

    return (
        <FormModal modalRef={bindModalRef}
            title={t('createTagCategory')} formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="TagManageAdd"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAdd')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAdd')}>{t('confirm')}</Button>
                </FooterArea>
            }
        >
            {/* {tabTableListDom} */}

        </FormModal>
    )
}




export default function TagCategory({ fetchControl }) {

    const { t: menuT } = useTranslation('menu');
    const { t } = useTranslation('tag', { keyPrefix: 'tagCategory' });
    const { t: customDataT } = useTranslation('dataCollection', { keyPrefix: 'customData' });

    const fc = fetchControl('entity');

    const tagCategoryTableModel = new TagCategoryTableModel(useRef(null), { t });
    const tableHeader = tagCategoryTableModel.getState('tableHeader');
    const tagCategoryTableControl = new TagCategoryTableFlow(useRef(null), tableHeader, tagCategoryTableModel);

    // Modal: 新增標籤分類
    const tagCategoryAddModel = new TagCategoryAddModel(useRef(null), { t });
    const tagCategoryAddFlow = new TagCategoryAddFlow(tagCategoryAddModel);

    // Modal: 新增標籤分類>選取上層分類
    const upperCategoryTableModel = new UpperCategoryTableModel(useRef(null), { t });
    const upperCategoryTableFlow = new UpperCategoryTableFlow(useRef(null),
        upperCategoryTableModel.getState('tableHeader'), upperCategoryTableModel);

    const importSchemaTableModel = new ImportSchemaTableModel(useRef(null), { t: customDataT });
    const importSchemaTableFlow = new ImportSchemaTableFlow(useRef(null),
        importSchemaTableModel.getState('tableHeader'), importSchemaTableModel);

    const { t: dataCollectionT } = useTranslation('dataCollection');
    tagCategoryAddFlow.registTranslation('dataCollection', dataCollectionT);

    tagCategoryTableControl.registControl('tagCategoryAdd', tagCategoryAddFlow);
    tagCategoryAddFlow.registControl('upperCategory', upperCategoryTableFlow);
    tagCategoryAddFlow.registControl('importSchema', importSchemaTableFlow);
    upperCategoryTableFlow.registControl('tagCategoryAdd', tagCategoryAddFlow);
    importSchemaTableFlow.registControl('tagCategoryAdd', tagCategoryAddFlow);

    fc.setupModel('tagCategory', tagCategoryTableModel);
    fc.setup('tagCategory', tagCategoryTableControl);

    useEffect(tagCategoryTableControl.bindMount(), []);

    // // fetchControl('tagCategory');
    // const bindCreateModalRef = () => ref => {
    //     tagCategoryTableControl.bindCreateModalRef(ref);
    //     tagCategoryAddFlow.bindCreateModalRef(ref);
    // }

    return (
        <PageTitle title={menuT('social.tagCategory')}>
            <TagManageInfo />
            <TagManagePanel />
            <TagManageTable control={tagCategoryTableControl} />
            {/* 新增標籤類別 */}
            <CreateTagCategoryModal control={tagCategoryAddFlow} model={tagCategoryAddModel}
                bindModalRef={tagCategoryAddFlow.bindAct('bindCreateModalRef')}
            />
            {/* bindModalRef={tagCategoryTableControl.bindAct('bindCreateModalRef')} */}
            {/* 選擇上級類別 */}
            {/* <SelectUpperCategoryModal control={upperCategoryTableFlow}
                bindModalRef={tagCategoryAddFlow.bindAct('bindUpperCategoryModalRef')} /> */}
            <TableModal
                modalRef={tagCategoryAddFlow.bindAct('bindUpperCategoryModalRef')}
                control={upperCategoryTableFlow}
                loading={upperCategoryTableModel.fetchRef('loading', 'UpperCategoryTableFlow')}
                srcKey="UpperCategoryTableModal"></TableModal>
            {/* modalRef={tagCategoryAddFlow.bindAct('bindUpperCategoryModalRef')} */}
            {/* 選擇匯入資料表 */}
            <TableModal
                modalRef={tagCategoryAddFlow.bindAct('bindImportSchemaModalRef')}
                control={importSchemaTableFlow}
                loading={importSchemaTableModel.fetchRef('loading', 'ImportSchemaTableFlow')}
                srcKey="ImportSchemaTableModal"></TableModal>
            {/* modalRef={tagCategoryAddFlow.bindAct('bindImportSchemaModalRef')} */}
        </PageTitle>
    )
}