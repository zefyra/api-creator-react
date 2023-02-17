/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import { useTranslation } from 'react-i18next';


export default function AddAttrModal({ control, apiManageModel, model }) {

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
        label: '加入位置',
        type: 'text',
        value: model.fetchRef('addPositionDescription', `AddAttrModal`),
    }, {
        label: '欄位key',
        type: 'inputText',
        value: model.fetchRef('add_name', `AddAttrModal`),
    }, {
        label: '預設值',
        type: 'inputText',
        value: model.fetchRef('add_defaultValue', `EditAttrModal`),
    }, {
        label: '數值型態',
        type: 'select',
        optionList: model.fetchRef('valueTypeOptionList', `EditAttrModal`),
        value: model.fetchRef('add_valueType', `EditAttrModal`),
    }, {
        label: '描述',
        type: 'inputText',
        value: model.fetchRef('add_description', `EditAttrModal`),
    }, {
        label: '必填',
        type: 'select',
        optionList: model.fetchRef('requiredOptionList', `EditAttrModal`),
        value: model.fetchRef('add_required', `EditAttrModal`),
        // }, {
        //     label: 'schema',
        //     type: 'textArea',
        //     value: model.fetchRef('schema', 'AddBodyModal'),
    }];

    return (
        <FormModal modalRef={apiManageModel.reactive('addAttrModalRef', 'AddAttrModal_ref')}
            title="新增欄位(在下方)" formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="AddApiModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddAttr')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddAttr')}>{t('confirm')}</Button>
                </FooterArea>
            }
        ></FormModal>
    )
}