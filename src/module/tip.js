import React, { useState } from "react";
import TipModal from 'component/TipModal'
import { useSelector } from "react-redux";
import { selectConfirmTitle, selectConfirmContent } from 'store/alert'
import LayerMixin from "util/LayerMixin";
// 全域的confirm物件

export default function TipModule({ setConfirmModalRef }) {

    if (!setConfirmModalRef) {
        console.error('<ConfirmModule> not have setConfirmModalRef');
        // const [tipModalRef, setTipModalRef] = useState(null);
        // setConfirmModalRef = setTipModalRef;
        // ps.不可以這樣寫，useState不能放在判斷式內
        setConfirmModalRef = () => { };
    }

    return (
        <TipModal mode="tip" content=""
            fetchTipModalRef={ref => setConfirmModalRef(ref)}
            layer={LayerMixin.tip}></TipModal>
    );
}