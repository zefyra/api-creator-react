/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import FormModal, { FooterArea } from 'component/FormModal'
import TextArea from 'component/TextArea';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as SensorAlertSvg } from 'assets/svg/br-sensor-alert.svg'

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

    padding-right: 1rem;
`

export default function AddBodyModal({ control, apiManageModel, model }) {

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
        label: 'rootType',
        type: 'inputText',
        value: model.fetchRef('rootType', `AddBodyModal`),
    }, {
        label: 'schema',
        type: 'textArea',
        width: '445px',
        height: '250px',
        // value: schema,
        // onUpdate: updateSchema,
        value: model.fetchRef('schema', 'AddBodyModal'),
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

    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [jsonValid, setJsonValid] = useState(false);

    const [sensorAlertShow, setSensorAlertShow] = useState(false);
    const [converBtnShow, setConverBtnShow] = useState(false);

    useEffect(function () {
        setSensorAlertShow(!jsonValid);
        setConverBtnShow(jsonValid);
    }, [jsonValid]);

    const [json, setJson] = useState(model.getState('gqlJsonSrc'));
    const actJson = model.reactive('gqlJsonSrc', 'AddBodyModal_sensor', setJson);

    const debounce = function (callback) { // 防抖
        clearTimeout(debounceTimeout); // 每次都清掉舊的timeout
        setDebounceTimeout(null);

        // 再創建一個新的timeout，就能確保第一次呼叫後的interval時間內，不會再次呼叫該函式
        setDebounceTimeout(setTimeout(callback, 1500));
    }


    useEffect(function () {
        // control.onGqlJsonSrcUpdate(json);

        // setSensorAlertShow();

        console.log('json sensor')

        debounce(function () {

            console.log('parse json');

            let jsonObj;
            let jsonValid = false;
            try {
                jsonObj = JSON.parse(json)
                jsonValid = true;
            } catch (e) {
                // 代表json parse失敗
                jsonValid = false;
            }

            console.log('jsonValid', jsonValid)

            setJsonValid(jsonValid);
        });
    }, [json]);

    const handleConvertJson = () => () => {
        control.onGqlJsonSrcUpdate(json);
    }

    return (
        <FormModal modalRef={apiManageModel.reactive('addBodyModalRef', 'AddTagModal_ref')}
            title="新增Body" formItemList={formItemList}
            modalHeight={620}
            modalWidth={900}
            srcKey="AddApiModal"
            formWidth="580px"
            footerSlot={
                <FooterArea>
                    <Button type="fill" onClick={control.bindAct('onCancelAddBody')}>{t('cancel')}</Button>
                    <div style={{ width: '5rem' }}></div>
                    <Button type="fill" onClick={control.bindAct('onConfirmAddBody')}>{t('confirm')}</Button>
                </FooterArea>
            }
            asideSlot={
                <AsideJsonInputStyled>
                    <div className="aside-title-row">
                        <div className="aside-title">
                            JSON
                        </div>
                        <SensorAlertSvg style={{
                            display: sensorAlertShow ? 'block' : 'none',
                        }} className="icon" fill="#ec564e" />
                        {/* #a1a1a1 */}
                        <Button type="fill" show={converBtnShow} pattern="small"
                            importStyle={{
                                marginTop: '0px', marginRight: '0px',
                                marginBottom: '0px', marginLeft: '0', paddingH: '0.25rem',
                                height: '26px', fixHeight: '26px'
                            }}
                            onClick={handleConvertJson()}>
                            Add TypeDef
                        </Button>
                    </div>
                    <TextArea width="300px" height="300px" value={model.fetchRef('gqlJsonSrc', 'AddBodyModal')}
                        srcKey="AddBodyModal"></TextArea>
                    {/* onUpdate={control.bindAct('onGqlJsonSrcUpdate')} */}
                </AsideJsonInputStyled>
            }
            itemLabelWidth="6rem"
        ></FormModal>
    )
}