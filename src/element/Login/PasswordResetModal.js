import Modal from "component/Modal"
import styled from 'styled-components';
import Button from "component/Button"
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import InputText from "component/InputText"
import { useEffect, useState } from "react";
import CountdownTimer from "util/CountdownTimer";
import { useSelector, useDispatch, connect } from 'react-redux';
import { openAlertModal } from 'store/alert';

import { useTranslation, withTranslation } from 'react-i18next';

import ThemeMixin from 'util/ThemeMixin'
import { ResetPasswordFlow } from "flow/login";
import { ResetPasswordModel } from "fragment/Login";
const getTheme = ThemeMixin.fetchGetTheme();

// let noBindAccountModalRef;

// 計時器
let resetPasswordTimer = new CountdownTimer({
    initTime: 0, // 開啟燈箱時的數值是0
});

const PasswordResetModal = ({ className, control, defaultEmail }) => {
    if (!(control instanceof ResetPasswordFlow)) {
        console.error('control is not ResetPasswordFlow')
        return;
    }

    const { t } = useTranslation('login', { keyPrefix: 'resetPassword' });

    const [email, setEmail] = useState(defaultEmail);
    useEffect(function () {
        setEmail(defaultEmail);
    }, [defaultEmail])
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [haveSend, setHaveSend] = useState('');

    const sendResetPassword = () => () => {
        setButtonDisabled(true); // 鎖定送出按鈕

        // 啟動計時器
        resetPasswordTimer.setInitTime(60);
        resetPasswordTimer.start();

        control.onSendResetPassword(email, function (event) {
            if (event === 'success') {
                setHaveSend('haveSend'); // 顯示已送出成功的文字
            } else if (event === 'emailNotFound') {
                // 代表沒找到該Email的帳號
                setHaveSend('accountInvalid'); // 設定haveSend的狀態

                // 解開送出按鈕鎖定
                setButtonDisabled(false);
            }
        });
        /*
        // 送出重設的API
        ApiSender.sendApi('[get]/auth/forgot-password/{email}', null, {
            apiInnerData: {
                email: email,
            }
        }).then((data) => {
            setHaveSend('haveSend'); // 顯示已送出成功的文字
        }).catch(new ApiError(function (error, next) {
            // console.error('err filter', error);
            //  error: {
            //     code: 7
            //     data: null
            //     msg: "fail"
            // } 
            if (error.code === '00007') {
                // 代表沒找到該Email的帳號
                setHaveSend('accountInvalid'); // 設定haveSend的狀態

                // 解開送出按鈕鎖定
                setButtonDisabled(false);

                return next();
            }
            // 執行next代表要開啟燈箱
            return next();
        }).catchAlertMsg());
*/


    };
    // 計時器顯示----------------------------------------------------------------------

    const getMinuteByTime = function (interval) {
        // interval: 剩餘秒數
        return Math.floor(interval / 60);
    }

    const getSecondByTime = function (interval) {
        // interval: 剩餘秒數
        return interval % 60;
    }

    const [minute, setMinute] = useState(getMinuteByTime(resetPasswordTimer.getInterval()));
    const [second, setSecond] = useState(getSecondByTime(resetPasswordTimer.getInterval()));

    const toTimeStr = (val) => {
        return val < 10 ? `0${val}` : val;
    }

    // 設定Tick的Callback
    resetPasswordTimer.setTickCallback(function (interval) {
        setMinute(getMinuteByTime(interval));
        setSecond(getSecondByTime(interval));
    });

    // 設定時間到的callback
    resetPasswordTimer.setTimeoutCallback(function () {
        // 解除Button的鎖定
        setButtonDisabled(false); // 鎖定送出按鈕
    });

    let sendButtonCommentAlert;

    if (haveSend === 'haveSend') {
        sendButtonCommentAlert = <div className="warn-modal-comment alert">
            {/* 已寄送密碼重置信至您的信箱 */}
            {t('haveSendResetMail')}
        </div>;
    } else if (haveSend === 'accountInvalid') {
        sendButtonCommentAlert = <div className="warn-modal-comment alert">
            {/* 找不到使用此電子郵件的帳戶 */}
            {t('notFoundEmailAccount')}
        </div>;
    }

    let sendButtonComment;

    if (haveSend === 'haveSend') {
        sendButtonComment = <div className="warn-modal-comment">
            {/* 如您找不到信件，請確認輸入的帳密、垃圾信件匣，或者可能信件被mail server阻擋 */}
            {t('plsSearchInGarbageFolder')}
        </div>;
    }

    // childRef={ref => (setOpenModalRef(ref))}
    return (<Modal childRef={control.bindRef('passwordResetModal')}
        modalWidth={600} modalHeight={460}>
        <div className={className}>
            <div className="warn-modal-title">
                {/* 密碼重置 */}
                {t('passwordReset')}
            </div>
            <hr />
            <div className="warn-modal-content">
                {/* 請輸入您註冊時所輸入的Email，我們將寄送密碼重置的信件置您的電子信箱。 */}
                {t('modalContent')}
            </div>
            <div className="warn-modal-content input-text">
                {/* placeholder="請輸入Email" */}
                <InputText placeholder={t('plsInputEmail')} value={email} onUpdate={val => { setEmail(val) }}></InputText>
            </div>
            <div className="warn-modal-content">
                <span className="warn-modal-content-highlight-text">{toTimeStr(minute)}</span>{t('minute')}:&nbsp;<span className="warn-modal-content-highlight-text">{toTimeStr(second)}</span>{t('second') + t('canSendResetMailAfter')}{/*秒後，可點擊寄送密碼重置信*/}
            </div>
            <div className="warn-modal-button-row">
                <Button type="fill" widthType="wide" disabled={buttonDisabled} onClick={sendResetPassword()}>{t('sendResetPasswordMail')}{/* 寄送密碼重置信 */}</Button>
            </div>
            {sendButtonCommentAlert}
            {sendButtonComment}
        </div>
    </Modal>);
}


const PasswordResetModalInnerStyled = styled(PasswordResetModal)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    
    /* width: 300px;
    height: 80px; */

    /* background-color: aquamarine; */

    width: 600px;
    height: 460px;
    
    background-color: transparent; // 不顯示，直接使用底層的background-color
    color: ${getTheme('text', '#000000')};

    .warn-modal-title {
        margin-top: 45px;
        margin-left: ${props => props.marginH};
        margin-right: ${props => props.marginH};
        
        /* background-color: #6445bb; */
    }

    hr {
        width: 35%;
        /* text-align: left; */
        /* max-width: 800px; */
        margin-left:${props => props.marginH};
        
        background-color: ${getTheme('hr', '#1520ff')};
        border-width: 1px;
        border-color: ${getTheme('hr', '#1520ff')};
    }
    .warn-modal-content {
        /* margin-left: ${props => props.marginH};
        margin-right: ${props => props.marginH}; */

        /* padding-top: 55px; */

        box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

        padding-top: 15px;
        padding-left: ${props => props.marginH};
        padding-right: ${props => props.marginH};

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        width: 100%;
        
        /* background-color: #bb8845; */
        .warn-modal-content-highlight-text {
            /* color: #1925cd; */
            color: ${getTheme('highlightText', '#1520ff')};
        }
    }
    .warn-modal-content.input-text{
        margin-top: 20px;
    }
    .warn-modal-comment {
        /* margin-left: ${props => props.marginH};
        margin-right: ${props => props.marginH}; */

        /* padding-top: 55px; */

        box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

        padding-top: 15px;
        padding-left: 130px;
        padding-right: 130px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;

        width: 100%;
    }
    .warn-modal-comment.alert {
        color: #ba2727;
    }
    .warn-modal-button-row {
        /* margin-left: ${props => props.marginH};
        margin-right: ${props => props.marginH}; */

        /* padding-left: ${props => props.marginH}; */

        padding-top: 15px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        width: 100%;

        /* background-color: #458abb; */
    }
`

export default PasswordResetModalInnerStyled;