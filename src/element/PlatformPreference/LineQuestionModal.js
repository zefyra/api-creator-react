import { useState, useEffect } from 'react';
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

import Button from 'component/Button';
import InputText from 'component/InputText';
import Select from 'component/Select';

import Modal from 'component/Modal';


const LineQuestionModalInner = ({ className, modalType, setOpenModalRef, onSave, onCancel }) => {

    const { t } = useTranslation('pay', { keyPrefix: 'platformPreferenceLine' })

    return (
        <Modal childRef={ref => (setOpenModalRef(ref))}
            modalWidth={800} modalHeight={730}>
            <div className={className}>
                <div className="modal-title">
                    {/* 如何連接綁定你的LINE官方帳號 */}
                    {t('howBindLineOfficialAccount')}
                </div>
                <div className="modal-container">
                    <div className="text-row">
                        {/* (1) 請前往LINE官方號管理後台(路徑:  */}
                        {t('bindLineStep1')}<a href="https://manager.line.biz">https://manager.line.biz</a>{`)`}
                    </div>
                    <div className="text-row">
                        {/* (2) 前往 LINE Developer，點擊「設定」 >開啟LINE官方帳號的「Messaging API」頁面，將看到包含「Channel ID」及「Channel secret」。 */}
                        {t('bindLineStep2')}
                    </div>
                    <div className="text-row">
                        {/* (3) 請複製「Channel ID」及「Channel secret」。 */}
                        {t('bindLineStep3')}
                    </div>
                    <div className="img-row">
                        <img src="/line_channel_id.png" alt="line_channel_id"></img>
                    </div>
                    <div className="text-row">
                        {/* (4) 點擊Line developers頁面 (路徑:  */}
                        {t('bindLineStep4')}<a href="https://developers.line.biz/conosle/">https://developers.line.biz/conosle/</a>{`)`}
                    </div>
                    <div className="text-row">
                        {/* (5) 點擊Messaging API>Channel access token>點擊「issue」>複製「Channel access token」。 */}
                        {t('bindLineStep5')}
                    </div>
                    <div className="text-row">
                        {/* (6) 前往CrossBot管理後台，於「平台參數」>選擇「LINE」渠道，輸入「Channel ID」、「Channel Secret」、「Access Token」後，點擊「儲存」。 */}
                        {t('bindLineStep6')}
                    </div>
                    <div className="text-row">
                        {/* (7) 點擊「設定webhook」>「同步資料」後即完成綁定設定 */}
                        {t('bindLineStep7')}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

const LineQuestionModalInnerStyled = styled(LineQuestionModalInner)`
display: flex;
flex-direction: column;
width: 800px;
height: 730px;

.modal-title {
    display: flex;
    flex-direction: row;
    width: 100%;
    /* margin: 0.5rem 1rem; */

    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;

    /* background-color: #c2c2c2; */


    /* 底線顏色 #6d8e83 */
}

.modal-container {
    display: flex;
    flex-direction: column;
    
    width: 100%;
    margin-top: 1rem;
    /* margin-left: 50px; */

    align-items: center;

    .text-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        width: 90%;

        margin: 0.5rem 1rem;
    }
    .img-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        
        width: 100%;

        img {
            width: 692px;
            height: 318px;
        }
        margin: 0.5rem 1rem;
    }
}

`;


export default LineQuestionModalInnerStyled;