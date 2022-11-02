/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import { useTranslation } from 'react-i18next';


export default function AddResponseModal({ control, apiManageModel, model }) {

    const { t } = useTranslation('apiConnect', { keyPrefix: 'apiManage' })


    // "fileName": "qore-plus-api",
    // "apiRoute": "/api/friend",
    // "apiType": "get",
    // "tags": ["friend"],
    // "summary": "1-1.list friend"

    let formItemList = [{/*
        label: t('upperCategory'), // 上級分類
        type: 'inputButton', // 可輸入字串的按鈕
        buttonLabel: t('input'),
        inputText: model.fetchRef('upperCategory', `CreateTagCategoryModal_upperCategory`),
        // inputText: '中文中文中文中文中文中文中文中文中文中文中文中文',
        filter: new TextLimitFilter(15, 10),
        onButtonClick: control.bindAct('onUpperCategoryModalOpen'),
        textWidth: '210px',
    }, {*/
        label: 'rootType',
        type: 'inputText',
        value: model.fetchRef('rootType', `AddResponseModal`),
    }, {
        label: 'schema',
        type: 'textArea',
        width: '445px',
        height: '250px',
        // value: schema,
        // onUpdate: updateSchema,
        value: model.fetchRef('schema', 'AddResponseModal'),
    }, {
        label: '回傳類型',
        type: 'select',
        // value: model.fetchRef('apiType', `AddApiModal`),
        optionList: model.fetchRef('resTypeOptionList', `AddResponseModal`),
        value: model.fetchRef('resType', `AddResponseModal`),
    }, {
        label: 'description',
        type: 'inputText',
        value: model.fetchRef('description', `AddResponseModal`),
        /*
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
        comment: t('tagDecisionConditionComment'),*/
    }];

    return (
        <FormModal modalRef={apiManageModel.reactive('addResModalRef', 'EditTagModal_ref')}
            title="加入Response" formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="AddResModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddRes')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddRes')}>{t('confirm')}</Button>
                </FooterArea>
            }
        ></FormModal>
    )
}