/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { fetchTheme, fetchImportStyle } from 'util/ThemeMixin'
import { textArea as textAreaThemeObject } from 'theme/reas'
import { useEffect, useState } from 'react'
import Ref from 'model/Ref'
import { useRef } from 'react'

const lineHeight = 19.6; // 行高 19.6 = 16.8(1.05rem) * 1.166

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


    font-size: 1.05rem; // ${lineHeight}px; // 1.05rem
    line-height: ${lineHeight}px;
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

    &::selection {
        background: #437567; //背景修改為綠色
        color: #f8f8f8; //文字修改為白色
    }
`

export default function TextArea({ width, height, value, onUpdate, srcKey = 'TextArea', nowrap = false, importStyle, searchTrigger, disabled = false }) {

    const isRefMode = value instanceof Ref;

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

    // const mutTextArea = function (val) {
    //     setNowValue(val);
    // }
    let actTextArea = setNowValue;
    if (isRefMode) { // 綁定value
        actTextArea = value.reactive(srcKey, actTextArea);
    }

    // event----------------------------------------

    const handleChange = () => e => {
        // console.log('handleChange value', e.target.value)
        // console.log('handleChange nowValue', nowValue)

        if (isRefMode) {

            // console.log('actTextArea', e.target.value)

            // 代表是ref雙向綁定模式
            actTextArea(e.target.value);
        } else if (onUpdate) {
            // 非雙向綁定模式: 若有onUpdate即丟出事件
            onUpdate(e.target.value);
        }
    }

    // useEffect(function () {
    //     if (!isRefMode) {
    //         // 代表為直接綁定模式

    //         if (value !== nowValue) {
    //             // 代表上層有將字串重新處理過
    //             console.log('eeeee', value, nowValue)
    //         }
    //     }
    // }, [value]);
    if (nowrap) {

        importStyle = { // 不換行的設定
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'scroll',
        }
        // white-space: pre;
        // overflow-wrap: normal;
        // overflow-x: scroll;
    }

    let bindValue;
    if (isRefMode) { // 如果是ref，要從value接收參數異動
        bindValue = nowValue;
    }

    // 測試textarea的光標設定功能
    /*
        const inputRef = useRef();
    
        const test = () => () => {
            console.log('test')
            // const index = 5;
            // var textarea = document.getElementById("textarea_test");
            // console.log('textarea', textarea)
            // textarea.focus();
            // textarea.setSelectionRange(index, index + 8);
            // var val = textarea.value;
            // const text = 'aaa';
            // var start = textarea.selectionStart;
            // const end = textarea.selectionEnd;
    
            // textarea.value = val.slice(0, start) + text + val.slice(end);
            // console.log('textarea.value', JSON.stringify(textarea.value))
            // textarea.focus();
            // textarea.setSelectionRange(1, 1 + 8);
    
            inputRef.current.focus();
        }
    
        
        return (<div onClick={test()}>CCCC</div>
        <textarea
            id="textarea_test" ref={inputRef}></textarea>)
    */

    const textareaRef = useRef();

    const searchKeyword = (keyword, selectionStartOffset = 0, selectionEndOffset = 0) => {
        // selectionStartOffset: 關鍵字的
        // selectionEndOffset: 
        if (!keyword) {
            return;
        }
        if (typeof keyword !== 'string') {
            return;
        }
        if (keyword === '') {
            return;
        }

        const convertToPxNum = function (val) {
            if (typeof val === 'number') {
                return val;
            } else if (typeof val === 'string' && val !== '') {
                const pxStrIndex = val.search(/px/g);
                if (/px$/.test(val)) {
                    return Number(val.slice(0, pxStrIndex));
                } else {
                    return 0; // 代表有可能是rem之類的單位，無法解析
                }
            }
            return 0;
        }
        let textareaHeight = convertToPxNum(height); // textarea 高度
        const halfTextareaHeight = textareaHeight / 2; // 一半高度



        const value = textareaRef.current.value;

        const textPos = value.indexOf(keyword);
        // console.log('textPos', textPos); // 關鍵字位置索引值

        // 1.選取該關鍵字
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(textPos + selectionStartOffset, textPos + keyword.length + selectionEndOffset);

        const prefixStr = value.slice(0, textPos);

        const matchResult = prefixStr.match(/(\r\n|\r|\n)/g);
        const lineNum = matchResult.length;
        // console.log('lineNum', lineNum) // 該關鍵字行數

        const scrollTop = lineNum * lineHeight; // 捲動的高度

        // 2.捲到該位置(置中顯示)
        textareaRef.current.scrollTop = scrollTop - halfTextareaHeight;

        // textareaRef.current.scrollTop = scrollTop * 1.166; // 1.166: BUG (漏掉的行高係數)
        return;
    };
    if (searchTrigger) {
        searchTrigger(searchKeyword);
    }

    return (
        <TextareaStyled
            id="textarea_test"
            width={width} height={height} theme={textAreaThemeObject}
            value={bindValue} onChange={handleChange()}
            style={importStyle}
            ref={textareaRef}
            disabled={disabled}
        ></TextareaStyled>
    );

    // return (
    //     <div>
    //         <div onClick={test()}>CCCC</div>
    //         <TextareaStyled
    //             id="textarea_test"
    //             width={width} height={height} theme={textAreaThemeObject}
    //             value={bindValue} onChange={handleChange()}
    //             style={importStyle}
    //             ref={textareaRef}
    //         ></TextareaStyled>
    //     </div>
    // )
}