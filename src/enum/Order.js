
// 訂單狀態
export class OrderStatusEnum {
    static notConfirm = 'notConfirm'; // 待確認
    static hasConfirm = 'hasConfirm'; // 已確認
    static customerCancel = 'customerCancel'; // 客戶取消
    static platformCancel = 'platformCancel'; // 平台取消
    static systemCreate = 'systemCreate'; // 系統生成
    static getOptionList(t) {
        return [{
            label: t(OrderStatusEnum.notConfirm),
            key: OrderStatusEnum.notConfirm,
        }, {
            label: t(OrderStatusEnum.hasConfirm),
            key: OrderStatusEnum.hasConfirm,
        }, {
            label: t(OrderStatusEnum.customerCancel),
            key: OrderStatusEnum.customerCancel,
        }, {
            label: t(OrderStatusEnum.platformCancel),
            key: OrderStatusEnum.platformCancel,
        }, {
            label: t(OrderStatusEnum.systemCreate),
            key: OrderStatusEnum.systemCreate,
        }];
    }
}

// 支付狀態
export class PayStatusEnum {
    static notPay = 'notPay'; // 未支付
    static hasPay = 'hasPay'; // 已支付
    static deductionFail = 'deductionFail'; // 扣款失敗
    static getOptionList(t) {
        return [{
            label: t(PayStatusEnum.notPay),
            key: PayStatusEnum.notPay,
        }, {
            label: t(PayStatusEnum.hasPay),
            key: PayStatusEnum.hasPay,
        }, {
            label: t(PayStatusEnum.deductionFail),
            key: PayStatusEnum.deductionFail,
        }];
    }
}

// 發票狀態
export class InvoiceStatusEnum {
    static notSupply = 'notSupply'; // 不提供
    static notInvoice = 'notInvoice'; // 未開票
    static hasInvoice = 'hasInvoice'; // 已開票
    static invoiceNow = 'invoiceNow'; // 開票中
    static invoiceFail = 'invoiceFail'; // 開票失敗
    static getOptionList(t) {
        return [{
            label: t(InvoiceStatusEnum.notSupply),
            key: InvoiceStatusEnum.notSupply,
        }, {
            label: t(InvoiceStatusEnum.notInvoice),
            key: InvoiceStatusEnum.notInvoice,
        }, {
            label: t(InvoiceStatusEnum.hasInvoice),
            key: InvoiceStatusEnum.hasInvoice,
        }, {
            label: t(InvoiceStatusEnum.invoiceNow),
            key: InvoiceStatusEnum.invoiceNow,
        }, {
            label: t(InvoiceStatusEnum.invoiceFail),
            key: InvoiceStatusEnum.invoiceFail,
        }];
    }
}