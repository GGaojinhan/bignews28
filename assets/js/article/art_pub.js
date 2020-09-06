$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
        // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }
    //初始化图片剪裁器
    var $image = $('#image')

    //剪裁选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'

    }

    // 初始化裁剪区
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }

        // 根据文件，创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })



    // 定义文章发布状态
    var art_state = '已发布'

    // 为存为草稿按钮定义点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        //基于form创建formData对象
        var fd = new FormData($(this)[0])
            // 将文件发布状态存到fd
        fd.append('state', art_state)

        // fd.forEach(function(v, k) {
        //         console.log(k, v);
        //     })
        // 将剪裁的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                publishArticle(fd)
            })
            // fd.forEach(function(v, k) {
            //     console.log(k, v);
            // })
    })


    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                // 发布文章成功后，跳转到文章列表页面
                layer.msg('发布成功')

                // 用点击方便高亮样式改变
                window.parent.$('.layui-layout-body .aaabbb').click()
                    // location.href = '/article/art_list.html'
            }
        })
    }

})