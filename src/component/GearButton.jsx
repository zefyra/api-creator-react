/** @jsxImportSource @emotion/react */
// 偷偷告訴 babel 從 @emotion/react 來引入 runtime jsx
import { jsx } from '@emotion/react'

// import styled from "styled-components";
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import {
    fetchTheme, fetchImportStyle, fetchButtonStyle as getButtonStyle
} from 'util/ThemeMixin'


const GearButton = ({ children, disabled, onClick, qid, className,
    onChange, importStyle, status, setStatus, importCss }) => {

    const handleClick = () => e => {
        if (onClick) {
            onClick(status);
        }
    }

    return (<button css={importCss} style={importStyle} className={`${className} ${status}`}
        qid={qid} disabled={disabled} onClick={handleClick()}>{children}</button>)
}

const GearButtonStyled = styled(GearButton)`
    box-shadow: none;

    /* background-color: #e3edea; */
    background-color: ${getButtonStyle('toggleButton', '#868686')};
    color: ${getButtonStyle('text', '#868686')};
    
    /* border: 2px solid ${getButtonStyle('border', '#868686')}; */
    border: none;
    border-radius: ${fetchTheme('buttonRadius', '4.5px')};

    padding: 0rem ${fetchImportStyle('paddingH', '2.5rem')};

    /* height: ${fetchImportStyle('height', '2.5rem')}; */
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

    /* &.active {
        background-color: ${getButtonStyle('toggleActive', 'red')};
    } */

    /* &:hover
    {
        box-shadow: none;

        background-color: ${getButtonStyle('hover', '#868686')};
        border: 2px solid ${getButtonStyle('borderHover', '#868686')};
        color: ${getButtonStyle('textHover', '#bdbdbd')};

        box-shadow: 0 0 8px 0 ${getButtonStyle('shadowHover', '#335dc799')}, 0 2px 4px 0 ${getButtonStyle('shadowHover', '#335dc799')};
    } */
`;

export default GearButtonStyled;