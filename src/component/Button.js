import styled from 'styled-components';
import { button as themeObject } from 'theme/reas'
// import { fetchTheme as getTheme, fetchImportStyle, fetchButtonStyle as getButtonStyle } from 'util/ThemeMixin'
import {
    fetchTheme as getTheme, fetchImportStyle, fetchButtonStyle as getButtonStyle
} from 'util/ThemeMixin'

import GearButton from "./GearButton"

import { useState, useEffect } from "react"

import PatternStyleMixin from 'util/PatternStyleMixin';
import Ref from 'model/Ref';
const ButtonPatternStyleMixin = new PatternStyleMixin('Button');


const FillButtonStyledBase = ({ children, disabled, onClick, qid, className, importClass }) => {

    let buttonClassName = className;
    if (importClass) {
        buttonClassName = `${buttonClassName} ${importClass}`;
    }

    return (<button className={buttonClassName} qid={qid} disabled={disabled} onClick={onClick}>{children}</button>)
}

const FillButtonStyled = styled(FillButtonStyledBase)`
    box-shadow: none;

    background-color: ${getButtonStyle('button', '#868686')};
    color: ${getButtonStyle('text', '#868686')};
    
    border: 2px solid ${getButtonStyle('border', '#868686')};
    border-radius: ${getTheme('buttonRadius', '4.5px')};

    padding: ${fetchImportStyle('paddingV', '0')} ${fetchImportStyle('paddingH', '2.5rem')};


    width: ${fetchImportStyle('fixWidth', 'auto')};
    height: ${fetchImportStyle('fixHeight', 'auto')};
    min-height: ${fetchImportStyle('height', '2.5rem')};

    margin-left: ${fetchImportStyle('marginLeft', '0.75rem')};
    margin-right: ${fetchImportStyle('marginRight', '0.75rem')};
    margin-top: ${fetchImportStyle('marginTop', '0.75rem')};
    margin-bottom: ${fetchImportStyle('marginBottom', '0.75rem')};

    flex-shrink: 0; // 避免放在flex當中時遭到擠壓，導致文字擠成一團

    cursor: pointer;
    

    &:hover, &:active, &:focus
    {
        box-shadow: none;
        /* border: 0px solid transparent; // 關閉border(因為會增加按鈕size) */
        /* border: 2px solid #868686; */

        background-color: ${getButtonStyle('hover', '#868686')};
        border: 2px solid ${getButtonStyle('borderHover', '#868686')};
        color: ${getButtonStyle('textHover', '#bdbdbd')};

        /* box-shadow: 0 0 8px 0 rgb(232 237 250 / 60%), 0 2px 4px 0 rgb(232 237 250 / 60%); */
        /* box-shadow: 0 0 8px 0 rgba(51, 93, 199, 0.6), 0 2px 4px 0 rgba(51, 93, 199, 0.6); */
        box-shadow: 0 0 8px 0 ${getButtonStyle('shadowHover', '#335dc799')}, 0 2px 4px 0 ${getButtonStyle('shadowHover', '#335dc799')};
    }
    
    &:disabled{
        background-color: ${getButtonStyle('disabled', '#868686')};
        border: 2px solid ${getButtonStyle('borderDisabled', '#868686')};
        color: ${getButtonStyle('textDisabled', '#bdbdbd')};

        cursor: not-allowed;

        box-shadow: none;
    }
`;



const ToggleButton = ({ children, disabled, onClick, qid, className,
    onChange, importStyle, active, setActive, value = false, srcKey }) => {

    const convertValue = function (value) {
        if (!value) { // 代表沒設定value屬性
            return false;
        } else if (typeof value === 'boolean') {
            return value;
        } else if (value instanceof Ref) {
            return value.getValue();
        } else {
            console.error(`Button: value type is unknown`, value);
            return false;
        }
    }

    const [toggleActive, setToggleActive] = useState(convertValue(value));

    // const [nowValue, setNowValue] = useState(convertValue(disabled));
    // let actNowValue = setNowValue;

    let actToggleActive = setToggleActive;
    if (value instanceof Ref) {
        if (!srcKey) {
            console.error(`ToggleButton: must have srcKey when use Ref`);
            srcKey = 'temp_Button_value_srcKey';
        }
        actToggleActive = value.reactive(srcKey, actToggleActive);
    }
    useEffect(function () {
        actToggleActive(convertValue(value));
    }, [value]);

    // ---------------------------------------------------------

    // if (!active && !setActive) { // 沒設定外部變數、由內部取代
    //     active = toggleActive;
    //     setActive = setToggleActive;
    // }

    let nowActive = active ? active : toggleActive;

    const handleClick = () => e => {
        if (onClick) {
            onClick(e);
        }

        const newEnable = !nowActive;

        actToggleActive(newEnable);
        if (setActive) {
            setActive(newEnable);
        }

        if (onChange) {
            onChange(newEnable);
        }
    }

    return (<button className={`${className} ${nowActive ? 'active' : ''}`}
        style={importStyle} qid={qid} disabled={disabled}
        onClick={handleClick()}>{children}</button>)
}

const ToggleButtonStyled = styled(ToggleButton)`
    box-shadow: none;

    background-color: ${getButtonStyle('toggleButton', '#868686')};
    color: ${getButtonStyle('text', '#868686')};
    
    border: none;
    border-radius: ${getTheme('buttonRadius', '4.5px')};

    padding: 0rem ${fetchImportStyle('paddingH', '2.5rem')};

    min-height: ${fetchImportStyle('height', '2.5rem')};

    margin-left: ${fetchImportStyle('marginLeft', '0.75rem')};
    margin-right: ${fetchImportStyle('marginRight', '0.75rem')};
    margin-top: ${fetchImportStyle('marginTop', '0.75rem')};
    margin-bottom: ${fetchImportStyle('marginBottom', '0.75rem')};

    flex-shrink: 0; // 避免放在flex當中時遭到擠壓，導致文字擠成一團

    /* box-sizing: border-box; */

    cursor: pointer;

    user-select: none;

    /* , &:active, &:focus */

    &.active {
        background-color: ${getButtonStyle('toggleActive', 'red')};
    }

    /* &:hover
    {
        box-shadow: none;

        background-color: ${getButtonStyle('hover', '#868686')};
        border: 2px solid ${getButtonStyle('borderHover', '#868686')};
        color: ${getButtonStyle('textHover', '#bdbdbd')};

        box-shadow: 0 0 8px 0 ${getButtonStyle('shadowHover', '#335dc799')}, 0 2px 4px 0 ${getButtonStyle('shadowHover', '#335dc799')};
    } */
`;


const IconButton = ({ importStyle, onClick, children }) => {

    return (
        <IconButtonStyled onClick={onClick} style={importStyle}>
            {/* <QuestionSquareIconSvg className="question-icon" fill="#FFFFFF" onClick={onClickQuestion} /> */}
            {children}
        </IconButtonStyled>
    );
}

const IconButtonStyled = styled.div`
width: 27px;
height: 27px;
margin: 0.35rem;

display: flex;
flex-direction: row;
justify-content: center;
align-items: center;

transform: translateY(2px);

background-color: #296a61;
border-radius: 3px;

cursor: pointer;
& .icon {
    width: 19px;
    height: 19px;
    /* transform: translateY(1px); */
    /* margin: 0.35rem; */
    border-radius: 2px;
    /* box-shadow: 0 0 10px #def0ee ; */
}
&:hover {
    box-shadow: 0 0 10px #def0ee;
    /* border: 2px solid #def0ee;
    box-sizing:border-box; */

    background-color: #85e1d5;
}
`


export default function Button({ children, type, mode, pattern, onClick, disabled,
    importStyle, qid, onChange, active, setActive, status, setStatus, importCss, importClass,
    srcKey, value }) {

    // console.log('importStyle', importStyle)

    const handleClick = () => (e) => {
        // 偽造上層的onClick寫法，這樣上層就可以用一般的onClick來綁定函式
        // 上層寫法: <Button onClick={onResendVerifyMail()}>重發驗證信</Button>
        // console.log('Button handleClick');

        if (onClick) {
            return onClick(e);
        }
    }

    // disabled <Ref>-----------------------------------------------------------

    const convertDisabled = function (disabled) {
        if (!disabled) {
            return false;
        } else if (typeof disabled === 'boolean') {
            return disabled;
        } else if (disabled instanceof Ref) {
            return disabled.getValue();
        } else {
            console.error(`Button: disabled type is unknown`, disabled);
            return false;
        }
    }
    const [nowDisabled, setNowDisabled] = useState(convertDisabled(disabled));
    let actNowDisabled = setNowDisabled;
    if (disabled instanceof Ref) {
        if (!srcKey) {
            console.error(`Button: must have srcKey when use Ref`);
            srcKey = 'temp_Button_SrcKey';
        }
        actNowDisabled = disabled.reactive(srcKey, actNowDisabled);
    }
    useEffect(function () {
        actNowDisabled(convertDisabled(disabled));
    }, [disabled]);
    // -----------------------------------------------------------


    let patternStyle;


    if (type === 'fill') { // contained
        if (!mode) {
            mode = 'primary';
        }
        // console.log('btn importStyle', importStyle);

        patternStyle = ButtonPatternStyleMixin.getPatternStyle(pattern);
        return (<FillButtonStyled disabled={nowDisabled} theme={themeObject} type={mode}
            onClick={handleClick()} importStyle={importStyle} patternStyle={patternStyle}
            qid={qid}>{children}</FillButtonStyled>);
    } else if (type === 'icon') {
        return (<IconButton importStyle={importStyle} onClick={onClick}>{children}</IconButton>);
    } else if (type === 'toggle') {
        if (!mode) {
            mode = 'default';
        }
        patternStyle = ButtonPatternStyleMixin.getPatternStyle(pattern);
        return (<ToggleButtonStyled disabled={nowDisabled} theme={themeObject} type={mode}
            onClick={handleClick()} importStyle={importStyle} patternStyle={patternStyle}
            qid={qid} onChange={onChange} active={active}
            setActive={setActive} value={value} srcKey={srcKey}
        >{children}</ToggleButtonStyled>);
    } else if (type === 'gear') {
        if (!mode) {
            mode = 'default';
        }
        patternStyle = ButtonPatternStyleMixin.getPatternStyle(pattern);
        return (<GearButton disabled={nowDisabled} theme={themeObject} type={mode}
            onClick={handleClick()} importStyle={importStyle} patternStyle={patternStyle}
            qid={qid} onChange={onChange} status={status} setStatus={setStatus}
            importCss={importCss}>{children}</GearButton>);
    } else if (type === 'table') {
        if (!mode) {
            mode = 'primary';
        }

        // patternStyle = ButtonPatternStyleMixin.getPatternStyle(pattern);

        // 自動導入預設的patternStyle
        patternStyle = {
            marginLeft: '0px',
            marginTop: '0px',
            marginBottom: '0px',
        };
        return (<FillButtonStyled disabled={nowDisabled} theme={themeObject}
            type={mode} onClick={handleClick()} importStyle={importStyle}
            patternStyle={patternStyle} qid={qid} importClass={importClass}
        >{children}</FillButtonStyled>);
    }

    // 尚未支援
    // type === 'hollow' // outlined

    return (<button>{children}</button>);
};

/*
https://element.eleme.io/#/zh-CN/component/button

<el-button>默认按钮</el-button>
<el-button type="primary">主要按钮</el-button>
<el-button type="success">成功按钮</el-button>
<el-button type="info">信息按钮</el-button>
<el-button type="warning">警告按钮</el-button>
<el-button type="danger">危险按钮</el-button>


樸素按鈕 plain

圓角按鈕 round

圓形按鈕 circle
*/