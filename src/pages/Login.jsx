/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'



import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { navigate } from "router/navigator"
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import { useSelector, useDispatch, connect } from 'react-redux';
import {
    selectAccount, selectPassword, selectPageMode, selectAccountValid, selectRegistButtonDisabled,
    updateAccount, updatePassword, updatePageMode, updateToken, updateRegistButtonDisabled, selectPasswordValidMode, selectResendVerifyDisabled
} from 'store/login';
// import LoginModule from 'module/login'
// import Button from "component/Button"

import { useTranslation, withTranslation } from 'react-i18next';

import { login as themeObject } from 'theme/reas'
import { modal as modalThemeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'

// import Modal from "component/Modal"
import ResendVerifyEmailModal from 'element/Login/ResendVerifyEmailModal'
import NoBindAccountModal from 'element/Login/NoBindAccountModal'
import PasswordResetModal from 'element/Login/PasswordResetModal'
// import AlertModule from 'module/alert'
// import {
//     selectAlertModalShow,
//     updateAlertModalShow, openAlertModal
// } from 'store/alert';

import { ReactComponent as GlobeSvg } from 'assets/svg/globe.svg'

import { getLangItemList } from 'module/lang';
import LoginFlow, { ResetPasswordFlow } from 'flow/login';
import PasswordValidEnum from 'enum/login/PasswordValid';
import { ResetPasswordModel } from 'fragment/Login';
import PasswordValidator from 'validator/PasswordValidator';


const loginElementWidth = '23rem'; // 輸入框、按鈕的寬度
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

const themeMixin = new ThemeMixin(themeObject);

const PageModeTabGroup = ({ className }) => {

    let navigate = useNavigate();
    let dispatch = useDispatch();

    let pageMode = useSelector(selectPageMode);

    // const [tabMode, setTabMode] = useState(pageMode);

    const handleSwitchPageMode = mode => () => {

        // setTabMode(mode);
        dispatch(updatePageMode(mode));

        if (mode === 'regist') {
            navigate('/regist');
        } else {
            navigate('/');
        }
    };

    const { t } = useTranslation('login', { keyPrefix: 'login' });

    return (
        <div className={className}>
            <div className={`tab-item ${!pageMode ? 'active' : ''}`} onClick={handleSwitchPageMode('')}>
                {/* 登錄 */}
                {t('signin')}
            </div>
            <div className={`tab-item ${pageMode === 'regist' ? 'active' : ''}`} onClick={handleSwitchPageMode('regist')}>
                {/* 註冊 */}
                {t('signup')}
            </div>
        </div>
    );
};

const PageModeTab = styled(PageModeTabGroup)`
    
    /* background-color: #84989f; */
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    
    .tab-item {
        /* background-color: #61bbdc; */
        padding: 1.05rem;
        cursor: pointer;
        font-size: 0.975rem;
        /* font-weight: 600; */
        /* color: #396994; */
        color: ${getTheme('tabItemTextColor', '#396994')};

        border-bottom: none;
    }
    .tab-item.active {
        /* background-color: #070707;
        border-bottom: 4px solid #3e95e0; */
        color: ${getTheme('tabItemTextColorActive', '#396994')};
        background-color: ${getTheme('tabItemActive', '#a6d5ff')};
        border-bottom: 4px solid ${getTheme('tabItemActiveBottom', '#3e95e0')};
    }

`;


const InputStyled = styled.input`
    height: 2.3rem;
    width: ${props => props.elementWidth || '18rem'};

    border-width: 0px;
    /* border-width: 2px;
    border-style: solid; */
    /* border-color: #cacaca; */
    /* border-color: ${getTheme('inputBorderColor', '#cacaca')}; */
    box-shadow: 5px 7px 2px ${getTheme('inputShadow', '#f1f1f1')};

    background-color: ${getTheme('inputColor', '#ffffff')};
    color: ${getTheme('inputTextColor', '#000000')};
    

    /* background-color: #5e9aaf; */
    outline: none; // 關閉亮起的外框

    font-size: 1.05rem;
    text-align: left;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

    margin-top: 20px;

    &.focus {
        outline: none; // 關閉亮起的外框
    }
`;

const AccountInput = () => {
    const { t } = useTranslation('login');

    const dispatch = useDispatch();

    const handleInput = event => {
        dispatch(updateAccount(event.target.value));
    };

    let account = useSelector(selectAccount);

    let pageMode = useSelector(selectPageMode);

    let placeholderStr;
    if (pageMode === 'regist') {
        placeholderStr = t('regist.plsInputEmail'); // '請輸入註冊的電子信箱';
    } else {
        placeholderStr = t('login.plsInputEmail'); //'請輸入Email';
    }

    // ps.這裡還要依照pageMode改變字樣
    return (<InputStyled type="text" placeholder={placeholderStr}
        elementWidth={loginElementWidth} value={account}
        onChange={handleInput} theme={themeObject}></InputStyled>);
};

const PasswordInputStyled = styled(InputStyled)`
  /* background-color: #816a92; */
`

const PasswordInput = ({ control }) => {
    const { t } = useTranslation('login');

    // let navigate = useNavigate();
    const dispatch = useDispatch();

    let pageMode = useSelector(selectPageMode);

    const handlePwKeyDown = () => e => {
        // 判斷是登入事件
        if (e.key === 'Enter') {
            control.onPasswordEnter(pageMode);
        }
    };

    const handleInput = event => {
        dispatch(updatePassword(event.target.value));
    };

    let password = useSelector(selectPassword);

    return (
        <PasswordInputStyled type="password" placeholder={t('regist.plsInputPassword')}
            elementWidth={loginElementWidth} onKeyDown={handlePwKeyDown()}
            value={password} onChange={handleInput} theme={themeObject}
        ></PasswordInputStyled>
    );
};

const ButtonStyled = styled.button`
    box-shadow: none;

    background-color: ${getTheme('button', '#f1f1f1')};
    /* border: 2px solid ${props => props.theme.buttonBorder || '#868686'}; */
    border: 2px solid ${getTheme('buttonBorderBorder', '#868686')};
    /* border-radius: 3px; */
    border-radius: ${getTheme('buttonRadius', '3px')};

    width: ${props => props.elementWidth || '18rem'};
    height: 2.2rem;

    margin: 0.75rem;

    cursor: pointer;

    &:active, &:hover, &:focus
    {
        box-shadow: none;
        /* border: 0px solid transparent; // 關閉border(因為會增加按鈕size) */

        color: ${getTheme('buttonTextHover', '#666868')};
        border: 2px solid ${getTheme('buttonBorderHover', '#666868')};
        background-color: ${getTheme('buttonHover', '#f1f1f1')};
    }

    
    &:active{
        box-shadow: none;
        /* box-shadow: 0px 0px 0px 0px transparent !important; */
        /* border: 0px solid transparent; // 關閉border(因為會增加按鈕size) */
        
        color: ${getTheme('buttonTextActive', '#666868')};
        border: 2px solid ${getTheme('buttonBorderActive', '#666868')};
        background-color: ${getTheme('buttonActive', '#f1f1f1')};
    }
    
    &:disabled{
        /* border: 2px solid #e68080; */
        /* border: 2px solid #bdbdbd; */
        /* color: #bdbdbd; */

        color: ${getTheme('buttonTextDisabled', '#666868')};
        border: 2px solid ${getTheme('buttonBorderDisabled', '#666868')};
        background-color: ${getTheme('buttonDisabled', '#f1f1f1')};

        cursor: not-allowed;
    }
`;

const LoginButton = ({ control }) => {
    const { t } = useTranslation('login', { keyPrefix: 'login' });
    // keyPrefix: 'login' 代表 t('login.login') ==> t('login')

    return (<ButtonStyled onClick={control.bindAct('onClickLogin')} theme={themeObject}
        elementWidth={loginElementWidth}>{t('login')}</ButtonStyled>)
}

const FacebookLoginButton = () => {
    const { t } = useTranslation('login', { keyPrefix: 'facebook' });

    const handleLoginFacebook = () => () => {
    };

    return (<ButtonStyled onClick={handleLoginFacebook()} theme={themeObject} elementWidth={loginElementWidth}>{t('facebookLogin')}</ButtonStyled>)
}

const RegistButton = ({ control }) => {
    if (!(control instanceof LoginFlow)) {
        console.error(`control is not LoginFlow`)
        return (<div></div>);
    }
    const { t } = useTranslation('login', { keyPrefix: 'regist' });

    const dispatch = useDispatch();

    const registButtonDisabled = useSelector(selectRegistButtonDisabled);

    const handleRegist = () => () => {
        // 按下以後，先將按鈕鎖定起來，避免連按
        dispatch(updateRegistButtonDisabled(true));

        control.onClickRegist(function (event) {
            if (event === 'success') {

            } else {
                // 代表出現不明錯誤，鎖定按鈕
                dispatch(updateRegistButtonDisabled(false));
            }
        });
    };
    return (<ButtonStyled disabled={registButtonDisabled} onClick={handleRegist()}
        theme={themeObject} elementWidth={loginElementWidth} >{t('regist')}</ButtonStyled>);
}

const NoRegistText = () => {
    let navigate = useNavigate();
    const { t } = useTranslation('login', { keyPrefix: 'login' });

    const dispatch = useDispatch();

    const toRegistPage = () => () => {
        dispatch(updatePageMode('regist'));
        navigate('/regist');
    }

    // 尚未註冊帳戶?按此立即註冊
    return (
        <div>{t('haventRegist')}<a onClick={toRegistPage()}>{t('registNow')}</a></div>
    );
}

const PrivacyText = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('login', { keyPrefix: 'regist' });

    // onClick={() => { navigate('/serviceTerms.html') }}
    // onClick={() => { navigate('/privacyPolicy') }}
    // 按下按鈕，表示您同意 服務條款 及 隱私權政策
    return (
        <div>{t('pressButtonAgree')}<a href="/serviceTerms.html">{t('serviceTerms')}</a>{t('and')}<a href="/privacyPolicy.html">{t('privacyPolicy')}</a></div>
    );
}

const ForgetRow = ({ control }) => {
    const { t } = useTranslation('login', { keyPrefix: 'login' });

    // 忘記密碼
    return (<div><a className="forgetPw" onClick={control.bindAct('onClickForgetPw')}>{t('forgetPassword')}</a></div>);
}

const ResendVerifyEmailRow = ({ control }) => {
    if (!(control instanceof LoginFlow)) {
        console.log(`ResendVerifyEmailRow: control is not LoginFlow`);
        return (<div></div>);
    }

    const { t } = useTranslation('login', { keyPrefix: 'regist' });

    let dispatch = useDispatch();
    // const registButtonDisabled = useSelector(selectRegistButtonDisabled);
    const resendVerifyDisabled = useSelector(selectResendVerifyDisabled);

    // 按下「重發驗證信」
    const openResendModal = () => () => {

        if (resendVerifyDisabled) {
            return;
        }
        // 按下以後，先將按鈕鎖定起來，避免連按
        dispatch(updateRegistButtonDisabled(true));

        control.onClickResendVerifyEmail(function (event) {
            if (event === 'error') {
                // 代表Email不符合，或其他可能error
                dispatch(updateRegistButtonDisabled(false));
            }
        });
    }

    return (<div><a className="forgetPw" style={{
        color: resendVerifyDisabled ? themeMixin.getTheme('linkTextDisabled', '#cacaca') : themeMixin.getTheme('linkText', '#2080ff'),
        // color: registButtonDisabled ? '#cacaca' : '#2080ff',
        cursor: resendVerifyDisabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
    }} onClick={openResendModal()}>{t('resendVerifyEmail')}{/* 重發驗證信 */}</a></div >);
}


const InputComment = ({ mode, children, modeMap }) => {
    // const textMap = {
    //     valid: '此為後續登入的帳號',
    //     invalid: '帳號格式不符',
    // };

    const { t } = useTranslation('login');

    const getCommentText = function (commentObj) {
        return typeof commentObj === 'string' ? commentObj : (commentObj.text || '')
    };

    const getCommentClassName = function (commentObj) {
        if (typeof commentObj === 'string') {
            return '';
        }
        return commentObj.className;
    };

    const commentObj = modeMap[mode] || '';
    const commentStr = getCommentText(commentObj);
    const modeClassName = getCommentClassName(commentObj);

    return (
        <div className="panel__inputComment">
            <div className={`input-comment ${modeClassName}`}>{commentStr}</div>
        </div>
    );
}

const LangDropdown = ({ show, right, top, subItemList, closeEvent }) => {

    // const location = useLocation()
    // const navigate = useNavigate();

    // 'right': right,
    // 'top': top,

    const subItemComponentList = subItemList.map((subItem, index) => {
        const handleSubItemClick = () => () => {
            // console.log('handleSubItemClick');
            if (subItem.event) {
                // event的模式
                subItem.event(subItem);

                // 關閉SubItem
                closeEvent();
            }
        };

        return <div key={index} className="lang-item" onClick={handleSubItemClick()}>{subItem.name}</div>
    });

    return (<div className="lang-dropdown" style={{
        'display': show ? 'block' : 'none',
    }}>
        {subItemComponentList}
    </div>);
}

// HTML結構
const LoginContainer = (context) => {
    const { loginControl, resetPwControl } = context;
    // context: {
    //     className // styled-component傳進來的class名稱
    //     elementWidth // 元件寬度
    //     pageMode // 頁面模式
    //     theme // 主題物件
    // }
    // 要在這裡初始化帳號密碼欄位

    let enterButton;
    let commentText;
    let forgetRow;

    // 從Redux取得pageMode
    let pageMode = useSelector(selectPageMode);

    // accountComment---------------------------------------------------------

    let accountComment;

    const { t } = useTranslation('login', { keyPrefix: 'regist' });
    const passwordValidator = new PasswordValidator(t);

    const accountModeMap = {
        valid: t('accountFormatMatched'), // '此為後續登入的帳號'
        invalid: {
            className: 'invalid',
            text: t('accountNotMatchFormat'), // '帳號格式不符'
        },
    };

    const accountValid = useSelector(selectAccountValid);

    if (pageMode === 'regist') {
        accountComment = <InputComment modeMap={accountModeMap} mode={accountValid ? 'valid' : 'invalid'} ></InputComment>
    }

    // passwordComment---------------------------------------------------------
    let passwordComment;

    /* 
    const passwordModeMap = {
        [PasswordValidEnum.valid]: {
            text: t('passwordFormatMatched'), // '此為後續登入的密碼',
            // className: 'invalid',
        },
        [PasswordValidEnum.isEmpty]: {
            text: t('passwordEmptyIsInvalid'), // 密碼不能為空
            className: 'invalid',
        },
        [PasswordValidEnum.tooShort]: {
            text: t('passwordAtLeast10char'), // 密碼至少10個字元
            className: 'invalid',
        },
        [PasswordValidEnum.tooLong]: {
            text: t('passwordOver50char'), // 密碼不能超過50個字元
            className: 'invalid',
        },
        [PasswordValidEnum.requiredCharLost]: {
            text: t('passwordRequiredCharLost'), // 密碼必須包含英文大寫、英文小寫、數字
            className: 'invalid',
        },
        // [PasswordValidEnum.invalidChar]: {
        //     text: t('passwordInvalidChar'), // 密碼只能輸入英文或數字
        //     className: 'invalid',
        // },
        [PasswordValidEnum.unknown]: {
            text: 'unknown error', // '此為後續登入的密碼',
            className: 'invalid',
        },
        // valid: t('passwordFormatMatched'), // '此為後續登入的密碼',
        // invalid: {
        //     className: 'invalid',
        //     text: t('passwordNotMatchFormat'), // '密碼格式不符',
        // },
        //       /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/
    }; */
    passwordValidator.registState(PasswordValidEnum.valid, {
        text: t('passwordFormatMatched'), // 此為後續登入的密碼
        textKey: 'passwordFormatMatched',
        // className: 'invalid',
    });
    const passwordModeMap = passwordValidator.getStateModeMap(t);

    const passwordValidMode = useSelector(selectPasswordValidMode);

    if (pageMode === 'regist') {
        passwordComment = <InputComment modeMap={passwordModeMap} mode={passwordValidMode}></InputComment>
    }

    // lang---------------------------------------------------------------------

    const [langDropdownShow, setLangDropdownShow] = useState(false);

    const langItemList = getLangItemList(useTranslation('lang', { keyPrefix: 'lang' }));

    const handleLangIconClick = () => () => {
        setLangDropdownShow(!langDropdownShow);
    }

    const closeLangDropdown = () => () => {
        setLangDropdownShow(false);
    }


    // render---------------------------------------------------------

    if (pageMode === 'regist') {
        enterButton = <RegistButton control={loginControl}></RegistButton>;
        commentText = <PrivacyText></PrivacyText>;
        forgetRow = <ResendVerifyEmailRow control={loginControl}></ResendVerifyEmailRow>;
    } else {
        enterButton = <LoginButton control={loginControl}></LoginButton>;
        commentText = <NoRegistText></NoRegistText>;
        forgetRow = <ForgetRow control={resetPwControl}></ForgetRow>;
    }


    return (
        <ContainerStyled theme={themeObject} elementWidth={loginElementWidth}>
            {/* <div className="container__picture"></div> */}
            <div className="container__board">
                <div className="container__lang" onClick={handleLangIconClick()}>
                    <GlobeSvg className="lang-icon" alt="languageIcon" fill={themeMixin.getTheme('langIcon', '#FFFFFF')} />
                    <LangDropdown show={langDropdownShow} subItemList={langItemList} closeEvent={closeLangDropdown()} />
                </div>
                <div className="container__panel">
                    <div className="panel__billboard">
                        {/* <div className="billboard__login"></div> */}
                        <img className="billboard__login" src="/reas_banner.png" alt="banner"></img>
                    </div>
                    <div className="panel_tab">
                        <PageModeTab theme={themeObject}></PageModeTab>
                    </div>
                    <div className="panel__input">
                        <AccountInput></AccountInput>
                    </div>
                    {accountComment}
                    <div className="panel__input">
                        <PasswordInput control={loginControl}></PasswordInput>
                    </div>
                    {passwordComment}
                    <div className="panel__forgetRow">
                        {/* <ForgetRow></ForgetRow> */}
                        {forgetRow}
                    </div>
                    <div className="panel_buttonRow">
                        {enterButton}
                    </div>
                    <div className="panel__noRegistRow">
                        {commentText}
                    </div>
                    <hr></hr>
                    <div className="panel_buttonRow">
                        <FacebookLoginButton></FacebookLoginButton>
                    </div>
                </div>
            </div>
        </ContainerStyled>


        // <div className={className}>
        //     <div className="login-container__img" />
        //     <div className="element__info">
        //         <div className="element__title" skyblue="false">
        //             Cute Puppy
        //         </div>
        //         <div className="element__description">
        //             Sed ut voluptatem neque cumque. Qui sed ut itaque est doloribus qui.
        //             Eos perferendis autem qui fugiat.
        //         </div>
        //     </div>
        // </div>
    )
}

// props寫法
// color: ${props => (props.red ? 'red' : 'black')};

// CSS結構: 注入定義好class的HTML結構，來生成
// const ContainerStyled = styled(LoginContainer)`
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

  /* 原本左邊的那個放圖區塊 */
  .container__picture {
    display: flex;
    flex-grow: 1; // 延伸
    height: 100%;
    /* background-color: #3e5f23; */
    /* background-color: #b8b8b8; */
    margin: 25px;
  }
  .container__board {
    /* display: flex; */
    display: inline-flex; // 用來讓底下的absolute區塊生效，同時維持flex
    position: absolute;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    /* border-style: solid;
    border-width: 2px;
    border-color: #b8b8b8; */

    height: 94%;

    /* background-color: #506666; */
    background-color: ${getTheme('loginBoard', '#f1f1f1')};
    box-shadow: 8px 10px 3px ${getTheme('loginBoardShadow', '#f1f1f1')};

    /* background-color: #627c7d; */
    /* background-color: #f1f1f1; */
    /* background-color: #4e9b86; // 主色 */

    .container__lang {
        display: flex;
        position: absolute;

        flex-direction: column;
        right: 0px;
        top: 0px;

        cursor: pointer;

        /* background-color: beige; */

        .lang-icon {
            display: flex;
            position: absolute;

            right: 0px;
            top: 0px;

            width: 1.75rem;
            height: 1.75rem;

            margin: 0.5rem;
        }

        .lang-dropdown {
            display: flex;
            position: absolute;

            right: 0px;
            top: 3rem;

            width: 180px;

            overflow-x: hidden;

            background-color: ${getTheme('langItem', '#9b9b9b')};
            color: ${getTheme('langItemText', '#3b3b3b')};

            max-height: 240px;

            .lang-item {
                padding: 0.5rem 1rem;
                display: flex;
                /* justify-content: flex-end; */
            }
        }
    }

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
        .panel_tab {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            /* background-color: #7ea187; */
        }
        .panel__input {
            display: flex;
            justify-content: center;
            width: 100%;
            /* background-color: #69b07b; */
        }
        .panel__inputComment {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            margin-top: 5px;

            .input-comment {
                width: ${props => props.elementWidth || '18rem'};
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                color: ${getTheme('commentText', '#FFFFFF')};
            }
            .input-comment.invalid {
                /* color: red; */
                color: ${getTheme('commentTextValid', '#FFFFFF')};
            }
        }
        .panel__forgetRow {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            /* height: 2.5rem; */
            /* margin: 10px; */
            margin-top: 0.75rem;
            /* background-color: #b86e6e; */

            div {
                margin-top: 0.25rem;
                margin-bottom: 0.25rem;
                width: ${props => props.elementWidth || '18rem'};
                /* background-color: #984141; */

                display: flex;
                flex-direction: row;
                justify-content: flex-end;

                .forgetPw {
                    text-decoration: none; // 刪除底線
                    cursor: pointer;
                    color: ${getTheme('linkText', 'blue')};
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
        .panel__noRegistRow {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            /* padding: 1.4rem; */
            /* background-color: #9bb86e; */
            width: 100%;

            div {
                margin: 0.6rem;
                a {
                    text-decoration: none; // 刪除底線
                    cursor: pointer;
                    color: ${getTheme('linkText', 'blue')};
                }
            }
        }
        hr {
            width: 500px;
            border: 1px solid ${getTheme('hr', 'blue')};
            background-color: ${getTheme('hr', 'blue')};
        }
    }
  }
`


const LoginPageContainer = ({ fetchControl, loginControl, resetPwControl,
    resetPwModel, children }) => {

    if (!(loginControl instanceof LoginFlow)) {
        console.error(`loginControl is not LoginFlow`);
        return;
    }

    if (!(resetPwControl instanceof ResetPasswordFlow)) {
        console.error(`resetPwControl is not ResetPasswordFlow`);
        return;
    }
    if (!(resetPwModel instanceof ResetPasswordModel)) {
        console.error(`resetPwModel is not ResetPasswordModel`);
        return;
    }

    const [resetPasswordEmail, setResetPasswordEmail] = useState(resetPwModel.getState('email'));
    resetPwModel.reactive('email', 'LoginPageContainer', setResetPasswordEmail)

    return (
        <div>
            {/* <LoginModule ></LoginModule> */}
            {/* childRef={ref => (loginModuleRef = ref)} */}
            <NoBindAccountModal setOpenModalRef={loginControl.bindRef('noBindAccountModal')} marginH="50px"></NoBindAccountModal>
            {/* setOpenModalRef={ref => (noBindAccountModalRef = ref)} */}
            <PasswordResetModal marginH="50px" theme={modalThemeObject}
                control={resetPwControl} defaultEmail={resetPasswordEmail}></PasswordResetModal>

            <ResendVerifyEmailModal modalRef={loginControl.bindRef('resendEmailModal')}
                loginControl={loginControl} />
            {/* modalRef={ref => (resendEmailModalRef = ref)} */}
            < LoginContainer loginControl={loginControl} resetPwControl={resetPwControl}></LoginContainer>
        </div >
    );
}

export default function LoginPage({ fetchControl, mode }) {

    const loginControl = new LoginFlow();
    const resetPwModel = new ResetPasswordModel(useRef(null));
    const resetPwControl = new ResetPasswordFlow();
    resetPwControl.registModel('stateModel', resetPwModel);

    const dispatch = useDispatch();

    useEffect(function () {
        dispatch(updatePageMode(mode));
    }, []);

    return (
        <LoginPageContainer fetchControl={fetchControl} loginControl={loginControl}
            resetPwControl={resetPwControl} resetPwModel={resetPwModel}>

        </LoginPageContainer>
    );
}

// // v4註冊全域Component
// const withPageContent = WrappedComponent => {
//     return class extends React.Component {
//         render() {
//             return (
//                 <LoginPage>
//                     <WrappedComponent />
//                 </LoginPage>
//             )
//         }
//     }
// };
// export default withPageContent(AlertModule);

// class MyComponent extends React.Component {
//     render() {
//         return (
//             <div style={{ 'display': 'none' }}>
//                 I'm wrapped in PageContent!
//             </div>
//         )
//     }
// }

// export default withPageContent(MyComponent);
