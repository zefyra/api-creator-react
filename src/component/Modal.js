import React from 'react';
import styled from 'styled-components';

import { modal as modalThemeObject } from "theme/reas"
import ThemeMixin from 'util/ThemeMixin'
const getTheme = ThemeMixin.fetchGetTheme();

const { useRef } = React;

class ModalElement extends React.Component {

    constructor(props) {
        super(props);

        // 這個是DOM的ref
        this.domRef = null;
    }

    componentDidMount() {
        // 這個是React的Ref
        const { childRef } = this.props;
        childRef(this); // 使用屬型內的函式，綁定實體
    }

    // componentDidUpdate() {
    //     // 由於componentDidMount只會跑一次
    //     // ，因此若Modal內容有更新，會造成抓不到Ref，因此需要刷新
    //     // console.log('componentDidUpdate');
    //     // 這個是React的Ref
    //     const { childRef } = this.props;
    //     childRef(this); // 使用屬型內的函式，綁定實體
    // }

    componentWillUnmount() { // beforeDestory
        const { childRef } = this.props;
        childRef(undefined); // 解除綁定
    }

    // 整個包含底板
    registDomRef(ref) {
        // 註冊DOM的Ref
        this.domRef = ref;
    }

    // 裡面的那個燈箱
    registModalDomRef(ref) {
        // console.log('registDomRef  this.domRef', this.domRef);
        this.props.childDomRef(ref);
    }

    handleOpen() {
        // 顯示燈箱v2
        this.domRef.classList.add('show');

        // 取得燈箱板子的DOM
        const modalContent = this.domRef.getElementsByClassName('modal-content')[0];

        modalContent.classList.add('show');
    }

    // 隱藏燈箱
    handleClose() {
        // 取得燈箱板子的DOM
        const modalContent = this.domRef.getElementsByClassName('modal-content')[0];
        modalContent.classList.remove('show');
        modalContent.classList.add('close');

        const modalBackground = this.domRef;

        if (this.props.onModalClose) {
            // 呼叫關閉事件
            this.props.onModalClose();
        }

        setTimeout(function () {
            modalContent.classList.remove('close');
            modalBackground.classList.remove('show');
        }, 400);

        // Debug用
        // console.log('lock Modal close')

        // setTimeout(function () {
        //     modalContent.classList.remove('close');
        //     modalBackground.classList.remove('show');
        // }, 4000);
    }

    handleClickBoard(e) {
        // 避免觸發到底下的背景區塊的event

        // e.preventDefault();
        e.stopPropagation(); // 停止泡泡事件
    }

    render() {
        // 
        return (<div className={this.props.className} onClick={this.handleClose.bind(this)} ref={this.registDomRef.bind(this)}>
            <div className="modal-content" ref={this.registModalDomRef.bind(this)} onClick={this.handleClickBoard.bind(this)}>
                <span style={{
                    fontSize: '28px', // 拔出來到外面，避免影響到Modal內層的其他文字
                    fontWeight: 'bold',
                    right: '10px',
                    top: '-2px',
                }} className="close" onClick={this.handleClose.bind(this)}>&times;</span>
                {this.props.children}
            </div>
        </div>);
    }
}

const ModalStyled = styled(ModalElement)`
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: ${props => props.layer || '1'};
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    /* background-color: rgb(0,0,0); // Fallback color
    background-color: rgba(0,0,0,0.4); // Black w/ opacity */
    background-color: rgba(0, 0, 0, 0.4);

    &.show {
        display: block;
    }

    & .modal-content {
        background-color: #fefefe;
        position: absolute;
        left: ${props => props.left !== undefined ? `${props.left}px` : '50px'};
        top: ${props => props.top !== undefined ? `${props.top}px` : '50px'};

        border: 1px solid #888;
        opacity: 1;

        background-color: ${getTheme('modal', '#a26969')};
        border-radius: ${getTheme('modalRadius', '0px')};

        // 關閉按鈕
        & .close {
            /* float: right; */
            position:absolute;
            /* right:10px;
            top  :-2px; */

            color: #aaa;
            /* font-size: 28px; 不能寫在這，會影響到Modal內部的文字size */
            /* font-weight: bold; */

            /* display: none; */
        }

        & .close:hover,
        & .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    }
    & .modal-content.show {
        top: ${props => props.top !== undefined ? `${props.top}px` : '50px'};
        
        opacity: 1;

        // 開啟燈箱動畫
        -webkit-animation-name: animatetop;
        -webkit-animation-duration: 0.4s;
        animation-name: animatetop;
        animation-duration: 0.4s;

        @-webkit-keyframes animatetop {
            from {
                top: ${props => props.top !== undefined ? `${props.top - 50}px` : '0px'};
                opacity:0;
            }
            to {
                top: ${props => props.top !== undefined ? `${props.top}px` : '50px'};
                opacity:1;
            }
        }

        @keyframes animatetop {
            from {
                top: ${props => props.top !== undefined ? `${props.top - 50}px` : '0px'};
                opacity:0;
            }
            to {
                top: ${props => props.top !== undefined ? `${props.top}px` : '50px'};
                opacity:1;
            }
        }
    }
    .modal-content.close {
        top: ${props => props.top !== undefined ? `${props.top}px` : '50px'};
        opacity: 0;

        // 開啟燈箱動畫
        -webkit-animation-name: animatedown;
        -webkit-animation-duration: 0.4s;
        animation-name: animatedown;
        animation-duration: 0.4s;

        @-webkit-keyframes animatedown {
            from {
                top: ${props => props.top !== undefined ? `${props.top}px` : '50px'};
                opacity: 1;
            } 
            to {
                top: ${props => props.top !== undefined ? `${props.top - 50}px` : '0px'};
                opacity: 0;
            }
        }

        @keyframes animatedown {
            from {
                top: ${props => props.top !== undefined ? `${props.top}px` : '50px'};
                opacity:1;
            }
            to {
                top: ${props => props.top !== undefined ? `${props.top - 50}px` : '0px'};
                opacity:0;
            }
        }
    }
`

class Modal extends React.Component {
    // left = 0;
    // top = 0;
    constructor(props) {
        super(props);

        this.childModalRef = null; // React Ref
        this.modalDomRef = null; // Dom Ref

        this.state = {
            left: 0,
            top: 0,
            actModalShow: false,
        };
    }

    componentDidMount() {
        const defaultChildRefBindFunc = function () {
            console.warn(`Modal component: childRef prop not exist`);
        }

        // 這個是React的Ref
        const { childRef = defaultChildRefBindFunc } = this.props; // childRef有預設值，避免沒填childRef參數時報錯
        childRef(this); // 使用屬型內的函式，綁定實體

        // 設定燈箱位置
        // console.log('componentDidMount');
        // this.autoSetModalLocation();
    }


    componentDidUpdate() {
        if (this.state.actModalShow) {
            this.actOpenModal();
            // 接收到開啟燈箱的指令
            this.setState({
                actModalShow: false, // 關閉
            });
        }
    }

    componentWillUnmount() { // beforeDestory
        const { childRef } = this.props;
        childRef(undefined); // 解除綁定
    }

    // [public] 用來接收外部「開啟燈箱」的指令
    openModal() {
        // 設定燈箱位置

        const vm = this;

        const [left, top] = vm.getModalLocation();

        this.setState({
            left: left,
            top: top,
            actModalShow: true, // 使用state下指令，相當於nextTick的功能
        });
    }

    // 真正執行openModal的地方
    actOpenModal() {
        this.childModalRef.handleOpen();

        if (this.props.onModalOpen) {
            this.props.onModalOpen();
        }
    }

    // [public]
    closeModal() {
        this.childModalRef.handleClose();
    }

    // 設定Dom Ref
    setDomRef(ref) {
        // 存入DOM Ref
        this.modalDomRef = ref;
    }

    getModalLocation() {
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        // console.log('clientWidth', document.body.clientWidth);
        // console.log('clientHeight', document.body.clientHeight);
        // console.log(`clientWidth: ${document.body.clientWidth} / clientHeight: ${document.body.clientHeight}`);

        const modalWidth = this.props.modalWidth;
        const modalHeight = this.props.modalHeight;
        // const modalWidth = 107;
        // const modalHeight = 37;
        // console.log(`modalWidth: ${modalWidth} / modalWidth: ${modalHeight}`);

        const left = Math.floor((clientWidth - modalWidth) / 2);
        const top = Math.floor((clientHeight - modalHeight) / 2);

        return [left, top];
    }

    // 自動設定燈箱位置
    // [BUG]有空要再加上畫面寬度變化感測器，變化後自動重刷位置
    // autoSetModalLocation() {
    //     console.log('autoSetModalLocation');
    //     // 取得當下的畫面寬度，依照modal的大小置中

    //     const clientWidth = document.body.clientWidth;
    //     const clientHeight = document.body.clientHeight;
    //     // console.log('clientWidth', document.body.clientWidth);
    //     // console.log('clientHeight', document.body.clientHeight);
    //     // console.log(`clientWidth: ${document.body.clientWidth} / clientHeight: ${document.body.clientHeight}`);

    //     const modalWidth = this.props.modalWidth;
    //     const modalHeight = this.props.modalHeight;
    //     // const modalWidth = 107;
    //     // const modalHeight = 37;
    //     // console.log(`modalWidth: ${modalWidth} / modalWidth: ${modalHeight}`);

    //     const left = Math.floor((clientWidth - modalWidth) / 2);
    //     const top = Math.floor((clientHeight - modalHeight) / 2);

    //     // console.log(`left: ${left} / top: ${top}`);

    //     this.setState({
    //         left: left,
    //         top: top,
    //     });
    // }

    bindChildModalRef(ref) {
        this.childModalRef = ref;
    }

    render() {
        return (
            <ModalStyled childRef={this.bindChildModalRef.bind(this)} childDomRef={this.setDomRef.bind(this)}
                left={this.state.left} top={this.state.top} theme={modalThemeObject} onModalClose={this.props.onModalClose}
                layer={this.props.layer}>
                {this.props.children}
            </ModalStyled>
        );
    }
}

export default Modal;
