
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import styled from 'styled-components';

import BlankBlock from 'element/Home/BlankBlock'

import { board as boardThemeObject } from 'theme/reas'
import { layout as layoutThemeObject } from 'theme/reas'
import { fetchTheme } from 'util/ThemeMixin'
import Button from "component/Button";
// import ProfileControl from "river/Profile";

function ChartTest({ className }) {

    // 測試API用，之後刪
    const testApiHandle = () => () => {
        // new ProfileControl().autoLoadUserProfile();

        // return ApiSender.sendApi('[get]/permissions').then((apiRes) => {
        //     console.log('aaa apiRes', apiRes.rows);
        // });
    }

    return (
        <div className={className}>
            <div className="block-column">
                <BlankBlock></BlankBlock>
                <div>
                    <Button type="fill" onClick={testApiHandle()}>BBBBBB</Button>
                </div>
                {/* <BlankBlock></BlankBlock> */}
            </div>
            <div className="block-column">
                <BlankBlock></BlankBlock>
                {/* <BlankBlock></BlankBlock>
                <BlankBlock></BlankBlock> */}
            </div>
        </div>
    );
}

const HomeStyled = styled(ChartTest)`
display: flex;
flex-direction: row;
width: 100%;
flex-wrap: wrap;

justify-content: flex-start;
background-color: ${fetchTheme('pageBackground', '#eaeaea')};

    .block-column {
        display: flex;
        flex-direction: column;
        /* min-width: 50%; */
    }
`

export default function HomeExport() {
    return (<HomeStyled theme={layoutThemeObject}></HomeStyled>);
};