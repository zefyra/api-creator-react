
export default class ThemeMixin {
    constructor(themeObject) {
        this.theme = themeObject;
    }

    getTheme(key, defaultVal) {
        if (!this.theme) {
            return;
        }

        return this.theme[key] || defaultVal;
    }

    // 用來輸出 styled-component 內使用的 getTheme 函式
    static fetchGetTheme() {
        // 要輸出的函式
        // const getTheme = (key, defaultVal) => props => {
        //     if (props.theme) {
        //         if (props.theme[key]) {
        //             return props.theme[key];
        //         }
        //     }
        //     return defaultVal;
        // };

        function generateGetTheme(key, defaultVal) {
            return props => {
                if (props.theme) {
                    if (props.theme[key]) {
                        return props.theme[key];
                    }
                }
                return defaultVal;
            };
        }

        return generateGetTheme.bind(null);
    }

    static fetchGetButtonStyle() {
        function genGetButtonStyle(keyType, defaultVal) {
            // console.log('genGetButtonStyle', keyType, defaultVal)
            function getButtonStyle(props) {
                // props.type ==> 'primary'

                const keyType = this.keyType;
                const defaultVal = this.defaultVal;

                let key;
                if (keyType === 'button') {
                    key = props.type;
                } else if (keyType === 'disabled') {
                    key = `${props.type}Disabled`;
                } else if (keyType === 'hover') {
                    key = `${props.type}Hover`;
                } else if (keyType === 'text') {
                    key = `${props.type}Text`;
                } else if (keyType === 'textDisabled') {
                    key = `${props.type}TextDisabled`;
                } else if (keyType === 'textHover') {
                    key = `${props.type}TextHover`;
                } else if (keyType === 'border') {
                    key = `${props.type}Border`;
                } else if (keyType === 'borderDisabled') {
                    key = `${props.type}BorderDisabled`;
                } else if (keyType === 'borderHover') {
                    key = `${props.type}BorderHover`;
                } else if (keyType === 'shadowHover') {
                    key = `${props.type}ShadowHover`;
                } else {
                    console.error(`error keyType`, keyType);
                }
                // console.log('key', key)

                if (props.theme) {
                    if (props.theme[key]) {
                        return props.theme[key];
                    }
                }
                return defaultVal;
            };

            return getButtonStyle.bind({
                keyType, defaultVal
            });
        }

        return genGetButtonStyle.bind(null);
    }
}

export const fetchTheme = (key, defaultVal) => props => {
    if (props.theme) {
        if (props.theme[key]) {
            return props.theme[key];
        }
    }
    return defaultVal;
};
// Material UI 不能使用theme參數，因此要改參數名稱
// muiTheme駝峰大寫會跳error，因此小寫
export const fetchMuiTheme = (key, defaultVal) => props => {
    if (props.muitheme) {
        if (props.muitheme[key]) {
            return props.muitheme[key];
        }
    }
    return defaultVal;
};

export const fetchImportStyle = (key, defaultVal) => props => {
    // 會形成潛在bug，得關掉
    // if (props[key]) { // ex. key => 'width'
    //     return props[key];
    // }
    // importStyle優先權較高
    if (props.importStyle) {
        if (props.importStyle[key]) {
            return props.importStyle[key];
        }
    }
    if (props.patternStyle) {
        if (props.patternStyle[key]) {
            return props.patternStyle[key];
        }
    }
    return defaultVal;
}

export const fetchButtonStyle = (keyType, defaultVal) => props => {
    // props.type ==> 'primary'

    /*
    let key;
    if (keyType === 'button') {
        key = props.type;
    } else if (keyType === 'disabled') {
        key = `${props.type}Disabled`;
    } else if (keyType === 'hover') {
        key = `${props.type}Hover`;
    } else if (keyType === 'text') {
        key = `${props.type}Text`;
    } else if (keyType === 'textDisabled') {
        key = `${props.type}TextDisabled`;
    } else if (keyType === 'textHover') {
        key = `${props.type}TextHover`;
    } else if (keyType === 'border') {
        key = `${props.type}Border`;
    } else if (keyType === 'borderDisabled') {
        key = `${props.type}BorderDisabled`;
    } else if (keyType === 'borderHover') {
        key = `${props.type}BorderHover`;
    } else if (keyType === 'shadowHover') {
        key = `${props.type}ShadowHover`;
    } else if (keyType === 'toggleButton') {
        key = `${props.type}ToggleButton`;
    } else if (keyType === 'toggleActive') {
        key = `${props.type}ToggleActive`;
    } else {
        console.error(`error keyType`, keyType);
    }
    */

    let upperKeyType = keyType;
    upperKeyType = upperKeyType.charAt(0).toUpperCase() + upperKeyType.slice(1);

    let key = `${props.type}${upperKeyType}`;

    if (keyType === 'button') { // 只有'button'例外
        key = props.type;
    }

    if (props.theme) {
        if (props.theme[key]) {
            return props.theme[key];
        }
    }
    return defaultVal;
}