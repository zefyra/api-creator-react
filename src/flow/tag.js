import Control from "control/Control";
import TableControl from "control/Table";
import DataCategoryEnum from "enum/dataCollection/DataCategory";
import { FieldTypeEnum } from "enum/dataCollection/FieldType";
import DecisionRowModeEnum from "enum/tag/DecisionRowModeEnum";
import { TagDecisionBlockEntity } from "factory/tag";
import { DecisionRowModel, ImportSchemaTableModel, TagCategorySelectModel, TagConditionCreateModel, TagConditionTableModel, TagCreateModel, TagDecisionBlockModel, UpperCategoryTableModel } from "fragment/Tag";
import { TableModalInterface } from "interface/TableModal";
import ListModel from "element/TagDecisionCondition/ListModel";
import TableData from "util/TableData";
import { getSchemaFieldListSample } from "./getSchemaFieldListSample";
import Modal from "component/Modal";
import ConditionTypeEnum from "enum/tag/ConditionTypeEnum";
import OperationTypeEnum from "enum/tag/OperationType";

export class TagCategoryTableFlow extends TableControl {
    stateModel = null;
    // createModalRef = null;

    constructor(stateRef, header, stateModel) {
        super(stateRef, header);
        if (!stateModel) {
            console.error(`TagCategoryTableFlow constructor: stateModel not exist`);
            return;
        }
        this.stateModel = stateModel;
    }

    circuit() {
        return {
            tagCategoryAdd: true,
        }
    }

    // // 取得新增Modal的ref
    // bindCreateModalRef(ref) {
    //     // this.createModalRef = ref;
    // }

    bindMount() {
        return super.bindMount(this.loadTagCategory);
    }

    loadTagCategory(newPage = 1, unlock = () => { }) {
        const vm = this;

        // console.log(`loadTagCategory`, this.stateModel.getSampleTableData());

        const newTable = new TableData({
            data: this.stateModel.getSampleTableData(),
        }, 'default', vm.getTableHeader());

        vm.refreshTableData(newTable);

        return Promise.resolve();
    }

    // 新增標籤類別
    onTagCategoryCreateOpen() {
        // if (this.createModalRef) {
        //     this.createModalRef.openModal();
        // }
        this.fetchControl('tagCategoryAdd').onOpenModal();
    }
    // 修改
    onTagCategoryEditOpen() {
        console.log(`onTagCategoryEditOpen`);
    }
    // 刪除
    onTagCategoryDelete() {
        console.log(`onTagCategoryDelete`);
    }
    // // 標籤判斷條件檢視
    // onViewTagDecisionCondition() {

    // }
}

// const { t: dataCollectionT } = useTranslation('dataCollection');
const getMebmerDataHeaderList = function (t) {
    const memberDataHeaderList = [{
        //     label: '',
        //     key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
        //     type: 'checkBox',
        //     mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
        // }, {
        label: 'key',
        key: 'key',
        type: 'text',
        width: '100px',
    }, {
        label: t('memberData.memberId'), // 會員ID
        key: 'memberId',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.lastName'), // 姓氏
        key: 'lastName',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.firstName'), // 名子
        key: 'firstName',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.memberRank'), // 會員層級
        key: 'memberRank',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.sex'), // 性別
        key: 'sex',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.birthday'), // 生日
        key: 'birthday',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.identityNumber'), // 身分證字號
        key: 'identityNumber',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.account'), // 帳號
        key: 'account',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.gatewayUid'), // 渠道UID
        key: 'gatewayUid',
        type: 'buttonColumn',
        width: '160px',
    }, {
        label: t('memberData.emailArray'), // E-mail陣列
        key: 'emailArray',
        type: 'buttonColumn',
        width: '160px',
    }, {
        label: t('memberData.addressArray'), // 地址陣列
        key: 'addressArray',
        type: 'buttonColumn',
        width: '160px',
    }, {
        label: t('memberData.phoneArray'), // 電話陣列
        key: 'phoneArray',
        type: 'buttonColumn',
        width: '160px',
    }, {
        label: t('memberData.job'), // 職業
        key: 'job',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.family'), // 家庭成員
        key: 'family',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.registDate'), // 註冊日期
        key: 'registDate',
        type: 'text',
        width: '160px',
    }, {
        label: t('memberData.lastLoginDate'), // 最後登入日期
        key: 'lastLoginDate',
        type: 'text',
        width: '160px',
    }];

    return memberDataHeaderList;
}

export class TagCategoryAddFlow extends Control {
    stateModel = null;

    createModalRef = null;
    upperCategoryModalRef = null;
    importSchemaModalRef = null;

    tMap = {};
    registTranslation(key, t) {
        this.tMap[key] = t;
    }
    getTranslation(key) {
        return this.tMap[key];
    }

    // 取得新增Modal的ref
    bindCreateModalRef(ref) {
        // console.log('bindCreateModalRef')
        this.createModalRef = ref;
    }
    // 取得上層類別Modal的ref
    bindUpperCategoryModalRef(ref) {
        // this.modalRef = ref;
        this.upperCategoryModalRef = ref;

        // 連帶綁定UpperCategoryTableFlow的modalRef
        this.fetchControl('upperCategory').bindModalRef(ref);
    }
    bindImportSchemaModalRef(ref) {
        this.importSchemaModalRef = ref;
        // 連帶綁定UpperCategoryTableFlow的modalRef
        this.fetchControl('importSchema').bindModalRef(ref);
    }

    circuit() {
        return {
            upperCategory: true,
            importSchema: true,
        }
    }

    constructor(stateModel) {
        super();
        if (!stateModel) {
            console.error(`TagCategoryAddFlow constructor: stateModel not exist`);
            return;
        }
        this.stateModel = stateModel;
    }

    bindModelRef(ref) {
        this.importSchemaModalRef = ref;
        // 連帶綁定UpperCategoryTableFlow的modalRef
        this.fetchControl('importSchema').bindModalRef(ref);
    }

    onOpenModal() {
        // console.log(`create onOpenModal`)

        if (this.createModalRef) {
            this.createModalRef.openModal();
        }

        this.loadIndustryList();
    }

    // categoryButton按下按鈕: 要開啟選擇上級類別的燈箱
    onUpperCategoryModalOpen() {
        // console.log('onInputButtonRowClick aaaa');

        // this.stateModel.setState('upperCategory', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

        // this.fetchControl('upperCategory');
        if (this.upperCategoryModalRef) {
            this.upperCategoryModalRef.openModal();
        }
    }
    // 加入選取的upperCategory: 由UpperCategoryTableFlow呼叫
    addInTagUpperCategory(cellInfo) {
        const row = cellInfo.getRow();
        // console.log('addInTagUpperCategory', row);

        this.stateModel.setState('upperCategory', row.tagCategoryZh);
        this.stateModel.setState('upperCategoryRow', row);
        if (this.upperCategoryModalRef) {
            this.upperCategoryModalRef.closeModal();
        }
    }
    onImportSchemaModalOpen() {
        console.log('onImportSchemaModalOpen');
        if (this.importSchemaModalRef) {
            this.importSchemaModalRef.openModal();
        }
    }
    // 加入【匯入資料表】選取的資料表
    addInImportSchema(cellInfo) {
        const row = cellInfo.getRow();
        console.log('addInImportSchema', row)
        this.stateModel.setState('importSchema', row.dataNameZh);
        this.stateModel.setState('importSchemaRow', row);
        if (this.importSchemaModalRef) {
            this.importSchemaModalRef.closeModal();
        }
        this.loadSchemaFieldOptionList(cellInfo);
    }
    loadSchemaFieldOptionList(cellInfo) {
        const row = cellInfo.getRow();

        this.stateModel.setState('schemaFieldOptionListLoading', true);

        const vm = this;
        setTimeout(function () {
            const schemaFieldOptionList = getMebmerDataHeaderList(vm.getTranslation('dataCollection')).map((header) => {
                return {
                    label: header.label,
                    value: header.key,
                };
            });
            vm.stateModel.setState('schemaFieldOptionList', schemaFieldOptionList);
            vm.stateModel.setState('schemaFieldOptionListLoading', false);
        }, 2000);
    }

    loadIndustryList() {
        const vm = this;
        this.stateModel.setState('applyIndustryLoading', true);

        setTimeout(function () {
            // vm.stateModel.setState('applyIndustry', '1');

            vm.stateModel.setState('applyIndustryOptionList', [{
                label: '餐飲',
                value: '1',
            }, {
                label: '百貨',
                value: '2',
            }, {
                label: '零售',
                value: '3',
            }]);
            vm.stateModel.setState('applyIndustryLoading', false);
        }, 2000);
    }
    // 依指定產業
    onApplyIndustryChanged(val) {
        // console.log('onApplyIndustryChanged', val)
        this.stateModel.setState('applyIndustry', val);
    }

    onApplyUserChanged(val) {
        // console.log('onApplyUserChanged', val);
        this.stateModel.setState('applyUser', val);
    }

    onTagDecisionConditionOpen() {
        console.log('onTagDecisionConditionOpen');
    }

    // 底部的「取消」按鈕
    onCancelAdd() {
        if (this.createModalRef) {
            this.createModalRef.closeModal();
        }
    }
    // 底部的「確認」按鈕
    onConfirmAdd() {
        console.log('onConfirmAdd', this.stateModel.getModalConfirmState())

        if (this.createModalRef) {
            // console.log('onConfirmAdd upperCategoryModalRef', this.upperCategoryModalRef)
            // console.log('closeModal', this.upperCategoryModalRef.closeModal)
            this.createModalRef.closeModal();
        }
    }
}

export class UpperCategoryTableFlow extends TableModalInterface {
    // super(stateRef, header);
    modalRef = null;

    stateModel = null; // <UpperCategoryTableModel>

    constructor(stateRef, header, stateModel) {
        super(stateRef, header);
        if (!stateModel) {
            console.error(`TagCategoryTableFlow constructor: stateModel not exist`);
            return;
        }
        if (!(stateModel instanceof UpperCategoryTableModel)) {
            console.error(`TagCategoryTableFlow constructor: stateModel type error`);
            return;
        }
        this.stateModel = stateModel;
    }

    circuit() {
        return {
            tagCategoryAdd: true,
        };
    }

    // bindMount() {
    //     return super.bindMount(this.loadTagCategory);
    // }

    loadTagCategory(newPage = 1, unlock = () => { }) {
        // console.log('loadTagCategory');

        this.stateModel.setState('loading', true);

        const vm = this;
        setTimeout(function () {
            const upperCategoryTable = new TableData({ data: vm.stateModel.getSampleTableData() }, 'default', vm.getTableHeader())
            vm.refreshTableData(upperCategoryTable);

            vm.stateModel.setState('loading', false);
        }, 3000);

        return Promise.resolve();
    }

    onModalOpen() {
        this.loadTagCategory();
    }

    // 取得新增Modal的ref
    bindModalRef(ref) {
        // console.log(`UpperCategoryTableFlow bindModalRef`, ref);
        this.modalRef = ref;
    }
    onPageChange() {

    }
    onButtonClick(event, cellInfo) {
        // console.log(`onButtonClick`, event, cellInfo)

        if (event === 'addIn') {
            this.fetchControl('tagCategoryAdd').addInTagUpperCategory(cellInfo);
        }
    }
}

export class ImportSchemaTableFlow extends TableModalInterface {
    // super(stateRef, header);
    modalRef = null;

    stateModel = null; // <ImportSchemaTableModel>

    constructor(stateRef, header, stateModel) {
        super(stateRef, header);
        if (!stateModel) {
            console.error(`importSchemaTableFlow constructor: stateModel not exist`);
            return;
        }
        if (!(stateModel instanceof ImportSchemaTableModel)) {
            console.error(`importSchemaTableFlow constructor: stateModel type error`);
            return;
        }
        this.stateModel = stateModel;
    }

    circuit() {
        return {
            tagCategoryAdd: true,
        };
    }

    loadSchema(newPage = 1, unlock = () => { }) {
        // console.log('loadTagCategory');

        this.stateModel.setState('loading', true);

        const vm = this;
        setTimeout(function () {
            const importSchemaTable = new TableData({ data: vm.stateModel.getSampleTableData() }, 'default', vm.getTableHeader())
            vm.refreshTableData(importSchemaTable);

            vm.stateModel.setState('loading', false);
        }, 2000);

        return Promise.resolve();
    }

    onModalOpen() {
        this.loadSchema();
    }

    // 取得新增Modal的ref
    bindModalRef(ref) {
        // console.log(`Flow bindModalRef`, ref);
        this.modalRef = ref;
    }
    onPageChange() {

    }
    onButtonClick(event, cellInfo) {
        // console.log(`onButtonClick`, event, cellInfo)

        if (event === 'addIn') {
            // this.fetchControl('tagCategoryAdd').addInTagUpperCategory(cellInfo);
            this.fetchControl('tagCategoryAdd').addInImportSchema(cellInfo);
        }
    }
}

// [此頁已廢棄]TagDecisionCondition(標籤判斷條件)----------------------------------------------

export class TagDecisionConditionFlow extends Control {
    stateModel = null; // <TagDecisionConditionModel>

    tagArrayModel = null;

    constructor(stateModel, tagArrayModel) {
        super();
        if (!stateModel) {
            console.error(`TagDecisionConditionFlow constructor: stateModel not exist`);
            return;
        }
        this.stateModel = stateModel;

        this.tagArrayModel = tagArrayModel;
    }

    // 頁面初始化
    onTagDecisionConditionPageMount(urlQueryObj) {
        const vm = this;
        console.log(`initTagDecisionBlockList urlQueryObj`, urlQueryObj)
        /* urlQueryObj: {
            id: <TagCategoryId>
        } */

        // 載入所有tag的判斷設定
        // console.log('initTagDecisionBlockList', tagCategoryRow, tagCategoryOriginRow)
        setTimeout(function () {

            // 這個陣列內的元素，會傳給TagDecisionBlockModel.initTagDecisionBlockModel

            // vm.stateModel.setState('tagBlockList', [{
            //     tagName: '30日未購',
            //     tagId: '1',
            //     tagConfigId: '501', // tag設定檔的ID
            // }, {
            //     tagName: '60日未購',
            //     tagId: '2',
            //     tagConfigId: '502',
            // }]);

            vm.tagArrayModel.setArray([{
                tagName: '30日未購',
                tagId: '1',
                tagConfigId: '501', // tag設定檔的ID
                hasModify: false,
            }, {
                tagName: '60日未購',
                tagId: '2',
                tagConfigId: '502',
                hasModify: false,
            }].map((stateData) => {
                return new TagDecisionBlockEntity(vm.stateModel, stateData).getModel();
            }));
        }, 500);


        this.stateModel.setState('tagOptionListLoading', true);
        // 載入該標籤類別底下所有標籤，轉成<Select>用的optionList
        setTimeout(function () {
            vm.stateModel.setState('tagOptionList', [{
                label: '30日未購',
                value: '1', // <tagId>
            }, {
                label: '60日未購',
                value: '2',
            }, {
                label: '90日未購',
                value: '3',
            }]);

            vm.stateModel.setState('tagOptionListLoading', false);
        }, 2000);

        vm.stateModel.setState('matchDataOptionListLoading', true);
        // 載入匹配數據表單的optionList
        setTimeout(function () {

            vm.stateModel.setState('matchDataOptionList', [{
                label: '交易紀錄',
                value: DataCategoryEnum.transactionLog,
            }, {
                label: '會員資料',
                value: DataCategoryEnum.memberData,
            }, {
                label: '商品分類',
                value: DataCategoryEnum.productCategory,
            }, {
                label: '商品資料',
                value: DataCategoryEnum.productData,
            }, {
                label: '分店門市',
                value: DataCategoryEnum.branchShop,
            }]);

            vm.stateModel.setState('matchDataOptionListLoading', false);
        }, 3000);
    }

    // 新增標籤判斷
    onAddTagDecisionCondition() {
        if (!this.tagArrayModel) {
            console.error(`this.tagArrayModel not exist`)
            return;
        }
        // 將元素加在陣列開頭
        this.tagArrayModel.unshift(new TagDecisionBlockEntity(this.stateModel, {
            tagName: '',
            tagId: '',
            tagConfigId: '',
            hasModify: true,
        }).getModel());
    }

}

export class TagDecisionBlockFlow extends Control {
    frame() {
        return {
            tagDecision: true,
        }
    }
    // circuit() {
    //     return {
    //         parent: true, // <TagDecisionConditionModel>
    //     }
    // }
    filtOptionList(fieldList, ...fieldTypeList) {

        const fieldTypeMap = {};
        fieldTypeList.forEach((fieldType) => {
            fieldTypeMap[fieldType] = true;
        });

        const dateFieldList = fieldList.filter((fieldItem) => {
            return fieldTypeMap[fieldItem.__fieldType] === true;
            // return fieldItem.__fieldType === 'date';
        });
        return dateFieldList.map((dateField) => {
            return {
                label: dateField.label,
                value: dateField.key,
            };
        });
    }
    // 匹配資料，選項異動時
    onMatchDataChanged(matchDataType) {
        console.log(`onMatchDataChanged`, matchDataType);

        this.fetchModel('tagDecision').setState('fieldFieldOptionListLoading', true);
        this.fetchModel('tagDecision').setState('fieldTimeFieldOptionListLoading', true);

        // 載入該類型表單的欄位資料
        const vm = this;
        setTimeout(function () {

            const fieldList = getSchemaFieldListSample(matchDataType,
                vm.fetchModel('tagDecision').getState('dataCollectionT'));

            const normalOptionList = vm.filtOptionList(fieldList, FieldTypeEnum.string, FieldTypeEnum.number);
            console.log('normalOptionList', normalOptionList)
            vm.fetchModel('tagDecision').setState('fieldFieldOptionList', normalOptionList);


            // 篩出__fieldType為 'date' 格式的資料，轉成optionList
            const dateOptionList = vm.filtOptionList(fieldList, FieldTypeEnum.date);

            let initFieldTimeField = dateOptionList.length !== 0 ? dateOptionList[0].value : '';
            vm.fetchModel('tagDecision').setState('fieldTimeField', initFieldTimeField);
            vm.fetchModel('tagDecision').setState('fieldTimeFieldOptionList', dateOptionList);


            vm.fetchModel('tagDecision').setState('fieldFieldOptionListLoading', false);
            vm.fetchModel('tagDecision').setState('fieldTimeFieldOptionListLoading', false);
        }, 1000);
    }
    onAddCondition() {
        const tagDecisionModel = this.fetchModel('tagDecision');

        let decisionRowListModel = tagDecisionModel.getState('decisionRowList');
        let decisionRowList = decisionRowListModel.getState('array');
        if (decisionRowList.length === 0) {
            // 至少會有一個只有AddButton的元素
            console.error(`onAddCondition: decisionRowList len is 0`);
            return;
        }

        if (decisionRowList.length === 1) {
            const firstCondition = decisionRowList[0]
            if (firstCondition.getState('mode') === DecisionRowModeEnum.firstEmpty) {
                firstCondition.setRenderMode(DecisionRowModeEnum.addLast);
                return;
            }
        }

        // 先全部設成 'condition' 模式
        decisionRowListModel.forEach((decisionRowModel, index, arr) => {
            decisionRowModel.setRenderMode(DecisionRowModeEnum.condition);
        });

        decisionRowListModel.push(new DecisionRowModel({ mode: DecisionRowModeEnum.addLast }));
    }
    onRemoveCondition(index) {
        let decisionRowListModel = this.fetchModel('tagDecision').getState('decisionRowList');
        decisionRowListModel.remove(index);

        // 將最後一個元素轉成addLast
        let lastIndex = decisionRowListModel.length - 1;
        // if ( index === )

        console.log('rev lastIndex', lastIndex)

        let lastDecisionRowModel = decisionRowListModel.get(lastIndex);
        if (!lastDecisionRowModel) {
            return console.error(`onRemoveCondition: lastDecisionRowModel not exist`);
        }
        lastDecisionRowModel.setRenderMode(DecisionRowModeEnum.addLast);
    }
}

// end of [此頁已廢棄]TagDecisionCondition(標籤判斷條件)----------------------------------------------

// 標籤列表----------------------------------------------------


export class TagListTableFlow extends TableControl {
    stateModel = null;
    createModelRef = null;

    constructor(stateRef, header, stateModel) {
        super(stateRef, header);
        if (!stateModel) {
            console.error(`TagListTableFlow constructor: stateModel not exist`);
            return;
        }
        this.stateModel = stateModel;
    }

    circuit() {
        return {
            tagCreate: true,
        }
    }

    // bindCreateModalRef(createModelRef) {
    //     this.createModelRef = createModelRef;
    // }


    bindMount() {
        return super.bindMount(this.loadTagList);
    }

    loadTagList(newPage = 1, unlock = () => { }) {
        const vm = this;

        // console.log(`loadTagCategory`, this.stateModel.getSampleTableData());

        const newTable = new TableData({
            data: this.stateModel.getSampleTableData(),
        }, 'default', vm.getTableHeader());

        vm.refreshTableData(newTable);

        return Promise.resolve();
    }

    onTagCreateOpen() {
        console.log('onTagCreateOpen')
        this.fetchControl('tagCreate').onTagCreateModalOpen();
    }
    onTagEditOpen() {
        console.log('onTagEditOpen')
    }
    onTagDelete() {
        console.log('onTagDelete')
    }
    onGetTagListAgain() {
        console.log('onGetTagListAgain')
    }

    onToggleButtonChange(type, val) {
        // type: 'line'
        // val: true
        console.log('onToggleButtonChange', type, val)
    }
}

export class TagCreateFlow extends Control {
    ref() {
        return {
            tagCreateModal: Modal.name,
        }
    }
    frame() {
        return {
            stateModel: TagCreateModel.name,
        }
    }
    circuit() {
        return {
            tagCategorySelect: TagCategorySelectFlow.name,
        }
    }

    // 開啟新增標籤燈箱
    onTagCreateModalOpen() {
        // console.log('onTagCreateModalOpen')

        this.fetchRefSafe('tagCreateModal', tagCreateModalRef => tagCreateModalRef.openModal());
    }
    // 開啟標籤類別選擇燈箱
    onTagCategoryModalOpen() {
        // console.log(`onTagCategoryModalOpen: ${this.fetchControl('tagCategorySelect').constructor.name}`)
        this.fetchControl('tagCategorySelect').openModal();
    }

    // 選取標籤類別
    onSelectTagCategory(cellInfo) {
        // console.log('onSelectTagCategory', cellInfo);
        const tagCategoryRow = cellInfo.getRow();

        this.fetchModel('stateModel').setState('tagCategoryName', tagCategoryRow.tagCategoryZh);
        this.fetchModel('stateModel').setState('tagCategoryId', tagCategoryRow.id);
        this.fetchModel('stateModel').setState('tagCategoryRow', tagCategoryRow);

        this.fetchControl('tagCategorySelect').closeModal();
    }

    onCancelAdd() {
        this.fetchRef('tagCreateModal').closeModal();
    }
    onConfirmAdd() {
        console.log('getCreateInfo', this.fetchModel('stateModel').getCreateInfo());

        this.fetchRef('tagCreateModal').closeModal();
    }
}



export class TagCategorySelectFlow extends TableModalInterface {

    ref() {
        return {
            selectTagCategory: Modal.name,
        }
    }
    frame() {
        return {
            stateModel: TagCategorySelectModel.name,
        }
    }
    circuit() {
        return {
            tagCreate: TagCreateFlow.name,
        }
    }

    loadTagCategory(newPage = 1, unlock = () => { }) {
        // console.log('loadTagCategory');

        this.fetchModel('stateModel').setState('loading', true);

        const vm = this;
        setTimeout(function () {
            const tagCategoryTable = new TableData({ data: vm.fetchModel('stateModel').getSampleTableData() }, 'default', vm.getTableHeader())
            vm.refreshTableData(tagCategoryTable);

            vm.fetchModel('stateModel').setState('loading', false);
        }, 3000);

        return Promise.resolve();
    }

    // [public] 外部呼叫開啟燈箱
    openModal() {
        // console.log(`TagCategorySelectFlow openModal`);

        this.fetchRef('selectTagCategory').openModal();
    }

    // [public] 外部呼叫關閉燈箱
    closeModal() {
        this.fetchRef('selectTagCategory').closeModal();
    }

    // 燈箱開啟時的事件
    onModalOpen() {
        console.log(`TagCategorySelectFlow onModalOpen`);

        this.loadTagCategory();
    }
    onPageChange() {

    }
    onButtonClick(event, cellInfo) {
        // console.log(`onButtonClick`, event, cellInfo)

        if (event === 'select') {
            this.fetchControl('tagCreate').onSelectTagCategory(cellInfo);
        }
    }
}


// TagConditionList 標籤條件列表----------------------------------------------------

export class TagConditionTableFlow extends TableControl {

    constructor(stateRef, stateModel) {
        if (!stateModel) {
            console.error(`TagConditionTableFlow constructor: stateModel not exist`);
            return;
        }
        super(stateRef, stateModel.getState('tableHeader'));

        this.registModel('stateModel', stateModel);
    }

    frame() {
        return {
            stateModel: TagConditionTableModel.name,
        }
    }

    circuit() {
        return {
            conditionCreate: TagConditionCreateFlow.name,
        }
    }

    bindMount(urlQueryObj) {

        console.log(`TagConditionTableFlow bindMount urlQueryObj`, urlQueryObj)
        /* urlQueryObj: {
            id: <TagId>
        } */

        // console.log(`type`, typeof urlQueryObj.id);

        return super.bindMount(this.loadTagCondition);
    }

    loadTagCondition(newPage = 1, unlock = () => { }) {
        const vm = this;

        vm.fetchModel('stateModel').setState('loading', true);

        setTimeout(function () {
            const newTable = new TableData({
                data: vm.fetchModel('stateModel').getSampleTableData(),
            }, 'default', vm.getTableHeader());

            vm.refreshTableData(newTable);

            vm.fetchModel('stateModel').setState('loading', false);
        }, 1000);

        return Promise.resolve();
    }

    // 新增: 開啟Modal
    onTagConditionCreateOpen() {
        this.fetchControl('conditionCreate').openModal();
    }
    // 編輯: 開啟Modal
    onTagConditionEditOpen() {

    }

    // 刪除
    onTagConditionDelete() {

    }

    // 重新取得
    onGetTagConditionAgain() {

    }
}


export class TagConditionCreateFlow extends Control {

    constructor(stateModel) {
        super();
        this.registModel('stateModel', stateModel);
    }

    ref() {
        return {
            conditionCreateModal: Modal.name,
        }
    }
    frame() {
        return {
            stateModel: TagConditionCreateModel.name,
        }
    }

    // event------------------------------------------------

    openModal() {
        this.fetchRef('conditionCreateModal').openModal();
    }

    // 條件類型欄位異動
    onConditionTypeChange() {
        const conditionType = this.fetchModel('stateModel').getState('conditionType');
        console.log('onConditionTypeChange', conditionType);

        const stateModel = this.fetchModel('stateModel');

        // 異動時，會把下面所有表單項目都清空
        if (conditionType === ConditionTypeEnum.field) {
            // 該類型的form項目顯示、其他隱藏
            stateModel.setState('fieldFormItemHide', false);
            stateModel.setState('matchTagFormItemHide', true);
            stateModel.setState('amountTagFormItemHide', true);

            // 載入匹配資料OptionList
            this.loadMatchDataOptionList();

            this.loadOperationTypeOptionList('none');


        } else if (conditionType === ConditionTypeEnum.amount) {

            // 該類型的form項目顯示、其他隱藏
            stateModel.setState('fieldFormItemHide', true);
            stateModel.setState('matchTagFormItemHide', true);
            stateModel.setState('amountTagFormItemHide', false);

            // 載入處理類型optionList
            this.loadOperationTypeOptionList(ConditionTypeEnum.amount);

            // 設定套用標籤預設設定 「大於等於 1」
            stateModel.setState('operationType', OperationTypeEnum.number.gte);
            stateModel.setState('operationParamInt', 1);
        } else if (conditionType === ConditionTypeEnum.tag) {

            // 該類型的form項目顯示、其他隱藏
            stateModel.setState('fieldFormItemHide', true);
            stateModel.setState('matchTagFormItemHide', false);
            stateModel.setState('amountTagFormItemHide', true);

            this.loadOperationTypeOptionList(ConditionTypeEnum.tag);

            // 設定套用標籤預設設定 「大於等於 1」
            stateModel.setState('operationType', OperationTypeEnum.number.gte);
            stateModel.setState('operationParamInt', 1);
        }

        // const stateModel = this.fetchModel('stateModel');

        // 除了選到的
        // .clearConditionTypeFormItem(conditionType);
        // stateModel.clearConditionTypeAll();

    }

    // 匹配資料異動
    onMatchDataChange() {
        console.log('onMatchDataChange', this.fetchModel('stateModel').getState('matchData'));

        // 載入資料欄位optionList
        this.loadFieldOptionList();
    }

    // 欄位選取異動
    onFieldKeyChange() {
        console.log('onFieldKeyChange');
        // 以下2項參數要跟著變動
        // vm.fetchModel('stateModel').setState('fieldType', '');
        // vm.fetchModel('stateModel').setState('fieldSelectData', null);

        const fieldKey = this.fetchModel('stateModel').getState('fieldKey');
        const fieldItemList = this.fetchModel('stateModel').getState('fieldItemList');

        // 找出選取的項目資料
        const fieldSelectData = fieldItemList.find((fieldItem) => {
            return fieldItem.key === fieldKey;
        });


        if (!fieldSelectData) {
            // console.error(`fieldKey \'${fieldKey}\' not found fieldSelectData`);

            // 儲存欄位詳細資料
            this.fetchModel('stateModel').setState('fieldSelectData', null);

            // 載入該欄位型態的處理類型optionList
            this.loadOperationTypeOptionList('none');

            return;
        }

        // 儲存欄位詳細資料
        this.fetchModel('stateModel').setState('fieldSelectData', fieldSelectData);

        // 載入該欄位型態的處理類型optionList
        this.loadOperationTypeOptionList(fieldSelectData.__fieldType);
    }

    // 欄位型態異動
    onFieldTypeChange() {
        // console.log('onFieldTypeChange');

        const stateModel = this.fetchModel('stateModel');
        const fieldType = stateModel.getState('fieldType');
        console.log(`onFieldTypeChange`, fieldType);

        if (fieldType === FieldTypeEnum.date) {
            const operationType = stateModel.getState('operationType');
            if (operationType === OperationTypeEnum.date.inPeriod) {
                // 虛擬出一個'period'的fieldType
                stateModel.changeParamShowType(FieldTypeEnum.period);
            }
        }

        stateModel.changeParamShowType(fieldType);
    }

    // 處理類型改變時
    onOperationTypeChange() {
        const stateModel = this.fetchModel('stateModel');
        const fieldType = stateModel.getState('fieldType');
        const operationType = stateModel.getState('operationType');

        if (fieldType === FieldTypeEnum.date) {
            if (operationType === OperationTypeEnum.date.inPeriod) {
                // 時間內的設定方式，要切換
                stateModel.changeParamShowType(FieldTypeEnum.period);
            } else {
                stateModel.changeParamShowType(FieldTypeEnum.date);
            }
        }
    }

    // 匹配標籤選項
    onMatchTagListChange() {
        console.log('onMatchTagListChange');

        // // 設定套用標籤預設設定 「大於等於 1」
        // const stateModel = this.fetchModel('stateModel');

        // stateModel.setState('operationType', OperationTypeEnum.number.gte);
        // stateModel.setState('operationParamInt', 1);
    }

    // 取消
    onCancel() {
        this.fetchRef('conditionCreateModal').closeModal();
    }

    // 確認
    onConfirm() {
        console.log('formData', this.fetchModel('stateModel').getFormData());

        this.fetchRef('conditionCreateModal').closeModal();
    }

    // handle-------------------------------------------

    // 載入匹配資料OptionList
    loadMatchDataOptionList() {
        const vm = this;
        vm.fetchModel('stateModel').setState('matchDataOptionListLoading', true);
        // 載入匹配數據表單的optionList
        setTimeout(function () {

            vm.fetchModel('stateModel').setState('matchDataOptionList', [{
                label: '交易紀錄',
                value: DataCategoryEnum.transactionLog,
            }, {
                label: '會員資料',
                value: DataCategoryEnum.memberData,
            }, {
                label: '商品分類',
                value: DataCategoryEnum.productCategory,
            }, {
                label: '商品資料',
                value: DataCategoryEnum.productData,
            }, {
                label: '分店門市',
                value: DataCategoryEnum.branchShop,
            }]);

            vm.fetchModel('stateModel').setState('matchData', '');

            vm.fetchModel('stateModel').setState('matchDataOptionListLoading', false);
        }, 2000);
    }

    // 只篩出需要的 __fieldType 欄位類型
    filtOptionListByFieldType(fieldList, ...fieldTypeList) {

        const fieldTypeMap = {};
        fieldTypeList.forEach((fieldType) => {
            fieldTypeMap[fieldType] = true;
        });

        const dateFieldList = fieldList.filter((fieldItem) => {
            return fieldTypeMap[fieldItem.__fieldType] === true;
            // return fieldItem.__fieldType === 'date';
        });
        return dateFieldList.map((dateField) => {
            return {
                label: dateField.label,
                value: dateField.key,
            };
        });
    }

    // 載入資料欄位optionList
    loadFieldOptionList() {

        this.fetchModel('stateModel').setState('fieldOptionListLoading', true);

        // 載入該類型表單的欄位資料
        const vm = this;
        setTimeout(function () {

            const matchData = vm.fetchModel('stateModel').getState('matchData');

            const fieldItemList = getSchemaFieldListSample(matchData,
                vm.fetchModel('stateModel').getState('dataCollectionT'));

            // 1.儲存fieldItemList
            vm.fetchModel('stateModel').setState('fieldItemList', fieldItemList);

            // 2.儲存fieldOptionList

            // 篩出__fieldType為 'string' 'number' 'date' 格式的資料，轉成optionList
            // const fieldOptionList = vm.filtOptionListByFieldType(fieldItemList, FieldTypeEnum.string, FieldTypeEnum.number, FieldTypeEnum.date);
            vm.fetchModel('stateModel').setState('fieldOptionList',
                vm.filtOptionListByFieldType(fieldItemList, FieldTypeEnum.string, FieldTypeEnum.number, FieldTypeEnum.date)
            );

            // 初始化清空選擇欄位
            vm.fetchModel('stateModel').setState('fieldKey', '');
            vm.fetchModel('stateModel').setState('fieldOptionListLoading', false);
        }, 1000);
    }

    // 載入處理類型optionList
    loadOperationTypeOptionList(operateMode) {
        const stateModel = this.fetchModel('stateModel');

        const t = stateModel.getState('dataCollectionT');

        // 清空初始化處理類型
        stateModel.setState('operationType', '');

        const numberOperationOptionList = [{
            label: t('operationType.eq'), // '==',
            value: OperationTypeEnum.number.eq,
            // value: 'eq',
        }, {
            label: t('operationType.ne'), // '!=',
            value: OperationTypeEnum.number.ne,
            // value: 'ne',
        }, {
            label: t('operationType.lt'), //  '<',
            value: OperationTypeEnum.number.lt,
            // value: 'lt',
        }, {
            label: t('operationType.lte'), //  '<=',
            value: OperationTypeEnum.number.lte,
            // value: 'lte',
        }, {
            label: t('operationType.gt'), //  '>',
            value: OperationTypeEnum.number.gt,
            // value: 'gt',
        }, {
            label: t('operationType.gte'), // '>=',
            value: OperationTypeEnum.number.gte,
            // value: 'gte',
        }];

        const stringOperationOptionList = [{
            label: t('operationType.textEqual'), // '文字完全符合',
            value: OperationTypeEnum.string.equal,
            // value: 'textEqual',
        }, {
            label: t('operationType.textInclude'), // '文字包含',
            value: OperationTypeEnum.string.include,
            // value: 'textInclude',
        }, {
            label: t('operationType.textExclude'), //  '文字不包含',
            value: OperationTypeEnum.string.exclude,
            // value: 'textExclude',
        }, {
            label: t('operationType.blank'), // '空白',
            value: OperationTypeEnum.string.blank,
            // value: 'blank',
        }, {
            label: t('operationType.notBlank'), // '非空白',
            value: OperationTypeEnum.string.notBlank,
            // value: 'notBlank',
        }, {
            label: t('operationType.prefix'), // '文字開頭',
            value: OperationTypeEnum.string.prefix,
            // value: 'prefix',
        }, {
            label: t('operationType.suffix'), // '文字結尾',
            value: OperationTypeEnum.string.suffix,
            // value: 'suffix',
        }];

        const dateOperationOptionList = [{
            label: t('operationType.inPeriod'), // '時間內',
            value: OperationTypeEnum.date.inPeriod,
            // value: 'inPeriod',
        }, {
            label: t('operationType.dateEqual'), // '日期為',
            value: OperationTypeEnum.date.dateEqual,
            // value: 'dateEqual',
        }, {
            label: t('operationType.dateBefore'), // '日期早於',
            value: OperationTypeEnum.date.dateBefore,
            // value: 'dateBefore',
        }, {
            label: t('operationType.dateAfter'), // '日期晚於',
            value: OperationTypeEnum.date.dateAfter,
            // value: 'dateAfter',
        }]

        if (operateMode === ConditionTypeEnum.amount) {
            stateModel.setState('operationTypeOptionList', numberOperationOptionList);
            this.fetchModel('stateModel').setState('fieldType', FieldTypeEnum.number);

        } else if (operateMode === ConditionTypeEnum.tag) {
            stateModel.setState('operationTypeOptionList', numberOperationOptionList);
            this.fetchModel('stateModel').setState('fieldType', FieldTypeEnum.number);

        } else if (operateMode === FieldTypeEnum.string) {
            stateModel.setState('operationTypeOptionList', stringOperationOptionList);
            this.fetchModel('stateModel').setState('fieldType', FieldTypeEnum.string);

        } else if (operateMode === FieldTypeEnum.number) {
            stateModel.setState('operationTypeOptionList', numberOperationOptionList);
            this.fetchModel('stateModel').setState('fieldType', FieldTypeEnum.number);

        } else if (operateMode === FieldTypeEnum.date) {
            stateModel.setState('operationTypeOptionList', dateOperationOptionList);
            this.fetchModel('stateModel').setState('fieldType', FieldTypeEnum.date);

        } else {
            stateModel.setState('operationTypeOptionList', []);
            this.fetchModel('stateModel').setState('fieldType', '');
        }

    }

}
