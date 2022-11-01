/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useState, useEffect } from 'react';
// import styled from "styled-components";
import {
    fetchTheme, fetchImportStyle
} from 'util/ThemeMixin'
import { toggleSwitch as themeObject } from 'theme/reas'
import Ref from 'model/Ref';

const DefaultToggleSwitch = ({ className, value, onUpdate, onClick, srcKey = "DefaultToggleSwitch" }) => {

    let actActive;

    const handleChange = () => () => {
        if (onUpdate) {
            onUpdate(!value);
        }
        if (value instanceof Ref) {
            actActive(!active)
        }
    }

    let nowActive = value;

    const convertValue = function (value) {
        if (!value) { // 代表沒設定value屬性
            return false;
        } else if (typeof value === 'boolean') {
            return value;
        } else if (value instanceof Ref) {
            return value.getValue();
        } else {
            console.error(`DefaultToggleSwitch: value type is unknown`, value);
            return false;
        }
    }
    const [active, setActive] = useState(convertValue(value));
    actActive = setActive;
    if (value instanceof Ref) {
        if (!srcKey) {
            console.error(`DefaultToggleSwitch: must have srcKey when use Ref`);
            srcKey = 'temp_DefaultToggleSwitch_value_srcKey';
        }
        actActive = value.reactive(srcKey, setActive);
        nowActive = active;
    }
    useEffect(function () {
        actActive(convertValue(value));
    }, [value]);

    return (
        <label className={className} onClick={onClick}>
            {/* onClick={onToggleClick()} */}
            <input type="checkbox" checked={nowActive} onChange={handleChange()} />
            <span className="slider round"></span>
        </label>
    );
}

const DefaultToggleSwitchStyled = styled(DefaultToggleSwitch)`
position: relative;
display: inline-block;
width: ${fetchImportStyle('width', '60px')};
height:  ${fetchImportStyle('height', '34px')};

    & input {
        opacity: 0; // 將原本的checkBox隱藏
        width: 0;
        height: 0;
    }

    .slider { // 用span做個新的外觀
        position: absolute;

        cursor: pointer;

        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${fetchTheme('slider', '#cccccc')};

        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before { // before可以生出開關中間的那個板機UI
        position: absolute;
        content: "";
        height: ${fetchImportStyle('switchHeight', '26px')};
        width: ${fetchImportStyle('switchWidth', '26px')};
        left: 4px;
        bottom: 4px;
        background-color: ${fetchTheme('trigger', 'white')};
        -webkit-transition: .4s;
        transition: .4s; // 設定動畫0.4秒
        /* transition: all .1s linear; */
    }

    input:checked + .slider { // 設定checkBox為打勾狀態下，slider的顏色亮起為藍色
        background-color: ${fetchTheme('sliderChecked', '#2196F3')};
    }

    input:focus + .slider { // focus選取狀態，周圍的暈光
        box-shadow: 0 0 1px ${fetchTheme('sliderFocusShadow', '#2196F3')};
    }

    input:checked + .slider:before { // 設定checkBox為打勾狀態下，板機的狀態
        -webkit-transform: translateX(26px); // 位置右移26px
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    .slider.round {
        border-radius: 34px; // 圓弧外框
    }

    .slider.round:before {
        border-radius: 50%; // 圓弧板機
    }
`

export default function ToggleSwitch({ value, onUpdate, onClick, srcKey }) {
    return (<DefaultToggleSwitchStyled value={value} onUpdate={onUpdate}
        theme={themeObject} onClick={onClick} srcKey={srcKey}></DefaultToggleSwitchStyled>)
}