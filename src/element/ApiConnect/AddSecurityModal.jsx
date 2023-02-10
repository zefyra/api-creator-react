/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import { useTranslation } from 'react-i18next';


export default function AddSecurityModal({ control, apiManageModel, model }) {

    const { t } = useTranslation('apiConnect', { keyPrefix: 'apiManage' })

    let formItemList = [{
        label: '安全欄位key',
        type: 'inputText',
        value: model.fetchRef('securityKey', `AddSecurityModal`),
    }, {
        label: '資料欄位key',
        type: 'inputText',
        value: model.fetchRef('key', `AddSecurityModal`),
    }, {
        label: '類型',
        type: 'select',
        optionList: model.fetchRef('securityTypeOptionList', `AddSecurityModal`),
        value: model.fetchRef('type', `AddSecurityModal`),
        // loading: model.fetchRef('schemaFieldOptionListLoading', `CreateTagCategoryModal_schemaFieldOptionListLoading`),
        // placeholder: t('plsSelectField'),
        // hide: importSchemaLockRef,
    }, {
        label: '欄位位置',
        type: 'select',
        optionList: model.fetchRef('securityInOptionList', `AddSecurityModal`),
        // `AddSecurityModal_typeOptionList`
        value: model.fetchRef('in', `AddSecurityModal`),
    }, {
        label: '描述',
        type: 'inputText',
        value: model.fetchRef('description', `AddSecurityModal`),
    }];

    return (
        <FormModal modalRef={apiManageModel.reactive('addSecurityRef', 'AddSecurityModal_ref')}
            title="增加安全設定" formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="AddApiModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddSecurity')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddSecurity')}>{t('confirm')}</Button>
                </FooterArea>
            }
        ></FormModal>
    )
}