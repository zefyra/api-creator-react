import StateModel, { ModelGetter } from "model/StateModel";


export class TagButtonGearEnum {
    static noMark = 'noMark'
    static marked = 'marked'
    static selected = 'selected'
}

export class TagCategoryRadioEnum {
    static noMark = 'noMark'
    static marked = 'marked'
    static selected = 'selected'
}

export default class TagSelectorModel extends StateModel {
    /*
    const tagSelectorModel = new StateModel(useRef({
        tagCategory: null, // 當前選擇的標籤類別
        tagCategoryList: [],
        tagList: [],
        searchKey: '',
        startDate: '',
        endDate: '',
    }));
    */

    // constructor(stateRef) {
    //     super(stateRef);
    //     this.stateRef = stateRef;
    // }

    data() {
        return {
            tagCategory: null, // 當前選擇的標籤類別
            tagCategoryList: [],
            // tagCategoryList: [{
            //     label: '用戶屬性',
            //     value: 'user',
            // }, {
            //     label: '商品服務屬性',
            //     value: 'productService',
            // }, {
            //     label: '交易屬性',
            //     value: 'trade',
            // }, {
            //     label: '用戶行為',
            //     value: 'userAction',
            // }, {
            //     label: '販促活動',
            //     value: 'bigSale',
            // }],
            tagList: [],
            /* tagList: [{
                label: 'AAAAA',
                value: 'AAAAA',
                active: true,
            }], */
            selectedTagList: [], // type: 'socialFriendModal' 模式下所選取的標籤
            searchKey: '',
            startDate: '',
            endDate: '',
            // tagCategoryRadioActiveMap: {},
            // /* tagCategoryRadioActiveMap: {
            //     <tagCategoryIndex>: true, // true === 'active'
            // } */
            tagTableData: null, // <TableData> 鏡像，用來響應tagButton的active狀態
            // categoryPage: 1,
        }
    }

    getters() {
        /* function tagCategoryRadioActive(state, tagCategoryItem, index) {
            // this: <TagSelectorModel>(自己物件)

            const existTag = state.tagList.find((tagItem) => {
                return tagItem.category === tagCategoryItem.value;
            })
            return existTag != null;
        }*/

        function tagCategoryRadioStatus(state, tagCategoryItem, index) {
            // this: <TagSelectorModel>(自己物件)

            // console.log('tagCategoryRadioStatus', tagCategoryItem.value)

            const selectedTagList = state.selectedTagList;

            const existSelectedTag = selectedTagList.find((selectedTagItem) => {
                return selectedTagItem.category === tagCategoryItem.value;
            });
            if (existSelectedTag) {
                return TagCategoryRadioEnum.selected;
            }

            const existTag = state.tagList.find((tagItem) => {
                return tagItem.category === tagCategoryItem.value;
            });
            return existTag ? TagCategoryRadioEnum.marked : TagCategoryRadioEnum.noMark;
        }

        function tagButtonActive(state, tagItem, index) {
            const tagList = state.tagList;

            const existTag = tagList.find((userTagItem) => {
                return tagItem.value === userTagItem.value;
            });

            return existTag != null;
        }

        function tagButtonStatus(state, tagItem, index) {
            /*  getter使用到的參數:
            1. state.tagList: 使用到Model中的參數，因此必須掛上ref: 'tagList'，
            才會在Model更新時，連帶更新
            2. tagItem: 這個參數由View當中傳下來的，因此在View當中必須設定感應器，
            在tagItem改變時，也要同步觸發刷新。

            使用以下寫法: 
                useEffect(function () {
                    // 當tagItem改變時，也必須刷新active
                    fetchModel('tagSelector').refreshGetter(setterConnect);
                }, [tagItem]); */

            const tagList = state.tagList;
            const selectedTagList = state.selectedTagList;

            const existSelectedTag = selectedTagList.find((selectedTagItem) => {
                return tagItem.value === selectedTagItem.value;
            });

            if (existSelectedTag) {
                return TagButtonGearEnum.selected;
            }

            const existTag = tagList.find((userTagItem) => {
                return tagItem.value === userTagItem.value;
            });
            return existTag ? TagButtonGearEnum.marked : TagButtonGearEnum.noMark;
        }

        return {
            // tagCategoryRadioActive: new ModelGetter({ // <getterKey>
            //     ref: 'tagList', // 代表要綁定的欄位
            //     getter: tagCategoryRadioActive.bind(this),
            // }),
            tagCategoryRadioStatus: new ModelGetter({ // <getterKey>
                ref: ['tagList', 'selectedTagList'], // 代表要綁定的欄位
                getter: tagCategoryRadioStatus.bind(this),
            }),
            tagButtonActive: new ModelGetter({
                ref: 'tagList',
                getter: tagButtonActive.bind(this),
            }),
            tagButtonStatus: new ModelGetter({
                ref: ['tagList', 'selectedTagList'],
                getter: tagButtonStatus.bind(this),
            }),
        }
    }

    getTagList() {
        const tagList = this.getState('tagList');
        if (!tagList) {
            console.error(`getTagList: tagList not exist`);
            return null;
        }
        return tagList;
    }

    setTagList(tagList) {
        this.setState('tagList', tagList);
    }

    addTag(tagItem) {
        const tagList = this.getTagList();
        let newTagList = tagList.map((tagData) => {
            tagData = Object.assign({}, tagData);
            return tagData;
        });
        newTagList.push(tagItem);
        this.setTagList(newTagList);
    }

    cancelTag(tagItem) {
        let newTagList = [];
        const tagList = this.getTagList();
        tagList.forEach((tagData) => {
            /* {
                active: false
                label: "duanwu_1_7"
                value: "duanwu_1_7"
            } */
            if (tagData.value === tagItem.value) {
                return; // 將該項目排除掉
            }
            newTagList.push(tagData);
        });
        this.setTagList(newTagList);
    }
}