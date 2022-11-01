export default class PlatformTypeEnum {
    static ec = 'ec';
    static crm = 'crm';
    static erp = 'erp';
    static pos = 'pos';

    static scrm = 'scrm';
    static posoms = 'posoms';

    static getOptionList(t) {
        return [{
            label: 'EC',
            value: PlatformTypeEnum.ec,
        }, {
            label: 'CRM',
            value: PlatformTypeEnum.crm,
        }, {
            label: 'ERP',
            value: PlatformTypeEnum.erp,
        }, {
            label: 'POS',
            value: PlatformTypeEnum.pos,
        }];
    }
    static getAddOptionList(t) {
        return [{
            label: 'EC',
            value: PlatformTypeEnum.ec,
        }, {
            label: 'SCRM',
            value: PlatformTypeEnum.scrm,
        }, {
            label: 'CRM',
            value: PlatformTypeEnum.crm,
        }, {
            label: 'POS/OMS',
            value: PlatformTypeEnum.posoms,
        }, {
            label: 'ERP',
            value: PlatformTypeEnum.erp,
        }];
    }
}