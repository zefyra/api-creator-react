/** @jsxImportSource @emotion/react */
// 偷偷告訴 babel 從 @emotion/react 來引入 runtime jsx
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useState, useRef, useEffect } from "react";
import InputText from "component/InputText";
import Modal from "component/Modal"

import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';

import {
    selectTagCategoryList, updateTagCategoryList,
    updateTagCategoryChecked,
    selectAllTagCategoryChecked, updateAllTagCategoryChecked,
    selectTagCategoryCheckedMap,
    selectSearchTagKey, updateSearchTagKey,
} from 'store/multiSelectorSample'
import HrLine from 'component/HrLine';
import Button from 'component/Button';

import { inputText as inputTextThemeObject } from 'theme/reas'
import { fetchTheme } from 'util/ThemeMixin';
import Pagination from 'component/Pagination';

const TagCategory = ({ label, value }) => {
    const [checked, setChecked] = useState(false);

    const dispatch = useDispatch();

    const onTagCategoryChanged = () => e => {
        // console.log(`onTagCategoryChanged ${e.target.name}:`, e.target.checked)
        if (setChecked) {
            setChecked(e.target.checked)
        }
        dispatch(updateTagCategoryChecked(value, e.target.checked));
    }

    const tagCategoryCheckedMap = useSelector(selectTagCategoryCheckedMap);

    useEffect(function () {
        // console.log('tagCategoryCheckedMap', tagCategoryCheckedMap)
        setChecked(tagCategoryCheckedMap[value] === true);
    }, [tagCategoryCheckedMap]);

    return (
        <FormControlLabel
            value={value}
            control={<Checkbox
                checked={checked} onChange={onTagCategoryChanged()} name={value}
                inputProps={{ 'aria-label': label }}
                // defaultChecked
                sx={{
                    color: '#759186',
                    '&.Mui-checked': {
                        color: '#3fc08c',
                    },
                }}
            />}
            label={label}
            labelPlacement="end"
        />
    );
}

const TagButtonTableStyled = styled.div`
display: flex;
flex-direction: column;
    & .button-table {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        padding: 0 1rem;
    }
    & .pagination-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
`

const TagButton = ({ label }) => {

    const onChange = () => () => {

    }
    return (
        <Button type="toggle" importStyle={{
            width: '105px',
            wordWrap: 'break-word',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
        }} pattern="small" onChange={onChange('line')}>
            {label}
        </Button>
    );
}

const TagButtonTable = () => {
    const [nowPage, setNowPage] = useState(1);
    const [totalPage, setTotalPage] = useState(3);

    const pageChangeEvent = () => () => {
        console.log('pageChangeEvent')
    }

    return (
        <TagButtonTableStyled>
            <div className="button-table">
                <TagButton label={'這是測試用的超長標籤'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                {/* <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton>
                <TagButton label={'AAAAAAAAAAAAAAAa'}></TagButton> */}
            </div>
            <div className="pagination-row">
                <Pagination type="table" page={nowPage} setPage={setNowPage}
                    onChange={pageChangeEvent()} totalPage={totalPage}
                    setTotalPage={setTotalPage}
                ></Pagination>
            </div>
        </TagButtonTableStyled>
    );

}

const InputTagStyled = styled.div`
width: 100%;
min-height: 2rem;

/* background-color: #d2d2d2; */

background-color: ${fetchTheme('inputBox', '#5e9aaf')};

border-width: 2px;
border-style: solid;
border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
border-radius: ${fetchTheme('inputBoxRaduis', '3px')};

display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: flex-start;
flex-wrap: wrap;

padding: 0.5rem 0.5rem;

    .tag {
        background-color: ${fetchTheme('tag', '#cacaca')};
        border-radius: ${fetchTheme('tagRaduis', '3px')};

        padding: 0.25rem 1rem;
        margin: 0.5rem 0.5rem;

        /* border-width: 2px;
        border-style: solid;
        border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
        border-radius: ${fetchTheme('inputBoxRaduis', '3px')}; */
    }
`

const TagSelectorModalStyled = css`
    width: 700px;
    min-height: 660px;

    & .modal-title-row {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 1rem 1.5rem;

        & .modal-title {
            /* margin: 0;
            padding: 0; */
        }
        & hr {

        }
    }

    & .row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    & .row.filt-panel-title-row {
        margin: 0.5rem 1.5rem;
    }
    & .row.tag-category-all-row {
        margin: 0rem 1.5rem;
    }
    & .row.tag-category-block {
        flex-wrap: wrap;
        margin: 0rem 2rem;
    }
    & .row.tag-search-row {
        & .search-title {
            margin: 1rem 1.5rem;
        }
        & .tag-search-input-block {
            margin: 1rem 1.5rem;
        }
    }
    & .row.selected-tag-row {
        margin: 1rem 1.5rem;
    }
    & .row.hr-row {

    }

    & .row.tag-category-title-row {
        margin: 0.5rem 1.5rem 0rem 1.5rem;
    }
    & .row.tag-category-title-row.top-title {
        margin-top: 1rem;
    }
    & .row.tag-button-table-row {
        /* margin: 1rem 1.5rem;  */
    }


`


const TagSelector = function ({ pattern }) {
    // setModalRef = () => { }
    const dispatch = useDispatch();

    const [modalRef, setModalRef] = useState(null);

    const onClickInput = () => () => {
        console.log('onClickInput')
        if (modalRef) {
            modalRef.openModal();
        }
    }

    const onModalClose = () => () => {
        console.log('onModalClose')
    }

    let tagCategoryList = useSelector(selectTagCategoryList);

    console.log('tagCategoryList', tagCategoryList)

    let tagCategoryDom = [];
    tagCategoryList.forEach((tagCategoryItem, index) => {
        tagCategoryDom.push(
            (<TagCategory key={`tagCategory_${index}`} label={tagCategoryItem.label} value={tagCategoryItem.value}
            ></TagCategory>)
        );
    });

    useEffect(function () {
        dispatch(updateTagCategoryList([{
            label: '用戶屬性',
            value: 'user',
        }, {
            label: '商品服務屬性',
            value: 'productService',
        }, {
            label: '交易屬性',
            value: 'trade',
        }, {
            label: '用戶行為',
            value: 'userAction',
        }, {
            label: '販促活動',
            value: 'bigSale',
        }, {
            label: '父親節特賣',
            value: 'papadays',
        }, {
            label: '端午節活動',
            value: 'duanwu',
        }]));
    }, []);

    const allTagCategoryChecked = useSelector(selectAllTagCategoryChecked);

    const onTagAllChanged = () => e => {
        console.log('onTagAllChanged', e.target.checked)

        dispatch(updateAllTagCategoryChecked(e.target.checked));
    }

    const searchTagKey = useSelector(selectSearchTagKey);
    const actSearchTagKey = val => dispatch(updateSearchTagKey(val));

    return (
        <div>
            <InputText placeholder="全選多選框範例" pattern={pattern}
                value="" onUpdate={() => { }} onClick={onClickInput()} />
            <Modal childRef={ref => (setModalRef(ref))}
                modalWidth={700} modalHeight={660} onModalClose={onModalClose()}
            >
                <div css={TagSelectorModalStyled}>
                    <div className="modal-title-row">
                        <div className="modal-title">
                            選擇篩選標籤
                        </div>
                        {/* style={{
                            marginTop: '1rem',
                        }}  */}

                        {/* importTheme={{
                            hrWidth: '45%',
                            hrBorderWidth: '2px',
                        }} */}
                        <HrLine style={{
                            width: '300px',
                            marginTop: '1rem'
                        }} importTheme={{
                            hrWidth: '100%',
                            hrBorderWidth: '2px',
                        }}></HrLine>
                    </div>
                    {/* <div className="row filt-panel-title-row">
                        篩選
                    </div> */}
                    <div className="row tag-category-all-row">
                        <FormControlLabel
                            value={'all'}
                            control={<Checkbox
                                checked={allTagCategoryChecked >= 0}
                                indeterminate={allTagCategoryChecked === 0}
                                onChange={onTagAllChanged()} name={'all'}
                                inputProps={{ 'aria-label': 'all' }}
                                // defaultChecked
                                sx={{
                                    color: '#759186',
                                    '&.Mui-checked': {
                                        color: '#3fc08c',
                                    },
                                }}
                            />}
                            label="全部"
                            labelPlacement="end"
                        />
                    </div>
                    <div className="row tag-category-block">
                        {tagCategoryDom}
                        {/* <TagCategory label="什錦燴飯" value={`tenkin`}></TagCategory>
                        <TagCategory label="蝦仁炒飯" value={`shanin`} ></TagCategory> */}
                    </div>
                    <div className="row tag-search-row">
                        <div className="search-title">
                            標籤搜尋
                        </div>
                        <div className="tag-search-input-block">
                            <InputText value={searchTagKey} onUpdate={actSearchTagKey}></InputText>
                        </div>
                        <Button type="fill" mode="primary">搜尋</Button>
                    </div>
                    <div className="row hr-row">
                        <HrLine></HrLine>
                    </div>
                    <div className="row selected-tag-row">
                        {/* <div className="tag-input-block"> */}
                        {/* <InputTag theme={inputTextThemeObject}></InputTag> */}
                        <InputTagStyled theme={inputTextThemeObject}>
                            <div className="tag">
                                AAAA
                            </div>
                            <div className="tag">
                                AAAAAAAAAAAAAAAAa
                            </div>
                            <div className="tag">
                                AAAA
                            </div>
                            <div className="tag">
                                AAAA
                            </div>
                        </InputTagStyled>
                    </div>
                    <div className="row hr-row">
                        {/* importPattern={{
                            marginBottom: '1rem'
                        }} */}
                        <HrLine ></HrLine>
                    </div>
                    <div className="row tag-button-table-row">
                        <TagButtonTable></TagButtonTable>
                    </div>
                    {/* 有分類的版本
                    <div className="row tag-category-title-row top-title">
                        這是標題
                    </div>
                    <div className="row tag-button-table-row">
                        <TagButtonTable></TagButtonTable>
                    </div>
                    <div className="row tag-category-title-row">
                        這是標題
                    </div>
                    <div className="row tag-button-table-row">
                        <TagButtonTable></TagButtonTable>
                    </div> */}
                </div>
            </Modal>
        </div>
    );
}

export default TagSelector;