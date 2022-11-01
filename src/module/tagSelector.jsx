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

// import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';

// import {
//     selectTagCategoryList, updateTagCategoryList,
//     selectSearchKey, updateSearchKey,
//     selectTagList, updateTagList,
//     selectBindButtonUpdate, updateBindButtonUpdate,
// } from 'store/tagSelector'
import HrLine from 'component/HrLine';
import Button from 'component/Button';

import { inputText as inputTextThemeObject } from 'theme/reas'
import ThemeMixin, { fetchTheme } from 'util/ThemeMixin';
import Pagination from 'component/Pagination';
import DatePicker from "component/DatePicker"

import { ReactComponent as SearchSvg } from 'assets/svg/search.svg'
import { ReactComponent as AngleUpSvg } from 'assets/svg/br-angle-up.svg'
import { ReactComponent as AngleDownSvg } from 'assets/svg/br-angle-down.svg'
import { ReactComponent as CancelIconSvg } from 'assets/svg/rr-cross-circle.svg'


import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import LayerMixin from 'util/LayerMixin';

import { tagSelector as tagSelectorThemeObject } from 'theme/reas';
import TableData from 'util/TableData';

import TagSelectorControl, { SingleTagSelectorControl } from 'control/TagSelector'
import FetchControl from 'control/FetchControl';
import StateModel, { SetterConnection } from 'model/StateModel';
import TagSelectorModel, { TagButtonGearEnum, TagCategoryRadioEnum } from 'fragment/TagSelector';
import PatternStyleMixin from 'util/PatternStyleMixin';

const tagSelectorTheme = new ThemeMixin(tagSelectorThemeObject);


const TagButtonTableStyled = styled.div`
display: flex;
flex-direction: column;

width: 100%;

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

        width: 100%;
    }
`


const TagButton = ({ tagButtonType = 'toggle', label, activeDefault = false, tagItem, onChange, fetchControl, fetchModel, index }) => {

    if (tagButtonType === 'trigger') {
        return (
            <TagButtonTrigger label={label} activeDefault={activeDefault} tagItem={tagItem}
                onChange={onChange} fetchControl={fetchControl} fetchModel={fetchModel} index={index}
            ></TagButtonTrigger>
        );
    }

    if (tagButtonType === 'gear') { // 排檔模式: 一個按鈕可以有多個顏色
        // type: 'socialFriendModal'
        return (
            <TagButtonGear label={label} tagItem={tagItem}
                onChange={onChange} fetchControl={fetchControl} fetchModel={fetchModel} index={index}
            ></TagButtonGear>
        );
    }
    // 'toggle' 模式: 開關型安紐

    return (
        <TagButtonToggle label={label} activeDefault={activeDefault} tagItem={tagItem}
            onChange={onChange} fetchControl={fetchControl} fetchModel={fetchModel} index={index}
        ></TagButtonToggle>
    );
};

const TagButtonGearImportCss = css`
    &.noMark {
        /* background-color: #d4e0dd; */
        background-color: ${tagSelectorTheme.getTheme('buttonNoMark', '#2e2e2e')};
    }
    &.marked {
        /* background-color: #63cfaf; */
        background-color: ${tagSelectorTheme.getTheme('buttonGearMarked', '#2e2e2e')};
    }
    &.selected {
        /* background-color: #6390cf; */
        background-color: ${tagSelectorTheme.getTheme('buttonSelected', '#2e2e2e')};
    }
`

const TagButtonGear = ({ label, tagItem, fetchControl, fetchModel, index }) => {

    /* status:
        'noMark'     (未激活)     未標註
        'marked'     (已激活)     已標註標籤
        'selected'                當下選取的標籤
    */

    const [status, setStatus] = useState(tagItem.active ? TagButtonGearEnum.marked : TagButtonGearEnum.noMark);

    const onTagButtonGearClick = () => status => {
        fetchControl('tagSelector').onSocialFriendButtonClick(tagItem, index, status);
    }

    const setterConnect = new SetterConnection({
        getterKey: 'tagButtonStatus',
        srcKey: `TagButtonGear_${index}`,
        setter: setStatus,
        args: [tagItem, index]
    });
    fetchModel('tagSelector').connectGetter(setterConnect);

    useEffect(function () {
        // 當tagItem改變時，也必須刷新active
        fetchModel('tagSelector').refreshGetter(setterConnect);
    }, [tagItem]);

    // 3種顏色的按鈕
    return (
        <Button type="gear" importStyle={{
            width: '105px',
            wordWrap: 'break-word', // 避免按鈕寬度過長，強制換行
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
        }} pattern="small"
            status={status} setStatus={setStatus} onClick={onTagButtonGearClick()}
            importCss={TagButtonGearImportCss}>{label}</Button>
    );
    // onChange={handleButtonChange()}
}

const TagButtonTrigger = ({ label, activeDefault = false, tagItem, onChange, fetchControl, fetchModel, index }) => {
    //     <TagButtonTrigger label={label} activeDefault={activeDefault} tagItem={tagItem}
    //     onChange={onChange} fetchControl={fetchControl} fetchModel={fetchModel} index={index}
    // ></TagButtonTrigger>


    const handleButtonChange = () => () => {
        if (onChange) {
            onChange(tagItem, index);
        }
    }

    //  type="toggle" active={active} setActive={setActive}

    return (
        <Button type="fill" mode="default" importStyle={{
            width: '105px',
            wordWrap: 'break-word', // 避免按鈕寬度過長，強制換行
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
        }} pattern="small" onClick={handleButtonChange()}
        >
            {label}
        </Button>
    );
}


const TagButtonToggle = ({ label, activeDefault = false, tagItem, onChange, fetchControl, fetchModel, index }) => {

    const [active, setActive] = useState(activeDefault);

    const handleButtonChange = () => active => {
        if (onChange) {
            onChange(tagItem, active);
        }
    }
    const setterConnect = new SetterConnection({
        getterKey: 'tagButtonActive',
        srcKey: `TagButton_${index}`,
        setter: setActive,
        args: [tagItem, index]
    });
    fetchModel('tagSelector').connectGetter(setterConnect);

    useEffect(function () {
        // 當tagItem改變時，也必須刷新active
        fetchModel('tagSelector').refreshGetter(setterConnect);
    }, [tagItem]);


    return (
        <Button type="toggle" importStyle={{
            width: '105px',
            wordWrap: 'break-word', // 避免按鈕寬度過長，強制換行
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
        }} pattern="small" onChange={handleButtonChange()}
            active={active} setActive={setActive}>
            {label}
        </Button>
    );
}

const TagButtonTable = ({ tagButtonType, tableData, page, setPage, totalPage, onPageChange, onButtonChange, fetchControl, fetchModel }) => {
    // const [nowPage, setNowPage] = useState(1);
    // const [totalPage, setTotalPage] = useState(3);

    const pageChangeEvent = () => newPage => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    }

    let TagButtonListDom = [];

    // tableData: <TableData>


    const handleButtonChange = () => (tagItem, active) => {
        // console.log('handleButtonChange', tagItem, active)

        if (onButtonChange) {
            onButtonChange(tagItem, active);
        }
    }

    const dataList = tableData.getTableData();
    // dataList.forEach((tagItem, index) => {
    for (let index = 0; index < dataList.length; index += 1) {
        const tagItem = dataList[index];
        TagButtonListDom.push(
            (<TagButton key={`TagButton_${index}`}
                tagButtonType={tagButtonType}
                label={tagItem.label}
                activeDefault={tagItem.active}
                tagItem={tagItem} onChange={handleButtonChange()}
                fetchControl={fetchControl} fetchModel={fetchModel}
                index={index}
            ></TagButton>)
        );
    }

    return (
        <TagButtonTableStyled>
            <div className="button-table">
                {TagButtonListDom}
            </div>
            <div className="pagination-row">
                <Pagination type="table" page={page} setPage={setPage}
                    onChange={pageChangeEvent()} totalPage={totalPage}
                ></Pagination>
            </div>
        </TagButtonTableStyled>
    );

}


const TagSelectorModalStyled = styled.div`
    width: 700px;

    display: ${props => props.show ? 'flex' : 'none'};
    flex-direction: column;
    min-height: inherit; // 必須要吃到height，flex-grow才會有作用

    & .row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-grow: 0;
    }
    & .row.modal-title-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        /* margin: 1rem 1.5rem; */
        margin: 1rem 1.5rem 0.5rem 1.5rem;

        height: 2.3rem;

        & .modal-title-block {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            height: 100%;

            & .modal-title {
                /* margin: 0;
                padding: 0; */
                display: flex;
                flex-direction: row;
                /* justify-content: center; */
                /* align-items: center; */

                /* height: 100%; */
                /* margin-top: 0.5rem; */
            }

            & .bottom-line {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;

                margin-top: 0.5rem;
            }
        }
        & .tag-category-search-block {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            margin-right: 1.5rem;

            position: relative;

            & .search-icon-block {
                position: absolute;
                top: 0.4rem;
                right: 0.5rem;
                
                cursor: pointer;

                & .search-icon {
                    width: 1.5rem;
                    height: 1.5rem;
                }
            }
        }
    }
    & .row.date-period-row {
        justify-content: space-around;
        /* justify-content: space-between; */
    }
    & .row.tag-category-block {
        flex-wrap: wrap;
        margin: 0rem 2rem;
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

    & .row.confirm-button-row {
        display: flex;
        flex-direction: row;
        flex-grow: 1;

        justify-content: flex-end;
        align-items: flex-end;
    }


`

const TagCategoryRadio = ({ tagCategoryItem, index, fetchControl, fetchModel }) => {

    const [status, setStatus] = useState(false);

    const setterConnect = new SetterConnection({
        getterKey: 'tagCategoryRadioStatus',
        srcKey: `TagCategoryRadio_${index}`,
        setter: setStatus,
        args: [tagCategoryItem, index]
    });

    fetchModel('tagSelector').connectGetter(setterConnect);

    useEffect(function () {
        // 初始化active
        fetchModel('tagSelector').refreshGetter(setterConnect);
    }, []);

    let labelColor;
    if (status === TagCategoryRadioEnum.noMark) {
        labelColor = tagSelectorTheme.getTheme('radioButton', '#2e2e2e');
    } else if (status === TagCategoryRadioEnum.marked) {
        labelColor = tagSelectorTheme.getTheme('radioActive', '#2e2e2e');
    } else if (status === TagCategoryRadioEnum.selected) {
        labelColor = tagSelectorTheme.getTheme('radioSelected', '#2e2e2e');
    }

    return (<FormControlLabel
        value={tagCategoryItem.value} label={tagCategoryItem.label}
        sx={{
            width: '120px',
            userSelect: 'none',
            // color: '#3fc08c',
            // color: '#759186',
            color: labelColor,
        }}
        control={<Radio sx={{
            // color: '#759186',
            // '&.Mui-checked': {
            //     color: '#3fc08c',
            // },
            color: tagSelectorTheme.getTheme('radioButton', '#2e2e2e'),
            '&.Mui-checked': {
                color: tagSelectorTheme.getTheme('radioActive', '#2e2e2e'),
            },
        }} />}
    />)
}

const TagCategorySelector = ({ tagCategoryList = [], onChange, searchKey, fetchControl, fetchModel }) => {
    const [value, setValue] = useState(null);
    // 雙向綁定 tagCategory 欄位
    const actValue = fetchModel('tagSelector').reactive('tagCategory', 'TagCategorySelector', setValue);

    const pageSize = 15;

    const handleCategoryChange = () => (event) => {
        // console.log('handleCategoryChange', event.target.value)
        // setValue(event.target.value);
        actValue(event.target.value);

        if (onChange) {
            onChange(event.target.value);
        }
    };

    const totalPage = Math.ceil(tagCategoryList.length / pageSize);

    const [page, setPage] = useState(1);
    // fetchModel('tagSelector').defaultValue('categoryPage') ==> 1
    const [tagCategoryRadioList, setTagCategoryRadioList] = useState([]);

    const tagCategoryRadioButtonList = [];

    tagCategoryRadioList.forEach((tagCategoryItem, index) => {
        tagCategoryRadioButtonList.push(
            (<TagCategoryRadio key={`tagCategory_${index}`} tagCategoryItem={tagCategoryItem} index={index}
                fetchControl={fetchControl} fetchModel={fetchModel} />)
        );
    });

    const [paginationShow, setPaginationShow] = useState(false);

    const [angleUpActive, setAngleUpActive] = useState(false);
    const [angleDownActive, setAngleDownActive] = useState(false);

    const onClickCategoryPageChange = type => () => {
        if (type === 'prev') {
            if (!angleUpActive) {
                // 代表按鈕鎖定中，不反應
                return;
            }
            // page >= 0 才可以執行
            if ((page - 1) >= 1) {
                setPage(page - 1);
            }
        } else if (type === 'next') {
            if (!angleDownActive) {
                // 代表按鈕鎖定中，不反應
                return;
            }
            if ((page + 1) <= totalPage) {
                setPage(page + 1);
            }
        }
    }

    useEffect(function () {
        if (!searchKey) {
            // console.log('initRadioList')
            initRadioList();
            return;
        }

        // 搜尋模式下，鎖定翻頁功能
        setAngleUpActive(false);
        setAngleDownActive(false);

        let newList = tagCategoryList.filter((tagCategoryItem) => {
            return tagCategoryItem.label.search(searchKey) >= 0;
        });

        if (newList.length > pageSize) {
            newList = newList.slice(0, pageSize);
        }
        // setTagCategorySearchList(newList);
        setTagCategoryRadioList(newList);
    }, [searchKey]);

    useEffect(function () {
        setAngleUpActive(page <= 1 ? false : true);
        setAngleDownActive(page >= totalPage ? false : true);

        setTagCategoryRadioList(tagCategoryList.slice((page - 1) * pageSize, page * pageSize));
    }, [page]);

    useEffect(function () {
        // 當標籤類別列表切換之後，觸發列表label顏色刷新
        fetchModel('tagSelector').refreshGetter('tagCategoryRadioStatus');
    }, [tagCategoryRadioList]);

    const initRadioList = function () {
        // 初始化
        if (totalPage > 1) {
            // 超過1頁，顯示pagination，並切到第一頁
            setPage(1);
            setTagCategoryRadioList(tagCategoryList.slice(0, pageSize));

            setPaginationShow(true);
            setAngleUpActive(false);
            setAngleDownActive(true);
        } else {
            setTagCategoryRadioList(tagCategoryList.slice(0, pageSize));
            setPaginationShow(false);
        }
    };

    useEffect(initRadioList, [tagCategoryList])

    return (
        <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleCategoryChange()}
            sx={{
                'flexDirection': 'row',
                'alignItems': 'flex-start',
                // 'justifyContent': 'flex-start',
                'position': 'relative',
                'width': '100%',
                'height': '138px',
            }}
        >
            {tagCategoryRadioButtonList}
            {/* <FormControlLabel value="female" label="Female"
                control={<Radio sx={{
                    color: '#759186',
                    '&.Mui-checked': {
                        color: '#3fc08c',
                    },
                }} />}
            />
            <FormControlLabel value="male" label="Male"
                control={<Radio sx={{
                    color: '#759186',
                    '&.Mui-checked': {
                        color: '#3fc08c',
                    },
                }} />}
            /> */}
            <RadioGroupPaginationBlock style={{
                display: paginationShow ? 'flex' : 'none',
            }}>
                <AngleUpSvg key="arrow-up" className="icon up-icon-block" alt="arrowUpIcon"
                    fill={angleUpActive ? tagSelectorTheme.getTheme('angleIconActive', '#2e2e2e') : tagSelectorTheme.getTheme('angleIcon', '#2e2e2e')}
                    onClick={onClickCategoryPageChange('prev')}
                ></AngleUpSvg>
                {/* onClickPageChange('prev') */}
                <AngleDownSvg key="arrow-down" className="icon down-icon-block" alt="arrowDownIcon"
                    fill={angleDownActive ? tagSelectorTheme.getTheme('angleIconActive', '#2e2e2e') : tagSelectorTheme.getTheme('angleIcon', '#2e2e2e')}
                    onClick={onClickCategoryPageChange('next')}
                ></AngleDownSvg>
                {/* onClickPageChange('next') */}
            </RadioGroupPaginationBlock>
        </RadioGroup>
    )
}

const RadioGroupPaginationBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    position: absolute;

    right: -1.25rem;
    top: 0;

    height: 100%;

    & .icon {
        width: 1.5rem;
        height: 1.5rem;

        cursor: pointer;

        margin: 0.25rem 0;
    }
    .up-icon-block {

    }
    .down-icon-block {

    }
`
// minWidth: '15rem',
//     minHeight: '1rem',
//  margin: '1rem 0.5rem 1rem 0.5rem',
const PanelShowTagStyled = styled.div`
min-height: 2.3rem;
min-width: 15rem;
max-width: 966px;

/* margin: 1rem 0.5rem 1rem 0.5rem; */
padding: 0 0.5rem;

/* background-color: #d2d2d2; */

background-color: ${fetchTheme('inputBox', '#5e9aaf')};

border-width: 2px;
border-style: solid;
border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
border-radius: ${fetchTheme('inputBoxRaduis', '3px')};

display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
flex-wrap: wrap;

/* margin-top: 5rem; */

/* padding: 0rem 0.5rem; */

box-sizing: border-box;

cursor: pointer;

& .tag {
    background-color: ${fetchTheme('tag', '#cacaca')};
    border-radius: ${fetchTheme('tagRaduis', '3px')};

    padding: 0.25rem 2rem 0.25rem 1rem;
    /* margin: 0.5rem 0.5rem; */
    /* margin: 0.15rem 0.5rem; */
    margin-right: 0.5rem;

    /* border-width: 2px;
    border-style: solid;
    border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
    border-radius: ${fetchTheme('inputBoxRaduis', '3px')}; */

    position: relative;

    .cancel-icon {
        /* display: none; */

        position: absolute;
        width: 1.25rem;
        height: 1.25rem;

        right: 3px;
        top: 5px;
        cursor: pointer;
    }
}
& .tag.tail {
    margin-right: 0;
}
`
const InputTagStyled = styled.div`
width: 100%;
min-height: 4.25rem;

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

/* margin-top: 5rem; */

padding: 0.5rem 0.5rem;

box-sizing: border-box;

    .tag {
        background-color: ${fetchTheme('tag', '#cacaca')};
        border-radius: ${fetchTheme('tagRaduis', '3px')};

        padding: 0.25rem 2rem 0.25rem 1rem;
        margin: 0.5rem 0.5rem;

        /* border-width: 2px;
        border-style: solid;
        border-color: ${fetchTheme('inputBoxBorder', '#cacaca')};
        border-radius: ${fetchTheme('inputBoxRaduis', '3px')}; */

        position: relative;

        .cancel-icon {
            position: absolute;
            width: 1.25rem;
            height: 1.25rem;

            right: 3px;
            top: 5px;
            cursor: pointer;
        }
    }
`

const TagInputView = ({ type = 'panelShow', tagList = [], fetchControl, pattern }) => {
    // type: 'panelShow', 'modalShow'

    let tagListDom = [];
    tagList.forEach((tagItem, index, arr) => {

        // 最後一個元素要加 .tail
        let tagClassName = index === (arr.length - 1) ? `tag tail` : "tag";
        tagListDom.push(
            (
                <div key={`tagItem_${index}`} className={tagClassName}>
                    {tagItem.label}
                    <CancelIconSvg className="cancel-icon" fill={tagSelectorTheme.getTheme('cancelIcon', '#3b4b45')}
                        onClick={fetchControl('tagSelector').bindAct('onTagCancel', tagItem)} />
                </div>
            )
        );
    });

    const tagInputViewPatternStyleMixin = new PatternStyleMixin('TagInputView')
    let patternStyle = tagInputViewPatternStyleMixin.getPatternStyle(pattern);

    if (type === 'panelShow') {
        return (<PanelShowTagStyled theme={inputTextThemeObject}
            onClick={fetchControl('tagSelector').bindAct('onClickPanelShow')}
            style={patternStyle}>
            {tagListDom}
        </PanelShowTagStyled>);
    }

    // type === 'modalShow'

    return (<InputTagStyled style={patternStyle} theme={inputTextThemeObject}>
        {tagListDom}
    </InputTagStyled>);
}

const TagSelectorInner = function ({ tagButtonType, show = true, showMap, fetchControl, fetchModel, onSave }) {

    const [searchInputShow, setSearchInputShow] = useState(false);

    // 單向輸出 標籤類別
    const [tagCategoryList, setTagCategoryList] = useState([]);
    // const actTagCategoryList = fetchModel('tagSelector').reactive('tagCategoryList', 'TagSelector', setTagCategoryList);
    fetchModel('tagSelector').registSetter('tagCategoryList', 'TagSelector', setTagCategoryList);

    // 雙向綁定'tagSelector' Model 中的 tagSelector 欄位
    const [searchKey, setSearchKey] = useState('');
    const actSearchKey = fetchModel('tagSelector').reactive('searchKey', 'TagSelector', setSearchKey)

    // const [searchKey, actSearchKey] = useState('');

    // TagButtonTable----------------------------
    const [tableData, setTableData] = useState(new TableData());
    const [nowPage, setNowPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    // 將view的tableData的setter註冊進去，這樣才能同步刷新
    fetchControl('tagSelector').registTableDataSetter('TagSelectorButtonTable', setTableData);

    // tableData刷新時，同步View裡面的page和totalPage參數
    useEffect(function () {
        setNowPage(tableData.getNowPage());
        setTotalPage(tableData.getTotalPage());
    }, [tableData]);
    // TagInputView----------------------------

    const [tagList, setTagList] = useState([]);
    // 註冊setter，做單向輸出到View
    fetchModel('tagSelector').registSetter('tagList', 'TagSelector', setTagList);

    // 日期區間-------------------------------------------------

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const actStartDate = fetchModel('tagSelector').reactive('startDate', 'TagSelector', setStartDate);
    const actEndDate = fetchModel('tagSelector').reactive('endDate', 'TagSelector', setEndDate);

    useEffect(fetchControl('tagSelector').bindAct('onPeriodChange'), [startDate, endDate]);

    // 燈箱的title
    let modalTitleRowDom;
    if (showMap.modalTitleRow) {
        modalTitleRowDom = (<div className="row modal-title-row">
            <div className="modal-title-block">
                <div className="modal-title">
                    {/* 選擇篩選標籤 */}
                    選擇篩選標籤
                </div>
                <HrLine importClass="bottom-line"
                    style={{
                        width: '300px',
                    }} importTheme={{
                        hrWidth: '100%',
                        hrBorderWidth: '2px',
                    }}
                ></HrLine>
            </div>
            <div className="tag-category-search-block">
                {/* 標籤類別搜尋 */}
                <InputText style={{
                    display: searchInputShow ? 'inline-block' : 'none',
                }} placeholder="標籤類別搜尋" value={searchKey} onUpdate={actSearchKey}></InputText>
                <div className="search-icon-block" onClick={() => setSearchInputShow(!searchInputShow)}>
                    <SearchSvg className="search-icon" fill={tagSelectorTheme.getTheme('searchIcon', '#2e2e2e')} />
                </div>
            </div>
        </div>)
    }

    // 日期區間
    let periodRowDom;
    if (showMap.periodRow) {
        periodRowDom = (
            <div className="row date-period-row">
                {/* 開始日期 */}
                <DatePicker placeholder="開始日期" onUpdate={actStartDate}></DatePicker>
                {/* 結束日期 */}
                <DatePicker placeholder="結束日期" onUpdate={actEndDate}></DatePicker>
            </div>)
    }

    // 搜尋列search
    let searchRowDom;
    if (showMap.searchRow) {
        searchRowDom = (<div className="row modal-title-row">
            <div className="modal-title-block">

            </div>
            <div className="tag-category-search-block">
                <InputText style={{
                    display: searchInputShow ? 'inline-block' : 'none',
                }} placeholder="標籤類別搜尋" value={searchKey} onUpdate={actSearchKey}></InputText>
                <div className="search-icon-block" onClick={() => setSearchInputShow(!searchInputShow)}>
                    <SearchSvg className="search-icon" fill={tagSelectorTheme.getTheme('searchIcon', '#2e2e2e')} />
                </div>
            </div>
        </div>)
    }

    let tagSelectedRowDom;
    let tagSelectedRowHrDom;
    if (showMap.tagSelectedRow) {
        tagSelectedRowDom = (
            <div className="row selected-tag-row">
                <TagInputView type="modalShow" tagList={tagList} fetchControl={fetchControl}></TagInputView>
            </div>
        )

        tagSelectedRowHrDom = (<div className="row hr-row">
            <HrLine></HrLine>
        </div>)
    }

    // 最底下的【確認】按鈕
    let modalConfirmRowDom;
    if (showMap.confirmRow) {
        modalConfirmRowDom = (
            <div className="row confirm-button-row">
                <Button type="fill" importStyle={{
                    marginRight: '1.5rem',
                    marginBottom: '1.5rem',
                }} onClick={fetchControl('tagSelector').bindAct('onClickConfirm')}>確認</Button>
            </div>
        )
    }

    const onClickSave = () => () => {
        if (onSave) {
            onSave(fetchModel('tagSelector').getState('selectedTagList'));
        }
    }

    // 【儲存】按鈕列
    let saveButtonRowDom;
    if (showMap.saveRow) {
        saveButtonRowDom = (
            <div className="row confirm-button-row">
                <Button type="fill" importStyle={{
                    marginRight: '1.5rem',
                    marginBottom: '1.5rem',
                }} onClick={onClickSave()}>儲存</Button>
                {/* onClick={fetchControl('tagSelector').bindAct('onClickSaveSelectedTagList')} */}
            </div>
        )
    }

    return (
        <TagSelectorModalStyled show={show}>
            {modalTitleRowDom}
            {searchRowDom}
            {periodRowDom}
            <div className="row tag-category-block">
                <TagCategorySelector tagCategoryList={tagCategoryList}
                    onChange={fetchControl('tagSelector').bindAct('onTagCategoryChange')}
                    searchKey={searchKey} fetchControl={fetchControl} fetchModel={fetchModel}
                ></TagCategorySelector>
            </div>
            <div className="row hr-row">
                <HrLine></HrLine>
            </div>
            {tagSelectedRowDom}
            {tagSelectedRowHrDom}
            <div className="row tag-button-table-row">
                <TagButtonTable tagButtonType={tagButtonType} tableData={tableData}
                    page={nowPage} setPage={setNowPage}
                    totalPage={totalPage} onPageChange={fetchControl('tagSelector').bindAct('onTablePageChange')}
                    onButtonChange={fetchControl('tagSelector').bindAct('onTableButtonChange')}
                    fetchControl={fetchControl} fetchModel={fetchModel}
                ></TagButtonTable>
            </div>
            {modalConfirmRowDom}
            {saveButtonRowDom}
        </TagSelectorModalStyled>
    )
}


const QueryTagModalContainer = function ({ pattern, children, fetchControl, fetchModel }) {

    // const tagList = useSelector(selectTagList);
    const [tagList, setTagList] = useState([]);
    fetchModel('tagSelector').registSetter('tagList', 'TagSelectorContainer', setTagList);

    const onModalClose = () => () => {
        // console.log('onModalClose')
    }
    // const TagSelectorContainerPatternStyleMixin = new PatternStyleMixin('TagSelectorContainer')
    // let patternStyle = TagSelectorContainerPatternStyleMixin.getPatternStyle(pattern);
    // style={patternStyle}

    return (
        <div className="tag-selector-container" >
            <TagInputView type="panelShow" pattern={pattern}
                tagList={tagList} fetchControl={fetchControl}></TagInputView>
            <Modal childRef={fetchControl('tagSelector').bindAct('onBindChildModalRef')}
                modalWidth={700} modalHeight={660} onModalClose={onModalClose()}
                layer={LayerMixin.tagSelector}
            >
                {children}
            </Modal>
        </div>
    );
}

export default function TagSelector({ show, type = 'queryTagModal', pattern, onChange,
    fetchControl, onSave, selectMode = 'multi' }) {
    const fc = new FetchControl(fetchControl);

    // 註冊Control: 生成一個TagSelectorControl來註冊進去
    // (會自動綁一個fetchModel在tagSelector底層的Control上)
    let tagSelectorControl;
    if (selectMode === 'multi') {
        // 多選模式: 預設
        tagSelectorControl = new TagSelectorControl(type, useRef(null), useRef(null));
    } else if (selectMode === 'single') {
        // 單選模式: 切換單選模式的控制模組
        tagSelectorControl = new SingleTagSelectorControl(type, useRef(null), useRef(null));
    }

    fc.setup('tagSelector', tagSelectorControl);

    // 註冊Model
    const tagSelectorModel = new TagSelectorModel(useRef(null));
    // 在fetchControl註冊Model
    fc.setupModel('tagSelector', tagSelectorModel);


    // 綁定View相關參數--------------------------------------------------------------

    // 將model內的tagList欄位與view的tagList綁定連動
    const [tagList, setTagList] = useState([]);
    useEffect(function () {
        if (onChange) {
            onChange(tagList);
        }
    }, [tagList]);
    tagSelectorModel.registSetter('tagList', 'TagSelectorExport', setTagList);


    // render----------------------------------------------------

    if (type === 'formItemSlot') {
        return (
            <QueryTagModalContainer pattern={pattern} fetchControl={fc.export()} fetchModel={fc.export('fetchModel')}>
                <TagSelectorInner type={type} pattern={pattern}
                    tagButtonType="trigger"
                    showMap={{
                        modalTitleRow: true,
                        // tagSelectedRow: true,
                        // confirmRow: true,
                    }} fetchControl={fc.export()}
                    fetchModel={fc.export('fetchModel')} onSave={onSave} />
            </QueryTagModalContainer>
        );
    }

    if (type === 'queryTagModal') {
        return (
            <QueryTagModalContainer pattern={pattern} fetchControl={fc.export()} fetchModel={fc.export('fetchModel')}>
                <TagSelectorInner type={type} pattern={pattern}
                    tagButtonType="toggle"
                    showMap={{
                        modalTitleRow: true,
                        tagSelectedRow: true,
                        confirmRow: true,
                    }} fetchControl={fc.export()}
                    fetchModel={fc.export('fetchModel')} onSave={onSave} />
            </QueryTagModalContainer>
        );
    }

    if (type === 'socialFriendModal') {

        return (
            <TagSelectorInner show={show} type={type} pattern={pattern}
                tagButtonType="gear"
                showMap={{
                    periodRow: true, // 時間區間篩選
                    searchRow: true, // 搜尋列
                    modalTitleRow: false,
                    tagSelectedRow: false,
                    confirmRow: false,
                    saveRow: true,
                }} fetchControl={fc.export()}
                fetchModel={fc.export('fetchModel')}
                onSave={onSave} />
        );
    }

    return (
        <div>TagSelectorExport</div>
    );
}
