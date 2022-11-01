/** @jsxImportSource @emotion/react */
// 偷偷告訴 babel 從 @emotion/react 來引入 runtime jsx
import { jsx } from '@emotion/react'

// import styled from "styled-components";
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { filterPanel as layoutThemeObject } from 'theme/reas'

// import ThemeMixin from 'util/ThemeMixin'
import { fetchTheme as getTheme, fetchImportStyle } from 'util/ThemeMixin'

import LayoutMixin from 'util/LayoutMixin'

import PatternStyleMixin from 'util/PatternStyleMixin'

// const DefaultFilterPanel = ({ children, className }) => {
//     return (<div className={className}>{children}</div>);
// }

const FilterPanelStyled = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;

    flex-wrap: wrap;

    /* width: calc(100% - 8rem); */
    width: ${() => LayoutMixin.getPageBoardWidth()};
    margin-left: 1.5rem;

    background-color: ${getTheme('panel', '#506666')};

    border-radius: ${getTheme('panelRadius', '3px')};

    /* padding: 1rem; */
`

export default function FilterPanel({ children, pattern }) {

    const FilterPanelPatternMixin = new PatternStyleMixin('FilterPanel');

    let patternObj = FilterPanelPatternMixin.getPatternStyle(pattern);
    // console.log('FilterPanel patternObj', patternObj)

    return (<FilterPanelStyled theme={layoutThemeObject} style={patternObj}
        className="filter-panel">{children}</FilterPanelStyled>)
    // return (<div>{children}</div>)
}


// ps. Panel內部無法使用，問題未解決
// const Dash = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: '1rem';
//     height: '2.3rem';
//     margin: '0.5rem';

//     background-color: red;
// `

// const DashStyle = {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '1rem',
//     height: '2.3rem',
//     margin: '0.5rem',
// };


const DashStyled = styled.div`
display: flex;
justify-content: center;
align-items: center;
`


export const FilterPanelDash = function FilterPanelDash({ children, pattern = 'query' }) {

    // let styleObj = Object.assign({}, DashStyle);

    const FilterPanelCommentPatternStyleMixin = new PatternStyleMixin('FilterPanelDash');
    let patternObj = FilterPanelCommentPatternStyleMixin.getPatternStyle(pattern);

    if (pattern === 'panelTitle') {
        patternObj = {
            height: "2.3rem",
            marginBottom: "0rem",
            marginLeft: "1.5rem",
            marginRight: "1.5rem",
            marginTop: "0rem",
        };
        // console.log(`${pattern} patternObj`, patternObj)
    }

    // <div style={styleObj}>{children}</div>
    return (
        <DashStyled style={patternObj}>{children}</DashStyled>
    );
}



export const FilterPanelComment = function FilterPanelComment({ children }) {

    // let styleObj = Object.assign({}, DashStyle);

    const FilterPanelCommentPatternStyleMixin = new PatternStyleMixin('FilterPanelComment');
    const patternObj = FilterPanelCommentPatternStyleMixin.getPatternStyle('query');

    // return (
    //     <div style={styleObj}>{children}</div>
    // );
    return (
        <DashStyled style={patternObj}>
        </DashStyled>
    )
}


const FilterPanelTitleStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    
    margin-left: ${fetchImportStyle('marginLeft', '')};
    margin-right: ${fetchImportStyle('marginRight', '')};
    margin-top: ${fetchImportStyle('marginTop', '')};
    margin-bottom: ${fetchImportStyle('marginBottom', '')};

    .title {
        margin-right: 1rem;
        min-width: ${props => props.titleWidth || 'auto'};
    }
`

export const FilterPanelTitle = function ({ children, title, pattern = 'query', titleWidth }) {
    const patternMixin = new PatternStyleMixin('FilterPanelTitle');
    let patternObj = patternMixin.getPatternStyle(pattern);

    return (
        <FilterPanelTitleStyled patternStyle={patternObj}
            titleWidth={titleWidth}>
            <div className="title">
                {title}
            </div>
            {children}
        </FilterPanelTitleStyled>
    );
}

export const FilterPanelTail = function ({ children, pattern }) {
    const patternMixin = new PatternStyleMixin('FilterPanelTail');
    let patternObj = patternMixin.getPatternStyle(pattern);

    return (
        <FilterPanelTailStyled style={patternObj}>
            {children}
        </FilterPanelTailStyled>
    )
}

export const FilterPanelTailStyled = styled.div`
    display: flex;
    flex-direction: row;

    flex-grow: 1;
    align-items: center;
    justify-content: flex-end;

    
`
