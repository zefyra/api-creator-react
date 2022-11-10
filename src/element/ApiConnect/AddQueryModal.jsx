/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal';
import ParameterTypeEnum from 'enum/apiConnect/ParameterType';
import SwaggerPropertyTypeEnum from 'enum/apiConnect/SwaggerPropertyType';
import { useTranslation } from 'react-i18next';

export default function AddQueryModal({ control, apiManageModel, model }) {

    const { t } = useTranslation('apiConnect', { keyPrefix: 'apiManage' })

    let formItemList = [{
        label: '資料型態', // type
        type: 'select',
        optionList: SwaggerPropertyTypeEnum.getOptionList('urlQuery'),
        value: model.fetchRef('type', `AddQueryModal`),
        // comment: t('tagCreateMethodComment'),
    }, {
        label: '參數key', // name
        type: 'inputText',
        value: model.fetchRef('name', `AddQueryModal`),
    }, {
        label: '參數位置', // in
        type: 'select',
        optionList: ParameterTypeEnum.getOptionList('urlQuery'),
        value: model.fetchRef('in', `AddQueryModal`),
    }, {
        label: '預設值', // default
        type: 'inputText',
        value: model.fetchRef('default', `AddQueryModal`),
    }, {
        label: '描述', // description
        type: 'inputText',
        value: model.fetchRef('description', `AddQueryModal`),
    }, {
        label: 'enum', // enum
        type: 'inputText',
        value: model.fetchRef('enum', `AddQueryModal`),
    }];


    /*
    "type": "string",
    "name": "email",
    "in": "query",
    "default": "aaa@bbb.ccc",
    "description": "用戶帳號"

    "type": "string",
    "format": "date",
    "name": "endDate",
    "in": "query"

    "type": "string",
    "name": "orderBy",
    "in": "query",
    "default": "asc",
    "enum": [
      "asc",
      "desc"
    ],
    "description": "排序"
    */



    return (
        <FormModal modalRef={apiManageModel.reactive('addQueryModalRef', 'EditTagModal_ref')}
            title="新增URL Query參數" formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="AddQueryModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddQuery')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddQuery')}>{t('confirm')}</Button>
                </FooterArea>
            }
        ></FormModal>
    )
}