export default class SwaggerPropertyTypeEnum {
    static string = 'string';
    static integer = 'integer';
    static getOptionList(mode) {
        const convertToOptionList = function (enumList) {
            return enumList.map(val => ({ label: val, value: val }));
        }

        if (mode === 'urlQuery') {
            return convertToOptionList([SwaggerPropertyTypeEnum.string]); // , SwaggerPropertyTypeEnum.integer
        }
        return [];
    }
}