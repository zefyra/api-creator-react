/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useState, useEffect, useRef } from 'react';

import { useTranslation } from "react-i18next";
import { useUrlQuery } from "util/UrlQuery";

import { PageTitle } from "module/layout";
import FetchControl from 'control/FetchControl';
import { SheredDataModel } from 'fragment/DataCollection';

import FilterPanel from 'component/FilterPanel';
import { FilterPanelDash, FilterPanelTitle } from "component/FilterPanel"
import DatePicker from "component/DatePicker"
import Select from "component/Select"
import Table from "component/Table"

import PlatformTypeEnum from "enum/dataCollection/PlatformType"
import DataCategoryEnum from "enum/dataCollection/DataCategory"
import DataStatus from "enum/dataCollection/DataStatus"
import { SharedDataFlow } from 'flow/dataCollection';
import Button from 'component/Button';
import TableData from 'util/TableData';
import TabContainer from 'component/TabContainer';
import Board from 'component/Board';
import Modal from 'component/Modal';

import TabModal from 'vision/TabModal';
import { MemberDataModalEnum, ProductDataModalEnum, TransactionLogModalEnum } from 'enum/dataCollection/SubTableModal';
import FormModal, { FooterArea } from 'component/FormModal';

import { CustomDataPanel, CustomDataSchemaTable, CustomDataTabTable } from './CustomData'

export default function SharedDataPage({ fetchControl }) {

    const translationMenu = useTranslation('menu', { keyPrefix: 'data' });

    const urlQuery = useUrlQuery();

    const urlQueryObj = urlQuery.get();
    const fc = fetchControl('entity');

    let panelDom;
    let tableDom;

    let subTableDom;
    let formModalDom;

    const { t: customDataT } = useTranslation('dataCollection', { keyPrefix: 'customData' });
    const { t: dataCategoryT } = useTranslation('dataCollection', { keyPrefix: 'dataCategory' });

    fc.setupModel('sharedData', new SheredDataModel(useRef(null), { t: customDataT }));
    fc.setup('sharedData', new SharedDataFlow(useRef(null), fc.fetchModel('sharedData').getTableHeader()));

    useEffect(fetchControl('sharedData').bindAct('initLoadSrcSystemOptionList'), []);

    let formItemList = [{
        label: customDataT('platformType'), // 平台別
        type: 'select',
        optionList: PlatformTypeEnum.getAddOptionList(customDataT),
    }, {
        label: customDataT('srcSystem'), // 來源系統
        type: 'select',
        // 因為optionList的載入會有時間差，因此要丟Ref下去
        optionList: fc.fetchModel('sharedData').fetchRef('srcSystemOptionList', 'SharedDataPage'),
        loading: fc.fetchModel('sharedData').fetchRef('srcSystemOptionListLoading', 'SharedDataPage'),
    }, {
        label: customDataT('schemaFormat'), // 資料欄位格式
        type: 'select',
        optionList: DataCategoryEnum.getOptionList(dataCategoryT),
    }, {
        label: customDataT('dataNameEn'), // 資料名稱(中文)
        type: 'inputText',
    }, {
        label: customDataT('dataNameZh'), // 資料名稱(英文)
        type: 'inputText',
    }, {
        label: customDataT('hostNameOrIP'), // 主機名稱或IP
        type: 'inputText',
    }]

    formModalDom = <FormModal modalRef={fetchControl('sharedData').bindAct('bindAddSchemaModalRef')}
        title={customDataT('addDataScheduleItem')} formItemList={formItemList}
        modalHeight={500}
        footerSlot={
            <FooterArea>
                <Button type="fill" onClick={fetchControl('sharedData').bindAct('onSchemaCreateModalCancel')}>{customDataT('cancel')}</Button>
                <div style={{ width: '5rem' }}></div>
                <Button type="fill" onClick={fetchControl('sharedData').bindAct('onSchemaCreateModalConfirm')}>{customDataT('confirm')}</Button>
            </FooterArea>
        }
        srcKey="SharedDataAdd"
    />

    panelDom = <CustomDataPanel control={fetchControl('sharedData')} model={fc.fetchModel('sharedData')}
        showMap={{
            dataCategory: false,
            srcSystem: true,
        }} />

    tableDom = <CustomDataSchemaTable control={fetchControl('sharedData')} model={fc.fetchModel('sharedData')} ></CustomDataSchemaTable>

    subTableDom = <CustomDataTabTable control={fetchControl('sharedData')} model={fc.fetchModel('sharedData')}></CustomDataTabTable>

    return (
        <PageTitle title={translationMenu.t('sharedData')}>
            {panelDom}
            {tableDom}
            {subTableDom}
            {formModalDom}
        </PageTitle>
    );
}