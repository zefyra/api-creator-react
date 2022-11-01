export class ConsumeStatusEnum {
    static hasOrdered = 'hasOrdered' // 已下單
    static hasPayed = 'hasPayed' // 已付款
    static hasCancel = 'hasCancel' // 已取消
    static getOptionList(t) {
        return [{
            value: ConsumeStatusEnum.hasOrdered,
            label: t(ConsumeStatusEnum.hasOrdered),
        }, {
            value: ConsumeStatusEnum.hasPayed,
            label: t(ConsumeStatusEnum.hasPayed),
        }, {
            value: ConsumeStatusEnum.hasCancel,
            label: t(ConsumeStatusEnum.hasCancel),
        }];
    }
}