export default class Lang {
    static getter() {
        // console.log('lang getter')

        let lang = localStorage.getItem('lang');

        return lang || "zh-tw";
    }
}