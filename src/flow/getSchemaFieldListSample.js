import DataCategoryEnum from "enum/dataCollection/DataCategory";
import { FieldTypeEnum } from "enum/dataCollection/FieldType";


export const getSchemaFieldListSample = function (type, t = val => val) {
    // type: DataCategoryEnum

    const subFieldListMap = {
        [DataCategoryEnum.memberData]: {
            gatewayUid: { // 渠道UID // <那個欄位的key>
                title: t('memberData.gatewayUid'),
                // 會將欄位label自動轉成 => [ '渠道UID-id', '渠道UID-type', '渠道UID-UID']
                header: [{
                    label: 'id',
                    key: 'id',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'type',
                    key: 'type',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'UID',
                    key: 'uid',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }]
            },
            emailArray: { // E-mail陣列
                title: t('memberData.emailArray'),
                header: [{
                    label: 'id',
                    key: 'id',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'type',
                    key: 'type',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'Eamil',
                    key: 'email',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'description',
                    key: 'description',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }]
            },
            addressArray: { // 地址陣列
                title: t('memberData.addressArray'),
                header: [{
                    label: 'id',
                    key: 'id',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'type',
                    key: 'type',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('nation'), // 國家
                    key: 'nation',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('county'), // 縣市
                    key: 'county',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('region'), // 區域
                    key: 'region',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('address'), // 地址
                    key: 'address',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }]
            },
            phoneArray: { // 電話陣列
                title: t('memberData.phoneArray'),
                header: [{
                    label: 'id',
                    key: 'id',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'type',
                    key: 'type',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'number',
                    key: 'number',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'extension',
                    key: 'extension',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: 'description',
                    key: 'description',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }],
            },
        },
        [DataCategoryEnum.transactionLog]: {
            productArray: { // 商品陣列
                title: t('transactionLog.productArray'),
                header: [{
                    label: t('productCategoryId'), // 商品分類編號
                    key: 'productCategoryId',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('categoryName'), // 分類名稱
                    key: 'categoryName',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('productId'), // 商品ID
                    key: 'productId',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('barcode'), // 國際條碼
                    key: 'barcode',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('productName'), // 商品名稱
                    key: 'productName',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('brand'), // 品牌
                    key: 'brand',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('currency'), // 幣別
                    key: 'currency',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('amount'), // 數量
                    key: 'amount',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('unitPrice'), // 商品單價
                    key: 'unitPrice',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('productTotalPrice'), // 總價
                    key: 'totalPrice',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }]
            },
        },
        [DataCategoryEnum.productData]: {
            specArray: { // 商品規格陣列
                title: t('transactionLog.productArray'),
                header: [{
                    label: t('size'), // 尺寸
                    key: 'size',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('color'), // 顏色
                    key: 'color',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('weight'), // 重量
                    key: 'weight',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('volume'), // 材積
                    key: 'volume',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('unit'), // 單位
                    key: 'unit',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('other1'), // 其他1
                    key: 'other1',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('other2'), // 其他2
                    key: 'other2',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('other3'), // 其他3
                    key: 'other3',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }],
            },
            stockArray: { // 商品庫存陣列
                title: t('productData.stockArray'),
                header: [{
                    label: t('orderBaseNum'), // 訂貨基數
                    key: 'orderBaseNum',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('stockNum'), // 目前庫存
                    key: 'stockNum',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('stockLimit'), // 庫存上限
                    key: 'stockLimit',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('stockSafe'), // 安全庫存
                    key: 'stockSafe',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('shelfLifeDays'), // 保值期(天)
                    key: 'shelfLifeDays',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }],
            },
            priceArray: { // 商品價格陣列
                title: t('productData.priceArray'),
                header: [{
                    label: t('currency'), // 幣別
                    key: 'currency',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }, {
                    label: t('purchasePrice'), // 進貨價
                    key: 'purchasePrice',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('retailPrice'), // 零售價
                    key: 'retailPrice',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('discountPrice'), // 折扣價
                    key: 'discountPrice',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }]
            },
            satisfaction: { // 滿意度
                title: t('productData.satisfaction'),
                header: [{
                    label: t('time'), // 時間
                    key: 'time',
                    type: 'text',
                    width: '120px',
                    // __fieldType: FieldTypeEnum.date,
                }, {
                    label: t('grade'), // 評分
                    key: 'grade',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.number,
                }, {
                    label: t('memberId'), // 會員ID
                    key: 'memberId',
                    type: 'text',
                    width: '80px',
                    __fieldType: FieldTypeEnum.string,
                }]
            },
        }
    }

    const fieldListMap = {
        [DataCategoryEnum.memberData]: [{
            label: 'key',
            key: 'key',
            type: 'text',
            width: '100px',
        }, {
            label: t('memberData.memberId'), // 會員ID
            key: 'memberId',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.lastName'), // 姓氏
            key: 'lastName',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.firstName'), // 名子
            key: 'firstName',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.memberRank'), // 會員層級
            key: 'memberRank',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.sex'), // 性別
            key: 'sex',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.birthday'), // 生日
            key: 'birthday',
            type: 'text',
            width: '160px',
            // __fieldType: FieldTypeEnum.date,
            // filter: dateFilter,
            // __fieldType: FieldTypeEnum.date, // 尚未支援date欄位格式格式
        }, {
            label: t('memberData.identityNumber'), // 身分證字號
            key: 'identityNumber',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.account'), // 帳號
            key: 'account',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.gatewayUid'), // 渠道UID
            key: 'gatewayUid',
            type: 'buttonColumn',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
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
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.family'), // 家庭成員
            key: 'family',
            type: 'text',
            width: '160px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('memberData.registDate'), // 註冊日期
            key: 'registDate',
            type: 'text',
            width: '160px',
            // filter: dateTimeFilter,
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }, {
            label: t('memberData.lastLoginDate'), // 最後登入日期
            key: 'lastLoginDate',
            type: 'text',
            width: '160px',
            // filter: dateTimeFilter,
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態
        }],
        [DataCategoryEnum.transactionLog]: [{
            label: 'key',
            key: 'key',
            type: 'text',
            width: '80px',
        }, {
            label: t('transactionLog.memberId'), // 會員ID
            key: 'memberId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('transactionLog.orderId'), // 訂單編號
            key: 'orderId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('transactionLog.shopId'), // 商家ID
            key: 'shopId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('transactionLog.branchId'), // 分店ID
            key: 'branchId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('transactionLog.status'), // 狀態
            key: 'status',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('transactionLog.productArray'), // 商品陣列
            key: 'productArray',
            type: 'buttonColumn',
            width: '140px',
        }, {
            label: t('transactionLog.freight'), // 運費
            key: 'freight',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.number,
        }, {
            label: t('transactionLog.productPrice'), // 商品金額
            key: 'productPrice',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.number,
        }, {
            label: t('transactionLog.totalPrice'), // 總金額
            key: 'totalPrice',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.number,
        }, {
            label: t('transactionLog.invoiceNumber'), // 發票編號
            key: 'invoiceNumber',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('transactionLog.orderCreateTime'), // 訂單成立時間
            key: 'addressArray',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }, {
            label: t('transactionLog.payTime'), // 付款時間
            key: 'payTime',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }],
        [DataCategoryEnum.productCategory]: [{
            label: t('productCategory.productCategoryId'), // 商品分類ID
            key: 'productCategoryId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productCategory.upperCategoryId'), // 上層分類ID
            key: 'upperCategoryId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productCategory.productCategoryName'), // 商品分類名稱
            key: 'productCategoryName',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productCategory.productNum'), // 商品數
            key: 'productNum',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.number,
        }, {
            label: t('productCategory.createTime'), // 成立時間
            key: 'createTime',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }, {
            label: t('productCategory.lastUpdateTime'), // 最後更新時間
            key: 'lastUpdateTime',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }],
        [DataCategoryEnum.productData]: [{
            label: t('productData.productId'), // 商品ID
            key: 'productId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productData.barcode'), // 國際條碼
            key: 'barcode',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productData.categoryId'), // 所屬分類ID
            key: 'categoryId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productData.productName'), // 商品名稱
            key: 'productName',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productData.brand'), // 品牌
            key: 'brand',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productData.supplier'), // 供應商
            key: 'supplier',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('productData.specArray'), // 商品規格陣列
            key: 'specArray',
            type: 'buttonColumn',
            width: '140px',
        }, {
            label: t('productData.stockArray'), // 商品庫存陣列
            key: 'stockArray',
            type: 'buttonColumn',
            width: '140px',
        }, {
            label: t('productData.priceArray'), // 商品價格陣列
            key: 'priceArray',
            type: 'buttonColumn',
            width: '140px',
        }, {
            label: t('productData.satisfaction'), // 滿意度
            key: 'satisfaction',
            type: 'buttonColumn',
            width: '140px',
        }, {
            label: t('productData.createTime'), // 成立時間
            key: 'createTime',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }, {
            label: t('productData.lastUpdateTime'), // 最後更新時間
            key: 'lastUpdateTime',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }],
        [DataCategoryEnum.branchShop]: [{
            label: t('branchShop.shopId'), // 商家ID
            key: 'shopId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.shopName'), // 商家名稱
            key: 'shopName',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.branchId'), // 分店ID
            key: 'branchId',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.branchShopName'), // 分店名稱
            key: 'branchShopName',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.taxIdNum'), // 統編
            key: 'sex',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.phone'), // 電話
            key: 'phone',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.county'), // 縣市
            key: 'county',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.district'), // 區域
            key: 'district',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.address'), // 地址
            key: 'address',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.string,
        }, {
            label: t('branchShop.latitude'), // 座標Lat(緯度)
            key: 'latitude',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.number,
        }, {
            label: t('branchShop.longitude'), // 座標Lng(經度)
            key: 'longitude',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.number,
        }, {
            label: t('branchShop.createTime'), // 成立時間
            key: 'createTime',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }, {
            label: t('branchShop.lastUpdateTime'), // 最後更新時間
            key: 'lastUpdateTime',
            type: 'text',
            width: '80px',
            __fieldType: FieldTypeEnum.date, // 代表原始DB資料的型態為日期型態
        }]
    }

    let outFieldList = fieldListMap[type] || [];
    if (subFieldListMap[type]) {

        // 跑每個子表單
        Object.keys(subFieldListMap[type]).forEach((subType) => {
            // subType: 'productArray'
            const subSchema = subFieldListMap[type][subType];

            const subHeader = subSchema.header.map((eachHeader) => {
                eachHeader = Object.assign({}, eachHeader);

                // 會將欄位label自動加上title ['id', 'type', 'UID'] => [ '渠道UID-id', '渠道UID-type', '渠道UID-UID']
                eachHeader.label = `${subSchema.title}-${eachHeader.label}`;
                return eachHeader;
            });
            outFieldList = outFieldList.concat(subHeader);
        });
    }

    return outFieldList;
}