import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import styled from 'styled-components';

import Button from "component/Button";
import { useNavigate, useLocation } from "react-router-dom";

import { fetchTheme, fetchMuiTheme } from 'util/ThemeMixin'

import QuotaRankSlider from 'module/quotaRankSlider';
import { useTranslation } from 'react-i18next';

/*

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import { slider as sliderThemeObject } from 'theme/reas';

const marks = [
    {
        value: 10,
        label: '1000',
        comment: '1,000用戶',
    },
    {
        value: 20,
        label: '5,000',
        comment: '5000用戶',
    },
    {
        value: 36,
        label: '10K',
        comment: '10,000用戶',
    },
    {
        value: 44,
        label: '20K',
        comment: '20,000用戶',
    },
    {
        value: 56,
        label: '100K',
        comment: '100,000用戶',
    },
    {
        value: 66,
        label: '500K',
        comment: '500,000用戶',
    },
];

function valuetext(value) {
    return `${value}`;
}

function valueLabelFormat(value) {
    // const itemIndex = marks.findIndex((mark) => mark.value === value);
    // const markItem = marks[itemIndex];
    // return markItem.comment;
    const markItem = marks.find((mark) => {
        return mark.value === value;
    });
    if (!markItem) {
        return '';
    }
    return markItem.comment;
    // return marks.findIndex((mark) => mark.value === value) + 1;
}


const CrossbotSubscribeSlider = styled(Slider)`

    & .MuiSlider-rail { // 底下的軌道
        color: ${fetchMuiTheme('rail', '#3a8589')};
    }
    & .MuiSlider-track { // 上層的高亮bar條
        color: ${fetchMuiTheme('track', '#3a8589')};
    }
    & .MuiSlider-mark { // 中間的節點
        color: ${fetchMuiTheme('mark', '#3f7173')};
    }
    & .MuiSlider-thumb {
        color: ${fetchMuiTheme('thumb', '#3a8589')};
    }
    & .MuiSlider-thumb:hover {
        box-shadow: 0 0 0 8px rgba(58, 133, 137, 0.16);
    }
    & .MuiSlider-thumb.Mui-focusVisible {
        box-shadow: 0 0 0 8px rgba(58, 133, 137, 0.16);
    }
`
*/


const SpotlightText = ({ children, type = 'spotlight' }) => {
    return (
        <div className={`${type === 'attention' ? 'attention' : 'spotlight'}`}>
            {children}
        </div>
    )
};

const SubscribeBlock = ({ className }) => {

    const { t } = useTranslation('pay', { keyPrefix: 'subscribeBlock' });

    const navigate = useNavigate();

    const onClickButton = type => () => {
        if (type === 'subscribe') {
            navigate('/subscribeQuotaPlan');
        } else if (type === 'upgrade') {
            navigate('/upgradeQuotaPlan');
        }
    }

    return (
        <div className={className}>
            <div className="block-row">
                <div className="block-title">
                    {/* 已開啟方案 */}
                    {t('haveSubscribePlan')}
                </div>
                <div className="block-button-corner">
                    <Button type="fill" mode="default" onClick={onClickButton('subscribe')}>
                        {/* 訂閱 */}
                        {t('subscribe')}
                    </Button>
                    <Button type="fill" mode="default" onClick={onClickButton('upgrade')}>
                        {/* 升級級距 */}
                        {t('upgradeQuota')}
                    </Button>
                    <Button type="fill" mode="default">
                        {/* 終止續約 */}
                        {t('terminateSubscribe')}
                    </Button>
                </div>
            </div>
            <div className="block-row">
                <div className="info-area head">
                    <div className="info-row">
                        {t('userQuota')}{/* 用戶級距 */}:<SpotlightText type="attention">20,000</SpotlightText>{t('user')}{/* 用戶 */}
                    </div>
                </div>
                <div className="info-area">
                    <div className="info-row">
                    {t('overQuota')}{/* 已超量 */}:<SpotlightText type="attention">20</SpotlightText>{t('day')}{/* 天 */}
                    </div>
                    <div className="info-row">
                    {t('nowBindUserNum')}{/* 目前綁定總用戶數 */}:<SpotlightText>24,000</SpotlightText>{t('person')}{/* 人 */}
                    </div>
                </div>
            </div>
            <div className="block-row slider">
                {/* <Slider />
                    disabled 
                    theme={sliderThemeObject}*/}
                {/* <Box sx={{ width: '85%' }}>
                    <CrossbotSubscribeSlider
                        aria-label="Restricted values"
                        defaultValue={20}
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        step={null}
                        valueLabelDisplay="auto"
                        marks={marks}
                        muitheme={sliderThemeObject}
                        disabled
                    />
                </Box> */}
                <QuotaRankSlider disabled></QuotaRankSlider>
            </div>
            <div className="block-row date">
                <div className="row-comment">
                    {`2023/04/31(3/365)`}
                </div>
            </div>
        </div>
    )
};

const SubscribeBlockStyled = styled(SubscribeBlock)`
display: flex;
flex-direction: column;

width: 600px;
/* height: 450px; */

margin-left: 30px;
margin-top: 30px;
/* background-color: #71bd96; */
background-color: ${fetchTheme('board', '#71bd96')};

/* padding: 10px; */

border-radius: ${fetchTheme('boardRadius', '3px')};

    .block-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        margin-bottom: 1rem;
        .block-title {
            margin-left: 1.5rem;
            margin-top: 1.1rem;
        }
        .block-button-corner { // 按鈕區塊

        }
        .info-area {
            display: flex;
            flex-direction: column;
            margin-left: 1.5rem;
            margin-right: 1.5rem;
            & .info-row {
                display: flex;
                flex-direction: row;
                margin: 0.25rem 0;
            }
            & .spotlight {
                color: ${fetchTheme('spotlight', 'blue')};
                margin: 0 0.25rem;
            }
            & .attention {
                color: ${fetchTheme('attention', 'red')};
                margin: 0 0.25rem;
            }
        }
        .info-area.head {
            justify-content: center;
        }
    }
    .block-row.slider {
        margin-left: 1.5rem;
        margin-right: 1.5rem;
        justify-content: center;
    }
    .block-row.date {
        justify-content: flex-end;
        .row-comment {
            margin-right: 1rem;
        }
    }
`

export default SubscribeBlockStyled;