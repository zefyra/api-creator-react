/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import LayoutMixin from 'util/LayoutMixin'

import ThemeMixin, { fetchTheme } from 'util/ThemeMixin'
import { apiDoc as apiDocThemeObject } from 'theme/reas'

import { PageTitle } from "module/layout";
import { useTranslation } from "react-i18next";

import React, { useState, useEffect, useRef } from 'react';

import { useUrlQuery } from "util/UrlQuery";
// import StateModel from 'model/StateModel';
import ApiConnectModel, { ApiComposition } from 'fragment/ApiConnect';
import FetchControl from 'control/FetchControl';
import Select from 'component/Select'
import SelectControl from 'control/SelectControl'

import { ReactComponent as AngleDownSvg } from 'assets/svg/sr-angle-down.svg'
import { ReactComponent as AngleUpSvg } from 'assets/svg/sr-angle-up.svg'
import { ReactComponent as TrashSvg } from "assets/svg/br-trash.svg"
import { ReactComponent as MinusSvg } from "assets/svg/br-minus.svg"
import { ReactComponent as PlusSvg } from "assets/svg/br-plus.svg"
import { ReactComponent as StarSvg } from "assets/svg/star-sign.svg"
import { ReactComponent as FolderDownloadSvg } from "assets/svg/folder-download.svg"
import { ReactComponent as FolderUploadSvg } from "assets/svg/folder-upload.svg"
import { ReactComponent as BrowserSvg } from "assets/svg/br-browser.svg"
import { ReactComponent as SquareRootSvg } from "assets/svg/sr-square-root.svg"

import Button from 'component/Button'
import { ApiManageControl } from 'flow/apiManage'

import AddTagModal from 'element/ApiConnect/AddTagModal'
import AddApiModal from 'element/ApiConnect/AddApiModal'
import AddBodyModal from 'element/ApiConnect/AddBodyModal'
import EditApiModal from 'element/ApiConnect/EditTagModal'

import ApiManageModel, { AddApiDocModel, AddApiModel, AddBodyModel, AddQueryModel, AddResModel, AddTagModel, EditAttrModel, EditTagModel } from 'fragment/ApiManage'

import { ReactComponent as DocumentSvg } from 'assets/svg/document.svg'
import AddResponseModal from 'element/ApiConnect/AddResponseModal'
import EditAttrModal from 'element/ApiConnect/EditAttrModal'
import AddQueryModal from 'element/ApiConnect/AddQueryModal'

import AttrSrc from 'enum/apiConnect/AttrSrc'
import DocxSave from 'element/ApiConnect/DocxSave'
import DocxControl from 'flow/docxControl'
import AddApiDocModal from 'element/ApiConnect/AddApiDocModal'
import LocalAccessor from 'localAccessor'

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextArea from 'component/TextArea'
import { ApiJsonControl } from 'flow/apiJsonControl'
import ApiJsonModel from 'fragment/ApiJson'

const apiDocTheme = new ThemeMixin(apiDocThemeObject);

const PRINT_LOG = true;

const quickPanelWidth = '320px';
const quickPanelRight = '35px';


const quickPanelHiddenMaxWidth = '1280px';



const TagBlockBoardStyled = styled.div`
display: flex;
flex-direction: column;

/* margin-top: 1.5rem; */
margin-left: 1.5rem;
margin-right: 1.5rem;
margin-bottom: 1.5rem;

// width: calc(100% - 8rem)
/* width: ${() => LayoutMixin.getPageBoardWidth()}; */
/* 'calc(100% - 4rem)' */

background-color: ${fetchTheme('board', '#cba165')};
border-radius: ${fetchTheme('boardRadius', '5px')};

padding-bottom: 1.5rem;


    & .plus-icon {
        width: 18px;
        height: 18px;
    }

    & .trash-icon {
        width: 18px;
        height: 18px;
    }
    
    & .tag-block-title-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        font-size: 1.8rem;

        margin: 0.75rem 1.75rem 0 1.75rem;

        color: ${fetchTheme('groupTitle', '#1c7575')};

        & .tag-block-title-left {
            display: flex;
            flex-direction: row;
            justify-content: space-between;


        }
    }
    /* & .tag-block-title-hr{

    } */

    & .tag-title-hr {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;

        margin-top: 0.5rem;
        & .hr-line {
            width: 95%;
            border-bottom: 1px solid #a7a7a7;
        }
    }

    & .row {
        margin: 0.65rem 1.75rem 0 1.75rem;
    }
    & .attr-row {
        margin: 0 1.75rem 0 1.75rem;
    }
    /* & .h2-row {
        margin: 0.65rem 1.75rem 0 1.75rem;
    } */


    & .row.api-title-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        
        font-size: 1.18rem;
        color: ${fetchTheme('apiTitle', '#1c7575')};

        cursor: default;
    }

    & .row.api-path-row {
        & .api-path-block {
            /* margin: 0.5rem; */
            background-color: ${fetchTheme('apiPathBlock', '#a7a7a7')};
            border-radius: 5px;

            padding: 0.35rem 0.5rem;

            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            color: ${fetchTheme('apiPath', '1f4b4b')};

            cursor: pointer;

            & .api-type-container {

                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;

                width: 5.6rem;

                & .api-type {
                    padding: 0.25rem 0rem;
                    /* background-color: ${fetchTheme('apiTypeBlock', '#e8e8e8')}; */
                    background-color: #e8e8e8; // 預設的顏色，不會顯示

                    border-radius: 5px;

                    /* margin-right: 0.85rem; */
                    font-size: 1.09rem;

                    width: 5rem;
                    display: flex;
                    justify-content: center;

                    &.get {
                        color: ${fetchTheme('apiTypeGet', '#3c3c3c')};
                        background-color: ${fetchTheme('apiTypeBlockGet', '#e8e8e8')};
                    }
                    &.put {
                        color: ${fetchTheme('apiTypePut', '#3c3c3c')};
                        background-color: ${fetchTheme('apiTypeBlockPut', '#e8e8e8')};
                    }
                    &.post {
                        color: ${fetchTheme('apiTypePost', '#3c3c3c')};
                        background-color: ${fetchTheme('apiTypeBlockPost', '#e8e8e8')};
                    }
                    &.delete {
                        color: ${fetchTheme('apiTypeDeletet', '#3c3c3c')};
                        background-color: ${fetchTheme('apiTypeBlockDelete', '#e8e8e8')};
                    }
                }
            }

            & .api-path {
                font-size: 1.15rem;
            }
        }

        /* cursor: pointer; */
    }

    & .row.api-description-row {
        margin-left: 2.3rem;

        /* color: #636363; */
        color: ${fetchTheme('apiDescription', '#636363')};
    }

    & .request-title-row {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        
        padding-left: 0.75rem;

        /* padding: 0.25rem 1.5rem; */

        font-size: 1.25rem;

        display: flex;
        flex-direction: row;

        justify-content: space-between;
        & .title-block {
            display: flex;
            flex-direction: row;
            & .title {
                cursor: auto;

                font-weight: 500;

                color: ${fetchTheme('requestTitle', '#9f9f9f')};
            }
        }

        & .content-type-block {
            display: flex;
            flex-direction: row;

            font-size: 0.9rem;
            & .title {
                display: flex;
                flex-direction: row;
                align-items: center;

                margin-right: 2rem;

                color: ${fetchTheme('requestTitle', '#9f9f9f')};
            }
            & .content-type {
                display: flex;
                flex-direction: row;
                align-items: center;

                background-color: ${fetchTheme('contentTypeBlock', '#a7a7a7')};
                border-radius: 5px;

                padding: 0.25rem 1.5rem;

                color: ${fetchTheme('contentType', '#a7a7a7')};
            }
        }
    }

    & .param-title-row {
        /* margin-top: 0.5rem; */
        /* background-color: #a7a7a7; */
        color: ${fetchTheme('paramFormTitle', '#a7a7a7')};
        background-color: ${fetchTheme('paramFormTitleBlock', '#a7a7a7')};

        padding: 0.25rem 1.5rem;

        font-size: 1.25rem;
        font-weight: 500;

        display: flex;
        flex-direction: row;

        & .title {
            /* cursor: auto; */
        }

        cursor: pointer;
    }

    & .api-attribute-row {
        background-color: ${fetchTheme('attributeRow', '#d3d3d3')};

        display: flex;
        flex-direction: column;

        & .parameter-row {
            display: flex;
            flex-direction: row;

            border-bottom: 1px solid ${fetchTheme('attributeRowHr', '#9b9b9b')};

            color: ${fetchTheme('attributeText', '#5f5f5f')};

            height: 48px;

            &.sub-parameter{
                cursor: pointer;
            }

            &.tail {
                border-bottom: none;
            }

            & .parameter-title-col {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;

                width: 10rem;
                word-wrap: 'break-word';

                & .title {
                    margin: 0rem 0rem 0 1.5rem;
                    font-size: 1.1rem;
                    cursor: auto;
                }

                & .layer-icon-block {

                    margin-left: 12px;
                    & .layer-icon {
                        width: 12px;
                        height: 12px;
                    }
                }
                
                & .object-title {
                    margin: 0.65rem 0.65rem 0.65rem 12px;
                    font-size: 1.1rem;
                    cursor: auto;
                }
                /* & .required {
                    display: flex;

                    margin: 0 1rem 0 1.5rem;
                    font-size: 0.9rem;
                    color: ${fetchTheme('attributeReuired', '#5f5f5f')};
                    
                    cursor: auto;
                } */
                & .required-icon {
                    width: 12px;
                    height: 12px;

                    margin-left: 0.05rem;
                    transform: translateY(-6px);
                }
            }

            & .parameter-attribute-col {
                display: flex;
                flex-direction: row;

                height: inherit;

                align-items: center;

                margin-left: 15px;

                & .attribute-row {
                    display: flex;
                    flex-direction: row;

                    flex-grow: 1;

                    transform: translateY(-1px);

                    /* margin: 0.5rem 1.5rem; */

                    & .attr-type {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;

                        /* margin-right: 1.5rem; */

                        width: 6rem;
                        & .text {
                            cursor: auto;
                        }
                    }

                    & .attr-default {
                        background-color: ${fetchTheme('attributeQuoteBlock', '#9f9f9f')};
                        color: ${fetchTheme('attributeQuote', '#9f9f9f')};

                        padding: 0.15rem 1.2rem;
                        border-radius: 3px;

                        line-height: 1.5rem;

                        max-width: 6.5rem;
                        max-height: 1.5rem;
                        overflow: hidden;
                        & .text {
                            cursor: auto;
                        }

                        &.input-select {
                            padding: 0.15rem 3rem 0.15rem 1.2rem;
                            cursor: pointer;

                            position: relative;

                            & .arrow-icon {
                                width: 18px;
                                height: 18px;

                                position: absolute;
                                top: 7px;
                                right: 7px;

                                &.angle-up {
                                    top: 5px;
                                }
                            }
                        }
                    }
                }
                & .description-row {
                    display: flex;
                    flex-direction: row;

                    margin-left: 1.5rem;
                }
                & .attribute-control-row {
                    display: flex;
                    flex-direction: row;

                    margin-left: 1.5rem;
                }
            }
        }
    }


`

const AttributeDefaultBlock = ({ attributeData }) => {

    // const [valueState, setValueState] = useState('');
    let valueState = '';
    const getDefault = () => {
        // { attributeData.default !== undefined ? `${attributeData.default}` : '' }

        if (attributeData.default === undefined) {
            return '';
        }
        if (attributeData.type === 'string') {
            if (attributeData.default === '') {
                return '';
            }
        }

        return `${attributeData.default}`;
    }

    const checkDefaultExist = () => {

        if (attributeData.default === undefined) {
            return false;
        }
        if (attributeData.type === 'string') {
            if (attributeData.default === '') {
                return false;
            }
        }

        return `${attributeData.default}`;
    }

    valueState = checkDefaultExist() ? 'default' : '';

    if (attributeData.enum) {

        const [enumLabel, setEnumLabel] = useState(getDefault());

        const enumSelectControl = new SelectControl(useRef({
            selectedLabel: getDefault(),
            dropdownOpen: false,
        }));
        enumSelectControl.getStateModel().registSetter('selectedLabel', 'enumLabel', setEnumLabel);

        const enumOptionList = attributeData.enum.map((value) => {
            return {
                value,
                label: value,
            };
        });

        // const onEnumSelectUpdate = () => val => {
        //     // enumSelectControl.bindAct('onSelectChanged')
        //     console.log(`onEnumSelectUpdate`, val)
        // }
        // onUpdate={onEnumSelectUpdate()}

        //     let arrowIcon;
        // if (dropdownOpen) {
        //     arrowIcon = <AngleUpSvg className="arrow-icon" fill={selectTheme.getTheme('arrowIcon', '#a1a1a1')} />
        // } else {
        //     arrowIcon = <AngleDownSvg className="arrow-icon" fill={selectTheme.getTheme('arrowIcon', '#a1a1a1')} />
        // }

        const [dropdownOpen, setDropdownOpen] = useState(false);
        // enumSelectControl.getStateModel().registSetter('dropdownOpen', 'enumLabel', setDropdownOpen);
        const actDropdownOpen = enumSelectControl.getStateModel().reactive('dropdownOpen', 'enumLabel', setDropdownOpen)

        let arrowIcon;
        if (dropdownOpen) {
            arrowIcon = <AngleUpSvg className="arrow-icon angle-up" fill={apiDocTheme.getTheme('inputSelectArrowIcon', '#a1a1a1')} />
        } else {
            arrowIcon = <AngleDownSvg className="arrow-icon" fill={apiDocTheme.getTheme('inputSelectArrowIcon', '#a1a1a1')} />
        }

        //         useEffect(function () {
        // console.log('cccdropdownOpen', dropdownOpen)
        //         }, [dropdownOpen]);

        return (
            <Select type="slot" optionList={enumOptionList} control={enumSelectControl}>
                <div className="attr-default input-select" onClick={enumSelectControl.bindAct('actDropdown')}>
                    {enumLabel}
                    {arrowIcon}
                    {/* <AngleUpSvg className="arrow-icon"
                        fill={apiDocTheme.getTheme('inputSelectArrowIcon', '#a1a1a1')} /> */}
                </div>
            </Select>
        )
    }



    return (
        (
            <div>
                <div className="attr-default" style={{
                    display: valueState === 'default' ? 'block' : 'none',
                }}>
                    {getDefault()}
                </div>
            </div>
        )
    );
}

// Object的折疊
const ApiAttributeObjectRow = ({ fetchControl, type = 'object', apiData, attributeData, isTail, layer, show, attrSrc }) => {

    let indent = layer - 1;

    const [subShow, setSubShow] = useState(false);

    // useEffect(function () {
    //     setSubShow(false);
    // }, [show]);

    if (!attributeData.attributes) {
        console.error(`attributes not exist`, attributeData);
        return (
            (<div>attributes not exist</div>)
        );
    }
    let subAttributeList = attributeData.attributes;

    let subAttributeListDom = subAttributeList.map((subAttribute, index) => {
        return (
            (
                <ApiAttributeRow key={`sub_ApiAttributeRow_${index}`}
                    fetchControl={fetchControl}
                    apiData={apiData}
                    attributeData={subAttribute} layer={layer + 1}
                    show={subShow} attrSrc={attrSrc}></ApiAttributeRow>
            )
        )
    });

    const onSubParameterClick = () => () => {
        if (PRINT_LOG) {
            if (apiData) {
                console.log(`[${apiData.apiType}] ${apiData.path} attributeData`, attributeData)
            } else {
                console.error(`attributeData not have apiData`, attributeData)
            }
        }
        setSubShow(!subShow);
    }

    const getAttributeType = () => {

        if (attributeData.type === 'array') {
            if (attributeData.items) {
                if (attributeData.items.type === 'object') {
                    return 'object-array';
                }
            }
        }

        return attributeData.type || '';
    }

    let layerIconDom = subShow ?
        (<MinusSvg className="layer-icon" fill="#91c8c8" />) :
        (<PlusSvg className="layer-icon" fill="#91c8c8" />)

    return (
        <div className={`${indent === 0 ? 'attr-row' : ''} api-attribute-row`} style={{
            display: show ? 'flex' : 'none',
        }}>
            <div className={`parameter-row sub-parameter ${(isTail && !subShow) ? 'tail' : ''}`} onClick={onSubParameterClick()}>
                <div className="parameter-title-col" style={{
                    marginLeft: `${indent * 25}px`,
                }}>
                    <div className="layer-icon-block">
                        {layerIconDom}
                        {/* {`${subShow}`} */}
                        {/* <MinusSvg className="layer-icon" fill="#91c8c8" /> */}
                    </div>
                    <div className="object-title">
                        {attributeData.name || ''}
                    </div>
                </div>
                <div className="parameter-attribute-col">
                    <div className="attribute-row">
                        <div className="attr-type">
                            <div className="text">
                                {getAttributeType()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {subAttributeListDom}
        </div>
    )
}


const ApiAttributeRow = ({ fetchControl, apiData, attributeData, isTail = false, layer = 1, show = true, attrSrc }) => {
    // apiData.apiData.attributes

    let indent = layer - 1;

    if (layer > 5) {
        console.error(`out of max layer 5`);
        return (
            <div>out of max layer 5</div>
        )
    }

    // console.log('attributeData', attributeData)

    if (attributeData.type === 'object' ||
        attributeData.type === 'array') {
        // 使用物件模式render，全部參數都直接繼承
        // type={'object'}
        return (
            <ApiAttributeObjectRow apiData={apiData} attributeData={attributeData} isTail={isTail} layer={layer}
                show={show} fetchControl={fetchControl} attrSrc={attrSrc}></ApiAttributeObjectRow>
        );
    }


    // 用來取得attributeData
    // const onAttributeClick = () => () => {
    //     console.log('attr src', attrSrc)
    //     // if (PRINT_LOG) {
    //     //     if (apiData) {
    //     //         // console.log(`attributeData`, attributeData);
    //     //         console.log(`[${apiData.apiType}] ${apiData.path} attributeData`, attributeData)
    //     //     } else {
    //     //         console.error(`attributeData not have apiData bbb`, attributeData)
    //     //     }
    //     // }
    // }


    let requiredTagDom;
    if (attributeData.attrRequired) {
        requiredTagDom = (
            <StarSvg className="required-icon" fill="#91c8c8" />
        )
    }


    return (
        <div className={`${indent === 0 ? 'attr-row' : ''} api-attribute-row`} style={{
            display: show ? 'flex' : 'none',
        }}>
            {/* onClick={onAttributeClick()} Debug用，用來看attributeData */}
            <div className={`parameter-row ${isTail ? 'tail' : ''}`}>
                <div className="parameter-title-col" style={{
                    marginLeft: `${indent * 25}px`,
                }}>
                    <div className="title">
                        {/* activated */}
                        {attributeData.name || ''}
                    </div>
                    {requiredTagDom}
                    {/* <div className="required">
                        required
                    </div> */}
                </div>
                <div className="parameter-attribute-col">
                    <div className="attribute-row">
                        <div className="attr-type">
                            {/* boolean */}
                            {attributeData.type || ''}
                        </div>
                        <AttributeDefaultBlock attributeData={attributeData}></AttributeDefaultBlock>
                        {/* <div className="attr-default" style={{
                            display: checkDefaultExist() ? 'block' : 'none',
                        }}>
                            {getDefault()}
                        </div> */}
                    </div>
                    <div className="description-row">
                        {/* 帳號是否已激活 */}
                        {attributeData.description || ''}
                    </div>
                    <div className="attribute-control-row">
                        <Button type="icon" onClick={fetchControl('apiManage').bindAct('onClickEditAttr', apiData, attributeData, attrSrc)}
                            importStyle={{ margin: '0 0 0 15px' }}>
                            <DocumentSvg className="icon" fill="#FFFFFF" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
    // return (
    //     <div className="attr-row api-attribute-row">
    //         <div className="parameter-row tail">
    //             <div className="parameter-title-col">
    //                 <div className="title">
    //                     activated
    //                 </div>
    //                 <div className={`required ${true ? 'show' : ''}`}>
    //                     required
    //                 </div>
    //             </div>
    //             <div className="parameter-attribute-col">
    //                 <div className="attribute-row">
    //                     <div className="attr-type">
    //                         boolean
    //                     </div>
    //                     <div className="attr-default">
    //                         {`${true}`}
    //                     </div>
    //                 </div>
    //                 <div className="description-row">
    //                     帳號是否已激活
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
}


const AttributesForm = ({ fetchControl, apiData, title, attributes, show = true, attrSrc }) => {
    // attributes = apiComp.getApiDataField('requestAttributes')


    // console.log(`AttributesForm attrSrc`, attrSrc)

    const [collapse, setCollapse] = useState(true);

    useEffect(function () {
        setCollapse(true);
        // setCollapse(!show);
    }, [show]);

    let reqAttrListDom = [];
    if (attributes) {
        reqAttrListDom = attributes.map((attributeData, index, arr) => {
            return (
                (
                    <ApiAttributeRow key={`ApiAttributeRow_${index}`}
                        fetchControl={fetchControl}
                        apiData={apiData}
                        attributeData={attributeData} isTail={index === (arr.length - 1)}
                        show={!collapse} attrSrc={attrSrc}></ApiAttributeRow>
                )
            )
        });
    }

    // ps.最外面那層div是因為組件的關係，才必須多包一層

    return (
        <div>
            <div className="attr-row param-title-row" style={{
                display: show ? 'flex' : 'none',
            }} onClick={() => setCollapse(!collapse)}>
                <div className="title">
                    {title}
                    {/* {`show: ${show}`} */}
                </div>
            </div>
            {reqAttrListDom}
        </div>
    );
}


const ApiBlock = ({ fetchControl, apiData }) => {

    const apiComp = new ApiComposition(apiData);

    // console.log(`[${apiData.apiType}] ${apiData.path} apiData`, apiData)

    // console.log(`[${apiData.apiType}] ${apiData.path} resAttr`, resAttr);

    // 用來取得API的資料用的
    // const onClickApiTitle = () => () => {
    //     if (PRINT_LOG) {
    //         console.log(`[${apiData.apiType}] ${apiData.path} apiData`, apiData)
    //     }
    // }

    const [apiShow, setApiShow] = useState(false);

    const getApiShowStyle = function (showDisplay = 'block') {
        return {
            display: apiShow ? showDisplay : 'none',
        };
    };

    const onApiPathClick = () => e => {
        e.stopPropagation();
        setApiShow(!apiShow);
    }

    // const responses = apiData.responses || {};
    // const responseList = Object.keys(responses).map((statusCode) => {
    //     let resObj = Object.assign({}, apiData.responses[statusCode]);
    //     resObj.status = statusCode; // 要將status代碼塞入，否則物件裡面沒有

    //     return resObj;
    // });


    const statusList = apiComp.getApiDataField('statusList');

    const resAttrFormListDom = statusList.map((status) => {
        const key = `[${apiData.apiType}]_${apiData.path}_res_${status}`;
        const resAttr = apiComp.getApiDataField('responseAttributes', status);

        return (
            <AttributesForm title={`BODY - ATTRIBUTES (${status})`} attributes={resAttr}
                apiData={apiData} show={apiShow && apiComp.checkApiDataField('responseAttributes', status)}
                key={key} fetchControl={fetchControl} attrSrc={AttrSrc.resBody(status)}></AttributesForm>
        );
    });

    return (<div className="api-list-col" id={`${apiData.apiType}_${apiData.path}`}>
        {/* <div className="api-layer-display">
        階層顯示BAR (有空再來做)
        {`3. 社群/3-06. 創建新文章/POST-/forum/sendCreateArticle`}
    </div> */}
        <div className="row api-title-row">
            {/* {`1-2.用ID取得子用戶(API名稱)`} */}
            {/* Debug用 onClick={onClickApiTitle()} */}
            <div>
                {apiComp.getApiDataField('apiTitle')}
            </div>
            {/* <Button type="fill" pattern="small" importStyle={{ marginTop: '0', marginBottom: '0' }}
                onClick={fetchControl('apiManage').bindAct('onClickAddApi', apiData)}>
                <PlusSvg className="plus-icon" fill="#0a2f25" />
            </Button> */}
        </div>
        <div className="row api-path-row">
            <div className="api-path-block" onClick={onApiPathClick()}>
                <div className="api-type-container">
                    <div className={`api-type ${apiComp.getApiDataField('apiType').toLowerCase()}`}>
                        {apiComp.getApiDataField('apiType').toUpperCase()}
                    </div>
                </div>
                <div className="api-path">
                    {apiComp.getApiDataField('path')}
                </div>
            </div>
        </div>
        <div className="row api-description-row" style={getApiShowStyle('block')}>
            {/* {`這個是1-2.API的詳細描述`} */}
            {/* {`${apiData.apiData.description}`} */}
            {apiComp.getApiDataField('apiDescription')}
        </div>
        <div className="attr-row request-title-row" style={getApiShowStyle('flex')}>
            <div className="title-block">
                <div className="title">
                    Request
                </div>
                <Button type="icon" onClick={fetchControl('apiManage').bindAct('onClickAddBody', apiData)}
                    importStyle={{ margin: '0 0 0 15px' }}>
                    <DocumentSvg className="icon" fill="#FFFFFF" />
                </Button>
                <Button type="icon" onClick={fetchControl('apiManage').bindAct('onClickAddQueryParam', apiData)}
                    importStyle={{ margin: '0 0 0 15px' }}>
                    <SquareRootSvg className="icon" fill="#FFFFFF" />
                </Button>
                {/* <Button type="fill" pattern="small" importStyle={{ marginLeft: '15px', marginTop: '0', marginBottom: '0', fixWidth: '65px' }}
                    onClick={fetchControl('apiManage').bindAct('onClickAddBody', apiData)}>
                    <PlusSvg className="plus-icon" fill="#0a2f25" />
                </Button> */}
            </div>
            <div className="content-type-block" style={{
                display: apiComp.checkApiDataField('consumesContentType') ? 'flex' : 'none',
            }}>
                <div className="title">
                    content type
                </div>
                <div className="content-type">
                    {apiComp.getApiDataField('consumesContentType')}
                </div>
            </div>
        </div>
        <AttributesForm title="HEADER - ATTRIBUTES" attributes={apiComp.getApiDataField('requestHeaderAttributes')}
            apiData={apiData} show={apiShow && apiComp.checkApiDataField('requestHeaderAttributes')}
            fetchControl={fetchControl}></AttributesForm>
        <AttributesForm title="URL - ATTRIBUTES" attributes={apiComp.getApiDataField('requestUrlAttributes')}
            apiData={apiData} show={apiShow && apiComp.checkApiDataField('requestUrlAttributes')}
            fetchControl={fetchControl} ></AttributesForm>
        <AttributesForm title="Query - ATTRIBUTES" attributes={apiComp.getApiDataField('requestQueryAttributes')}
            apiData={apiData} show={apiShow && apiComp.checkApiDataField('requestQueryAttributes')}
            fetchControl={fetchControl}></AttributesForm>
        <AttributesForm title="BODY - ATTRIBUTES" attributes={apiComp.getApiDataField('requestAttributes')}
            apiData={apiData} show={apiShow && apiComp.checkApiDataField('requestAttributes')}
            fetchControl={fetchControl} attrSrc={AttrSrc.reqBody}></AttributesForm>
        <div className="attr-row request-title-row" style={getApiShowStyle('flex')}>
            <div className="title-block">
                <div className="title">
                    Response
                </div>
                <Button type="icon" onClick={fetchControl('apiManage').bindAct('onClickAddRes', apiData)}
                    importStyle={{ margin: '0 0 0 15px' }}>
                    <DocumentSvg className="icon" fill="#FFFFFF" />
                </Button>
            </div>
            <div className="content-type-block" style={{
                display: apiComp.checkApiDataField('producesContentType') ? 'flex' : 'none',
            }}>
                <div className="title">
                    content type
                </div>
                <div className="content-type">
                    {apiComp.getApiDataField('producesContentType')}
                </div>
            </div>
        </div>
        {/* <AttributesForm title="BODY - ATTRIBUTES" attributes={resAttr}
            apiData={apiData} show={apiShow && apiComp.checkApiDataField('responseAttributes')}></AttributesForm> */}
        {resAttrFormListDom}
    </div >);
}


const TagHr = () => {
    return (
        <div className="tag-title-hr">
            <div className="hr-line">
            </div>
        </div >)
}


const TagBlock = ({ tagData, fetchControl, fetchModel }) => {
    /* tagData: {
        // Swagger預設----------------------------
        description: "Everything about your Pets"
        externalDocs: {description: 'Find out more', url: 'http://swagger.io'}
        name: "pet"
        // 內部系統用----------------------------
    } */
    const apiBlockList = tagData.apiList || [];

    let apiBlockListDom = [];
    if (apiBlockList.length !== 0) {
        apiBlockListDom = apiBlockList.map((apiBlockData, index) => {
            return (
                <ApiBlock key={`${tagData.name}_ApiBlock_${index}`}
                    apiData={apiBlockData} fetchControl={fetchControl}></ApiBlock>
            )
        });
    }

    const removeTagButton = fetchModel('apiDoc').pageUnitAuth('removeTagButton') ? (
        <Button type="fill" pattern="small" mode="danger" importStyle={{ marginTop: '0', marginBottom: '0', marginRight: '0' }}
            onClick={fetchControl('apiManage').bindAct('onClickRemoveTag', tagData.name)}>
            <TrashSvg className="trash-icon" fill="#e5d6d6"></TrashSvg>
        </Button>
    ) : null;

    return (
        <TagBlockBoardStyled theme={apiDocThemeObject} id={`tag_${tagData.name}`} className="tag-block-board">
            <div className="tag-block-title-row">
                <div className="tag-block-title-left">
                    {`${tagData.groupName ? (tagData.groupName + ' - ') : ''}${tagData.name}`}
                    <Button type="icon" onClick={fetchControl('apiManage').bindAct('onClickTagEdit', tagData)}>
                        <DocumentSvg className="icon" fill="#FFFFFF" />
                    </Button>
                </div>
                <div className="tag-block-title-right">
                    {removeTagButton}
                </div>
            </div>
            <TagHr></TagHr>
            {apiBlockListDom}
            <Button type="fill" pattern="small" importStyle={{ marginLeft: '30px', marginTop: '15px', marginBottom: '0', fixWidth: '65px' }}
                onClick={fetchControl('apiManage').bindAct('onClickAddApi', tagData)}>
                <PlusSvg className="plus-icon" fill="#0a2f25" />
            </Button>
        </TagBlockBoardStyled>
    )
}

const ApiDocumentStyled = styled.div`
display: flex;
flex-direction: column;

flex-grow: 1;

`

const ApiDocument = ({ fetchControl }) => { // , jsonPath

    const fc = new FetchControl(fetchControl);
    const fetchModel = fc.export('fetchModel');

    // const apiDocModel = new ApiConnectModel(useRef(null), { pageMode: mode });
    // const fc = new FetchControl(fetchControl);
    // fc.setupModel('apiDoc', apiDocModel); // 註冊進fetchControl體系，這樣底下就可以輕鬆存取
    const apiDocModel = fetchModel('apiDoc');

    // const apiDocModel = new ApiConnectModel(useRef(null), { pageMode: pageMode });
    // fc.setupModel('apiDoc', apiDocModel); // 註冊進fetchControl體系，這樣底下就可以輕鬆存取

    // useEffect(() => {
    //     // 使用js原生的fetch讀取public底下的json
    //     // fetch(jsonPath)
    //     //     .then(response => {
    //     //         if (!response.ok) {
    //     //             throw new Error("HTTP error " + response.status);
    //     //         }
    //     //         return response.json();
    //     //     })
    //     //     .then(json => {
    //     //         fetchModel('apiDoc').saveApiDoc(json);
    //     //     })
    //     //     .catch(function (error) {
    //     //         console.error(error);
    //     //         // this.dataError = true;
    //     //     })
    //     fetchControl('apiManage').fetchJson(jsonPath);
    // }, [jsonPath]);

    const [tagList, setTagList] = useState([]);
    apiDocModel.registSetter('tagList', 'ApiDocument', setTagList);

    const tagBlockListDom = tagList.map((tagData, index) => {
        return (
            <TagBlock key={`TagBlock_${index}`} fetchControl={fetchControl}
                fetchModel={fetchModel} tagData={tagData}></TagBlock>
        );
    });

    const { t: apiManageT } = useTranslation('apiConnect', { keyPrefix: 'apiManage' });

    let addTagButton = fetchModel('apiDoc').pageUnitAuth('addTagButton') ?
        (<Button type="fill" onClick={fetchControl('apiManage').bindAct('onClickAddTag')}
            importStyle={{ fixWidth: '120px', paddingH: '12px', marginLeft: '25px' }}>{apiManageT('addTag')}</Button>) : null;

    return (
        <ApiDocumentStyled>
            {/* <TagBlock></TagBlock> */}
            {tagBlockListDom}
            {addTagButton}
        </ApiDocumentStyled>
    );
}

const checkHalfShape = function (summary) {

    /*
    str="中文;；ａ"     
  alert(str.match(/[\u0000-\u00ff]/g))     //半形   
  alert(str.match(/[\u4e00-\u9fa5]/g))     //中文   
  alert(str.match(/[\uff00-\uffff]/g))     //全形   */

    // match會輸出一個陣列，把符合全形、或半形的字塞進每個陣列元素

    // let isHalfShape = false;

    const checkLen = 15;

    // 檢查前15個字元，只要超過5成是半形，就以半形計算字數
    let str = summary.slice(0, checkLen);

    const matchArr = str.match(/[\u0020-\u00ff]/g); //全形 (0020以前是控制字符，不能使用)

    if (!matchArr) {
        return false; // 代表全都是全形
    }

    // console.log(`${summary} matchArr: ${matchArr.length} ${(matchArr.length / summary.length).toFixed(2)}`, matchArr.length / summary.length >= 0.5)

    return matchArr.length / checkLen >= 0.5;
}


const QuickLinkGroup = ({ fetchControl, tagGroupData }) => {

    // console.log('tagGroupData', tagGroupData)

    const apiList = tagGroupData.apiList;
    // console.log('QuickLinkGroup apiList', apiList)

    const getApiLinkLabel = function (apiData) {
        const summary = apiData.apiData.summary;

        if (!summary) {
            return '';
        }
        if (checkHalfShape(summary)) {

            return summary.slice(0, 36); // 半形限30字元
        }

        return summary.slice(0, 15); // 全形限15字元
    }

    let apiLinkListDom = apiList.map((apiData, index) => {
        if (!apiData.apiData) {
            return (
                <div>no summary</div>
            );
        }
        const apiLinkId = `${apiData.apiType}_${apiData.path}`;

        // 未完成: 之後要想辦法用js加回去，會跟textarea搶focus
        // href={`#${apiLinkId}`} 

        const onAsideLinkClick = fetchControl('apiJson').bindAct('onAsideLinkClick', tagGroupData, apiData);

        const handleApiLinkClick = () => () => {
            const viewMode = fetchControl('apiJson').getViewMode();
            // console.log('viewMode', viewMode);
            if (viewMode === 'board') {
                const element = document.getElementById(apiLinkId);
                element.scrollIntoView();
            } else if (viewMode === 'json') {
                onAsideLinkClick();
            }
        }

        return (
            <a key={`apiLink_${index}`} onClick={handleApiLinkClick()}
                style={{ cursor: 'pointer' }}>
                {getApiLinkLabel(apiData)}
            </a>
        )
    });

    const getApiGroupLabel = function (tagGroupData) {
        return tagGroupData.groupName || tagGroupData.name;
    }

    return (
        (
            <div className="quick-link-group">
                <a className="group-link" href={`#tag_${tagGroupData.name}`}>
                    {getApiGroupLabel(tagGroupData)}
                </a>
                {apiLinkListDom}
            </div>
        )
    )
}

// 用來騰出右側空間用的
const QuickPanelAsideSpace = styled.div`
display: flex;
flex-direction: column;

flex-grow: 0;

margin-right: ${quickPanelRight || '35px'};

width: ${quickPanelWidth};

@media only screen and (max-width: ${quickPanelHiddenMaxWidth}) {
    display: none;
}
`

const marginVertical = '1rem';

const QuickPanelAsideStyled = styled.div`


display: flex;
flex-direction: column;

flex-grow: 0;

/* margin-right: ${quickPanelRight || '35px'}; */

background-color: ${fetchTheme('board', '#cba165')};

border-radius: ${fetchTheme('boardRadius', '5px')};

width: ${quickPanelWidth};

position: fixed;

top: calc(${LayoutMixin.navBarHeight} + ${marginVertical});
// 若想要對齊PageTitle的下緣，只要把top參數拿掉即可

right: ${quickPanelRight};

height: calc(100vh - ${LayoutMixin.navBarHeight} - (${marginVertical} * 2));

overflow-y: auto;

@media only screen and (max-width: ${quickPanelHiddenMaxWidth}) {
    display: none;
}

// scrollbar---------------------------------------

/* width */
&::-webkit-scrollbar {
    width: 14px;
}

/* Track */
&::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px grey; */
    /* background: #d1d1d1; */
    border-radius: 15px;

    background: transparent;
}

/* Handle */
&::-webkit-scrollbar-thumb {
    /* background: #989898; */
    background-color: ${fetchTheme('scrollbar', '#cdcdcd')};

    border-radius: 30px;
    
    border: 3px solid transparent; // 用來縮小thumb的寬度
    background-clip: content-box;
    /* box-shadow: inset 0 0 5px #282828; */
}

/* Handle on hover */
&::-webkit-scrollbar-thumb:hover {
    /* background: #dedede; */
    background-color: ${fetchTheme('scrollbarHover', '#dedede')};
    border: 3px solid transparent; // 用來縮小thumb的寬度
    background-clip: content-box;
}

    & .quick-link-group {
        display: flex;
        flex-direction: column;

        margin-right: 1rem;

        margin-top: 1rem;

        & a {
            margin-left: 2.5rem;

            /* word-break: break-all; */
            /* word-break: normal; */
            /* word-break: keep-all; */
            /* word-break: break-word; */

            color: ${fetchTheme('quickApiTitle', '#000000')};

            margin-bottom: 0.45rem;
            text-decoration: none;

            font-size: 1.05rem;
        }
        /* & a:active {
            color: blue;
        } */

        & a.group-link {
            color: ${fetchTheme('quickGroupTitle', '#000000')};
            margin-left: 1rem;
        }
    }

`

const QuickPanelAside = ({ fetchControl }) => {

    const fc = new FetchControl(fetchControl);
    const fetchModel = fc.export('fetchModel');

    const [tagGroupList, setTagGroupList] = useState([]);
    fetchModel('apiDoc').registSetter('jumpTagList', 'QuickLinkAside', setTagGroupList);

    let tagGroupListDom = tagGroupList.map((tagGroupData, index) => {
        return (
            <QuickLinkGroup tagGroupData={tagGroupData} key={`QuickLinkGroup_${index}`}
                fetchControl={fetchControl}>
            </QuickLinkGroup>
        );
    })

    return (
        <QuickPanelAsideStyled theme={apiDocThemeObject}>
            {tagGroupListDom}
        </QuickPanelAsideStyled>
    )
}


const ApiPageOuter = styled.div`
    /* display: flex; */
    display: ${props => (props.show ? 'flex' : 'none')};
    flex-direction: row;

    flex-grow: 1;

    /* position: relative; // 用來定位: 讓下層的QuickPanelAsideStyled可以定位 */
`

const CreateApiDocStyled = styled.div`
    /* display: flex; */
    display: ${props => props.show ? 'flex' : 'none'};
    flex-direction: row-reverse;
    flex-grow: 1;

    justify-content: flex-start;

    & .icon {
    width: 22px;
    height: 22px;
    }

/* background-color: red; */

/* width: calc(100% - ${quickPanelWidth} - 20px); */
/* width: 100%; */
`

const JsonEditorStyled = styled.div`
display: flex;
flex-direction: column;
width: calc(100% - 1.5rem);

    & .text-area-block {
    margin-left: 1.5rem;
}
`

const ApiDocJsonTextEditor = ({ apiJsonControl, apiJsonModel }) => {
    // {/* width={formItem.width} height={height} */}

    const [json, setJson] = useState(apiJsonModel.getState('json'));
    const actJson = apiJsonModel.reactive('json', 'ApiDocJsonTextEditor', setJson);

    // const onUpdateJson = () => (val) => {
    //     // console.log('onUpdateJson', val)
    //     setJson('val');
    // }

    // useEffect(function () {
    //     console.log('ApiDocJsonTextEditor');
    // }, [])

    return (
        <JsonEditorStyled>
            <div className="text-area-block">
                {/* onUpdate={onUpdateJson()} */}
                <TextArea value={apiJsonModel.fetchRef('json', 'ApiDocJsonTextEditor_ref')}
                    width="100%" height="600px"
                    srcKey="ApiDocJsonTextEditor"
                    nowrap={true}
                    searchTrigger={apiJsonControl.bindAct('receiveSearchKeyword')}></TextArea>
            </div>
        </JsonEditorStyled>
    )
}

const SwaggerButtonInnerStyled = styled.div`
display: flex;
align-items: center;

& .text {
    margin-right: 5px;
    font-weight: bold;
    color: #4c5e5a;
}
& .icon {
    width: 19px;
    height: 19px;
}
`

export default function ApiConnect({ fetchControl, mode }) {
    // mode: 'edit'

    // console.log('page render')

    const translationMenu = useTranslation('menu', { keyPrefix: 'subItem' });
    const { t } = useTranslation('setting', { keyPrefix: 'payRelated' });


    const urlQuery = useUrlQuery();
    // console.log('UrlQuery', urlQuery.get())

    const urlQueryObj = urlQuery.get();
    /* urlQueryObj: {
        category: "dataCollection"
    }*/

    // apiDocModel------------------------------------------------------

    const apiDocModel = new ApiConnectModel(useRef(null), { pageMode: mode });
    const fc = new FetchControl(fetchControl);
    fc.setupModel('apiDoc', apiDocModel); // 註冊進fetchControl體系，這樣底下就可以輕鬆存取

    const actPageMode = apiDocModel.reactive('pageMode', 'ApiConnectPage');
    useEffect(function () {
        actPageMode(mode);
    }, [mode]);

    // apiManage------------------------------------------------------

    const apiManageModel = new ApiManageModel(useRef(null));
    fc.setupModel('apiManage');

    const apiManageControl = new ApiManageControl();
    fc.setup('apiManage', apiManageControl);


    const addTagModel = new AddTagModel(useRef(null));
    fc.setupModel('addTag', addTagModel);

    const addApiModel = new AddApiModel(useRef(null));
    fc.setupModel('addApi', addApiModel);

    const addBodyModel = new AddBodyModel(useRef(null));
    fc.setupModel('addBody', addBodyModel);

    const editTagModel = new EditTagModel(useRef(null));
    fc.setupModel('editTag', editTagModel);

    const addResModel = new AddResModel(useRef(null));
    fc.setupModel('addRes', addResModel);

    const editAttrModel = new EditAttrModel(useRef(null));
    fc.setupModel('editAttr', editAttrModel);

    const addApiDocModel = new AddApiDocModel(useRef(null));
    fc.setupModel('addApiDoc', addApiDocModel);

    apiManageControl.registModel('apiManage', apiManageModel);
    apiManageControl.registModel('addTag', addTagModel);
    apiManageControl.registModel('addApi', addApiModel);
    apiManageControl.registModel('addBody', addBodyModel);
    apiManageControl.registModel('editTag', editTagModel);
    apiManageControl.registModel('editAttr', editAttrModel);
    apiManageControl.registModel('addApiDoc', addApiDocModel);

    const docxControl = new DocxControl(useRef(null));
    docxControl.registModel('apiManage', apiManageModel);
    docxControl.registModel('apiDoc', apiDocModel);

    const apiJsonModel = new ApiJsonModel(useRef(null));
    const apiJsonControl = new ApiJsonControl();
    apiJsonControl.registModel('apiJson', apiJsonModel);
    apiJsonControl.registModel('apiManage', apiManageModel);

    apiManageControl.registModel('apiJson', apiJsonModel);

    fc.setup('apiJson', apiJsonControl);

    const addQueryModel = new AddQueryModel(useRef(null));
    apiManageControl.registModel('addQuery', addQueryModel);



    // http://{host}/apiConnect?category=dataCollection

    const apiConnectPageMap = {
        dataCollection: { // <category>
            jsonPath: "/apiConnect/dataCollection.json",
            pageTitle: "apiConnectDataCollection",
        },
        shakuApi: {
            fileName: 'qore-plus-api',
            jsonPath: "http://localhost:5050/apiDoc/qore-plus-api.json",
            pageTitle: "apiConnectDataCollection",
        },
    };

    let jsonPath = '/apiConnect/default.json';
    let pageTitle = translationMenu.t('apiConnect');
    let fileName = '';
    let docType;
    if (urlQueryObj) {
        if (urlQueryObj.category) {
            const pageInfo = apiConnectPageMap[urlQueryObj.category];

            if (pageInfo) {
                if (pageInfo.jsonPath) {
                    jsonPath = pageInfo.jsonPath
                    pageTitle = `${translationMenu.t(pageInfo.pageTitle)} `;
                    fileName = pageInfo.fileName;
                }
            }
        } else if (urlQueryObj.fileName) { // fileName模式

            const apiDocList = LocalAccessor.getItem('apiDocList');
            const apiDocInfo = apiDocList.find(docInfo => docInfo.fileName === urlQueryObj.fileName);

            if (apiDocInfo) {
                jsonPath = apiDocInfo.path;
                // jsonPath = `http://localhost:5050/apiDoc/${urlQueryObj.fileName}.json`
                pageTitle = `pageTitle`;
                fileName = urlQueryObj.fileName;
                docType = apiDocInfo.type;
            } else {
                console.error(`apiDocInfo not found`, urlQueryObj.fileName);
            }
        }
    }

    useEffect(function () {
        apiManageModel.setState('fileName', fileName);
        apiManageModel.setState('jsonPath', jsonPath);
        apiManageModel.setState('docType', docType);

        fetchControl('apiManage').fetchJson();
    }, []);

    const [viewMode, setViewMode] = React.useState(apiManageModel.getState('viewMode')); // 'board'
    const actViewMode = apiManageModel.reactive('viewMode', 'ApiConnect', setViewMode);

    const handleChangeToggleButton = (event, newMode) => {
        actViewMode(newMode);
    };

    const jumpToSwaggerPage = () => () => {
        const fileName = apiManageModel.getState('fileName');
        // console.log('fileName', fileName);

        // 轉跳頁面
        // window.location.href = `http://localhost:9001/api-docs/${fileName}`;
        window.open(`http://localhost:9001/api-docs/${fileName}`);

        // http://localhost:9001/api-docs/qore-plus-demo
    }

    const titleExtendSlotDom = (
        <CreateApiDocStyled show={apiDocModel.pageUnitAuth('titleExtend')}>
            <Button type="fill" pattern="small" importStyle={{ marginTop: '0', marginBottom: '0', marginRight: '1.5rem' }}
                onClick={fetchControl('apiManage').bindAct('onClickCreateApiDoc')}
                show={viewMode === 'board'}>
                <PlusSvg className="icon" fill="#4c5e5a" />
            </Button>
            <Button type="fill" pattern="small" importStyle={{ marginTop: '0', marginBottom: '0', marginRight: '1.5rem', marginLeft: '0' }}
                onClick={fetchControl('apiManage').bindAct('onClickClientSaveJsonFile')}
                show={viewMode === 'json'}>
                <FolderDownloadSvg className="icon" fill="#4c5e5a" />
            </Button>
            <Button type="fill" pattern="small" importStyle={{ marginTop: '0', marginBottom: '0', marginRight: '0.75rem' }}
                onClick={fetchControl('apiManage').bindAct('onClickUpdateJsonFile')}
                show={viewMode === 'json'}>
                <FolderUploadSvg className="icon" fill="#4c5e5a" />
            </Button>
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleChangeToggleButton}
                aria-label="Platform"
            >
                <ToggleButton value="board">BOARD</ToggleButton>
                <ToggleButton value="json">JSON</ToggleButton>
            </ToggleButtonGroup>

            <Button type="fill" pattern="small" importStyle={{ marginTop: '0', marginBottom: '0', marginRight: '0.75rem', paddingH: '0.5rem' }}
                onClick={jumpToSwaggerPage()}
                show={true}>
                <SwaggerButtonInnerStyled>
                    <div className="text">
                        swagger
                    </div>
                    <BrowserSvg className="icon" fill="#4c5e5a" />
                </SwaggerButtonInnerStyled>
            </Button>
            {/* <DocxSave apiManageModel={apiManageModel} docxControl={docxControl}></DocxSave> */}
        </CreateApiDocStyled>
    )

    const asideSlotDom = (<QuickPanelAsideSpace>
        <QuickPanelAside fetchControl={fc.export()}></QuickPanelAside>
    </QuickPanelAsideSpace>);

    return (
        <PageTitle title={pageTitle} titleExtendSlot={titleExtendSlotDom} asideSlot={asideSlotDom}>
            <ApiPageOuter show={viewMode === 'board'}>
                <ApiDocument fetchControl={fetchControl}></ApiDocument>
                {/* <QuickPanelAsideSpace></QuickPanelAsideSpace>
                <QuickPanelAside fetchControl={fetchControl}></QuickPanelAside> */}
                <AddTagModal control={apiManageControl}
                    model={addTagModel}
                    apiManageModel={apiManageModel}></AddTagModal>
                <AddApiModal control={apiManageControl}
                    model={addApiModel}
                    apiManageModel={apiManageModel}></AddApiModal>
                <AddBodyModal control={apiManageControl}
                    model={addBodyModel}
                    apiManageModel={apiManageModel}></AddBodyModal>
                <EditApiModal control={apiManageControl}
                    model={editTagModel}
                    apiManageModel={apiManageModel}></EditApiModal>
                <AddResponseModal control={apiManageControl}
                    model={addResModel}
                    apiManageModel={apiManageModel}></AddResponseModal>
                <EditAttrModal control={apiManageControl}
                    model={editAttrModel}
                    apiManageModel={apiManageModel}></EditAttrModal>
                <AddQueryModal control={apiManageControl}
                    model={addQueryModel}
                    apiManageModel={apiManageModel}></AddQueryModal>
            </ApiPageOuter>
            <ApiPageOuter show={viewMode === 'json'} className="json-editor-page-outer">
                <ApiDocJsonTextEditor apiJsonControl={apiJsonControl} apiJsonModel={apiJsonModel}></ApiDocJsonTextEditor>
            </ApiPageOuter>
            <AddApiDocModal control={apiManageControl}
                model={addApiDocModel}
                apiManageModel={apiManageModel}></AddApiDocModal>
        </PageTitle>
    );
}