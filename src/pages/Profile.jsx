/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import { useDispatch } from "react-redux";
// import styled, { useTheme } from "styled-components";

import TipModal from "component/TipModal"

import InputText from "component/InputText"
import Select from "component/Select"
import Button from "component/Button"

import { useTranslation } from "react-i18next";

import { ReactComponent as PictureSvg } from 'assets/svg/picture.svg'

import IndustryFilter from "filter/IndustryFilter"

import { navBar as navBarThemeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'
import { UserProfileFlow } from "flow/users";
import { UserProfileModel } from "fragment/Users";
const getTheme = ThemeMixin.fetchGetTheme();
const navBarTheme = new ThemeMixin(navBarThemeObject);

const FormRow = ({ marginTop, title, children, comment }) => {

    return (
        <FormRowStyled marginTop={marginTop}>
            {/* <div className="profile-form-row"> */}
            <div className="form-title">
                {title}
            </div>
            <div className="form-content">
                {children}
                <div className="comment alert">
                    {comment}
                </div>
                {/* <InputText></InputText> */}
            </div>
        </FormRowStyled>
    );
}

// const CommentRow = ({ marginTop, comment }) => {

//     return (
//         <FormRowStyled marginTop={marginTop}>
//             {/* <div className="profile-form-row"> */}
//             <div className="form-title">
//             </div>
//             <div className="form-content comment alert">
//                 {comment}
//             </div>
//         </FormRowStyled>
//     );
// }

const formTitleWidth = '9rem';

const FormRowStyled = styled.div`
    display: flex;
    flex-direction: row;

    margin-top: ${props => props.marginTop};

    & .form-title {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        /* padding: 0 1rem; */

        min-width: ${() => formTitleWidth};
    }

    & .form-content {
        display: flex;
        flex-direction: column;

        & .comment.alert {
            color: #d71212;
        }

        /* &.comment {
            
        }
        &.comment.alert {
            color: #d71212;
        } */
    }
`

const PortraitIcon = () => {
    return (
        // <PictureSvg className="account-icon" alt="accountIcon" fill="#6e5959" />
        <PortraitIconStyled theme={navBarThemeObject}>
            <PictureSvg className="account-icon" alt="accountIcon" fill={navBarTheme.getTheme('icon', '#FFFFFF')} />
        </PortraitIconStyled>
    )
}

const PortraitIconStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: ${getTheme('iconBackground', '#b17a7a')};
    width: 2.75rem;
    height: 2.75rem;

    border-radius: 200px;

    margin: 0 0.75rem;

    /* cursor: pointer; */

    .account-icon {
        width: 1.15rem;
        height: 1.15rem;
    }
`


const Profile = ({ fetchControl, control, model }) => {
    const profileModel = model;
    const profileFlow = control;

    const { t } = useTranslation('profile');
    control.registRef('profileT', t);

    // 帳號
    const [account, setAccount] = useState('');
    let actAccount = setAccount;
    actAccount = profileModel.reactive('account', 'ProfilePage', actAccount);

    // 用戶密碼
    const [password, setPassword] = useState('');
    let actPassword = profileModel.reactive('password', 'ProfilePage', setPassword);

    // 密碼合法
    const [passwordComment, setPasswordComment] = useState(profileModel.getState('passwordComment'));
    let actPasswordComment = profileModel.reactive('passwordComment', 'ProfilePage', setPasswordComment);

    // 用戶名稱
    const [userName, setUserName] = useState('');
    let actUserName = setUserName;
    actUserName = profileModel.reactive('userName', 'ProfilePage', actUserName);

    // 產業
    const [industry, setIndustry] = useState('');
    let actIndustry = setIndustry;
    actIndustry = profileModel.reactive('industry', 'ProfilePage', actIndustry);

    const [industryOptionList, setIndustryOptionList] = useState([]);
    const [industryOptionListLoading, setIndustryOptionListLoading] = useState(false);
    profileModel.reactive('industryOptionList', 'ProfilePage', setIndustryOptionList);
    profileModel.reactive('industryOptionListLoading', 'ProfilePage', setIndustryOptionListLoading);


    // 聯繫電話
    const [phone, setPhone] = useState('');
    let actPhone = setPhone;
    actPhone = profileModel.reactive('phone', 'ProfilePage', actPhone);

    // 用戶權限
    const [userRole, setUserRole] = useState('');
    let actUserRole = setUserRole;
    actUserRole = profileModel.reactive('role', 'ProfilePage', actUserRole);


    // Event--------------------------------------------------------------

    // mounted:只在頁面載入時，執行的API呼叫
    useEffect(function () {
        profileFlow.onProfilePageMount();
    }, []); // 【後面要掛空陣列】，這樣才不會每次重新渲染都呼叫

    return (
        <ProfileStyled>
            <div className="profile-container">
                <div className="profile-title-row">
                    {/* 帳號管理 */}
                    <div className="profile-title">{t('form.accountManage')}</div>
                </div>
                {/* 帳號 */}
                <FormRow marginTop="1.65rem" title={t('form.account')}>
                    {/* <InputText value={account} onUpdate={actAccount}></InputText> */}
                    {account}
                </FormRow>
                {/* 用戶密碼 */}
                <FormRow marginTop="1.65rem" title={t('form.password')} comment={passwordComment}>
                    <InputText type="password" value={password} onUpdate={actPassword}></InputText>
                </FormRow>
                {/* <CommentRow marginTop="1.65rem" comment={'aaaaaa'}>
                </CommentRow> */}
                {/* 用戶名稱 */}
                <FormRow marginTop="1.65rem" title={t('form.userName')}>
                    <InputText value={userName} onUpdate={actUserName}></InputText>
                </FormRow>
                {/* 產業 */}
                <FormRow marginTop="1.65rem" title={t('form.industry')}>
                    <Select value={industry} optionList={industryOptionList}
                        onUpdate={actIndustry} loading={industryOptionListLoading}></Select>
                </FormRow>
                {/* 聯繫電話 */}
                <FormRow marginTop="1.65rem" title={t('form.phone')}>
                    <InputText value={phone} onUpdate={actPhone}></InputText>
                </FormRow>
                {/* 用戶權限 */}
                <FormRow marginTop="1.65rem" title={t('form.userAuth')}>
                    {t(`role.${userRole}`)}
                </FormRow>
                <hr />
                <div className="form-footer">
                    <div className="form-title">
                        {/* 第三方登入綁定 */}
                        {t('footer.thirdPartyLoginBind')}
                    </div>
                    <div className="form-content">
                        <div className="form-content-row">
                            <Button type="fill" mode="default">
                                {/* 使用Facebook綁定 */}
                                {t('footer.bindFacebook')}
                            </Button>
                            <div className="account-identity-block">
                                <PortraitIcon />
                                <div className="account-user-name">Van Lee</div>
                            </div>
                        </div>
                        <div className="form-content-row">
                            {/* 若要將Facebook粉絲專頁連結至機器人，請先連結Facebook帳號，並選擇欲操作的粉絲專頁，並提供權限。 */}
                            {t('footer.facebookComment')}
                        </div>
                        <div className="form-content-row">
                            <Button type="fill" mode="default">
                                {/* 使用Line綁定 */}
                                {t('footer.bindLine')}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="form-send-row">
                    <Button type="fill" mode="primary" onClick={profileFlow.bindAct('onFormSaved')}>
                        {/* 儲存 */}
                        {t('form.save')}
                    </Button>
                </div>
            </div>
        </ProfileStyled>
    );
}

const ProfileStyled = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 100%;

    .profile-container {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .profile-title-row {
            .profile-title {
                width: 15rem;
                height: 2rem;
                border-bottom: 2px solid #000000;
            }
        }

        .form-footer {
            display: flex;
            flex-direction: row;

            .form-title {
                min-width: ${() => formTitleWidth};
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: flex-start;

                padding-top: 1.25rem;
            }

            .form-content {
                display: flex;
                flex-direction: column;

                .form-content-row {
                    display: flex;
                    flex-direction: row;

                    max-width: 22rem;

                    padding-bottom: 1rem;

                    .account-identity-block {
                        display: flex;
                        flex-direction: row;

                        /* justify-content: center; */
                        align-items: center;

                        .account-user-name {
                            display: flex;
                        }
                    }
                }
            }
        }

        .form-send-row {
            display: flex;
            flex-direction: row;

            justify-content: center;
        }
    }
`

export default function ProfilePage({ fetchControl }) {

    const { t: passwordT } = useTranslation('login', { keyPrefix: 'regist' });
    const profileModel = new UserProfileModel(useRef(null), { passwordT });
    const profileFlow = new UserProfileFlow(profileModel);
    profileFlow.bindFetchControl(fetchControl);
    return (
        <Profile fetchControl={fetchControl} control={profileFlow} model={profileModel} ></Profile>
    )
};