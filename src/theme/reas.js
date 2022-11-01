
const loginThemeObj = {
    main: '#4e9b86', // 主色 (應用位置: 首頁背景、、、、、)

    // 登入頁--------------------------------------------------
    loginBoard: '#506666', // 登入主板
    loginBoardShadow: '#363f3f', // 陰影

    // tab
    tabItem: '#e7e7e7', // 若沒指定就是是背景色
    tabItemActive: '#bcded6',
    tabItemActiveBottom: '#4e9b86',
    tabItemTextColor: '#dff5f0',
    tabItemTextColorActive: '#182623',

    // input text
    inputColor: '#e3edea',
    // inputTextColor: '#182623',
    inputTextColor: '#1f2725',
    inputShadow: '#363f3f',

    // button
    button: '#e3edea', // 登入按鈕
    buttonHover: '#3f6d5f',
    buttonActive: '#61a38f',
    buttonDisabled: '#969f9d',

    buttonBorder: '#666868',
    buttonBorderHover: '#98b6ad',
    buttonBorderActive: '#98b6ad',
    buttonBorderDisabled: '#666868',

    buttonTextColor: '#1f2725',
    buttonTextHover: '#e3edea',
    buttonTextActive: '#e3edea',
    buttonTextDisabled: '#5b615f',

    // text
    // linkText: '#2080ff',
    text: '#e3edea',
    linkText: '#78f5d3',
    linkTextDisabled: '#cacaca',

    commentText: '#e3edea',
    commentTextValid: '#ff3e3e',

    // hr
    hr: '#9baaa6',

    // lang
    langIcon: '#e3edea',
    langItem: '#9baaa6',
    langItemText: '#e3edea',

    // other-----------------------------------------------
    buttonRadius: '3px',
};

const modalThemeObj = {
    modal: '#f6f6f6', // '#f6f6f6',

    text: '#0a2f25',

    // highlightText: '#78bbf5'
    highlightText: '#00c792',

    hr: '#6d8e83',

    modalRadius: '10px',

    tabBottom: '#1c7575', // tab的底線

    // searchIcon: '#c0c0c0',
};

const buttonThemeObj = {
    // main: '#4e9b86',
    buttonRadius: '3px',

    // <type>
    // primary: '#25ddac', // v1: 高彩度模式
    // primary: '#09b788',
    primary: '#09b788',
    primaryText: '#0a2f25',
    // primaryBorder: '#64baa6', // v1: 高彩度模式
    primaryBorder: '#09b788',

    primaryDisabled: '#7fa198',
    primaryTextDisabled: '#0a2f25',
    primaryBorderDisabled: '#9fc1b8',

    // primaryHover: '#52f0c6', // v1
    primaryHover: '#41c6a3',
    primaryTextHover: '#0a2f25',
    // primaryBorderHover: '#52f0c6' // v1
    primaryBorderHover: '#41c6a3',

    primaryShadowHover: '#78c9b399',

    // default-------------------------------------------------------

    default: '#e3edea',
    defaultText: '#0a2f25',
    // primaryBorder: '#64baa6', // v1: 高彩度模式
    defaultBorder: '#64a692',

    defaultDisabled: '#7fa198',
    defaultTextDisabled: '#0a2f25',
    defaultBorderDisabled: '#9fc1b8',

    // primaryHover: '#52f0c6', // v1
    defaultHover: '#bde3d9',
    defaultTextHover: '#0a2f25',
    // primaryBorderHover: '#52f0c6' // v1
    defaultBorderHover: '#64a692',

    defaultShadowHover: '#93e2cd99',

    // defaultToggleButton: '#7a9d93',
    // defaultToggleActive: '#6deac5',
    defaultToggleButton: '#d4e0dd',
    defaultToggleActive: '#63cfaf',

    danger: '#dc5353',
    dangerText: '#e5d6d6',
    dangerBorder: '#d1a8a8',
    dangerBorderHover: '#d1a8a8',
    dangerShadowHover: '#ffadad99',
    dangerHover: '#dc5353',
}

const inputTextThemeObj = {
    inputBox: '#e9edec',
    inputBoxBorder: '#cacaca',
    // inputBoxText: '#475954',
    inputBoxText: '#384f49',

    inputBoxPlaceholder: '#a8b3b1',

    inputBoxRaduis: '3px',

    inputBoxDisabled: '#c0c0c0',

    tag: '#699f91',
    tagRaduis: '3px',
};


const textAreaThemeObj = {
    inputBox: '#e9edec',
    inputBoxBorder: '#cacaca',
    // inputBoxText: '#475954',
    inputBoxText: '#384f49',

    inputBoxPlaceholder: '#a8b3b1',

    inputBoxRaduis: '3px',

    inputBoxDisabled: '#c0c0c0',

    tag: '#699f91',
    tagRaduis: '3px',
};


const selectThemeObj = {
    selectBox: '#e9edec',
    selectBoxBorder: '#cacaca',
    selectBoxText: '#475954',

    selectBoxDisabled: '#c0c0c0',

    arrowIcon: '#ababab',

    dropdown: '#9bb2ac',
    dropdownText: '#2c3835',
    dropdownBorder: '#cacaca',

    dropdownItemHover: '#acc8c1',
    dropdownScrollbar: '#cdcdcdbc',
    dropdownScrollbarHover: '#dedede',

    selectBoxRaduis: '3px',
    dropdownRaduis: '5px',

    loading: '#477c68',

    placeholder: '#838383',
};

const toggleSwitchThemeObj = {
    slider: '#cccccc',
    trigger: 'white',
    sliderChecked: '#14dea8',
    sliderFocusShadow: '#14dea8'
};

const checkBoxThemeObj = {
    checkBox: '#e6f4f1', // #f2f2f2
    checkBoxHover: '#637980', // cccccc
    checkBoxChecked: '#14dea8',
    checkBoxDisabled: '#637980', // cccccc
    checkedSign: '#ffffff',
    checkBoxRadius: '4px'
};

const menuThemeObj = {
    menu: '#506666',

    itemText: '#e3edea',
    itemIcon: '#e3edea',

    itemActive: '#0a2f25',
    itemTextActive: '#e3edea',

    itemHover: '#72b3b3',
    itemTextHover: '#0a2f25',
    itemIconHover: '#0a2f25',

    subMenu: '#506666',
    subMenuText: '#e3edea',

    subMenuHover: '#72b3b3',
    subMenuTextHover: '#0a2f25',

    subMenuActive: '#0a2f25',
    subMenuTextActive: '#e3edea',

    scrollbar: '#cdcdcd9a',
    scrollbarHover: '#cdcdcd',
}

const navBarThemeObj = {
    main: '#4e9b86',

    iconBackground: '#506666',
    icon: '#e3edea',
    iconActive: '#2e3939', // 506666

    subBoard: '#506666',
    subBoardText: '#e3edea',

    // categoryItem: '#506666'
    categoryItemText: '#e3edea',
    categoryItemTextActive: '#2e3939',
}

const layoutThemeObj = {
    // pageTitleBottomBorder: '#506666',

    pageBackground: '#5f8e81',

    pageTitleText: '#e3edea',

    scrollbar: '#9fc3bc', // cdcdcd
    scrollbarHover: '#c9e2dd',
}

const pageMessageThemeObj = {
    text: '#cce2da',
    loading: '#cce2da',
}

const filterPanelThemeObj = {
    panel: '#ebf1f0',
    panelRadius: '5px',
}

const datePickerThemeObject = {
    datePicker: '#7da398',
    datePickerShadow: '#111e1a',

    datePickerText: '#101f19',
    arrowIcon: '#20382e',
    // arrowIconGridHover: '#589b88',

    datePickerRadius: '5px',

    // dateGridHover: '#589b88',
    dateGridHover: '#94c2b5',
    dateGridHoverRadius: '3px',
    dateGridHoverShadow: '#94c2b5',

    inputBox: '#7da398',
    inputBoxText: '#101f19',
}

const tableThemeObj = {
    tableContainer: '#ebf1f0', // 底板色
    tableContainerRadius: '5px',

    table: '#3e5157', // #3e5157

    rowSelectHighlight: '#81b5b5',
    rowHoverHighlight: '#9db5b5',

    tableBorder: '#1c7575',// #96D4D4

    tableText: '#d8e3df',
    tableTextSelect: '#1d2528',
    tableTextHover: '#1d2528',
    tableTextLink: '#287bf0',

    scrollbar: '#cdcdcd',
    scrollbarHover: '#3e5157',

    columnSettingIcon: '#949a98',

    checkBox: '#e6f4f1', // #f2f2f2
    checkBoxHover: '#637980', // cccccc
    checkBoxChecked: '#14dea8',
    checkBoxDisabled: '#637980', // cccccc
    checkedSign: '#ffffff',
    checkBoxRadius: '4px',

    loading: '#477c68',
}

const dropdownSelectThemeObj = {
    scrollbar: '#cdcdcd',
    scrollbarHover: '#cbcbe0',

    dropdown: '#546f6f',
    itemSelect: '#1c7575',

    itemText: '#d8e3df',
}

const paginationThemeObject = {
    item: '#637980',// #506666
    itemActive: '#3e5157', // 1c7575
    itemRadius: '3px',

    itemText: '#d8e3df',
    itemTextActive: '#d8e3df', // 1d2528

    dotIcon: '#3e5157',
    arrowIcon: '#d8e3df',

    inputBox: 'transparent', // '#e9edec',
    inputBoxBorder: '#96aeb5', // cacaca
    // inputBoxText: '#475954',
    inputBoxText: '#3e5157',

    inputBoxPlaceholder: '#a8b3b1',

    inputBoxRaduis: '3px',
    inputBoxDisabled: '#c0c0c0',
}
// background-color: ${getTheme('main', '#f1f1f1')};

const dashboardThemeObject = {

    block: '#ebf1f0',

    blockRadius: '3px',
}

const sliderThemeObject = {
    rail: '#3a8589', // 底下的軌道
    track: '#3a8589', // 上層的高亮bar條
    mark: '#3f7173', // 中間的節點
    thumb: '#3a8589', // 拉動的圓點
    thumbShadow: 'rgba(58, 133, 137, 0.16)',
}

const boardThemeObject = {
    board: '#ebf1f0', // 預設的底板色
    boardRadius: '3px',

    text: '#0a2f25', // 文字統一顏色
    attention: '#e33838', // 高亮文字
    spotlight: '#000dff', // 高亮文字

    // 分隔線
    hr: '#6d8e83',
    hrBorderWidth: '2px',
    hrWidth: '94%',

    border: '#6d8e83',
}


const apiDocThemeObject = {
    board: '#ebf1f0', // 預設的底板色
    boardRadius: '3px',

    scrollbar: '#cdcdcd',
    scrollbarHover: '#dedede',

    groupTitle: '#008282',
    apiTitle: '#366b6b', // #406161
    apiDescription: '#636363',

    quickGroupTitle: '#284f4f',
    quickApiTitle: '#284f4f',


    apiPath: '#1f4b4b', // API路徑文字
    apiPathBlock: '#afcfc9',
    apiTypeBlockGet: '#20c4a6',
    apiTypeBlockPut: '#a891e3',
    apiTypeBlockPost: '#4aafcb',
    apiTypeBlockDelete: '#a36379',

    apiTypeGet: '#3c3c3c',
    apiTypePut: '#3c3c3c',
    apiTypePost: '#3c3c3c',
    apiTypeDeletet: '#3c3c3c',

    requestTitle: '#8faeae',
    contentType: '#0e1b1b',
    contentTypeBlock: '#8faeae',

    paramFormTitle: '#4f6060',
    paramFormTitleBlock: '#8faeae',

    attributeRow: '#415151',
    attributeRowHr: '#657272',
    attributeText: '#91c8c8',
    attributeReuired: '#8c6ea7', // 芋頭色(暗) 8a7d95

    attributeQuote: '#a1e5e5',
    attributeQuoteBlock: '#6c8383', // 屬性預設值

    inputSelectArrowIcon: '#add5d5', // a1a1a1

    // text: '#0a2f25', // 文字統一顏色
    // attention: '#e33838', // 高亮文字
    // spotlight: '#000dff', // 高亮文字

    // // 分隔線
    // hr: '#6d8e83',
    // hrBorderWidth: '2px',
    // hrWidth: '94%',

    // border: '#6d8e83',
}

const tagSelectorThemeObject = {
    searchIcon: '#b3b3b3',
    angleIcon: '#b3b3b3',
    angleIconActive: '#41b18c',
    cancelIcon: '#f6f6f6',

    // radioButton: '#759186',
    radioButton: '#526c62',
    radioActive: '#3fc08c',
    radioSelected: '#376ebb',

    // buttonNoMark: '#d4e0dd',
    buttonNoMark: '#b8cec9',
    buttonGearMarked: '#63cfaf',
    buttonSelected: '#6390cf',
}


const tagDecisionThemeObject = {
    board: '#ebf1f0', // 預設的底板色
    boardRadius: '3px',

    addIcon: '#939796',

    decisionBoard: '#d7e0de',
    decisionRow: '#bfcac8',
}

const inputTagThemeObject = {
    inputBox: '#e9edec',
    // inputBoxDisabled: '#c0c0c0',
    inputBoxBorder: '#cacaca',
    // inputBoxText: '#384f49',
    // inputBoxPlaceholder: '#a8b3b1',

    inputBoxRaduis: '3px',
    
    tag: '#699f91',
    tagRaduis: '3px',
    cancelIcon: '#f6f6f6',
}

export const login = loginThemeObj;
export const modal = modalThemeObj;
export const button = buttonThemeObj;
export const inputText = inputTextThemeObj;
export const textArea = textAreaThemeObj;
export const select = selectThemeObj;
export const menu = menuThemeObj;
export const navBar = navBarThemeObj;
export const layout = layoutThemeObj;
export const toggleSwitch = toggleSwitchThemeObj;
export const checkBox = checkBoxThemeObj;
export const filterPanel = filterPanelThemeObj;
export const datePicker = datePickerThemeObject;
export const table = tableThemeObj;
export const dropdownSelect = dropdownSelectThemeObj;
export const pagination = paginationThemeObject;
export const dashboard = dashboardThemeObject;
export const slider = sliderThemeObject;
export const board = boardThemeObject;
export const tagSelector = tagSelectorThemeObject;
export const apiDoc = apiDocThemeObject;
export const tagDecision = tagDecisionThemeObject;
export const pageMessage = pageMessageThemeObj;
export const inputTag = inputTagThemeObject;