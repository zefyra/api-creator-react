/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import { useTranslation } from 'react-i18next';


export default function ApiSettingModal({ control, apiManageModel, model }) {
    // model: <ApiSettingModel>

    const { t } = useTranslation('apiConnect', { keyPrefix: 'apiManage' })

    let formItemList = [{
        label: 'API路由',
        // type: 'text',
        // value: model.fetchRef('apiRoute', `ApiSettingModal`),
        type: 'inputText',
        value: model.fetchRef('apiRouteVar', `ApiSettingModal`),
    }, {
        label: 'API類型',
        // type: 'text',
        // value: model.fetchRef('apiType', `ApiSettingModal`),
        type: 'inputText',
        value: model.fetchRef('apiTypeVar', `ApiSettingModal`),
    }, {
        label: 'API名稱',
        type: 'inputText',
        value: model.fetchRef('summary', `ApiSettingModal`),
    }, {
        label: '安全欄位key',
        type: 'select',
        optionList: model.fetchRef('securityKeyOptionList', `ApiSettingModal`),
        value: model.fetchRef('securityKey', `ApiSettingModal`),
        // loading: model.fetchRef('schemaFieldOptionListLoading', `CreateTagCategoryModal_schemaFieldOptionListLoading`),
        // placeholder: t('plsSelectField'),
        // hide: importSchemaLockRef,
    }];

    return (
        <FormModal modalRef={apiManageModel.reactive('apiSettingModalRef', 'ApiSettingModal_ref')}
            title="API設定" formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="AddApiModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelApiSetting')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onSaveApiSetting')}>{t('save')}</Button>
                </FooterArea>
            }
        ></FormModal>
    )
}