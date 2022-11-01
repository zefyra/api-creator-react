
// 用來描述package內的rules設定用意

const packageConfig = {
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ],
    "rules": {
      "no-unused-vars": "off",
      "jsx-a11y/anchor-is-valid": "off", // Line 133:23  <a onClick={() => navigate('/regist')}> 避免函式無法直接寫在裡面
      "react-hooks/rules-of-hooks": "off", // 用來避免useNavigate無法用在component以外的地方
      "no-useless-escape": "off", // return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,16}$/g.test(account);
      // \. ==> 因為認定加\是不必要的轉譯
      "react-hooks/exhaustive-deps": "off" // 警告useEffect參數必須丟函式進去
    }
  }
};