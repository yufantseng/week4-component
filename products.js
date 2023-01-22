// import axios from 'axios';
// 建立 Vue
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 宣告 productModal, deleteProduct 為空值
let productModal = null;
let deleteProductModal = null;

const app =createApp({
  // 建立資料
  data(){
    return {
      // 六角學院的 api URL
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      // 個人申請的 api path
      apiPath: 'yufan-55140',
      // 所有商品資料
      products: [],
      // 建立新舊商品判斷預設值
      isNew: false,
      // 建立暫存資料物件
      tempProduct: {
        // 建立暫存資料物件的空照片矩陣
        imagesUrl: [],
      },
      // 建立 pagination 分頁空物件
      pagination: {},
    }
  },
  mounted(){
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token;
    // 存入 Token 後每當訪問頁面自動執行使用者驗證
    this.checkAccount();
  },
  methods: {
    checkAccount(){
      // 宣告 url 函數為 六角 api Url 並使用登入及驗證 api
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        // 若使用者登入驗證成功則 trigger getData 功能渲染 api 資料進 products 所有商品資料中
        .then(() => {
          this.getData();
        })
        // 若使用者登入驗證失敗則顯示 error 回傳錯誤訊息並跳回 login.html 登入頁面
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getData(page = 1){
      // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品 api
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        // 若成功讀取遠端 api 商品資料則渲染 response 資料進 products 與 pagination 資料中
        .then((response) => {
          const { products, pagination } = response.data;
          this.products = products;
          this.pagination = pagination;
        })
        // 若使用者登入驗證失敗則顯示 error 回傳錯誤訊息並跳回 login.html 登入頁面
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        })
    },
    openModal(isNew, item){
      // 若判斷為新產品則打開皆為空值的新產品 Modal
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      // 若判斷為編輯既有產品則傳入所點選 item 資料進 tempProduct 並顯示於 Modal
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      // 若判斷為刪除既有產品則傳入所點選 item 資料進 tempProduct 並顯示於 delete Modal
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        deleteProductModal.show()
      }
    },
  },
});

// pagination 分頁元件
app.component('pagination', {
  // pagination 分頁元件 id 指向
  template: '#pagination',
  // props 傳入 pagination 值進元件
  props: ['pages'],
  methods: {
    // 定義 emitPages emit 觸發 getData 事件
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
});

// product 產品新增與編輯元件
app.component('productModal', {
  // product-modal 分頁元件 id 指向
  template: '#productModal',
  // props 傳入 tempProduct, isNew 值進元件
  props: ['product', 'isNew'],
  data(){
    return {
      // 六角學院的 api URL
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      // 個人申請的 api path
      apiPath: 'yufan-55140',
    };
  },
  mounted(){
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      // Modal 打開時按下 esc 鍵不會關閉 Modal
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    updateProduct(){
      // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品 api
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      // 宣告 http 協定為 post 新增資料
      let httpMethod = 'post';
      // 若非新商品則套用以下 url 和 http 協定設定
      if (!this.isNew) {
        // 宣告 api 函數為 六角 api Url 結合 編輯資料的 api path 並使用管理產品 api 加上暫存資料物件的 id
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
        // 宣告 http 協定為 put 修改資料
        httpMethod = 'put';
      }

      // axios 套用以上判斷並相應索取資訊
      axios[httpMethod](api, { data: this.product })
      // 若點擊後成功編輯資料則回傳 response 資料中的訊息
      .then((response) => {
        // 若點擊後成功編輯資料則關閉 productModal Modal
        alert(response.data.message);
        this.hideModal();
        // 若點擊後成功編輯資料則 emit update 觸發 getData 事件
        this.$emit('update');
      }).catch((err) => {
        // 若編輯資料失敗則顯示 error 回傳錯誤訊息
        alert(err.response.data.message);
      });
    },
    createImages(){
      // 觸發後顯示空的 product 暫存資料
      this.product.imagesUrl = [];
      // 觸發後加入新產品圖片資料進 product 暫存資料中的 imagesUrl 陣列
      this.product.imagesUrl.push('');
    },
    openModal(){
      // 開啟 modal 功能
      productModal.show();
    },
    hideModal(){
      // 隱藏 modal 功能
      productModal.hide();
    },
  },
})
// 產品刪除元件
app.component('deleteProductModal', {
  // delete-product-modal 分頁元件 id 指向
  template: '#deleteProductModal',
  // props 傳入 tempProduct 值進元件
  props: ['item'],
  data(){
    return{
      // 六角學院的 api URL
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      // 個人申請的 api path
      apiPath: 'yufan-55140',
    };
  },
  mounted(){
    deleteProductModal = new bootstrap.Modal(document.getElementById('deleteProductModal'), {
      // Modal 打開時按下 esc 鍵不會關閉 Modal
      keyboard: false,
      backdrop: 'static',
    });
  },
  methods: {
    deleteProduct(){
      // axios 刪除功能套用以上宣告的 url 函數(六角 api Url 結合 個人申請的 api path 並使用管理產品中的刪除商品 api)
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`).then((response) => {
        // 若成功刪除所點選的商品資料則觸發隱藏 modal 功能
        this.hideModal();
        // 若成功刪除所點選的商品資料則 emit update 觸發 getData 事件
        this.$emit('update');
      }).catch((err) => {
        // 若刪除資料失敗則顯示 error 回傳錯誤訊息
        alert(err.response.data.message);
      });
    },
    openModal(){
      // 開啟 modal 功能
      deleteProductModal.show();
    },
    hideModal(){
      // 隱藏 modal 功能
      deleteProductModal.hide();
    },
  },
});
// 將 createApp 掛載於 '＃app' id 上
app.mount('#app');