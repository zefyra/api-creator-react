/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

// import CheckBox from 'component/CheckBox';
import { useSelector, useDispatch } from 'react-redux';

import {
    selectConsumeStartDate, updateConsumeStartDate,
    selectConsumeEndDate, updateConsumeEndDate,
    selectConsumeStatus, updateConsumeStatus,
    selectOrderId, updateOrderId,
} from "store/social"
import { useState, useRef, useEffect } from 'react';
import InputText from 'component/InputText';
import DatePicker from "component/DatePicker"
import Select from 'component/Select'
import Button from "component/Button"

// import ThemeMixin, { fetchTheme } from 'util/ThemeMixin';


// import CountyModel from 'model/County'
// import FamilyEnum from 'enum/social/Family';
// import UserCheckEnum from 'enum/social/UserCheck';
import { useTranslation } from 'react-i18next';
import { ModalTabForm, InputRow } from 'vision/TabModal';
import { ConsumeStatusEnum } from 'enum/social/ConsumeStatus';
import { ConsumeBehaviorTableFlow } from 'flow/social';
import Table from 'component/Table';




const ConsumeBehaviorCss = css`
    & .query-row {
        /* min-width: 648px; */
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        flex-grow: 0;

        padding-left: 1.5rem;
        padding-right: 1.5rem;

        margin-bottom: 1rem;

        .query-btn-container {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        
            flex-grow: 1;
        }
    }

    & .order-table-row {
        display: flex;
        flex-direction: row;
        /* justify-content: flex-start; */
        /* align-items: center; */
    }
`

export default function ConsumeBehavior({ show, fetchControl }) {

    const { t } = useTranslation('social', { keyPrefix: 'consumeBehavior' })

    const dispatch = useDispatch();
    const consumeStartDate = useSelector(selectConsumeStartDate);
    const consumeEndDate = useSelector(selectConsumeEndDate);
    const consumeStatus = useSelector(selectConsumeStatus);
    const orderId = useSelector(selectOrderId);

    const actConsumeStartDate = val => dispatch(updateConsumeStartDate(val));
    const actConsumeEndDate = val => dispatch(updateConsumeEndDate(val));
    const actConsumeStatus = val => dispatch(updateConsumeStatus(val));
    const actOrderId = val => dispatch(updateOrderId(val));

    const consumeBehaviorTableFlow = new ConsumeBehaviorTableFlow(useRef(null));
    const [tableData, setTableData] = useState(consumeBehaviorTableFlow.getTableData());
    consumeBehaviorTableFlow.registTableDataSetter('ConsumeBehavior', setTableData);

    const onClickQuery = () => () => {
        console.log('onClickQuery');


    }

    useEffect(consumeBehaviorTableFlow.bindMount(), []);
    // console.log('consumeBehaviorTableFlow.getTableHeader()', consumeBehaviorTableFlow.getTableHeader())

    return (
        <ModalTabForm show={show} importCss={ConsumeBehaviorCss}>
            <InputRow title="日期區間">
                <DatePicker importStyle={{
                    width: '260px'
                }} placeholder="開始日期" value={consumeStartDate} onUpdate={actConsumeStartDate}></DatePicker>
                <DatePicker importStyle={{
                    width: '260px'
                }} placeholder="結束日期" value={consumeEndDate} onUpdate={actConsumeEndDate}></DatePicker>
            </InputRow>
            <div className="query-row">
                <Select importStyle={{
                    marginRight: '0.5rem',
                }} width="160px" value={consumeStatus} optionList={ConsumeStatusEnum.getOptionList(t)} onUpdate={actConsumeStatus}></Select>

                <InputText importStyle={{
                    width: '300px',
                }} placeholder="請輸入訂單編號" value={orderId} onUpdate={actOrderId}></InputText>

                <div className="query-btn-container">
                    <Button importStyle={{
                        marginLeft: '0.5rem',
                        marginRight: '1.2rem',
                        marginTop: '0px',
                        marginBottom: '0px',
                        height: '2.3rem',
                    }} type="fill" onClick={onClickQuery()}>查詢</Button>
                </div>
            </div>
            <div className="order-table-row">
                <Table header={consumeBehaviorTableFlow.getTableHeader()} data={tableData}
                    onPageChange={consumeBehaviorTableFlow.bindAct('onPageChange')} >
                </Table>
            </div>
        </ModalTabForm>
    )
}



