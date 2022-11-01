import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";

import RenderOnce from "util/RenderOnce";
import OuterCaller, { OuterReminder } from 'util/OuterCaller';


// ps.有空使用class component重寫OuterInvoker試試，看能否不要重render


export default function OuterInvoker({ qkey, qid, getShow, setShow }) {

    let mountCountRef = useRef(0);
    let outerCallerRef = useRef(null);

    // const cachedValue = useMemo(() => {
    //     console.log('aaaa');
    // })

    // const [fakeVal, setFakeVal] = useState([]);

    // const addTodo = useCallback(() => {
    //     // setTodos((t) => [...t, "New Todo"]);
    //     setFakeVal((t) => [...t, "New Todo"]);
    //     console.log('aaaaa');
    // }, [fakeVal]);

    // const a = useCallback(() => {
    //     console.log('cccc')
    //     return qid;
    // }, [])


    // 第一層: 避免每次render都重跑一次regist
    useEffect(function () {

        // 第二層: 用來擋嚴格模式2次render造成的qid不一致問題，統一只跑第二次
        RenderOnce.runOnlyAtMmount(mountCountRef, function () {

            // console.log(a());
            // console.log(`OuterInvoker: ${qkey}-${qid} outerCallerRef.current`, outerCallerRef.current)

            // console.log(`OuterInvoker: ${qkey}-${qid}`);
            // 第三層: 把相同的qid過濾掉，避免相同qid重複call
            outerCallerRef.current = new OuterReminder(qid, getShow, setShow);
        });
    }, []);
    if (outerCallerRef.current) {
        outerCallerRef.current.updateShowState(getShow, setShow);
    }

    return (
        <div className="hide-outer-invoker" style={{
            display: 'none',
        }}></div>
    );
}