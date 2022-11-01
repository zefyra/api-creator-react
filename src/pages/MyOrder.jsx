/** @jsxImportSource @emotion/react */
// 偷偷告訴 babel 從 @emotion/react 來引入 runtime jsx
import { jsx } from '@emotion/react'

// import styled from "styled-components";
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { PageTitle } from "module/layout"
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from 'react';

import InputText from "component/InputText";
import FilterPanel from "component/FilterPanel"
import { FilterPanelDash, FilterPanelTitle } from "component/FilterPanel"
import DatePicker from "component/DatePicker"
import Button from "component/Button"
import Select from "component/Select"
import { useSelector, useDispatch } from "react-redux";

import { useUrlQuery } from "util/UrlQuery";

import Table from "component/Table"
import HrLine from "component/HrLine"

import {
    selectOrderId, updateOrderId,
    selectStartDate, updateStartDate,
    selectEndDate, updateEndDate,
    selectOrderStatus, updateOrderStatus,
    selectPayStatus, updatePayStatus,
    selectInvoiceStatus, updateInvoiceStatus,
    selectSelectRow, updateCheckedChange,

    selectNextQuotaPlan, updateNextQuotaPlan,
    selectNextDefaultPrice, updateNextDefaultPrice,
    selectTax, updateTax,
    selectTotalPrice, updateTotalPrice,
    selectNowBindUserNum, updateNowBindUserNum,
    selectIsNowBindUserNumExcess, updateIsNowBindUserNumExcess,
    selectNowQuota, updateNowQuota,
    selectSuggestQuota, updateSuggestQuota,
    selectQuotaInfoList,
} from 'store/order';

import { board as boardThemeObject } from "theme/reas"
import ThemeMixin, { fetchTheme } from "util/ThemeMixin";

import { OrderTableFlow } from 'flow/order'
import NumberFilter from "filter/NumberFilter";

import { OrderStatusEnum, PayStatusEnum, InvoiceStatusEnum } from 'enum/Order'

const decimalSeparatorFilter = new NumberFilter('decimalSeparator');


const QuotaInfoPanel = ({ fetchControl, className }) => {

    const { t } = useTranslation('order', { keyPrefix: 'quotaInfo' });

    const nextQuotaPlan = useSelector(selectNextQuotaPlan);
    const nextDefaultPrice = useSelector(selectNextDefaultPrice);
    const tax = useSelector(selectTax);
    const totalPrice = useSelector(selectTotalPrice);
    const nowBindUserNum = useSelector(selectNowBindUserNum);
    const isNowBindUserNumExcess = useSelector(selectIsNowBindUserNumExcess);
    const nowQuota = useSelector(selectNowQuota);
    const suggestQuota = useSelector(selectSuggestQuota);

    return (
        <div className={className}>
            <FilterPanel>
                <div className="quota-info-column">
                    <div className="quota-info-row">
                        <div className="info-title">
                            {/* 目前已綁定用戶數/購買級距： */}
                            {t('nowBindUserNumAndNowQuota')}
                        </div>
                        <div className="info-content">
                            <div className={`content-number ${isNowBindUserNumExcess ? 'excess' : ''}`}> {`${decimalSeparatorFilter.filt(nowBindUserNum)}`}{/* 12,000 */}</div>
                            <div className="content-text">{`/${decimalSeparatorFilter.filt(nowQuota)}`}{/* /10,000 */}</div>
                            <div className="tag" style={{
                                display: isNowBindUserNumExcess ? 'block' : 'none',
                            }}>
                                {t('quotaNotSufficientTag')}
                                {/* 用量不足，下期將自動升級方案 */}
                            </div>
                        </div>
                    </div>
                    <div className="quota-info-row">
                        <div className="info-title">
                            {t('suggestQuota')}
                            {/* 建議購買級距上限： */}
                        </div>
                        <div className="info-content">
                            <div className="content-text">{`${decimalSeparatorFilter.filt(suggestQuota)}`}{/* 50,000 */}</div>
                        </div>
                    </div>
                    <HrLine style={{
                        marginTop: '1rem',
                    }} importTheme={{
                        hrWidth: '95%',
                        hrBorderWidth: '2px',
                    }}></HrLine>
                    <div className="quota-info-row bottom   ">
                        <div className="num-col">
                            <div className="num-title">
                                {/* 次期預估扣款明細 */}
                                {t('nextQuotaInfo')}
                            </div>
                            <div className="num-block">
                            </div>
                        </div>
                        <div className="num-col">
                            <div className="num-title">
                                {/* 下期級距方案 */}
                                {t('nextQuotaPlan')}
                            </div>
                            <div className="num-block">
                                {/* 50,000人 */}
                                {`${decimalSeparatorFilter.filt(nextQuotaPlan)}人`}
                            </div>
                        </div>
                        <div className="num-col">
                            <div className="num-title">
                                {/* 下次預設收費 */}
                                {t('nextDefaultPrice')}
                            </div>
                            <div className="num-block">
                                {/* $48,000 */}
                                {`$${decimalSeparatorFilter.filt(nextDefaultPrice)}`}
                            </div>
                        </div>
                        <div className="num-col">
                            +
                        </div>
                        <div className="num-col">
                            <div className="num-title">
                                {/* 稅金 */}
                                {t('tax')}
                            </div>
                            <div className="num-block">
                                {/* $240 */}
                                {`$${decimalSeparatorFilter.filt(tax)}`}
                            </div>
                        </div>
                        <div className="num-col">
                            =
                        </div>
                        <div className="num-col">
                            <div className="num-title">
                                {/* 總金額 */}
                                {t('totalPrice')}
                            </div>
                            <div className="num-block">
                                {/* $48,240 */}
                                {`$${decimalSeparatorFilter.filt(totalPrice)}`}
                            </div>
                        </div>

                    </div>
                </div>
            </FilterPanel>
        </div>
    )
};

const QuotaInfoPanelStyled = styled(QuotaInfoPanel)`
    margin-bottom: 1.5rem;

    .quota-info-column {
        display: flex;
        flex-direction: column;
        width: 100%;

        .quota-info-row {
            display: flex;
            flex-direction: row;

            /* margin: 1rem 1rem; */
            margin-top: 1rem;
            margin-left: 1rem;
            margin-right: 1rem;

            .info-title {
                display: flex;
                flex-direction: row;

                align-items: center;

                margin-left: 1.5rem;
            }

            .info-content {
                display: flex;
                flex-direction: row;
                align-items: center;

                margin-left: 1.5rem;

                .content-text {
                    /* margin: 0 0.25rem; */
                    line-height: 2.15rem;
                }
                .content-number {
                    line-height: 2.15rem;
                    color: ${fetchTheme('spotlight', 'blue')};
                }
                .content-number.excess {
                    color: ${fetchTheme('attention', 'red')};
                }
                .tag {
                    margin: 0 1rem;
                    border: 2px solid #cacaca; // 1ba294
                    border-radius: 3px;
                    padding: 0.25rem 0.5rem;

                    box-sizing: border-box;
                    height: 2.15rem;

                    
                    /* display: flex;
                    flex-direction: row;
                    align-items: center; */
                }
            }

            .num-col {
                display: flex;
                flex-direction: column;

                justify-content: center;

                margin: 0 1.5rem;

                .num-title {
                    display: flex;
                    flex-direction: row;
                    margin: 0.5rem 0;
                    
                    align-items: center;
                    justify-content: center;
                }
                .num-block {
                    display: flex;
                    flex-direction: row;

                    min-height: 1.5rem;

                    align-items: center;
                    justify-content: center;

                    /* color: blue; */
                    color: ${fetchTheme('spotlight', '#FFFFFF')};
                }
            }
        }
        .quota-info-row.bottom {
            margin-bottom: 1rem;
        }
    }
`


const OrderFilterPanel = ({ fetchControl }) => {
    // console.log('OrderFilterPanel render')

    const { t } = useTranslation('order', { keyPrefix: 'panel' });

    const dispatch = useDispatch();

    const orderId = useSelector(selectOrderId);
    const startDate = useSelector(selectStartDate);
    const endDate = useSelector(selectEndDate);
    const orderStatus = useSelector(selectOrderStatus);
    const payStatus = useSelector(selectPayStatus);
    const invoiceStatus = useSelector(selectInvoiceStatus);

    const actOrderId = val => dispatch(updateOrderId(val));
    const actStartDate = val => dispatch(updateStartDate(val));
    const actEndDate = val => dispatch(updateEndDate(val));
    const actOrderStatus = val => dispatch(updateOrderStatus(val));
    const actPayStatus = val => dispatch(updatePayStatus(val));
    const actInvoiceStatus = val => dispatch(updateInvoiceStatus(val));

    const orderStatusOptionList = OrderStatusEnum.getOptionList(t);
    const payStatusOptionList = PayStatusEnum.getOptionList(t);
    const invoiceStatusOptionList = InvoiceStatusEnum.getOptionList(t);

    return (
        <FilterPanel>
            {/*訂單編號*/}
            <InputText placeholder={t('orderId')} pattern="query" value={orderId} onUpdate={actOrderId} />
            {/*開始日期*/}
            <DatePicker placeholder={t('startDate')} pattern="query" onUpdate={actStartDate}></DatePicker>
            <FilterPanelDash>-</FilterPanelDash>
            {/*結束日期*/}
            <DatePicker placeholder={t('endDate')} pattern="query" onUpdate={actEndDate}></DatePicker>
            {/* 訂單狀態 */}
            <FilterPanelTitle pattern="query" title={t('orderStatus')}>
                <Select value={orderStatus} optionList={orderStatusOptionList} onUpdate={actOrderStatus}></Select>
            </FilterPanelTitle>
            {/* 支付狀態 */}
            <FilterPanelTitle pattern="query" title={t('payStatus')}>
                <Select value={payStatus} optionList={payStatusOptionList} onUpdate={actPayStatus}></Select>
            </FilterPanelTitle>

            {/* 發票狀態 */}
            <FilterPanelTitle pattern="query" title={t('invoiceStatus')}>
                <Select value={invoiceStatus} optionList={invoiceStatusOptionList} onUpdate={actInvoiceStatus}></Select>
            </FilterPanelTitle>

            {/* 篩選 */}
            <Button type="fill" mode="default" pattern="query" onClick={fetchControl('orderTable').bindHandleQuery()} >{t('query')}</Button>
        </FilterPanel>
    );
}


const MyOrderTable = ({ fetchControl }) => {
    const { t } = useTranslation('order', { keyPrefix: 'table' });
    const dispatch = useDispatch();

    const selectRow = useSelector(selectSelectRow);

    const onCheckedChange = () => (checked, cellInfo) => {
        dispatch(updateCheckedChange(checked, cellInfo));
    };

    const onClickPayAgain = () => () => {
        if (!selectRow) {
            fetchControl('tip').tip('必須選擇一筆訂單');
            return;
        }

        fetchControl('confirm').confirm('確認重新支付？').then((action) => {
            if (action !== 'confirm') {
                return;
            }
        });
    }
    const onClickInvoidAgain = () => () => {
        if (!selectRow) {
            fetchControl('tip').tip('必須選擇一筆訂單');
            return;
        }

        // 辨別該筆訂單是否已開立發票
        // invoiceStatus: 'notInvoice' 未開票 'hasInvoice' 已開票
        if (selectRow.invoiceStatus === InvoiceStatusEnum.hasInvoice) {
            // 代表已開票
            fetchControl('tip').tip('您勾選的訂單範圍中，有發票已被開立，請再進行確認');
            return;
        } else if (selectRow.invoiceStatus === InvoiceStatusEnum.notInvoice) {
            // 未開票，執行重新開票流程
            fetchControl('confirm').confirm('確認是否重新開立發票？').then((action) => {
                if (action !== 'confirm') {
                    return;
                }

                return fetchControl('tip').tip('發票已重新開立');
            });
            return;
        }

        console.error(`unknown invoiceStatus`);
        return;
    }
    const onClickCancelOrder = () => () => {
        if (!selectRow) {
            fetchControl('tip').tip('必須選擇一筆訂單');
            return;
        }

        // [疑問]是否只有「未確認」的資料可以取消開票(?)
        // if (selectRow.orderStatus !== OrderStatusEnum.notConfirm) {
        //     fetchControl('tip').tip('只有未確認訂單可以取消');
        //     return;
        // }
        fetchControl('confirm').confirm('是否取消訂單？').then((action) => {
            if (!action !== 'confirm') {
                return;
            }

            return fetchControl('tip').tip('訂單已取消');
        });
        return;
    }

    const orderTableFlow = fetchControl('orderTable');
    const tableHeader = orderTableFlow.getTableHeader();

    const [tableData, setTableData] = useState(orderTableFlow.getTableData());
    // 將view的tableData的setter註冊進去，這樣才能同步刷新
    orderTableFlow.registTableDataSetter('MyOrderTable', setTableData);

    return (
        <Table header={tableHeader} data={tableData}
            onCheckedChange={onCheckedChange()} onPageChange={orderTableFlow.bindPageChange()}
            pageChangeLock>
            {/* 重新支付 */}
            <Button type="table" mode="default" onClick={onClickPayAgain()}>{t('payAgain')}</Button>
            {/* 重新開票 */}
            <Button type="table" mode="default" onClick={onClickInvoidAgain()}>{t('invoiceAgain')}</Button>
            {/* 取消訂單 */}
            <Button type="table" mode="default" onClick={onClickCancelOrder()}>{t('cancelOrder')}</Button>
        </Table>
    );
}

function MyOrder({ fetchControl }) {
    const translationMenu = useTranslation('menu', { keyPrefix: 'system' });

    const tableFlow = new OrderTableFlow(useRef(null));
    // 綁定url上的get參數的頁數
    tableFlow.setUrlQuery(useUrlQuery());

    useEffect(tableFlow.bindInitLoad(), []); // 觸發首次的API載入

    // 將tableFlow註冊到fetchControl上
    const newFetchControl = fetchControl('regist', 'orderTable', tableFlow);

    return (
        <PageTitle title={translationMenu.t('myOrder')}>
            <QuotaInfoPanelStyled fetchControl={newFetchControl} theme={boardThemeObject} />
            <OrderFilterPanel fetchControl={newFetchControl} />
            <MyOrderTable fetchControl={newFetchControl} />
        </PageTitle>
    )
}
export default MyOrder;