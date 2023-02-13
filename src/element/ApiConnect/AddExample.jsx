/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import Select from 'component/Select';
import TextArea from 'component/TextArea';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BodyModalJsonAside from './BodyModalJsonAside';
// import { format as formatJSON } from "json-string-formatter";

const AsideJsonInputStyled = styled.div`
    display: flex;
    flex-direction: column;

    & .aside-title-row {
        display: flex;
        flex-direction: row;

        & .aside-title {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 0.5rem;
            margin-right: 0.5rem;
        }
        & .icon {
            width: 18px;
            height: 18px;

            transform: translateY(3px);
        }
    }

    & .aside-select-row {
        display: flex;
        flex-direction: row;

        margin-bottom: 1.5rem;
    }

    padding-right: 1rem;
`

export default function AddExampleModal({ control, apiManageModel, model }) {

    const { t } = useTranslation('apiConnect', { keyPrefix: 'apiManage' })

    let formItemList = [{
        label: 'API路由',
        type: 'text',
        // value: model.getState('apiRoute'),
        value: model.fetchRef('apiRoute', `AddExampleModal`),
    }, {
        label: 'API類型',
        type: 'text',
        // value: model.getState('apiType'),
        value: model.fetchRef('apiType', `AddExampleModal`),
    }, {
        label: 'name',
        type: 'inputText',
        value: model.fetchRef('name', `AddExampleModal`),
    }, {
        label: 'schema',
        type: 'textArea',
        width: '445px',
        height: '250px',
        // value: schema,
        // onUpdate: updateSchema,
        value: model.fetchRef('schema', 'AddExampleModal'),
    }];

    // const AsideComp = (
    //     <AsideJsonInputStyled>
    //         <div className="aside-title-row">
    //             <div className="aside-title">
    //                 JSON
    //             </div>
    //             {/* <SensorAlertSvg style={{
    //                 display: sensorAlertShow ? 'block' : 'none',
    //             }} className="icon" fill="#ec564e" />
    //             <Button type="fill" show={converBtnShow} pattern="small"
    //                 importStyle={{
    //                     marginTop: '0px', marginRight: '0px',
    //                     marginBottom: '0px', marginLeft: '0', paddingH: '0.25rem',
    //                     height: '26px', fixHeight: '26px'
    //                 }}
    //                 onClick={handleConvertJson()}>
    //                 Add TypeDef
    //             </Button> */}
    //         </div>
    //         {/* <TextArea width="300px" height="300px" value="uuuuuuuuuu"
    //             srcKey="AddBodyModal"></TextArea> */}
    //         {/* model.fetchRef('gqlJsonSrc', 'AddBodyModal') */}
    //     </AsideJsonInputStyled>
    // )

    // const [exampleKey, setExampleKey] = useState('');
    // const [exampleOptionList, setExampleOptionList] = useState([]);

    // const actExampleChange = function (val) {
    //     console.log('actExampleChange', val)
    //     // setExampleKey(val);
    // }

    // const [exampleJson, setExampleJson] = useState('');

    // const actExampleJson = model.reactive('exampleSchemaJson', 'adfaeaefefawef', function (jsonStr) {
    //     const fJson = formatJSON(jsonStr);
    //     console.log('fJson', fJson)
    //     setExampleJson(jsonStr);
    // });

    return (
        <FormModal modalRef={apiManageModel.reactive('addExampleModalRef', 'AddExampleModal_ref')}
            title="新增example" formItemList={formItemList}
            modalHeight={620}
            modalWidth={900}
            srcKey="AddExampleModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddExample')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddExample')}>{t('confirm')}</Button>
                </FooterArea>
            }
            asideSlot={
                <AsideJsonInputStyled>
                    <div className="aside-title-row">
                        <div className="aside-title">
                            範例
                        </div>
                    </div>
                    <div className="aside-select-row">
                        <Select
                            value={model.fetchRef('exampleShowKey', `AddExampleModal`)}
                            optionList={model.fetchRef('exampleOptionList', `AddExampleModal`)}
                            srcKey="AddExampleShowSelect"
                            onUpdate={control.bindAct('onChangeShowExample')}></Select>
                    </div>
                    <div>
                        {/* {exampleJson} */}
                        <TextArea width="300px" height="300px" value={model.fetchRef('exampleSchemaJson', 'AddExampleModal')}
                            srcKey="AddExampleModal" disabled={true}></TextArea>
                    </div>
                </AsideJsonInputStyled>
            }
            itemLabelWidth="6rem"
        ></FormModal>
    )
}