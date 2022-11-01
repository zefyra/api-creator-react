/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'


import { useState, useEffect, useRef } from 'react';
// import styled from "styled-components";

import { useTranslation } from "react-i18next";

import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js

import { PageTitle } from "module/layout"
// import Table from "component/Table"
// import TableData from "util/TableData"

import TabContainer from "component/TabContainer"
import { t } from 'i18next';

// import ToggleSwitch from "component/ToggleSwitch"
import Button from 'component/Button';
// import InputText from 'component/InputText';
// import Select from 'component/Select';

import LineBindModal from 'element/PlatformPreference/LineBindModal'
import LineQuestionModal from 'element/PlatformPreference/LineQuestionModal'

import { ReactComponent as InstagramIconSvg } from 'assets/svg/instagram.svg'
import { ReactComponent as FacebookIconSvg } from 'assets/svg/facebook.svg'
import { ReactComponent as LineIconSvg } from 'assets/svg/line.svg'
import { ReactComponent as WechatIconSvg } from 'assets/svg/wechat.svg'

import { ReactComponent as QuestionSquareIconSvg } from 'assets/svg/rr-question-square.svg'
import PlatformPreferenceModel, { ChannelInfo, LineBindModel } from 'fragment/PlatformPreference';
import PlatformPreferenceFlow from 'flow/platformPreference';
import ChannelButtonEnum from 'enum/platformPreference/ChannelButton';
import ChannelTypeEnum from 'enum/ChannelType';

const ChannelContainer = ({ channelType, channelInfo, onClickBind, onClickReauthorize, onClickRemoveBind, onClickQuestion }) => {
    if (!(channelInfo instanceof ChannelInfo)) {
        console.error(`ChannelContainer: channelInfo is not ChannelInfo`)
        return (<div></div>);
    }

    const { t } = useTranslation('pay', { keyPrefix: 'platformPreference' });

    let extraComment;
    if (channelType === 'facebook') {
        extraComment = (
            <div className="channel-footer-comment-row">
                <div className="channel-footer-comment">
                    {t('facebookPolicy')}
                </div>
            </div>
        )
    }

    const buttonList = channelInfo.getButtonList().map((buttonInfo) => {
        // console.log('buttonInfo', buttonInfo)
        if (buttonInfo.type === ChannelButtonEnum.bind) {
            return (<Button key="bind" type="fill" mode="primary"
                onClick={onClickBind}>{buttonInfo.label}</Button>)
        } else if (buttonInfo.type === ChannelButtonEnum.reauthorize) {
            return (<Button key="bind" type="fill" mode="primary"
                onClick={onClickBind}>{buttonInfo.label}</Button>)
        } else if (buttonInfo.type === ChannelButtonEnum.removeBind) {
            return (<Button key="bind" type="fill" mode="primary"
                onClick={onClickBind}>{buttonInfo.label}</Button>)
        }
        console.error(`buttonInfo.type not support`);
        return <div></div>
    });

    let questionIcon;

    if (channelInfo.channelType === 'line') {
        questionIcon = (
            <div className="question-board">
                <QuestionSquareIconSvg className="question-icon" fill="#FFFFFF" onClick={onClickQuestion} />
                {/* onClick={onQuestionClick()} */}
            </div>
        )
    }


    let titleIcon;

    if (channelInfo.channelType === ChannelTypeEnum.instagram) {
        titleIcon = <InstagramIconSvg className="title-icon instagram" fill="#f339d1" />
    } else if (channelInfo.channelType === ChannelTypeEnum.facebook) {
        titleIcon = <FacebookIconSvg className="title-icon facebook" fill="#3968f3" />
    } else if (channelInfo.channelType === ChannelTypeEnum.line) {
        // fill={themeMixin.getTheme('langIcon', '#FFFFFF')}
        titleIcon = <LineIconSvg className="title-icon line" fill="#05cf16" />
    } else if (channelInfo.channelType === ChannelTypeEnum.wechat) {
        titleIcon = <WechatIconSvg className="title-icon wechat" />
    }

    return (
        <ChannelContainerStyled>
            <div className="channel-header-row">
                <div className="channel-header-left">
                    <div className="channel-title">
                        {/* Instagram商業帳號 */}
                        {titleIcon}
                        {channelInfo.getTitle()}
                        {questionIcon}
                    </div>
                    <div className="channel-info">
                        {/* 綁定用戶數 */}
                        <div className="channel-info-row">
                            <div className="channel-info-title">
                                {t('bindUserNum')}
                            </div>
                            <div className="channel-info-content">
                                13789
                            </div>
                        </div>
                        {/* 發送訊息限制 */}
                        <div className="channel-info-row">
                            <div className="channel-info-title">
                                {t('sendMsgLimit')}
                            </div>
                            <div className="channel-info-content">
                                408/4000
                            </div>
                        </div>
                    </div>
                </div>
                <div className="channel-header-right">
                    {/* 綁定Instagram官方帳號 */}
                    {/* <Button type="fill" mode="primary" onClick={onClickBind}>{buttonLabel}</Button> */}
                    {buttonList}
                </div>
            </div>
            {extraComment}
            <div className="channel-footer-comment-row">
                <div className="channel-footer-comment">
                    {/* 綁定的訊息內容 */}
                    {/* 您尚未授權CrossBot取得帳號權限，請完成授權動作 */}
                    {channelInfo.getBindComment()}
                </div>
            </div>
        </ChannelContainerStyled>
    )
}


const ChannelContainerStyled = styled.div`
display: flex;
flex-direction: column;
background-color: #b6d0cc;

margin: 1rem 1rem 1rem 1rem;

width: 90%;

border-radius: 10px;

    .channel-header-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .channel-header-left {
            display: flex;
            flex-direction: row;
            .channel-title {
                width: 200px;

                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                .title-icon {
                    width: 1rem;
                    height: 1rem;
                    transform: translateY(1px);
                    margin: 0.35rem;
                }
                .question-board {
                    /* width: 1.8rem;
                    height: 1.8rem; */
                    /* width: 1.6rem;
                    height: 1.6rem; */
                    width: 1.3rem;
                    height: 1.3rem;
                    margin: 0.35rem;

                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    transform: translateY(2px);

                    background-color: #296a61;
                    /* background-color: #ecd035; */
                    border-radius: 3px;

                    cursor: pointer;

                    

                    .question-icon {
                        width: 1rem;
                        height: 1rem;
                        /* transform: translateY(1px); */
                        /* margin: 0.35rem; */

                        border-radius: 2px;

                        /* box-shadow: 0 0 10px #def0ee ; */

                    }
                }
                .question-board:hover {
                    box-shadow: 0 0 10px #def0ee;
                    /* border: 2px solid #def0ee;
                    box-sizing:border-box; */

                    background-color: #85e1d5;
                }
            }
            .channel-info {
                display: flex;
                flex-direction: column;
                .channel-info-row {
                    display: flex;
                    flex-direction: row;

                    margin: 0.5rem 0 0 0;
                    .channel-info-title {
                        width: 130px;
                    }
                    .channel-info-content {

                    }
                }
            }
        }
        .channel-header-right {
            display: flex;
            flex-direction: row;
            padding-top: 0.5rem;
            padding-right: 0.5rem;

            flex-wrap: wrap;
        }
        
    }
    .channel-footer-comment-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        height: 3.5rem;

        .channel-footer-comment {

        }
    }

`

const ConnectPlatformContainer = ({ platformControl, platformModel }) => {
    const { t } = useTranslation('pay', { keyPrefix: 'platformPreference' });

    const [channelList, setChannelList] = useState(platformModel.getState('channelList'));
    const actChannelList = platformModel.reactive('channelList', 'ConnectPlatformContainer', setChannelList);

    let channelDomList = channelList.map((channelInfo, index) => {
        return (
            (<ChannelContainer key={`channel_${index}`} channelType={channelInfo.channelType}
                channelInfo={channelInfo} onClickBind={platformControl.bindAct('onClickBind', channelInfo)}
                onClickRemoveBind={platformControl.bindAct('onClickRemoveBind', channelInfo)}
                onClickReauthorize={platformControl.bindAct('onClickReauthorize', channelInfo)}
                onClickQuestion={platformControl.bindAct('onClickQuestion', channelInfo)} />)
        );
    })
    return (
        <ConnectPlatformContainerStyled>
            {channelDomList}
        </ConnectPlatformContainerStyled>
    )
}

const ConnectPlatformContainerStyled = styled.div`
display: flex;
flex-direction: column;
align-items: center;

padding-top: 1rem;
padding-bottom: 1rem;
`

export default function PlatformPreference() {
    const translationMenu = useTranslation('menu', { keyPrefix: 'system' });

    const { t } = useTranslation('pay', { keyPrefix: 'platformPreference' });

    const lineBindModel = new LineBindModel(useRef(null), { t });

    const platformModel = new PlatformPreferenceModel(useRef(null), { t });
    const platformControl = new PlatformPreferenceFlow();
    platformControl.registModel('stateModel', platformModel);
    platformControl.registModel('lineBindModel', lineBindModel);

    useEffect(function () {
        platformControl.onChannelListMount();
    }, []);

    const tabItemList = [{
        value: 'connectPlatform',
        label: t('connectPlatform'),/* 連結平台 */
        container: (<ConnectPlatformContainer platformControl={platformControl}
            platformModel={platformModel} />),
        default: true,
        // }, { // 其他功能先不用做
        //     value: 'statusCheck',
        //     label: t('statusCheck'), // 狀態檢測
        //     container: (<div>statusCheck</div>),
        // }, {
        //     value: 'channelTipContent',
        //     label: t('channelTipContent'), // 渠道提示文案
        //     container: (<div>channelTipContent</div>),
    }];

    return (
        <PageTitle title={translationMenu.t('platformPreference')}>
            <TabContainer tabItemList={tabItemList} />
            <LineBindModal modalType="line" setOpenModalRef={platformControl.bindRef('lineModal')}
                onSave={platformControl.bindAct('onLineModalSave')} onCancel={platformControl.bindAct('onLineModalCancel')}
                model={lineBindModel} />

            <LineQuestionModal modalType="lineQuestion" setOpenModalRef={platformControl.bindRef('lineQuestionModal')}
                onSave={platformControl.bindAct('onLineQuestionModalSave')} onCancel={platformControl.bindAct('onLineQuestionModalCancel')} />
        </PageTitle>
    );
}