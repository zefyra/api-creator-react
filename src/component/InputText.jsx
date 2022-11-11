/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import React, { useEffect, useState } from "react";
// import styled from 'styled-components';

import { inputText as themeObject } from 'theme/reas'
import { pagination as paginationThemeObject } from 'theme/reas'

import { fetchTheme as getTheme, fetchImportStyle } from 'util/ThemeMixin'
import { ReactComponent as CancelIconSvg } from 'assets/svg/rr-cross-circle.svg'

import PatternStyleMixin from 'util/PatternStyleMixin'
import NumberFilter from "filter/NumberFilter";
import NumberValidator from 'validator/NumberValidator'
import Ref from "model/Ref";
import ValueModeEnum from 'enum/component/ValueModeEnum';
const InputTextPatternStyleMixin = new PatternStyleMixin('InputText')

// 不能用，這個只能填入已存在的attr
// const InputTextStyled = styled.input.attrs(props => ({
//     qid: props.qid, // 設定額外的attribute到DOM上
// }))`


// 一般的輸入框
// const InputTextStyled = styled(InputTextStyledBase)`
const InputTextStyled = styled.input`
    /* height: 2rem; */
    /* width: ${props => props.width || '18rem'}; */
    width: ${fetchImportStyle('width', '18rem')};
    /* border-width: 0; // 無外框版 */
    
    background-color: ${getTheme('inputBox', '#5e9aaf')};
    color: ${getTheme('inputBoxText', '#5d5d5d')};

    outline: none; // 關閉亮起的外框
    border-width: 2px;
    border-style: solid;
    border-color: ${getTheme('inputBoxBorder', '#cacaca')};
    border-radius: ${getTheme('inputBoxRaduis', '3px')};

    /* height: 2.3rem; */
    height: ${fetchImportStyle('height', '2.3rem')};

    font-size: 1.05rem;
    text-align: left;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

    margin-left: ${fetchImportStyle('marginLeft', '0px')};
    margin-right: ${fetchImportStyle('marginRight', '0px')};
    margin-top: ${fetchImportStyle('marginTop', '0px')};
    margin-bottom: ${fetchImportStyle('marginBottom', '0px')};

    /* margin-top: 20px; */

    /* ${props => props.importStyle} */

    &.focus {
        outline: none; // 關閉亮起的外框
    }

    &::placeholder {
        color: ${getTheme('inputBoxPlaceholder', '#5d5d5d')};
        /* opacity: 1; */
    }
    &:disabled {
        background-color: ${getTheme('inputBoxDisabled', '#d4c1c1')};
        cursor: not-allowed;
    }
`;


const InputTextStyledBase = ({ placeholder, value, onChange,
    disabled, onFocus, onBlur, qid, id, onClick, style, onKeyDown, type,
    importClass, importStyle, patternStyle }) => {

    if (typeof value !== 'string') {
        if (value === null) { // null時不能顯示null字樣
            value = '';
        } else {
            value = `${value}`; // 一律轉成字串
        }
    }

    // console.log('type', type)

    let inputTypeAttr;
    if (type === 'password') {
        inputTypeAttr = 'password';
        // console.log('inputTypeAttr', inputTypeAttr)
    }

    return (
        <InputTextStyled type={inputTypeAttr} theme={themeObject} style={style} placeholder={placeholder}
            value={value} onChange={onChange} disabled={disabled}
            onFocus={onFocus} onBlur={onBlur} qid={qid} id={id}
            onClick={onClick} onKeyDown={onKeyDown} className={importClass}
            importStyle={importStyle} patternStyle={patternStyle}
        ></InputTextStyled>
    )
    // className={inputTextClassName} 

    // return (
    //     <input style={style} className={inputTextClassName} placeholder={placeholder}
    //         value={value} onChange={onChange} disabled={disabled}
    //         onFocus={onFocus} onBlur={onBlur} qid={qid} id={id}
    //         onClick={onClick} onKeyDown={onKeyDown}
    //     ></input>
    // );
}



// 開發到一半
const InputTextCancelStyledBase = ({ className, placeholder, value, onChange,
    disabled, onFocus, onBlur, qid, id, onClick, style, onKeyDown,
    importStyle, patternStyle }) => {

    const onClickOk = () => () => {
        console.log('onClickOk')
    }

    // console.log('style', style)

    return (
        <div style={style} className={className}>
            <input placeholder={placeholder}
                value={value} onChange={onChange} disabled={disabled}
                onFocus={onFocus} onBlur={onBlur} qid={qid} id={id}
                onClick={onClick} onKeyDown={onKeyDown}
            ></input>
            <CancelIconSvg fill="#3b4b45" onClick={onClickOk()} />
        </div >
    );
}

// 開發到一半
// 有取消按鈕的輸入框
const InputTextCancelStyled = styled(InputTextCancelStyledBase)`
    /* display: 'inline-block'; */
    /* display: ${fetchImportStyle('width', 'inline-block')}; */
    width: ${fetchImportStyle('width', '18rem')};
    /* width: 120px; */
    /* height: 1rem; */
    /* height: ${fetchImportStyle('height', '2.3rem')}; */
    position: relative;

    /* display: inline-table; */
    input {
        position: relative;
        width: 100%;

        background-color: ${getTheme('inputBox', '#5e9aaf')};
        color: ${getTheme('inputBoxText', '#5d5d5d')};

        outline: none; // 關閉亮起的外框
        border-width: 2px;
        border-style: solid;
        border-color: ${getTheme('inputBoxBorder', '#cacaca')};
        border-radius: ${getTheme('inputBoxRaduis', '3px')};

        height: ${fetchImportStyle('height', '2.3rem')};

        font-size: 1.05rem;
        text-align: left;
        padding-left: 0.7rem;
        padding-right: 0.7rem;
        box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長
    }

    svg {
        position: absolute;
        
        right: 7px;
        top: 7px;

        width: 1.25rem;
        height: 1.25rem;

        cursor: pointer;

        /* float: right; // 置右 */
        /* transform: translateY(10px); */
    }
    
    /* background-color: ${getTheme('inputBox', '#5e9aaf')};
    color: ${getTheme('inputBoxText', '#5d5d5d')};

    outline: none; // 關閉亮起的外框
    border-width: 2px;
    border-style: solid;
    border-color: ${getTheme('inputBoxBorder', '#cacaca')};
    border-radius: ${getTheme('inputBoxRaduis', '3px')};

    height: ${fetchImportStyle('height', '2.3rem')};

    font-size: 1.05rem;
    text-align: left;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

    margin-left: ${fetchImportStyle('marginLeft', '0px')};
    margin-right: ${fetchImportStyle('marginRight', '0px')};
    margin-top: ${fetchImportStyle('marginTop', '0px')};
    margin-bottom: ${fetchImportStyle('marginBottom', '0px')}; */

    /* &.focus {
        outline: none; // 關閉亮起的外框
    }

    &::placeholder {
        color: ${getTheme('inputBoxPlaceholder', '#5d5d5d')};
    }
    &:disabled {
        background-color: ${getTheme('inputBoxDisabled', '#d4c1c1')};
        cursor: not-allowed;
    } */
`;


const PaginationInputText = ({ value, setValue, onChange, min, max }) => {
    value = `${value}`;
    if (!/^\d+$/.test(value)) {
        // console.log('invalid init value: ', value);
        value = '1';
    }

    // v1: 自己生成參數的版本
    // const [inputNum, setInputNum] = useState(value);

    // v2: 對接上層參數的版本
    let inputNum = value;
    let setInputNum = setValue;

    const actInputNum = function (value) {
        // console.log(`actInputNum: ${value}`);
        let num = Number(value);

        if (max !== undefined) {
            if (num >= max) {
                num = max;
            }
        }
        if (min !== undefined) {
            if (num <= min) {
                num = min;
            }
        }

        // console.log(`setInputNum: `, Number(e.target.value));
        setInputNum(`${num}`);
    }

    const onInputNumChange = () => e => {
        // console.log('onInputNumChange e', e);
        // console.log('onInputNumChange val', e.target.value);

        if (!/^\d+$/.test(e.target.value)) {
            // console.log('not number')
            // 代表不是數字

            if (e.target.value === '') {
                setInputNum(1);
            }

            return;
        }

        actInputNum(e.target.value);
        /*
        let num = Number(e.target.value);

        if (max !== undefined) {
            if (num >= max) {
                num = max;
            }
        }
        if (min !== undefined) {
            if (num <= min) {
                num = min;
            }
        }

        // console.log(`setInputNum: `, Number(e.target.value));
        setInputNum(`${num}`);
        */
    };

    const handleKeyDown = () => e => {
        // console.log('handleKeyDown key', e.key)

        // "ArrowUp"
        // ""

        // ArrowDown

        if (e.key === 'Enter') {
            if (onChange) {
                onChange(Number(inputNum));
            }
        } else if (e.key === 'ArrowUp') {
            // console.log(`inputNum`, inputNum);
            actInputNum(Number(inputNum) + 1);
        } else if (e.key === 'ArrowDown') {
            actInputNum(Number(inputNum) - 1);
        }
    }

    // return (<input
    //     className={className} value={inputNum}
    //     onChange={onInputNumChange()} onKeyDown={handleKeyDown()}
    // ></input>);

    return (
        <PaginationInputTextStyled value={inputNum}
            onChange={onInputNumChange()} onKeyDown={handleKeyDown()}
            theme={paginationThemeObject} ></PaginationInputTextStyled>
    );
}

// const PaginationInputTextStyled = styled(PaginationInputText).attrs(props => {
//     return {
//         onChange: props.onChange, // 補上內部的input屬性的串接
//         onKeyDown: props.onKeyDown,
//     };
// })`


const PaginationInputTextStyled = styled.input`

    width: 3.5rem;
    background-color: ${getTheme('inputBox', '#5e9aaf')};
    color: ${getTheme('inputBoxText', '#5d5d5d')};

    outline: none; // 關閉亮起的外框
    border-width: 2px;
    border-style: solid;
    border-color: ${getTheme('inputBoxBorder', '#cacaca')};
    border-radius: ${getTheme('inputBoxRaduis', '3px')};

    height: 2.5rem;

    font-size: 1.05rem;
    text-align: center;
    padding-left: 0.45rem;
    padding-right: 0.45rem;
    box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

    margin: 0.5rem;

    &.focus {
        outline: none; // 關閉亮起的外框
    }

    &::placeholder {
        color: ${getTheme('inputBoxPlaceholder', '#5d5d5d')};
        /* opacity: 1; */
    }
    &:disabled {
        background-color: ${getTheme('inputBoxDisabled', '#d4c1c1')};
        cursor: not-allowed;
    }
`;



const DefaultInputText = ({ placeholder, value, onUpdate, validate,
    onValidate, debounceInterval, throttleInterval, width, disabled,
    importStyle, onFocus, onBlur, qid, id, pattern, onClick, style,
    onKeyDown, onEnter, type, baseValue, importClass, srcKey = 'DefaultInputText' }) => {

    // disabled --------------------------------------

    const convertDisabled = function (disabled) {
        if (disabled === undefined) {
            return false;
        } else if (typeof disabled === 'boolean') {
            return disabled;
        } else if (disabled instanceof Ref) {
            return disabled.getValue();
        } else {
            console.error(`disabled type is unknown`, disabled);
            return false;
        }
    }

    const [nowDisabled, setNowDisabled] = useState(convertDisabled(disabled));
    if (disabled instanceof Ref) {
        disabled.reactive(srcKey, setNowDisabled);
    }
    useEffect(function () {
        setNowDisabled(convertDisabled(disabled));
    }, [disabled]);

    // value --------------------------------------

    // 將原本的靜態變數value置換成動態的

    const valueMode = value instanceof Ref ? ValueModeEnum.ref : ValueModeEnum.value;

    const convertValue = function (value) {
        if (valueMode === ValueModeEnum.value) {
            return value || '';
        } else if (valueMode === ValueModeEnum.ref) {
            return value.getValue();
        } else {
            console.error(`InputText: value type is unknown`, value);
            return '';
        }
    }

    let nowValue = value; // ValueModeEnum.value模式
    let actNowValue;

    const [refValue, setRefValue] = useState(convertValue(value));

    if (valueMode === ValueModeEnum.ref) {
        nowValue = refValue;

        // 雙向綁定
        actNowValue = value.reactive(srcKey, setRefValue);
    }

    // -----------------------------------------

    // 節流
    const throttle = function () {
        // 這個是節流
        // if (debounceTimeout) {
        //     // 代表已有排程，不執行
        //     return;
        // }
        // setDebounceTimeout(setTimeout(function () {
        //     callback();
        //     setDebounceTimeout(null);
        // }, debounceInterval));
    };

    // ---------------------------------------------------------------

    let debounceTimeout;
    let setDebounceTimeout;
    if (debounceInterval) {
        // 代表有需要做防抖
        [debounceTimeout, setDebounceTimeout] = useState(null);
    }
    // 防抖
    const debounce = function (callback) {
        // 這個是節流
        // if (debounceTimeout) {
        //     // 代表已有排程，不執行
        //     return;
        // }
        // setDebounceTimeout(setTimeout(function () {
        //     callback();
        //     setDebounceTimeout(null);
        // }, debounceInterval));
    }

    // 數值驗證------------------------------------------
    // const [valid, setValid] = useState(false);
    let valid;
    let setValid;

    if (validate) {
        // 有設定validate才增加欄位
        [valid, setValid] = useState(false);
    }

    const doValidate = function (value) {
        if (!validate) {
            // 代表沒有設定validate，略過
            return;
        }

        const currentValid = validate(value)

        if (currentValid !== valid) {
            // 數值有變，代表需要呼叫更新(這樣一來就不會高頻呼叫)
            setValid(currentValid);
            onValidate(currentValid);
        }
    };


    const onInputTextChange = () => e => {
        // console.log(`onInputTextChange`, e.target.value);
        const outValue = e.target.value;

        if (valueMode === ValueModeEnum.value) {
            if (onUpdate) {
                onUpdate(outValue);
            }
        } else if (valueMode === ValueModeEnum.ref) { // value使用Ref的情況
            if (onUpdate) { // 有onUpdate，給它完全接手
                onUpdate(outValue);
            } else { // 沒有onUpdate，執行雙向綁定的連動
                actNowValue(outValue);
            }
        }

        // 執行數值驗證----------------------------------------

        // 舊版: 直接高頻執行
        // doValidate(e.target.value);

        let filterFunc;
        if (debounceInterval) {
            filterFunc = debounce;
        } else if (throttleInterval) {
            filterFunc = throttle;
        } else {
            filterFunc = function (callback) {
                return callback()
            }
        }

        filterFunc(function () {
            doValidate(e.target.value);
        });
    }


    let patternStyle = InputTextPatternStyleMixin.getPatternStyle(pattern);

    const onInputTextKeyDown = () => e => {
        if (onKeyDown) {
            onKeyDown(e);
        }

        if (e.key === 'Enter') {
            if (onEnter) {
                onEnter(e);
            }
        }
    }

    // return (
    //     <InputTextStyled theme={themeObject} placeholder={placeholder}
    //         value={nowValue} onChange={onInputTextChange()} disabled={nowDisabled}
    //         width={width} importStyle={importStyle} onFocus={onFocus} onBlur={onBlur}
    //         qid={qid} id={id} patternStyle={patternStyle} onClick={onClick}
    //         style={style} onKeyDown={onInputTextKeyDown()} importClass={importClass} />
    // )

    return (
        <InputTextStyledBase placeholder={placeholder}
            value={nowValue} onChange={onInputTextChange()} disabled={nowDisabled}
            width={width} importStyle={importStyle} onFocus={onFocus} onBlur={onBlur}
            qid={qid} id={id} patternStyle={patternStyle} onClick={onClick}
            style={style} onKeyDown={onInputTextKeyDown()} importClass={importClass}
            type={type} />
    );
};


const InputNumber = ({ placeholder, value, onUpdate,
    disabled, width,
    importStyle, onFocus, onBlur, qid, id, pattern, onClick, style,
    type = 'integer', baseValue, max, min, underDot, srcKey = 'InputNumber' }) => {
    // type: 'integer', 'float'

    // value --------------------------------------

    // 將原本的靜態變數value置換成動態的

    const convertValue = function (value) {
        if (!value) {
            return '';
        } else if (typeof value === 'number') {
            return `${value}`;
        } else if (typeof value === 'string') {
            return value;
        } else if (value instanceof Ref) {
            return `${value.getValue()}`;
        } else {
            console.error(`InputNumber: value type is unknown`, value);
            return '';
        }
    }

    const [nowValue, setNowValue] = useState(convertValue(value));
    let actNowValue = setNowValue;
    let updateRef; // 雙向綁定用的輸入: value為ref，且不使用onUpdate時

    if (value instanceof Ref) {
        // 單向綁定，當外部數值刷新後，內部跟著刷新，但不連動Ref
        const mutNowValue = value.reactive(srcKey, actNowValue);
        if (!onUpdate) {
            // 代表沒有綁定onUpdate事件，接採用雙向綁定
            actNowValue = mutNowValue;
            updateRef = actNowValue;
        }
    }

    useEffect(function () {
        // 更新內部的value數值，觸發刷新
        actNowValue(convertValue(value));
    }, [value]);

    // ----------------------------------------------------

    const removeLeadingZeroFilter = new NumberFilter('removeLeadingZero');
    const integerValidator = new NumberValidator('integer');


    const unsignedIntegerFilter = function (value, output) {
        if (!value) {
            if (baseValue !== undefined) {
                return output(baseValue);
            }

            // 全部刪掉時，自動回傳null
            return output(null);
        }
        if (!integerValidator.validate(value)) {
            // 代表根本不是整數
            return;
        }

        // 消除開頭的0
        const intStr = removeLeadingZeroFilter.filt(value);
        const intNum = Number(intStr);

        if (max) {
            if (intNum > max) {
                // 大於上限
                return;
            }
        }
        if (min) {
            if (intNum < min) {
                // 小於下限
                return;
            }
        }
        output(intNum);
        return;
    }

    // float必須要額外綁一個view的字串
    const [floatStr, setFloatStr] = useState(convertValue(value));
    const floatValidator = new NumberValidator('float', {
        underDot: underDot,
    });
    const unsignedFloatFilter = function (value, output) {
        if (!value) {
            if (baseValue !== undefined) {
                setFloatStr(`${baseValue}`);
                return output(baseValue);
            }

            // 全部刪掉時，自動回傳null
            setFloatStr('');
            return output(null);
        }
        if (!floatValidator.validate(value)) {
            return;
        }
        // return output(removeLeadingZeroFilter.filt(value));
        const filtFloatStr = removeLeadingZeroFilter.filt(value);
        const floatNum = Number(filtFloatStr)
        if (max) {
            if (floatNum > max) {
                // 大於上限
                return;
            }
        }
        if (min) {
            if (floatNum < min) {
                // 小於下限
                return;
            }
        }
        output(floatNum);

        setFloatStr(filtFloatStr);
        output(floatNum);
        return;
    }

    const onInputTextChange = () => e => {
        const value = e.target.value;

        // updateRef: 雙向綁定輸入
        let updateFunc = onUpdate || updateRef;

        if (updateFunc) {
            if (type === 'integer') {
                return unsignedIntegerFilter(value, updateFunc);
            } else if (type === 'float') {
                return unsignedFloatFilter(value, updateFunc);
            }
            return updateFunc(value);
        }
    }

    let patternStyle = InputTextPatternStyleMixin.getPatternStyle(pattern);

    let valueEntity;
    if (type === 'float') {
        // value = floatStr;
        valueEntity = floatStr;
    } else if (type === 'integer') {
        valueEntity = nowValue;
    }

    // return (
    //     <InputTextStyled theme={themeObject} placeholder={placeholder}
    //         value={valueEntity} onChange={onInputTextChange()} disabled={disabled}
    //         width={width} importStyle={importStyle} onFocus={onFocus} onBlur={onBlur}
    //         qid={qid} id={id} patternStyle={patternStyle} onClick={onClick}
    //         style={style} type={type} />
    // )

    return (
        <InputTextStyledBase placeholder={placeholder}
            value={valueEntity} onChange={onInputTextChange()} disabled={disabled}
            width={width} importStyle={importStyle} onFocus={onFocus} onBlur={onBlur}
            qid={qid} id={id} patternStyle={patternStyle} onClick={onClick}
            style={style} type={type} />
    )
};


export default function InputText({ placeholder, value, onUpdate, validate,
    onValidate, debounceInterval, disabled, width, importStyle, onFocus,
    onBlur, qid, id, pattern, type, onChange, min, max, setValue,
    onClick, style, onKeyDown, onEnter, baseValue, underDot, importClass,
    srcKey
}) {
    /*
    InputText使用參數
    placeholder, value, onUpdate, validate,
    onValidate, debounceInterval, disabled, width, importStyle, pattern

    DatePicker使用參數
    onFocus, onBlur, qid, id

    Pagination使用參數
    type, onChange, min, max, setValue

    Table的TdTextEditable使用參數
    onClick, style
    */

    if (type === 'pagination') {
        // return (<PaginationInputTextStyled value={value} setValue={setValue}
        //     onChange={onChange} theme={paginationThemeObject} min={min} max={max}
        // ></PaginationInputTextStyled>);
        return (<PaginationInputText value={value} setValue={setValue}
            onChange={onChange} min={min} max={max}
        ></PaginationInputText>);
        // theme={paginationThemeObject} 
    }

    // type: 'default'(預設), 'cancel'(有叉叉紐), 'integer', 'float'


    if (type === 'integer' || type === 'float') {
        return (<InputNumber placeholder={placeholder} value={value}
            onUpdate={onUpdate} validate={validate} onValidate={onValidate}
            debounceInterval={debounceInterval} disabled={disabled} width={width}
            importStyle={importStyle} onFocus={onFocus} onBlur={onBlur} qid={qid}
            id={id} pattern={pattern} type={type} onClick={onClick} style={style}
            onKeyDown={onKeyDown} onEnter={onEnter} baseValue={baseValue}
            min={min} max={max} underDot={underDot} srcKey={srcKey}
        ></InputNumber>);
    }

    return (<DefaultInputText placeholder={placeholder} value={value}
        onUpdate={onUpdate} validate={validate} onValidate={onValidate}
        debounceInterval={debounceInterval} disabled={disabled} width={width}
        importStyle={importStyle} onFocus={onFocus} onBlur={onBlur} qid={qid}
        id={id} pattern={pattern} type={type} onClick={onClick} style={style}
        onKeyDown={onKeyDown} onEnter={onEnter} baseValue={baseValue}
        min={min} max={max} importClass={importClass} srcKey={srcKey}
    ></DefaultInputText>);
}