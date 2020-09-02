$(function() {
        $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        $('#link_login').on('click', function() {
            $('.reg-box').hide()
            $('.login-box').show()
        })
    })
    // 从 layui 中获取 form 对象以及layer模块
var form = layui.form

var layer = layui.layer
    // 通过 form.verify() 函数自定义校验规则
form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容

            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
    // 监听注册提交事件
$('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()

        }

        $.post('/api/reguser', data, function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            $('#link_login').click()
        })
    })
    // 登录表单提交POST
$('#form_login').submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: '/api/login',
        method: 'POST',
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('登录失败')
            }
            layer.msg('登陆成功')
                // console.log(res.token);
            localStorage.setItem('token', res.token)
            location.href = '/home/index.html'
        }
    })
})