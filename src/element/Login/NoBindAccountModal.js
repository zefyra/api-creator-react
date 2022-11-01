import Modal from "component/Modal"
import styled from 'styled-components';
import Button from "component/Button"

// 這個Modal目前還沒用到

// let noBindAccountModalRef;

const NoBindAccountModal = ({ setOpenModalRef, className }) => {

    // console.log('setOpenModalRef', setOpenModalRef)

    return (<Modal childRef={ref => (setOpenModalRef(ref))}
        modalWidth={600} modalHeight={290}>
        <div className={className}>
            <div className="warn-modal-title">
                帳號綁定
            </div>
            <hr />
            <div className="warn-modal-content">
                系統偵測您尚未綁定任何帳戶，請先完成註冊動作後，再進行Facebook快速登入綁定
            </div>
            <div className="warn-modal-button-row">
                <Button type="hollow" widthType="wide">前往註冊</Button>
            </div>
        </div>
    </Modal>);
}


const NoBindAccountModalInnerStyled = styled(NoBindAccountModal)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    
    /* width: 300px;
    height: 80px; */

    /* background-color: aquamarine; */

    width: 600px;
    height: 290px;

    .warn-modal-title {
        margin-top: 45px;
        margin-left: ${props => props.marginH};
        margin-right: ${props => props.marginH};
        
        /* background-color: #6445bb; */
    }

    hr {
        width: 35%;
        /* text-align: left; */
        /* max-width: 800px; */
        margin-left:${props => props.marginH};
    }
    .warn-modal-content {
        margin-left: ${props => props.marginH};
        margin-right: ${props => props.marginH};
        
        /* background-color: #bb8845; */
    }
    .warn-modal-button-row {
        /* margin-left: ${props => props.marginH};
        margin-right: ${props => props.marginH}; */

        /* padding-left: ${props => props.marginH}; */

        padding-top: 55px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        width: 100%;

        /* background-color: #458abb; */
    }
`

export default NoBindAccountModalInnerStyled;