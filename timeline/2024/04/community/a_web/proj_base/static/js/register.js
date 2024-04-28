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
        error_username_msg: '⽤户名输入有误!',
        error_email_msg: '邮箱格式不正确！',
        error_password_msg: '密码输入有误！',
        error_phone_msg: '⼿机号输⼊有误！',
        error_smscode_msg: '验证码输⼊有误！',
        error_imgcode_msg: '验证码错误！',
        // 
        username_timer: null,
        imgcode_timer: null,
        // 图片验证码相关变量
        imgcode_url: '',
        uuid: '',
        // 获取短信验证码相关变量
        smscode_btn: '获取短信验证码',
        send_smscode_flag: false, // 表明现在不能发送短信验证码
    },
    mounted: function () { // 页面加载完成后执行
        // 生成图片验证码
        this.generate_imgcode();
    },
    methods: {
        generate_imgcode: function () {
            // 生成uuid
            // this.uuid = uuidv4();
            this.uuid = generateUUID();
            // 获取图片验证码
            this.imgcode_url = `/imgcodes/${this.uuid}/`;
        },
        // check_imgcode
        check_imgcode: function () {
            let imgcode = this.imgcode;
            if (imgcode.length == 4) {
                this.error_imgcode = false;
            } else {
                this.error_imgcode = true;
            }
        },
        // 校验短信验证码
        check_smscode: function () {
            // 1. 格式校验[Format verification]
            let reg = /^\d{6}$/;
            if (reg.test(this.smscode)) {
                this.error_smscode = false;
            } else {
                this.error_smscode = true;
            }
            // 2. 校验短信验证码是否正确
            if (this.error_smscode) {
                return; 
            }
            // 发送ajax_post请求
            axios.post('/smscodes/' + this.phone + '/', {
                smscode: this.smscode
            }, {
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
                }
            }).then(response => {
                console.log(response.data);
                if (response.data.code == 200) {
                    console.log(this.error_smscode_msg)
                    this.error_smscode = false;
                } else {
                    this.error_smscode = true;
                    this.error_smscode_msg = response.data.msg;
                    console.log(this.error_smscode_msg)
                }
            }).catch(error => {
                console.log(error);
            });
        },
        // send_smscode
        send_smscode: function () {
            // 1.1.现在是否发生了短信验证码
            if (this.send_smscode_flag) {
                return; // 如果不能发送短信验证码，直接返回
            }
            // 1.2.校验⼿机号
            this.check_phone();
            if (this.error_phone) {
                return;
            }
            // 1.3.校验图形验证码
            this.check_imgcode();
            if (this.error_imgcode) {
                return;
            }
            // 2. send smscode
            this.send_smscode_flag = true; // 设置后表明正在
            // var url = '/smscodes/' + this.phone + '/?imgcode='+this.imgcode+'&uuid='+this.uuid;
            // 发送ajax请求
            axios.get('/smscodes/' + this.phone, {
                params: {
                    imgcode: this.imgcode,
                    uuid: this.uuid
                },
                responseType: 'json'
            }).then(response => {
                // console.log(response.data);
                if (response.data.code == 200) { // 短信验证码正常发送
                    // 倒计时
                    let num = 60;
                    let t = setInterval(() => {
                        num -= 1;
                        if (num === 0) {
                            clearInterval(t);
                            this.smscode_btn = '获取短信验证码';
                            this.send_smscode_flag = false;
                        } else {
                            this.smscode_btn = '倒计时: ' + num + '秒';
                        }
                    }, 1000);
                } else {
                    if(response.data.code == 4001 || response.data.code == 4002 || response.data.code == 4003 || response.data.code == 4004 || response.data.code == 5001) {
                        this.error_imgcode = true;
                        this.error_imgcode_msg = response.data.msg;
                        console.log(this.error_imgcode_msg)
                    }
                    this.send_smscode_flag = false;
                    this.generate_imgcode();
                }
            }).catch(error => {
                console.log(error);
            });
        },
        // 校验⽤户名
        check_uname: function () {
            clearTimeout(this.username_timer);
            this.username_timer = setTimeout(() => {
                // 获取⽤户名
                let username = this.username;
                // 格式校验
                // 定义正则表达式
                // let reg = /^[a-zA-Z0-9_-]{1,40}$/;
                let reg = /^.{1,40}$/;
                // 校验⽤户名
                if (reg.test(username)) {
                    this.error_username = false;
                } else {
                    this.error_username = true;
                }
                // 是否重复名校验
                if (!this.error_username) {
                    // 发送ajax请求
                    axios.get('/usernames/'+this.username+'/count/', {
                        // params: {
                        //     username: username
                        // },
                        responseType: 'json'
                    }).then(response => { // 接收响应数据
                        console.log(response.data);
                        if (response.data.count == 0) {
                            // 未注册
                            this.error_username = false;
                        } else {
                            // 已注册
                            this.error_username = true;
                            this.error_username_msg = `⽤户名 ${this.username} 已存在！`
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            }, 1000);
            
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
            // let reg = /^(?=.*[A-Z|a-z|\d])[A-Za-z0-9_-,\.]{2,40}$/;
            let reg = /^(?=.*[A-Za-z0-9])[A-Za-z0-9_,.-]{2,40}$/;
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
        // check_imgcode: function () {
        //     clearTimeout(this.imgcode_timer);
        //     this.imgcode_timer = setTimeout(() => {
        //         let imgcode = this.imgcode;
        //         if (imgcode.length == 4) {
        //             this.error_imgcode = false;
        //         } else {
        //             this.error_imgcode = true;
        //         }
        //     }, 1000);
        // },
        // 监听表单提交事件
        reg_sub: function () {
            // 校验⽤户名
            this.check_uname();
            // 校验邮箱
            this.check_email();
            // 校验密码
            this.check_pwd();
            // 校验⼿机号
            // this.check_phone();
            // 校验验证码
            // this.check_smscode();
            // this.check_imgcode();
            // 如果有⼀个校验不通过，阻⽌表单提交
            if (this.error_username || this.error_email || this.error_password 
                // || this.error_phone || this.error_smscode || this.error_imgcode
                ) {
                // this.event.returnValue = false; // 另一种写法
                return;
            }
            console.log('Username: ', this.username);
            console.log('Email: ', this.email);
            console.log('Password: ', this.password);
            // 所有校验都通过，提交表单 如果前面设置了阻止表单提交，这里就需要添加提交表单
            // document.querySelector('form').submit();       
            // 发送ajax请求
            // axios.post('/register_test/', {
            //     username: this.username,
            //     email: this.email,
            //     password: this.password,
            //     // phone: this.phone,
            //     // smscode: this.smscode,
            //     // imgcode: this.imgcode
            // }, {
            //     headers: {
            //         'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            //     }
            // }).then(response => {
            //     console.log(response.data);
            //     if (response.data.code === 0) {
            //         // 注册成功
            //         window.location.href = '/login/';
            //     } else {
            //         // 注册失败
            //         alert(response.data.msg);
            //     }
            // }).catch(error => {
            //     console.log(error);
            // });
        }
    }
});