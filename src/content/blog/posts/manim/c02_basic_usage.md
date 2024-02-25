---
title: updater 文档 | 第 2 节 基本使用
pubDate: 2022-07-01
tags:
  - manim
  - updater
  - 教程
category: manim
description: updater 难道不是和 up 约会的人吗？
---

## updater 是什么

请不要尝试用“更新器”来理解这个工具，毕竟用这种方式来理解并不方便。而又有群友提出了这样一种见解：

> [!quote] 来自 manim kindergarten 群友
> updater 可以看作是一种以==副作用==驱动的动画编写策略。

还有群友是这样认为的

> [!quote] Xx
> updater 不是和 up 约会的人吗？

## updater 怎么用

其实在一些情况下我是非常认同这一观点的，因为我们常用的 updater 方法大多都符合这一说法。在这里我们给一个例子，读者不妨实际操作一下。

```python
class BasicExample(Scene):
    def construct(self):
        # 创建物件
        dot = Dot(LEFT*2)
        text = Text("This is a dot").next_to(dot, RIGHT)
        # 添加更新，使得文本保持在点的右边
        text.add_updater(lambda m: m.next_to(dot, RIGHT))
        # 将点和物件添加到场景中
        self.add(dot, text)
        # 让点绕原点旋转一周
        self.play(Rotate(dot, PI * 2, about_point=ORIGIN), 
                  run_time=4.44)
```

在这一个例子中，updater 在感觉上很明显就是一种==副作用驱动==的例子。在动画中，我们只编写了点的旋转，但是文本的位置也随着点的运动而一起运动。

> 这不由得让笔者想起了 Vue 的依赖收集，当变量改变时，根据收集的依赖判断是否需要触发回调。

## 实际上它是如何工作的

在使用 `add_updater` 方法给物件添加更新的时候，它会将传入的参数保存到一个成员列表中，这一操作是为了在动画中，能够方便调用物件的更新。

```python
    def add_updater(self,
        update_function: Updater,
        index: int | None = None,
        call_updater: bool = True
    ):
        # 带有 dt
        if "dt" in get_parameters(update_function):
            # 基于时间的 updater 列表的引用
            updater_list = self.time_based_updaters
        else:
            # 普通的 updater 列表的引用
            updater_list = self.non_time_updaters

        # 向列表的引用中添加传入的更新函数
        if index is None:
            updater_list.append(update_function)
        else:
            updater_list.insert(index, update_function)

        # 更新是否含有 updater 的状态
        self.refresh_has_updater_status()
        for parent in self.parents:
            parent.has_updaters = True
        if call_updater:
            self.update(dt=0)
        return self
```

还记得上一节提到的 `update_mobject` 方法吗，Scene 的 `play` 方法每一帧都会遍历添加到场景中的物件，并且计算出这一帧它应该更新到哪一个状态。前面的“副作用”的错觉，其实相当于是动画引擎在静默的帮你处理所有隐含的动画和更新。因此我认为“副作用”这一说法也没有任何错。

```python {8,17,18,20,21}
# scene.py
class Scene(object):
    # ...
    def update_mobjects(self, dt: float) -> None:
        # 遍历场景中的 mobject
        for mobject in self.mobjects:
            # 逐一更新
            mobject.update(dt)

# mobject.py
class Mobject(object):
    # ...
    def update(self, dt: float = 0, recurse: bool = True):
        if not self.has_updaters or self.updating_suspended:
            return self
        # 遍历含 dt 的更新
        for updater in self.time_based_updaters:
            updater(self, dt)
        # 遍历不含 dt 的更新
        for updater in self.non_time_updaters:
            updater(self)
        if recurse:
            for submob in self.submobjects:
                submob.update(dt, recurse)
        return self
```

这是这样大多数情况下，当有物件添加了 updater ，那么整个执行的流程大致就是如下的样子（更多的内容还是建议看源码）：

```mermaid
graph TD

subgraph Scene
    a[添加updater] --> b[play]
    subgraph Animation
        c["update mobjects"] --> d["interpolate<br>动画插值变换"]
        d --> e["interpolate_mobject<br>根据插值变换物件"]
    end
    subgraph Updater
        f["update frames"] --> g["update mobjects"]
        g --> h["mobject.update(dt)<br>根据updater列表更新物件"]
    end
end

b --> c
b --> f
```


## 编写规范

在 `add_updater` 方法中，传入的参数是一个函数，当然也可以查看它的类型定义，它接受一个 Mobject 作为参数。

```python
TimeBasedUpdater = Callable[["Mobject", float], None]
NonTimeUpdater = Callable[["Mobject"], None]
Updater = Union[TimeBasedUpdater, NonTimeUpdater]
```

因此，我们可以这样写一个 updater

```python
def my_updater(m: Mobject):
    m.next_to(other_mobject, RIGHT)
    m.rotate(1 * DEGREES)

mob.add_updater(my_updater)
```

当然，对于一些比较简单的单行函数，也可以用 lambda 匿名函数来简化。

## 更多的例子

> [!caution] 注意
>
> 2022-07-01 版本的 manimgl 在使用 updater 组合上 become 会失效，具体原因可能是某处触发了 `suspend_updating`，导致更新被禁用。

这一部分作为一个练习，读者可以先尝试自己动手实现。在实现之后，再来看看笔者是如何实现的。

##### 1. 绘制一条线段 $AB$，并绘制它的垂直平分线，使得当线段 $AB$ 移动、旋转的时候，中垂线始终能够垂直平分这条线段。

![[_public/updater/PerpendicularBisectorExample.mp4]]

> [!example] 参考解答
> 
> ```python
> class PerpendicularBisectorExample(Scene):
>     def construct(self):
>         # 直线
>         line = Line(LEFT*2, RIGHT*2)
>         # 中垂线
>         bisector = line.copy().rotate(PI / 2).scale(5)
>         bisector.set_color(RED)
>         self.add(line, bisector)
> 
>         bisector.add_updater(
>             lambda m: m
>                 # 设置角度
>                 .set_angle(line.get_angle() + PI / 2)
>                 # 移动到线段的中点
>                 .move_to(line.get_center())
>         )
> 
>         # 变换直线
>         self.play(line.animate.put_start_and_end_on(
>             np.array([0, 1, 0]), np.array([4, 2, 0])
>         ))
>         # 旋转直线
>         self.play(Rotate(line, PI / 2))
> ```


##### 2. 绘制一段圆弧，使用两个 `ValueTracker` 分别控制它的弧度和半径。

> 这个样例暂时没有办法写，在先前版本是可以实现的

> [!example] 参考解答
> ```python
> class ArcExample(Scene):
>     def construct(self):
>         arc = Arc(angle=PI / 2, radius=2)
>         arc.set_color(YELLOW)
>         self.add(arc)
> 
>         radius = ValueTracker(2)
>         angle = ValueTracker(PI / 2)
>         arc.add_updater(lambda m: m.become(
>             Arc(angle=angle.get_value(), radius=radius.get_value())
>         ))
>         self.add(radius, angle)
> 
>         self.play(radius.animate.set_value(3))
>         self.play(angle.animate.set_value(PI))
> ```


##### 3. 绘制一条数轴，在上面添加一个点，使用 `ValueTracker` 类来控制点的位置，同时使用 `DecimalNumber` 来显示点所代表的数值。

![[_public/updater/NumberLineScene.mp4]]


> [!example] 参考解答
> 
> ```python
> class NumberLineScene(Scene):
>     def construct(self):
>         # 创建数轴
>         number_line = NumberLine(x_range=[-5, 5, 1], width=10)
>         number_line.add_numbers()
>         self.add(number_line)
> 
>         v = ValueTracker(0)
>         # 点
>         dot = Dot(number_line.n2p(v.get_value()), color=YELLOW)
>         # 显示数值
>         label = DecimalNumber(v.get_value(), num_decimal_places=2)
>         self.add(dot, label)
> 
>         dot.add_updater(
>             lambda m: m.move_to(
>                 number_line.n2p(v.get_value()) # 数轴上数值对映的实际坐标
>             )
>         )
>         label.add_updater(
>             lambda m: m
>                 .set_value(v.get_value())  # 设置数值
>                 .next_to(dot, UP)          # 设置位置
>         )
> 
>         self.play(v.animate.set_value(5), run_time=2)
>         self.play(v.animate.set_value(-4), run_time=3)
> ```

##### 4. 在坐标系上绘制一条函数 $y=\sin(x+\varphi)$，使用你觉得方便的方法，使得改变 $\varphi$ 值的时候，图像也能动态改变。

![[_public/updater/SineGraphScene.mp4]]

> [!example] 参考解答
> 
> ```python
> class SineGraphScene(Scene):
>     def construct(self):
>         # 坐标轴
>         axes = Axes(x_range=[-10, 10, 1], y_range=[-2, 2, 0.25])
>         self.add(axes)
>         
>         # 图像
>         graph = axes.get_graph(
>             lambda x: np.sin(x), x_range=[-9, 9, 0.1]
>         )
>         self.add(graph)
> 
>         # phi 的值
>         phi = ValueTracker(0)
>         
>         # 给 grahp 添加绑定
>         graph.add_updater(
>             lambda g: g.set_points(
>                 axes.get_graph(
>                     lambda x: np.sin(x + phi.get_value()),
>                     x_range=[-9, 9, 0.1]
>                 ).get_points()
>             )
>         )
> 
>         '''
>         # 在编写该文档的时候 updater 和 become 一起用的方法坏掉了
>         # 因此只能用 `set_points` 来暂时顶替一下
>         # 如果什么时候修好了可以直接 become 一个新的 graph
>         graph.add_updater(lambda g: g.become(
>             axes.get_graph(
>                 lambda x: np.sin(x + phi.get_value()), 
>                 x_range=[-9, 9, 0.1]
>             )
>         ))
>         '''
> 
>         self.add(phi, graph)
>         self.play(phi.animate.set_value(4), run_time=3)
> ```
> 
> 
> 

如果上面的这些例子读者都能写出来，并且能够举一反三，那么 updater 的基础使用应当是没有什么问题的了。
