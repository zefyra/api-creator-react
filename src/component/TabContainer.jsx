/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

// import styled from "styled-components";

import { useState, useEffect } from 'react';

class TabItemData {
    tabItemList = [];
    defaultTabItem = null;
    defaultTabKey = '';

    constructor(tabItemList) {
        /* tabItemList: [{
            value: 'payMethod',
            label: t('payMethod'), // 支付方式
            container: (<PayMethodContainerStyled />),
            default: true,
        }, {
            value: 'ecpay',
            label: t('ecpay'), // 綠界支付
            container: (<EcPayContainerStyled />),
        }] */
        if (!tabItemList) {
            console.log(`tabItemList not exist`);
            return;
        }
        this.tabItemList = tabItemList;

        const defaultTabItem = this.initDefaultItem(tabItemList);
        this.defaultTabItem = defaultTabItem;
        this.defaultTabKey = defaultTabItem.value;
    }
    initDefaultItem(tabItemList) {
        if (!tabItemList || !Array.isArray(tabItemList)) {
            console.log(`tabItemList not exist`);
            return;
        }
        if (tabItemList.length <= 0) {
            console.log(`tabItemList len is 0`);
            return {};
        }

        const defaultTabItem = tabItemList.find((tabItem) => {
            return tabItem.default === true;
        });

        return defaultTabItem ? defaultTabItem : (tabItemList[0] || {});
    }

    // [public] 
    getDefaultTabKey() {
        return this.defaultTabKey;
    }

}

const TabContainerDefault = ({ tabItemList }) => {

    // let defaultTabKey = '';
    // if (tabItemList) {
    //     defaultTabKey = tabItemList[0].value;
    // }
    // const defaultTabItem = tabItemList.find((tabItem) => {
    //     return tabItem.default === true;
    // });
    // if (defaultTabItem) {
    //     defaultTabKey = defaultTabItem.value;
    // }

    const tabItemDataObj = new TabItemData(tabItemList);

    const [nowTab, setNotTab] = useState(tabItemDataObj.getDefaultTabKey());

    const containerList = tabItemList.map((tabItem, index) => {
        return (<div key={`tabContainer_${index}`} style={{
            display: nowTab === tabItem.value ? 'flex' : 'none',
        }} className="tab-container">
            {tabItem.container}
        </div>);
    });

    const onTabClick = tabKey => () => {
        setNotTab(tabKey);
    }

    const tabItemDomList = tabItemList.map((tabItem, index) => {
        return (<div key={`tab_${index}`} className={`tab-item tab-start ${nowTab === tabItem.value ? 'active' : ''}`}
            onClick={onTabClick(tabItem.value)}>{tabItem.label}</div>);
    });

    return (
        <TabContainerStyled>
            <div className="tab-row">
                {tabItemDomList}
                {/* 支付方式 */}
                {/* <div className={`tab-item tab-start ${nowTab === 'payMethod' ? 'active' : ''}`}
                    onClick={onTabClick()}>{t('payMethod')}</div> */}
                {/* 綠界支付 */}
                {/* <div className={`tab-item ${nowTab === 'ecpay' ? 'active' : ''}`}
                    onClick={onTabClick()}>{t('ecpay')}</div> */}
                {/* InvoiceGo發票設定 */}
                {/* <div className={`tab-item ${nowTab === 'invoiceGo' ? 'active' : ''}`}
                    onClick={onTabClick()}>{t('invoiceGo')}</div> */}
            </div>
            {containerList}
        </TabContainerStyled>
    );
}

// const TabContainerStyled = styled(TabContainerDefault)

const TabContainerStyled = styled.div`
    display: flex;
    flex-direction: column;

    width: 95%; // 自動填滿

    justify-content: center;
    align-items: flex-start;

    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
    
    /* background-color: #afc4c0; */

    .tab-row {
        display: flex;
        flex-direction: row;
        .tab-item {
            margin: 0 0.5rem;
            /* background-color: #ebf1f0; */
            background-color: #afc4c0;
            border-radius: 5px 5px 0px 0px;
            padding: 0.75rem 1rem;

            cursor: pointer;
        }
        .tab-start {
            margin-left: 0;
        }
        .tab-item.active {
            background-color: #ebf1f0;
        }
    }

    .tab-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: #ebf1f0;
            
        border-radius: 0px 5px 5px 5px;
    }

`



const TableTabStyled = styled.div`
    display: flex;
    flex-direction: column;

    width: 95%; // 自動填滿

    justify-content: center;
    align-items: flex-start;

    margin-left: 1.5rem;
    /* margin-bottom: 1.5rem; */
    
    /* background-color: #afc4c0; */

    .tab-row {
        display: flex;
        flex-direction: row;
        .tab-item {
            margin: 0 0.5rem;
            /* background-color: #ebf1f0; */
            background-color: #afc4c0;
            border-radius: 5px 5px 0px 0px;
            padding: 0.75rem 1rem;

            cursor: pointer;
        }
        .tab-start {
            margin-left: 0;
        }
        .tab-item.active {
            background-color: #ebf1f0;
        }
    }

    .tab-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: #ebf1f0;
            
        border-radius: 0px 5px 5px 5px;
    }

`


const TableTabRow = ({ children, tabItemList, onTabChanged }) => {

    const tabItemDataObj = new TabItemData(tabItemList);

    const [nowTab, setNotTab] = useState(tabItemDataObj.getDefaultTabKey());

    const onTabClick = tabKey => () => {
        setNotTab(tabKey);

        if (onTabChanged) {
            onTabChanged(tabKey)
        }
    }

    const tabItemDomList = tabItemList.map((tabItem, index) => {
        return (<div key={`tab_${index}`} className={`tab-item tab-start ${nowTab === tabItem.value ? 'active' : ''}`}
            onClick={onTabClick(tabItem.value)}>{tabItem.label}</div>);
    });

    return (
        <TableTabStyled>
            <div className="tab-row">
                {tabItemDomList}
                {/* 支付方式 */}
                {/* <div className={`tab-item tab-start ${nowTab === 'payMethod' ? 'active' : ''}`}
                    onClick={onTabClick()}>{t('payMethod')}</div> */}
                {/* 綠界支付 */}
                {/* <div className={`tab-item ${nowTab === 'ecpay' ? 'active' : ''}`}
                    onClick={onTabClick()}>{t('ecpay')}</div> */}
                {/* InvoiceGo發票設定 */}
                {/* <div className={`tab-item ${nowTab === 'invoiceGo' ? 'active' : ''}`}
                    onClick={onTabClick()}>{t('invoiceGo')}</div> */}
            </div>
        </TableTabStyled>
    )

    // return (
    //     <div>{tabItemDataObj.getDefaultTabKey()}</div>
    // )
}


export default function TabContainer({ type, tabItemList, children, onTabChanged }) {

    if (type === 'table') {
        return (
            <TableTabRow tabItemList={tabItemList} onTabChanged={onTabChanged} />
        );
    }

    return (
        <TabContainerDefault tabItemList={tabItemList} />
    );
};