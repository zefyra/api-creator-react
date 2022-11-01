/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useState, useEffect, useRef } from 'react';

import { useTranslation } from "react-i18next";
import { useUrlQuery } from "util/UrlQuery";

import { PageTitle } from "module/layout";
import FetchControl from 'control/FetchControl';
import {
    AddressArrayTableModel,
    BranchShopTableModel,
    CustomDataModel, EmailArrayTableModel, ExternEnvironmentParamTableModel, GatewayUidTableModel, MemberDataTableModel,
    PhoneArrayTableModel,
    PriceArrayTableModel,
    ProductArrayTableModel,
    ProductCategoryTableModel,
    ProductTableModel,
    SatisfactionTableModel,
    SheredDataModel,
    SpecArrayTableModel,
    StockArrayTableModel,
    TransactionLogTableModel
} from 'fragment/DataCollection';

import FilterPanel from 'component/FilterPanel';
import { FilterPanelDash, FilterPanelTitle } from "component/FilterPanel"
import DatePicker from "component/DatePicker"
import Select from "component/Select"
import Table from "component/Table"

import PlatformTypeEnum from "enum/dataCollection/PlatformType"
import DataCategoryEnum from "enum/dataCollection/DataCategory"
import DataStatus from "enum/dataCollection/DataStatus"
import {
    AddressArrayTableFlow,
    BranchShopTableFlow,
    CustomDataFlow,
    EmailArrayTableFlow,
    ExternEnvironmentParamTableFlow,
    GatewayUidTableFlow,
    MemberDataTableFlow,
    ModalTableControl,
    PhoneArrayTableFlow,
    PriceArrayTableFlow,
    ProductArrayTableFlow,
    productCategoryTableFlow,
    ProductDataTableFlow,
    SatisfactionTableFlow,
    SpecArrayTableFlow,
    StockArrayTableFlow,
    SubTableControl,
    TransactionLogTableFlow
} from 'flow/dataCollection';
import Button from 'component/Button';
import TableData from 'util/TableData';
import TabContainer from 'component/TabContainer';
import Board from 'component/Board';
import Modal from 'component/Modal';

import TabModal from 'vision/TabModal';
import { MemberDataModalEnum, ProductDataModalEnum, TransactionLogModalEnum } from 'enum/dataCollection/SubTableModal';
import FormModal, { FooterArea } from 'component/FormModal';

export const CustomDataPanel = ({ control, model, showMap }) => {
    if (!showMap) {
        showMap = {
            dataCategory: true,
            srcSystem: false,
        }
    }
    // fetchControl, fetchModel

    const { t } = useTranslation('dataCollection', { keyPrefix: 'customData' });
    const { t: dataCategoryT } = useTranslation('dataCollection', { keyPrefix: 'dataCategory' });
    const { t: dataStatusT } = useTranslation('dataCollection', { keyPrefix: 'dataStatus' });

    // const md = fetchModel('customData');
    const md = model;

    const [startDate, setStartDate] = useState(md.getState('startDate'));
    const [endDate, setEndDate] = useState(md.getState('endDate'));
    const [platformType, setPlatformType] = useState(md.getState('platformType'));
    const [dataCategory, setDataCategory] = useState(md.getState('dataCategory'));
    const [dataStatus, setDataStatus] = useState(md.getState('dataStatus'));

    const [srcSystem, setSrcSystem] = useState(md.getState('srcSystem'));
    const [srcSystemOptionList, setSrcSystemOptionList] = useState(md.getState('srcSystemOptionList'));
    const [srcSystemOptionListLoading, setSrcSystemOptionListLoading] = useState(md.getState('srcSystemOptionListLoading'));

    const actStartDate = md.reactive('startDate', 'CustomDataPanel', setStartDate);
    const actEndDate = md.reactive('endDate', 'CustomDataPanel', setEndDate);

    const actPlatformType = md.reactive('platformType', 'CustomDataPanel', setPlatformType);
    const actDataCategory = md.reactive('dataCategory', 'CustomDataPanel', setDataCategory);
    const actDataStatus = md.reactive('dataStatus', 'CustomDataPanel', setDataStatus);



    let dataCategoryDom;
    if (showMap.dataCategory) {
        dataCategoryDom = (<FilterPanelTitle pattern="query" title={t('dataCategory')}>
            <Select value={dataCategory} optionList={DataCategoryEnum.getOptionList(dataCategoryT)} onUpdate={actDataCategory}></Select>
        </FilterPanelTitle>);
    }

    let srcSystemSelectDom;
    // 判斷admin權限才顯示【來源系統】的篩選下拉
    if (showMap.srcSystem) {

        const actSrcSystem = md.reactive('srcSystem', 'CustomDataPanel', setSrcSystem);

        md.registSetter('srcSystemOptionList', 'CustomDataPanel', setSrcSystemOptionList);
        md.registSetter('srcSystemOptionListLoading', 'CustomDataPanel', setSrcSystemOptionListLoading);

        srcSystemSelectDom = (
            <FilterPanelTitle pattern="query" title={t('srcSystem')}>
                <Select value={srcSystem} optionList={srcSystemOptionList}
                    onUpdate={actSrcSystem} loading={srcSystemOptionListLoading}></Select>
            </FilterPanelTitle>
        );
    }

    return (
        <FilterPanel>
            <FilterPanelTitle pattern="query" title={t('timePeriod')}>
                {/*開始日期*/}
                <DatePicker placeholder={t('startDate')} onUpdate={actStartDate}></DatePicker>
                <FilterPanelDash pattern="panelTitle">-</FilterPanelDash>
                {/*結束日期*/}
                <DatePicker placeholder={t('endDate')} onUpdate={actEndDate}></DatePicker>
            </FilterPanelTitle>
            {/* 平台別 */}
            <FilterPanelTitle pattern="query" title={t('platformType')}>
                <Select value={platformType} optionList={PlatformTypeEnum.getOptionList(t)} onUpdate={actPlatformType}></Select>
            </FilterPanelTitle>
            {/* 資料分類 */}
            {dataCategoryDom}
            {/* 狀態 */}
            <FilterPanelTitle pattern="query" title={t('dataStatus')}>
                <Select value={dataStatus} optionList={DataStatus.getOptionList(dataStatusT)} onUpdate={actDataStatus}></Select>
            </FilterPanelTitle>
            {/* 來源系統 */}
            {srcSystemSelectDom}
            <Button type="fill" onClick={control.bindAct('onQuery')}>{t('query')}</Button>
        </FilterPanel>
    )
}

const ImportMessageRowStyled = styled.div`
    display: flex;
    flex-direction: column;

    margin: 1rem 1.5rem;

    & .message-row {
        display: flex;
        flex-direction: row;
        & .statement {
            /* display: flex;
            flex-direction: row; */

            
        }
        & .unit {
            margin: 0 0.5rem;
        }
    }
    
`

const ImportMessageRow = () => {

    const { t } = useTranslation('dataCollection', { keyPrefix: 'customData' });

    return (
        <ImportMessageRowStyled>
            <div className="message-row">
                <div className="statement">
                    {t('importMsg01A')}
                </div>
                <div className="unit">
                    1,500
                </div>
                <div className="statement">
                    {t('importMsg01B')}
                </div>
            </div>
            <div className="message-row">
                <div className="statement">
                    {t('importMsg02A')}
                </div>
                <div className="unit">
                    1
                </div>
            </div>
            <div className="message-row">
                <div className="statement">
                    {t('importMsg03A')}
                </div>
                <div className="unit">
                    1/m
                </div>
            </div>
        </ImportMessageRowStyled>
    )
}

export const CustomDataSchemaTable = ({ control, model }) => {
    // fetchControl, fetchModel

    const { t } = useTranslation('dataCollection', { keyPrefix: 'customData' });

    const tableHeader = control.getTableHeader();

    const [tableData, setTableData] = useState(control.getTableData());
    useEffect(control.bindMount(), []);
    control.registTableDataSetter('CustomDataSchemaTable', setTableData);

    return (
        <Table header={tableHeader} data={tableData}
            onCheckedChange={control.bindAct('onSchemaTableSelectChange')}
            onPageChange={control.bindAct('onSchemaTablePageChange')} pageChangeLock
            footerSlot={<ImportMessageRow></ImportMessageRow>}>
            {/* 新增 */}
            <Button type="table" mode="default" onClick={control.bindAct('onSchemaCreateOpen')}>{t('create')}</Button>
            {/* 同步 */}
            <Button type="table" mode="default" onClick={control.bindAct('onSchemaSync')}>{t('sync')}</Button>
            {/* 重新比對 */}
            <Button type="table" mode="default" onClick={control.bindAct('onSchemaCompareAgain')}>{t('compareAgain')}</Button>
            {/* 清除資料 */}
            <Button type="table" mode="default" onClick={control.bindAct('onSchemaClearData')}>{t('clearData')}</Button>
            {/* 刪除 */}
            <Button type="table" mode="default" onClick={control.bindAct('onSchemaDelete')}>{t('delete')}</Button>
        </Table>
    );
}

const CustomDataSubTableTabStyled = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
`

const BlankBoardStyled = styled.div`
height: 300px;
`

export const CustomDataTabTable = ({ control, model }) => {
    // fetchControl, fetchModel
    const { t } = useTranslation('dataCollection', { keyPrefix: 'customData' });

    const { t: memberDataT } = useTranslation('dataCollection', { keyPrefix: 'memberData' });
    const { t: transactionLogT } = useTranslation('dataCollection', { keyPrefix: 'transactionLog' });
    const { t: productCategoryT } = useTranslation('dataCollection', { keyPrefix: 'productCategory' });
    const { t: productDataT } = useTranslation('dataCollection', { keyPrefix: 'productData' });
    const { t: branchShopT } = useTranslation('dataCollection', { keyPrefix: 'branchShop' });
    const { t: dataCollectionT } = useTranslation('dataCollection');

    const [tab, setTab] = useState('schemaField');
    const [subTableWatch, setSubTableWatch] = useState('');
    const [subTable, setSubTable] = useState('');

    model.registSetter('subTable', 'CustomDataTabTable', setSubTableWatch);

    const modelMap = {
        [DataCategoryEnum.memberData]: new MemberDataTableModel(useRef(null), { t: dataCollectionT }),
        [DataCategoryEnum.transactionLog]: new TransactionLogTableModel(useRef(null), { t: dataCollectionT }),
        [DataCategoryEnum.productCategory]: new ProductCategoryTableModel(useRef(null), { t: dataCollectionT }),
        [DataCategoryEnum.productData]: new ProductTableModel(useRef(null), { t: dataCollectionT }),
        [DataCategoryEnum.branchShop]: new BranchShopTableModel(useRef(null), { t: dataCollectionT }),
        [DataCategoryEnum.externEnvironmentParam]: new ExternEnvironmentParamTableModel(useRef(null), { t: dataCollectionT }),
    }

    // console.log(`memberData table header`, modelMap['memberData'].getTableHeader())
    // const { t } = useTranslation('dataCollection', { keyPrefix: 'memberData' })
    const subTableMap = {
        [DataCategoryEnum.memberData]: {
            textKeyPrefix: 'memberData',
            tableModel: modelMap[DataCategoryEnum.memberData],
            tableControl: new MemberDataTableFlow(useRef(null), modelMap[DataCategoryEnum.memberData]),
            tabList: [{
                label: dataCollectionT('memberData.gatewayUid'),
                value: MemberDataModalEnum.gatewayUid,
            }, {
                label: dataCollectionT('memberData.emailArray'),
                value: MemberDataModalEnum.emailArray,
            }, {
                label: dataCollectionT('memberData.addressArray'),
                value: MemberDataModalEnum.addressArray,
            }, {
                label: dataCollectionT('memberData.phoneArray'),
                value: MemberDataModalEnum.phoneArray,
            }],
        },
        [DataCategoryEnum.transactionLog]: {
            textKeyPrefix: 'transactionLog',
            tableModel: modelMap[DataCategoryEnum.transactionLog],
            tableControl: new TransactionLogTableFlow(useRef(null), modelMap[DataCategoryEnum.transactionLog]),
            tabList: [{
                label: dataCollectionT('transactionLog.productArray'),
                value: TransactionLogModalEnum.productArray,
            }],
        },
        [DataCategoryEnum.productCategory]: {
            textKeyPrefix: 'productCategory',
            tableModel: modelMap[DataCategoryEnum.productCategory],
            tableControl: new productCategoryTableFlow(useRef(null), modelMap[DataCategoryEnum.productCategory]),
        },
        [DataCategoryEnum.productData]: {
            textKeyPrefix: 'productData',
            tableModel: modelMap[DataCategoryEnum.productData],
            tableControl: new ProductDataTableFlow(useRef(null), modelMap[DataCategoryEnum.productData]),
            tabList: [{
                label: dataCollectionT('productData.specArray'),
                value: ProductDataModalEnum.specArray,
            }, {
                label: dataCollectionT('productData.stockArray'),
                value: ProductDataModalEnum.stockArray,
            }, {
                label: dataCollectionT('productData.priceArray'),
                value: ProductDataModalEnum.priceArray,
            }, {
                label: dataCollectionT('productData.satisfaction'),
                value: ProductDataModalEnum.satisfaction,
            }],
        },
        [DataCategoryEnum.branchShop]: {
            textKeyPrefix: 'branchShop',
            tableModel: modelMap[DataCategoryEnum.branchShop],
            tableControl: new BranchShopTableFlow(useRef(null), modelMap[DataCategoryEnum.branchShop]),
            // tabList: [{
            //     label: dataCollectionT('gatewayUid'),
            //     value: MemberDataModalEnum.gatewayUid,
            // }],
        },
        [DataCategoryEnum.externEnvironmentParam]: {
            textKeyPrefix: 'externEnvironmentParam',
            tableModel: modelMap[DataCategoryEnum.externEnvironmentParam],
            tableControl: new ExternEnvironmentParamTableFlow(useRef(null), modelMap[DataCategoryEnum.externEnvironmentParam]),
            // tabList: [{
            //     label: dataCollectionT('gatewayUid'),
            //     value: MemberDataModalEnum.gatewayUid,
            // }],
        }
    }

    // 設定每個SubTable內的ModalTable的control物件
    subTableMap[DataCategoryEnum.memberData].tableControl.setTabTableControlMap({
        [MemberDataModalEnum.gatewayUid]: new GatewayUidTableFlow(useRef(null), new GatewayUidTableModel(null, { t: memberDataT })),
        [MemberDataModalEnum.emailArray]: new EmailArrayTableFlow(useRef(null), new EmailArrayTableModel(null, { t: memberDataT })),
        [MemberDataModalEnum.addressArray]: new AddressArrayTableFlow(useRef(null), new AddressArrayTableModel(null, { t: memberDataT })),
        [MemberDataModalEnum.phoneArray]: new PhoneArrayTableFlow(useRef(null), new PhoneArrayTableModel(null, { t: memberDataT })),
    });

    subTableMap[DataCategoryEnum.transactionLog].tableControl.setTabTableControlMap({
        [TransactionLogModalEnum.productArray]: new ProductArrayTableFlow(useRef(null), new ProductArrayTableModel(null, { t: transactionLogT })),
    });

    subTableMap[DataCategoryEnum.productData].tableControl.setTabTableControlMap({
        [ProductDataModalEnum.specArray]: new SpecArrayTableFlow(useRef(null), new SpecArrayTableModel(null, { t: productDataT })),
        [ProductDataModalEnum.stockArray]: new StockArrayTableFlow(useRef(null), new StockArrayTableModel(null, { t: productDataT })),
        [ProductDataModalEnum.priceArray]: new PriceArrayTableFlow(useRef(null), new PriceArrayTableModel(null, { t: productDataT })),
        [ProductDataModalEnum.satisfaction]: new SatisfactionTableFlow(useRef(null), new SatisfactionTableModel(null, { t: productDataT })),
    });


    // -----------------------------------------------------------------------------


    useEffect(function () {
        const subTableItem = subTableMap[subTableWatch];
        if (!subTableItem) {
            setSubTable('');
            return;
        }
        setSubTable(subTableWatch); // 重新render
    }, [subTableWatch]);

    let tableDom;
    let subTableInfoModal;
    if (tab === 'schemaField') { // 資料欄位
        const subTableData = subTableMap[subTable];
        if (subTableData) {
            // tableDom = (
            //     <CustomDataFieldTable fetchControl={fetchControl} textKeyPrefix={textKeyPrefix}
            //         tableControl={tableControl}></CustomDataFieldTable>
            // ); ==> 錯誤寫法，不要使用useState的參數來綁定control和model，因為useState不一定會偵測到obj內部資料的異動
            // 由於外面的control物件和useState生成的control物件是二個不同的東西，因此即使外面的物件內參數被修改
            // ，useState的那個物件依然是舊的

            tableDom = (
                <CustomDataFieldTable textKeyPrefix={subTableData.textKeyPrefix}
                    tableControl={subTableData.tableControl} tableModel={subTableData.tableModel}></CustomDataFieldTable>
            );

            if (subTableData.tabList) {
                subTableInfoModal = (
                    <TabTableModal control={subTableData.tableControl}
                        model={subTableData.tableModel}
                        tabList={subTableData.tabList}></TabTableModal>
                );
            }
        } else {
            tableDom = (
                <Board type="tabBoard">
                    <BlankBoardStyled></BlankBoardStyled>
                </Board>
            );
        }

    } else if (tab === 'syncRecord') { // 同步紀錄

    }


    const tabItemList = [{
        value: 'schemaField',
        label: t('schemaField'), /* 資料欄位 */
        default: true,
    }, {
        value: 'syncRecord',
        label: t('syncRecord'), /* 同步紀錄 */
    }];

    const onTabChanged = tabKey => {
        console.log('onTabChanged', tabKey);

        setTab(tabKey);
    }

    return (
        <CustomDataSubTableTabStyled>
            <TabContainer type="table" tabItemList={tabItemList} onTabChanged={onTabChanged} />
            {tableDom}
            {subTableInfoModal}
        </CustomDataSubTableTabStyled>
    );
}


const TabTableStyled = styled.div`
    display: flex;
    flex-direction: column;

    /* width: 700px; */
    width: 100%;

`

const TabTable = ({ show, control }) => {
    if (!(control instanceof ModalTableControl)) {
        console.error(`<TabTable>: control is not instaceof ModalTableControl`, control);
        return (<div></div>);
    }

    const [tableData, setTableData] = useState(control.getTableData());
    // console.log(`regist setTableData into control: ${control.getControlName()}`);
    control.registTableDataSetter(control.getControlName(), setTableData);

    // console.log(`${control.getControlName()} header`, control.getTableHeader())
    // useEffect(function () {
    //     console.log(`TabTable ${control.getControlName()}: show = ${show}`);
    //     // control.
    // }, [show]);

    return (
        <TabTableStyled style={{
            display: show ? 'flex' : 'none',
        }}>
            <Table header={control.getTableHeader()} data={tableData}
                onPageChange={control.bindAct('onPageChange')} importStyle={{
                    width: 'calc(100% - 3rem)',
                }}>
            </Table>
        </TabTableStyled>
    )
}

const ModalTitleStyled = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: flex-start;
    align-items: center;

    height: 100%;
`

const TabTableModal = ({ control, model, tabList = [] }) => {
    if (!(control instanceof SubTableControl)) {
        console.error(`control is not instanceof SubTableControl`)
        return <div></div>;
    }

    const controlName = control.getControlName();
    // controlName: 'MemberDataTableFlow'

    const [title, setTitle] = useState(model.getState('modalTitle'));
    model.registSetter('modalTitle', `${controlName}_TabTableModal`, setTitle);

    const [tab, setTab] = useState(model.getState('tab'));

    const actTab = model.reactive('tab', `${controlName}_TabTableModal`, setTab);

    let tabTableListDom = tabList.map((tabItem, index) => {
        return (
            (<TabTable key={`${controlName}_TabTable_${index}`} show={tab === tabItem.value}
                control={control.getTabTableControl(tabItem.value)}
            />)
        );
    });

    return (
        <TabModal modalRef={control.bindAct('bindModalRef')}
            tabList={tabList} onTabChange={actTab}
            headerSlot={<ModalTitleStyled>{title}</ModalTitleStyled>}
            reactTab={setTab => model.reactive('tab', `${controlName}_TabModal`, setTab)}
            modalWidth={1000} modalHeight={660}
        >
            {tabTableListDom}
        </TabModal>
    )
}

const tabTableExtraStyle = {
    borderRadius: '0px 5px 5px 5px',
    marginTop: '0px',
}


const CustomDataFieldTable = ({ tableControl, tableModel, textKeyPrefix }) => {

    // const { t } = useTranslation('dataCollection', { keyPrefix: 'customData' });
    if (!tableControl) {
        return (<div>tableControl not exist</div>);
    }

    const tableHeader = tableControl.getTableHeader();

    const [tableData, setTableData] = useState(tableControl.getTableData());
    tableControl.registTableDataSetter('CustomDataFieldTable', setTableData);

    useEffect(tableControl.bindMount(), []);

    // onCheckedChange={tableControl.bindAct('onTableSelectChange')}


    // vm.getStateModel().setState('tab', headerKey);

    // const onButtonClick = () => (...args) => {
    //     // tableControl.bindAct('onButtonClick');
    //     console.log(`onButtonClick`);
    //     tableControl.setStateModel
    //     tableControl.onButtonClick(...args)
    // }

    // onButtonClick={onButtonClick()}

    return (
        <Table header={tableHeader} data={tableData} onPageChange={tableControl.bindAct('onTablePageChange')} pageChangeLock
            importStyle={tabTableExtraStyle} onButtonClick={tableControl.bindAct('onButtonClick')}>
        </Table>
    );
}

const SharedDataPanel = ({ fetchControl, fetchModel }) => {

    const { t } = useTranslation('dataCollection', { keyPrefix: 'sharedData' });

    const md = fetchModel('sharedData');

    const [startDate, setStartDate] = useState(md.getState('startDate'));
    const [endDate, setEndDate] = useState(md.getState('endDate'));
    const [platformType, setPlatformType] = useState(md.getState('platformType'));
    const [dataCategory, setDataCategory] = useState(md.getState('dataCategory'));
    const [dataStatus, setDataStatus] = useState(md.getState('dataStatus'));

    // useEffect(function () {
    //     console.log(`aaa`, customDataModel.getState('startDate'));
    // }, [startDate]);

    const actStartDate = md.reactive('startDate', 'CustomDataPanel', setStartDate);
    const actEndDate = md.reactive('endDate', 'CustomDataPanel', setEndDate);

    const actPlatformType = md.reactive('platformType', 'CustomDataPanel', setPlatformType);
    const actDataCategory = md.reactive('dataCategory', 'CustomDataPanel', setDataCategory);
    const actDataStatus = md.reactive('dataStatus', 'CustomDataPanel', setDataStatus);

    return (
        <FilterPanel>
            <FilterPanelTitle pattern="query" title={t('timePeriod')}>
                {/*開始日期*/}
                <DatePicker placeholder={t('startDate')} pattern="query" onUpdate={actStartDate}></DatePicker>
                <FilterPanelDash>-</FilterPanelDash>
                {/*結束日期*/}
                <DatePicker placeholder={t('endDate')} pattern="query" onUpdate={actEndDate}></DatePicker>
            </FilterPanelTitle>
            {/* 平台別 */}
            <FilterPanelTitle pattern="query" title={t('platformType')}>
                <Select value={platformType} optionList={PlatformTypeEnum.getOptionList()} onUpdate={actPlatformType}></Select>
            </FilterPanelTitle>
            {/* 資料分類 */}
            <FilterPanelTitle pattern="query" title={t('dataCategory')}>
                <Select value={dataCategory} optionList={DataCategoryEnum.getOptionList()} onUpdate={actDataCategory}></Select>
            </FilterPanelTitle>
            {/* 狀態 */}
            <FilterPanelTitle pattern="query" title={t('dataStatus')}>
                <Select value={dataStatus} optionList={DataStatus.getOptionList()} onUpdate={actDataStatus}></Select>
            </FilterPanelTitle>
        </FilterPanel>
    )
}

// export const FooterAreaStyled = styled.div`
//     width: 100%;

//     display: flex;
//     flex-direction: row;

//     flex-grow: 1;

//     justify-content: center;
//     align-items: center;
// `

export default function CustomDataPage({ fetchControl }) {

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

    fc.setupModel('customData', new CustomDataModel(useRef(null), { t: customDataT }));
    fc.setup('customData', new CustomDataFlow(useRef(null), fc.fetchModel('customData').getTableHeader()));

    useEffect(fetchControl('customData').bindAct('initLoadSrcSystemOptionList'), []);

    let formItemList = [{
        label: customDataT('platformType'), // 平台別
        type: 'select',
        optionList: PlatformTypeEnum.getAddOptionList(customDataT),
    }, {
        label: customDataT('srcSystem'), // 來源系統
        type: 'select',
        // 因為optionList的載入會有時間差，因此要丟Ref下去
        optionList: fc.fetchModel('customData').fetchRef('srcSystemOptionList', 'CustomDataPage'),
        loading: fc.fetchModel('customData').fetchRef('srcSystemOptionListLoading', 'CustomDataPage'),
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

    formModalDom = <FormModal modalRef={fetchControl('customData').bindAct('bindAddSchemaModalRef')}
        title={customDataT('addDataScheduleItem')} formItemList={formItemList}
        modalHeight={500}
        footerSlot={
            <FooterArea>
                <Button type="fill" onClick={fetchControl('customData').bindAct('onSchemaCreateModalCancel')}>{customDataT('cancel')}</Button>
                <div style={{ width: '5rem' }}></div>
                <Button type="fill" onClick={fetchControl('customData').bindAct('onSchemaCreateModalConfirm')}>{customDataT('confirm')}</Button>
            </FooterArea>
        }
        FormModal="cutomDataAdd"
    />

    panelDom = <CustomDataPanel control={fetchControl('customData')} model={fc.fetchModel('customData')} />
    // fetchControl={fetchControl} fetchModel={fc.export('fetchModel')}
    // console.log(`customData control table`,fetchControl('customData'))
    tableDom = <CustomDataSchemaTable control={fetchControl('customData')} model={fc.fetchModel('customData')} ></CustomDataSchemaTable>
    // fetchControl={fetchControl} fetchModel={fc.export('fetchModel')}

    subTableDom = <CustomDataTabTable control={fetchControl('customData')} model={fc.fetchModel('customData')}></CustomDataTabTable>

    return (
        <PageTitle title={translationMenu.t('customData')}>
            {panelDom}
            {tableDom}
            {subTableDom}
            {formModalDom}
        </PageTitle>
    );
}