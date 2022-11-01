/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

// import styled from 'styled-components'

import React, { useEffect, useState, useRef } from "react";

import uniqid from 'uniqid';

// import Button from 'component/Button'

import LayerMixin from 'util/LayerMixin'

import CheckBox from "component/CheckBox"

import { fetchTheme as getTheme } from "util/ThemeMixin";
import { dropdownSelect as themeObject } from "theme/reas"
// import Mask from './Mask';
import WindowCall from 'util/WindowCall';

// let closeHandleCallback;

// window.onclick = function (event) {
//     // console.log('event.target', event.target.matches('.page-title-layer'))
//     if (!event.target.matches('.table-header-select')) {
//         if (closeHandleCallback) {
//             closeHandleCallback();
//         }
//     }
// }

const DefaultDropdownSelect = ({ importStyle, className, qid, itemList,
    onItemChanged, show = false, onShowUpdate, children }) => {

    const [dropdownShow, setDropdownShow] = useState(false);

    // if (dropdownShow) {
    //     setDropdownShow(false);
    // }

    // useEffect(function () {
    //     if (dropdownShow) {
    //         // 開啟時，才掛上去

    //         // 點擊外部時關閉
    //         WindowCall.registOnClick('DefaultDropdownSelect', function (event) {
    //             console.log(`event.target`, event.target)
    //             if (!event.target.matches('.page-title-layer')) {
    //                 if (dropdownShow) {
    //                     setDropdownShow(false);
    //                 }
    //             }
    //         });
    //     }
    // }, [dropdownShow])
    useEffect(function () {
        WindowCall.autoCloseOnShowChanged('DefaultDropdownSelect',
            dropdownShow, '.table-header-select-button, .dropdown-select-item',
            () => setDropdownShow(false)
        );

        // if (dropdownShow) {
        //     // 開啟時才掛上去
        //     WindowCall.registOnClick('DefaultDropdownSelect', function (event) {
        //         console.log(`event.target`, event.target);
        //         if (!event.target.matches('.table-header-select-button, .dropdown-select-item')) {
        //             if (dropdownShow) {
        //                 setDropdownShow(false);
        //                 // 處理完畢後刪除，避免之後接觸到已釋放的物件
        //                 // window.onclick = null;
        //                 WindowCall.endWindowCall(); // 代表工作已執行完畢，要呼叫end，清除 window.onclick 上掛載的函式
        //             }
        //         }
        //     });
        // } else {
        //     WindowCall.endWindowCall(); // 代表工作已執行完畢，要呼叫end，清除 window.onclick 上掛載的函式
        // }
    }, [dropdownShow]);

    // --------------------------------------------------

    useEffect(function () {
        if (onShowUpdate) {
            onShowUpdate(dropdownShow);
        }
    }, [dropdownShow])

    useEffect(function () {
        // console.log(`act show`, show)
        setDropdownShow(show)

    }, [show]);

    const blockBubble = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();
    }

    let itemRowDomList = [];

    const onDropdownItemClick = (checked, setChecked) => e => {
        // console.log('onDropdownItemClick')

        // 阻擋泡泡事件
        e.stopPropagation();

        setChecked(!checked);
    }

    const checkMap = {};

    function setItemChecked(setChecked, item, itemIndex, val) {
        setChecked(val);
        onItemChanged(item, itemIndex, val)
    }

    itemRowDomList = itemList.map((item, itemIndex) => {

        const [checked, setChecked] = useState(item.value !== undefined ? item.value : true);

        const setItemCheckedFunc = setItemChecked.bind(null, setChecked, item, itemIndex);

        checkMap[itemIndex] = {
            item,
            checked,
            setChecked: setItemCheckedFunc,
        };

        return (
            <div key={`dropdownItem_${itemIndex}`} className={`dropdown-select-item ${checked ? 'item-select' : ''}`} onClick={onDropdownItemClick(checked, setItemCheckedFunc)}>
                <CheckBox value={checked} onUpdate={setItemCheckedFunc} onClick={blockBubble()} />
                <div className="item-label">{item.label}</div>
            </div>
        );
    });

    // const onMaskClick = () => () => {
    //     // console.log('onMaskClick')
    //     if (dropdownShow) {
    //         setDropdownShow(false);
    //     }
    // }

    return (<DefaultDropdownSelectStyled theme={themeObject} className="table-header-select" >
        {/* <Button type={type} mode="default" onClick={onDropdownSelectClick()} qid={qid}>{children}</Button> */}
        {/* <Mask show={dropdownShow} onClick={onMaskClick()}
            layer={LayerMixin.dropdownSelect - 1}></Mask> */}
        {children}
        <div className={`dropdown-select-container ${dropdownShow ? 'show' : ''}`}>
            {itemRowDomList}
        </div>
    </DefaultDropdownSelectStyled>);
}

const DefaultDropdownSelectStyled = styled.div`
position: relative;

    .dropdown-select-container {
        position: absolute;
        display: none;

        /* position: absolute; */
        z-index: ${props => props.layer || LayerMixin.dropdownSelect};
        
        background-color: #c7c7c7;

        width: 300px; // 280
        height: 320px; // 308

        overflow-y: auto;
        overflow-x: hidden;

        background-color: ${getTheme('dropdown', '#6e95a2')};

        .dropdown-select-item {
            display: flex;
            flex-direction: row;

            justify-content: flex-start;
            align-items: center;

            height: 3rem;
            width: 100%;

            flex-shrink: 0;

            padding: 0 1rem;
            
            .item-label {
                margin-left: 1rem;
                cursor: default;

                color: ${getTheme('itemText', '#FFFFFF')};
                user-select: none;
            }
        }
        .dropdown-select-item.item-select{
            background-color: ${getTheme('itemSelect', '#6e95a2')};
        }
    }
    .dropdown-select-container.show {
        display: flex;
        flex-direction: column;
    }
    /* width */
    .dropdown-select-container::-webkit-scrollbar {
        width: 14px;
    }

    /* Track */
    .dropdown-select-container::-webkit-scrollbar-track {
        /* box-shadow: inset 0 0 5px grey; */
        /* background: #d1d1d1; */
        border-radius: 15px;

        background: transparent;
    }

    /* Handle */
    .dropdown-select-container::-webkit-scrollbar-thumb {
        /* background: #989898; */
        background-color: ${getTheme('scrollbar', '#cdcdcd')};

        border-radius: 30px;
        
        border: 3px solid transparent; // 用來縮小thumb的寬度
        background-clip: content-box;
        /* box-shadow: inset 0 0 5px #282828; */
    }

    /* Handle on hover */
    .dropdown-select-container::-webkit-scrollbar-thumb:hover {
        /* background: #dedede; */
        background-color: ${getTheme('scrollbarHover', '#dedede')};
        border: 3px solid transparent; // 用來縮小thumb的寬度
        background-clip: content-box;
    }
`

export default function TableHeaderSelect({ children, importStyle, itemList, onItemChanged, layer, show, onShowUpdate }) {
    return (<DefaultDropdownSelect importStyle={importStyle}
        qid={uniqid()} itemList={itemList} onItemChanged={onItemChanged}
        layer={layer} show={show} onShowUpdate={onShowUpdate}>
        {children}
    </DefaultDropdownSelect>);
}