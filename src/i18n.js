import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
    // 使用 i18next-http-backend
    .use(Backend)
    // 將 i18next 傳入 react-i18next 裡面
    .use(initReactI18next)
    // 實例化 initReactI18next
    .init({
        backend: {
            //網頁載入時去下載語言檔的位置
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        // 當目前的語言檔找不到對應的字詞時，會用 fallbackLng (en) 作為預設語言
        fallbackLng: "en",
        // 預設語言
        lng: "zh-TW",
        interpolation: {
            // 是否要讓字詞 escaped 來防止 xss 攻擊，這裡因為 React.js 已經做了，就設成 false即可
            escapeValue: false,
        },
        // 預設一開始就會載入json的namespace，若沒設定則會抓不到。(若還是抓不到，要檢查 http://localhost:3000/locales/zh-tw/newNamespace.json 能不能抓出public內的檔案 )
        // 若有新增namespace一定要加，不然navigate跳頁的時候會出錯
        ns: ['login', 'menu', 'navBar', 'lang', 'profile', 'component',
            'users', 'setting', 'pay', 'order', 'social', 'dataCollection',
            'tag', 'apiConnect'],
        // defaultNS: 'login', // 要設定這個，否則系統會自動去找translation.json
    }, (err, t) => {
        if (err) return console.error('i18n error', err);
        // t('hello'); // -> same as i18next.t
    });

export default i18n;