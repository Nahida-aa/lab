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
    },
    methods: {
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
