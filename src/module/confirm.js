import React, { useState } from "react";
import TipModal from 'component/TipModal'
import { useSelector } from "react-redux";
import { selectConfirmTitle, selectConfirmContent } from 'store/alert'
import LayerMixin from "util/LayerMixin";
// 全域的confirm物件

export default function ConfirmModule({ setConfirmModalRef }) {

    // const [tipModalRef, setTipModalRef] = useState(null);

    if (!setConfirmModalRef) {
        console.error('<ConfirmModule> not have setConfirmModalRef');
        // const [tipModalRef, setTipModalRef] = useState(null);
        // setConfirmModalRef = setTipModalRef;
        setConfirmModalRef = () => { };
    }

    return (
        <TipModal mode="confirm" content=""
            fetchTipModalRef={ref => setConfirmModalRef(ref)}
            layer={LayerMixin.confirm}></TipModal>
    );
}