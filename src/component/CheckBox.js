

import { useState, useEffect } from 'react';
import styled from "styled-components";
import { checkBox as themeObject } from 'theme/reas'
import { checkBox as tableThemeObject } from 'theme/reas'
import {
    fetchTheme, fetchImportStyle
} from 'util/ThemeMixin'

import PatternStyleMixin from 'util/PatternStyleMixin';
const CheckBoxPatternStyleMixin = new PatternStyleMixin('CheckBox');

const DefaultCheckBox = ({ className, value, onUpdate, onClick, disabled }) => {


    const handleChange = () => e => {
        // console.log('CheckBox handleChange', !value)

        // console.log('CheckBox handleChange onUpdate', onUpdate)
        if (onUpdate) {
            onUpdate(!value);
        }
    }
    return (
        <label className={className} onClick={onClick}>
            <input type="checkbox" checked={value} onChange={handleChange()} disabled={disabled} />
            {/* onChange={handleChange()} */}
            <span className="checkmark"></span>
        </label>
    );
}

/* 舊版的

const DefaultCheckBox = ({ className, value, onUpdate, onClick, disabled }) => {

    // const [toggleChecked, setToggleChecked] = useState(true);

    const handleChange = () => () => {
        if (onUpdate) {
            onUpdate(!value);
        }
    }

    useEffect(function () {
        console.log('CheckBox value changed', value);
    }, [value])

    return (
        <label className={className} onClick={onClick}>
            <input type="checkbox" checked={value} onChange={handleChange()} disabled={disabled} />
            <span className="checkmark"></span>
        </label>
    );
} */

const DefaultCheckBoxStyled = styled(DefaultCheckBox)`
display: block;
position: relative;
/* padding-left: 35px; */
/* margin-bottom: 12px; */
cursor: pointer;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
width: ${fetchImportStyle('width', '25px')}; // 套入真實的大小，讓外部排版正常
height: ${fetchImportStyle('height', '25px')};

    /* Hide the browser's default checkbox */
    & input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        width: ${fetchImportStyle('width', '25px')}; // 實際顯示的尺寸
        height: ${fetchImportStyle('height', '25px')};
        background-color: ${fetchTheme('checkBox', '#f2f2f2')};

        border-radius: ${fetchTheme('checkBoxRadius', '4px')};
        
        /* border: 1px solid #cacaca; */
        border: ${fetchImportStyle('border', 'none')};
    }

    & input:disabled ~ .checkmark { // 由input觸發， ~ 符號可以操控.checkmark標籤的行為
        background-color: ${fetchTheme('checkBoxDisabled', '#cccccc')};
    }

    /* On mouse-over, add a grey background color */
    &:hover input ~ .checkmark {
        background-color: ${fetchTheme('checkBoxHover', '#cccccc')};
    }

    /* When the checkbox is checked, add a blue background */
    & input:checked ~ .checkmark {
        background-color: ${fetchTheme('checkBoxChecked', '#2196F3')};

        border-radius: ${fetchTheme('checkBoxRadius', '4px')};
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    & input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    & .checkmark:after {
        /* left: 9px;
        top: 5px; */
        left: ${fetchImportStyle('left', '9px')};
        top: ${fetchImportStyle('top', '5px')};
        width: 5px;
        height: 10px;
        border: solid ${fetchTheme('checkedSign', 'white')};
        border-width: 0 3px 3px 0; // 用border顯示2個邊，來製作勾勾符號
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`

export default function CheckBox({ type, value, onUpdate, onClick, disabled, pattern }) {

    if (type === 'table') {
        return (<DefaultCheckBoxStyled value={value} onUpdate={onUpdate} theme={tableThemeObject} onClick={onClick} disabled={disabled} />)
    }

    if (type === 'small') {
        const patternStyle = CheckBoxPatternStyleMixin.getPatternStyle('small');
        return (<DefaultCheckBoxStyled patternStyle={patternStyle} value={value}
            onUpdate={onUpdate} theme={themeObject} onClick={onClick} disabled={disabled} />)
    }


    const patternStyle = CheckBoxPatternStyleMixin.getPatternStyle(pattern);

    return (<DefaultCheckBoxStyled value={value} onUpdate={onUpdate} theme={themeObject}
        onClick={onClick} disabled={disabled} patternStyle={patternStyle} />)
}
