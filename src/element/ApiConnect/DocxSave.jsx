/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import { useTranslation } from 'react-i18next';

import { ReactComponent as FormSvg } from "assets/svg/form.svg"

const IconStyled = styled.div`
`

export default function DocxSave({ apiManageModel, docxControl }) {

    return (
        <Button type="fill" pattern="small" importStyle={{ marginTop: '0', marginBottom: '0' }}
            onClick={docxControl.bindAct('onClickSave')}>
            <FormSvg className="icon" fill="#4c5e5a" />
        </Button>
    );
}