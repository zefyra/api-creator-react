
export default class UserCheckEnum {
    static phone = 'phone'; // 手機號碼
    static email = 'email'; // Email
    static line = 'line'; // Line
    static facebook = 'facebook'; // facebook
    static instagram = 'instagram'; // Instagram
    static wechat = 'wechat'; // WeChat

    static getCheckItemList(t) {
        return [{
            label: '手機號碼',
            key: UserCheckEnum.phone,
        }, {
            label: 'E-mail',
            key: UserCheckEnum.email,
        }, {
            label: 'Line',
            key: UserCheckEnum.line,
        }, {
            label: 'facebook',
            key: UserCheckEnum.facebook,
        }, {
            label: 'Instagram',
            key: UserCheckEnum.instagram,
        }, {
            label: 'WeChat',
            key: UserCheckEnum.wechat,
        }];
    }

    // static getCheckItemList() {
    //     return [{
    //         label: '祖父母',
    //         value: FamilyEnum.grandParents,
    //     }, {
    //         label: '父',
    //         value: FamilyEnum.father,
    //     }, {
    //         label: '母',
    //         value: FamilyEnum.mother,
    //     }, {
    //         label: '丈夫',
    //         value: FamilyEnum.husband,
    //     }, {
    //         label: '妻子',
    //         value: FamilyEnum.wife,
    //     }, {
    //         label: '兄弟',
    //         value: FamilyEnum.brother,
    //     }, {
    //         label: '姊妹',
    //         value: FamilyEnum.sister,
    //     }, {
    //         label: '兒子',
    //         value: FamilyEnum.son,
    //     }, {
    //         label: '女兒',
    //         value: FamilyEnum.daughter,
    //     }];
    // }
}