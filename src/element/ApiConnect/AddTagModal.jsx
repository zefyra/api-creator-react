/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import { useTranslation } from 'react-i18next';


export default function AddTagModal({ control, apiManageModel, model }) {

    const { t } = useTranslation('apiConnect', { keyPrefix: 'apiManage' })




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
        label: '標籤key', // t('tagCategoryZh'),
        type: 'inputText',
        value: model.fetchRef('name', `AddTagModal`),
        // }, {
        //     label: '標籤標題',
        //     type: 'inputText',
        //     value: model.fetchRef('groupName', `AddTagModal`),
    }, {
        label: '標籤標題',
        type: 'inputText',
        value: model.fetchRef('description', `AddTagModal`),
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
        <FormModal modalRef={apiManageModel.reactive('addTagModalRef', 'AddApiModal_ref')}
            title="新增標籤" formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="AddTagModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddTag')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddTag')}>{t('confirm')}</Button>
                </FooterArea>
            }
        ></FormModal>
    )
}