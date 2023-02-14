export default class ParameterTypeEnum {
    static query = 'query';
    static header = 'header';
    static path = 'path';
    static body = 'body';

    static getOptionList(mode) {
        const convertToOptionList = function (enumList) {
            return enumList.map(val => ({ label: val, value: val }));
        }

        if (mode === 'urlQuery') {
            return convertToOptionList([ParameterTypeEnum.query, ParameterTypeEnum.path]);
        }
        return [];
    }
}