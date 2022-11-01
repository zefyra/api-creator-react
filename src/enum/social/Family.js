
export default class FamilyEnum {
    static grandParents = 'grandParents'; // 祖父母
    static father = 'father'; // 父
    static mother = 'mother'; // 母
    static husband = 'husband'; // 丈夫
    static wife = 'wife'; // 妻子
    static brother = 'brother'; // 兄弟
    static sister = 'sister'; // 姊妹
    static son = 'son'; // 兒子
    static daughter = 'daughter'; // 女兒

    static getCheckItemList() {
        return [{
            label: '祖父母',
            value: FamilyEnum.grandParents,
        }, {
            label: '父',
            value: FamilyEnum.father,
        }, {
            label: '母',
            value: FamilyEnum.mother,
        }, {
            label: '丈夫',
            value: FamilyEnum.husband,
        }, {
            label: '妻子',
            value: FamilyEnum.wife,
        }, {
            label: '兄弟',
            value: FamilyEnum.brother,
        }, {
            label: '姊妹',
            value: FamilyEnum.sister,
        }, {
            label: '兒子',
            value: FamilyEnum.son,
        }, {
            label: '女兒',
            value: FamilyEnum.daughter,
        }];
    }
}