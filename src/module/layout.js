import styled from "styled-components";

import LayoutMixin from "util/LayoutMixin"

import { layout as layoutThemeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'
const getTheme = ThemeMixin.fetchGetTheme();
// const navBarTheme = new ThemeMixin(navBarThemeObject);

const PageBottomLayerStyled = styled.div`
// page-layer -----------------------

    display: flex;
    flex-direction: column;

    width: 100%;
    min-height: 100%;

    /* background-color: ${getTheme('pageBackground', '#e3edea')}; */

    & .page-title-row {

        display: flex;
        flex-direction: row;

        align-items: center;
        justify-content: space-between;

        min-height: ${LayoutMixin.pageTitleHeight || '75px'};

        & .page-title-block {

            display: flex;
            flex-direction: column;

            min-width: 14rem;

            margin-left: 1.5rem;
            /* height: 2rem; */
            /* border-bottom: 3px solid ${getTheme('pageTitleBottomBorder', '#000000')}; */

            /* padding-bottom: 1rem; */

            & .page-title {
                font-size: 1.6rem;
                color: ${getTheme('pageTitleText', '#000000')}
            }
            /* .page-comment {

            } */
        }
        & .right-slot {
            display: flex;
            flex-direction: row;
        }
    }
`

export const PageTitle = ({ title, children, rightSlot }) => {
    return (<PageBottomLayerStyled theme={layoutThemeObject} className="page-title-layer">
        <div className="page-title-row">
            <div className="page-title-block">
                <div className="page-title">{title}</div>
            </div>
            <div className="right-slot">
                {rightSlot}
            </div>
        </div>
        {children}
    </PageBottomLayerStyled>);
}