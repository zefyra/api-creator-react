import { configureStore } from '@reduxjs/toolkit';
import LocalAccessor from 'localAccessor';
import alertReducer from './alert';

import loginReducer, { loginSlice } from './login';
// import menuReducer from './menu';
import subscribeReducer from './subscribe';
import subscribeUpgradeReducer from './subscribeUpgrade'
import userReducer from './user';
import orderReducer from './order';
import quotaRankReducer from './quotaRank';
import socialReducer from './social';
// import tagSelectorReducer from './tagSelector';
import multiSelectorSampleReducer from './multiSelectorSample';
import profileReducer from './profile'
import industryReducer from './industry'

// // 用來定義Store的資料內容
// export default configureStore({
//   reducer: {
//     // 這裡可以配置多種模組
//     login: loginReducer,
//     alert: alertReducer,
//     menu: menuReducer,
//     subscribe: subscribeReducer,
//     subscribeUpgrade: subscribeUpgradeReducer,
//     user: userReducer,
//     order: orderReducer,
//   },
//   // preloadedState: { // 測試從localStorage載入store
//   //   login: loginInitState,
//   //   // login: {
//   //   //   email: profile.email, // <---測試
//   // }
// });

const store = configureStore({
  reducer: {
    // 這裡可以配置多種模組
    login: loginReducer,
    profile: profileReducer,
    industry: industryReducer,
    alert: alertReducer,
    // menu: menuReducer,
    subscribe: subscribeReducer,
    subscribeUpgrade: subscribeUpgradeReducer,
    user: userReducer,
    order: orderReducer,
    quotaRank: quotaRankReducer,
    social: socialReducer,
    // tagSelector: tagSelectorReducer,
    multiSelectorSample: multiSelectorSampleReducer, // 多選框的範例

  },
  // preloadedState: { // 測試從localStorage載入store
  //   login: loginInitState,
  //   // login: {
  //   //   email: profile.email, // <---測試
  // }
});

// 用來定義Store的資料內容
export default store;

// export function getStore() {
//   return store;
// }

// 相當於useSelector
export function useGetter(storeSelectorFunc) {
  return storeSelectorFunc(store.getState());
}
export function useMutator() {
  return store.dispatch;
}