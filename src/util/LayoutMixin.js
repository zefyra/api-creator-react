export default class LayoutMixin {
    static navBarHeight = '53px';
    static pageTitleHeight = '75px';

    // 頁面的Table、FilterPanel計算統一的寬度用的
    static getPageBoardWidth() {
        return 'calc(100% - 4rem)';
    }
}