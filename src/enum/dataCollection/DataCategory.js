export default class DataCategoryEnum {
    static memberData = "memberData"; // 會員資料
    static transactionLog = "transactionLog"; // 交易紀錄
    static productCategory = "productCategory"; // 商品分類
    static productData = "productData"; // 商品資料
    static branchShop = "branchShop"; // 分店門市

    static externEnvironmentParam = "externEnvironmentParam"; // 外在環境參數
    static getOptionList(t) {
        return [{
            value: DataCategoryEnum.memberData,
            label: t('memberData'),
        }, {
            value: DataCategoryEnum.productCategory,
            label: t('productCategory'),
        }, {
            value: DataCategoryEnum.productData,
            label: t('product'),
        }, {
            value: DataCategoryEnum.transactionLog,
            label: t('transactionLog'),
        }, {
            value: DataCategoryEnum.branchShop,
            label: t('branchShop'),
        // }, {
        //     value: DataCategoryEnum.externEnvironmentParam,
        //     label: t('externEnvironmentParam'),
        }];
    }
}