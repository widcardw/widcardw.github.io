---
title: updater 文档 | 第 3 节 基于时间的更新
date: 2022-07-02
tags: ['manim','updater','教程']
category: manim
article: true
abstract: '从时间轴的角度，直接控制 manim 动画的流程'
---

# 第 3 节 基于时间的更新

## 引入

之前我们提到了有起始和终止的动画，以及==无限播放==的动画。这一节我们将探讨后者应当如何编写。

> [!question] 试试看！
> 编写一个时钟，使得秒针、分针、时针分别按照固定的角速度旋转。如果严格按照现实时间来写比较慢，可以适当增加角速度。

![[public/updater/ClockExampleScene.png]]

如果上面的例子你能写出来，那么这一节就结束了。

~~开个玩笑~~

## 浅析基于时间的 updater

我们回到上一节提到的基于时间的更新函数，它的类型定义如下。此时这个函数接收的参数是两个，一个是 Mobject ，另一个是 dt 。

```python
TimeBasedUpdater = Callable[["Mobject", float], None]
```

同时，在 `add_updater` 方法中，有这么一条语句：

```python
if "dt" in get_parameters(update_function):
    #...
```

很明显，当更新函数的参数中如果有一个名字为 dt ，那么就会执行下面的步骤，即将==基于时间的更新函数==添加到成员列表中。接下来就只需要接着上一节的分析，在每次 _动画播放_ 的时候，动画过程中的每一帧都会调用这一函数，对物件进行更新了。

然而我们好像忽略了 `wait` 这个方法。我们发现，基于时间的更新不管是遇到 `play` 还是 `wait`，它都会更新。

```python {16}
@handle_play_like_call
def wait(
	self,
	duration: float = DEFAULT_WAIT_TIME,
	...
):
	self.update_mobjects(dt=0)  # Any problems with this?
	# 处理演讲者模式
	if ...:
		...
	else:
		time_progression = \
			self.get_wait_time_progression(duration, stop_condition)
		last_t = 0
		for t in time_progression:
			dt = t - last_t
			last_t = t
			# 处理更新
			self.update_frame(dt)
			self.emit_frame()
			if stop_condition is not None and stop_condition():
				break
	self.refresh_static_mobjects()
	return self
```

可以看到，`wait` 方法中，其实也是做了一些关于 updater 的处理，这样就能做到 `wait` 时也能处理基于时间的更新了。

> [!example] 玩笑归玩笑，时钟的例子还是得给答案的
>
> ```python
> class ClockExampleScene(Scene):
>     def construct(self):
>         # 秒针的角速度
>         omega = -6 * DEGREES
>         cir = Circle(radius=3, color=WHITE)
>         # 添加刻度
>         for i in range(60):
>             percent = i / 60
>             if i % 5 == 0:
>                 # pfp 是 point_from_proportion 的简写
>                 cir.add(Line(cir.pfp(percent), cir.pfp(percent) * 0.9))
>             else:
>                 cir.add(Line(cir.pfp(percent), cir.pfp(percent) * 0.95))
>         self.add(cir)
>
>         # 秒针 分针 时针
>         sec_handle = Line(DOWN / 4, UP * 2.7, stroke_width=3)
>         minute_handle = Line(DOWN / 4, UP * 2, stroke_width=6)
>         hour_handle = Line(DOWN / 4, UP * 1.5, stroke_width=9)
>
>         self.add(hour_handle, minute_handle, sec_handle)
>
>         def updater_sec(m: Mobject, dt: float):
>             m.rotate(omega * dt, about_point=ORIGIN)
>
>         def updater_minute(m: Mobject, dt: float):
>             m.rotate(omega * dt / 60, about_point=ORIGIN)
>
>         def updater_hour(m: Mobject, dt: float):
>             m.rotate(omega * dt / 3600, about_point=ORIGIN)
>
>         # 分别添加与时间相关的更新
>         sec_handle.add_updater(updater_sec)
>         minute_handle.add_updater(updater_minute)
>         hour_handle.add_updater(updater_hour)
>
>         self.wait(10)
> ```

## dt 的值是多少

如果你运行了上面的例子就会发现， 10 秒钟的等待时间，秒针刚好就走了 10 个刻度。这看似是个巧合，但是我们可以使用 print 来 debug 呀。如果尝试在更新函数中加入一句 `print(dt)`，那么会打印一堆小数。这些小数大多都接近 0.0166 ，这是因为 dt 就是==帧率的倒数==。也就是说，每一秒钟，dt 在这一区间段的总和就是 1 。

为什么要有这样一个设定呢？我们用常数代替 dt 不行吗？

当然可行，毕竟 dt 就是一个浮点数。但是当全局设定的帧率变了，而我们仍然使用我们定义的常量，就会导致不同帧率情况下，动画的结果就不同。

但是，如果我们使用 dt ，并且在使用的过程中有意地给某个变化量乘上 dt ，那么在单位时间内，这个变化量就是恒定的了。

比如我们将秒针的更新函数改成这样

```python
def sec_updater(m, dt):
    m.rotate(omega * 0.016667, about_point=ORIGIN)
```

那么，在 60 帧的视频中，每 10 秒钟，秒针就会走 10 个刻度。而在 30 帧的视频中，每 10 秒钟，秒针只会走 5 个刻度，因为在 30 帧的视频中，更新函数在每秒只会被调用 30 次。所以，dt 可以作为一个标准化的数值来使用。

仔细阅读的读者应该也能发现， dt 是通过当前帧的“时间戳”减去上一帧的“时间戳”来算出来的。既然有这个“时间戳”，我们能把它利用起来吗？当然是可以的， Scene 有一个成员变量 `time` 就存放了当前动画已经运行的秒数。我们可以用 `DecimalNumber` 来将它显示在屏幕上。

```python
cur_time = DecimalNumber(0)
cur_time.add_updater(lambda m, dt: m.set_value(self.time))
self.add(cur_time)
self.wait(10)
```

## 更多的例子

##### 1. 恒星行星模型：制作地球绕太阳公转，月球绕地球公转的动画。公转的速度、半径不做硬性要求。

> [!example] 参考解答
> ```python
> class StarPlantExample(Scene):
>     def construct(self):
>         sun = Sphere(radius=1, color=RED)
>         earth = Sphere(radius=0.5, color=BLUE)
>         moon = Sphere(radius=0.2, color=YELLOW_A)
>
>         earth.move_to(sun.get_center() + 3.5 * RIGHT)
>         moon.move_to(earth.get_center() + 2 * RIGHT)
>
>         self.add(sun, earth, moon)
>
>         # 地球绕太阳转
>         def update_earth(m: Mobject, dt: float):
>             m.rotate(dt, about_point=sun.get_center())
>
>         def update_moon(m: Mobject, dt: float):
>             # 强行移动到地球的右侧
>             m.move_to(earth.get_center() + 2 * RIGHT)
>             # 根据动画已经运行的时间来旋转
>             # self.time 是 Scene 的属性，用于记录动画总的运行时间
>             # 其实用了 self.time 稍微就有点违背了原本的想法了，虽然这样写比较简单
>             m.rotate(self.time * 3, about_point=earth.get_center())
>
>         earth.add_updater(update_earth)
>         moon.add_updater(update_moon)
>         self.wait(10)
> ```

##### 2. 李萨如曲线：让一个物件按照李撒如图形的轨迹持续运动。李萨如图形的参数可自己给定。

![[public/updater/LissajousExample.mp4]]

> [!example] 参考解答
> 在这里同样也用了 `self.time` 这个变量，处理更加方便一些
>
> ```python
> class LissajousExample(Scene):
>     def construct(self):
>         u = 4
>         v = 5
>         # 李萨如图形的参数曲线
>         lissajous = ParametricCurve(
>             lambda t: 3 * np.array([
>                 np.sin(u * t),
>                 np.sin(v * t),
>                 0
>             ]),
>             t_range=[0, TAU, 0.1],
>             stroke_color=GREY
>         )
>
>         self.add(lissajous)
>
>         dot = Dot(color=YELLOW)
>
>         def update_dot(m: Mobject, dt: float):
>             m.move_to(3 * np.array([
>                 np.sin(u * self.time / 3),
>                 np.sin(v * self.time / 3),
>                 0
>             ]))
>         dot.add_updater(update_dot)
>         self.add(dot)
>         self.wait(10)
> ```

##### 3. 追逐曲线：一个正三角形的三个顶点分别以一定速度靠近同一侧相邻的顶点，画出每一帧三角形的位置。

![[public/updater/TracingCurveExample.mp4]]

> [!example] 参考解答
>
> ```python
> class TracingCurveExample(Scene):
>     # 极坐标转换为笛卡尔坐标
>     def polar2xyz(self, pho: float, theta: float):
>         return pho * np.array([
>             np.cos(theta),
>             np.sin(theta),
>             0
>         ])
>
>     def construct(self):
>         r = 3
>         # 3 个顶点
>         a = Dot(self.polar2xyz(r, PI / 2), color=YELLOW)
>         b = Dot(self.polar2xyz(r, PI / 2 + TAU / 3), color=YELLOW)
>         c = Dot(self.polar2xyz(r, PI / 2 - TAU / 3), color=YELLOW)
>
>         # 3 条边
>         ab = Line(a.get_center(), b.get_center(), color=GOLD)
>         bc = Line(b.get_center(), c.get_center(), color=GOLD)
>         ca = Line(c.get_center(), a.get_center(), color=GOLD)
>
>         # 使 3 条边始终连接 3 个顶点
>         ab.add_updater(lambda l: l.put_start_and_end_on(a.get_center(), b.get_center()))
>         bc.add_updater(lambda l: l.put_start_and_end_on(b.get_center(), c.get_center()))
>         ca.add_updater(lambda l: l.put_start_and_end_on(c.get_center(), a.get_center()))
>
>         self.add(ab, bc, ca)
>         self.add(a, b, c)
>
>         # 3 个顶点随时间向同一侧相邻点靠近
>         a.add_updater(lambda m, dt: m.shift((b.get_center() - m.get_center()) * dt))
>         b.add_updater(lambda m, dt: m.shift((c.get_center() - m.get_center()) * dt))
>         c.add_updater(lambda m, dt: m.shift((a.get_center() - m.get_center()) * dt))
>
>         # 轨迹
>         trace = VGroup()
>
>         # 向轨迹中不断添加三角形三边的拷贝
>         def update_trace(m: Mobject, dt: float):
>             m.add(ab.copy().clear_updaters().set_stroke(width=1))
>             m.add(bc.copy().clear_updaters().set_stroke(width=1))
>             m.add(ca.copy().clear_updaters().set_stroke(width=1))
>
>         trace.add_updater(update_trace)
>         self.add(trace)
>         self.wait(4)
> ```

##### 4. 东方弹幕游戏：对手每一帧都会改变弹幕的发射角，但是当弹幕发射出去之后，只会进行匀速直线运动，直至飞出屏幕。你需要制作一张螺旋符卡，拥有至少 3 条伪线，且发射角匀速变化。

![[public/updater/danmaku01.png]]

> [!example] 参考解答
> ```python
> # 子弹物件封装
> class Bullet(ArrowTip):
>     def __init__(self, angle=0, **kwargs):
>         super().__init__(**kwargs)
>         self.data["points"][4] += LEFT*0.5
>         self.scale(0.5)
>         self.rotate(angle + PI)
>         # 子弹朝向所对应的向量
>         self.vector = normalize(rotate_vector(RIGHT, angle))
>
> color_list = [RED, GOLD, YELLOW, GREEN, TEAL, BLUE, PURPLE]
> v = 2
>
> class Danmaku01(Scene):
>     def construct(self):
>         danmaku = VGroup()
>
>         def update(m: Mobject, dt: float):
>             # 每一帧都向集合中添加一颗子弹，初始角度为 self.time * 50
>             m.add(Bullet(self.time * 50))
>             # 渐变着色
>             m.set_color_by_gradient(*color_list)
>
>             for b in m:
>                 # 子弹匀速直线运动
>                 b.shift(v * dt * b.vector)
>                 # 删除屏幕外的子弹
>                 if b.is_off_screen():
>                     m.remove(b)
>
>         danmaku.add_updater(update)
>         self.add(danmaku)
> ```
>
> 当然这里的例子我并没有进行优化，如果是游戏开发者，肯定了解过==对象池==的概念，它能有效优化对象频繁创建和析构带来的性能损失问题。

##### 5. 东方弹幕游戏进阶：境符「波と粒の境界」可谓是观赏性极高的符卡之一，现在紫妈要求你用 manim 来实现它。

![[public/updater/danmaku02.png]]

> [!example] 参考解答
> 其实只需要改第 6 行就可以了。只要发射角的变化是非线性的，就可以达到这样的效果。当然，如果觉得子弹还不够密集（因为 60 帧下每秒只有 60 颗）可以再加几组。
>
> ```python {6}
> class Danmaku02(Scene):
>     def construct(self):
>         danmaku = VGroup()
>
>         def update(m: Mobject, dt: float):
>             m.add(Bullet(self.time ** 2 * 2))
>             m.set_color_by_gradient(*color_list)
>
>             for b in m:
>                 b.shift(v * dt * b.vector)
>                 if b.is_off_screen():
>                     m.remove(b)
>
>         danmaku.add_updater(update)
>         self.add(danmaku)
> ```
