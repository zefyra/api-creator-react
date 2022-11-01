import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import styled from 'styled-components';

const BlankBlock = ({ className }) => {
    return (
        <div className={className}>

        </div>
    )
};

const BlankBlockStyled = styled(BlankBlock)`
display: flex;
flex-direction: column;

width: 600px;
height: 450px;

/* margin: 15px; */

margin-left: 30px;
margin-top: 30px;
/* background-color: #b1b1b1; */
background-color: transparent;

/* padding: 10px; */

    .block-row {
        display: flex;
        flex-direction: row;
    }
`

export default BlankBlockStyled;