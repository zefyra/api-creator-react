// import { css } from '@emotion/react'
// import styled from '@emotion/styled'
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { PageTitle } from "module/layout";

import { board as boardThemeObject } from "theme/reas"
import { fetchTheme } from "util/ThemeMixin";
import ToggleSwitch from "component/ToggleSwitch";
import { useEffect, useState } from "react";

import QuotaRankSlider from "module/quotaRankSlider"
import SubscribeCard from "element/SubscribeQuotaPlan/SubscribeCard"
import HrLine from "element/SubscribeQuotaPlan/HrLine"
import Button from "component/Button";

import {
    selectPayByMonth, selectNowSubscribeUsersNum, selectForwardBuyingQuotaLimit,
    selectPricePerPerson, selectQuotaRankPrice, selectQuotaRankSliderValue,
    selectQuotaRankList, selectPayByYearDiscountRate,
    updatePayByMonth, updateQuotaRankSliderValue, initSubscribeData
} from 'store/subscribe';
import {
    selectQuotaRankList_u,
    selectTaxRate_u,
    selectQuotaRankSliderValue_u,
    selectPayMode_u, selectNowSubscribeUsersNum_u,

    selectOrderQuota_u, selectOrderRemainDays_u, selectOrderPriceRemain_u,

    selectRankQuota_u, selectPricePerPerson_u,
    electQuotaRankPrice_u, selectQuotaRankPricePerDay_u,
    selectQuotaRankPriceRemain_u,
    selectPriceGap_u, selectTax_u, selectTotalPrice_u,

    selectEndDateNowPlan_u, selectStartDateNextPlan_u, selectEendDateNextPlan_u,
    selectDebitedDateNextPlan_u,
    initUpgradeData, updateQuotaRankSliderValue_u
} from 'store/subscribeUpgrade';
import { useSelector, useDispatch } from 'react-redux';
import NumberFilter from "filter/NumberFilter";

const decimalSeparatorFilter = new NumberFilter('decimalSeparator');

const metricPrefixFilter = new NumberFilter('metricPrefix');

// 追加Slider專用的參數
function addSliderField(quotaRankList, userTextSuffix) {
    // userTextSuffix: '用戶'
    /* quotaRankList: [{
        value: 36, // <== 新增
        label: '10K', // <== 新增
        comment: '10,000用戶', // <== 新增
        quota: 10000,
        pricePerPerson: 0.09,
        payByMonthDiscountRate: 0, // 沒折扣=>0
        payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
    }] */

    // 計算出設定slider位置用的value

    // const unit = 100 / (quotaRankList.length - 1);
    const minDist = 100 / (quotaRankList.length - 1);
    // const minDistFloat = 100 / (quotaRankList.length - 1);
    // const minDist = Math.floor(minDistFloat * 100) / 100; // 取小數下2位

    return quotaRankList.map((rankItem, index, arr) => {

        let value = 0;
        if (index === 0) {
            value = 0;
        } else if (index === (arr.length - 1)) {
            value = 100;
        } else {
            value = Math.floor(index * minDist);
        }

        rankItem.value = value;
        rankItem.label = metricPrefixFilter.filt(rankItem.quota);
        rankItem.comment = `${decimalSeparatorFilter.filt(rankItem.quota)}${userTextSuffix}`; // ==> '10,000用戶'
        return rankItem;
    });
}



const QuotaPlan = () => {

    const { t } = useTranslation('pay', { keyPrefix: 'subscribeQuotaRank' });

    const dispatch = useDispatch();

    // s1.月付/年付
    const payByMonth = useSelector(selectPayByMonth);

    // s2.目前訂閱用戶數
    const nowSubscribeUsersNum = useSelector(selectNowSubscribeUsersNum);

    // s2.預先購買級距上限
    const forwardBuyingQuotaLimit = useSelector(selectForwardBuyingQuotaLimit);
    // s2.每人N元
    const pricePerPerson = useSelector(selectPricePerPerson);
    // s2.該級距總價
    const quotaRankPrice = useSelector(selectQuotaRankPrice);
    // s2.購買級距Slider數值
    const quotaRankSliderValue = useSelector(selectQuotaRankSliderValue);

    // 年繳優惠比率
    const payByYearDiscountRate = useSelector(selectPayByYearDiscountRate);

    // API載下來的級距列表
    const quotaRankList = useSelector(selectQuotaRankList);


    useEffect(function () {


        const testQuotaRankList = [{
            quota: 1000, // 額度數值
            pricePerPerson: 0.1, // 每人每月價格
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.2, // 8折折扣比率=>0.2
        },
        {
            quota: 5000,
            pricePerPerson: 0.1,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.2, // 8折折扣比率=>0.2
        },
        {
            quota: 10000,
            pricePerPerson: 0.09,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 20000,
            pricePerPerson: 0.09,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 100000,
            pricePerPerson: 0.08,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 500000,
            pricePerPerson: 0.08,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 1000000,
            pricePerPerson: 0.08,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        }];

        const quotaRankList = addSliderField(testQuotaRankList, t('sliderTextSuffixUser')); // sliderTextSuffixUser: '用戶'

        const apiRes = {
            quotaRankList: quotaRankList,
            /* quotaRankList: [
                {
                    value: 10, // slider的數值
                    label: '1000',
                    comment: '1,000用戶',
                    quota: 1000, // 額度數值
                    pricePerPerson: 0.1,
                    payByMonthDiscountRate: 0, // 沒折扣=>0
                    payByYearDiscountRate: 0.2, // 8折折扣比率=>0.2
                },
                {
                    value: 20,
                    label: '5,000',
                    comment: '5000用戶',
                    quota: 5000,
                    pricePerPerson: 0.1,
                    payByMonthDiscountRate: 0, // 沒折扣=>0
                    payByYearDiscountRate: 0.2, // 8折折扣比率=>0.2
                },
                {
                    value: 36, // slider的數值
                    label: '10K',
                    comment: '10,000用戶',
                    quota: 10000, // 人數額度
                    pricePerPerson: 0.09,
                    payByMonthDiscountRate: 0, // 沒折扣=>0
                    payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
                },
                {
                    value: 44,
                    label: '20K',
                    comment: '20,000用戶',
                    quota: 20000,
                    pricePerPerson: 0.09,
                    payByMonthDiscountRate: 0, // 沒折扣=>0
                    payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
                },
                {
                    value: 56,
                    label: '100K',
                    comment: '100,000用戶',
                    quota: 100000,
                    pricePerPerson: 0.08,
                    payByMonthDiscountRate: 0, // 沒折扣=>0
                    payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
                },
                {
                    value: 66,
                    label: '500K',
                    comment: '500,000用戶',
                    quota: 500000,
                    pricePerPerson: 0.08,
                    payByMonthDiscountRate: 0, // 沒折扣=>0
                    payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
                },
            ],*/
            nowSubscribeUsersNum: 10, // 當前用戶數
            taxRate: 0.05, // 稅率5%
            endDateNowPlan: '2022-08-01T07:57:37.565Z', // 目前選擇方案結束時間
            startDateNextPlan: '2022-08-01T07:57:37.565Z', // 下期開始時間
            endDateNextPlan: '2022-08-01T07:57:37.565Z', // 下期結束時間
            debitedDateNextPlan: '2022-08-01T07:57:37.565Z', // 實際扣款時間
        }

        dispatch(initSubscribeData(apiRes))


    }, []);

    return (
        <QuotaPlanStyled theme={boardThemeObject}>
            <div className="step-row">
                <div className="step-title">
                    {/* 第一步：選擇付費方案 */}
                    {t('step1_title')}
                </div>
                <div className="step-content">
                    <div className="step-content-grid">
                        <div className={`grid-row ${payByMonth ? '' : 'spotlight'}`}>
                            {/* 按年付費 */}
                            {t('payByYear')}
                        </div>
                        <div className="grid-row attention">
                            ({payByYearDiscountRate}%&nbsp;off)
                            {/* 8折 */}
                        </div>
                    </div>
                    <div className="step-content-grid">
                        <ToggleSwitch value={payByMonth} onUpdate={val => dispatch(updatePayByMonth(val))} />
                    </div>
                    <div className="step-content-grid">
                        <div className={`grid-row ${payByMonth ? 'spotlight' : ''}`}>
                            {/* 按月付費 */}
                            {t('payByMonth')}
                        </div>
                    </div>
                </div>
            </div>
            <div className="step-row">
                <div className="step-title">
                    {/* 第二步：選擇訂閱用戶數級距 */}
                    {t('step2_title')}
                </div>
                <div className="step-content-column">
                    <div className="row">
                        <div className="row-title">
                            {/* 目前訂閱用戶數： */}
                            {t('nowSubscribeUserNum')}
                        </div>
                        <div className="row-content">
                            <div className="content-spotlight">
                                {/* 10,500 */}
                                {decimalSeparatorFilter.filt(nowSubscribeUsersNum)}
                            </div>
                            {/* 人 */}
                            {t('nowSubscribeUserNumPersonUnit')}
                        </div>
                    </div>
                </div>
                <div className="step-content-column">
                    <div className="row">
                        <div className="row-title">
                            {/* 預先購買級距上限： */}
                            {t('forwardBuyingQuotaLimit')}
                        </div>
                        <div className="row-content">
                            <div className="content-spotlight">
                                {/* 50,000 */}
                                {decimalSeparatorFilter.filt(forwardBuyingQuotaLimit)}
                            </div>
                            {/* 人 */}
                            {t('forwardBuyingQuotaLimitPersonUnit')}
                            <div className="content-between-space"></div>
                            （<div className="content-spotlight">{pricePerPerson}{/* 0.1 */}</div>{/* /人，共 */}{t('slashPersonAndTotal')}<div className="content-spotlight">{decimalSeparatorFilter.filt(quotaRankPrice)}{/* 4,800 */}</div>{t('forwardBuyingQuotaLimitDolor')}{/* 元 */}）
                        </div>
                    </div>
                </div>
                <div className="step-slider-row">
                    {/* defaultValue={20} */}
                    <QuotaRankSlider width="85%" value={quotaRankSliderValue}
                        onUpdate={val => dispatch(updateQuotaRankSliderValue(val))}
                        quotaRankList={quotaRankList}
                    ></QuotaRankSlider>
                </div>
            </div>
            <div className="step-row">
                <div className="step-title">
                    {/* 第三步：確認金額 */}
                    {t('step3_title')}
                </div>
                <div className="step-content-row">
                    <SubscribeCard></SubscribeCard>
                    <SubscribeCard type="menualInfo"></SubscribeCard>
                </div>
            </div>
            {/* width="94%" */}
            {/* <hr /> */}
            {/* <div className="hr-container">
                <div className="hr-line"></div>
            </div> */}
            <HrLine />
            <div className="question-row">
                <div className="question-comment">
                    {/* 什麼是訂閱用戶數？ */}
                    {t('question1')}
                </div>
                <div className="answer-comment">
                    {/* 訂閱用戶數指的是曾與機器人互動過並且沒有封鎖您的社群帳號的人數，即是機器人可以有效接觸的用戶人數，訂閱用戶數不等於臉書粉絲人數或者 LINE 好友人數。 */}
                    {t('answer1_line1')}
                </div>
            </div>
            <div className="question-row">
                <div className="question-comment">
                    {/* 若訂閱期間，用戶數超過會發生什麼事？ */}
                    {t('question2')}
                </div>
                <div className="answer-comment">
                    {/* 系統會於下期扣款日自動以新方案收費並且加收上期的超量差額。 */}
                    {t('answer2_line1')}
                </div>
                <div className="answer-comment">
                    {/* 使用者可以選擇自動升級或者停止訂閱用戶數增加。 */}
                    {t('answer2_line2')}
                </div>
                <div className="answer-comment">
                    {/* 如果選擇停止訂閱用戶數增加，機器人將不會再與新開啟對話的用戶互動，但使用者還是可以到臉書粉專或者 LINE 後台回覆用戶訊息。 */}
                    {t('answer2_line3')}
                </div>
            </div>
            <div className="question-row">
                <div className="question-comment">
                    {/* 我可以隨時改變付費方案嗎？ */}
                    {t('question3')}
                </div>
                <div className="answer-comment">
                    {/* 您可至平台「首頁」＞「已開啟方案」，選擇「終止續約」。 */}
                    {t('answer3_line1')}
                </div>
                <div className="answer-comment">
                    {/* 註：您原本的付費方案仍可使用到期限截止日，但在到期後，crossbot即停用不再扣款。 */}
                    {t('answer3_line2')}
                </div>
            </div>
            <div className="button-row">
                <Button type="fill" mode="primary">{/* 我要付款 */}{t('iPay')}</Button>
            </div>
        </QuotaPlanStyled>
    )
};

const UpgradePlan = ({ fetchControl }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('pay', { keyPrefix: 'upgradeQuotaRank' });
    // API載下來的級距列表
    const quotaRankList = useSelector(selectQuotaRankList_u);
    // 購買級距Slider數值
    const quotaRankSliderValue = useSelector(selectQuotaRankSliderValue_u);

    // step.1 ----------------------------------------------------------------

    // 目前訂閱用戶數
    const nowSubscribeUsersNum = useSelector(selectNowSubscribeUsersNum_u);

    // 預先購買級距上限 / 選擇升級用戶級距
    const rankQuota = useSelector(selectRankQuota_u);
    // 每人N元
    const pricePerPerson = useSelector(selectPricePerPerson_u);

    // 該級距總價(不顯示)
    // const quotaRankPrice = useSelector(selectQuotaRankPrice_u);

    // 共10,800元
    const quotaRankPriceRemain = useSelector(selectQuotaRankPriceRemain_u);


    useEffect(function () {

        const testQuotaRankList = [{
            quota: 1000, // 額度數值
            pricePerPerson: 0.1, // 每人每月價格
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.2, // 8折折扣比率=>0.2
        },
        {
            quota: 5000,
            pricePerPerson: 0.1,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.2, // 8折折扣比率=>0.2
        },
        {
            quota: 10000,
            pricePerPerson: 0.09,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 20000,
            pricePerPerson: 0.09,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 100000,
            pricePerPerson: 0.08,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 500000,
            pricePerPerson: 0.08,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        },
        {
            quota: 1000000,
            pricePerPerson: 0.08,
            payByMonthDiscountRate: 0, // 沒折扣=>0
            payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
        }];

        const quotaRankList = addSliderField(testQuotaRankList, t('sliderTextSuffixUser')); // sliderTextSuffixUser: '用戶'

        const apiRes = {
            quotaRankList: quotaRankList,
            /*
            quotaRankList: [
                {
                    value: 36, // slider的數值
                    label: '10K',
                    comment: '10,000用戶',
                    quota: 10000,
                    pricePerPerson: 0.09,
                    payByMonthDiscountRate: 0, // 沒折扣=>0
                    payByYearDiscountRate: 0.25, // 8折折扣比率=>0.2
                }
                },
            ],*/
            nowSubscribeUsersNum: 4900, // 當前用戶數
            taxRate: 0.05, // 稅率5%
            endDateNowPlan: '2022-08-01T07:57:37.565Z', // 目前選擇方案結束時間
            startDateNextPlan: '2022-08-01T07:57:37.565Z', // 下期開始時間
            endDateNextPlan: '2022-08-01T07:57:37.565Z', // 下期結束時間
            debitedDateNextPlan: '2022-08-01T07:57:37.565Z', // 實際扣款時間
            // -----------------------------------------
            unexpiredOrder: { // 當前未過期的訂單
                quota: 5000, // 級距
                price: 5040, // 總金額: 該訂單的購買總額
                payMode: 'year', // 年繳or月繳
                remainDays: 130, // 剩餘天數
            }
        };

        if (apiRes.unexpiredOrder.remainDays <= 0) {
            // '剩餘天數不能為0'
            fetchControl('tip').tip(t('remainDaysZeroIsInvalid'));
            // ps.剩餘天數若為0，會造成公式除以0的BUG
            return;
        }

        dispatch(initUpgradeData(apiRes));
    }, []);


    return (
        <QuotaPlanStyled theme={boardThemeObject}>
            <div className="step-row">
                <div className="step-title">
                    {/* 第一步：選擇欲升級之訂閱用戶數級距 */}
                    {t('step1_title')}
                </div>
                <div className="step-content-column">
                    <div className="row">
                        <div className="row-title">
                            {/* 目前訂閱用戶數： */}
                            {t('nowSubscribedUserNum')}
                        </div>
                        <div className="row-content">
                            <div className="content-spotlight">
                                {/* 10,500 */}
                                {decimalSeparatorFilter.filt(nowSubscribeUsersNum)}
                            </div>
                            {/* 人 */}
                            {t('nowSubscribedUserNumPersonUnit')}
                        </div>
                    </div>
                </div>
                <div className="step-content-column">
                    <div className="row">
                        <div className="row-title">
                            {/* 預先購買級距上限： */}
                            {t('forwardBuyingQuotaLimit')}
                        </div>
                        <div className="row-content">
                            <div className="content-spotlight">
                                {/* 50,000 */}
                                {/* {rankQuota} */}
                                {decimalSeparatorFilter.filt(rankQuota)}
                            </div>
                            {/* 人 */}
                            {t('forwardBuyingQuotaLimitPersonUnit')}
                            <div className="content-between-space"></div>
                            （<div className="content-spotlight">{pricePerPerson}{/* 0.1 */}</div>{t('slashPersonAndTotal')}{/* /人，共 */}<div className="content-spotlight">{decimalSeparatorFilter.filt(quotaRankPriceRemain)}{/* 4,800 */}</div>{t('forwardBuyingQuotaLimitDolor')}{/* 元 */}）
                        </div>
                    </div>
                </div>
                <div className="step-slider-row">
                    <QuotaRankSlider width="85%" value={quotaRankSliderValue}
                        onUpdate={val => dispatch(updateQuotaRankSliderValue_u(val))}
                        quotaRankList={quotaRankList}
                    ></QuotaRankSlider>
                </div>
            </div>
            <div className="step-row">
                <div className="step-title">
                    {/* 第二步：確認金額 */}
                    {t('step2_title')}
                </div>
                <div className="step-content-row">
                    <SubscribeCard type="upgradeCash"></SubscribeCard>
                    <SubscribeCard type="upgradeInfo"></SubscribeCard>
                </div>
            </div>
            <div className="button-row">
                <Button type="fill" mode="primary">{/* 我要付款 */}{t('iPay')}</Button>
            </div>
        </QuotaPlanStyled>
    );
}


const QuotaPlanStyled = styled.div`

    background-color: ${fetchTheme('board', '#3fb6c8')};

    width: 1015px;
    margin: 1.5rem;
    border-radius: 5px;

   display: flex;
   flex-direction: column;

   /* padding-top: 0.5rem; */

   & .step-row {
        display: flex;
        flex-direction: column;
        margin: 1.5rem 1.5rem 0 1.5rem;

        & .step-title {
            /* display: flex; */
            /* flex-direction: column; */

            font-weight: bold;
            
            color: ${fetchTheme('text', '#FFFFFF')};

            margin-bottom: 0.5rem;
        }

        & .step-content {
            display: flex;
            flex-direction: row;

            color: ${fetchTheme('text', '#FFFFFF')};

            /* justify-content: flex-start;
            align-items: center; */

            & .step-content-grid {
                display: flex;
                flex-direction: column;

                height: 5rem;
                
                justify-content: center;
                align-items: center;

                margin: 0 1.5rem;

                .grid-row {
                    display: flex;
                    
                    font-weight: bold;
                }
                .grid-row.attention {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                
                    color: ${fetchTheme('attention', 'red')};
                }
                .grid-row.spotlight {
                    display: flex;
                    flex-direction: row;
                    /* justify-content: center; */
                
                    color: ${fetchTheme('spotlight', 'red')};
                }
            }

        }
        
        & .step-slider-row {
            width: 100%;

            display: flex;
            flex-direction: row;

            /* justify-content: center; */

            padding-left: 5%;

            margin-top: 1.5rem;
        }
        & .step-content-row {
            width: 100%;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            /* justify-content: center; */

            /* padding-left: 5%;

            margin-top: 1.5rem; */
        }
        & .step-content-column {
            width: 100%;

            display: flex;
            flex-direction: column;

            /* justify-content: center; */

            /* padding-left: 5%;

            margin-top: 1.5rem; */

            padding-top: 1.15rem;

            & .row {
                display: flex;
                flex-direction: row;
                & .row-title {
/* margin-left: 1.5rem;
margin-right: 1rem; */
                }
                & .row-content {
                    display: flex;
                    flex-direction: row;

                    .content-spotlight {
                        color: ${fetchTheme('spotlight', 'red')};

                        margin: 0 0.25rem;
                    }
                    .content-between-space {
                        width: 0.75rem;
                    }
                }
            }
        }
   }
   & .question-row {
        margin: 1.5rem;

        & .question-comment {
            margin-bottom: 0.75rem;
            font-weight: bold;
            color: ${fetchTheme('text', '#FFFFFF')};
        }

        & .answer-comment {
            margin: 0.15rem 0;
            color: ${fetchTheme('text', '#FFFFFF')};
        }
   }

   & .button-row {
        display: flex;
        flex-direction: row;

        justify-content: center;

        margin-bottom: 1rem;
   }
`

function SubscribeQuotaPlan({ fetchControl, mode }) {
    const translationMenu = useTranslation('menu', { keyPrefix: 'hide' });

    if (mode === 'upgrade') {
        return (
            <PageTitle title={translationMenu.t('upgradeQuotaPlan')}>
                <UpgradePlan fetchControl={fetchControl}>
                </UpgradePlan>
            </PageTitle>
        )
    }

    return (
        <PageTitle title={translationMenu.t('subscribeQuotaPlan')}>
            <QuotaPlan fetchControl={fetchControl}>
            </QuotaPlan>
        </PageTitle>
    )
}
export default SubscribeQuotaPlan;