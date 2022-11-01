/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Table from 'component/Table';

import TablePlugin from "control/TablePlugin";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import TabModal from "vision/TabModal"


const TabTableStyled = styled.div`
    display: flex;
    flex-direction: column;

    /* width: 700px; */
    width: 100%;

`


const ModalTitleStyled = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: flex-start;
    align-items: center;

    height: 100%;
`

const SendDetailModal = ({ tablePlugin, title, tab, tabList, setModalRef = (() => { }) }) => {
    if (!(tablePlugin instanceof TablePlugin)) {
        console.error(`TabTableModal: tablePlugin is not TablePlugin`);
        return (<div></div>)
    }

    const [tableData, setTableData] = useState(tablePlugin.getState('tableData'));
    tablePlugin.reactive('tableData', 'SendMessageDetailModalTabTable', setTableData);

    const tableHeader = tablePlugin.getState('tableHeader');

    const [loading, setLoading] = useState(tablePlugin.getState('loading'));
    tablePlugin.reactive('loading', 'SendMessageDetailModalTabTable', setLoading);

    return (
        <TabModal modalRef={setModalRef}
            tabList={tabList} onTabChange={() => { }}
            headerSlot={<ModalTitleStyled>{title}</ModalTitleStyled>}
            modalWidth={1000} modalHeight={660}
        >
            {/* 切換tab reactTab={setTab => model.reactive('tab', `${controlName}_TabModal`, setTab)} */}
            <TabTableStyled style={{
                display: true ? 'flex' : 'none',
            }}>
                <Table header={tableHeader} data={tableData}
                    onPageChange={tablePlugin.bindAct('onPageChange')} importStyle={{
                        width: 'calc(100% - 3rem)',
                    }}
                    loading={loading}
                >
                </Table>
            </TabTableStyled>
        </TabModal>
    )

}

export default SendDetailModal;