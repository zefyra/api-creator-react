import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import uniqid from 'uniqid';

import { datePicker as datePickerThemeObject } from 'theme/reas'
import InputText from "component/InputText";

import LayerMixin from 'util/LayerMixin'

// import OuterCaller from 'util/OuterCaller';

import { ReactComponent as AngleLeftSvg } from 'assets/svg/rr-angle-left.svg'
import { ReactComponent as AngleRightSvg } from 'assets/svg/rr-angle-right.svg'
import ThemeMixin, { fetchTheme } from 'util/ThemeMixin';
import WindowCall from 'util/WindowCall';

const datePickerTheme = new ThemeMixin(datePickerThemeObject);

class DefaultDatePicker extends React.Component {
    constructor(props) {
        super(props);
        /* props: {
            importStyle={importStyle}
            placeholder={placeholder}
            qid={uniqid()} 
            onUpdate={onUpdate}
        } */

        this.state = {
            datePickerShow: false,
            datePickerMode: 'date', // 'month', 'year'
            date: new Date(),
            dateShowStr: '', // 用來顯示在InputText上
            // dateShowVal: null, // 用來給外部存取用的數值
        }

        this.nextState = null;
    }

    componentDidMount() {
        // v4 已改用Mask底板
    }

    closeDropdown() {
        if (this.state.datePickerShow) {
            // 代表正在顯示當中
            this.setState({
                datePickerShow: false,
            });
        }
    }

    onClickInputBox() {
        this.setState({
            datePickerShow: !this.state.datePickerShow,
        });
    }

    getMonthStr(month, shortMode) {
        const fullMonthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const shortMonthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let monthList = shortMode ? shortMonthList : fullMonthList;

        return monthList[month];
    }

    getDateShowValue() {
        const d = this.state.date;
        let showDateStr = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
        return showDateStr;
    }

    // componentWillUpdate(object nextProps, object nextState)
    // componentDidUpdate(object prevProps, object prevState)
    componentDidUpdate(prevProps, prevState) {
        // console.log('prevState', prevState);

        // Object.keys(this.nextState).forEach((key)=>{
        //     感測出需要監控的參數
        //     if ( prevState[key] !== this.nextState[key] ){
        //         console.log(`${key} has changed`, this.nextState[key]);
        //     }
        // });

        // console.log(`next date: ${this.state.date}`);
        // console.log(`prev date: ${prevState.date}`);

        // 監控state.date(相當於useEffect): 比對當下的state資料，即可得知數值是否改變
        if (prevState.date.toISOString() !== this.state.date.toISOString()) {
            // console.log(`date has changed`, this.state.date.toISOString())

            this.setState({
                dateShowStr: this.getDateShowValue(), // 修改顯示的字串
                // dateShowVal: new Date(this.state.date),
            });

            if (this.props.onUpdate) {
                // 代表有設定回傳函式，將新的數值回傳
                this.props.onUpdate(new Date(this.state.date));
            }
        }

        // 綁在props.value上的感應器
        if (prevProps.value !== this.props.value) {
            // console.log(`prevProps.value`, prevProps.value);

            // 如果value有變動，就會設進state.date當中，
            // 因此會再觸發dateShowStr(日期顯示字串)的刷新

            let newDate = this.props.value;
            if (typeof newDate === 'string') {
                newDate = new Date(newDate)
            }
            this.setState({
                date: newDate,
            });
        }

        const vm = this;

        // 將當於useEffect偵測datePickerShow
        if (prevState.datePickerShow !== this.state.datePickerShow) {
            // console.log(`this.state.datePickerShow`, this.state.datePickerShow)

            WindowCall.autoCloseOnShowChanged('DatePicker',
                this.state.datePickerShow, '.date-picker-box',
                () => vm.setState({
                    datePickerShow: false,
                })
            );

        }

    }

    // componentWillUpdate(nextProps, nextState) {
    //     // console.log('nextState', nextState);
    //     // 將資料存下來，留給componentDidUpdate比對 ==> 不須留存資料，因為
    //     this.nextState = Object.assign({}, nextState);
    // }

    onDateGridClick(dateNum, e) {
        if (dateNum <= 0) {
            return;
        }

        const d = new Date(this.state.date);
        d.setDate(dateNum);

        this.setState({
            date: d,
        });

        this.closeDropdown();

        return;
    }


    genWeek() {
        const startDate = new Date(this.state.date);
        startDate.setDate(1);

        let startDay = startDate.getDay(); // 7/1(五)=>5

        const lastDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const dayAmount = lastDate.getDate(); // 7月=>31

        let monthGrid = [];
        let weekRow = [];

        let dayNum = 0; // 0: 星期天 ===> 6: 星期六
        let weekNum = 0; // 週數

        // 跑該月...空白startDay天 + N天
        for (let dateNum = 1 - startDay; dateNum <= dayAmount; dateNum += 1) {
            if (dayNum === 0) {
                // 代表是星期天，又是新一周的開始，生出新的一列
                weekRow = [];
            }
            weekRow.push(<div className={`date-grid ${dateNum <= 0 ? 'blank' : ''}`} key={dateNum} onClick={this.onDateGridClick.bind(this, dateNum)}>{dateNum > 0 ? dateNum : ''}</div>);

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

    changeMonth(monthOffset) {
        const d = this.state.date;
        this.setState({
            date: new Date(d.setMonth(d.getMonth() + monthOffset)),
        });
    }
    changeYear(yearOffset) {
        const d = this.state.date;
        this.setState({
            date: new Date(d.setFullYear(d.getFullYear() + yearOffset)),
        });
    }

    onArrowClick(arrowType, mode, e) {

        console.log('arrowType', arrowType);

        if (mode === 'month') {
            if (arrowType === 'left') {
                this.changeMonth(-1);
            } else {
                this.changeMonth(1);
            }
        } else if (mode === 'year') {
            if (arrowType === 'left') {
                this.changeYear(-1);
            } else {
                this.changeYear(1);
            }
        }
    }

    // 避免在操作panel時自動關閉
    onDatePickerPanelClick(e) {
        e.stopPropagation();
    }

    onMonthTitleClick() {
        this.setState({
            datePickerMode: 'month',
        });
    }

    onYearTitleClick() {
        // 失敗: 無法捲動
        // console.log('onYearTitleClick', document.getElementById('nowYear'))
        // document.getElementById('nowYear').scrollIntoView();

        // smooth scroll
        // document.getElementById('id').scrollIntoView({
        //     behavior: 'smooth'
        //   });
        this.setState({
            datePickerMode: 'year',
        });
    }

    onMonthClick(monthNum) {
        // console.log('onMonthClick')
        let d = new Date(this.state.date);
        d.setMonth(monthNum);
        this.setState({
            date: d,
            datePickerMode: 'date', // 切回date面板
        });
    }

    onYearClick(yearNum) {
        // console.log('onYearClick');

        const d = new Date(this.state.date);
        d.setFullYear(yearNum);

        this.setState({
            date: d,
            datePickerMode: 'month', // 切回month面板
        });
    }

    getYearRowList() {

        let yearRowList = [];

        const startYear = new Date().getFullYear() - 10;

        const nowPickYear = this.state.date.getFullYear();

        for (let year = startYear; year < (startYear + 30); year += 1) {

            let yearRowId;
            if (nowPickYear === year) {
                yearRowId = 'nowYear';
            }

            yearRowList.push(
                (
                    <div className="year-row" key={year} id={yearRowId} onClick={this.onYearClick.bind(this, year)}>
                        <div className='year-item'>
                            {year}
                        </div>
                    </div>
                )
            );
        }
        return yearRowList;
    }

    render() {
        return (
            <DefaultDatePickerStyled theme={datePickerThemeObject}>
                <InputText placeholder={this.props.placeholder}
                    importStyle={this.props.importStyle}
                    onClick={this.onClickInputBox.bind(this)}
                    value={this.state.dateShowStr} pattern={this.props.pattern}
                    importClass="date-picker-box" />
                <div className={`date-picker-container ${this.state.datePickerShow ? 'show' : ''}`} onClick={this.onDatePickerPanelClick.bind(this)}>
                    <div className={`panel date-picker-panel ${this.state.datePickerMode === 'date' ? 'show' : ''}`}>
                        <div className="header-row month-title-row">
                            <div className="icon-block" onClick={this.onArrowClick.bind(this, 'left', 'month')}>
                                <AngleLeftSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                            </div>
                            <div className="month-title" onClick={this.onMonthTitleClick.bind(this)}>
                                {this.getMonthStr(this.state.date.getMonth())}&nbsp;{this.state.date.getFullYear()}
                            </div>
                            <div className="icon-block" onClick={this.onArrowClick.bind(this, 'right', 'month')}>
                                <AngleRightSvg className="arrow-icon" fill={datePickerTheme.getTheme('arrowIcon', '#2e2e2e',)} />
                            </div>
                        </div>
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
                        {this.genWeek()}
                    </div>
                    <div className={`panel month-picker-panel ${this.state.datePickerMode === 'month' ? 'show' : ''}`}>
                        <div className="header-row year-title-row">
                            <div className="icon-block" onClick={this.onArrowClick.bind(this, 'left', 'year')}>
                                <AngleLeftSvg className="arrow-icon"></AngleLeftSvg>
                            </div>
                            <div className="year-title" onClick={this.onYearTitleClick.bind(this)}>
                                {this.state.date.getFullYear()}
                            </div>
                            <div className="icon-block" onClick={this.onArrowClick.bind(this, 'right', 'year')}>
                                <AngleRightSvg className="arrow-icon"></AngleRightSvg>
                            </div>
                        </div>
                        <div className="month-block">
                            <div className='month-row'>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 0)}>{this.getMonthStr(0, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 1)}>{this.getMonthStr(1, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 2)}>{this.getMonthStr(2, true)}</div>
                            </div>
                            <div className='month-row'>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 3)}>{this.getMonthStr(3, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 4)}>{this.getMonthStr(4, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 5)}>{this.getMonthStr(5, true)}</div>
                            </div>
                            <div className='month-row'>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 6)}>{this.getMonthStr(6, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 7)}>{this.getMonthStr(7, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 8)}>{this.getMonthStr(8, true)}</div>
                            </div>
                            <div className='month-row'>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 9)}>{this.getMonthStr(9, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 10)}>{this.getMonthStr(10, true)}</div>
                                <div className='month-item' onClick={this.onMonthClick.bind(this, 11)}>{this.getMonthStr(11, true)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`panel year-picker-panel ${this.state.datePickerMode === 'year' ? 'show' : ''}`}>
                        {this.getYearRowList()}
                    </div>
                </div>
            </DefaultDatePickerStyled>
        );
    }

}

const gridWidth = '2.5rem';

const DefaultDatePickerStyled = styled.div`
position: relative;
    .date-picker-container {
        display: none;

        position: absolute;
        z-index: ${() => LayerMixin.datePicker};
        
        background-color: ${fetchTheme('datePicker', '#c7c7c7')};
        color: ${fetchTheme('datePickerText', '#c7c7c7')};

        border-radius: ${fetchTheme('datePickerRadius', '#c7c7c7')};

        box-shadow: 3px 3px 7px ${fetchTheme('datePickerShadow', '#111e1a')};

        width: 320px; // 280
        height: 309px; // 308

        overflow: auto;

        .panel {
            padding: 1rem 0.55rem;
        }

        .header-row {
            margin: 0.25rem 0.45rem;
        }

        .date-picker-panel {
            display: none;

            .month-title-row {
                display: flex;
                justify-content: space-between;

                .icon-block {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                    width: 1.8rem;
                    height: 1.8rem;

                    cursor: pointer;

                    .arrow-icon {
                        width: 1rem;
                        height: 1rem;
                    }
                }

                .month-title {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    cursor: pointer;
                }
            }

            .week-title-row {
                display: flex;
                justify-content: space-around;

                .week-title-item {
                    display: flex;

                    justify-content: center;
                    align-items: center;

                    width: ${gridWidth};
                    height: 2.5rem;

                    cursor: default;
                    user-select: none;
                }
            }
            .date-block {
                display: flex;
                flex-direction: column;
                justify-content: space-around;

                flex-grow: 1; // 下方多餘的空間都給它

                .week-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;

                    .date-grid {
                        display: flex;
                        /* flex-shrink: 0; */

                        justify-content: center;
                        align-items: center;

                        width: ${gridWidth};
                        height: 2.5rem;
                        
                        cursor: pointer;
                    }
                    .date-grid.blank {
                        cursor: default;
                    }
                    .date-grid.blank:hover {
                        background-color: transparent; // 空白的沒有hover
                        box-shadow: none;
                    }
                    .date-grid:hover {
                        background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                        border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                        box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
                    }
                }
            }
        }
        .date-picker-panel.show {
            display: block;
        }

        .month-picker-panel {
            display: none;

            height: 300px;

            .year-title-row {
                display: flex;
                justify-content: space-between;

                .icon-block {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    
                    width: 1.8rem;
                    height: 1.8rem;

                    cursor: pointer;

                    .arrow-icon {
                        width: 1rem;
                        height: 1rem;
                    }
                }

                .year-title {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    cursor: pointer;
                }
            }

            .month-block {
                display: flex;
                flex-direction: column;

                justify-content: space-around;

                flex-grow: 1;

                .month-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                    
                    width: 100%;

                    .month-item {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        cursor: pointer;

                        width: 5rem;
                        height: 1.8rem;
                        padding-bottom: 0.15rem;
                    }
                    .month-item:hover {
                        background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                        border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                        box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
                    }
                }
            }
        }
        .month-picker-panel.show {
            display: flex;
            flex-direction: column;
        }

        .year-picker-panel {
            display: none;

            .year-row {
                display: flex;
                flex-direction: row;
                justify-content: center;

                cursor: pointer;
                .year-item {
                }
            }
            .year-row:hover {
                background-color: ${fetchTheme('dateGridHover', '#b5b3b3')};
                border-radius: ${fetchTheme('dateGridHoverRadius', '3px')};
                box-shadow: 0 0 5px ${fetchTheme('dateGridHoverShadow', '#38b793')};
            }
        }
        .year-picker-panel.show {
            display: flex;
            flex-direction: column;
        }
    }
    .date-picker-container.show {
        display: flex;
        flex-direction: column;
    }
`

export default function DatePicker({ importStyle, placeholder, onUpdate, pattern, value }) {

    return (<DefaultDatePicker importStyle={importStyle}
        placeholder={placeholder} onUpdate={onUpdate} pattern={pattern}
        value={value}></DefaultDatePicker>)
}