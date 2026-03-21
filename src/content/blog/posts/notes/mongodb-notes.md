---
title: MongoDB 基本使用记录
pubDate: 2022-05-25
category: 数据库
tags:
  - MongoDB
  - 数据库
  - NoSQL
  - Database
description: MongoDB 基本使用的说明，大部分内容来自 runoob
updatedDate: 2022-05-25
---

## 1. 关于 MongoDB 的启动和安全验证

### 1.1. 配置文件

如果是原生 MongoDB 启动服务，那么应该是没有验证的。但是如果在配置文件中写入

```yaml
security:
  authentication: enabled
```

这样每个数据库都可以有独立的管理员了。

### 1.2. 启动

使用命令，按照配置文件中的参数来启动 mongod 服务

```shell
mongod --config /opt/homebrew/etc/mongod.conf
```

### 1.3. 数据库管理员

给 admin 表添加管理员

```js
// use admin
db.createUser({
  user: 'admin',
  pwd: '123456',
  roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }],
})
```

给 test 表添加用户 admin

```js
// use test
db.createUser({
  user: 'admin',
  pwd: '123456',
  roles: [{ role: 'dbOwner', db: 'test' }],
})
```

于是我们可以在进入这个数据库后，使用命令

```js
db.auth('admin', '123456')
```

才能看到数据库的内容。

### 1.4. 关闭数据库服务

进入 mongo

```js
db.shutdownServer()
```

### Question

其实还不是很明白每个数据库都有自己的管理员，在自定义的数据库添加用户之后，虽然在 `admin` 表的 `system.users` 已经能看到有这个用户了，但是好像有时候还是没法验证。

## 2. 基本操作

### 2.1. 查询

这块其实感觉没什么好讲的，对于这样的==文档查询==，就是去匹配键值对，也就是说可以这样去描述查询语句

```js
db.students.find({ name: 'Jack' })
```

这样就可以查到 name 属性值为 Jack 的文档。当然，还有一些例如 `findOne` 之类的用法，其实都比较简单。

## 2.2. 插入

关于插入，有两种方式：insert 和 save。两者还是有区别的

- insert：当没有冲突时插入，但有冲突时抛出异常
- save：没有冲突时插入，有冲突时==替换==

然而 insert 的效率据说要比 save 高，毕竟它只有一个插入的操作，如果 hash 冲突就会引发异常，这是比较明显的。而 save 这样操作就要去解决这样的冲突，而后去替换，这样操作听上去可能理所应当地，效率更低了。

与此同时，还有一些例如 `insertMany` 之类的批量插入的方法，传入的就是列表了。

```js
db.students.insert({
  name: 'Milly',
  age: 18,
})

db.students.insertMany([
  { name: 'Jack', age: 20 },
  { name: 'Tim', age: 22, salary: 3000 },
])
```

### 2.3. 更新

#### 使用 update 方法

```
db.collection.update(
    <query>,   // 查询的条件
    <update>,  // 更新的对象和一些操作符
    {
        upsert: <boolean>,  // 不存在则插入
        multi: <boolean>,   // 存在多条匹配则全部更新，否则只更新第一个
        writeConcern: <document>   // 抛出异常的级别
    }
)
```

针对 `<update>`，有一些必要的描述：

- 如果直接写一个对象，那么应该会将匹配到的这个文档==直接替换==为新给定的文档
- 使用 `$set: { key: value }` 可以只将对象的这个属性更新为新的值

```js
db.students.update(
  { name: 'Jack' },
  { $set: { age: 20 } }, // 只将年龄更新为 20
)

db.students.update(
  { name: 'Tim' },
  { $inc: { salary: 2000 } }, // 给 Tim 增加 2000 工资
)
```

#### 使用 save 方法

上面已经提到，不再赘述。

### 2.4. 删除

```js
db.collection.deleteOne(query)
db.collection.deleteMany(query)
```

在这种数据库中直接删除文档其实是相当划不来的，这样会破坏其索引，而它本质的操作就是给数据加一个隐藏的==已删除属性==

### 2.5. 条件运算符

找出大于 19 岁的对象

```js
db.students.find({ age: { $gt: 19 } })
```

有了这样一个例子，剩余的一些操作符就相对来说很简单了：

- `$gt` `$gte` 大于 / 大于等于
- `$lt` `$lte` 小于 / 小于等于
- `$eq` `$ne` 相等 / 不等

### 2.6. Limit & skip

- limit 用于限制查询记录的条数
- skip 用于跳过一定数量的文档

查询第 11 条到 15 条记录

```js
db.students.find().skip(10).limit(5)
```

### 2.7. 排序

`key` 指定排序的字段，1 指定为升序，-1 为降序

```js
db.students.find().sort({ age: 1 })
```

### 2.8. 聚合

> 建议使用 MongoDB Compass 作为辅助

```js
db.collection.aggregate(AGGREGATE_OPERATION)
```

AGGREGATE_OPERATION 为一个数组，包含了一系列处理的对象。这些对象被放到一个管道 (pipeline) 中，层层处理最后输出。如果没有指定 `$out` 输出到哪里，则会使用临时集合。

```js
;[
  {
    // 跳过 100k 条数据
    $skip: 100000,
  },
  {
    // 使用 group 聚合
    $group: {
      _id: {
        // 将下面这个 Object 作为 key
        provinceName: '$provinceName',
        updateTime: {
          $substr: ['$updateTime', 0, 10],
        },
      },
      // 以下作为其他的查询属性
      continentName: { $first: '$continentName' },
      continentEnglishName: { $first: '$continentEnglishName' },
      countryName: { $first: '$countryName' },
      countryEnglishName: { $first: '$countryEnglishName' },
      provinceName: { $first: '$provinceName' },
      provinceEnglishName: { $first: '$provinceEnglishName' },
      province_zipCode: { $first: '$province_zipCode' },
      province_confirmedCount: { $first: '$province_confirmedCount' },
      province_curedCount: { $first: '$province_curedCount' },
      province_suspectedCount: { $first: '$province_suspectedCount' },
      province_deadCount: { $first: '$province_deadCount' },
      updateTime: { $first: '$updateTime' },
    },
  },
  {
    // 按照 _id.updateTime 升序排序
    $sort: { '_id.updateTime': 1 },
  },
  {
    // 结果合并到集合中
    // 使用 $out 覆盖到输出集合中
    $merge: 'ProvinceData',
  },
]
```

其他的用法待补充

## 3. 高级用法

### 3.1. Map Reduce

老朋友了，用这个方法处理数据非常灵活。先上官方的流程图

![[_public/posts-imgs/map-reduce.bakedsvg.svg]]

其实看流程图应该也就一目了然了。它主要就是这样几步骤

1. 查询匹配的数据
2. 遍历这些数据，把需要用到的数据提取出来，得到一系列 `{ key: values }` 的键值对
3. 对数据进行筛选，从 values 中计算出有意义的值，作为 value 输出

最终结果为一个 `{ key: value }` 的数组。（这就是为什么我最终还是用聚合来处理数据了😭它会把数据封装成 Object😩）

To be continued...
