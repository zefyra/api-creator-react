import StateModel from "model/StateModel";
import TableHeader from "util/TableHeader";
import TimeFilter from "filter/TimeFilter";
import CreateMethodEnum from "enum/tag/CreateMethodEnum";
import DataCategoryEnum from "enum/dataCollection/DataCategory";
import PlatformTypeEnum from "enum/dataCollection/PlatformType";
import StateRef from "model/StateRef";
import Ref from "model/Ref";
import ArrayElementModel from "element/TagDecisionCondition/ArrayElementModel";
import { TagDecisionBlockFlow } from "flow/tag";
import ListModel from "element/TagDecisionCondition/ListModel";
import DecisionRowModeEnum from "enum/tag/DecisionRowModeEnum";
import ConditionTypeEnum from "enum/tag/ConditionTypeEnum";
import ConditionFieldTypeEnum from "enum/tag/ConditionFieldTypeEnum";
import { FieldTypeEnum } from "enum/dataCollection/FieldType";
import ParamDateUnitEnum from "enum/tag/ParamDateUnitEnum";

export class TagCategoryTableModel extends StateModel {

    data(initObj = {}) {

        const t = initObj.t || (val => val);

        let dateFilter = new TimeFilter('date', '-');
        let dateTimeFilter = new TimeFilter('time', '-');

        const baseWidth = '80px';

        return {
            tableHeader: new TableHeader({
                // rowSelect: {
                //     mode: 'singleSelect', // 代表只能單選
                // },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                // buttonColumn: { 
                //     tagDecisionCondition: { // 標籤判斷條件 // TagDecisionCondition.jsx頁面製作失敗
                //         buttonItemList: [{
                //             type: 'button',
                //             label: t('view'), // '檢視',
                //             event: 'viewTagDecisionCondition',
                //             buttonType: 'fill',
                //             buttonMode: 'default',
                //             buttonPattern: 'buttonColumn',
                //         }],
                //     },
                // },
                header: [{
                    label: '',
                    key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                    type: 'checkBox',
                    mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
                }, {
                    label: 'ID',
                    key: 'id',
                    type: 'text',
                    width: baseWidth,
                    // }, { // TagDecisionCondition.jsx頁面製作失敗
                    //     label: t('tagDecisionCondition'),
                    //     key: 'tagDecisionCondition',
                    //     type: 'buttonColumn',
                    //     width: '140px',
                }, {
                    label: t('openOrClose'), // 開放/關閉
                    key: 'tagCategoryEnable',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagCategoryZh'), // 標籤分類(中)
                    key: 'tagCategoryZh',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagCategoryEn'), // 標籤分類(英)
                    key: 'tagCategoryEn',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('upperCategory'), // 上級分類
                    key: 'upperCategory',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('creator'), // 建立者
                    key: 'creator',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('createMethod'), // 建立方式
                    key: 'createMethod',
                    type: 'text',
                    width: baseWidth,
                    // }, {
                    //     label: t('applyRange'), // 適用範圍
                    //     key: 'applyRange',
                    //     type: 'text',
                    //     width: baseWidth,
                }, {
                    label: t('applyIndustry'), // 適用範圍_產業
                    key: 'applyIndustry',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('applyUser'), // 適用範圍_用戶
                    key: 'applyUser',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('schemaNameZh'), // 資料表名稱(中)
                    key: 'schemaNameZh',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('schemaNameEn'), // 資料表名稱(英)
                    key: 'schemaNameEn',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('updateFrequency'), // 更新頻率
                    key: 'updateFrequency',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagNum'), // 標籤數
                    key: 'tagNum',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('createDate'), // 創建日期
                    key: 'createDate',
                    type: 'text',
                    width: baseWidth,
                    filter: dateFilter,
                }, {
                    label: t('updateDate'), // 更新日期
                    key: 'updateDate',
                    type: 'text',
                    width: baseWidth,
                    filter: dateFilter,
                }],
            }),
        };
    }
    getSampleTableData() {
        const dStr = new Date().toISOString();
        return [{
            id: 'p01',
            tagCategoryEnable: true,
            tagCategoryZh: '性別',
            tagCategoryEn: 'gender',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.fromDataCollection,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '10分鐘',
            tagNum: 3,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p02',
            tagCategoryEnable: true,
            tagCategoryZh: '年齡',
            tagCategoryEn: 'age',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.fromDataCollection,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '10分鐘',
            tagNum: 5,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p03',
            tagCategoryEnable: true,
            tagCategoryZh: '居住國家',
            tagCategoryEn: 'Country of Residence',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.manualCreate,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '30分鐘',
            tagNum: 120,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p04',
            tagCategoryEnable: true,
            tagCategoryZh: '產品分類',
            tagCategoryEn: 'product category',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.fromDataCollection,
            applyIndustry: '',
            applyUser: 'strafe,bbb111',
            schemaNameZh: '',
            schemaNameEn: 'Categories',
            updateFrequency: '30分鐘',
            tagNum: 43,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p05',
            tagCategoryEnable: true,
            tagCategoryZh: 'NES會員分類',
            tagCategoryEn: 'NES Membership Classification',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.manualCreate,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '5分鐘',
            tagNum: 5,
            createDate: dStr,
            updateDate: dStr
        }];
    }
}


export class TagCategoryAddModel extends StateModel {

    data() {
        // let dateFilter = new TimeFilter('date', '-');
        // let dateTimeFilter = new TimeFilter('time', '-');

        return {
            upperCategory: '',
            upperCategoryRow: null,
            tagCategoryZh: '',
            tagCategoryEn: '',
            tagCreateMethod: CreateMethodEnum.manualCreate,
            importSchema: '',
            importSchemaRow: null,
            schemaField: '',
            schemaFieldOptionList: [],
            schemaFieldOptionListLoading: false,
            applyIndustry: '',
            applyIndustryOptionList: [],
            applyIndustryLoading: false,
            applyIndustryDisabled: false,
            applyUser: '',
            applyUserDisabled: true,
            categoryTagAmount: 15, // 此標籤分類下，綁定 N 個標籤
            updateFrequency: 0, // 分鐘
            tagDecisionCondition: '', // 標籤判斷條件
        };
    }
    // 確認時，輸出
    getModalConfirmState() {
        return {
            upperCategoryRow: this.getState('upperCategoryRow'),
            tagCategoryZh: this.getState('tagCategoryZh'),
            tagCategoryEn: this.getState('tagCategoryEn'),
            tagCreateMethod: this.getState('tagCreateMethod'),
        }
    }
}

export class UpperCategoryTableModel extends StateModel {
    data(initObj = { t: val => val }) {

        const t = initObj.t;

        const baseWidth = '80px';
        return {
            tableHeader: new TableHeader({
                buttonColumn: {
                    action: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('addIn'), // '加入',
                            event: 'addIn',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                },
                header: [{
                    label: 'ID',
                    key: 'id',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagCategoryZh'), // 標籤分類(中)
                    key: 'tagCategoryZh',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagCategoryEn'), // 標籤分類(英)
                    key: 'tagCategoryEn',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('schemaNameZh'), // 資料表名稱(中)
                    key: 'schemaNameZh',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('schemaNameEn'), // 資料表名稱(英)
                    key: 'schemaNameEn',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('action'), // 操作
                    key: 'action',
                    type: 'buttonColumn',
                    width: '193px', // 193
                }],
            }),
            loading: true,
        }
    }

    getSampleTableData() {
        const dStr = new Date().toISOString();
        return [{
            id: 'p01',
            tagCategoryEnable: true,
            tagCategoryZh: '性別',
            tagCategoryEn: 'gender',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.fromDataCollection,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '10分鐘',
            tagNum: 3,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p02',
            tagCategoryEnable: true,
            tagCategoryZh: '年齡',
            tagCategoryEn: 'age',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.fromDataCollection,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '10分鐘',
            tagNum: 5,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p03',
            tagCategoryEnable: true,
            tagCategoryZh: '居住國家',
            tagCategoryEn: 'Country of Residence',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.manualCreate,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '30分鐘',
            tagNum: 120,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p04',
            tagCategoryEnable: true,
            tagCategoryZh: '產品分類',
            tagCategoryEn: 'product category',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.fromDataCollection,
            applyIndustry: '',
            applyUser: 'strafe,bbb111',
            schemaNameZh: '',
            schemaNameEn: 'Categories',
            updateFrequency: '30分鐘',
            tagNum: 43,
            createDate: dStr,
            updateDate: dStr
        }, {
            id: 'p05',
            tagCategoryEnable: true,
            tagCategoryZh: 'NES會員分類',
            tagCategoryEn: 'NES Membership Classification',
            upperCategory: '',
            creator: 'thomas@aaa.bbb',
            createMethod: CreateMethodEnum.manualCreate,
            applyIndustry: '全產業',
            applyUser: '',
            schemaNameZh: '',
            schemaNameEn: '',
            updateFrequency: '5分鐘',
            tagNum: 5,
            createDate: dStr,
            updateDate: dStr
        }];
    }

}


export class ImportSchemaTableModel extends StateModel {
    data(initObj = { t: val => val }) {

        const t = initObj.t;

        const baseWidth = '80px';
        return {
            tableHeader: new TableHeader({
                buttonColumn: {
                    action: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('addIn'), // '加入',
                            event: 'addIn',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                },
                header: [{
                    label: t('srcSystem'), // 來源系統
                    key: 'srcSystem',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('schemaFormat'), // 資料欄位格式
                    key: 'schemaFormat',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('statusCode'), // 狀態代碼
                    key: 'statusCode',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('dataNameEn'), // 資料名稱(英文)
                    key: 'dataNameEn',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('dataNameZh'), // 資料名稱(中文)
                    key: 'dataNameZh',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('totalDataAmount'), // 總資料筆數
                    key: 'totalDataAmount',
                    type: 'text',
                    width: '80px',
                }, {
                    label: t('action'), // 操作
                    key: 'action',
                    type: 'buttonColumn',
                    width: '193px', // 193
                }],
            }),
            loading: true,
        }
    }

    getSampleTableData() {
        const dStr = new Date().toISOString();
        return [{
            recipe_id: '',
            platformType: PlatformTypeEnum.ec,
            srcSystem: 'shop001',
            schemaFormat: '交易紀錄',
            statusCode: '1',
            dataNameEn: 'EC_Order',
            dataNameZh: '訂單紀錄',
            totalDataAmount: 413,
            doneDataAmount: 413,
            changeSyncSrcSystem: true,
            createTime: dStr,
            updateTime: dStr,
            __subTable: DataCategoryEnum.transactionLog,
        }, {
            recipe_id: '',
            platformType: PlatformTypeEnum.crm,
            srcSystem: 'shop002',
            schemaFormat: '會員資料',
            statusCode: '2',
            dataNameEn: 'member',
            dataNameZh: '會員資料',
            totalDataAmount: 1153,
            doneDataAmount: 0,
            changeSyncSrcSystem: true,
            createTime: dStr,
            updateTime: dStr,
            __subTable: DataCategoryEnum.memberData,
        }, {
            recipe_id: '',
            platformType: PlatformTypeEnum.erp,
            srcSystem: 'shop002',
            schemaFormat: '商品分類',
            statusCode: '2',
            dataNameEn: 'Categories',
            dataNameZh: '商品分類',
            totalDataAmount: 23,
            doneDataAmount: 20,
            changeSyncSrcSystem: true,
            createTime: dStr,
            updateTime: dStr,
            __subTable: DataCategoryEnum.productCategory,
        }, {
            recipe_id: '',
            platformType: PlatformTypeEnum.pos,
            srcSystem: 'shop002',
            schemaFormat: '商品資料',
            statusCode: '2',
            dataNameEn: 'Product',
            dataNameZh: '商品資料',
            totalDataAmount: 240,
            doneDataAmount: 22,
            changeSyncSrcSystem: true,
            createTime: dStr,
            updateTime: dStr,
            __subTable: DataCategoryEnum.productData,
        }, {
            recipe_id: '',
            platformType: PlatformTypeEnum.pos,
            srcSystem: 'shop002',
            schemaFormat: '分店門市',
            statusCode: '2',
            dataNameEn: 'Product',
            dataNameZh: '分店門市',
            totalDataAmount: 199,
            doneDataAmount: 19,
            changeSyncSrcSystem: true,
            createTime: dStr,
            updateTime: dStr,
            __subTable: DataCategoryEnum.branchShop,
        }];
    }

}

// TagDecisionCondition(標籤判斷條件)----------------------------------------------


export class TagDecisionConditionModel extends StateModel {
    data(initStateObj) {
        return {
            tagOptionList: [],
            tagOptionListLoading: false,
            matchDataOptionList: [],
            matchDataOptionListLoading: false,
            tagDecisionConditionT: initStateObj.tagDecisionConditionT,
            dataCollectionT: initStateObj.dataCollectionT,
        }
    }
}

export class DecisionRowModel extends ArrayElementModel {
    data(initConditionObj = {}) {
        // console.log('initConditionObj', initConditionObj);

        const [conditionShow, addButtonShow] = this.getRenderShow(initConditionObj.mode);

        return {
            fieldKey: '',
            mode: initConditionObj.mode,
            conditionShow: conditionShow,
            addButtonShow: addButtonShow,
        }
    }

    getRenderShow(mode) {
        let conditionShow = true;
        let addButtonShow = true;

        if (mode === DecisionRowModeEnum.condition) {
            conditionShow = true;
            addButtonShow = false;
        } else if (mode === DecisionRowModeEnum.addLast) {
            conditionShow = true;
            addButtonShow = true;
        } else if (mode === DecisionRowModeEnum.firstEmpty) {
            conditionShow = false;
            addButtonShow = true;
        }

        // console.log(`getRenderShow mode ${mode} `, [conditionShow, addButtonShow])

        return [conditionShow, addButtonShow];
    }
    // [public]
    setRenderMode(mode) {
        const [conditionShow, addButtonShow] = this.getRenderShow(mode);


        // console.log('setRenderMode', mode, conditionShow, addButtonShow)

        this.setState('mode', mode);
        this.setState('conditionShow', conditionShow);
        this.setState('addButtonShow', addButtonShow);
    }
}

export class TagDecisionBlockModel extends ArrayElementModel { // StateModel
    control = null; // <TagDecisionBlockFlow>
    data(initObj = {}) {
        // console.log('TagDecisionBlockModel initObj', initObj);

        const tagDecisionConditionT = initObj.tagDecisionConditionT;
        const dataCollectionT = initObj.dataCollectionT;
        return {
            tagDecisionConditionT: tagDecisionConditionT, // 標籤判斷條件頁翻譯
            dataCollectionT: dataCollectionT, // 數據集翻譯
            tagBlockItem: null, // 儲存初始化的整包資料
            // tagName: '',
            tagId: initObj.tagId || '',
            hasModify: initObj.hasModify || false,
            // tag--------------------------
            tagTimeField: '', // 標籤條件>時間欄位(用來選取要用的時間)
            tagTimeFieldOptionList: [],
            // field--------------------------
            matchData: '', // 匹配資料
            fieldTimeField: '', // 欄位條件>時間欄位
            fieldTimeFieldOptionList: [],
            fieldTimeFieldOptionListLoading: false,
            fieldTimeFieldOperator: 'under', // 時間運算子
            fieldTimeFieldOperatorOptionList: [{
                label: '<=',
                value: 'under'
            }, {
                label: '>',
                value: 'over'
            }],
            fieldTimeFieldUnitValue: 0, // 單位時間數值f
            fieldTimeFieldUnitType: 'day', // 時間單位
            fieldTimeFieldUnitTypeOptionList: [{
                label: tagDecisionConditionT('day'),
                value: 'day'
            }, {
                label: tagDecisionConditionT('hour'),
                value: 'hour'
            }],
            // decisionRowList: new ListModel([new DecisionRowModel({ conditionShow: 'none', addButtonShow: false }), new DecisionRowModel()]), // 欄位判斷條件列表
            // decisionRowList: new ListModel([new DecisionRowModel({ conditionShow: false, addButtonShow: true })]), // 欄位判斷條件列表
            decisionRowList: new ListModel([new DecisionRowModel({ mode: DecisionRowModeEnum.firstEmpty })]), // 欄位判斷條件列表
            fieldFieldOptionList: [],
            fieldFieldOptionListLoading: false,
        };
    }
    initTagDecisionBlockModel(tagBlockItem) {
        console.log('initTagDecisionBlockModel', tagBlockItem);
        // this.setState('tagName', tagBlockItem.tagName);


        this.setState('tagBlockItem', Object({}, tagBlockItem));

        // 設定標籤名稱的下拉框數值
        this.setState('tagId', tagBlockItem.tagId);
    }
    registTagDecisionBlockFlow(control) {
        if (!(control instanceof TagDecisionBlockFlow)) {
            console.error(`registTagDecisionBlockFlow: control is invalid`);
            return;
        }
        this.control = control;
    }
    getControl() {
        return this.control;
    }
}

// [以上沒用到]

// 標籤列表---------------------------------------------------------------

export class TagListTableModel extends StateModel {
    data(initObj = {}) {

        const t = initObj.t || (val => val);

        let dateFilter = new TimeFilter('date', '-');
        let dateTimeFilter = new TimeFilter('time', '-');

        const baseWidth = '80px';

        return {
            tableHeader: new TableHeader({
                rowSelect: {
                    mode: 'singleSelect', // 代表只能單選
                },
                // headerExtra: [{ // 額外要載入的欄位
                //     key: 'priceIntervalId',
                //     fetch: 'id',
                // }],
                buttonColumn: {
                    tagDecisionCondition: { // 標籤判斷條件
                        buttonItemList: [{
                            type: 'button',
                            label: t('view'), // '檢視',
                            event: 'viewTagDecisionCondition',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                },
                header: [{
                    label: '',
                    key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                    type: 'checkBox',
                    mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
                }, {
                    label: 'ID',
                    key: 'id',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('openOrClose'), // 開放/關閉
                    key: 'tagEnable',
                    type: 'toggleSwitch',
                    width: baseWidth,
                }, {
                    label: t('tagDecisionCondition'),
                    key: 'tagDecisionCondition',
                    type: 'buttonColumn',
                    width: '140px',
                }, {
                    label: t('tagNameZh'), // 標籤名稱(中)
                    key: 'tagNameZh',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagCategoryZh'), // 標籤分類(中)
                    key: 'tagCategoryZh',
                    type: 'text',
                    width: baseWidth,
                    // }, {
                    //     label: t('tagCategoryEn'), // 標籤分類(英)
                    //     key: 'tagCategoryEn',
                    //     type: 'text',
                    //     width: baseWidth,
                }, {
                    label: t('taggedPersonNumNotBlocked'), // 標註人數(未封鎖)
                    key: 'taggedPersonNumNotBlocked',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('taggedPersonNumBlocked'), // 標註人數(已封鎖)
                    key: 'taggedPersonNumBlocked',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('createDate'), // 創建日期
                    key: 'createDate',
                    type: 'text',
                    width: baseWidth,
                    filter: dateFilter,
                }, {
                    label: t('updateDate'), // 更新日期
                    key: 'updateDate',
                    type: 'text',
                    width: baseWidth,
                    filter: dateFilter,
                }],
            }),
        };
    }
    getSampleTableData() {
        const dStr = new Date().toISOString();
        return [{
            id: '001',
            tagEnable: true,
            tagNameZh: '男',
            tagCategoryZh: '性別',
            taggedPersonNumNotBlocked: '4302',
            taggedPersonNumBlocked: '430',
            createDate: dStr,
            updateDate: dStr
        }, {
            id: '002',
            tagEnable: true,
            tagNameZh: '皮靴',
            tagCategoryZh: '產品分類',
            taggedPersonNumNotBlocked: '240',
            taggedPersonNumBlocked: '40',
            createDate: dStr,
            updateDate: dStr
        }, {
            id: '003',
            tagEnable: true,
            tagNameZh: 'S1沉睡客戶',
            tagCategoryZh: 'NES會員分類',
            taggedPersonNumNotBlocked: '6300',
            taggedPersonNumBlocked: '1610',
            createDate: dStr,
            updateDate: dStr
        }];
    }
}

export class TagCreateModel extends StateModel {
    data() {
        return {
            tagCategoryId: '',
            tagCategoryRow: null,
            tagCategoryName: '',
            tagNameZh: '',
            tagNameEn: '',
            describe: '',
        }
    }
    getCreateInfo() {
        return {
            tagCategoryId: this.getState('tagCategoryId'),
            tagNameZh: this.getState('tagNameZh'),
            tagNameEn: this.getState('tagNameEn'),
            describe: this.getState('describe'),
        };
    }
}

export class TagCategorySelectModel extends StateModel {
    data(initObj = { t: val => val }) {

        const t = initObj.t;

        const baseWidth = '80px';
        return {
            tableHeader: new TableHeader({
                buttonColumn: {
                    action: { // <key> ==> 'action'
                        buttonItemList: [{
                            type: 'button',
                            label: t('select'),
                            event: 'select',
                            buttonType: 'fill',
                            buttonMode: 'default',
                            buttonPattern: 'buttonColumn',
                        }],
                    },
                },
                header: [{
                    label: 'ID',
                    key: 'id',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagCategoryZh'), // 標籤分類(中)
                    key: 'tagCategoryZh',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagCategoryEn'), // 標籤分類(英)
                    key: 'tagCategoryEn',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('schemaNameZh'), // 資料表名稱(中)
                    key: 'schemaNameZh',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('schemaNameEn'), // 資料表名稱(英)
                    key: 'schemaNameEn',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('action'), // 操作
                    key: 'action',
                    type: 'buttonColumn',
                    width: '193px', // 193
                }],
            }),
            loading: true,
        }
    }
    getSampleTableData() {
        const dStr = new Date().toISOString();
        return [{
            id: 'c01',
        }, {
            id: 'c02',
        }, {
            id: 'c03',
        }];
    }
}

export class TagConditionTableModel extends StateModel {
    data(initObj = {}) {

        const t = initObj.t || (val => val);

        let dateFilter = new TimeFilter('date', '-');
        let dateTimeFilter = new TimeFilter('time', '-');

        const baseWidth = '80px';

        return {
            tableHeader: new TableHeader({
                rowSelect: {
                    mode: 'singleSelect', // 代表只能單選
                },
                // buttonColumn: {
                //     tagDecisionCondition: { // 標籤判斷條件
                //         buttonItemList: [{
                //             type: 'button',
                //             label: t('view'), // '檢視',
                //             event: 'viewTagDecisionCondition',
                //             buttonType: 'fill',
                //             buttonMode: 'default',
                //             buttonPattern: 'buttonColumn',
                //         }],
                //     },
                // },
                header: [{
                    label: '',
                    key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
                    type: 'checkBox',
                    mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
                }, {
                    label: 'ID',
                    key: 'id',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagId'), // 標籤ID
                    key: 'tagId',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('tagName'), // 標籤名稱
                    key: 'tagName',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('calculateLogic'), // 運算邏輯
                    key: 'logic',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('conditionType'), // 條件類型: 標籤條件、欄位條件、篩出筆數
                    key: 'conditionType',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('matchData'), // 匹配資料 (欄位條件)
                    key: 'matchData',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('fieldName'), // 欄位名稱 (欄位條件)
                    key: 'fieldName',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('fieldKey'), // 欄位key (欄位條件)
                    key: 'fieldKey',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('fieldType'), // 欄位型態 (欄位條件)
                    key: 'fieldType',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('matchTagId'), // 匹配標籤ID (標籤條件)
                    key: 'matchTagId',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('matchTagName'), // 匹配標籤名稱 (標籤條件)
                    key: 'matchTagName',
                    type: 'text',
                    width: baseWidth,
                }, { // -------------------------------------------------------------
                    label: t('operationType'), // 處理類型 >, <, ==
                    key: 'operationType',
                    type: 'text',
                    width: baseWidth,
                }, {
                    label: t('operationParam'), // 處理參數
                    key: 'operationParam',
                    type: 'text',
                    width: baseWidth,
                    // }, {
                    //     label: t('operationParamUnit'), // 參數單位 (欄位條件)
                    //     key: 'operationParamUnit',
                    //     type: 'text',
                    //     width: baseWidth,
                    // }, {
                    //     label: t('operationName'), // 處理名稱 (欄位條件) '大於'
                    //     key: 'operationName',
                    //     type: 'text',
                    //     width: baseWidth,
                }, {
                    label: t('calculationSort'), // 運算排序
                    key: 'sort',
                    type: 'text',
                    width: baseWidth,
                }],
            }),
            loading: true,
        };
    }
    getSampleTableData() {
        const dStr = new Date().toISOString();
        return [{
            id: '01',
            tagId: 'a01',
            tagName: '30日未購',
            logic: 'and',
            conditionType: ConditionTypeEnum.tag,
            matchData: DataCategoryEnum.memberData,
            fieldName: '會員ID',
            fieldKey: 'memberId',
            fieldType: ConditionFieldTypeEnum.string,
            matchTagId: 't01',
            matchTagName: '標籤1',
            operationType: 'equal',
            operationParam: '000001',
            sort: 1,
        }];
    }
}


export class TagConditionCreateModel extends StateModel {
    data(initObj = {}) {

        const dateUnitT = initObj.dateUnitT || (val => val);

        return {
            dataCollectionT: initObj.dataCollectionT || (val => val),
            // --------------------------------------------
            tagList: [],// 標籤列表
            logic: 'and', // 運算邏輯
            conditionType: ConditionTypeEnum.field,
            matchData: '',
            matchDataOptionList: [],
            matchDataOptionListLoading: false,
            // fieldName: '',
            fieldKey: '',
            fieldType: '', // 欄位型態: 會用來連動strParamHide, intParamHide...等等，會決定輸入的UI型態
            fieldSelectData: null,
            fieldItemList: [], // 撈出來的所有欄位資料
            fieldOptionList: [], // 篩選過後的optionList
            fieldOptionListLoading: false,

            // matchTagKey: '',
            // matchTagOptionList: [],
            // matchTagOptionListLoading: false,
            matchTagList: [], // 匹配標籤列表(單選，只會有一個元素)

            operationType: '', // 處理類型
            operationTypeOptionList: [],

            operationParamInt: '',
            operationParamStr: '',
            operationParamDate: '',
            operationParamPeriod: '',
            operationParamPeriodUnit: ParamDateUnitEnum.day,
            operationParamPeriodUnitOptionList: [{
                label: dateUnitT('day'),
                value: ParamDateUnitEnum.day,
            }, {
                label: dateUnitT('hour'),
                value: ParamDateUnitEnum.hour,
            }],

            sort: '',

            // 用來隱藏form項目的----------------------------
            fieldFormItemHide: false,
            matchTagFormItemHide: false,
            amountTagFormItemHide: false,

            strParamHide: false,
            intParamHide: false,
            dateParamHide: false,
            periodParamHide: false,
        }
    }

    getFormData() {

        const tagList = this.getState('tagList');
        const matchTagList = this.getState('matchTagList');

        return {
            tag: tagList[0],
            matchTag: matchTagList[0],
            logic: this.getState('logic'),
            conditionType: this.getState('conditionType'),
            matchData: this.getState('matchData'),
            fieldSelectData: this.getState('fieldSelectData'),
            operationType: this.getState('operationType'),
            operationParamInt: this.getState('operationParamInt'),
            operationParamStr: this.getState('operationParamStr'),
            operationParamDate: this.getState('operationParamDate'),
            operationParamPeriod: this.getState('operationParamPeriod'),
            operationParamPeriodUnit: this.getState('operationParamPeriodUnit'),
            sort: this.getState('sort'),
        }
    }

    changeParamShowType(paramType) {
        // paramType: <FieldTypeEnum>
        const vm = this;

        const paramTypeMap = {
            [FieldTypeEnum.string]: 'strParamHide', // <paramType> : <stateKey>
            [FieldTypeEnum.number]: 'intParamHide',
            [FieldTypeEnum.date]: 'dateParamHide',
            [FieldTypeEnum.period]: 'periodParamHide',
        };

        // 將其他不相干的參數型態都隱藏起來
        Object.keys(paramTypeMap).forEach((eachParamType) => {
            const stateKey = paramTypeMap[eachParamType];
            vm.setState(stateKey, eachParamType !== paramType);
        })
        // // 將其他不相干的參數型態都隱藏起來
        // stateModel.setState('strParamHide', true);
        // stateModel.setState('intParamHide', true);
        // stateModel.setState('dateParamHide', true);
        // stateModel.setState('periodParamHide', true);
    }
}
