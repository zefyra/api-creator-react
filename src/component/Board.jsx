/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import LayoutMixin from 'util/LayoutMixin'

import { fetchTheme } from 'util/ThemeMixin'

const BoardStyled = styled.div`
// table-container------------------------------------
display: block;

margin-top: 1.5rem;
margin-left: 1.5rem;
margin-bottom: 1.5rem;

// width: calc(100% - 8rem)
width: ${() => LayoutMixin.getPageBoardWidth()};

background-color: ${fetchTheme('tableContainer', '#cba165')};
border-radius: ${fetchTheme('tableContainerRadius', '5px')};
`

const TabBoardStyled = styled.div`
display: flex;
flex-direction: column;

width: 95%; // 自動填滿

justify-content: center;
align-items: flex-start;

margin-left: 1.5rem;
margin-bottom: 1.5rem;

    & .board-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: #ebf1f0;
            
        border-radius: 5px 5px 5px 5px;
    }
    & .board-container.tab {
        border-radius: 0px 5px 5px 5px;
    }
    /* & .board-container.column {
        display: flex;
        flex-direction: column;
    } */
`

export default function Board({ type, children }) {


    if (type === 'tabBoard') {
        return (
            <TabBoardStyled>
                <div className="board-container tab">
                    {children}
                </div>
            </TabBoardStyled>
        )
    }

    // if (type === 'column') {
    //     return (
    //         <TabBoardStyled>
    //             <div className="board-container column">
    //                 {children}
    //             </div>
    //         </TabBoardStyled>
    //     )
    // }

    return (
        <TabBoardStyled>
            <div className="board-container">
                {children}
            </div>
        </TabBoardStyled>
    )
}