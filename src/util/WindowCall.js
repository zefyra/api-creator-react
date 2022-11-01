
// const windowOnClickMap = {};
/* {
    <srcKey>
} */


export default class WindowCall {
    static hasRegistOnClick = false;
    // WindowCall.autoCloseWhenShow('DefaultDropdownSelect',
    //     dropdownShow, '.table-header-select-button, .dropdown-select-item',
    //     () => setDropdownShow(false)
    // );
    static autoCloseOnShowChanged(srcKey, show, excludeTargetClass, callback) {
        // srcKey: 來源KEY 目前沒用
        // show: 當前異動的顯示狀態
        // excludeTargetClass: '.table-header-select-button, .dropdown-select-item'
        // 使用class排除指定的DOM，點擊到這個class的DOM時候不會有反應
        // callback: 執行要做的事

        // 展開範例: WindowCall.autoCloseOnShowChanged展開來的版本
        // if (dropdownShow) {
        //     // 開啟時才掛上去
        //     WindowCall.registOnClick('DefaultDropdownSelect', function (event) {
        //         console.log(`event.target`, event.target);
        //         if (!event.target.matches('.table-header-select-button, .dropdown-select-item')) {
        //             if (dropdownShow) {
        //                 setDropdownShow(false);
        //                 // 處理完畢後刪除，避免之後接觸到已釋放的物件
        //                 // window.onclick = null;
        //                 WindowCall.endWindowCall(); // 代表工作已執行完畢，要呼叫end，清除 window.onclick 上掛載的函式
        //             }
        //         }
        //     });
        // } else {
        //     WindowCall.endWindowCall(); // 代表工作已執行完畢，要呼叫end，清除 window.onclick 上掛載的函式
        // }

        if (show) {
            // 開啟時才掛上去
            WindowCall.registOnClick(srcKey, function (event) {
                if (!event.target.matches(excludeTargetClass)) {
                    if (show) { // 確認是開啟狀態才執行關閉
                        callback();
                        // 處理完畢後刪除，避免之後接觸到已釋放的物件
                        // window.onclick = null;
                        WindowCall.endWindowCall(); // 代表工作已執行完畢，要呼叫end，清除 window.onclick 上掛載的函式
                    }
                }
            });
        } else {
            // 關閉時要解掉
            WindowCall.endWindowCall(); // 代表工作已執行完畢，要呼叫end，清除 window.onclick 上掛載的函式
        }
    }
    static registOnClick(srcKey, callback) {

        // windowOnClickMap[srcKey] = callback;
        // if (!WindowCall.hasRegistOnClick) {
        //     // 只有第一次呼叫會覆蓋onclick
        //     window.onclick = WindowCall.onWindowClick;
        //     WindowCall.hasRegistOnClick = true;
        // }

        window.onclick = callback;
        // window.onclick = function (event) {
        //     callback(event, function () { // end function
        //         // 處理完畢後刪除，避免之後接觸到已釋放的物件
        //         window.onclick = null;
        //     });
        // };

        // function (event) {
        //     callback(event);
        //     // 處理完畢後刪除，避免之後接觸到已釋放的物件
        //     window.onclick = null;
        // };

        // window.onclick = function (event) {
        //     callback(event);
        //     // 處理完畢後刪除，避免之後接觸到已釋放的物件
        //     window.onclick = null;
        // };
    }
    static endWindowCall() {
        window.onclick = null;
    }
    // static onWindowClick(event) {
    //     // Object.keys(windowOnClickMap).forEach((srcKey) => {
    //     //     const callback = windowOnClickMap[srcKey];
    //     //     callback(event);
    //     // });
    // }
}