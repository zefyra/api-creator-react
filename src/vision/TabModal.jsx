/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useState, useRef, useEffect } from "react";

import CheckBox from 'component/CheckBox';

import Modal from 'component/Modal'

/* Component 使用範例

<InputRow title="標題">
    <InputText importStyle={{
        width: '260px',
    }} placeholder="請輸入手機號碼" value={phone} onUpdate={actPhone}></InputText>
</InputRow>

*/

/*
HTML使用範例 (children)


<div className="row input-row">
    <div className="form-item">
        <div className="title">
            標題
        </div>
        <InputText importStyle={{
            width: '260px',
        }} placeholder="請輸入手機號碼" value={phone} onUpdate={actPhone}></InputText>
    </div>
</div>

<div className="row input-row">
    <div className="form-item">
        <div className="title">
            居住地區
        </div>
        <Select importStyle={{
            width: '160px'
        }} value={county} optionList={countyOptionList} onUpdate={actCounty}></Select>
        <Select importStyle={{
            width: '160px'
        }} value={district} optionList={districtOptionList} onUpdate={actDistrict}></Select>
    </div>
</div>

confirmBtn使用範例

confirmBtn={
    <Button type="fill" importStyle={{
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        }} onClick={fetchControl('userProfile').bindAct('onSaveUserProfile')}>儲存</Button>
}


*/

const ModalFormStyled = styled.div`
display: ${props => props.show ? 'flex' : 'none'};
flex-direction: column;

min-height: inherit; // 繼承上一層的min-height，必須要吃到min-height，flex-grow才會有作用

    & .row {
        display: flex;
        flex-direction: row;
        justify-content: center;

        flex-grow: 0;

        padding-left: 1.5rem;
        padding-right: 1.5rem;

        margin-bottom: 1rem;

        & .form-item {
            min-width: 450px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            
            & .title {
                display: flex;
                flex-direction: row;
                align-items: center;

                margin-right: 1rem;

                width: ${props => props.titleWidth ? props.titleWidth : '80px'};
            }
        }
    }
    & .top-row {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }


    /* & .row.user-check-row {
        flex-direction: row;

        justify-content: center;

        margin-top: 0.5rem;
        margin-bottom: 0.5rem;

            & .check-box-board {
                display: flex;
                
                justify-content: space-around;

                width: 100%;
                
                background-color: #b3c2bf;
                
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;

                border-radius: 5px;

                box-shadow: inset 0px 0px 5px #798683;

                & .check-box-block {
                    display: flex;
                    align-items: center;
                }
            }
    } */

    & .row.input-row{
        // InputText文字輸入框
        & input {
            margin-right: 1rem;
        }

        // CheckBox陣列
        & .check-box-container{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: calc(450px - 80px);


            & .check-item {
                display: flex;
                flex-direction: row;

                margin: 0.5rem 0.2rem;

                & .check-box-block {
                    display: flex;
                    align-items: center;
                }

                & .item-label {
                    display: flex;

                    align-items: center;
                    justify-content: flex-start;

                    margin: 0 0.45rem;
                }
            }
        }
    }

    /* & .row.sex-row{
        flex-direction: row;
        justify-content: center;
    } */

    .confirm-button-row {
        display: flex;
        flex-direction: row;
        flex-grow: 1;

        justify-content: flex-end;
        align-items: flex-end;
    }
`

/*
function isClassComponent(component) {
    return (
        typeof component === 'function' && 
        !!component.prototype.isReactComponent
    )
}

function isFunctionComponent(component) {
    return (
        typeof component === 'function' && 
        String(component).includes('return React.createElement')
    )
}

function isReactComponent(component) {
    return (
        isClassComponent(component) || 
        isFunctionComponent(component)
    )
}

function isElement(element) {
    return React.isValidElement(element);
}*/

// 檢查是否為DOM物件的函式
// https://stackoverflow.com/questions/33199959/how-to-detect-a-react-component-vs-a-react-element

// 用來檢查是否是DOM物件
// function isDOMTypeElement(element) {
//     return React.isValidElement(element) && typeof element.type === 'string';
// }

// 用來檢查是否是React組件
function isCompositeTypeElement(element) {
    return React.isValidElement(element) && typeof element.type === 'function';
}

export const ModalTabForm = function ({ show = true, importCss, children, titleWidth }) {

    // console.log(`ModalTabForm children `, children)

    const childrenWithProps = React.Children.map(children, (child, index) => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.

        // console.log('child', child)

        // if (React.isValidElement(child)) {

        //     console.log('isDOMTypeElement', isDOMTypeElement(child) )
        //     return child;
        //     // 將isTop的參數設進去，使其自動判斷最前排的CSS
        //     // return React.cloneElement(child, { isTop: index === 0 });
        // }

        if (isCompositeTypeElement(child)) {
            // 檢查若是React組件才塞進去

            // 將isTop的參數設進去，使其自動判斷最前排的CSS
            return React.cloneElement(child, { isTop: index === 0 });
        }

        return child;
    });

    // console.log('importCss', importCss)

    return (
        <ModalFormStyled show={show} css={importCss} titleWidth={titleWidth}>
            {/* {children} */}
            {childrenWithProps}
        </ModalFormStyled>
    );
}

export function InputRow({ type, title, children, isTop = false, className = 'input-row' }) {
    // className: 要用來覆蓋原本 'input-row' 的class

    let contentDom;
    if (type === 'checkBoxGroup') {
        // 代表是checkBox陣列，要額外再包一層
        contentDom = (
            <div className="check-box-container">
                {children}
            </div>
        );

    } else if (type === 'confirmBtnRow') { // 最底下的按鈕列
        // console.log('confirmBtnRow', confirmBtn)

        return (
            <div className="confirm-button-row">
                {/* <Button type="fill" importStyle={{
                    marginRight: '1.5rem',
                    marginBottom: '1.5rem',
                }} onClick={onClickSave}>儲存</Button> */}
                {children}
            </div>
        )
    } else {
        contentDom = children;
    }


    return (
        <div className={`row ${className} ${isTop ? 'top-row' : ''}`}>
            <div className="form-item">
                <div className="title">
                    {/* 標題 */}
                    {title}
                </div>
                {contentDom}
                {/* <InputText importStyle={{
                    width: '260px',
                }} placeholder="請輸入手機號碼" value={phone} onUpdate={actPhone}></InputText> */}
            </div>
        </div>
    )
};

export const CheckBoxItem = ({ label, value, onUpdate }) => {
    return (
        <div className="check-item">
            <div className="check-box-block">
                <CheckBox type="small" value={value} onUpdate={onUpdate} />
            </div>
            <div className="item-label">
                {label}
            </div>
        </div>
    );
}



const ModalTabStyled = styled.div`
    display: flex;
    
    justify-content: center;
    align-items: center;
    
    height: 2rem;
    
    padding: 0.25rem 1rem 0.25rem 1rem;
    margin: 0 0.25rem;
    
    border-radius: 5px 5px 0 0;

    /* background-color: #506666; */
    /* background-color: #cfd9d7; */
    background-color: #b3c2bf;

    cursor: pointer;

    user-select: none;

    &.active {
        background-color: #cfd9d7;
        /* background-color: #23776f; */
    }
`

const ModalTab = ({ onClick, children, active }) => {
    return (
        <ModalTabStyled onClick={onClick} className={`${active ? 'active' : ''}`}>{children}</ModalTabStyled>
    )
}

export default function TabModal({ modalRef, children, importCss,
    tabList = [], onTabChange = () => { }, headerSlot, reactTab,
    modalWidth = 700, modalHeight = 660 }) {
    /* tabList = [{
        label: '用戶樣貌',
        tabKey: SocialDetailTabEnum.userPreference,
    }, {
        label: '綁定渠道UID',
        tabKey: SocialDetailTabEnum.bindChannelUid,
    }, {
        label: '消費行為',
        tabKey: SocialDetailTabEnum.consumeBehavior,
    }, {
        label: '標籤',
        tabKey: SocialDetailTabEnum.userTag,
    }]; */

    let initTabKey = '';
    if (tabList.length > 0) {
        initTabKey = tabList[0].value;
    }
    const [tabType, setTabType] = useState(initTabKey);

    let actTabType = setTabType;

    // console.log(`reactTab`, reactTab)
    if (reactTab) {
        // 代表有要做參數綁定
        const actTabFunc = reactTab(setTabType); // 完成輸出綁定
        if (actTabFunc) {
            // 代表有接到
            actTabType = actTabFunc; // 置換進去，完成輸入綁定
            // console.log(`actTabType`, actTabType)
        }
        // console.log(`actTabFunc`, actTabFunc)
    }

    const onModalTabClick = tabKey => () => {
        actTabType(tabKey)
        onTabChange(tabKey);
    }

    const tabListDom = tabList.map((tabItem, index) => {
        /* tabItem: {
            value: 'userPreference'
        } */
        return (<ModalTab key={`tab_${index}`}
            onClick={onModalTabClick(tabItem.value)}
            active={tabType === tabItem.value}>{tabItem.label}</ModalTab>)
        // return (<ModalTab onClick={onModalTabClick(SocialDetailTabEnum.userPreference)} active={tabType === SocialDetailTabEnum.userPreference}>用戶樣貌</ModalTab>)
    });

    return (
        <Modal childRef={modalRef}
            modalWidth={modalWidth} modalHeight={modalHeight} >
            <TabModelStyled css={importCss} modalWidth={modalWidth} modalHeight={modalHeight}>
                <div className="detail-info-row">
                    <div className="header-block">
                        {headerSlot}
                    </div>
                    <div className="tab-block">
                        {tabListDom}
                    </div>
                </div>
                <div className="modal-tab-container-area">
                    {children}
                    {/* <UserProfile show={tabType === SocialDetailTabEnum.userPreference} fetchControl={fetchControl}></UserProfile>
                    <BindChannelUid show={tabType === SocialDetailTabEnum.bindChannelUid} fetchControl={fetchControl}></BindChannelUid>
                    <TagSelector show={tabType === SocialDetailTabEnum.userTag} type="socialFriendModal" fetchControl={fetchControl} onSave={onSaveSelectedTagList()}></TagSelector> */}
                </div>
            </TabModelStyled>
        </Modal>
    );
}



const TabModelStyled = styled.div`
    display: flex;
    flex-direction: column;

    /* min-width: 700px;
    min-height: 660px; */
    min-width: ${props => props.modalWidth ? `${props.modalWidth}px` : '700px'};
    min-height: ${props => props.modalHeight ? `${props.modalHeight}px` : '660px'};

    & .detail-info-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
        margin: 0rem 1.5rem 0 1.5rem;

        min-height: 66px;

        & .header-block {
            display: flex;
            height: 66px;
        }

        & .tab-block {
            display: flex;
            flex-direction: row;

            margin-right: 0.5rem;

            align-items: flex-end;
        }
    }

    & .modal-tab-container-area {
        width: 100%;
        background-color: #cfd9d7;
        /* background-color: #506666; */

        /* flex-grow: 1; */
        border-radius: 0 0 10px 10px;

        /* min-height: 100%; */

        min-height: calc(660px - 66px); // 計算出剩餘的高度
    }

    
`