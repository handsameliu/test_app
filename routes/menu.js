var express = require('express');
var router = express.Router();
const request = require('axios');
const querystring = require('querystring');
const ip = 'http://192.168.3.121:8080/semioe-manager-web';

router.post('/query', function(req, res, next) {
    let {roleId} = req.body;
    console.log(roleId);

    // res.json({
    //     "status": 200,
    //     "resultCode": {
    //         "code": "SUCCESS",
    //         "message": "查询菜单成功！"
    //     },
    //     "token": null,
    //     "data": [
    //         {
    //             "id": 11,
    //             "name": "一级1",
    //             "url": "111111",
    //             "parentId": null,
    //             "createTime": 1499914148000,
    //             "updateTime": 1499914155000,
    //             "inUse": "1",
    //             "children": [
    //                 {
    //                     "id": 111,
    //                     "name": "一级11",
    //                     "url": "111111",
    //                     "parentId": 11,
    //                     "createTime": 1499914148000,
    //                     "updateTime": 1499914155000,
    //                     "inUse": "1"
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 12,
    //             "name": "一级2",
    //             "url": "111111",
    //             "parentId": null,
    //             "createTime": 1499914148000,
    //             "updateTime": 1499914155000,
    //             "inUse": "1",
    //             "children": [
    //                 {
    //                     "id": 112,
    //                     "name": "一级21",
    //                     "url": "111111",
    //                     "parentId": 12,
    //                     "createTime": 1499914148000,
    //                     "updateTime": 1499914155000,
    //                     "inUse": "1"
    //                 },
    //                 {
    //                     "id": 114,
    //                     "name": "一级22",
    //                     "url": "111111",
    //                     "parentId": 12,
    //                     "createTime": 1499914148000,
    //                     "updateTime": 1499914155000,
    //                     "inUse": "1"
    //                 },
    //                 {
    //                     "id": 115,
    //                     "name": "一级23",
    //                     "url": "111111",
    //                     "parentId": 12,
    //                     "createTime": 1499914148000,
    //                     "updateTime": 1499914155000,
    //                     "inUse": "1"
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 13,
    //             "name": "一级3",
    //             "url": "111111",
    //             "parentId": null,
    //             "createTime": 1499914148000,
    //             "updateTime": 1499914155000,
    //             "inUse": "1",
    //             "children": [
    //                 {
    //                     "id": 113,
    //                     "name": "一级31",
    //                     "url": "111111",
    //                     "parentId": 13,
    //                     "createTime": 1499914148000,
    //                     "updateTime": 1499914155000,
    //                     "inUse": "1"
    //                 }
    //             ]
    //         }
    //     ],
    //     "successful": true
    // });
    console.log('roleId------',roleId);
    request.post(ip+'/menu/query',querystring.stringify({roleId})).then((result) => {
        result = result.data;
        res.json(result);
    }).catch((error) => {
        console.error(error);
        res.json(error);
    });
});
router.post('/remove', function(req, res, next) {
    let {id,name} = req.body;
    console.log('id------',id);
    console.log('name------',name);
    request.post(ip+'/menu/remove',querystring.stringify({id,name})).then((result) => {
        result = result.data;
        res.json(result);
    }).catch((error) => {
        console.error(error);
        res.json(error);
    });
});
router.post('/add', function(req, res, next) {
    let {name,url,parentId,isParent} = req.body;
    console.log('name------',name);
    console.log('url------',url);
    console.log('parentId------',parentId);
    console.log('isParent------',isParent);
    request.post(ip+'/menu/add',querystring.stringify({name,url,parentId,isParent})).then((result) => {
        result = result.data;
        res.json(result);
    }).catch((error) => {
        console.error(error);
        res.json(error);
    });
});
router.post('/modify', function(req, res, next) {
    let {id,name,url,parentId,isParent} = req.body;
    console.log('id------',id);
    console.log('name------',name);
    console.log('url------',url);
    console.log('parentId------',parentId);
    console.log('isParent------',isParent);
    request.post(ip+'/menu/modify',querystring.stringify({id,name,url,parentId,isParent})).then((result) => {
        result = result.data;
        res.json(result);
    }).catch((error) => {
        console.error(error);
        res.json(error);
    });
});

module.exports = router;