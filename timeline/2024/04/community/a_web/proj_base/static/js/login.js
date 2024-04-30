let vue = new Vue({
    el: '#login',
    delimiters: ['${', '}'],
    data: {
        // v-model
        identifier: '',
        password: '',
        // v-message
        error_identifier_msg: '格式有误',
        error_pwd_msg: '密码格式有误',
        // v-show
        show_identifier_error: false,
        show_pwd_error: false,
        // qq
        qq_login_url: '',
        // github
        github_login_url: ''
    },
    created() {
        this.get_github_login_url();
      },
    methods: {
        Github_login() {
            window.location.href = this.github_login_url;
        },
        get_github_login_url() {
            axios.get('/oauth/github/login_url/')
                .then(response => {
                    this.github_login_url = response.data.github_login_url;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        login: function () {
            if (!this.identifier) {
                this.show_identifier_error = true;
                return;
            }
            if (!this.password) {
                this.show_pwd_error = true;
                return;
            }
            axios.post('/login', {
                identifier: this.identifier,
                password: this.password
            }).then(function (response) {
                if (response.data.code === 0) {
                    window.location.href = '/';
                } else {
                    alert(response.data.msg);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
});
