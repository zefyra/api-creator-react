/** @jsxImportSource @emotion/react */
// 偷偷告訴 babel 從 @emotion/react 來引入 runtime jsx
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'


import ThemeMixin, { fetchTheme } from 'util/ThemeMixin'

import { ReactComponent as CancelIconSvg } from 'assets/svg/rr-cross-circle.svg'

// import { tagSelector as tagSelectorThemeObject } from 'theme/reas';
// import { inputText as inputTextThemeObject } from 'theme/reas'
import { inputTag as inputTagThemeObject } from 'theme/reas'

const inputTagTheme = new ThemeMixin(inputTagThemeObject);

const InputTagStyled = styled.div`
width: 100%;
min-height: 2.3rem;

background-color: ${fetchTheme('inputBox', '#5e9aaf')};

border-width: 2px;
border-style: solid;
border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
border-radius: ${fetchTheme('inputBoxRaduis', '3px')};

display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: flex-start;
flex-wrap: wrap;

/* padding: 0.5rem 0.5rem; */
padding: 0.2rem 0 0.2rem 0.2rem;
/* padding-top: 0.2rem;

padding-left: 0.2rem; */

box-sizing: border-box;

cursor: pointer;

    .tag {
        background-color: ${fetchTheme('tag', '#cacaca')};
        border-radius: ${fetchTheme('tagRaduis', '3px')};

        padding: 0.25rem 2rem 0.25rem 1rem;
        /* margin: 0.5rem 0.5rem; */
        margin-right: 0.2rem;

        /* border-width: 2px;
        border-style: solid;
        border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
        border-radius: ${fetchTheme('inputBoxRaduis', '3px')}; */

        position: relative;

        .cancel-icon {
            position: absolute;
            width: 1.25rem;
            height: 1.25rem;

            right: 3px;
            top: 5px;
            cursor: pointer;
        }
    }
`
export default function InputTag({ type, tagList, onClick, onCancelTag, importStyle }) {
    // type: 'formItem'

    const handleCancel = tagItem => e => {
        e.stopPropagation();
        if (onCancelTag) {
            onCancelTag(tagItem);
        }
    }

    let tagListDom = tagList.map((tagItem, index, arr) => {

        // 最後一個元素要加 .tail
        return (
            <div key={`tagItem_${index}`} className={`tag${index === (arr.length - 1) ? ' tail' : ''}`}>
                {tagItem.label}
                <CancelIconSvg className="cancel-icon" fill={inputTagTheme.getTheme('cancelIcon', '#3b4b45')}
                    onClick={handleCancel(tagItem)} />
            </div>
        )
    });

    if (type === 'formItem') {
        // 代表是要放在formModal內顯示的
        return (
            <InputTagStyled theme={inputTagThemeObject} onClick={onClick}
                style={importStyle}>
                {tagListDom}
            </InputTagStyled>
        )
    }

    console.error(`TagInputBox not support type`);

    return (<div></div>)
}