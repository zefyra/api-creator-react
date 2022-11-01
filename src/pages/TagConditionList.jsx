/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { PageTitle } from "module/layout"
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from 'react';

// import FilterPanel, { FilterPanelDash, FilterPanelTail, FilterPanelTitle } from 'component/FilterPanel';
// import { useNavigate } from 'react-router-dom';
// import { TagCategorySelectModel, TagCreateModel, TagListTableModel } from 'fragment/Tag';
// import { TagCategorySelectFlow, TagCreateFlow, TagListTableFlow } from 'flow/tag';
import Table from 'component/Table';
// import TagSelector from 'module/tagSelector';
// import DatePicker from 'component/DatePicker';
// import InputText from 'component/InputText';
import Button from 'component/Button';
// import Board from 'component/Board';
import FormModal, { FooterArea } from 'component/FormModal';
// import TextLimitFilter from 'filter/TextLimitFilter';
// import TableModal from 'component/TableModal';
import { useUrlQuery } from 'util/UrlQuery';
import { TagConditionCreateFlow, TagConditionTableFlow } from 'flow/tag';
import { TagConditionCreateModel, TagConditionTableModel } from 'fragment/Tag';
import TagSelector from 'module/tagSelector';
import ConditionTypeEnum from 'enum/tag/ConditionTypeEnum';
import { FieldTypeEnum } from 'enum/dataCollection/FieldType';
import GetterRef from 'model/GetterRef';
import InputText from 'component/InputText';
import Select from 'component/Select';
import DatePicker from 'component/DatePicker';

const TagConditionTable = ({ control, model }) => {
    if (!(control instanceof TagConditionTableFlow)) {
        console.error(`TagConditionTable: control is not TagConditionTableFlow`);
        return (<div></div>);
    }
    const { t } = useTranslation('tag', { keyPrefix: 'tagConditionList' });

    const [tableData, setTableData] = useState(control.getTableData());
    control.registTableDataSetter(control.getControlName(), setTableData);

    // console.log('TagConditionTable_aaa')
    // const aaRef = model.fetchRef('loading', 'TagConditionTable_aaa');
    // setTimeout(function () {
    //     console.log(`aaRef val`, aaRef.getValue())
    // }, 3000);

    return (
        <Table header={control.getTableHeader()} data={tableData} loading={model.fetchRef('loading', 'TagConditionTable')}>
            {/* model.fetchRef('loading', 'TagConditionTable') */}
            {/* 新增 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagConditionCreateOpen')}>{t('create')}</Button>
            {/* 編輯 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagConditionEditOpen')}>{t('edit')}</Button>
            {/* 刪除 */}
            <Button type="table" mode="default" onClick={control.bindAct('onTagConditionDelete')}>{t('delete')}</Button>
            {/* 重新取得 */}
            <Button type="table" mode="default" onClick={control.bindAct('onGetTagConditionAgain')}>{t('getAgain')}</Button>
        </Table>
    );
}

const CreateConditionModal = ({ model, control, srcKey = 'CreateConditionModal' }) => {
    if (!(model instanceof TagConditionCreateModel)) {
        console.error(`CreateConditionModal: model is not TagConditionCreateModel`);
        return (<div></div>)
    }
    if (!(control instanceof TagConditionCreateFlow)) {
        console.error(`CreateConditionModal: control is not TagConditionCreateFlow`);
        return (<div></div>)
    }

    const { t } = useTranslation('tag', { keyPrefix: 'tagConditionCreate' });
    const { t: fieldTypeT } = useTranslation('dataCollection', { keyPrefix: 'fieldType' });

    // const [tagList, setTagList] = useState([]);
    // let actTagList = setTagList;
    // let actTagList = model.reactive('tagList', srcKey);

    // sensor------------------------------------------------------------

    // 綁上matchData的感應器，數值改變時觸發事件
    const [matchData, setMatchData] = useState(model.getState('matchData'));
    model.reactive('matchData', srcKey, setMatchData);
    useEffect(function () {
        control.onMatchDataChange();
    }, [matchData]);

    // 綁上fieldKey的感應器
    const [fieldKey, setFieldKey] = useState(model.getState('fieldKey'));
    model.reactive('fieldKey', srcKey, setFieldKey)
    useEffect(function () {
        control.onFieldKeyChange();
    }, [fieldKey]);

    // 條件類型 控制formItem隱藏 -------------------------------------------------------------------

    // conditionType 綁定 event
    const conditionTypeRef = model.fetchRef('conditionType', `${srcKey}_conditionTypeRef`)

    const [conditionType, setConditionType] = useState();
    conditionTypeRef.reactive(`${srcKey}_conditionType_sensor`, setConditionType);
    useEffect(function () {
        control.onConditionTypeChange();
    }, [conditionType]);

    // 隱藏項目切換的控制
    const fieldFormItemHideRef = model.fetchRef('fieldFormItemHide', srcKey);
    const matchTagFormItemHideRef = model.fetchRef('matchTagFormItemHide', srcKey);

    const strParamHideRef = model.fetchRef('strParamHide', srcKey);
    const intParamHideRef = model.fetchRef('intParamHide', srcKey);
    const dateParamHideRef = model.fetchRef('dateParamHide', srcKey);
    const periodParamHideRef = model.fetchRef('periodParamHide', srcKey);

    // fieldType 綁定 event
    const [fieldType, setFieldType] = useState(model.getState('fieldType'));
    model.reactive('fieldType', srcKey, setFieldType);
    useEffect(function () {
        control.onFieldTypeChange();
    }, [fieldType]);


    // operationType 綁定 event
    const [operationType, setOperationType] = useState(model.getState('operationType'));
    model.reactive('operationType', srcKey, setOperationType);
    useEffect(function () {
        control.onOperationTypeChange();
    }, [operationType]);

    // operationParamDate 綁定
    const [dateVal, setDateVal] = useState('');
    const actDateVal = model.reactive('operationParamDate', srcKey, setDateVal);

    const [matchTagList, setMatchTagList] = useState(model.getState('matchTagList'));
    model.reactive('matchTagList', srcKey, setMatchTagList)
    useEffect(function () {
        control.onMatchTagListChange();
    }, [matchTagList]);

    const formItemList = [{
        label: t('tagName'), // 標籤名稱   tagId(標籤ID), tagNameZh(標籤名稱 中), tagNameEn(標籤名稱 英)
        // type: 'inputText', //  ps.這邊做一個選擇器
        // value: 'VIP會員購買'
        // value: model.fetchRef('tagNameZh', `CreateTagModal_tagNameZh`),
        type: 'slot',
        slot: (
            <TagSelector type="formItemSlot" pattern="formModal"
                selectMode="single" onChange={model.reactive('tagList', srcKey)}></TagSelector>
        ),
    }, {
        label: t('calculateLogic'), // 運算邏輯
        type: 'select',
        optionList: [{
            label: 'AND',
            value: 'and',
        }, {
            label: 'OR',
            value: 'or',
        }],
        value: model.fetchRef('logic', srcKey),
    }, {
        label: t('conditionType'), // 條件類型: 標籤條件、欄位條件、篩出筆數
        type: 'select',
        optionList: [{
            label: t('fieldCondition'),
            value: ConditionTypeEnum.field,
        }, {
            label: t('tagCondition'),
            value: ConditionTypeEnum.tag,
        }, {
            label: t('amountCondition'),
            value: ConditionTypeEnum.amount,
        }],
        value: model.fetchRef('conditionType', srcKey),
    }, {
        label: t('matchData'), // 匹配資料 (欄位條件)
        type: 'select',
        value: model.fetchRef('matchData', srcKey),
        optionList: model.fetchRef('matchDataOptionList', srcKey),
        loading: model.fetchRef('matchDataOptionListLoading', srcKey),
        hide: fieldFormItemHideRef,
        // hide: fieldFormItemHideRef.current,
    }, {
        label: t('fieldName'), // 欄位名稱 (欄位條件)    fieldName(欄位名稱), fieldKey(欄位key), fieldType(欄位型態)
        type: 'select',
        value: model.fetchRef('fieldKey', srcKey),
        optionList: model.fetchRef('fieldOptionList', srcKey),
        loading: model.fetchRef('fieldOptionListLoading', srcKey),
        hide: fieldFormItemHideRef,
        // hide: fieldFormItemHideRef.current,
    }, {
        label: t('matchTagName'), // 匹配標籤名稱 (標籤條件)    matchTagId(匹配標籤ID)   matchTagName(匹配標籤名稱)
        type: 'slot',
        slot: (
            <TagSelector type="formItemSlot" pattern="formModal"
                selectMode="single" onChange={model.reactive('matchTagList', srcKey)}></TagSelector>
        ),
        hide: matchTagFormItemHideRef,
    }, {
        label: t('operationType'), // 處理類型 >, <, ==
        type: 'select',
        value: model.fetchRef('operationType', srcKey),
        optionList: model.fetchRef('operationTypeOptionList', srcKey),
        // }, {
        //     label: t('fieldType'), // 欄位型態
        //     type: 'text',
        //     value: model.fetchRef('fieldType', srcKey),
        //     // hide: strParamHideRef,
        //     // filter: FieldTypeEnum.getFilter(fieldTypeT),
    }, {
        label: `${t('operationParam')}(${fieldTypeT('string')})`,
        // label: new GetterRef(
        //     model.fetchRef('fieldType', `${srcKey}_operationParam_str`),
        //     (fieldType, filter) => filter.filt(fieldType),
        //     FieldTypeEnum.getFilter(fieldTypeT)
        // ), // 'str', // t('operationParam'), // 處理參數(字串)
        type: 'inputText',
        value: model.fetchRef('operationParamStr', srcKey),
        hide: strParamHideRef,
    }, {
        label: `${t('operationParam')}(${fieldTypeT('number')})`,
        // label: new GetterRef(
        //     model.fetchRef('fieldType', `${srcKey}_operationParam_str`),
        //     (fieldType, filter) => filter.filt(fieldType),
        // FieldTypeEnum.getFilter(fieldTypeT)
        // ),
        // label: 'int', // t('operationParam'), // 處理參數(整數)
        type: 'inputText',
        value: model.fetchRef('operationParamInt', srcKey),
        inputType: 'integer',
        hide: intParamHideRef,
    }, {
        label: `${t('operationParam')}(${fieldTypeT('date')})`,
        // label: new GetterRef(
        //     model.fetchRef('fieldType', `${srcKey}_operationParam_str`),
        //     (fieldType, filter) => filter.filt(fieldType),
        //     FieldTypeEnum.getFilter(fieldTypeT)
        // ),
        // label: 'date', //  t('operationParam'), // 處理參數(時間)
        type: 'slot',
        slot: (
            <DatePicker importStyle={{
                width: '260px'
            }} value={dateVal} onUpdate={actDateVal}></DatePicker>
        ),
        hide: dateParamHideRef,
    }, {
        label: `${t('operationParam')}(${fieldTypeT('period')})`,
        // label: new GetterRef(
        //     model.fetchRef('fieldType', `${srcKey}_operationParam_str`),
        //     (fieldType, filter) => filter.filt(fieldType),
        //     FieldTypeEnum.getFilter(fieldTypeT)
        // ),
        // label: 'period', // t('operationParam'), // 處理參數(時間長度)
        // type: 'inputText',
        // value: model.fetchRef('operationParamPeriod', srcKey),
        // inputType: 'integer',
        type: 'slot',
        slot: (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <InputText type="integer" value={model.fetchRef('operationParamPeriod', srcKey)} max="10000" min="0"
                    importStyle={{ width: '160px' }}></InputText>
                <Select value={model.fetchRef('operationParamPeriodUnit', srcKey)} optionList={model.getState('operationParamPeriodUnitOptionList')}
                    importStyle={{ width: '80px' }}></Select>
            </div>
        ),
        hide: periodParamHideRef,
    }, {
        label: t('calculationSort'), // 運算排序
        type: 'inputText',
        value: model.fetchRef('sort', srcKey),
        inputType: 'integer',
        max: 100,
    }]

    return (
        <FormModal modalRef={control.bindRef('conditionCreateModal')}
            title={t('createTagCondition')} formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="CreateConditionModal"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancel')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirm')}>{t('confirm')}</Button>
                    {/* <button onClick={handleTest()}>AAAA</button> */}
                </FooterArea>
            }
        >
        </FormModal>
    )
}

export default function TagList({ fetchControl }) {

    const { t: menuT } = useTranslation('menu');
    const { t } = useTranslation('tag', { keyPrefix: 'tagConditionList' });
    const { t: dataCollectionT } = useTranslation('dataCollection');
    const { t: dateUnitT } = useTranslation('tag', { keyPrefix: 'dateUnit' });

    // const { t: selectTagCategoryT } = useTranslation('tag', { keyPrefix: 'selectTagCategory' });


    const tagConditionTableModel = new TagConditionTableModel(useRef(null), { t });
    const tagConditionTableControl = new TagConditionTableFlow(useRef(null), tagConditionTableModel);

    const tagConditionCreateModel = new TagConditionCreateModel(useRef(null), { t, dataCollectionT, dateUnitT });
    const tagConditionCreateControl = new TagConditionCreateFlow(tagConditionCreateModel);

    tagConditionTableControl.registControl('conditionCreate', tagConditionCreateControl);

    const urlQuery = useUrlQuery();

    useEffect(tagConditionTableControl.bindMount(urlQuery.get()), []);


    return (
        <PageTitle title={menuT('social.tagConditionList')}>
            <TagConditionTable control={tagConditionTableControl} model={tagConditionTableModel} />
            <CreateConditionModal control={tagConditionCreateControl} model={tagConditionCreateModel} />
        </PageTitle>
    )
}
