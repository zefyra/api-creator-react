import EnumFilter from "filter/EnumFilter";

export class FieldTypeEnum {
    static string = 'string';
    static date = 'date';
    // static recordDate = 'recordDate';
    static number = 'number';
    static period = 'period';
    static getFilter(t) {
        // const { t: fieldTypeT } = useTranslation('dataCollection', { keyPrefix: 'fieldType' });
        return new EnumFilter(FieldTypeEnum, t);
    }
}