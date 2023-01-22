// 建立 Vue
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  // 建立資料
  data() {
    return {
      // 建立使用者登入資料
      user: {
        // 使用者名稱
        username: '',
        // 使用者密碼
        password: '',
      },
    }
  },
  methods: {
    login() {
      // 宣告 api 函數為 六角 api Url 並使用登入及驗證 api
      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      axios.post(api, this.user)
      // 若使用者登入驗證成功則寫入 cookie token
      .then((response) => {
        // 宣告 token 和 expired 函數為 response.data 中的各別讀入資料
        const { token, expired } = response.data;
        // 寫入 cookie token
        // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
        // 寫入 cookie token 並設置有效時間後進入 products.html 頁面
        window.location = 'products.html';
      })
      // 若使用者登入驗證失敗則顯示 error 回傳錯誤訊息
      .catch((err) => {
        alert(err.response.data.message);
      });
    },
  },
})
// 將 createApp 掛載於 '＃app' id 上
.mount('#app');