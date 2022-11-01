/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

// import styled from "styled-components";

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { board as boardThemeObject } from "theme/reas"
import ThemeMixin, { fetchTheme } from "util/ThemeMixin";

import HrLine from "./HrLine"

import { ReactComponent as MinusSvg } from "assets/svg/br-minus.svg"
import { ReactComponent as PlusSvg } from "assets/svg/br-plus.svg"

import {
    selectPayMode, selectEndDateNowPlan, selectStartDateNextPlan,
    selectEndDateNextPlan, selectDebitedDateNextPlan,
    selectRankQuota,
    selectOriginPrice, selectPayByYearDiscount,
    selectTaxRate, selectTax,
    selectTotalPrice,
    selectPriceAfterDiscount,
    selectPayByYearDiscountRate,
} from 'store/subscribe';
import {
    selectQuotaRankList_u,
    selectTaxRate_u,
    selectQuotaRankSliderValue_u,
    selectPayMode_u, selectNowSubscribeUsersNum_u,

    selectOrderPrice_u, selectOrderPricePerDay_u,
    selectOrderQuota_u, selectOrderRemainDays_u, selectOrderPriceRemain_u,

    selectRankQuota_u, selectQuotaRankPrice_u, selectPricePerPerson_u,
    electQuotaRankPrice_u, selectQuotaRankPricePerDay_u,
    selectQuotaRankPriceRemain_u,
    selectPriceGap_u, selectTax_u, selectTotalPrice_u,

    selectEndDateNowPlan_u, selectStartDateNextPlan_u, selectEndDateNextPlan_u,
    selectDebitedDateNextPlan_u,
} from 'store/subscribeUpgrade';
import { useSelector, useDispatch } from 'react-redux';

const boardTheme = new ThemeMixin(boardThemeObject);


const SubscribeCard = ({ className }) => {

    const { t } = useTranslation('pay', { keyPrefix: 'subscribeQuotaRank' });

    // 年繳or月繳
    const payMode = useSelector(selectPayMode);

    // s3.選擇訂閱用戶級距
    const rankQuota = useSelector(selectRankQuota);
    // s3.原價
    const originPrice = useSelector(selectOriginPrice);
    // s3.年繳8折優惠
    const payByYearDiscount = useSelector(selectPayByYearDiscount);
    // s3.稅金(比率)
    const taxRate = useSelector(selectTaxRate);
    // s3.稅金
    const tax = useSelector(selectTax);
    // s3.總金額
    const totalPrice = useSelector(selectTotalPrice);

    // 折扣後的價錢
    const priceAfterDiscount = useSelector(selectPriceAfterDiscount);

    // 年繳優惠比率
    const payByYearDiscountRate = useSelector(selectPayByYearDiscountRate);

    const showYearDiscount = payMode === 'year';

    return (
        <SubscribeCardStyled theme={boardThemeObject}>
            <div className="card-header">
                <div className="header-title">
                    {/* 選擇訂閱用戶級距： */}
                    {t('selectSubscribeUserQuotaRank')}
                </div>
                <div className="spotlight">
                    {rankQuota}
                    {/* 20,000 */}
                </div>
                {/* 用戶 */}
                {t('selectSubscribeUserQuotaRankUser')}
            </div>
            <div className="card-header">
                <div className="header-title">
                    {/* 選擇付費方案： */}
                    {t('selectPayMode')}
                </div>
                <div className="spotlight">
                    {payMode === 'month' ? t('payMonth') : t('payYear')}
                    {/* {payMode === 'month' ? '月繳' : '年繳'} */}
                    {/* 年繳 */}
                </div>
            </div>
            <HrLine type="subscribeCard" />
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment">
                        {/* 原價 */}
                        {t('originPrice')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="spotlight">
                        {originPrice}
                        {/* 46,560 */}
                    </div>
                </div>
            </div>
            <div style={{
                display: showYearDiscount ? 'flex' : 'none',
            }} className="card-cash">
                <div className="operation-icon-container">
                    <MinusSvg className="operation-icon" fill={boardTheme.getTheme('text', '#000000')} />
                </div>
                <div className="cash-block">
                    <div className="spotlight">
                        ({`${payByYearDiscountRate}`}%&nbsp;off)
                    </div>
                    <div className="comment">
                        {/* 年繳優惠 */}
                        {t('payByYearDiscount')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="spotlight">
                        {payByYearDiscount}
                        {/* 9,312 */}
                    </div>
                </div>
            </div>
            <HrLine type="subscribeCard" style={{
                display: showYearDiscount ? 'flex' : 'none',
            }} />
            <div style={{
                display: showYearDiscount ? 'flex' : 'none',
            }} className="card-cash">
                <div>
                </div>
                <div className="cash-block">
                    <div className="comment">
                        {/* 小計 */}
                        {t('smallCount')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="spotlight">
                        {priceAfterDiscount}
                        {/* 9,312 */}
                    </div>
                </div>
            </div>
            {/* <HrLine type="subscribeCard" /> */}
            <div className="card-cash">
                <div className="operation-icon-container">
                    <PlusSvg className="operation-icon" fill={boardTheme.getTheme('text', '#000000')} />
                </div>
                {/* 純Debug用參數，之後隱藏 */}
                {/* <div>
                    {priceAfterDiscount}
                </div> */}
                <div className="cash-block">
                    <div className="comment">
                        <div className="spotlight">{taxRate}{/* (5%) */}</div>{/* 稅金 */}{t('tax')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="spotlight">
                        {tax}{/* 1863 */}
                    </div>
                </div>
            </div>
            <HrLine type="subscribeCard" />
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment">
                        {/* 總金額 */}
                        {t('totalPrice')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="attention">
                        {totalPrice}
                    </div>
                </div>
            </div>
        </SubscribeCardStyled>
    );
}



const UpgradeCard = ({ className }) => {

    const { t } = useTranslation('pay', { keyPrefix: 'upgradeQuotaRank' });

    // 稅率
    const taxRate = useSelector(selectTaxRate_u);

    // step.2 ----------------------------------------------------------------

    // 已訂閱用戶級距
    const orderQuota = useSelector(selectOrderQuota_u);
    // 已訂閱付費方案  /  選擇付費方案
    const payMode = useSelector(selectPayMode_u);
    // 剩餘天數
    const orderRemainDays = useSelector(selectOrderRemainDays_u);
    // 選擇升級用戶級距
    const rankQuota = useSelector(selectRankQuota_u);
    // 新級距金額
    const quotaRankPriceRemain = useSelector(selectQuotaRankPriceRemain_u);
    // 原級距餘額
    const orderPriceRemain = useSelector(selectOrderPriceRemain_u)
    // 應補差價
    const priceGap = useSelector(selectPriceGap_u);
    // 稅金
    const tax = useSelector(selectTax_u);
    // 總金額
    const totalPrice = useSelector(selectTotalPrice_u);

    // Debug用參數 ----------------------------------------------
    const orderPrice = useSelector(selectOrderPrice_u);
    const orderPricePerDay = useSelector(selectOrderPricePerDay_u);

    const quotaRankPrice = useSelector(selectQuotaRankPrice_u);
    const quotaRankPricePerDay = useSelector(selectQuotaRankPricePerDay_u);
    // const quotaRankPrice = useSelector(selectQuotaRankPrice_u);
    // const quotaRankPrice = useSelector(selectQuotaRankPrice_u);
    // const quotaRankPrice = useSelector(selectQuotaRankPrice_u);

    return (
        <SubscribeCardStyled theme={boardThemeObject}>
            <div className="card-header">
                <div className="header-title">
                    {/* 已訂閱用戶級距： */}
                    {t('subscribedUserRankQuota')}
                </div>
                <div className="spotlight">
                    {orderQuota}
                    {/* 20,000 */}
                </div>
                {/* 用戶 */}
                {t('subscribedUserRankQuotaUserUnit')}
            </div>
            <div className="card-header">
                <div className="header-title">
                    {/* 已訂閱付費方案： */}
                    {t('subscribedPayMode')}
                </div>
                <div className="spotlight">
                    {payMode === 'month' ? t('payMonth') : t('payYear')}
                    {/* 年繳 */}
                </div>
            </div>
            <div className="card-header">
                <div className="header-title">
                    {/* 剩餘天數： */}
                    {t('remainDays')}
                </div>
                <div className="spotlight">
                    {`${orderRemainDays}${t('remainDaysDayUnit')}`}
                    {/* 20日 */}
                </div>
            </div>
            <HrLine type="subscribeCard" />
            <div className="card-header">
                <div className="header-title">
                    {/* 選擇升級用戶級距： */}
                    {t('selectUpgradeUserRankQuota')}
                </div>
                <div className="spotlight">
                    {rankQuota}
                    {/* 20,000 */}
                </div>
                {/* 用戶 */}
                {t('selectUpgradeUserRankQuotaUserUnit')}
            </div>
            <div className="card-header">
                <div className="header-title">
                    {/* 選擇付費方案： */}
                    {t('selectPayMode')}
                </div>
                <div className="spotlight">
                    {payMode === 'month' ? t('payMonth') : t('payYear')}
                    {/* 年繳 */}
                </div>
            </div>
            <HrLine type="subscribeCard" />
            {/* Debug用 <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment">
                        新級距總額
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="cash spotlight">
                        {quotaRankPrice}
                    </div>
                </div>
            </div>
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment spotlight">
                        {quotaRankPrice}
                    </div>
                    <div className="comment">
                        {` /`}
                    </div>
                    <div className="comment spotlight">
                        {payMode === 'year' ? '365' : '30'}
                    </div>
                    <div className="comment">
                        {` =`}
                    </div>
                    <div className="comment spotlight">
                        單位日級距價格
                    </div>
                    <div className="cash spotlight">
                        {quotaRankPricePerDay}
                    </div>
                </div>
            </div>
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment spotlight">
                        {quotaRankPricePerDay}
                    </div>
                    <div className="comment">
                        {` /`}
                    </div>
                    <div className="comment spotlight">
                        {orderRemainDays}
                    </div>
                    <div className="comment">
                        {` =`}
                    </div>
                    <div className="comment spotlight">
                        新級距金額
                    </div>
                    <div className="cash spotlight">
                        {quotaRankPriceRemain}
                    </div>
                </div>
            </div> */}
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment spotlight">
                        {`(${orderRemainDays} days)`}
                        {/* (20 days) */}
                    </div>
                    <div className="comment">
                        {/* 新級距金額 */}
                        {t('newQuotaRankPrice')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="cash spotlight">
                        {quotaRankPriceRemain}
                        {/* 46,560 */}
                    </div>
                </div>
            </div>
            {/* Debug用 <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment">
                        原訂單總額
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="cash spotlight">
                        {orderPrice}
                    </div>
                </div>
            </div>
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment spotlight">
                        {orderPrice}
                    </div>
                    <div className="comment">
                        {` /`}
                    </div>
                    <div className="comment spotlight">
                        {payMode === 'year' ? '365' : '30'}
                    </div>
                    <div className="comment">
                        {` =`}
                    </div>
                    <div className="comment spotlight">
                        單位日殘值
                    </div>
                    <div className="cash spotlight">
                        {orderPricePerDay}
                    </div>
                </div>
            </div>
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment spotlight">
                        {orderPricePerDay}
                    </div>
                    <div className="comment">
                        {` *`}
                    </div>
                    <div className="comment spotlight">
                        {`${orderRemainDays}日`}
                    </div>
                    <div className="comment">
                        {` =`}
                    </div>
                    <div className="comment spotlight">
                        原級距餘額
                    </div>
                    <div className="cash spotlight">
                        {orderPriceRemain}
                    </div>
                </div>
            </div> */}
            <div className="card-cash">
                <div className="operation-icon-container">
                    <MinusSvg className="operation-icon" fill={boardTheme.getTheme('text', '#000000')} />
                </div>
                <div className="cash-block">
                    <div className="comment spotlight">
                        {`(${orderRemainDays} days)`}
                        {/* (20 days) */}
                    </div>
                    <div className="comment">
                        {/* 原級距餘額 */}
                        {t('oldQuotaRankPriceRemain')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="cash spotlight">
                        {orderPriceRemain}
                        {/* 46,560 */}
                    </div>
                </div>
            </div>
            <HrLine type="subscribeCard" />
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment">
                        {/* 應補差價 */}
                        {t('priceGap')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="cash spotlight">
                        {priceGap}
                        {/* 2,000 */}
                    </div>
                </div>
            </div>
            <div className="card-cash">
                <div className="operation-icon-container">
                    <PlusSvg className="operation-icon" fill={boardTheme.getTheme('text', '#000000')} />
                </div>
                <div className="cash-block">
                    <div className="comment">
                        <div className="spotlight">{taxRate}{/* (5%) */}</div>{t('tax')}{/* 稅金 */}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="cash spotlight">
                        {tax}
                        {/* 100 */}
                    </div>
                </div>
            </div>
            <HrLine type="subscribeCard" />
            <div className="card-cash">
                <div></div>
                <div className="cash-block">
                    <div className="comment">
                        {/* 總金額 */}
                        {t('totalPrice')}
                    </div>
                    <div className="comment">
                        NTD$
                    </div>
                    <div className="cash attention">
                        {totalPrice}
                        {/* 2,000 */}
                    </div>
                </div>
            </div>
        </SubscribeCardStyled>
    );

}


const SpotlightText = ({ children, type = 'spotlight' }) => {
    return (
        <div className={`${type === 'attention' ? 'attention' : 'spotlight'}`}>
            {children}
        </div>
    )
};

const ManualInfoCard = () => {

    const { t } = useTranslation('pay', { keyPrefix: 'subscribeQuotaRank' });

    // 年繳or月繳
    const payMode = useSelector(selectPayMode);

    // s3.當前方案結束日期
    const endDateNowPlan = useSelector(selectEndDateNowPlan);
    // s3.下個方案開始日期
    const startDateNextPlan = useSelector(selectStartDateNextPlan);
    // s3.下個方案結束日期
    const endDateNextPlan = useSelector(selectEndDateNextPlan);
    // s3.下個方案扣款日期
    const debitedDateNextPlan = useSelector(selectDebitedDateNextPlan);

    // s3.總金額
    // const totalPrice = useSelector(selectTotalPrice);


    // 折扣後的價錢
    const priceAfterDiscount = useSelector(selectPriceAfterDiscount);

    return (
        <SubscribeCardStyled theme={boardThemeObject}>
            <div className="card-description">
                {t('statement1_part1')}{/* 1. 月計費天數統一為30日，年計費天數統一為365日 */}
            </div>
            <div className="card-description">
                {t('statement2_part1')}{/* 1. 結束時間: 目前選擇方案將於 */}<SpotlightText>{endDateNowPlan}{/* 2022/03/16 */}</SpotlightText><div>{t('statement2_part2')}{/* 結束； */}</div>{t('statement2_part3')}{/* 結束後將自動續約。 */}
            </div>
            <div className="card-description">
                {t('statement3_part1')}{/* 2. 下期開始時間: 下一期從 */}<SpotlightText>{startDateNextPlan}{/* 2022/03/16 */}</SpotlightText>{t('statement3_part2')}{/* 到 */}<SpotlightText>{endDateNextPlan}{/* 2023/03/16 */}</SpotlightText>{t('statement3_part3')}{/* ，實際扣款時間為 */}<SpotlightText>{debitedDateNextPlan}{/* 2022/03/16 */}</SpotlightText>
            </div>
            <div className="card-description">
                {t('statement4_part1')}{/* 3. 續約金額: 方案為 */}<SpotlightText>{payMode === 'month' ? t('payMonth') : t('payYear')}{/* '月繳' '年繳'*/}</SpotlightText>{t('statement4_part2')}{/* ，預估為稅前 */}<SpotlightText type="attention">{`NTD$${priceAfterDiscount}`}{/* NTD$27,248 */}</SpotlightText>{t('statement4_part3')}{/* (屆時以當下實際級距費用為準)，在續約日之前您隨時可以調整方案或取消自動續約。 */}
            </div>
            <div className="card-description">
                {t('statement5_part1')}{/* 4. 若訂閱用戶數超過級距上限，系統將於下期續約時自動以新方案收費。 */}
            </div>
        </SubscribeCardStyled>
    );
}
// const SubscribeCardStyled = styled(SubscribeCard)


const UpgradeManualCard = () => {

    const { t } = useTranslation('pay', { keyPrefix: 'upgradeQuotaRank' });

    const payMode = useSelector(selectPayMode_u);

    const quotaRankPrice = useSelector(selectQuotaRankPrice_u);

    const endDateNowPlan = useSelector(selectEndDateNowPlan_u);
    const startDateNextPlan = useSelector(selectStartDateNextPlan_u);
    const endDateNextPlan = useSelector(selectEndDateNextPlan_u);
    const debitedDateNextPlan = useSelector(selectDebitedDateNextPlan_u);

    return (
        <SubscribeCardStyled theme={boardThemeObject}>
            <div className="card-description">
                {t('statement1_part1')}
                {/* 1. 升級級距補差價=(新級距金額/方案總天數*剩餘天數)-(原本級距金額/方案總天數*剩餘天數) */}
            </div>
            <div className="card-description">
                {t('statement2_part1')}
                {/* 2. 月計費天數統一為30日，年計費天數統一為365日 */}
            </div>
            <div className="card-description">
                {t('statement3_part1')}{/* 2. 結束時間:目前選擇方案將於 */}<SpotlightText>{endDateNowPlan}{/* 2022/03/16 */}</SpotlightText><div>{t('statement3_part2')}{/* 結束； */}</div>{t('statement3_part3')}{/* 結束後將自動續約。 */}
            </div>
            <div className="card-description">
                {t('statement4_part1')}{/* 3. 下期開始時間:下一期從 */}<SpotlightText>{startDateNextPlan}{/* 2022/03/16 */}</SpotlightText>{t('statement4_part2')}{/* 到 */}<SpotlightText>{endDateNextPlan}{/* 2022/03/16 */}</SpotlightText>{t('statement4_part3')}{/* ,實際扣款時間為 */}<SpotlightText>{debitedDateNextPlan}{/* 2022/03/16 */}</SpotlightText>
            </div>
            <div className="card-description">
                {t('statement5_part1')}{/* 4. 續約金額:方案為 */}<SpotlightText>{payMode === 'month' ? t('payMonth') : t('payYear')}</SpotlightText>{t('statement5_part2')}{/* ,預估為稅前 */}<SpotlightText type="attention">NTD${/* 37248 */}{quotaRankPrice}</SpotlightText>{t('statement5_part3')}{/* (屆時以當下實際級距費用為準),在續約日之前您隨時可以調整方案或取消自動續約。 */}
            </div>
            <div className="card-description">
                {t('statement6_part1')}
                {/* 5.若訂閱用戶數超過級距上限,系統將於下期續約時自動以新方案收費。 */}
            </div>
        </SubscribeCardStyled>
    );

}


const SubscribeCardStyled = styled.div`

    margin: 1rem;
    /* background-color: #adadad; */

    border: 2px solid ${fetchTheme('border', '#FFFFFF')};;

    width: 450px;
    min-height: 450px;
    
    flex-shrink: 0;

    display: flex;
    flex-direction: column;

    justify-content: center;

    padding: 1.5rem;

    box-sizing: border-box;


    & .card-header {
        display: flex;
        flex-direction: row;

        font-size: 1.25rem;

        margin-bottom: 0.75rem;
        margin-left: 1rem;
        & .header-title {

        }
        & .spotlight {
            color: ${fetchTheme('spotlight', '#FFFFFF')};
            margin: 0 0.45rem;
        }

    }

    & .card-cash {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
        font-size: 1.25rem;

        & .operation-icon-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            margin-left: 1rem;

            & .operation-icon {
                width: 1rem;
                height: 1rem;
            }
        }
        & .cash-block {
            display: flex;
            flex-direction: row;
            color: ${fetchTheme('text', '#FFFFFF')};

            margin-bottom: 0.5rem;

            & .comment {
                display: flex;
                flex-direction: row;
                margin: 0 0.15rem;
            }

            & .spotlight {
                color: ${fetchTheme('spotlight', '#FFFFFF')};
                margin-left: 0.25rem;
            }

            & .attention {
                color: ${fetchTheme('attention', '#FFFFFF')};
                margin-left: 0.25rem;
            }

            & .cash {
                min-width: 3.7rem;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;

                margin-right: 1.5rem;
            }
        }
    }

    & .card-description {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        margin-bottom: 1.75rem;

        font-size: 1.1rem;

        & .comment {
            flex-shrink: 0;
        }

        & .spotlight {
            flex-shrink: 0;
            color: ${fetchTheme('spotlight', '#FFFFFF')};
            /* margin-left: 0.25rem; */
        }

        & .attention {
            flex-shrink: 0;
            color: ${fetchTheme('attention', '#FFFFFF')};
        }
    }
`

export default function Card({ type }) {

    if (type === 'menualInfo') {
        return (
            <ManualInfoCard></ManualInfoCard>
        );
    } else if (type === 'upgradeCash') {
        return (
            <UpgradeCard></UpgradeCard>
        );
    } else if (type === 'upgradeInfo') {
        return (
            <UpgradeManualCard></UpgradeManualCard>
        );
    }

    return (
        <SubscribeCard></SubscribeCard>
    );
};