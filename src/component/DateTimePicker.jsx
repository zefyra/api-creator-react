/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { datePicker as datePickerThemeObject } from 'theme/reas'

import LayerMixin from 'util/LayerMixin'

import ThemeMixin, { fetchImportStyle, fetchTheme } from 'util/ThemeMixin';
import InputText from './InputText'

import { ReactComponent as AngleLeftSvg } from 'assets/svg/br-angle-left.svg'
import { ReactComponent as AngleRightSvg } from 'assets/svg/br-angle-right.svg'
import { useState } from 'react'
import { useEffect } from 'react'
import Ref from 'model/Ref'

const datePickerTheme = new ThemeMixin(datePickerThemeObject);

const gridWidth = '2.5rem';

const DefaultDatePickerStyled = styled.div`
position: relative;
    & .date-picker-container {
        display: none;

        position: absolute;

        /* left: -100px; // 測試用 */

        z-index: ${() => LayerMixin.datePicker};
        
        background-color: ${fetchTheme('datePicker', '#c7c7c7')};
        color: ${fetchTheme('datePickerText', '#c7c7c7')};

        border-radius: ${fetchTheme('datePickerRadius', '#c7c7c7')};

        box-shadow: 3px 3px 7px ${fetchTheme('datePickerShadow', '#111e1a')};

        /* width: 320px; // 280 */
        /* height: 309px; // 308 */
        min-width: 300px;
        min-height: 309px;

        overflow: auto;

        & .panel {
            padding: 1rem 0.55rem;

            & .header-row {
                margin: 0.25rem 0.45rem;
            }
        }

        & .date-picker-panel {
            display: none;

            width: 300px;

            & .title-row {
                display: flex;
                justify-content: space-between;

                & .title-block {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    cursor: pointer;
                    user-select: none;

                    & .title-block {
                        padding: 0 3px;
                    }

                    & .icon-block {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;

                        width: 30px;
                        height: 30px;
                        
                        border-radius: 50px;

                        & .arrow-icon {
                            display: flex;

                            width: 13px;
                            height: 13px;

                            margin: 0 3px;

                            z-index: 26;
                        }
                    }
                    & .icon-block:hover {
                        background-color: #94c2b5;
                        box-shadow: 0 0 6px #94c2b5;
                    }
                }
            }

            & .week-title-row {
                display: flex;
                justify-content: space-around;

                & .week-title-item {
                    display: flex;

                    justify-content: center;
                    align-items: center;

                    width: ${gridWidth};
                    height: 2.5rem;

                    cursor: default;
                    user-select: none;
                }
            }
            & .date-block {
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                flex-grow: 1; // 下方多餘的空間都給它

                & .week-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;

                    & .date-grid {
                        display: flex;
                        /* flex-shrink: 0; */

                        justify-content: center;
                        align-items: center;

                        width: ${gridWidth};
                        height: 2.5rem;

                        user-select: none;
                        cursor: pointer;
                    }
                    & .date-grid.blank {
                        cursor: default;
                    }
                    & .date-grid.blank:hover {
                        background-color: transparent; // 空白的沒有hover
                        box-shadow: none;
                    }
                    & .date-grid:hover {
                        background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                        border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                        box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
                    }
                    & .date-grid.active {
                        background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                        border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                        box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
                    }
                }
            }
        }
        & .date-picker-panel.show {
            display: block;
        }

        & .time-picker-panel {
            /* display: none; */
            display: flex;
            flex-direction: column;

            justify-content: center;

            width: 300px;

            padding-left: 5px;
            padding-right: 20px;

            & .time-input-block {
                display: flex;
                flex-direction: row;

                justify-content: space-around;
                align-items: center;

                & .colon-block {
                    font-size: 35px;
                    color: #e1e1e1;
                    font-weight: bold;

                    transform: translateY(-5px);

                    padding: 0 5px;
                }
            }
        }
        & .time-picker-panel.show {
            display: flex;
        }

        & .month-picker-panel {
            display: none;

            /* height: 300px; */
            width: 300px;

            & .year-title-row {
                display: flex;
                justify-content: space-between;

                & .icon-block {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                    width: 1.8rem;
                    height: 1.8rem;

                    cursor: pointer;

                    & .arrow-icon {
                        width: 1rem;
                        height: 1rem;
                    }
                }

                & .year-title {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    cursor: pointer;
                }
            }

            & .month-block {
                display: flex;
                flex-direction: column;

                justify-content: space-around;

                flex-grow: 1;

                & .month-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    
                    width: 100%;

                    & .month-item {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        cursor: pointer;
                        user-select: none;

                        width: 5rem;
                        height: 1.8rem;
                        padding-bottom: 0.15rem;
                    }
                    & .month-item.active {
                        background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                        border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                        box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
                    }
                    & .month-item:hover {
                        background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                        border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                        box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
                    }
                }
            }
        }
        & .month-picker-panel.show {
            display: flex;
            flex-direction: column;
        }

        & .year-picker-panel {
            display: none;
            width: 300px;

            padding: 0 15px;

            & .page-jump-block {
                display: flex;

                align-items: center;

                /* position: relative; */
                
                & .icon-block {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;

                    width: 30px;
                    height: 30px;
                    
                    border-radius: 50px;

                    cursor: pointer;
                    user-select: none;

                    & .arrow-icon {
                        display: flex;

                        width: 13px;
                        height: 13px;

                        margin: 0 3px;

                        z-index: 26;
                    }
                }
                & .icon-block:hover {
                    background-color: #94c2b5;
                    box-shadow: 0 0 6px #94c2b5;
                }
            }

            & .year-list-block {
                display: flex;
                flex-direction: column;

                flex-grow: 1;

                & .year-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;

                    margin: 14px 0;

                    cursor: pointer;
                    & .year-item {
                        display: flex;

                        padding: 5px 15px;
                    }
                    & .year-item:hover {
                        background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                        border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                        box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
                    }
                }
            }

            
        }
        .year-picker-panel.show {
            display: flex;
            flex-direction: row;
        }
    }
    & .date-picker-container.show {
        display: flex;
        flex-direction: row;
    }
`


const DateWeekPanel = ({ nowYear, nowMonth, nowDate, nowValue, onDatePick }) => {
    // 之後要串參數

    const d = new Date();
    d.setFullYear(nowYear);
    d.setMonth(nowMonth);
    d.setDate(nowDate);

    let activeDateNum = -99;

    if (nowValue) {
        // 有nowValue才處理日期高亮
        const valueYear = nowValue.getFullYear();
        const valueMonth = nowValue.getMonth();

        if (valueYear === nowYear && valueMonth === nowMonth) {
            activeDateNum = nowDate;
        }
    }


    // 取得該月起始日
    let startDate = d;
    startDate.setDate(1);

    // 起始日星期幾
    let startDay = startDate.getDay(); // 7/1(五)=>5

    // 取得該月最後一天
    const lastDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // data: 0 代表前一個月最後一天

    // 該月總天數
    const dayAmount = lastDate.getDate(); // 7月=>31

    let monthGrid = [];
    let weekRow = [];

    let dayNum = 0; // 0: 星期天 ===> 6: 星期六
    let weekNum = 0; // 週數

    const getGridClassName = (dateNum) => {
        // console.log(`getGridClassName nowDate`, nowDate)
        return `date-grid ${dateNum <= 0 ? 'blank' : ''} ${activeDateNum === dateNum ? 'active' : ''}`;
    }

    const onDateGridClick = dateNum => () => {
        if (onDatePick) {
            onDatePick(dateNum);
        }
    }

    // 跑該月...空白startDay天 + N天
    for (let dateNum = 1 - startDay; dateNum <= dayAmount; dateNum += 1) {
        if (dayNum === 0) {
            // 代表是星期天，又是新一周的開始，生出新的一列
            weekRow = [];
        }
        weekRow.push(<div className={getGridClassName(dateNum)} key={dateNum}
            onClick={onDateGridClick(dateNum)}>{dateNum > 0 ? dateNum : ''}</div>);
        // className="date-grid blank active" (全貌)
        // onClick={this.onDateGridClick.bind(this, dateNum)}

        if (dayNum === 6) {
            // 代表已是星期六，要將該列塞入
            monthGrid.push(
                (
                    <div className="week-row" key={`w${weekNum}`}>
                        {weekRow}
                    </div>
                )
            );
            weekNum += 1;
        } else if (dateNum === dayAmount) {
            // 代表已是該月最後一天，直接塞入該周

            if (weekRow.length < 7) {

                const remainBlankNum = 7 - weekRow.length;

                // 代表該周還沒湊滿7格，直接塞到滿
                for (let i = 1; i <= remainBlankNum; i += 1) {
                    // console.log(`remain i: ${i} dateNum:${dateNum + i}`);
                    weekRow.push(
                        <div className="date-grid blank" key={dateNum + i}></div>
                    );
                }
            }

            monthGrid.push(
                (
                    <div className="week-row" key={`w${weekNum}`}>
                        {weekRow}
                    </div>
                )
            );
            weekNum += 1;
        }

        dayNum += 1;
        dayNum %= 7;
    }

    return (<div className="date-block">{monthGrid}</div>);
}

const DatePickerPanel = ({ show, nowYear, nowMonth, nowDate, headerRowSlot, nowValue, onDatePick }) => {

    return (
        <div className={`panel date-picker-panel ${show ? 'show' : ''}`}>
            {headerRowSlot}
            {/* <div className="header-row title-row">
                <div className="title-block">
                    <div className="icon-block">
                        <AngleLeftSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                    </div>
                    <div className="title-block">
                        October
                    </div>
                    <div className="icon-block">
                        <AngleRightSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                    </div>
                </div>
                <div className="title-block">
                    <div className="icon-block">
                        <AngleLeftSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                    </div>
                    <div className="title-block">
                        2022
                    </div>
                    <div className="icon-block">
                        <AngleRightSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                    </div>
                </div>
            </div> */}
            <div className="week-title-row">
                <div className="week-title-item">
                    S
                </div>
                <div className="week-title-item">
                    M
                </div>
                <div className="week-title-item">
                    T
                </div>
                <div className="week-title-item">
                    W
                </div>
                <div className="week-title-item">
                    T
                </div>
                <div className="week-title-item">
                    F
                </div>
                <div className="week-title-item">
                    S
                </div>
            </div>
            {/* {this.genWeek()} */}
            <DateWeekPanel nowYear={nowYear} nowMonth={nowMonth} nowDate={nowDate}
                nowValue={nowValue} onDatePick={onDatePick} />
        </div>
    )
}

const MonthPickerPanel = ({ show, nowMonth = -1, onMonthChange }) => {

    const getMonthStr = function (month, shortMode) {
        const fullMonthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const shortMonthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let monthList = shortMode ? shortMonthList : fullMonthList;

        return monthList[month];
    }

    const onMonthClick = (month) => () => {
        if (onMonthChange) {
            onMonthChange(month);
        }
    }


    const getMonthItemClass = function (monthNum) {
        return `month-item ${nowMonth === monthNum ? 'active' : ''}`
    }

    return (
        <div className={`panel month-picker-panel ${show ? 'show' : ''}`} >
            {/* <div className="header-row year-title-row">
                <div className="icon-block" >
                    <AngleLeftSvg className="arrow-icon"></AngleLeftSvg>
                </div>
                <div className="year-title">
                    2022
                </div>
                <div className="icon-block" >
                    <AngleRightSvg className="arrow-icon"></AngleRightSvg>
                </div>
            </div> */}
            <div className="month-block">
                <div className='month-row'>
                    <div className={getMonthItemClass(0)} onClick={onMonthClick(0)}>{getMonthStr(0, true)}</div>
                    <div className={getMonthItemClass(1)} onClick={onMonthClick(1)}>{getMonthStr(1, true)}</div>
                    <div className={getMonthItemClass(2)} onClick={onMonthClick(2)}>{getMonthStr(2, true)}</div>
                </div>
                <div className='month-row'>
                    <div className={getMonthItemClass(3)} onClick={onMonthClick(3)}>{getMonthStr(3, true)}</div>
                    <div className={getMonthItemClass(4)} onClick={onMonthClick(4)}>{getMonthStr(4, true)}</div>
                    <div className={getMonthItemClass(5)} onClick={onMonthClick(5)}>{getMonthStr(5, true)}</div>
                </div>
                <div className='month-row'>
                    <div className={getMonthItemClass(6)} onClick={onMonthClick(6)}>{getMonthStr(6, true)}</div>
                    <div className={getMonthItemClass(7)} onClick={onMonthClick(7)}>{getMonthStr(7, true)}</div>
                    <div className={getMonthItemClass(8)} onClick={onMonthClick(8)}>{getMonthStr(8, true)}</div>
                </div>
                <div className='month-row'>
                    <div className={getMonthItemClass(9)} onClick={onMonthClick(9)}>{getMonthStr(9, true)}</div>
                    <div className={getMonthItemClass(10)} onClick={onMonthClick(10)}>{getMonthStr(10, true)}</div>
                    <div className={getMonthItemClass(11)} onClick={onMonthClick(11)}>{getMonthStr(11, true)}</div>
                </div>
            </div>
        </div>
    )
}

const YearPickerPanel = ({ show, baseYear = 2022, onYearChange }) => {

    const [startYear, setStartYear] = useState(baseYear - 9);

    const yearRowListDom = [];

    const getYear = function (year, rowIndex, colIndex) {
        return year + (rowIndex * 3) + colIndex;
    }

    const onYearItemClick = year => () => {
        if (onYearChange) {
            onYearChange(year)
        }
    }

    const onYearPageChagne = (offset) => () => {
        setStartYear(startYear + (offset * 18));
    }

    for (let i = 0; i < 6; i += 1) {

        const yearA = getYear(startYear, i, 0);
        const yearB = getYear(startYear, i, 1);
        const yearC = getYear(startYear, i, 2);

        yearRowListDom.push(
            (
                <div className="year-row" key={`yearRow_${i}`}>
                    <div className="year-item" onClick={onYearItemClick(yearA)}>
                        {yearA}
                    </div>
                    <div className="year-item" onClick={onYearItemClick(yearB)}>
                        {yearB}
                    </div>
                    <div className="year-item" onClick={onYearItemClick(yearC)}>
                        {yearC}
                    </div>
                </div>
            )
        )
    }


    return (
        <div className={`year-picker-panel ${show ? 'show' : ''}`}>
            <div className="page-jump-block">
                <div className="icon-block" onClick={onYearPageChagne(-1)}>
                    <AngleLeftSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                </div>
            </div>
            <div className="year-list-block">
                {yearRowListDom}
                {/* <div className="year-row" >
                    <div className="year-item">
                        2019
                    </div>
                    <div className="year-item">
                        2019
                    </div>
                    <div className="year-item">
                        2019
                    </div>
                </div> */}
            </div>
            <div className="page-jump-block">
                <div className="icon-block" onClick={onYearPageChagne(1)}>
                    <AngleRightSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                </div>
            </div>
        </div>
    )
}


const InputStyled = styled.input`
    height: 60px;
    width: 100px;
    
    background-color: ${fetchTheme('inputBox', '#5e9aaf')};
    color: ${fetchTheme('inputBoxText', '#5d5d5d')};

    outline: none; // 關閉亮起的外框
    /* outline: #e1e1e15b solid 3px; */
    box-shadow: 0 0 10px 5px #e6f5f0c1;
    
    border-radius: 3px;
    border: none;

    font-size: 35px;
    color: #e1e1e1;
    /* text-align: right;
    padding-right: 30px; */
    text-align: center;

    box-sizing: border-box; // 會自動讓padding寬度是往內計算，不會導致padding和border使寬度莫名其妙變長

    /* user-select: none; */

    &.focus {
        outline: none; // 關閉亮起的外框
    }

    &::placeholder {
        color: ${fetchTheme('inputBoxPlaceholder', '#5d5d5d')};
    }
    &:disabled {
        background-color: ${fetchTheme('inputBoxDisabled', '#d4c1c1')};
        cursor: not-allowed;
    }
    &::selection {
        background: #4d786c; //背景修改為綠色
        color: #e1e1e1; //文字修改為白色
    }
`;

const InputTimeNumber = ({ max, value, onChange }) => {

    const maxNum = max ? Number(max) : 100;
    const minNum = 0;

    // console.log('value', value)
    let defaultValue = value !== undefined ? `${value}` : '0';

    // console.log('defaultValue', defaultValue)
    const [inputNum, setInputNum] = useState(defaultValue);

    const actInputNum = val => {
        setInputNum(val);
        if (onChange) {
            onChange(val);
        }
    }

    const onTimeNumberChange = () => e => {
        // console.log('e', e);
        const str = e.target.value;
        // console.log('str', str);

        if (str === '') {
            actInputNum('0');
            return;
        }
        if (!/^\d+$/.test(str)) {
            return; // 代表不是數字
        }
        const val = Number(str);
        if (isNaN(val)) {
            return; // 數字解析失敗
        }
        if (val > maxNum) {
            return; // 超出最大值
        }
        if (val < minNum) {
            return; // 低於最小值
        }
        actInputNum(val);
    }

    return (<InputStyled theme={datePickerThemeObject}
        value={inputNum} onChange={onTimeNumberChange()}
    ></InputStyled>);
}

const TimePickerPanel = ({ hour, minute, onHourChange, onMinuteChange }) => {
    // hour: 3
    // minute: 15

    const handleChangeHour = () => val => {
        if (onHourChange) {
            onHourChange(val);
        }
    }
    const handleChangeMinute = () => val => {
        if (onMinuteChange) {
            onMinuteChange(val);
        }
    }
    return (
        <div className="time-picker-panel">
            <div className="time-input-block">
                <InputTimeNumber max="23" value={hour} onChange={handleChangeHour()}></InputTimeNumber>
                <div className="colon-block">：</div>
                <InputTimeNumber max="59" value={minute} onChange={handleChangeMinute()}></InputTimeNumber>
            </div>
        </div>
    )
}

const HeaderRowPanel = ({ onChangePanel, year, month, onChangeMonth, onChangeYear }) => {

    const handleChangePanel = mode => () => {
        if (onChangePanel) {
            onChangePanel(mode);
        }
    }

    const getMonthStr = month => {
        const fullMonthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // const shortMonthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // let monthList = shortMode ? shortMonthList : fullMonthList;

        return fullMonthList[month];
    }

    const onClickMonthChange = (offset) => () => {
        const newMonth = month + offset;
        // if (newMonth < 0) {
        //     return;
        // }
        // if (newMonth > 11) {
        //     return;
        // }

        if (onChangeMonth) {
            onChangeMonth(newMonth);
        }
    }

    const onClickYearChange = (offset) => () => {
        const newYear = year + offset;
        if (newYear <= 1970) { // 已低於Date數值低限
            return;
        }

        if (onChangeYear) {
            onChangeYear(newYear);
        }
    }

    return (
        <div className="header-row title-row">
            <div className="title-block">
                <div className="icon-block" onClick={onClickMonthChange(-1)}>
                    <AngleLeftSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                </div>
                <div className="title-block" onClick={handleChangePanel('month')}>
                    {/* October */}
                    {getMonthStr(month)}
                </div>
                <div className="icon-block" onClick={onClickMonthChange(1)}>
                    <AngleRightSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                </div>
            </div>
            <div className="title-block">
                <div className="icon-block" onClick={onClickYearChange(-1)}>
                    <AngleLeftSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                </div>
                <div className="title-block" onClick={handleChangePanel('year')}>
                    {year}
                </div>
                <div className="icon-block" onClick={onClickYearChange(1)}>
                    <AngleRightSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                </div>
            </div>
        </div>
    )
}

const DefaultDateTimePicker = ({ value, onChange, srcKey = "DefaultDateTimePicker_temp" }) => {
    // console.log('DefaultDateTimePicker value', value);

    let refValueType;
    if (value instanceof Ref) {
        refValueType = typeof value.getValue();
    }

    const convertDateValue = function (value) {

        let refVal;
        if (!value) {
            return new Date();
        } else if (value instanceof Date) {
            return value;
        } else if (value instanceof Ref) {
            refVal = value.getValue();
        } else {
            console.error(`DefaultDateTimePicker: value not support`);
            return new Date();
        }

        if (typeof refVal === 'string') { // 支援文字格式的ref

            if (!refVal) {
                return new Date();
            }
            // 解析字串
            const dateVal = new Date(refVal);
            const testDate = dateVal.getDate();
            if (isNaN(testDate)) {
                console.error(`DefaultDateTimePicker: refVal parse fail`);
                return new Date();
            }
            return dateVal;
        } else {
            console.error(`DefaultDateTimePicker: Ref value format error`);
            return new Date();
        }
    }

    const [panelShow, setPanelShow] = useState(false);

    const [nowValue, setNowValue] = useState(convertDateValue(value));
    // let actNowValue = setNowValue;
    // if (value instanceof Ref) {
    //     actNowValue = value.reactive(srcKey, setNowValue);
    // }

    const [year, setYear] = useState(nowValue.getFullYear());
    const [month, setMonth] = useState(nowValue.getMonth());
    const [date, setDate] = useState(nowValue.getDate());

    const [hour, setHour] = useState(nowValue.getHours());
    const [minute, setMinute] = useState(nowValue.getMinutes());

    const [datePickerMode, setDatePickerMode] = useState('date'); // 'month', 'year'

    const [dateShow, setDateShow] = useState(false);
    const [monthShow, setMonthShow] = useState(false);
    const [yearShow, setYearShow] = useState(false);
    useEffect(function () {
        if (datePickerMode === 'date') {
            setDateShow(true);
            setMonthShow(false);
            setYearShow(false);
        } else if (datePickerMode === 'month') {
            setDateShow(false);
            setMonthShow(true);
            setYearShow(false);
        } else if (datePickerMode === 'year') {
            setDateShow(false);
            setMonthShow(false);
            setYearShow(true);
        }
    }, [datePickerMode]);

    const onChangePanel = mode => {
        setDatePickerMode(mode);
    }

    const onHeaderMonthChange = () => newMonth => {
        if (newMonth > 11) {
            newMonth = 0;
            setYear(year + 1);
        } else if (newMonth < 0) {
            newMonth = 11;
            setYear(year - 1);
        }
        setMonth(newMonth);
    }

    const headerRowSlot = (
        <HeaderRowPanel year={year} month={month} onChangePanel={onChangePanel}
            onChangeYear={setYear} onChangeMonth={onHeaderMonthChange()}></HeaderRowPanel>
    )

    const onMonthChange = month => {
        // console.log('onMonthChange', month);
        setMonth(month);
        setDatePickerMode('date');
    }

    const onYearChange = year => {
        // console.log('onYearChange', year);
        setYear(year);
        setDatePickerMode('date');
    }

    const onHourChange = val => {
        setHour(val);
    }
    const onMinuteChange = val => {
        setMinute(val);
    }

    let outputValue;
    if (value instanceof Ref) {
        outputValue = value.reactive(srcKey);
    }
    const onDatePick = () => dateNum => {

        // console.log('onDatePick dateNum', dateNum);

        const d = new Date();
        d.setFullYear(year);
        d.setMonth(month);
        d.setDate(dateNum);
        d.setHours(hour);
        d.setMinutes(minute);
        d.setSeconds(0);

        // 改變內部的nowValue
        setNowValue(d);

        // console.log('onDatePick', d.toLocaleString());
        if (onChange) { // 丟出事件
            onChange(d);
        }

        if (value instanceof Ref) { // 代表是Ref格式
            // 輸出參數到ref
            if (refValueType === 'string') {
                // 代表逆向設定回去，要轉成string格式
                outputValue(d.toISOString());
            } else {
                outputValue(d);
            }
        }

        // 關閉Panel
        setPanelShow(false);
    }
    // let showDateStr = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;

    const onInputClick = () => () => {
        setPanelShow(!panelShow);
    }

    const convertShowDateStr = function (d) {
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
    const [inputBoxValue, setInputBoxValue] = useState(convertShowDateStr(nowValue));
    useEffect(function () {
        console.log('sensor aaaa', convertShowDateStr(nowValue));
        setInputBoxValue(convertShowDateStr(nowValue));
    }, [nowValue]);

    return (
        <DefaultDatePickerStyled theme={datePickerThemeObject}>
            {/* placeholder="開始日期" */}
            <InputText value={inputBoxValue}
                importClass="date-picker-box" onClick={onInputClick()} />
            <div className={`date-picker-container ${panelShow ? 'show' : ''}`} style={{
                left: '-180px', // 暫用
            }}>
                <DatePickerPanel show={dateShow} nowYear={year} nowMonth={month} nowDate={date}
                    nowValue={nowValue} headerRowSlot={headerRowSlot} onDatePick={onDatePick()}></DatePickerPanel>
                <MonthPickerPanel show={monthShow} nowMonth={month} onMonthChange={onMonthChange}></MonthPickerPanel>
                <YearPickerPanel show={yearShow} baseYear={year} onYearChange={onYearChange}></YearPickerPanel>
                <TimePickerPanel hour={hour} minute={minute} onHourChange={onHourChange}
                    onMinuteChange={onMinuteChange} ></TimePickerPanel>
            </div>
        </DefaultDatePickerStyled>
    )
}

export default function DateTimePicker({ value, onChange, srcKey }) {
    // importStyle, placeholder, onUpdate, pattern, value

    return (<DefaultDateTimePicker value={value} onChange={onChange}
        srcKey={srcKey}></DefaultDateTimePicker>)

    // return (<DefaultDateTimePicker importStyle={importStyle}
    //     placeholder={placeholder} onUpdate={onUpdate} pattern={pattern}
    //     value={value}></DefaultDateTimePicker>)
}