/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

// import styled from 'styled-components';

import { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import { ReactComponent as AngleDownSvg } from 'assets/svg/sr-angle-down.svg'
import { ReactComponent as AngleUpSvg } from 'assets/svg/sr-angle-up.svg'

import LayerMixin from 'util/LayerMixin'

import { select as themeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'

import PatternStyleMixin from 'util/PatternStyleMixin';

import {
    fetchTheme as getTheme, fetchImportStyle
} from 'util/ThemeMixin'
import SelectControl from 'control/SelectControl';
import Ref from 'model/Ref';
import WindowCall from 'util/WindowCall';
// const getTheme = ThemeMixin.fetchGetTheme();
import uniqid from 'uniqid';

const selectTheme = new ThemeMixin(themeObject);

const genId = function (strLen) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < strLen; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const LoadingStyled = styled.div`
height: 65px;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;

`

const DefaultSelect = ({ type = 'default', value, optionList, onUpdate, disabled,
    pattern, importStyle, width, children, control, loading = false, srcKey = 'DefaultSelect',
    placeholder }) => {

    const elementId = genId(8);
    const boxId = uniqid();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    let actDropdownOpen = setDropdownOpen;

    // SelectControl是舊版的寫法，之後刪
    if (control instanceof SelectControl) {
        actDropdownOpen = control.bindDropdownSetter(setDropdownOpen);
    }
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

    const convertValue = function (value) {
        if (!value) {
            return '';
        } else if (typeof value === 'string') {
            return value;
        } else if (value instanceof Ref) {
            return value.getValue();
        } else {
            console.error(`Select: value type is unknown`, value);
            return '';
        }
    }

    const [nowValue, setNowValue] = useState(convertValue(value));
    let actNowValue = setNowValue;
    if (value instanceof Ref) {
        // 單向綁定，當外部數值刷新後，內部跟著刷新，但不連動Ref
        const mutNowValue = value.reactive(srcKey, setNowValue);
        if (!onUpdate) {
            // 代表沒有綁定onUpdate事件，接採用雙向綁定
            actNowValue = mutNowValue;
        }
    }

    useEffect(function () {
        // 更新內部的value數值，觸發刷新
        actNowValue(convertValue(value));
    }, [value]);

    // optionList 初始化------------------------------------------------------

    const convertOptionList = function (optionList) {
        if (!optionList) {
            return [];
        } else if (Array.isArray(optionList)) {
            /* optionList: [{ // 兼容label key的寫法
                label: t(OrderStatusEnum.notConfirm),
                key: OrderStatusEnum.notConfirm,
            }] */
            return optionList.map((option) => {
                if (option.key) { // [Fix]0915 兼容舊版.key的寫法
                    option.value = option.key; // [Fix]0907 將原本的value改掉，原本會吃到組件屬性的value參數
                }
                return option;
            });
        } else if (optionList instanceof Ref) {
            return optionList.getValue();
        } else {
            console.error(`optionList type is unknown`, optionList);
            return [];
        }
    }
    let initOptionList = convertOptionList(optionList);

    if (!Array.isArray(initOptionList)) {
        console.error(`DefaultSelect: initOptionList is invalid`);
    }

    const [innerOptionList, setInnerOptionList] = useState(initOptionList);
    if (optionList instanceof Ref) {
        // innerOptionList綁定Ref
        optionList.reactive(srcKey, setInnerOptionList);
    }

    // 綁定optionList改變
    useEffect(function () {
        setInnerOptionList(convertOptionList(optionList)); // 連帶改變內部的optionList
    }, [optionList]);

    // selectLabel---------------------------------------------------

    let [placeholderShow, setPlaceholderShow] = useState(true);

    // selectLabel---------------------------------------------------
    let [selectLabel, setSelectLabel] = useState((placeholder || ''));

    // useEffect(function () {
    //     console.log(`selectLabel`, selectLabel);
    // }, [selectLabel])

    useEffect(function () {
        // 代表上層的value有改動
        const selectOption = innerOptionList.find((option) => {
            return option.value === `${nowValue}`;
        });

        if (selectOption) {
            setSelectLabel(selectOption.label);
            setPlaceholderShow(false);
        } else {
            setSelectLabel(placeholder || '');
            setPlaceholderShow(true);
        }
    }, [nowValue, innerOptionList]); // 由於optionList有可能重載，因此重載時也要刷新selectLabel


    // --------------------------------------------------------

    const onOptionClick = option => () => {
        actDropdownOpen(false);

        if (onUpdate) {
            onUpdate(option.value);
        } else {
            // 沒有用onUpdate的時候，才使用actNowValue更新數值
            // 1.單純展示，還沒有綁上onUpdate事件
            // 2.可能是Ref雙向綁定
            actNowValue(option.value);
        }

        if (control) {
            // 若有傳control下來，則要一併call
            control.onSelectChanged(option.value);
        }
    }

    const optionComponentArray = [];
    innerOptionList.forEach((option, index) => {
        optionComponentArray.push(
            (<div key={`${index}`} className="option" value={option.value}
                onClick={onOptionClick(option)}>{option.label}</div>)
        );
    });

    const onSelectBoxClick = () => e => {
        e.stopPropagation();

        if (nowDisabled) {
            // 代表禁止修改的狀態
            return;
        }
        // 開啟/關閉Dropdown區塊
        actDropdownOpen(!dropdownOpen);
    }

    let arrowIcon;
    if (dropdownOpen) {
        arrowIcon = <AngleUpSvg className="arrow-icon" fill={selectTheme.getTheme('arrowIcon', '#a1a1a1')} />
    } else {
        arrowIcon = <AngleDownSvg className="arrow-icon" fill={selectTheme.getTheme('arrowIcon', '#a1a1a1')} />
    }

    const SelectPatternStyleMixin = new PatternStyleMixin('Select');
    const patternStyle = SelectPatternStyleMixin.getPatternStyle(pattern);

    // loading----------------------------------------------

    const loadingDom = (
        <LoadingStyled>
            <CircularProgress sx={{ color: selectTheme.getTheme('loading', '#477c68') }} />
        </LoadingStyled>
    );

    const convertLoading = function (loading) {
        if (loading instanceof Ref) {
            return loading.getValue();
        }
        return loading;
    }

    const [nowLoading, setLoading] = useState(convertLoading(loading))
    if (loading instanceof Ref) {
        loading.reactive('DefaultSelect', setLoading);
    }
    useEffect(function () {
        setLoading(convertLoading(loading));
    }, [loading]);

    // render----------------------------------------------------------------

    let dropdownBlockDom = nowLoading ? loadingDom : optionComponentArray;

    if (type === 'slot') {
        return (
            <DefaultCustomSelect id={elementId} theme={themeObject} patternStyle={patternStyle} width={width}
                placeholderShow={placeholderShow}>
                {children}
                <div className="select-dropdown" style={{
                    display: dropdownOpen ? 'block' : 'none',
                }}>
                    {dropdownBlockDom}
                </div>
            </DefaultCustomSelect>
        );
    }


    return (
        <DefaultCustomSelect id={elementId} theme={themeObject} patternStyle={patternStyle} width={width}
            placeholderShow={placeholderShow}>
            <div id={boxId} style={importStyle} className={`select-box ${nowDisabled ? 'disabled' : ''}`} onClick={onSelectBoxClick()}>
                <div className={`select-label ${placeholderShow ? 'placeholder' : ''}`} onClick={onSelectBoxClick()}>
                    {selectLabel}
                </div>
                <div className="arrow-icon-block" onClick={onSelectBoxClick()}>
                    {arrowIcon}
                </div>
            </div>
            <div className="select-dropdown" style={{
                display: dropdownOpen ? 'block' : 'none',
            }}>
                {dropdownBlockDom}
            </div>
        </DefaultCustomSelect>
    );
}

/*
const SelectedLabelStyled = styled.div`
display: flex;
align-items: center;

margin-left: 1rem;

-webkit-user-select: none; // 禁止選取
user-select: none;

color: ${props => props.placeholderShow ? getTheme('selectBoxDisabled', '#838383') : 'auto'};
`
*/


const DefaultCustomSelect = styled.div`
position: relative; // ps.上層必須用relative，下一層的absolute才會參照它的相對位置
    & .select-box {
        display: flex;
        
        /* background-color: #d7a3a3;
        border: 2px solid #9c7676; */
        background-color: ${getTheme('selectBox', '#d7a3a3')};
        border: 2px solid ${getTheme('selectBoxBorder', '#9c7676')};
        border-radius: ${getTheme('selectBoxRaduis', '5px')};

        color: ${getTheme('selectBoxText', '#545454')};

        justify-content: space-between;

        width: ${props => props.width || '18rem'};
        
        height: ${fetchImportStyle('height', '2.3rem')}; /* height: 2.3rem; */
        
        box-sizing: border-box;

        margin-left: ${fetchImportStyle('marginLeft', '')};
        margin-right: ${fetchImportStyle('marginRight', '')};
        margin-top: ${fetchImportStyle('marginTop', '')};
        margin-bottom: ${fetchImportStyle('marginBottom', '')};

        position: relative;


        & .arrow-icon-block {
            display: flex;
            justify-content: center;
            align-items: center;

            position: absolute;
            top: 0.5rem;
            right: 0;

            /* height: 100%; */

            & .arrow-icon {
                width: 1rem;
                height: 1rem;

                margin-right: 0.5rem;
            }
        }

        & .select-label {
            display: flex;
            align-items: center;

            margin-left: 1rem;

            -webkit-user-select: none; // 禁止選取
            user-select: none;

            color: ${props => props.placeholderShow ? getTheme('selectBoxDisabled', '#838383') : 'auto'};
        }
    }
    .select-box.disabled {
        background-color: ${getTheme('selectBoxDisabled', '#6b6b6b')};
        cursor: not-allowed;
    }

    .select-dropdown {
        /* position: fixed;
        top: 0;
        left: 0; */

        position: absolute;
        transform: translateY(6px);
        z-index: ${() => LayerMixin.select};

        width: ${props => props.width || '18rem'};
        min-height: 1rem;
        max-height: 18rem;

        box-sizing: border-box;
        overflow: auto; // 讓scrollbar出現

        background-color: ${getTheme('dropdown', '#c27b7b')};
        color: ${getTheme('dropdownText', '#675757')};
        
        border: 2px solid ${getTheme('dropdownBorder', '#9c7676')};

        border-radius: ${getTheme('dropdownRaduis', '5px')};
        -webkit-user-select: none; // 禁止選取
        user-select: none;

        .option {
            padding: 0.4rem 1rem;
        }
        .option:hover {
            background-color: ${getTheme('dropdownItemHover', '#9c7676')};
        }
    }

    /* width */
    .select-dropdown::-webkit-scrollbar {
        width: 14px;
    }

    /* Track */
    .select-dropdown::-webkit-scrollbar-track {
        /* box-shadow: inset 0 0 5px grey; */
        /* background: #d1d1d1; */
        border-radius: 15px;

        background: transparent;
    }
    
    /* Handle */
    .select-dropdown::-webkit-scrollbar-thumb {
        /* background: #989898; */
        background-color: ${getTheme('dropdownScrollbar', '#cdcdcd')};

        border-radius: 30px;
        
        border: 3px solid transparent; // 用來縮小thumb的寬度
        background-clip: content-box;
        /* box-shadow: inset 0 0 5px #282828; */
    }

    /* Handle on hover */
    .select-dropdown::-webkit-scrollbar-thumb:hover {
        /* background: #dedede; */
        background-color: ${getTheme('dropdownScrollbarHover', '#dedede')};
        border: 3px solid transparent; // 用來縮小thumb的寬度
        background-clip: content-box;
    }
`



export default function Select({ type = 'default', children, optionList, onUpdate,
    disabled, value, pattern, importStyle, width, control, loading, srcKey = 'Select',
    placeholder }) {
    // const optionList = [{
    //     key: 'volvo',
    //     label: 'Volvo'
    // }, {
    //     key: 'saab',
    //     label: 'Saab'
    // }];


    /*
    let optionListRef;
    if (optionList instanceof Ref) {
        optionListRef = optionList;
        optionList = optionListRef.getValue();

        console.log(`optionListRef`, optionListRef)
    }

    if (!optionList) {
        optionList = [];
    }
    */

    /* optionList: [{ // 兼容label value的寫法
        label: t(OrderStatusEnum.notConfirm),
        value: OrderStatusEnum.notConfirm,
    }] */
    /* [OK]
    optionList = optionList.map((eachOption) => {
        eachOption = Object.assign({}, eachOption);

        if (eachOption.value) {
            eachOption.key = eachOption.value;
        }
        return eachOption;
    });
    */




    // console.log(' out optionList', optionList)

    if (type === 'slot') {
        return (<DefaultSelect type={type} width={width} optionList={optionList}
            onUpdate={onUpdate} disabled={disabled} value={value} pattern={pattern}
            importStyle={importStyle} control={control} loading={loading} srcKey={srcKey}>
            {children}
        </DefaultSelect>);
    }

    // type === 'default'
    return (<DefaultSelect width={width} optionList={optionList} onUpdate={onUpdate}
        disabled={disabled} value={value} pattern={pattern} importStyle={importStyle}
        loading={loading} srcKey={srcKey} placeholder={placeholder}
    />);
    // optionListRef={optionListRef} 
}