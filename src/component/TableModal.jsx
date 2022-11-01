/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import TableControl from 'control/Table';
import { TableModalInterface } from 'interface/TableModal';
import { useEffect, useState } from 'react';

import Modal from './Modal'
import Table from './Table';

const TableModalContainStyled = styled.div`
margin-top: 35px;

min-width: 934px;
min-height: 650px;

display: flex;
flex-direction: column;

    & .table-block {
        display: flex;
    }

    /* & .footer-block {
        display: flex;
        flex-direction
    } */
`

export default function TableModal({ modalRef, control, srcKey = 'TableModal',
    loading = false, headerSlot, footerSlot }) {

    if (!(control instanceof TableModalInterface)) {
        console.error(`TableModal: control is invalid`);
        return (
            <div>TableModal: control is invalid</div>
        )
    }

    const tableHeader = control.getTableHeader();
    if (!tableHeader) {
        console.error(`TableModal: getTableHeader() get fail`);
    }

    const [tableData, setTableData] = useState(control.getTableData());

    control.registTableDataSetter(srcKey, setTableData);

    if (!modalRef) {
        modalRef = control.bindAct('bindModalRef');
    }

    const handleButtonClick = () => (...args) => {
        if (control.onButtonClick) {
            control.onButtonClick(...args);
        }
    }

    const handleCheckedChange = () => (...args) => {
        if (control.onCheckedChange) {
            control.onCheckedChange(...args);
        }
    }

    return (
        <Modal childRef={modalRef} onModalOpen={control.bindAct('onModalOpen')}
            modalWidth={934} modalHeight={700} >
            <TableModalContainStyled>
                {headerSlot}
                <div className="table-block">
                    <Table header={tableHeader} data={tableData} view={{
                        panel: false,
                    }} onPageChange={control.bindAct('onPageChange')}
                        onButtonClick={handleButtonClick()}
                        loading={loading}
                        onCheckedChange={handleCheckedChange()}>
                    </Table>
                </div>
                {footerSlot}
            </TableModalContainStyled>
        </Modal>
    )
}

