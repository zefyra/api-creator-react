
// import { selectBindButtonUpdate, updateBindButtonUpdate } from 'store/tagSelector';
import store from 'store'
import TableControl from './Table'
import TableData from 'util/TableData'
import { ApiError } from 'apiSender';


class TagCategoryEnum {
    static userTag = '__allUserTag';
    static all = '__all';
    static selectTag = '__selectTag'
}

// 測試用的標籤類別(之後刪)
const initTagCategoryList = [{
    label: '用戶屬性',
    value: 'user',
}, {
    label: '商品服務屬性',
    value: 'productService',
}, {
    label: '交易屬性',
    value: 'trade',
}, {
    label: '用戶行為',
    value: 'userAction',
}, {
    label: '販促活動',
    value: 'bigSale',
}, {
    label: '父親節特賣',
    value: 'papadays',
}, {
    label: '端午節活動',
    value: 'duanwu',
}, {
    label: '小寒',
    value: 'shohan',
}, {
    label: '大寒',
    value: 'dahan',
}, {
    label: '立春',
    value: 'rishun',
}, {
    label: '雨水',
    value: 'usui',
}, {
    label: '驚蟄',
    value: 'jinzu',
}, {
    label: '春分',
    value: 'shunfun',
}, {
    label: '清明',
    value: 'chinming',
}, {
    label: '穀雨',
    value: 'guyu',
}, {
    label: '立夏',
    value: 'lisha',
}, {
    label: '小滿',
    value: 'shouman',
}, {
    label: '芒種',
    value: 'manzon',
}, {
    label: '夏至',
    value: 'shazu',
}, {
    label: '小暑',
    value: 'shosu',
}, {
    label: '大暑',
    value: 'dasu',
}, {
    label: '立秋',
    value: 'lichu',
}, {
    label: '處暑',
    value: 'chusu',
}, {
    label: '白露',
    value: 'bairu',
}, {
    label: '秋分',
    value: 'chufun',
}, {
    label: '寒露',
    value: 'hanru',
}, {
    label: '霜降',
    value: 'shianjian',
}, {
    label: '立冬',
    value: 'lidon',
}, {
    label: '小雪',
    value: 'shoshue',
}, {
    label: '大雪',
    value: 'dashue',
}, {
    label: '冬至',
    value: 'donzu',
}];


export default class TagSelectorControl extends TableControl {
    // [private] viewType: 內部用來區分，不同viewType有自己的執行方式
    viewType = '';
    modalRef = null;
    // tagListGetter = null;
    // tagListSetter = null;

    constructor(type, modalRef, tableDataRef) {
        super(tableDataRef, null);
        this.viewType = type;
        this.modalRef = modalRef;
    }

    frame() {
        return {
            tagSelector: true, // 開啟tagSelector的model存取權限
        }
    }

    // TagSelectorContainer action---------------------------------

    openModal() {
        if (!this.modalRef) {
            console.log('TagSelectorControl: modalRef not exist at openModal');
            return;
        }
        if (!this.modalRef.current) {
            console.log('TagSelectorControl: modalRef.current not exist at openModal');
            return;
        }
        this.modalRef.current.openModal();
    }

    closeModal() {
        if (!this.modalRef) {
            console.log('TagSelectorControl: modalRef not exist at closeModal');
            return;
        }
        if (!this.modalRef.current) {
            console.log('TagSelectorControl: modalRef.current not exist at closeModal');
            return;
        }
        this.modalRef.current.closeModal();
    }

    // TagSelectorContainer render---------------------------------

    onBindChildModalRef(modalRef) {
        // console.log('childBindModalRef', modalRef)
        this.modalRef.current = modalRef;
    }

    // API 呼叫----------------------------------------------------------

    // 載入指定類別標籤
    loadTagTable(newPage, unlock = () => { }, categoryKey) {
        // [缺API]API載入標籤頁面: 這邊要接API
        let dataList = [];

        let len = newPage === 3 ? 3 : 15;

        for (let i = 0; i < len; i += 1) {
            const value = `${categoryKey}_${newPage}_${i}`;
            const label = value;

            dataList.push({
                label: label,
                value: value, // 需要是唯一值，不同的tag，value不能重複
                active: false,
                category: categoryKey,
            });
        }

        const newTableData = new TableData({
            page: newPage,
            pageSize: 15,
            totalPage: 3, // 固定有3頁，測試用
            data: dataList,
        }, 'default');
        this.refreshTableData(newTableData);
        // this.fetchModel('tagSelector').setState('tagTableData', newTableData);

        return Promise.resolve(newTableData);
    }


    // 載入全部標籤
    loadAllTagTable(newPage, unlock = () => { }) {
        const categoryKey = TagCategoryEnum.all;
        // [缺API]API載入標籤頁面: 這邊要接API
        let dataList = [];

        let len = newPage === 3 ? 3 : 15;

        for (let i = 0; i < len; i += 1) {
            const value = `${categoryKey}_${newPage}_${i}`;
            const label = value;

            dataList.push({
                label: label,
                value: value, // 需要是唯一值，不同的tag，value不能重複
                active: false,
                category: categoryKey,
            });
        }

        const newTableData = new TableData({
            page: newPage,
            pageSize: 15,
            totalPage: 3, // 固定有3頁，測試用
            data: dataList,
        }, 'default');
        this.refreshTableData(newTableData);
        // this.fetchModel('tagSelector').setState('tagTableData', newTableData);

        return Promise.resolve(newTableData);
    }



    loadButtonTableByTagList(tagList, newPage, unlock = () => { }) {
        const pageSize = 15;

        // const tagList = this.fetchModel('tagSelector').getState('tagList');
        /* tagList: [{
            active: false
            label: "jinzu_1_7"
            value: "jinzu_1_7"
            category: "jinzu",
        }] */

        let dataList = tagList.slice((newPage - 1) * pageSize, newPage * pageSize).map((tagItem) => {
            return Object.assign({}, tagItem);
        });

        const newTableData = new TableData({
            page: newPage,
            pageSize: pageSize,
            totalPage: Math.ceil(tagList.length / pageSize), // 固定有3頁，測試用
            data: dataList,
        }, 'default');
        this.refreshTableData(newTableData);

        // this.fetchModel('tagSelector').setState('tagTableData', newTableData);

        return Promise.resolve();
    }

    // 載入該使用者已標上的全部標籤
    loadUserTagTable(newPage, unlock = () => { }) {
        const tagList = this.fetchModel('tagSelector').getState('tagList');
        return this.loadButtonTableByTagList(tagList, newPage, unlock);
    }

    loadSelectTagTable(newPage, unlock = () => { }) {
        const selectedTagList = this.fetchModel('tagSelector').getState('selectedTagList');
        return this.loadButtonTableByTagList(selectedTagList, newPage, unlock);
    }

    loadTagCategoryList() {
        // [缺API]要補載標籤類別的API
        return Promise.resolve(initTagCategoryList);
    }


    // queryTagModal action(TagSelectorContainer)---------------------------------

    // 點擊外部的輸入框
    onClickPanelShow() {
        const vm = this;

        this.openModal();

        // 初始化標籤類別
        this.loadTagCategoryList().then((tagCategoryList) => {
            vm.fetchModel('tagSelector').setState('tagCategoryList', tagCategoryList);


            let firstTagCategory = tagCategoryList[0] ? (tagCategoryList[0].value || null) : null;

            if (!firstTagCategory) {
                return Promise.reject(`no firstTagCategory`);
            }

            // 自動取第一項類別
            vm.fetchModel('tagSelector').setState('tagCategory', firstTagCategory);

            // 自動載入第一項類別的表格
            return vm.loadTagTable(1, () => { }, firstTagCategory);
        }).catch(new ApiError().catchAlertMsg());
    }

    // queryTagModal action(TagSelector)---------------------------------


    // loadSocialFriendModalTag
    // this.viewType === 'socialFriendModal'


    // act.1 選取標籤類別
    onTagCategoryChange(value) {
        // console.log('onTagCategoryChange', value);

        // 2.切到「全部」，自動載入該使用者所有標籤
        if (value === TagCategoryEnum.userTag) {
            this.loadUserTagTable(1, () => { });
            return;
        } else if (value === TagCategoryEnum.selectTag) {
            this.loadSelectTagTable(1, () => { });
            return;
        } else if (value === TagCategoryEnum.all) {
            this.loadAllTagTable(1, () => { });
            return;
        }

        this.loadTagTable(1, () => { }, value);
    }

    // act.2 換頁事件
    onTablePageChange(newPage) {
        // console.log('onTablePageChange', newPage);
        const vm = this;

        const tagCategory = this.fetchModel('tagSelector').getState('tagCategory');

        if (tagCategory === TagCategoryEnum.userTag) {
            // 2.切到「用戶全部」，自動載入該使用者所有標籤
            this.loadUserTagTable(newPage, () => { });
            return;
        } else if (tagCategory === TagCategoryEnum.selectTag) {
            this.loadSelectTagTable(newPage, () => { });
            return;
        } else if (tagCategory === TagCategoryEnum.all) {
            // 3.切到「全部」，自動載入該使用者所有標籤
            this.loadAllTagTable(newPage, () => { });
            return;
        }

        // 1.取得當下tagCategory換頁
        this.loadTagTable(newPage, () => { }, tagCategory);
    }

    // act.3 選取/取消標籤
    onTableButtonChange(tagItem, active) {
        if (!active) {
            // return this.cancelTag(tagItem);
            return this.fetchModel('tagSelector').cancelTag(tagItem);
        }

        // return this.addTag(tagItem);
        return this.fetchModel('tagSelector').addTag(tagItem);
    }

    // act.4 標籤上，按下取消標籤icon
    onTagCancel(tagItem, e) {
        e.stopPropagation();
        this.fetchModel('tagSelector').cancelTag(tagItem);
    }

    // act.5 按下確認紐
    onClickConfirm() {
        if (this.viewType === 'queryTagModal') {
            this.closeModal();
        }
    }

    // act.6 TagSelectorExport初始化時
    // onMount() {
    //     // if (this.viewType === 'queryTagModal') {
    //     //     // [缺API] 初始化時取得所有tagCategory
    //     //     this.fetchModel('tagSelector').setState('tagCategoryList', initTagCategoryList);
    //     // }
    // }

    // viewType === 'socialFriendModal' -------------------------------------------------------

    // 重刷整個TagSelector
    mountUserTagSelector() {
        // [缺API]載入使用當前的標籤標記
        this.fetchModel('tagSelector').setState('tagList', [{
            active: true,
            category: "papadays",
            label: "papadays_1_1",
            value: "papadays_1_1",
        }, {
            active: true,
            category: "jinzu",
            label: "jinzu_1_2",
            value: "jinzu_1_2",
        }, {
            active: true,
            category: "productService",
            label: "productService_1_3",
            value: "productService_1_3",
        }]);

        // 清除所有選取的標籤
        this.fetchModel('tagSelector').setState('selectedTagList', []);

        // [缺API]載入類別
        const tagCategoryList = [{
            label: '用戶全部',
            value: TagCategoryEnum.userTag,
        }, {
            label: '目前選取',
            value: TagCategoryEnum.selectTag,
        }, {
            label: '全部',
            value: TagCategoryEnum.all,
        }].concat(initTagCategoryList);
        this.fetchModel('tagSelector').setState('tagCategoryList', tagCategoryList);


        // 自動選取「用戶標籤」的選項
        this.fetchModel('tagSelector').setState('tagCategory', TagCategoryEnum.userTag);

        // 未完成: 要連同tagCategory一起刷新

        // [缺API]載入使用者當前有的標籤，到表格
        this.loadUserTagTable(1, () => { });
    }

    // act.1 自動載入標籤類別 (viewType === 'socialFriendModal')
    onLoadSocialFriendTagSelector(cellInfo) {
        this.mountUserTagSelector();
    }

    // // act.2 儲存
    // onClickSaveSelectedTagList() {
    // }

    // act.3 StartDate或EndDate改變的事件
    onPeriodChange() {
        const startDate = this.fetchModel('tagSelector').getState('startDate');
        const endDate = this.fetchModel('tagSelector').getState('endDate');

        if (!startDate || !endDate) {
            return;
        }

        // console.log('onPeriodChange', endDate.toISOString());

        // 自動重新刷新
        this.mountUserTagSelector();
    }

    // act.4 按下按鈕 (viewType === 'socialFriendModal')
    // TagButtonGear
    onSocialFriendButtonClick(tagItem, index, status) {
        // status: 會輸入當前的狀態
        // console.log('onSocialFriendButtonClick', tagItem, index, status);

        const selectedTagList = this.fetchModel('tagSelector').getState('selectedTagList');

        const existTagItemIndex = selectedTagList.findIndex((eachSelectedTagItem) => {
            return eachSelectedTagItem.value === tagItem.value;
        });
        if (existTagItemIndex >= 0) {
            // 代表有在列表中，要取出來
            selectedTagList.splice(existTagItemIndex, 1);
            let newSelectedTagList = selectedTagList.map((tagItem) => {
                return Object.assign({}, tagItem);
            });
            this.fetchModel('tagSelector').setState('selectedTagList', newSelectedTagList)
        } else {
            // 沒在列表中，要add進去

            // console.log('selectedTagList', selectedTagList);
            let newSelectedTagList = selectedTagList.map((tagItem) => {
                return Object.assign({}, tagItem);
            });
            newSelectedTagList.push(Object.assign({}, tagItem));
            this.fetchModel('tagSelector').setState('selectedTagList', newSelectedTagList)
        }
    }
}

export class SingleTagSelectorControl extends TagSelectorControl {

    // act.3 選取/取消標籤
    onTableButtonChange(tagItem, index) {
        console.log('onTableButtonChange', tagItem, index);

        // 直接將陣列整個取代
        this.fetchModel('tagSelector').setTagList([tagItem]);

        // 關閉Modal
        this.closeModal();

        // if (!active) {
        //     // return this.cancelTag(tagItem);
        //     return this.fetchModel('tagSelector').cancelTag(tagItem);
        // }

        // // return this.addTag(tagItem);
        // return this.fetchModel('tagSelector').addTag(tagItem);
    }
}