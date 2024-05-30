
# 執行環境

node.js v14.21.3

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

(好像沒用上)

```shell
npm install -g node-gyp
npm install --global --production windows-build-tools
```

# 修改dev server是3000 port的問題
https://blog.csdn.net/qq_45019494/article/details/106490884
我们在运行多个react项目时，我们想指定react的端口。 经过我查资料，我总结了两个方法。 打开项目中的 node_modules 文件夹->找到 react-script 文件夹->打开 scripts 文件夹->找到 start.js 文件->然后在此文件夹中修改即可。

```javascript
// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000; // <-這裡改3009
const HOST = process.env.HOST || '0.0.0.0';
```