/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

// import styled from "styled-components"
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { board as boardThemeObject } from "theme/reas"
import { fetchTheme } from "util/ThemeMixin"

// const subscribeQuotaPlanHr = css`
//     margin-top: 1.5rem;
// `

// const subscribeCardHr = css`
//     margin-top: 1rem;
//     margin-bottom: 1rem;
// `


const HrContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .hr-line {
        width: ${fetchTheme('hrWidth', '100%')};

        border-bottom: ${fetchTheme('hrBorderWidth', '1px')} solid ${fetchTheme('hr', '#1520ff')};
    }
`

export default function HrLineExport({ type = 'subscribeQuotaPlan', style, importTheme, importClass }) {

    let themeObject = boardThemeObject;
    if (importTheme) {
        themeObject = Object.assign({}, themeObject)
        themeObject = Object.assign(themeObject, importTheme)
    }

    return (
        <HrContainer className={importClass} css={[style]} theme={themeObject}>
            <div className="hr-line">
            </div>
        </HrContainer>
    );
}


