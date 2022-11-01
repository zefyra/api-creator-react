// 參數解釋: 用來註釋jsconfig.json，此檔案沒有作用

const ccccc = {
    "compilerOptions": {
        "baseUrl": "src" // 代表import路徑，預設為src資料夾
        /* 範例
        import { navigate } from "router/navigator"
        即使router前面沒有絕對路徑、或相對路徑，也會自動去
        src資料夾底下尋找。

        優點: 可避免專案後期要移動資料夾階層的問題
        */
    },
    "include": [
        "src"
    ]
}