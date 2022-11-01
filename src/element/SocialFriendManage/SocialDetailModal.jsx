/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import Modal from 'component/Modal'
import TagSelector from 'module/tagSelector';

import { useState } from 'react';
import UserProfile from './UserProfile';
import BindChannelUid from './BindChannelUid';

import { SocialUserProfileFlow } from 'flow/social'

import {
    selectUserName, updateUserName,
    selectProtraitUrl, updateProtraitUrl
} from "store/social"

import { useDispatch, useSelector } from 'react-redux';
import TabModal from 'vision/TabModal';
import ConsumeBehavior from './ConsumeBehavior';

class SocialDetailTabEnum {
    static userPreference = 'userPreference'
    static bindChannelUid = 'bindChannelUid'
    static consumeBehavior = 'consumeBehavior'
    static userTag = 'userTag'
}


const SocialModalHeader = () => {
    const userName = useSelector(selectUserName);
    const protraitUrl = useSelector(selectProtraitUrl);

    return (
        <SocialModalHeaderStyled>
            <div className="user-portrait">
                <img src={protraitUrl} alt="user_portrait" />
            </div>
            <div className="user-name-block">
                {userName}
            </div>
        </SocialModalHeaderStyled>
    )
}

const SocialModalHeaderStyled = styled.div`
display: flex;
flex-direction: row;

height: 50px;

margin: 0.5rem 0;

    & .user-portrait {
        & img {
            width: 50px;
            height: 50px;
        }
    }
    & .user-name-block {
        height: 100%;
        
        display: flex;
        flex-direction: row;
        align-items: center;

        margin-left: 2rem;
    }
`


export const SocialDetailModal = function ({ fetchControl, className }) {
    // childRef={ref => (setOpenModalRef(ref))}
    // onModalClose={onModalClose}

    // console.log('SocialDetailModal socialDetail', fetchControl('socialDetail'))

    // const userName = useSelector(selectUserName);
    // const protraitUrl = useSelector(selectProtraitUrl);

    // const imgUrl = 'https://icon-library.com/images/gaming-icon/gaming-icon-2.jpg'


    // setup------------------------------------------------------

    const socialUserProfileFlow = new SocialUserProfileFlow();
    fetchControl = fetchControl('regist', 'userProfile', socialUserProfileFlow);


    // event------------------------------------------------------

    const onSaveSelectedTagList = () => selectedTagList => {
        console.log('onSaveSelectedTagList', selectedTagList)

        fetchControl('tip').tip('儲存成功');
    }

    const tabList = [{
        label: '用戶樣貌',
        value: SocialDetailTabEnum.userPreference,
    }, {
        label: '綁定渠道UID',
        value: SocialDetailTabEnum.bindChannelUid,
    }, {
        label: '消費行為',
        value: SocialDetailTabEnum.consumeBehavior,
    }, {
        label: '標籤',
        value: SocialDetailTabEnum.userTag,
    }];

    const initTabType = SocialDetailTabEnum.userPreference;
    const [tabType, setTabType] = useState(initTabType);
    const onTabChange = () => tabType => {
        setTabType(tabType);
    }
    return (
        <TabModal modalRef={fetchControl('socialDetail').bindAct('bindModalRef')}
            tabList={tabList} onTabChange={onTabChange()} headerSlot={<SocialModalHeader />}>
            <UserProfile show={tabType === SocialDetailTabEnum.userPreference} fetchControl={fetchControl}></UserProfile>
            <BindChannelUid show={tabType === SocialDetailTabEnum.bindChannelUid} fetchControl={fetchControl}></BindChannelUid>
            <ConsumeBehavior show={tabType === SocialDetailTabEnum.consumeBehavior} fetchControl={fetchControl}></ConsumeBehavior>
            <TagSelector show={tabType === SocialDetailTabEnum.userTag} type="socialFriendModal" fetchControl={fetchControl} onSave={onSaveSelectedTagList()}></TagSelector>
        </TabModal>
    )
};

const SocialDetailModalStyled = styled(SocialDetailModal)`
    display: flex;
    flex-direction: column;

    min-width: 700px;
    min-height: 660px;

    & .detail-info-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
        margin: 0rem 1.5rem 0 1.5rem;

        height: 66px;

        & .user-block {
            display: flex;
            flex-direction: row;

            height: 50px;

            margin: 0.5rem 0;

            & .user-portrait {
                & img {
                    width: 50px;
                    height: 50px;
                }
            }
            & .user-name-block {
                height: 100%;
                
                display: flex;
                flex-direction: row;
                align-items: center;

                margin-left: 2rem;
            }
        }

        & .tab-block {
            display: flex;
            flex-direction: row;

            margin-right: 0.5rem;

            align-items: flex-end;
        }
    }

    .modal-tab-container-area {
        width: 100%;
        background-color: #cfd9d7;
        /* background-color: #506666; */

        /* flex-grow: 1; */
        border-radius: 0 0 10px 10px;

        /* min-height: 100%; */

        min-height: calc(660px - 66px); // 計算出剩餘的高度
    }

    
`

export default SocialDetailModal;