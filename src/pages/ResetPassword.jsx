/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender from "apiSender"; // 載入 /src/apiSender/index.js
// import styled from 'styled-components';
import InputText from "component/InputText"
import Button from "component/Button"
import TipModal from "component/TipModal"

import { login as themeObject } from 'theme/reas'
import { useTranslation } from 'react-i18next';
import { ResetPasswordFlow } from 'flow/login';
import { ResetPasswordModel } from 'fragment/Login';

let resetSuccessModalRef;

// const themeObject = {
//     linkText: '#2080ff',
//     // linkText: '#394657',
//     // button: '#f1f1f1', // a35959
//     buttonBorder: '#cacaca',
//     // buttonBorder: '#b34040'
// };

const getTheme = (key, defaultVal) => props => {
    if (props.theme) {
        if (props.theme[key]) {
            return props.theme[key];
        }
    }
    return defaultVal;
};

// const ResetSuccessTipModal = () => {
//     let navigate = useNavigate();
//     const onConfirmHandle = () => () => {
//         // console.log('onConfirmHandle');

//         // 轉跳回登入頁
//         navigate('/');
//     };

//     return (<div>AAAAAA</div>)
//     // return (<TipModal title="密碼重置" content="您的密碼已成功重置，按下確認後轉跳回登錄頁"
//     //     fetchModalRef={ref => (resetSuccessModalRef = ref)} onConfirm={onConfirmHandle()}></TipModal>)
// }

// HTML結構
const ResetPasswordContainer = ({ theme, control, model }) => {
    if (!(model instanceof ResetPasswordModel)) {
        console.error(`model is not ResetPasswordModel`);
        return (<div></div>);
    }

    const { t } = useTranslation('login', { keyPrefix: 'resetPassword' });

    // 取得param參數
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState(model.getState('password'));
    let actPassword = model.reactive('password', 'ResetPasswordContainer', setPassword);

    const [passwordComment, setPasswordComment] = useState(model.getState('password'));
    let actPasswordComment = model.reactive('passwordComment', 'ResetPasswordContainer', setPasswordComment);


    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [passwordMatch, setPasswordMatch] = useState('empty');

    let passwordMatchComment = '';

    if (passwordMatch === 'empty') {
        passwordMatchComment = '';
    } else if (passwordMatch === 'match') {
        passwordMatchComment = t('passwordMatch'); // 檢測密碼一致
    } else if (passwordMatch === 'noMatch') {
        passwordMatchComment = t('passwordNotMatch'); // '密碼不一致';
    } else {
        passwordMatchComment = '';
    }

    const checkPasswordMatch = (a, b) => {
        let matchRes;

        if (a === '' && b === '') {
            matchRes = 'empty';
        } else if (a === b) {
            matchRes = 'match';
        } else {
            matchRes = 'noMatch';
        }

        setPasswordMatch(matchRes);

        if (matchRes === 'match') {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }

    const handleInputPassword = () => value => {
        actPassword(value);
        checkPasswordMatch(value, passwordConfirm);

        // setPassword(e.target.value);
        // checkPasswordMatch(e.target.value, passwordConfirm);
    }

    const handleInputPasswordConfirm = () => value => {
        setPasswordConfirm(value);
        checkPasswordMatch(password, value);

        // setPasswordConfirm(e.target.value);
        // checkPasswordMatch(password, e.target.value);
    }

    return (
        <ContainerStyled theme={themeObject}>
            <div className="container__board">
                <div className="container__panel">
                    <div className="panel__billboard">
                        <div className="billboard__login"></div>
                    </div>
                    <div className="panel__title">
                        {/* 在下方欄位輸入您的新密碼 */}
                        {t('inputNewPasswordBelow')}
                    </div>
                    <div className="panel__form-board">
                        <div className="panel__form">
                            <div className="form__item-name">
                                {/* 新密碼 */}
                                {t('newPassword')}
                            </div>
                            <div className="form__input">
                                <InputText type="password" placeholder={t('plsInputPassword')} importStyle={{
                                    width: '100%',
                                }} value={password} onUpdate={handleInputPassword()}></InputText>
                                <div className="comment-alert">
                                    {/* AAAAAAA */}
                                    {passwordComment}
                                </div>
                            </div>
                            <div className="form__item-name">
                                {/* 確認密碼 */}
                                {t('confirmPassword')}
                            </div>
                            <div className="form__input">
                                <InputText type="password" placeholder={t('plsInputPasswordAgain')} importStyle={{
                                    width: '100%',
                                }} value={passwordConfirm} onUpdate={handleInputPasswordConfirm()}></InputText>
                            </div>
                            <div className="panel__input-comment" style={{ color: passwordMatch === 'match' ? '' : '#e90b0b' }}>
                                {passwordMatchComment}
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="panel_buttonRow">
                        <Button type="fill" disabled={buttonDisabled}
                            onClick={control.bindAct('onResetPasswordClick', token)}>
                            {/* 確定 */}
                            {t('confirm')}
                        </Button>
                    </div>
                </div>
            </div>
        </ContainerStyled>
    )
}

// const ContainerStyled = styled(ResetPasswordContainer)`
const ContainerStyled = styled.div`
  display: flex;
  /* width: 100vw; */
  height: 95vh;
  /* background-color: #3d3d3d; */
  /* background-color: #f1f1f1; */
  /* background-color: #4e9b86; */
  background-color: ${getTheme('main', '#f1f1f1')};
  justify-content: center;
  align-items: center;
  padding: 20px;

  color: ${getTheme('text', '#000000')};


  .container__picture {
    display: flex;
    flex-grow: 1; // 延伸
    height: 100%;
    background-color: #b8b8b8;
    margin: 25px;
  }
  .container__board {
    display: inline-flex; // 用來讓底下的absolute區塊生效，同時維持flex
    position: absolute;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 94%;

    background-color: ${getTheme('loginBoard', '#f1f1f1')};
    box-shadow: 8px 10px 3px ${getTheme('loginBoardShadow', '#f1f1f1')};

    .container__panel {
        display: flex;
        flex-direction: column;
        width: 550px;
        /* background-color: #cc7b7b; */
        margin: 25px;
        align-items: center;

        .panel__billboard {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /* background-color: #d5b978; */
            width: 100%;

            margin-bottom: 2rem;

            .billboard__login {
                /* background-color: #b8b8b8; */
                width: 340px;
                height: auto;
            }
        }
        .panel__title {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            /* background-color: #7ea187; */
        }
        .panel__form-board {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            .panel__form {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 70%;

                /* background-color: #7c4646; */

                .form__item-name {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    /* align-items: center; */

                    width: 100%;
                    /* color: #7c4646; */

                    margin-top: 1rem;
                }
                .form__input {
                    padding-top: 0.5rem;

                    width: 100%;

                    & .comment-alert {
                        color: #e90b0b;
                    }
                }
                .panel__input-comment {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;

                    width: 100%;

                    margin-top: 0.5rem;

                    /* color: #e90b0b */
                }
            }
        }
        .panel_buttonRow {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            /* background-color: #b86e94; */
            width: 100%;
        }
        hr {
            width: 500px;
            border: 1px solid ${getTheme('hr', 'blue')};
            background-color: ${getTheme('hr', 'blue')};
        }
    }
  }
`


function ResetPassword({ fetchControl }) {

    const { t: resetPasswordT } = useTranslation('login', { keyPrefix: 'resetPassword' });

    const resetPasswordModel = new ResetPasswordModel(useRef(null), { resetPasswordT });

    const resetPasswordFlow = new ResetPasswordFlow();
    resetPasswordFlow.registModel('stateModel', resetPasswordModel);
    resetPasswordFlow.bindFetchControl(fetchControl);
    resetPasswordFlow.registRef('navigate', useNavigate());

    return (
        <div>
            {/* <ResetSuccessTipModal></ResetSuccessTipModal> */}
            <ResetPasswordContainer fetchControl={fetchControl} model={resetPasswordModel}
                control={resetPasswordFlow}></ResetPasswordContainer>
        </div>
    );
}

export default ResetPassword; 