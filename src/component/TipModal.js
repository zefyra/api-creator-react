import React, { useState } from "react"
import Modal from "component/Modal"
import styled from 'styled-components';
import Button from "component/Button"
import { modal as modalThemeObject } from "theme/reas"
import ThemeMixin from 'util/ThemeMixin'
import { useTranslation, withTranslation } from "react-i18next";
const getTheme = ThemeMixin.fetchGetTheme();

const TipModalStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    
    /* width: 300px;
    height: 80px; */

    background-color: transparent; // 不顯示，直接使用底層的background-color
    color: ${getTheme('text', '#000000')};

    width: 490px;
    /* height: 290px; */
    min-height: 290px;

    .warn-modal-title {
        margin-top: 3rem;
        margin-left: 50px;
        margin-right: 50px;
        
        /* background-color: #6445bb; */

        margin-bottom: 0.5rem;
    }

    hr {
        width: 35%;
        /* text-align: left; */
        /* max-width: 800px; */
        margin-left: 50px;

        background-color: ${getTheme('hr', '#1520ff')};
        border-width: 1px;
        border-color: ${getTheme('hr', '#1520ff')};
    }
    .warn-modal-content {
        margin-left: 50px;
        margin-right: 50px;

        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        
        /* background-color: #bb8845; */
    }
    .warn-modal-button-area {
        display: flex;
        flex-grow: 1; // 剩下的空間都給它

        /* flex-direction: column; */
        flex-direction: column-reverse; // 讓按鈕放置在底下
        align-items: center;
        justify-content: flex-start;

        width: 100%;

        /* background-color: #458abb; */

        padding-bottom: 15px;

        .warn-modal-button-row {
            display: flex;
            flex-direction: row;
        }
    }
`

// export default TipModal;

class TipModalControl extends React.Component {
    echo = null;
    /* echo = {
        resolve, reject
    }*/
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
        }
    }
    componentDidMount() {
        this.props.fetchTipModalRef(this);
    }

    openModal(args = {}) {
        const vm = this;

        // update state--------------------------------------------------
        const { title, content } = args;
        const newState = {};
        if (title) {
            newState.title = title;
        }
        if (content) {
            newState.content = content;
        }

        this.setState(newState);

        // --------------------------------------------------

        if (this.echo) {

            // 先這樣處理就好，未來再來做主動式檢查Modal狀態

            return Promise.reject('TipModalHasBeenOpen');
        }

        return new Promise((resolve, reject) => {

            this.modalRef.openModal();

            // 生成一個新的echo
            vm.echo = {
                resolve, reject
            }
        });
    }

    saveModalRef() {
        function saveLowerModalRef(ref) {

            // console.log('saveLowerModalRef', ref)

            // 自己存
            this.modalRef = ref;
            // setModalRef(ref);

            // 給上面存
            if (this.props.fetchModalRef) {
                this.props.fetchModalRef(ref)
            }
        }

        return saveLowerModalRef.bind(this);
    }

    onCancelClick() {
        if (this.echo) {
            if (this.echo.resolve) {
                this.echo.resolve('cancel');

                // 已完成任務，清除echo
                this.echo = null;

                // 關閉Tip燈箱
                this.modalRef.closeModal();
            }
        }
    }

    onConfirmClick() {
        // vm.echo = {
        //     resolve, reject
        // }
        if (this.echo) {
            if (this.echo.resolve) {
                this.echo.resolve('confirm');

                // 已完成任務，清除echo
                this.echo = null;

                // 關閉Tip燈箱
                this.modalRef.closeModal();
            }
        }
    }

    onModalClose() {
        // 關閉時，清除echo
        this.echo = null;
    }

    render() {
        const mode = this.props.mode;
        const t = this.props.t;

        let buttonRow;
        if (mode === 'confirm') {
            buttonRow = <div className="warn-modal-button-row">
                <Button type="fill" mode="default" onClick={this.onCancelClick.bind(this)}>
                    {t('cancel')}
                </Button>
                <Button type="fill" mode="primary" onClick={this.onConfirmClick.bind(this)}>
                    {t('confirm')}
                </Button>
            </div>;
        } else { // mode === 'tip'
            buttonRow = <div className="warn-modal-button-row">
                <Button type="fill" mode="primary" onClick={this.onConfirmClick.bind(this)}>
                    {t('confirm')}
                </Button>
            </div>;
        }

        // childRef={ref => fetchModalRef && fetchModalRef(ref)}
        return (<Modal childRef={this.saveModalRef()}
            modalWidth={490} modalHeight={290}
            onModalClose={this.onModalClose.bind(this)}
            layer={this.props.layer}>
            <TipModalStyled theme={modalThemeObject}>
                <div className="warn-modal-title">
                    {this.props.title || t('tip')}
                </div>
                <hr />
                <div className="warn-modal-content">
                    {this.state.content || this.props.content}
                </div>
                <div className="warn-modal-button-area">
                    {buttonRow}
                </div>
            </TipModalStyled>
        </Modal>);
    }
}

const TipModalComponent = withTranslation('component', { keyPrefix: 'modal' })(TipModalControl);

export default function TipModalEx({ mode, title, content, fetchModalRef, onConfirm, fetchTipModalRef, layer }) {
    return (
        <TipModalComponent mode={mode} title={title} content={content} fetchModalRef={fetchModalRef} onConfirm={onConfirm} fetchTipModalRef={fetchTipModalRef} layer={layer}></TipModalComponent>
    );
}