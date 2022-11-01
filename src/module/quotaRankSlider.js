import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { slider as sliderThemeObject } from 'theme/reas';

import { fetchTheme, fetchMuiTheme } from 'util/ThemeMixin'


/*
const marksInit = [
    {
        value: 10,
        label: '1000',
        comment: '1,000用戶',
    },
    {
        value: 20,
        label: '5,000',
        comment: '5000用戶',
    },
    {
        value: 36,
        label: '10K',
        comment: '10,000用戶',
    },
    {
        value: 44,
        label: '20K',
        comment: '20,000用戶',
    },
    {
        value: 56,
        label: '100K',
        comment: '100,000用戶',
    },
    {
        value: 66,
        label: '500K',
        comment: '500,000用戶',
    },
];
*/

function valuetext(value) {
    return `${value}`;
}



const CrossbotSubscribeSlider = styled(Slider)`

    & .MuiSlider-rail { // 底下的軌道
        color: ${fetchMuiTheme('rail', '#3a8589')};
    }
    & .MuiSlider-track { // 上層的高亮bar條
        color: ${fetchMuiTheme('track', '#3a8589')};
    }
    & .MuiSlider-mark { // 中間的節點
        color: ${fetchMuiTheme('mark', '#3f7173')};
    }
    & .MuiSlider-thumb {
        color: ${fetchMuiTheme('thumb', '#3a8589')};
    }
    & .MuiSlider-thumb:hover {
        box-shadow: 0 0 0 8px rgba(58, 133, 137, 0.16);
    }
    & .MuiSlider-thumb.Mui-focusVisible {
        box-shadow: 0 0 0 8px rgba(58, 133, 137, 0.16);
    }
`

const QuotaRankSlider = ({ width = '85%', disabled, quotaRankList, value, onUpdate }) => {

    const defaultValue = useRef(value || 0); // 若一有value參數，則自動設成defaultValue

    // useEffect(function () {
    //     console.log('update QuotaRankSlider value', value);
    // }, [value]);

    const [slideValue, setSlideValue] = useState(20);

    const onSliderChange = () => e => {
        if (e.target.value !== slideValue) {
            // 代表Slider數值有改變
            setSlideValue(e.target.value);
            // console.log('onSliderChange', e.target.value);

            if (onUpdate) {
                onUpdate(e.target.value);
            }
        }
    }

    let marks;
    if (!quotaRankList) {
        // marks = marksInit; // 測試用
        marks = [];
    } else {
        // 接API時，要補這塊串接
        marks = quotaRankList.map(item => item);
    }

    function valueLabelFormat(value) {
        const markItem = marks.find((mark) => {
            return mark.value === value;
        });
        if (!markItem) {
            return '';
        }
        return markItem.comment;
    }

    return (
        <Box sx={{ width: width }}>
            <CrossbotSubscribeSlider
                aria-label="Restricted values"
                value={value}
                onChange={onSliderChange()}
                defaultValue={defaultValue.current}
                valueLabelFormat={valueLabelFormat}
                getAriaValueText={valuetext}
                step={null}
                valueLabelDisplay="auto"
                marks={marks}
                muitheme={sliderThemeObject}
                disabled={disabled}
            />
        </Box>
    )
}

export default QuotaRankSlider;