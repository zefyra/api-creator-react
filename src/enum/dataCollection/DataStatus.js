export default class DataStatusEnum {
    static normal = "normal";
    static nowSync = "nowSync";
    static error = "error";
    static getOptionList(t) {
        return [{
            value: DataStatusEnum.normal,
            label: t('normal'), // "dataStatus.normal"
        }, {
            value: DataStatusEnum.nowSync,
            label: t('nowSync'), // "dataStatus.nowSync"
        }, {
            value: DataStatusEnum.error,
            label: 'error', // "dataStatus.nowSync"
        }];
    }
}