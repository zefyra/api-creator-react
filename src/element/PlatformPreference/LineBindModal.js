import { useState, useEffect } from 'react';
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

import Button from 'component/Button';
import InputText from 'component/InputText';
import Select from 'component/Select';

import Modal from 'component/Modal';
import { LineBindModel } from 'fragment/PlatformPreference';





// const LineBindModalInnerStyled = styled(LineBindModalInner)`
const LineBindModalInnerStyled = styled.div`
display: flex;
flex-direction: column;
width: 650px;
height: 450px;

    .modal-title {
        display: flex;
        flex-direction: row;
        width: 100%;
        /* margin: 0.5rem 1rem; */

        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        box-sizing: border-box;

        /* background-color: #c2c2c2; */
    }

    .modal-container {
        display: flex;
        flex-direction: column;
        
        width: 100%;
        margin-top: 1rem;
        /* margin-left: 50px; */

        align-items: center;

        .modal-form-row {
            display: flex;
            flex-direction: row;

            margin: 1rem 0;
            .modal-form-title { 
                width: 150px;
                
                display: flex;
                flex-direction: row;
                /* justify-content: flex-start; */
                align-items: center;
            }
            .modal-form-content {
                
            }
        }
    }

`


const LineBindModalInner = ({ model, modalType, setOpenModalRef, onSave, onCancel }) => {

    if (!(model instanceof LineBindModel)) {
        console.error(`LineBindModal: model is not LineBindModel`);
        return (<div></div>)
    }

    const { t } = useTranslation('pay', { keyPrefix: 'platformPreference' });

    const [channelId, setChannelId] = useState('');
    const [channelSecret, setChannelSecret] = useState('');
    const [accessToken, setAccessToken] = useState('');

    const actChannelId = model.reactive('channelId', 'LineBindModalInner', setChannelId);
    const actChannelSecret = model.reactive('channelSecret', 'LineBindModalInner', setChannelSecret);
    const actAccessToken = model.reactive('accessToken', 'LineBindModalInner', setAccessToken);

    const onClickCancel = () => () => {
        onCancel();
    }

    const onClickSave = () => () => {
        onSave();
        // onSave({
        //     channelId: channelId,
        //     channelSecret: channelSecret,
        //     accessToken: accessToken,
        // });
    }

    return (
        <Modal childRef={ref => (setOpenModalRef(ref))}
            modalWidth={650} modalHeight={450}>
            <LineBindModalInnerStyled>
                <div className="modal-title">
                    綁定Line官方帳號
                </div>
                <div className="modal-container">
                    {/* <div className="modal-form-row">
                        <div className="modal-form-title">
                            ChannelId
                        </div>
                        <div className="modal-form-content">
                            <InputText value={channelId} onUpdate={actChannelId}></InputText>
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="modal-form-title">
                            Channel&nbsp;Secret
                        </div>
                        <div className="modal-form-content">
                            <InputText value={channelSecret} onUpdate={actChannelSecret}></InputText>
                        </div>
                    </div> */}
                    <div className="modal-form-row">
                        <div className="modal-form-title">
                            Access&nbsp;Token
                        </div>
                        <div className="modal-form-content">
                            <InputText value={accessToken} onUpdate={actAccessToken}></InputText>
                        </div>
                    </div>
                    <div className="modal-form-row">
                        <div className="modal-form-button">
                            {/* 取消 */}
                            <Button type="fill" mode="primary" onClick={onClickCancel()}>{t('cancel')}</Button>
                        </div>
                        <div className="modal-form-button">
                            {/* 儲存 */}
                            <Button type="fill" mode="primary" onClick={onClickSave()}>{t('save')}</Button>
                        </div>
                    </div>
                </div>
            </LineBindModalInnerStyled>
        </Modal>
    );
};


export default LineBindModalInner;