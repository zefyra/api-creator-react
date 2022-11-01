/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { fetchTheme, fetchImportStyle } from 'util/ThemeMixin'
import { textArea as textAreaThemeObject } from 'theme/reas'
import { useState } from 'react'
import Ref from 'model/Ref'

const TextareaStyled = styled.textarea`
    /* width: ${fetchImportStyle('width', '18rem')}; */
    /* height: 2.3rem; */
    /* height: ${fetchImportStyle('height', '4.6rem')}; */

    width: ${props => props.width || '18rem'};
    height: ${props => props.height || '4.6rem'};

    /* border-width: 0; // 無外框版 */
    
    background-color: ${fetchTheme('inputBox', '#5e9aaf')};
    color: ${fetchTheme('inputBoxText', '#5d5d5d')};

    outline: none; // 關閉亮起的外框
    border-width: 2px;
    border-style: solid;
    border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
    border-radius: ${fetchTheme('inputBoxRaduis', '3px')};


    font-size: 1.05rem;
    text-align: left;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

    margin-left: ${fetchImportStyle('marginLeft', '0px')};
    margin-right: ${fetchImportStyle('marginRight', '0px')};
    margin-top: ${fetchImportStyle('marginTop', '0px')};
    margin-bottom: ${fetchImportStyle('marginBottom', '0px')};

    resize: none;

    /* margin-top: 20px; */

    /* ${props => props.importStyle} */

    &.focus {
        outline: none; // 關閉亮起的外框
    }

    &::placeholder {
        color: ${fetchTheme('inputBoxPlaceholder', '#5d5d5d')};
        /* opacity: 1; */
    }
    &:disabled {
        background-color: ${fetchTheme('inputBoxDisabled', '#d4c1c1')};
        cursor: not-allowed;
    }
`

export default function TextArea({ width, height, value, onUpdate, srcKey = 'TextArea' }) {

    const isRefMode = value instanceof Ref;

    // value={nowValue} onChange={onInputTextChange()}
    // importStyle
    // onClick={onClick}
    // onFocus={onFocus} onBlur={onBlur}
    // onKeyDown={onInputTextKeyDown()}

    const convertValue = function (value) {
        let initInputText = '';
        if (typeof value === 'string') {
            initInputText = value;
        } else if (isRefMode) {
            initInputText = value.getValue();
        }
        return initInputText;
    }
    const [nowValue, setNowValue] = useState(convertValue(value));

    const mutTextArea = function (val) {
        setNowValue(val);
    }
    let actTextArea = mutTextArea;
    if (isRefMode) { // 綁定value
        actTextArea = value.reactive(srcKey, actTextArea);
    }

    // event----------------------------------------

    const handleChange = () => e => {
        // console.log('handleChange value', e.target.value)
        // console.log('handleChange nowValue', nowValue)

        if (isRefMode) {
            // 代表是ref雙向綁定模式
            actTextArea(e.target.value);
        } else if (onUpdate) {
            // 非雙向綁定模式: 若有onUpdate即丟出事件
            onUpdate(e.target.value);
        }

    }
    return (
        <TextareaStyled width={width} height={height} theme={textAreaThemeObject}
            onChange={handleChange()}
        ></TextareaStyled>
    )
}