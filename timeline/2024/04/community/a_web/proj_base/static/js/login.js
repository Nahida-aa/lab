let vue = new Vue({
    el: '#login',
    delimiters: ['${', '}'],
    data: {
        // v-model
        identifier: '',
        password: '',
        remember: "True",
        // v-message
        error_identifier_msg: '格式有误',
        error_pwd_msg: '密码格式有误',
        // v-show
        show_identifier_error: false,
        show_pwd_error: false,
        
    },
    methods: {
        login: function () {
            let self = this;
            axios.post('/login', {
                username: self.username,
                password: self.password
            }).then(function (response) {
                if (response.data.status === 'success') {
                    window.location.href = '/';
                } else {
                    self.error = response.data.message;
                }
            }).catch(function (error) {
                self.error = 'Error occurred while logging in';
            });
        }
    }
});
