$(function() {
    getUserInfo()

    var layer = layui.layer
        // 退出
    $('#btnLogout').on('click', function() {
        layer.confirm('确认退出吗?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token')
            location.href = '/home/login.html'
                // 关闭 confirm 询问框
            layer.close(index)
        })
    })

    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户内容失败')
                }
                // 调用 renderAvatar 渲染用户的头像
                renderAvatar(res.data)
                    // console.log(res);
            }
        })
    }

    function renderAvatar(user) {
        // 获取用户名
        var name = user.nickname || user.username
            // console.log(name);
            // 设置欢迎的文本、
        $('#welcome').html('欢迎&nbsp;' + name)
            // 渲染用户头像
        if (user.user_pic !== null) {
            // 3.1 渲染图片头像
            $('.layui-nav-img')
                .attr('src', user.user_pic)
                .show()
            $('.text-avatar').hide()
        } else {
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text-avatar')
                .html(first)
                .show()
        }
    }
})