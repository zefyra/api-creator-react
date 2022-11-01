
class DateOperationTypeEnum {
    inPeriod = 'inPeriod';
    dateEqual = 'dateEqual';
    dateBefore = 'dateBefore';
    dateAfter = 'dateAfter';
}

class NumberOperationTypeEnum {
    eq = 'eq';
    ne = 'ne';
    lt = 'lt';
    lte = 'lte';
    gt = 'gt';
    gte = 'gte';
}
class StringOperationTypeEnum {
    equal = 'equal';
    include = 'include';
    exclude = 'exclude';
    blank = 'blank';
    notBlank = 'notBlank';
    prefix = 'prefix';
    suffix = 'suffix';
}


export default class OperationTypeEnum {
    // static inPeriod = 'inPeriod';
    static date = new DateOperationTypeEnum();
    static number = new NumberOperationTypeEnum();
    static string = new StringOperationTypeEnum();
}

