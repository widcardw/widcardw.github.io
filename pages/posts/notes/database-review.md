---
title: 数据库复习
date: 2021-07-02
tags: 
  - '学习'
  - '数据库'
article: true
---

## 说明

本篇仅为博主数据库期末考试的复习资料，应该不会有侵权……吧。

## 解释以下术语：数据、数据库、实体、模式、外模式、内模式。

|概念|定义|
|:---:|---|
|数据|描述事物的符号记录|
|数据库|长期存储在计算机内、有组织、可共享的大量数据的集合|
|实体|客观存在并可区别的事物|
|模式|也称逻辑模式，是数据库中全体数据的逻辑结构和特征的描述，是所有用户的公共数据视图|
|外模式|也称子模式或用户模式，是数据库用户能够看见和使用的局部数据的逻辑结构和特征的描述，是数据库用户的数据视图，是与某一应用有关的数据的逻辑表示|
|内模式|也称存储模式，一个数据库只有一个内模式，是数据物理结构和存储方式的描述，是数据在数据库内部的组织方式|

## 常用的数据模型有哪几个?

- 概念模型
- 逻辑模型和物理模型

|数据模型|与 DBMS 相关性|特点|
|:---:|:---:|---|
|概念模型|与 DBMS 无关|按用户观点对数据进行建模|
|逻辑模型|与 DBMS 相关|包括层次、网状、关系……按计算机系统的观点对数据建模，主要用于数据库管理的实现|
|物理模型|与 DBMS/OS 相关|对数据最底层的抽象，面向计算机系统|

## 什么叫数据与程序的物理独立性？什么叫数据与程序的逻辑独立性？

|独立性|概念|
|:---:|---|
|物理独立性|当数据库的存储结构改变时，由数据库管理员对模式 / 内模式映象作相应改变，可以使模式保持不变，从而应用程序也不必改变。保证了程序与数据的物理独立性。|
|数据独立性|当模式改变时，由数据库管理员对各个外模式 / 模式的映像作相应改变，可以使外模式保持不变。应用程序是依据数据的外模式编写的，从而应用程序不必修改，保证了数据与程序的逻辑独立性|

## 关系模型的三个要素

- 关系数据结构
  - 关系模型中只包含单一的数据结构——关系，在用户看来关系模型中数据的逻辑结构是一张扁平的二维表
- 关系操作
  - 查询：选择、投影、连接、并、差、交、笛卡尔积
  - 更新（插入、删除、修改）
- 关系的完整性约束
  - 实体完整性
  - 参照完整性
  - 用户定义完整性
   
## 关系的完整性约束有哪些？

   - 实体完整性
   - 参照完整性
   - 用户定义完整性

## 试述SQL语言的特点。

   - 综合统一
   - 高度非过程化
   - 面向集合的操作方式
   - 以同一种语法结构提供多种使用方式
   - 语言简洁，易学易用

## 基本关系有哪些性质？

   - 列是同质的，即每一列中的分量是同一类型的数据，来自同一个域
   - 不同的列可出自同一个域
   - 列的顺序组所谓，次序可以任意交换
   - 任意两个元组的候选码不能取相同的值
   - 行的顺序无所谓，次序可以任意交换
   - 分量必须取原子值，即每个分量都必须是不可分的数据项

## 什么是等值连接？什么是自然连接？

   - 等值连接
 - $\theta$ 为“$=$”的连接运算称为等值连接，从关系 $R$ 与 $S$ 的广义笛卡儿积中选取 $A$、$B$ 属性值相等的那些元组，即等值连接为
  $${R\underset{A=B}\Join S}=\{\overset\frown {t_rt_s}|t\in R\wedge t_s\in S\wedge t_r [A]=t_s[B]\}$$
   - 自然连接
 - 是一种特殊的等值连接，要求两个关系中进行比较的分量必须是同名属性组，并且在结果中把重复的属性去掉。即若 $R$ 和 $S$ 中具有相同的属性组 $B$，$U$ 为 $R$ 和 $S$ 的全体属性集合，则自然连接可记作
 $$R\Join S=\{\overset\frown{t_rt_s}[U-B]|t_r\in R\wedge t_s\in S\wedge t_r[A]=t_s[B]\}$$

## 数据库的完整性概念与数据库的安全性概念有什么区别和联系？

|概念|定义|区别|对象|
|:---:|---|---|---|
|数据库的完整性|指数据的正确性和相容性|防止数据库中存在**不符合语义/不正确**的数据|数据库的完整性的防范对象是不符合语义的数据|
|数据库的安全性|保护数据库以防止不合法使用所造成的数据泄露、更改和破坏|保护数据库**防止恶意破坏和非法存取**|数据库的安全性防范的对象是非法操作和未授权的用户|
 
联系：两者都是对数据库中的数据进行控制，各自所实现的功能不同

## DBMS的安全子系统主要有哪两部分组成？

- 安全性管理子系统
  - 保护数据库，以防止因非法使用数据库，造成的数据泄漏，更改或破坏
- 恢复管理子系统
  - 将数据库从错误的状态恢复到某一已知的正确的状态

## 根据数据模型的组成要素叙述关系模型的组成结构。

|数据模型的组成要素|关系模型的组成结构|
|:---:|:---:|
|数据结构|关系数据结构|
|数据操作|关系操作集合|
|数据的完整性约束条件|关系完整性约束|

## 试述实现数据库安全性控制的四种常用方法和技术。（有问题？）

1. 用户标识和鉴别
2. 存取控制
3. 视图机制
4. 审计
5. 数据加密


## 解释下列概念：候选码、主码、 1NF、2NF、3NF、BCNF

- 候选码
  - 若关系中的一个属性或属性组的值能够唯一地标识一个元组，且他的真子集不能唯一的标识一个元组，则称这个属性或属性组做候选码。
  - 设 $K$ 为 $R<U,F>$ 中的属性或属性组合，若 $K\overset{F}\rightarrow U$，则 $K$ 为 $R$ 的候选码
- 主码
  - 主关键字，用于唯一标识表中的某一条记录
- $1NF$
  - 一个二维表，每一个分量必须是不可分的数据项
- $2NF$
  - 若 $R\in 1NF$，且每个非主属性完全函数依赖于任何一个候选码，则 $R\in 2NF$
- $3NF$：
  - 设关系模式 $R<U,F>\in 1NF$，若 $R$ 中不存在这样的码 $X$，属性组 $Y$ 及非主属性 $Z(Z\nsubseteq Y)$ 使得 $X\rightarrow Y, Y\rightarrow Z$ 成立，$Y\nrightarrow X$，则称 $R<U,F>\in 3NF$
- $BCNF$：
  - 关系模式 $R<U,F>\in 1NF$，若 $X\rightarrow Y$ 且 $Y\nsubseteq X$ 时 $X$ 必含有码，则 $R<U,F>\in BCNF$.

## 规范化理论主要解决什么问题？

- 如何构造合适的数据模式即逻辑结构的问题。

## 详细叙述数据库设计的基本步骤。

1. 需求分析阶段
   - 准确了解与分析用户需求，包括数据与处理。
2. 概念结构设计阶段
   - 通过对用户需求进行综合、归纳和抽象，形成一个独立于具体数据库管理系统的概念模型。
3. 逻辑结构设计阶段
   - 将概念结构转换为某个数据库管理系统所支持的数据类型，并对其进行优化。
4. 物理结构设计阶段
   - 为逻辑数据模型选取一个最合适的应用环境的物理结构（包括存储结构和存取方法）。
5. 数据库实施阶段
   - 设计人员运用数据库管理系统提供的数据库语言及其宿主语言，根据逻辑设计和物理设计的结果建立数据库，编写与调试应用程序，组织数据入库，并进行试运行。
6. 数据库运行和维护阶段
   - 数据库应用系统经过试运行后即可投入正式运行，在数据库系统运行过程中必须不断地对其进行评估、调整与修改。

## 数据字典的内容和作用是什么？

- 内容
  - 进行详细的数据收集和数据分析所获得的主要成果。是关于数据库中数据的描述。数据字典通常包括数据项、数据结构、数据流、数据存储和处理过程几部分。
- 作用
  - 数据字典通过对数据项的数据结构的定义来描述数据流、数据存储的逻辑内容。

## 什么是 $E-R$ 图？构成 $E-R$ 图的基本要素是什么？

- 定义
  - $E-R$ 图提供了表示实体型、属性和联系的方法。
- 基本要素
  - 实体型（矩形）
  - 属性（椭圆）
  - 联系（菱形）

## $E-R$ 图之间的冲突主要有哪三类？

1. 属性冲突
   - 属性值的类型、取值范围、取值集合不同
2. 命名冲突
   - 同名异义，异名同义
3. 结构冲突
   - 同一对象在不同应用中具有不同的抽象；同一实体在不同子系统的 $E-R$ 图中所包含的属性个数和排列不完全一致；实体间的联系子啊不同的 $E-R$ 图中为不同的类型。

## 叙述事务的基本概念，以及 $ACID$ 特性。

- 事务
  - 用户定义的一个数据库操作序列，这些操作要么全做，要么全不做，是一个不可分割的工作单位。
- $ACID$ 特性
  - 原子性
    - 事务是数据库的逻辑工作单位，事务中包括的诸操作要么都做，要么都不做
  - 一致性
    - 事务的执行结果必须是使数据库从一个一致性状态变到另一个一致性状态。
  - 隔离性
    - 一个事务的执行不能被其他事务干扰
  - 持续性
    - 一个事务一旦提交，它对数据库中数据的改变就是永久性的。