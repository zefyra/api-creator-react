import styled from "styled-components";

import LayoutMixin from "util/LayoutMixin"

import { layout as layoutThemeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'
const getTheme = ThemeMixin.fetchGetTheme();
// const navBarTheme = new ThemeMixin(navBarThemeObject);

const PageBottomLayerStyled = styled.div`
// page-layer -----------------------

    display: flex;
    flex-direction: row;

    width: 100%;
    min-height: 100%;

    & .page-main-layer {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        /* background-color: ${getTheme('pageBackground', '#e3edea')}; */

        & .page-title-row {

            display: flex;
            flex-direction: row;

            align-items: center;

            min-height: ${LayoutMixin.pageTitleHeight || '75px'};

            & .page-title-block {

                display: flex;
                flex-direction: row;

                margin-left: 1.5rem;
                /* height: 2rem; */
                /* border-bottom: 3px solid ${getTheme('pageTitleBottomBorder', '#000000')}; */

                /* padding-bottom: 1rem; */

                & .page-title {
                    font-size: 1.6rem;
                    color: ${getTheme('pageTitleText', '#000000')}
                }
            }
            & .extend-slot {
                display: flex;
                flex-direction: row;

                flex-grow: 1;
            }
            /* & .right-slot {
                display: flex;
                flex-direction: row;
            } */
        }

        & .page-content-row {
            display: flex;
            flex-direction: row;
        }
    }

    & .page-aside-layer {

    }
`

export const PageTitle = ({ title, children, titleExtendSlot, asideSlot }) => {
    return (<PageBottomLayerStyled theme={layoutThemeObject}
        className="page-layout-layer">
        <div className="page-main-layer">
            <div className="page-title-row">
                <div className="page-title-block">
                    <div className="page-title">{title}</div>
                    {/* <div className="extend-slot">
                    {titleExtendSlot}
                </div> */}
                </div>
                <div className="extend-slot">
                    {titleExtendSlot}
                </div>
                {/* <div className="right-slot">
                {rightSlot}
            </div> */}
            </div>
            <div className="page-content-row">
                {children}
            </div>
        </div>
        <div className="page-aside-layer">
            {asideSlot}
        </div>
    </PageBottomLayerStyled>);
}