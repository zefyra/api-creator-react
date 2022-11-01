import React, { useState } from "react";
// import { useTranslation, withTranslation } from 'react-i18next';
import LocalAccessor from 'localAccessor'
import i18next from 'i18next';

class LangModule extends React.Component {
    constructor(props) {
        super();
        // console.log(`LoginModule props`, props);

        // this.navigate = null;
    }

    componentDidMount() {

        const lang = LocalAccessor.getItem('lang');
        // if (lang) {
        //     if (lang !== this.props.i18n.language) {
        //         // 代表localStorage的設定與當前的語系不同，自動切換語系
        //         this.props.i18n.changeLanguage(lang);
        //         // console.log(`<LangModule> change lang: ${lang}`);
        //     }
        // }

        // console.log('i18next.language', i18next.language)

        if (lang) {
            if (lang !== i18next.language) {
                i18next.changeLanguage(lang);
                // ps.必須使用直接import的i18next來執行changeLanguage: 不能使用useTranslation抓到的i18n物件，否則佈署之後會失效
                console.log(`<LangModule> change lang: ${lang}`);
            }
        }
    }

    componentWillUnmount() { // beforeDestory
        // const { childRef } = this.props;
        // childRef(undefined); // 解除綁定
    }

    render() {
        return <div style={{
            display: 'none',
        }}></div>
    }
}

// export default withTranslation()(LangModule);
export default LangModule;

export const getLangItemList = function ({ t }) {

    function changeLang(subItem) {
        console.log(`changeLang: ${subItem.lang}`);

        // 變更語系
        // i18n.changeLanguage(subItem.lang);
        i18next.changeLanguage(subItem.lang);

        LocalAccessor.setItem('lang', subItem.lang);
    }

    const langList = ['zh-TW', 'en']; // , 'de'
    const langItemList = langList.map((lang) => {
        return {
            name: t(lang), // langT('zh-tw') => 繁體中文
            lang: lang, // 'zh-tw'
            event: changeLang.bind(null),
        };
    });
    /* const langList = ['zh-tw', 'en'];
    ===>
    const langItemList = [{
        name: langT('zh-tw'), // 繁體中文
        lang: 'zh-tw',
        event: changeLang.bind(null),
    }, {
        name: langT('en'), // 英文
        lang: 'en',
        event: changeLang.bind(null),
    }] */

    return langItemList;
}