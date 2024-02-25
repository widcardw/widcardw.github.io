---
title: updater 文档 | 第 1 章 前置知识
pubDate: 2022-06-30
tags:
  - manim
  - updater
  - 教程
category: manim
description: 从 Mobject 到 Animation 再到 Scene，分析 manim 是如何构建动画的
---


> [!caution] 注意
> 该文档为 widcardw 个人理解，如有任何描述不得体，或分析错误的地方，欢迎读者指出。\
> 另外，欢迎读者到 B 站观看笔者在很早以前做的[讲解视频](https://space.bilibili.com/31976300/channel/collectiondetail?sid=79029&ctype=0)，或许对大家的理解有帮助

## Mobject

manim 中，能够呈现在屏幕上的所有物件，包括基本图形、文字、坐标系等等，这些都是继承于 Mobject 类的。

不管是 cairo 版本还是 gl 版本，它们都会在创建 Mobject 实例的时候进行一系列的初始化，在这初始化的过程中，其实就有一小部分涉及到了==图形接口==。虽然两种版本的接口有所不同，但大体上都是初始化锚点、颜色等等（gl 版本增加了一些事件侦听、 shader data 之类的元素）。在做好物件 **自身数据** 相关的初始化之后，就需要将这一“管道”连接到图形接口上，在这些流程走完后，才能将我们所想要的画面呈现在屏幕上。

wid 曾无数次劝新手通过看源码来学习 manim ，因为写教程的人真的太少了 `¯\_(ツ)_/¯` 在有编程基础的情况下，反而看源码成了效率最高的学习方式。

然而，我们看源码也是挺头疼的，有时还会忽略一些要点。

```python {6}
class Mobject(object):
    def __init__(self, **kwargs):
            # ...
            self.init_data()
            self.init_uniforms()
            self.init_updaters()
            self.init_event_listners()
            self.init_points()
            self.init_colors()
            self.init_shader_data()

            if self.depth_test:
                self.apply_depth_test()
```

没错，就是这个 `init_updaters` 方法。它的具体代码是这样的：

```python
def init_updaters(self):
    self.time_based_updaters: list[TimeBasedUpdater] = []
    self.non_time_updaters: list[NonTimeUpdater] = []
    self.has_updaters: bool = False
    self.updating_suspended: bool = False
```

这一个初始化操作，就是为 Mobject 实例的成员中，注入了两个 updater 的列表，以及一些“开关”来控制物体是否进行更新。有了这些成员变量，才能驱使 Mobject 能够在这个动画引擎中发生更新。

```python {4-7}
def update(self, dt: float = 0, recurse: bool = True):
    if not self.has_updaters or self.updating_suspended:
        return self
    for updater in self.time_based_updaters:
        updater(self, dt)
    for updater in self.non_time_updaters:
        updater(self)
    if recurse:
        for submob in self.submobjects:
            submob.update(dt, recurse)
    return self
```

我们可以看到，每次更新都会触发 Mobject 调用列表中的方法，从而更新 Mobject 自身的状态，这样就会让视频的每一帧都出现不同的画面，也就是我们所看到的动画了。

## Animation

动画是 manim 中一项极为惊艳的特征，因为这些动画看上去相当优雅，很有观赏性。正因为它的效果震住了我们， 于是我们也就理所应当地认为动画的实现很复杂。

然而事实上不是这样的，它的代码实现其实反而出乎意料的简单。

> [!note] 一些动画的概念
> 首先，动画其实也是有 finite 和 infinite 的区分，也就是说，动画可以分为==有始有终==的动画和==无限播放==的动画。
>
> - 针对有穷动画，大多数情况下，我们都会要求它有==起始点==和==结束点==，分别定义为 `begin` 和 `finish`
> - 针对无穷动画，我们可能只需要考虑它的起始点，之后就可以任其发展了
>
> 在这里所提到的，继承于 `Animation` 的动画，大多是有穷动画。而有穷动画的过程，大多都是由==插值==来完成的。

我们常常这样编写动画

```python {4}
class ExampleScene(Scene):
    def construct(self):
        text = Text("Hello world")
        self.play(Write(text))
```

书写动画这么照着分析，可以分成两个过程

- `Write(text)` 看上去是一个函数调用，其实应当是创建了一个 `Write` 的实例
- Scene 通过 `play` 方法执行这个动画的实例，生成了书写的动画

而在第一步过程中，其实已经做了不少处理。如果我们去阅读 `Animation` 的源码，发现它定义了很多的方法，但是并没有直接在类当中连接起来，相互调用，形成动画。这是因为所有的动画，其实都应当依托于 `Scene` 这个“大容器”，只有在场景中，动画才能播放的起来。

我们先来看看 `Animation` 都定义了哪些方法

```python
class Animation(object):
    #...
    def __init__(self, mobject: Mobject, **kwargs):
        # ...
        self.mobject = mobject

    def begin(self) -> None:
        # ...
        self.mobject.set_animating_status(True)
        # ...
        self.interpolate(0)

    def finish(self) -> None:
        self.interpolate(self.final_alpha_value)
        self.mobject.set_animating_status(False)
        if self.suspend_mobject_updating:
            self.mobject.resume_updating()

    def interpolate_mobject(self, alpha: float) -> None:
        for i, mobs in enumerate(self.families):
            sub_alpha = self.get_sub_alpha(alpha, i, len(self.families))
            self.interpolate_submobject(*mobs, sub_alpha)

    def interpolate_submobject(
        self,
        submobject: Mobject,
        starting_submobject: Mobject,
        alpha: float
    ):
        # Typically ipmlemented by subclass
        pass
```

当然，`Animation` 的方法肯定不止这些，此处只是列出了一些在逻辑上比较关键的

- 初始化过程中，首先是一些参数的传递，以及将需要播放动画的物件放到自己的成员变量中
- `begin` 方法会预估动画的起止时间，==创建初始物件的拷贝==，以及==开启互斥锁==，==将动画设置到开始状态==
- `finish` 方法会做好动画结束的后处理，包括==将动画设置到结束的状态==，==关闭互斥锁==等等（其实还有将动画中无用物件清理的方法 `clean_up_from_scene`，也可以认为这是后处理）
- `interpolate` 插值就是动画中最为核心的概念，它的作用是生成起止点中间过渡的画面

![[_public/updater/InterpolateExampleScene.png]]

> [!example] 源码
>
> ```python
> class InterpolateExampleScene(Scene):
>     def construct(self):
>         square = Square(side_length=4, color=YELLOW) \
>             .shift(LEFT*4).insert_n_curves(4)
>         circle = Circle(radius=2).shift(RIGHT*4)
>
>         interpolates = VGroup()
>
>         # 创建补间物件
>         # 新版 decorator 包装过的 `set_points` 方法好像无法正常 `return self`
>         # 因此只能用 for 循环了
>         for alpha in np.linspace(0.1, 1, 9):
>             v = VMobject(color=GREY)
>             v.set_points(interpolate(
>                 square.get_points(),
>                 circle.get_points(),
>                 alpha
>             ))
>             interpolates.add(v)
>
>         # 添加到场景
>         self.add(interpolates)
>         self.add(square, circle)
>
>         # 正方形的锚点索引
>         square_points = VGroup(*[
>             Integer(i, color=GOLD)
>                 .set_backstroke()
>                 .scale(0.5).move_to(p)
>             for (i, p) in enumerate(square.get_points())
>         ])
>
>         # 圆的锚点索引
>         circle_points = VGroup(*[
>             Integer(i, color=GOLD)
>                 .set_backstroke()
>                 .scale(0.5).move_to(p)
>             for (i, p) in enumerate(circle.get_points())
>         ])
>
>         self.add(square_points, circle_points)
>
> ```

之所以要创建初始物件的拷贝，其实也是为了能够在插值的过程中，可以方便调用。在动画运行的过程中，物件自身会随着动画不断的变化，而 `starting_submobject` 永远不变，为生成中间物件做准备。

对于像是 `Write` 之类的看上去比较高级的动画效果，不过是在实现上加了一点点细节罢了，其本质依然是生成补间动画。

^how-write-works

> [!example] Write 原理 (较长 酌情阅读)
>
> 这个动画其实分为两个过程：绘制轮廓、淡入填充。下面对其实现细节进行分析
>
> ```python {6}
> def begin(self) -> None:
>     # Trigger triangulation calculation
>     for submob in self.mobject.get_family():
>         submob.get_triangulation()
>
>     self.outline = self.get_outline()
>     super().begin()
>     self.mobject.match_style(self.outline)
>     self.mobject.lock_matching_data(self.mobject, self.outline)
> ```
>
> 在 `begin` 方法中，首先需要拷贝一份物件的轮廓，而后才能开启动画。其中 `lock_data` 的作用是对动画的执行效率进行了一些优化
>
> ```python {19-22}
> def interpolate_submobject(
>     self,
>     submob: VMobject,
>     start: VMobject,
>     outline: VMobject,
>     alpha: float
> ) -> None:
>     index, subalpha = integer_interpolate(0, 2, alpha)
>
>     if index == 1 and self.sm_to_index[hash(submob)] == 0:
>         # First time crossing over
>         submob.set_data(outline.data)
>         submob.unlock_data()
>         if not self.mobject.has_updaters:
>             submob.lock_matching_data(submob, start)
>         submob.needs_new_triangulation = False
>         self.sm_to_index[hash(submob)] = 1
>
>     if index == 0:
>         submob.pointwise_become_partial(outline, 0, subalpha)
>     else:
>         submob.interpolate(outline, start, subalpha)
> ```
>
> 此处实现了 `Animation` 的抽象方法 `interpolate_submobject`。`integer_interpolate` 函数将 `alpha` 从 $[0,1]$ 的定义域拆成两部分
>
> ![[_public/updater/updater_01interpolate.svg]]
>
> - 当 index = 0 时，仅仅绘制轮廓
> - 当到达两段动画的交界点时，做一些数据处理和效率优化
> - 当 index = 1 时，仅仅绘制填充色
>
> 这样 `Write` 动画就完成了。
>
> 有人说：“不对呀，为什么 `Animation` 的 `interpolate_submobject` 抽象方法只接收 3 个参数，而这里能接受 4 个参数呢？”
>
> ==这是“黑魔法”！==
>
> 还记得是谁调用 `interpolate_submobject` 的吗？是 `interpolate_mobject`
>
> ```python {4}
> def interpolate_mobject(self, alpha: float) -> None:
>     for i, mobs in enumerate(self.families):
>         sub_alpha = self.get_sub_alpha(alpha, i, len(self.families))
>         self.interpolate_submobject(*mobs, sub_alpha)
> ```
>
> 这里的 `*mob` 提取了动画的成员变量 `families`，也就是说，参数数量其实就取决于这里的成员变量。而 `Write` 又重写了 `get_all_mobjects` 方法，让 `families` 发生了变化
>
> ```python
> def get_all_mobjects(self) -> list[VMobject]:
>     return [*super().get_all_mobjects(), self.outline]
> ```
>
> 如果用 PyCharm 打开 manim 工程，会发现 `Write` 的这个方法有警告，确实是黑魔法。

## Scene

上面也提到了，`Animation` 所有的方法其实都是要由 `Scene` 来调用的，`play` 方法的描述大致如下

```python
@handle_play_like_call
def play(self, *proto_animations, **animation_config) -> None:
    if len(proto_animations) == 0:
        log.warning("Called Scene.play with no animations")
        return
    animations = self.prepare_animations(proto_animations, animation_config)
    self.begin_animations(animations)
    self.progress_through_animations(animations)
    self.finish_animations(animations)
```

- `begin_animations` 方法调用了所有传入 `play` 的动画的 `begin` 方法，即开启了所有的动画。
- `progress_through_animations` 方法会在每一帧都生成一幅画面，这些画面串接起来称为了动画。
- `finish_animations` 方法则会结束所有传入的动画，做之后的处理。

```python
def progress_through_animations(self, animations: Iterable[Animation]) -> None:
    last_t = 0
    # 每一帧都进行一次动画的更新
    for t in self.get_animation_time_progression(animations):
        dt = t - last_t
        last_t = t
        # 执行所有的更新
        for animation in animations:
            animation.update_mobjects(dt)
            alpha = t / animation.run_time
            animation.interpolate(alpha)
        # 更新场景所捕获到的帧
        self.update_frame(dt)
        self.emit_frame()
```

除此之外，Scene 还实现了一些与 updater 有关的方法：

```python
def update_mobjects(self, dt: float) -> None:
    for mobject in self.mobjects:
        mobject.update(dt)
```

这个方法的作用就是遍历场景中的所有物件，并根据他们自身 updater list 成员变量进行更新。这个方法的调用者其实也有不少，包括 `play` 方法和 `wait` 方法等。

有了这些基础，就可以将这一份份建材磊起来，创造 manim 的动画了。

其他的部分，与本文档要叙述的部分关联并非十分紧密，暂时只是一笔带过。
