export default class CreateMethodEnum {
    static fromDataCollection = 'fromDataCollection'; // 從數據集導入
    static manualCreate = 'manualCreate'; // 手動建立
    static getOptionList(t) {
        return [{
            label: t('manualCreate'),
            value: CreateMethodEnum.manualCreate,
        }, {
            label: t('fromDataCollection'),
            value: CreateMethodEnum.fromDataCollection,
        }]
    }
}