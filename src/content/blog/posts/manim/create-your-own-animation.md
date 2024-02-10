---
title: 编写自己的动画
pubDate: 2023-01-03
category: 'manim'
tags: ['manim', '动画', 'updater']
description: 从源码分析 manim 的动画逻辑
---

## 前言

在前面几章的教程中，我们学习了 manim 是如何处理和生成动画的，也学习了 updater 该怎么编写。既然我们也了解了动画，那么也该开始造一点轮子了。

## Animation 与 Scene

之前的文章中，我们也稍微提到了一些 Animation 和 Scene 的细节，我们再来复习一下。

![[_public/updater/animation-scene-play.excalidraw.svg]]

### 准备工作[^1]

[^1]: 这部分其实只有 Scene 在做，Animation 基本上并不参与

将写在一个 `play` 当中的所有动画抽取出来，将没有实例化的动画都实例化[^2]。当然，有些动画的参数被写在了 `play` 中，而没有写入动画的实例中，因此也需要分别注入。

[^2]: 自 Manim Community 提出 PR，增加了 `.animate` 属性之后，可以使用 `mobject.animate.shift(UP)` 这样的方法来更加方便的构建动画，但是这条语句并不会直接创建动画的实例，而是创建一个 `_AnimationBuilder`，因此需要在 `prepare` 阶段中实例化

### 开启动画

#### Scene 的工作

- 调用该 `play` 中的所有 `animations` 的 `begin` 方法（即跳转到下面 Animation 的工作）
- 将不在场景中的 `mobject` 都添加到场景中

#### Animation 的工作

因为动画应当是持续一段时间的，所以需要明确这段动画的起止时间点 `time_span`

- 这个 `time_span` 是可以人为指定的，例如整个 `play` 持续 3 秒，但是只需要某个动画在第 1 秒结束时开始，到第 2 秒结束时终止，那么 `time_span` 可以指定为 `(1, 2)` ~~不会吧不会吧不会还有人不知道有这个属性吧~~
- 一般地，我们不指定 `time_span` 时，默认的起止时间点就是 _当前时间点_ 和 _加上 `run_time` 之后的时间点_

如果上一步我们指定了 `time_span`，也就是说在动画的 3 秒过程中，只有 1 秒的时间是给这个动画的，那么该怎么实现呢？答案是用 `rate_func`.

![[_public/updater/squish-rate-func.excalidraw.svg]]

我们将 `smooth` 函数变换到右边的时间轴上，缺失值分别用 `start` 和 `end` 所对应的值代替。之后的 `rate_func` 就使用这个变换后的了。

接下来是设置当前物件的状态为==正在运行动画==，相当于是一个互斥锁了，后面好像只是在 shader 渲染的部分用到了一下。~~这部分的源码暂时还没看，OpenGL 的内容太多了~~

然后是创建一个物件的初始状态 `starting_mobject`，这是为了之后方便计算而生的。

`suspend_mobject_updating` 这个参数指定了，在这个动画中，是否允许 `updater` 生效，当为 `True` 时，那么就不允许 `updater` 参与这段动画。

`families` 成员其实我也没怎么看懂，似乎是用于嵌套的 `Mobject`，对于含有子物件的 `Mobject`，或者说是更广义一点的 `Group`。当遇到一个组合物件的动画时，那么就对每个子物件都执行这段动画。

最后，把物件的呈现状态设置为运动的开始，即 `anim.interpolate(0)`

### 动画的过程

#### Scene 所做的工作

在 `progress_through_animations` 这个方法中，首先根据动画的时长，生成一段时间轴，能够刚好填入 `play` 中的所有动画实例。

我们知道，视频是由很多个==帧==组成的，那么动画生成的原理就很简单，对于这个时间片段中，每秒采样 $n$ 次，$n$ 即为帧率。计算出每一帧的画面，然后将得到的结果输出给图形接口即可。

```python {4,9,11}
def progress_through_animations(self, animations: Iterable[Animation]):
	last_t = 0
	# 对每一帧进行采样
	for t in self.get_animation_time_progression(animations):
		dt = t - last_t
		last_t = t
		# 动画的处理
		for animation in animations:
			animation.update_mobjects(dt)
			alpha = t / animation.run_time
			animation.interpolate(alpha)
		# 更新相机拍摄到的画面，以及刷新缓冲之类的操作
		self.update_frame(dt)
		# 输出给图形接口
		self.emit_frame()
```

#### Animation 所做的工作

上面的代码中，`animation` 做了两件事。第一个是 `update_mobjects`，它的作用是按照 `mobject` 包含的 `updater` 来更新，`updater` 也就是在这里完成了它的职能。

第二个是 `interpolate`，其实就是动画实际执行的部分了。在这一步中，`alpha` 经过 `rate_func` 的变换之后，传入了 `interpolate_mobject`，方便之后可能会用到对嵌套物件进行递归处理。其中调用的 `interpolate_submobject` 是空的，需要我们后续去实现。

```python
def interpolate_submobject(
	self,
	submobject: Mobject,
	starting_submobject: Mobject,
	alpha: float
):
	# Typically ipmlemented by subclass
	pass
```

实现方法其实也很简单，就是根据已有的参数 `submobject`, `starting_submobject`, `alpha` 参数，以及可能会用到的成员变量，更改 `submobject` 这个对象，让它成为动画过程中对应时间点理应成为的状态。

> [!note] 
> 
> Grant 在这里巧妙地使用了 `*mobs` 将这个元组展开，简直就是黑魔法，在这里看上去是把一个==二元组==展开为 `submobject` 和 `starting_submobject` 两个元素，但是在函数重载之后，会有更加巧妙的用法。
>
> ```python {4}
> def interpolate_mobject(self, alpha: float) -> None:
>     for i, mobs in enumerate(self.families):
>        sub_alpha = self.get_sub_alpha(alpha, i, len(self.families))
>        self.interpolate_submobject(*mobs, sub_alpha)
> ```

### 动画的结束

Scene 其实要做的事情很简单，就是调用每个 `animation` 的 `finish` 方法，并将可能需要移除的物件都从场景中移除。

Animation 的工作其实也不多，就是将 `alpha` 设置为结束时的值，并且解除正在运行动画的状态。如果前面有禁用 `updater` 的物件，那么就把它的 `updater` 恢复回来。

## 浅析 Transform 的原理

我们常用的 Transform 一般来说是这么用的（虽然用的更多的是 `ReplacementTransform`，但只是看动画原理的话差别不大）

```python {4}
class ExampleScene(Scene);
	def construct(self):
		# ...
		self.play(Transform(A, B))
```

### 初始化

这里高亮的语句中，其实创建了 `Transform` 动画的实例，也就是说隐含的调用了它的 `__init__` 方法，做了一些初始化。

- 调用父类 `Animation` 的构造函数
- 将 `target_mobject` 加入到成员变量中，以便动画中操作
- 初始化 `path_func`，会根据 `path_arc` 参数的值来计算
	- 如果不指定 `path_arc`，那么路径将会是一条直线
	- 如果指定了，那么路径将会是圆心角为 `path_arc` 的圆弧

### 动画开始

首先是做一些检查、拷贝之类的准备工作，避免在某些函数调用中会更改本来不应该更改的成员属性。

```python
self.mobject.align_data_and_family(self.target_copy)
```

这一行是为了 Transform 的核心——插值——而生的。我们在前面也学习到，所有的 `VMobject` 都是由许多贝塞尔曲线构成的，而这些贝塞尔曲线又少不了它的控制点。所以如果直接操作这些控制点（锚点），那么就可以直接改变呈现出的物件形状。

而 Transform 的本质，实际上也就是将两个物件对应的锚点==一一匹配==起来，然后按照给定的轨迹，从一端运动到另一端。`align_data_and_family` 这个方法就是让物件的初始状态和终止状态的锚点等属性==相互匹配==，以便==每个配对==都可以按照给定的规则来执行插值。

> [!quote]
>
> 在我之前的[视频](https://www.bilibili.com/video/BV1EA411g7tz) 3:00 处提到的“对于锚点较少的那个图形的锚点进行插值”其实也不能说很准确，但其实也就是上面的意思。

在调用父类的 `begin` 函数之后，有这样一个操作

```python {2}
if not self.mobject.has_updaters:
	self.mobject.lock_matching_data(
		self.starting_mobject,
		self.target_copy,
	)
```

这个 `lock_matching_data` 是为了改善计算时的性能而存在的，避免在后面的 `interpolate` 中进行过多的重复运算。

### 动画过程

我们前面说到动画过程只需要关注 `interpolate_mobject` 和 `interpolate_submobject`，我们来看一下 Transform 对它的实现。

```python {5}
def interpolate_submobject(
	self,
	submob: Mobject,
	start: Mobject,
	target_copy: Mobject,
	alpha: float
):
	submob.interpolate(start, target_copy, alpha, self.path_func)
	return self
```

欸，我记得父类的这个方法接收的是 3 个参数啊，为什么在这里多出来了一个 `target_copy` 呢？实际上，这就是父类 `interpolate_mobject` 方法中 `*mobs` 这个展开式的“灵活应用”。

在 Transform 中，重载的不仅仅是插值函数，还有 `get_all_families_zipped`，这个函数就负责创建 `families` 成员。我们来看看它的重载实现。

```python {4-8}
def get_all_families_zipped(self) -> zip[tuple[Mobject]]:
	return zip(*[
		mob.get_family()
		for mob in [
			self.mobject,
			self.starting_mobject,
			self.target_copy,
		]
	])
```

可以看到，其实这里的 `families` 就变成了==三元组==的列表了，而不是前面提到的==二元组==列表。这样，上面 `interpolate_submobject` 方法也不能说是 override，而是重新创建了一个新的同名不同形参的函数。

在这个方法里面，实际上还是调用了 `submob` 的 `interpolate` 方法，而它本质上还是直接修改 `submob` 的属性，达到那种补间的效果。

```python {15-19,21-25}
def interpolate(
	self,
	mobject1: Mobject,
	mobject2: Mobject,
	alpha: float,
	path_func: Callable[[np.ndarray, np.ndarray, float], np.ndarray]
):
	for key in self.data:
		# ... 一些性能优化和预处理 ...
		if key in ("points", "bounding_box"):
			func = path_func
		else:
			func = interpolate

		self.data[key][:] = func(
			mobject1.data[key],
			mobject2.data[key],
			alpha
		)
	for key in self.uniforms:
		self.uniforms[key] = interpolate(
			mobject1.uniforms[key],
			mobject2.uniforms[key],
			alpha
		)
	return self
```

上面代码中高亮的部分，实际上就是直接修改 Mobject 的属性，是非常简单的 `interpolate`.

### 动画的结束

剩余的清扫工作其实非常简单，就是调用父类的 `finish` 方法，并解除 `locked_data`.

现在，如果读者现在回看我之前写到的 [[posts/manim/c01_front_knowledge#^how-write-works|Write 的工作原理]]，应该就相当明了了吧。

## 编写自定义的动画

正篇终于开始了。

### 旋转淡入

如果有看过我做过的视频教程的读者，应该对 [`turn_animation_into_updater`](https://github.com/3b1b/manim/blob/669182944da040c227ccfd018250ee2bbc49649d/manimlib/mobject/mobject_update_utils.py#L83) 还有印象，但这次我们不用它，而使用纯写动画的方法。

![[_public/updater/RotateFadeInExample.mp4]]

#### 初始化

首先是它该如何构造，我们很轻松地就能写出它的 `__init__` 函数。

```python
class RotateFadeIn(Animation):
    def __init__(
        self,
        mobject: Mobject,      # 需要淡入的物件
        angle: float = PI,     # 旋转的角度
        axis: np.ndarray = UP, # 绕哪个轴旋转
        **kwargs
    ):
        self._angle = angle
        self._axis = axis
        super().__init__(mobject, **kwargs)
```

> [!caution]
>
> 至于为什么我不用 `CONFIG` 字典来写入参数，是因为在撰写这篇文章的时候，Grant 已经在一个 PR 中把 `CONFIG` 字典给扬了。为了避免各种版本之间的冲突，我就直接用成员变量了。

#### begin

想要物件最终旋转到正确的角度，那么必须在一开始，让初始状态向反方向旋转相应的角度，那么也就有了这样的实现。

```python {5}
# 使用 `rotate` 方法
def begin(self):
	self._cached_angle = 0
	super().begin()
	self.mobject.rotate(-self._angle, self._axis)
```

```python {4}
# 使用 `become` 方法
def begin(self):
	super().begin()
	self.starting_mobject.rotate(-self._angle, self._axis)
```

#### interpolate

在对 alpha 的每个采样时，都先让 `mobject` 恢复初态，这里我采用的是旋转回到原来的位置，当然，如果大家对 API 比较熟悉的话，可以直接用 `become` 这个方法。

```python
# 使用 `rotate` 方法
def interpolate_mobject(self, alpha: float):
	self.mobject.rotate(-self._cached_angle, self._axis) # 向原来的方向旋转
	self._cached_angle = alpha * self._angle # 计算新的角度
	self.mobject.rotate(self._cached_angle, self._axis)
	self.mobject.set_opacity(alpha)
```

```python
# 使用 `become` 方法
def interpolate_mobject(self, alpha: float):
	self.mobject.become(self.starting_mobject) # 用初始状态覆盖当前状态
	self.mobject.rotate(alpha * self._angle, self._axis) # 旋转对应角度
	self.mobject.set_opacity(alpha)
```

#### finish

其实甚至都不用写，因为 interpolate 最后一步已经基本上都做完了，交给父类去做就可以了。

#### 测试

```python
class RotateFadeInExample(Scene):
    def construct(self) -> None:
        r = Text("Rotate", font="Jetbrains Mono", slant=ITALIC).scale(3)
        self.play(RotateFadeIn(r, run_time=3))
```

### 一个复杂一点的例子

![[_public/updater/Aniplex.mp4]]

——这真的是用 manim 写出来的吗？

——是的，源码在 [GitHub 仓库](https://github.com/widcardw/my-manim-projects/blob/master/videos/aniplex.py)。

因为我懒，所以感兴趣的读者直接看源码吧，当时也只是灵感乍现随便写的，各种参数调的还不是很好，如果之后有机会的话那我就把这个坑填上吧。
