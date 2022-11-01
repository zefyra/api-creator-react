import { useState, useEffect } from 'react';
import styled from "styled-components";

import { useTranslation } from "react-i18next";

import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

import { PageTitle } from "module/layout"
// import Table from "component/Table"
// import TableData from "util/TableData"

import TabContainer from "component/TabContainer"

import ToggleSwitch from "component/ToggleSwitch"
import Button from 'component/Button';
import InputText from 'component/InputText';
import Select from 'component/Select';

const PayMethodContainer = ({ className }) => {

    const { t } = useTranslation('setting', { keyPrefix: 'payMothed' })
    const [creditCardChecked, setCreditCardChecked] = useState(false);

    const onPayMethodSave = () => () => {
        console.log('onPayMethodSave');
    }

    return (
        <div className={className}>
            <div className="form">
                <div className="row">
                    <div className="title"></div>
                    {/* 開放/關閉 */}
                    <div className="enable-switch-col">{t('openClose')}</div>
                </div>
                <div className="row">
                    {/* 信用卡 */}
                    <div className="title">{t('creditCard')}</div>
                    <div className="enable-switch-col">
                        <ToggleSwitch value={creditCardChecked} onUpdate={setCreditCardChecked} />
                        {/* onClick={blockBubble()} */}
                    </div>
                </div>
                <div className="row">
                    {/* 不定額扣款 */}
                    <div className="title">{t('unstaybleDeduction')}</div>
                    <div className="enable-switch-col">
                        <ToggleSwitch value={creditCardChecked} onUpdate={setCreditCardChecked} />
                    </div>
                </div>
                <div className="button-row">
                    <Button type="fill" mode="primary" onClick={onPayMethodSave()}>{t('save')}</Button>
                </div>
            </div>
        </div>
    );
}

const PayMethodContainerStyled = styled(PayMethodContainer)`
display: flex;
flex-direction: row;
width: 100%;
justify-content: flex-start;
    .form {
        display: flex;
        flex-direction: column;
        margin-top: 25px;
        margin-left: 150px;
        .row {
            display: flex;
            flex-direction: row;
            width: 100%;

            margin: 0.5rem 0;
            
            .title {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;

                width: 200px;
            }
            .enable-switch-col {

            }
        }
        .button-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }
`


const EcPayContainer = ({ className }) => {

    const { t } = useTranslation('setting', { keyPrefix: 'ecpay' });

    const onEcPaySave = () => () => {
        console.log('onEcPaySave openTest', openTest)

    }

    // 特店編號
    const [specialStoreNum, setSpecialStoreNum] = useState('');
    // 支付介接的HashKey
    const [payConnectHashKey, setPayConnectHashKey] = useState('');
    // 支付介接的HashIV
    const [payConnectHashIV, setPayConnectHashIV] = useState('');

    // 是否開放測試
    const [openTest, setOpenTest] = useState('');
    // 測試特店編號
    const [testSpecialStoreNum, setTestSpecialStoreNum] = useState('');
    // 測試支付介接的HashKey
    const [testPayConnectHashKey, setTestPayConnectHashKey] = useState('');
    // 測試支付介接的HashIV
    const [testPayConnectHashIV, setTestPayConnectHashIV] = useState('');

    const openTestOptionList = [{
        key: 'open',
        label: t('openTest'), // 開放測試
    }, {
        key: 'close',
        label: t('notOpenTest'), // 不開放測試
    }];

    return (
        <div className={className}>
            <div className="form">
                <div className="row">
                    {/* 特店編號 */}
                    <div className="title">{t('specialStoreNum')}</div>
                    <div className="input-col">
                        <InputText value={specialStoreNum} onUpdate={setSpecialStoreNum}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 支付介接的HashKey */}
                    <div className="title">{t('payConnectHashKey')}</div>
                    <div className="input-col">
                        <InputText value={payConnectHashKey} onUpdate={setPayConnectHashKey}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 支付介接的HashIV */}
                    <div className="title">{t('payConnectHashIV')}</div>
                    <div className="input-col">
                        <InputText value={payConnectHashIV} onUpdate={setPayConnectHashIV}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 是否開放測試 */}
                    <div className="title">{t('ifOpenTest')}</div>
                    <div className="input-col">
                        <Select value="" optionList={openTestOptionList} onUpdate={setOpenTest}></Select>
                    </div>
                </div>
                <div className="row">
                    {/* 測試特店編號 */}
                    <div className="title">{t('testSpecialStoreNum')}</div>
                    <div className="input-col">
                        <InputText value={testSpecialStoreNum} onUpdate={setTestSpecialStoreNum}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 測試支付介接的HashKey */}
                    <div className="title">{t('testPayConnectHashKey')}</div>
                    <div className="input-col">
                        <InputText value={testPayConnectHashKey} onUpdate={setTestPayConnectHashKey}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 測試支付介接的HashIV */}
                    <div className="title">{t('testPayConnectHashIV')}</div>
                    <div className="input-col">
                        <InputText value={testPayConnectHashIV} onUpdate={setTestPayConnectHashIV}></InputText>
                    </div>
                </div>
                <div className="button-row">
                    <Button type="fill" mode="primary" onClick={onEcPaySave()}>{t('save')}</Button>
                </div>
            </div>
        </div>
    );
}


const EcPayContainerStyled = styled(EcPayContainer)`
display: flex;
flex-direction: row;
width: 100%;
justify-content: flex-start;
    .form {
        display: flex;
        flex-direction: column;
        margin-top: 25px;
        margin-left: 150px;
        .row {
            display: flex;
            flex-direction: row;
            width: 100%;

            margin: 0.5rem 0;
            
            .title {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;

                width: 200px;
            }
            .input-col {

            }
        }
        .button-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }
`




const InvoiceGoContainer = ({ className }) => {

    const { t } = useTranslation('setting', { keyPrefix: 'invoiceGo' });

    const onEcPaySave = () => () => {
        console.log('onEcPaySave openTest', openTest)

    }

    // 統編 tax ID number(Government Uniform Invoice number)
    const [taxIdNum, setTaxIdNum] = useState('');
    // 帳號
    const [account, setAccount] = useState('');
    // 密碼
    const [password, setPassword] = useState('');

    // 是否開放測試
    const [openTest, setOpenTest] = useState('');
    // 測試帳號
    const [testAccount, setTestAccount] = useState('');
    // 測試密碼
    const [testPassword, setTestPassword] = useState('');

    const openTestOptionList = [{
        key: 'open',
        label: t('openTest'), // 開放測試
    }, {
        key: 'close',
        label: t('notOpenTest'), // 不開放測試
    }];

    return (
        <div className={className}>
            <div className="form">
                <div className="row">
                    {/* 統編 */}
                    <div className="title">{t('taxIdNum')}</div>
                    <div className="input-col">
                        <InputText value={taxIdNum} onUpdate={setTaxIdNum}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 帳號 */}
                    <div className="title">{t('account')}</div>
                    <div className="input-col">
                        <InputText value={account} onUpdate={setAccount}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 密碼 */}
                    <div className="title">{t('password')}</div>
                    <div className="input-col">
                        <InputText value={password} onUpdate={setPassword}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 是否開放測試 */}
                    <div className="title">{t('ifOpenTest')}</div>
                    <div className="input-col">
                        <Select value="" optionList={openTestOptionList} onUpdate={setOpenTest}></Select>
                    </div>
                </div>
                <div className="row">
                    {/* 測試帳號 */}
                    <div className="title">{t('testAccount')}</div>
                    <div className="input-col">
                        <InputText value={testAccount} onUpdate={setTestAccount}></InputText>
                    </div>
                </div>
                <div className="row">
                    {/* 測試密碼 */}
                    <div className="title">{t('testPassword')}</div>
                    <div className="input-col">
                        <InputText value={testPassword} onUpdate={setTestPassword}></InputText>
                    </div>
                </div>
                <div className="button-row">
                    <Button type="fill" mode="primary" onClick={onEcPaySave()}>{t('save')}</Button>
                </div>
            </div>
        </div>
    );
}


const InvoiceGoContainerStyled = styled(InvoiceGoContainer)`
display: flex;
flex-direction: row;
width: 100%;
justify-content: flex-start;
    .form {
        display: flex;
        flex-direction: column;
        margin-top: 25px;
        margin-left: 150px;
        .row {
            display: flex;
            flex-direction: row;
            width: 100%;

            margin: 0.5rem 0;
            
            .title {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;

                width: 200px;
            }
            .input-col {

            }
        }
        .button-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    }
`

export default function PayRelated() {
    const translationMenu = useTranslation('menu', { keyPrefix: 'subItem' });
    const { t } = useTranslation('setting', { keyPrefix: 'payRelated' });

    const tabItemList = [{
        value: 'payMethod',
        label: t('payMethod'),/* 支付方式 */
        container: (<PayMethodContainerStyled />),
        default: true,
    }, {
        value: 'ecpay',
        label: t('ecpay'),/* 綠界支付 */
        container: (<EcPayContainerStyled />),
    }, {
        value: 'invoiceGo',
        label: t('invoiceGo'),/* InvoiceGo發票設定 */
        container: (<InvoiceGoContainerStyled />),
    }];

    return (
        <PageTitle title={translationMenu.t('payRelated')}>
            <TabContainer tabItemList={tabItemList} />
        </PageTitle>
    );
}