layui.use(['element', 'form', 'layer', 'jquery'], function() {
    var $ = layui.jquery,form = layui.form(),element = layui.element();
    var layer = layui.layer;
    var global = {};

    // 加载
    function loading(){
        $.ajax({
            url:'/menu/query',
            type:'POST',
            data:{roleId:1},
            dataType:'json',
            success : function(data){
                if(data.status === 200 && data.resultCode.code === 'SUCCESS'){
                    var list = data.data,html = '',num = 0;
                    while(list && (list.length > num)){
                        var item = list[num];
                        html += '<tr>';
                        html += '<td>'+item.name+'</td>';
                        html += '<td>'+(!item.parentId?'是':'否')+'</td>';
                        html += '<td>'+(!item.parentId?item.name:'#')+'</td>';
                        html += '<td>'+item.url+'</td>';
                        html += '<td>';
                        html += '<div class="layui-btn-group">';
                        html += '<button class="layui-btn layui-btn-warm layui-btn-small edit-node" customId="'+item.id+'">修改节点</button>';
                        html += '<button class="layui-btn layui-btn-danger layui-btn-small del-node" customId="'+item.id+'" customName="'+item.name+'">删除节点</button>';
                        html += '</div>';
                        html += '</td>';
                        html += '</tr>';
                        if(item.children && item.children.length>0){
                            html += eachHTMl(item.name,item.children);
                        }
                        num++;
                    }
                    html && $('#table_body').html(html);
                    global.data = function(){
                        var tempArr = [];
                        for(var i=0;i<list.length;i++){
                            var item = list[i];
                            if(item.children && item.children.length > 0){
                                tempArr = tempArr.concat(item.children);
                                // delete item.children;
                            }
                            tempArr.push(item);
                        }
                        return tempArr;
                    }();
                    if(global.data && global.data.length>0){
                        global.selectData = function(){
                            var tempArr = [];
                            for(var i=0;i<global.data.length;i++){
                                var item = global.data[i];
                                if(!item.parentId){
                                    tempArr.push(item);
                                }
                            }
                            return tempArr;
                        }();
                    }
                    bind();
                }else{
                    console.error(data);
                    layer.msg('查询失败!', {
                        icon: 2
                    });
                }
            },
            error:function(error){
                layer.closeAll();
                console.error(error)
                layer.msg('查询失败!', {
                    icon: 2
                });
            }
        });
    };

    loading();

    form.verify({
        navName: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){return '导航名称不能有特殊字符';}
            if(/(^\_)|(\__)|(\_+$)/.test(value)){return '导航名称首尾不能出现下划线\'_\'';}
            if(/^\d+\d+\d$/.test(value)){return '导航名称不能全为数字';}
            global.data && global.data.some(function(item){
                return (item.name == value)?'导航名称已存在，请重新填写':false;
            });
        }
    });     
    //监听提交
    form.on('submit(addNodeform)', function(data) {
        var data = data.field;
        $.ajax({
            url:'/menu/add',
            type:'POST',
            data:{name:data.title,url:data.url,parentId:(data.parentNodeId=='#')?'0':data.parentNodeId,isParent:data.isParent},
            dataType:'json',
            success:function(data){
                layer.closeAll();
                if(data.status === 200 && data.resultCode.code === 'SUCCESS'){
                    layer.msg('添加成功!', {
                        icon: 1
                    });
                    loading();
                    // $('button[type="reset"]').click();
                    $('#tipForm_add').find('input[name="title"]').val('');
                    $('#tipForm_add').find('input[name="url"]').val('');
                    $('input:radio[name="isParent"]').get(0).checked = true;
                    $('#parentNodeId').find("option[value='#']").attr("selected",true);
                    $('#parentNodeId').attr('disabled',true);
                }else{
                    console.error(data);
                    layer.msg('添加失败!', {
                        icon: 2
                    });
                }
            },
            error:function(error){
                console.error(error);
                layer.closeAll();
                layer.msg('添加失败!', {
                    icon: 2
                });
            }
        });
//				form.render();
        return false;
    });
    //监听radio
    form.on('radio(isParentRadio)', function(data){
        if(data.value==='1'){
            $("#parentNodeId").find("option").attr("selected",false).find("option[text='#']").attr("selected");
        }
        $('#parentNodeId').attr('disabled',(data.value==='1')?true:false);
        form.render('select');
    });
    //监听radio
    form.on('radio(navigation_isParentRadio)', function(data){
        if(data.value==='1'){
            $("#navigation_parentNodeId").find("option").attr("selected",false).find("option[text='#']").attr("selected");
        }
        $('#navigation_parentNodeId').attr('disabled',(data.value==='1')?true:false);
        form.render('select');
    });
    //监听修改
    form.on('submit(editNodeform)', function(data) {
        var data = data.field;
        data.id = $('#navigation_id').val();

        $.ajax({
            url:'/menu/modify',
            type:'POST',
            data:{name:data.navigation_title,url:data.navigation_url,parentId:(data.navigation_parentNodeId=='#')?'0':data.navigation_parentNodeId,isParent:data.navigation_isParent,id:data.id},
            dataType:'json',
            success:function(data){
                layer.closeAll();
                if(data.status === 200 && data.resultCode.code === 'SUCCESS'){
                    layer.msg('修改成功!', {
                        icon: 1
                    });
                    loading();
                }else{
                    console.error(data);
                    layer.msg('修改失败!', {
                        icon: 2
                    });
                }
            },
            error:function(error){
                console.error(error);
                layer.closeAll();
                layer.msg('修改失败!', {
                    icon: 2
                });
            }
        });
        return false;
    });
    // 新增节点
    $('.add-node').on('click',function(e){
        if(global.selectData){
            $('#parentNodeId').html('<option value="#">#</option>');
            for(var i=0;i<global.selectData.length;i++){
                var item = global.selectData[i];
                $('#parentNodeId').append('<option value="'+item.id+'">'+item.name+'</option>');
            }
        }
        layer.open({
            title:'添加节点',
            skin: 'layui-layer-rim',//加上边框
            type: 1,
            area: ['520px', '340px'],//宽高
            shadeClose: true,//开启遮罩关闭
            content: $('#tipForm_add') 
        });
    });
    // 生成子节点
    function eachHTMl(parentName,childenArr){
        var html = '';
        var ii = 0;
        var iconHove = '<i class="layui-icon" style="font-size: 24px; color: #1E9FFF;vertical-align: middle;padding-right:10px;">&#xe602;</i>';  
        while(childenArr && (childenArr.length > ii)){
            var item = childenArr[ii];
            html += '<tr>';
            html += '<td>'+iconHove + item.name+'</td>';
            html += '<td>'+(!item.parentId?'是':'否')+'</td>';
            html += '<td>'+(item.parentId?parentName:'#')+'</td>';
            html += '<td>'+item.url+'</td>';
            html += '<td>';
            html += '<div class="layui-btn-group">';
            html += '<button class="layui-btn layui-btn-warm layui-btn-small edit-node" customId="'+item.id+'">修改节点</button>';
            html += '<button class="layui-btn layui-btn-danger layui-btn-small del-node" customId="'+item.id+'" customName="'+item.name+'">删除节点</button>';
            html += '</div>';
            html += '</td>';
            html += '</td>';
            ii++;
        }
        return html;
    };
    // 绑定事件
    function bind(){
        // 修改节点
        $('.edit-node').on('click',function(){
            var customId = $(this).attr('customId');
            $('#navigation_id').val(customId);
            var editItem = null;
            for(var i=0;i< global.data.length;i++){
                var item = global.data[i];
                if(item.id == customId*1){
                    editItem = item;
                    break ;
                }
            }
            if(editItem){
                // 打开修改页面，将对象赋值，然后修改
                layer.open({
                    title:'添加节点',
                    skin: 'layui-layer-rim',//加上边框
                    type: 1,
                    area: ['520px', '340px'],//宽高
                    shadeClose: true,//开启遮罩关闭
                    content: $('#tipForm_edit') 
                });
                if(global.selectData){
                    $('#navigation_parentNodeId').html('<option value="#">#</option>');
                    for(var i=0;i<global.selectData.length;i++){
                        var item = global.selectData[i];
                        if(item.id != customId){
                            $('#navigation_parentNodeId').append('<option value="'+item.id+'">'+item.name+'</option>');
                        }
                    }
                }
                $('#navigation_title').val(editItem.name);
                $('#navigation_url').val(editItem.url);
                $("#navigation_parentNodeId").find("option").attr("selected",false)
                $("input:radio[name='navigation_isParent']").removeAttr("checked"); 
                if(editItem.parentId || editItem.parentId>0){
                    $('#navigation_isParent0').get(0).checked = true;
                    $("#navigation_parentNodeId").find("option[value='"+editItem.parentId+"']").attr("selected",true);
                    $('#navigation_parentNodeId').attr('disabled',false);
                }else{
                    $('#navigation_isParent1').get(0).checked = true;
                    $('#navigation_parentNodeId').find("option[value='#']").attr("selected",true);
                    $('#navigation_parentNodeId').attr('disabled',true);

                }
                form.render();
            }
        });
        // 删除节点
        $('.del-node').on('click',function(e){
            var customId = $(this).attr('customId');
            var customName = $(this).attr('customName');
            layer.confirm('确定删除当前导航？', {
                shadeClose: true, //开启遮罩关闭
                btn: ['取消', '删除'] //按钮
            }, function() {
                layer.closeAll();
            }, function() {
                $.ajax({
                    url:'/menu/remove',
                    type:'POST',
                    data:{id:customId,name:customName},
                    dataType:'json',
                    success:function(data){
                        if(data.status === 200 && data.resultCode.code === 'SUCCESS'){
                            loading();
                            layer.msg('删除成功!', {
                                icon: 1
                            });
                        }else{
                            console.error(data);
                            layer.msg('删除失败!', {
                                icon: 2
                            });
                        }
                    },
                    error:function(error){
                        console.error(error);
                        layer.closeAll();
                        layer.msg('删除失败!', {
                            icon: 2
                        });
                    }
                });
            });
        });
    };
});