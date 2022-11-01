import React, { useState } from "react";
import styled from 'styled-components';
import Modal from "component/Modal"
import Button from "component/Button"
import { useDispatch, useSelector, connect } from 'react-redux';
import {
    selectAccount, selectResendButtonDisabled,
    updateResendButtonDisabled, updateRegistButtonDisabled
} from 'store/login';
import CountdownTimer from "util/CountdownTimer";
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

import { useTranslation, withTranslation } from 'react-i18next';

import { modal as themeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'
const getTheme = ThemeMixin.fetchGetTheme();

// v1. 將panel獨立切出來的版本

const ResendPanel = ({ className, onResend, timer, setDisable, onPanelOpen }) => {
    // timer: <CountdownTimer>

    const { t } = useTranslation('login', { keyPrefix: 'resendVerify' });

    const account = useSelector(selectAccount);

    const onResendVerifyMail = () => (e) => {
        // console.log('onResendVerifyMail');

        onResend(e);
    }

    const getMinuteByTime = function (interval) {
        // interval: 剩餘秒數
        return Math.floor(interval / 60);
    }

    const getSecondByTime = function (interval) {
        // interval: 剩餘秒數
        return interval % 60;
    }


    const [minute, setMinute] = useState(getMinuteByTime(timer.getInterval()));
    const [second, setSecond] = useState(getSecondByTime(timer.getInterval()));

    // const [resendButtonDisabled, setResendButtonDisabled] = useState(true);
    const resendButtonDisabled = useSelector(selectResendButtonDisabled);

    // 設定Tick的Callback
    timer.setTickCallback(function (interval) {
        setMinute(getMinuteByTime(interval));
        setSecond(getSecondByTime(interval));
    });

    const dispatch = useDispatch();
    timer.setTimeoutCallback(function () {
        // 解除Button的鎖定
        // setResendButtonDisabled(false);
        dispatch(updateResendButtonDisabled(false));

        dispatch(updateRegistButtonDisabled(false));
    });


    onPanelOpen(function () { // 設定Modal開啟時要做的事情
        // Modal開啟時，鎖定Button
        // 鎖定「重新驗證Email」按鈕
        dispatch(updateResendButtonDisabled(true));

        // 鎖定「註冊」按鈕
        dispatch(updateRegistButtonDisabled(true));
    });


    const toTimeStr = (val) => {
        return val < 10 ? `0${val}` : val;
    }

    return (
        <div className={className}>
            <div className="resend-panel-tip">
                <div className="resend-panel-tip-text">
                    {/* 我們已發送一封「會員認證信」，至您註冊時填寫的信箱 */}
                    {t('haveSendVerifyMail')}<span className="resend-panel-highlight-text">{account}</span>{t('plsDo')}{/* ，請您於 */}<span className="resend-panel-highlight-text">{t('verifyHours')}{/* 3 */}</span>{t('inHoursOpenTheMail')}{/* 小時內閱覽該驗證信，並點選連結，完成認證作業。 */}
                </div>
            </div>
            <hr />
            <div className="resend-panel-comment">
                {t('prefixAferTimeCanResendVerifyEmail')}<span className="resend-panel-highlight-text">{toTimeStr(minute)}</span>{t('min')}{/* 分 */}:&nbsp;<span className="resend-panel-highlight-text">{toTimeStr(second)}</span>{t('second')}{t('suffixAferTimeCanResendVerifyEmail')}{/* 秒後，可點擊重發驗證信 */}
            </div>
            <div className="resend-panel-button-row">
                <Button disabled={resendButtonDisabled} type="fill" mode="primary" widthType="wide" onClick={onResendVerifyMail()}>{t('resendVerifyEmail')}{/* 重發驗證信 */}</Button>
            </div>
        </div>
    );
}


const ResendPanelStyled = styled(ResendPanel)`
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;

    width: 600px;   

    background-color: transparent; // 不顯示，直接使用底層的background-color
    color: ${getTheme('text', '#000000')};

    .resend-panel-highlight-text {
        /* color: #1925cd; */
        color: ${getTheme('highlightText', '#1520ff')};
    }

    .resend-panel-tip {
        margin-top: 65px;
        /* margin-left: 65px;
        margin-right: 65px; */
        margin-bottom: 15px;

        width: 450px;

        .resend-panel-tip-text {

        }
    }
    hr {
        width: 450px;
        background-color: ${getTheme('hr', '#1520ff')};
        border-width: 1px;
        border-color: ${getTheme('hr', '#1520ff')};
    }
    .resend-panel-comment {
        margin-top: 15px;
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 15px;

    }
    .resend-panel-button-row {
        display: flex;
        flex-direction: row;
        justify-content: center;

        margin-top: 15px;
        margin-left: 30px;
        margin-right: 30px;
        margin-bottom: 15px;
    }
`


class ResendVerifyEmailModal extends React.Component {
    constructor(props) {
        super(props);

        this.modalRef = null;
        // this.childModalRef = null; // React Ref
        // this.modalDomRef = null; // Dom Ref

        // 計時器
        this.timer = new CountdownTimer({
            initTime: 60,
        });

        this.panelOpenCallback = null;
    }

    componentDidMount() {
        // 這個是React的Ref
        const { modalRef } = this.props;

        // console.log('ResendVerifyEmailModal componentDidMount', this.modalRef);
        modalRef(this); // 綁定自己的
        // modalRef(this.modalRef); // 綁定底下的
    }

    componentWillUnmount() { // beforeDestory
        const { modalRef } = this.props;
        modalRef(undefined); // 解除綁定
    }

    // 多疊一層，用來在開啟Modal時做一些額外操作
    openModal() {
        // 啟動註冊帳號面板

        // 開啟燈箱
        this.modalRef.openModal();

        this.timer.start();

        // this.onPanelOpen(true);
        if (this.panelOpenCallback) {
            this.panelOpenCallback();
        }
    }

    setPanelOpen(callback) {
        this.panelOpenCallback = callback;
    }

    /*
    sendResendEmailApi() {
        let email = this.props.account;
        console.log('sendResendEmailApi')

        // 重新驗證Email的API
        return ApiSender.sendApi('[get]/auth/activate/{email}', null, {
            apiInnerData: {
                email: email,
            }
        }).catch(new ApiError(function (error, next) {
            next(error); // 代表繼續將error往上拋
        }).catchAlertMsg());
    }*/

    // 重發驗證信
    onResend() {
        // 計時器重新啟動
        this.timer.start();

        // 鎖定「重新驗證Email」按鈕
        this.props.updateResendButtonDisabled(true);
        // 鎖定「註冊」按鈕
        this.props.updateRegistButtonDisabled(true);

        // 重新驗證Email的API
        // this.sendResendEmailApi();
        this.props.loginControl.onResendVerifyEmailModalClickResend();

        // this.modalRef.closeModal();
    }

    render() {

        return (
            <Modal childRef={ref => (this.modalRef = ref)}
                modalWidth={600} modalHeight={293} >
                {/* v1:將Panel獨立出來的版本 */}
                <ResendPanelStyled onResend={this.onResend.bind(this)} timer={this.timer} onPanelOpen={this.setPanelOpen.bind(this)} theme={themeObject}></ResendPanelStyled>
            </Modal>
        );
    }
}


// const ResendVerifyEmailModalStyled = styled(ResendVerifyEmailModal)`
//     display: flex;
//     flex-direction: column;
//     align-items: center;

//     width: 600px;

//     .resend-panel-highlight-text {
//         color: #1925cd;
//     }

//     .resend-panel-tip {
//         margin-top: 50px;
//         margin-left: 30px;
//         margin-right: 30px;
//         margin-bottom: 15px;

//         .resend-panel-tip-text {

//         }
//     }
//     hr {
//         width: 80%;
//     }
//     .resend-panel-comment {
//         margin-top: 15px;
//         margin-left: 30px;
//         margin-right: 30px;
//         margin-bottom: 15px;

//         /* background-color: #b9923e; */
//     }
//     .resend-panel-button-row {
//         display: flex;
//         flex-direction: row;
//         justify-content: center;

//         margin-top: 15px;
//         margin-left: 30px;
//         margin-right: 30px;
//         margin-bottom: 15px;
//     }
// `


function mapStateToProps(state) {
    const { login } = state
    return {
        account: login.account,
        // password: login.password,
    }
}

function mapDispatchToProps(dispatch) {
    // // 因為綁定mapStateToProps以後，Component內部就會抓不到this.props.dispatch
    // const bindDispatch = (dispatch, actionFunc) => payload => dispatch(actionFunc(payload));

    return {
        dispatch,
        updateResendButtonDisabled: function (val) {
            dispatch(updateResendButtonDisabled(val));
        },
        updateRegistButtonDisabled: function (val) {
            dispatch(updateRegistButtonDisabled(val));
        }

        // 鎖定「重新驗證Email」按鈕
        // dispatch(updateResendButtonDisabled(true));

        // 鎖定「註冊」按鈕
        // dispatch(updateRegistButtonDisabled(true));


        // updateToken: function (token) {
        //     // console.log('mapDispatchToProps dispatch', dispatch)
        //     // console.log('mapDispatchToProps updateToken', token);
        //     dispatch(updateToken(token));
        // },
        // // 簡化之後的寫法
        // updateToken: bindDispatch(dispatch, updateToken),
    };
}


// export default ResendVerifyEmailModal;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResendVerifyEmailModal);