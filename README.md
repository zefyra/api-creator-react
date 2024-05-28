# api-creator-react

> swagger file generator GUI by React.js

# .env參數介紹

### 自動使用當前host

套用.env.publish內的參數
```
REACT_APP_WEB_API_URL=""
```

#### 開啟API log: 需要測試API時使用以下.env設定
```
REACT_APP_DEV_API_INFO="true"
```


## node-sass需要安裝Python的問題

```shell
npm install -g node-gyp
npm install --global --production windows-build-tools
```