import Modal from 'component/Modal'
import { useState, useEffect } from 'react';
import styled from 'styled-components'
import InputText from 'component/InputText';
import Button from 'component/Button';
import Select from 'component/Select'
import Table from 'component/Table'
import TableData from 'util/TableData';
import { fetchTheme } from 'util/ThemeMixin'
import TableHeader from 'util/TableHeader';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
    selectRankName, updateRankName,
    selectUserNumLimit, updateUserNumLimit,
    selectFeePerPerson, updateFeePerPerson,
    selectDiscountByMonth, updateDiscountByMonth,
    selectDiscountByYear, updateDiscountByYear,
    selectFeeAfterDiscountByMonth,
    selectFeeAfterDiscountByYear,
    selectAddQuotaRankForm,
} from 'store/quotaRank';

// blurFeePerPerson
// blurDiscountByMonth
// blurDiscountByYear,

const AddQuotaRankModal = ({ fetchControl, setOpenModalRef = () => { }, className, title, onModalClose }) => {

    const { t } = useTranslation('pay', { keyPrefix: 'quotaRankAdd' });

    const dispatch = useDispatch();

    const rankName = useSelector(selectRankName);
    const userNumLimit = useSelector(selectUserNumLimit);
    const feePerPerson = useSelector(selectFeePerPerson);
    const discountByMonth = useSelector(selectDiscountByMonth);
    const discountByYear = useSelector(selectDiscountByYear);
    const feeAfterDiscountByMonth = useSelector(selectFeeAfterDiscountByMonth);
    const feeAfterDiscountByYear = useSelector(selectFeeAfterDiscountByYear);

    const actRankName = val => dispatch(updateRankName(val));
    const actUserNumLimit = val => dispatch(updateUserNumLimit(val));
    const actFeePerPerson = val => dispatch(updateFeePerPerson(val));
    const actDiscountByMonth = val => dispatch(updateDiscountByMonth(val));
    const actDiscountByYear = val => dispatch(updateDiscountByYear(val));
    // const actFeeAfterDiscountByMonth = val => dispatch(updateFeeAfterDiscountByMonth(val));
    // const actFeeAfterDiscountByYear = val => dispatch(updateFeeAfterDiscountByYear(val));

    // const actBlurDiscountByYear = val => dispatch(blurDiscountByYear(val));

    const addQuotaRankForm = useSelector(selectAddQuotaRankForm);
    const addQuotaRank = () => () => {
        fetchControl('addQuotaRank').onQuotaRankSave(addQuotaRankForm);
    }

    return (
        <Modal childRef={ref => (setOpenModalRef(ref))}
            modalWidth={700} modalHeight={550} onModalClose={onModalClose}>
            <div className={className}>
                <div className="manage-user-title">{title}</div>
                <div className="manager-user-container">
                    {/* style={{
                        display: tabStatus === 'profile' ? 'flex' : 'none',
                    }} */}
                    <div className="manage-user-profile">
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('rankName')}{/* 級距名稱 */}
                            </div>
                            <div className="item-content">
                                <InputText value={rankName} onUpdate={actRankName}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('userNumLimit')}{/* 用戶數上限 */}
                            </div>
                            <div className="item-content">
                                <InputText value={userNumLimit} baseValue={0} type="integer" onUpdate={actUserNumLimit}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('feePerPerson')}{/* 用量費/人 */}
                            </div>
                            <div className="item-content">
                                <InputText value={feePerPerson} baseValue={1} type="float" underDot={4} onUpdate={actFeePerPerson}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('discountByMonth')}{/* 折扣(月) */}
                            </div>
                            <div className="item-content">
                                <InputText value={discountByMonth} baseValue={1} type="float" underDot={4} onUpdate={actDiscountByMonth}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {t('discountByYear')}{/* 折扣(年) */}
                            </div>
                            <div className="item-content">
                                <InputText value={discountByYear} baseValue={1} type="float" underDot={4} onUpdate={actDiscountByYear}></InputText>
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {/* 折扣後費用(月) */}
                                {t('feeAfterDiscountByMonth')}
                            </div>
                            <div className="item-content">
                                <InputText value={feeAfterDiscountByMonth} disabled />
                                {/* onUpdate={actFeeAfterDiscountByMonth} */}
                            </div>
                        </div>
                        <div className="profile-item-row">
                            <div className="item-title">
                                {/* 折扣後費用(年) */}
                                {t('feeAfterDiscountByYear')}
                            </div>
                            <div className="item-content">
                                <InputText value={feeAfterDiscountByYear} disabled />
                                {/* onUpdate={actFeeAfterDiscountByYear}> */}
                            </div>
                        </div>
                    </div>
                    <div className="save-button-row">
                        <Button type="fill" onClick={addQuotaRank()}>
                            {t('add')}  {/* 新增 */}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const AddQuotaRankModalInnerStyled = styled(AddQuotaRankModal)`
display: flex;
flex-direction: column;
width: 700px;
height: 550px;

    .manage-user-title {
        display: flex;
        flex-direction: row;
        width: 100%;
        /* margin: 0.5rem 1rem; */

        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        box-sizing: border-box;

        /* background-color: #c2c2c2; */
    }

    .manager-user-container {
        display: flex;
        flex-direction: column;
        
        width: 100%;
        margin: 0.5rem 1rem;

        /* padding: 1rem; */

        .manager-user-tab-row {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .manager-user-tab {
                display: flex;
                justify-content: center;
                align-items: center;

                /* padding: 0.5rem 1rem; */

                width: 100px;
                height: 38px;

                cursor: pointer;
                /* box-sizing: border-box; */
            }
            .manager-user-tab.active {
                border-bottom: 4px solid ${fetchTheme('tabBottom', '#1c7575')};
                /* background-color: red; */
                transform: translateY(2px);
            }
        }

        /* 基本資料 */
        .manage-user-profile {
            display: flex;
            flex-direction: column;

            margin-top: 30px;

            .profile-item-row {
                display: flex;
                flex-direction: row;
                .item-title {
                    width: 180px;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    margin: 0.5rem 0.5rem;
                }
                .item-content {
                    margin: 0.5rem 0.5rem;

                }
            }
        }

        /* 用戶權限 */
        .manage-user-auth {

        }

        /* 模組權限 */
        .manage-module-auth {

        }

        .save-button-row {
            display: flex;
            flex-direction: row;

            justify-content: center;
            align-items: center;
            
        }
        
    }

`



export default AddQuotaRankModalInnerStyled;