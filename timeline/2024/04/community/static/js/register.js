//注册⻚⾯js内容
let vue = new Vue({
    // id=register的元素
    el: '#register',
    // 获取
    delimiters: ['${', '}'],
    data: {
        // v-model
        username: '',
        email: '',
        password: '',
        smscode: '',
        imgcode: '',
        phone: '',
        // v-show 如果为true则显示，否则隐藏
        error_username: false,
        error_email: false,
        error_password: false,
        error_phone: false,
        error_smscode: false,
        error_imgcode: false,
        // v-message
        error_username_msg: '请输⼊⻓度1-40的⽤户名!',
        error_email_msg: '邮箱格式不正确！',
        error_password_msg: '密码不能为空！',
        error_phone_msg: '⼿机号输⼊有误！',
        error_smscode_msg: '验证码输⼊有误！',
        error_imgcode_msg: '验证码错误！',

    },
    methods: {

        // 校验⽤户名
        check_uname: function () {
            // 获取⽤户名
            let username = this.username;
            // 定义正则表达式
            // let reg = /^[a-zA-Z0-9_-]{1,40}$/;
            let reg = /^.{1,40}$/;
            // 校验⽤户名
            if (reg.test(username)) {
                this.error_username = false;
            } else {
                this.error_username = true;
            }
        },
        // 校验邮箱
        check_email: function () {
            let email = this.email;
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (reg.test(email)) {
                this.error_email = false;
            } else {
                this.error_email = true;
            }
        },
        // 校验密码
        check_pwd: function () {
            let password = this.password;
            // let reg = /^.{2,128}$/;
            let reg = /^(?=.*[a-z|\d]).{2,128}$/;
            if (reg.test(password)) {
                this.error_password = false;
            } else {
                this.error_password = true;
            }
        },
        // 校验⼿机号
        check_phone: function () {
            let phone = this.phone;
            let reg = /^1[3-9]\d{9}$/;
            if (reg.test(phone)) {
                this.error_phone = false;
            } else {
                this.error_phone = true;
            }
        },
        // 监听表单提交事件
        reg_sub: function () {
            // 校验⽤户名
            this.check_uname();
            // 校验邮箱
            this.check_email();
            // 校验密码
            this.check_pwd();
            // 校验⼿机号
            this.check_phone();
            // 校验验证码
            this.check_smscode();
            this.check_imgcode();
            // 如果有⼀个校验不通过，阻⽌表单提交
            if (this.error_username || this.error_email || this.error_password || this.error_phone || this.error_smscode || this.error_imgcode) {
                // this.event.returnValue = false; // 另一种写法
                return;
            }
            // 发送ajax请求
            axios.post('/register/', {
                username: this.username,
                email: this.email,
                password: this.password,
                phone: this.phone,
                smscode: this.smscode,
                imgcode: this.imgcode
            }).then(response => {
                console.log(response.data);
                if (response.data.code === 0) {
                    // 注册成功
                    window.location.href = '/login/';
                } else {
                    // 注册失败
                    alert(response.data.errmsg);
                }
            }).catch(error => {
                console.log(error);
            });
        }

    }

});