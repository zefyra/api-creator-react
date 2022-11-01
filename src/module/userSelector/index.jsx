/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from 'component/Button';
import InputTag from 'component/InputTag';
import InputText from 'component/InputText';
import Modal from 'component/Modal';
import TableModal from 'component/TableModal';
import FetchControl from 'control/FetchControl';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserSelectModalTableFlow, UserSelectorControl } from './userSelectorControl';
import { UserSelectorModel } from './userSelectorModel';

const SearchPanelRowStyled = styled.div`
display: flex;
justify-content: space-between;
padding-left: 30px;

padding-right: 30px;

align-items: center;
`


const ConfirmRowStyled = styled.div`
display: flex;
justify-content: flex-end;

padding-right: 30px;

/* width: 100%; */
`

const UserSelectModal = ({ model, control, userTableControl }) => {
    const { t } = useTranslation('social', { keyPrefix: 'userSelectTable' });

    const headerSlot = (
        <SearchPanelRowStyled>
            {/* 用戶名搜索 */}
            <InputText value={model.fetchRef('searchName', 'UserSelectModal')}
                placeholder={t('userNameSearch')}></InputText>
            <Button type="fill" onClick={userTableControl.bindAct('onQuery')}>
                {t('query')}
            </Button>
        </SearchPanelRowStyled>
    )
    const footerSlot = (
        <ConfirmRowStyled>
            <Button type="fill" onClick={userTableControl.bindAct('onConfirm')}>
                {t('confirm')}
            </Button>
        </ConfirmRowStyled>
    )

    const setModelRef = function (ref) {
        model.setState('userSelectModal', ref);
    }

    return (
        <TableModal modalRef={setModelRef}
            control={userTableControl}
            loading={model.fetchRef('userTableLoading', 'UserSelectModal')}
            srcKey="UpperCategoryTableModal"
            headerSlot={headerSlot}
            footerSlot={footerSlot}></TableModal>
    )
}

const UserSelectorInner = ({ control, model, userTableControl }) => {

    const [tagList, setTagList] = useState(model.getState('tagList'));
    const actTagList = model.reactive('tagList', 'UserSelectorInner', setTagList);

    const handleTagListChanged = () => tagList => {
        console.log(`handleTagListChanged tagList`, tagList);
    }

    return (
        <div>
            <InputTag type="formItem" tagList={tagList} onChange={handleTagListChanged()}
                onClick={control.bindAct('onOpenUserSelectModal')} onCancelTag={control.bindAct('onCancelTag')}
                importStyle={{
                    maxWidth: '420px',
                }}></InputTag>
            <UserSelectModal control={control} model={model} userTableControl={userTableControl}></UserSelectModal>
        </div>
    )
};

export function UserSelector({ type, selectMode, onChange }) {
    // type: 'formItemSlot'

    const { t } = useTranslation('social', { keyPrefix: 'userSelectTable' });

    let model = new UserSelectorModel(useRef(null), { t });

    let control;
    if (selectMode === 'multi') {
        // 多選模式: 預設
        control = new UserSelectorControl();
        control.regist('stateModel', model);
        // } else if (selectMode === 'single') {
        // 單選模式: 切換單選模式的控制模組
    } else {
        console.error(`UserSelector: selectMode not support`);
    }

    const [tagList, setTagList] = useState(model.getState('tagList'));
    model.reactive('tagList', 'UserSelector', setTagList);
    useEffect(function () {
        if (onChange) {
            onChange(tagList.map((tag) => {
                return tag.row;
            }));
        }
    }, [tagList]);


    const userTableControl = new UserSelectModalTableFlow(useRef(null), model.getState('tableHeader'));
    userTableControl.regist('stateModel', model);
    // userTableControl.registRef('onChange', onChange);

    // console.log('UserSelector redner')

    if (type === 'formItemSlot') {
        return (
            <UserSelectorInner control={control} model={model}
                userTableControl={userTableControl}>
            </UserSelectorInner>
        )
    }

    console.error(`UserSelector: type not support`);
    return (
        <div></div>
    )
}