/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import { useTranslation } from 'react-i18next';


export default function AddApiDocModal({ control, apiManageModel, model }) {

    const { t } = useTranslation('apiConnect', { keyPrefix: 'apiManage' })

    let formItemList = [{
        label: 'API文件key',
        type: 'inputText',
        value: model.fetchRef('fileName', `AddApiDocModal`),
    }, {
        label: '檔案格式',
        type: 'select',
        optionList: model.fetchRef('docTypeOptionList', `AddApiDocModal`),
        value: model.fetchRef('docType', `AddApiDocModal`),
    }, {
        label: '文件標題',
        type: 'inputText',
        value: model.fetchRef('title', `AddApiDocModal`),
    }, {
        label: 'host/url',
        type: 'inputText',
        value: model.fetchRef('host', `AddApiDocModal`),
    }];

    return (
        <FormModal modalRef={apiManageModel.reactive('addApiDocModalRef', 'EditTagModal_ref')}
            title="新增API文件" formItemList={formItemList}
            modalHeight={620}
            modalWidth={800}
            srcKey="AddApiModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddApiDoc')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddApiDoc')}>{t('confirm')}</Button>
                </FooterArea>
            }
        ></FormModal>
    )
}