---
title: 关于 manim 中贝塞尔曲线上色的细节补充
date: 2022-11-26
category: 'manim'
tags: ['shader', 'OpenGL', 'manim', 'bezier curve', 'bezier']
abstract: 为什么贝塞尔曲线着色并不是扁的，而是有厚度的？无论我怎样旋转视角都一样？
---

# 关于 manim 中贝塞尔曲线上色的细节补充

## 前言

在近两天，有群友发出了疑惑，为什么在 manim 中，无论怎样旋转视角，线都是有宽度的。因为我之前稍微研究了一下上色机制，所以在应该会更加清楚它的处理逻辑，顺带着也是把之前讲到的内容，稍微再做一些补充。

## 为什么

为什么旋转视角时，仿佛就是空间中的一根棍子，永远都有宽度呢？甚至连空间中的曲线也是这样？

> 回想起之前看到 B 站的一个[视频](https://www.bilibili.com/video/BV1GD4y1t7iF)，讲解了如何使用 After Effects 制作 _ANIPLEX_ 的片头，而他的矩形就是一个平面上的矩形，是没有厚度的，想要做出厚度，就必须再拼上一层 3D 圆柱。

有厚度这不是正合我意吗？这样就不会有旋转造成视觉上扁平的问题了呀。

![[public/updater/DifferenceBetweenLines.mp4]]

```python
line1 = Line(
	np.array([-2.5, 1, 1]), np.array([2.5, 1, 1]),
	stroke_width=10, color=GREEN)
line2 = Rectangle(5, 0.1, stroke_width=0,
	fill_opacity=1, fill_color=RED).shift(DOWN + IN)
```

### 分析

我们来思考一下，在 OpenGL 的着色中，什么步骤会导致将一个平面图形，在旋转视角之后，会导致它变成扁平的？

是**透视变换**。

我们的直观感受中，总会觉得远小近大，因此我们在 OpenGL 的着色设计上，就会加入透视变换。那么我们就顺着透视变换，去寻找其根源。

### 回顾上色机制和步骤

让我们回顾一下[[posts/notes/quadratic_bezier_shader|二阶贝塞尔曲线上色机制]]中的着色流程。

![[public/gl/quadratic-bezier-stroke-shader.excalidraw.svg]]

顶点着色器在 `position_point_into_frame` 这个方法中，将顶点乘上了一个相机的旋转，这一步应该是要为透视变换做一些准备。

几何着色器的工作很多，透视变换的步骤是排在相对靠前的。而我们又知道，贝塞尔曲线的绘制步骤是：先用一个[[posts/notes/quadratic_bezier_shader#Geometry Shader|五边形]]盖住这条曲线，再把剩余部分用**片段着色器**擦除。

这个五边形是什么时候出现的呢？是 `get_corners` 方法得到的。我们来看一下它的源码，接下来我们将逐步讲解它。

```csharp
int get_corners(
	vec2 controls[3],
	int degree,
	float stroke_widths[3],
	out vec2 corners[5]
) {
	// 拿到曲线的三个锚点
    vec2 p0 = controls[0];
    vec2 p1 = controls[1];
    vec2 p2 = controls[2];

    // 将向量单位化
    vec2 v10 = normalize(p0 - p1);
    vec2 v12 = normalize(p2 - p1);
    vec2 v01 = -v10;
    vec2 v21 = -v12;
	// 将向量 v01 逆时针旋转 90 度
    vec2 p0_perp = vec2(-v01.y, v01.x);
    // 将向量 v12 逆时针旋转 90 度
    vec2 p2_perp = vec2(-v12.y, v12.x);

    // aaw is the added width given around the polygon for antialiasing.
    // In case the normal is faced away from (0, 0, 1), the vector to the
    // camera, this is scaled up.
    // 抗锯齿
    float aaw = anti_alias_width;
    float buff0 = 0.5 * stroke_widths[0] + aaw;
    float buff2 = 0.5 * stroke_widths[2] + aaw;
    float aaw0 = (1 - has_prev) * aaw;
    float aaw2 = (1 - has_next) * aaw;

	// 构造额外的顶点，以构成五边形
	// p0 右侧
    vec2 c0 = p0 - buff0 * p0_perp + aaw0 * v10;
    // p0 左侧
    vec2 c1 = p0 + buff0 * p0_perp + aaw0 * v10;
    // p2 左侧
    vec2 c2 = p2 + buff2 * p2_perp + aaw2 * v12;
    // p2 右侧
    vec2 c3 = p2 - buff2 * p2_perp + aaw2 * v12;

    // 如果是中间段的曲线，则需要创建转接点
    if(has_prev > 0)
	    create_joint(angle_from_prev, v01, buff0, c0, c0, c1, c1);
    if(has_next > 0)
	    create_joint(angle_to_next, v21, buff2, c3, c3, c2, c2);

    // 直线，直接按照矩形来渲染
    //  c1 ---------------- c2
    //  | ///////////////// |
    //  p0 ////// p1 ////// p2
    //  | ///////////////// |
    //  c0 ---------------- c3
    // 上面斜线的部分即为着色的部分
    if(degree == 1){
        // The order of corners should be for a triangle_strip.
        // Last entry is a dummy
        corners = vec2[5](c0, c1, c3, c2, vec2(0.0));
        return 4;
    }

    // 曲线，需要用五边形来覆盖它
    float orientation = sign(cross2d(v01, v12));  // Positive for ccw curves
    if(orientation > 0) corners = vec2[5](c0, c1, p1, c2, c3);
    else                corners = vec2[5](c1, c0, p1, c3, c2);
    // Replace corner[2] with convex hull point accounting for stroke width
    find_intersection(corners[0], v01, corners[4], v21, corners[2]);
    return 5;
}
```

### 分析五边形的顶点如何计算

#### 一些预处理

这些预处理大多是为了后续变量处理方便。

注意，Grant 机缘巧合的使用了 `normalize` 这个函数，得到了两个单位向量。而实际上就是因为单位化的操作在这一步，所以曲线一定有宽度。

前面我们提到了，在生成五边形之前，有一个**透视变换**，而这个透视变换就已经将三维的点都投影到二维的平面上了。在此之后的所有向量运算，几乎都不可能离开这个平面。

> [!note|closed] 关于镜头距离导致的曲线粗细变化 可暂时不看
>
> 由于我们感官上的远小近大，越远的曲线理应看上去越细。很幸运，有一个数组变量 `stroke_widths[]` 做了这个工作。在透视变换的时候，程序就会按照相机的距离去计算线的粗细应该怎样变化，之后这个数组被传入 `get_corners` 函数，用于生成五边形的顶点。

```csharp
// 拿到曲线的三个锚点
vec2 p0 = controls[0];
vec2 p1 = controls[1];
vec2 p2 = controls[2];

// 将向量单位化
vec2 v10 = normalize(p0 - p1);
vec2 v12 = normalize(p2 - p1);
vec2 v01 = -v10;
vec2 v21 = -v12;
// 将向量 v01 逆时针旋转 90 度
vec2 p0_perp = vec2(-v01.y, v01.x);
// 将向量 v12 逆时针旋转 90 度
vec2 p2_perp = vec2(-v12.y, v12.x);
```

#### 抗锯齿

这部分是为了优化视觉上的体验，在逻辑上问题不是很大。

```csharp
float aaw = anti_alias_width;
float buff0 = 0.5 * stroke_widths[0] + aaw;
float buff2 = 0.5 * stroke_widths[2] + aaw;
float aaw0 = (1 - has_prev) * aaw;
float aaw2 = (1 - has_next) * aaw;
```

#### 构造顶点

为曲线原本的三个锚点，创建相对偏移的点，以便构成五边形，将整条曲线覆盖。

> 这些顶点用作备用，有些可能用到，有些不一定用得到。

```csharp
// p0 右侧
vec2 c0 = p0 - buff0 * p0_perp + aaw0 * v10;
// p0 左侧
vec2 c1 = p0 + buff0 * p0_perp + aaw0 * v10;
// p2 左侧
vec2 c2 = p2 + buff2 * p2_perp + aaw2 * v12;
// p2 右侧
vec2 c3 = p2 - buff2 * p2_perp + aaw2 * v12;
```

#### 创建转接点

由于长的曲线都是用短的二阶贝塞尔曲线拼接而成的，因此需要创建转接点，本质上应该是做一些偏移，让曲线之间的连接没有那么突兀。

```csharp
if(has_prev > 0)
	create_joint(angle_from_prev, v01, buff0, c0, c0, c1, c1);
if(has_next > 0)
	create_joint(angle_to_next, v21, buff2, c3, c3, c2, c2);
```

#### 处理直线

直线也是由一段二阶贝塞尔曲线构成的，只要三个锚点共线，长度上均匀分布，那应该就是直线段。直线段只需使用矩形的方式将它绘制出来就可以了。

这里的 `corners[]` 前 4 个值有效，最后一个无效。返回值为 4，说明按照四边形的方式来着色。

```csharp
if(degree == 1){
	corners = vec2[5](c0, c1, c3, c2, vec2(0.0));
	return 4;
}
```

![[public/gl/line-shader.excalidraw.svg]]

#### 处理曲线

曲线的处理方式可能还有一些特殊，它需要计算一个 `orientation` 值，用于指示曲线方向是顺时针还是逆时针。至于它具体有什么用，应该是用于**纠正顶点索引**，使得每个图形都按照正确的三角形图元上色。

```csharp
float orientation = sign(cross2d(v01, v12));  // Positive for ccw curves
if(orientation > 0) corners = vec2[5](c0, c1, p1, c2, c3);
else                corners = vec2[5](c1, c0, p1, c3, c2);
// Replace corner[2] with convex hull point accounting for stroke width
find_intersection(corners[0], v01, corners[4], v21, corners[2]);
return 5;
```

![[public/gl/pentagon-out.excalidraw.svg]]

![[public/gl/pentagon-in.excalidraw.svg]]

果不其然，在计算出五边形顶点坐标之后，紧接着的就是顶点索引表。通过索引表的方式，用更少的内存单元，就能生成三个三角形，来填充为一个五边形。

```csharp
int index_map[5] = int[5](0, 0, 1, 2, 2);
if(n_corners == 4) index_map[2] = 2;  // 对于直线，可以单独处理
```

> [!faq|closed] 为什么这么做？
> 参考 [Learn OpenGL 教程](https://learnopengl-cn.github.io/01%20Getting%20started/04%20Hello%20Triangle/)。
>
> 如果想要创建一个四边形，我们通常会用两个三角形拼起来。而这样的话，我们可以传入的是 6 个顶点，分别绘制，但这样显然浪费了内存资源，我们明明可以只用 4 个顶点就表示出一个四边形。
>
> 于是，我们通过索引表的方式，将重合的顶点复用起来，虽然好像对于人去计算的话可能麻烦了一点，但是这样提高了一定的性能。

#### 计算颜色

细心的读者应该会发现，在 manimgl 场景中的三维物体，甚至连二维物体，它都是有一些光影渐变的效果的，而这还得归功于 `finalize_color` 这个函数。

这个函数实际上就是通过相机距离、光源位置等参数，来计算最终要渲染到画布上的颜色。感兴趣的读者，可以在 [`/ico i-vscode-icons-default-folder-opened;inserts`](https://github.com/3b1b/manim/tree/master/manimlib/shaders/inserts) 中查看，这个文件夹里面还包含了不少有用的工具函数。

#### `get_gl_Position`

这是干啥用的？ 之前不是已经做过三维到二维的映射了吗？为什么还要做映射呢？

没错，前面确实有一个透视变换，把三维的图像投影到了二维的平面上。但是考虑到片段着色器接受的是这样一个区域的像素点

$$
\displaystyle {\left\lbrace{\left( x, y\right)}\mid x\in{\left[ 0, 1\right]}, y\in{\left[ 0, 1\right]}\right\rbrace}
$$

因此，我们需要将想象中的 $\displaystyle  1920\times 1080$ 画布，重新缩放到适合片段着色器的区域中。

在释放图元的时候，需要逐个顶点来释放，因此，我们可以看到，在一个循环语句中，将计算出来的 5 个或者 4 个顶点逐一映射，并赋值给 `gl_Position` 变量，然和调用 `EmitVertex` 释放。

然而，笔者在这里有一些疑惑。`gl_Position` 变量被赋值为一个 4 维的向量，但是不知道在 Fragment shader 中，==是谁来接受这个被释放的顶点==，而且==为什么是 4 维的==，正常来说不是应该只需要三维的就可以了吗？

> [!faq] 针对这些问题的猜想
>
> 对于后面的这个问题，众所周知，在三维物体计算的时候，我们通常会使用四元数运算，而且目前运用的相当广泛，毕竟使用这种方式能够避免很多致命的问题。
>
> 然而对于前面那个问题，我在源码中并没有找到什么明显的线索，或许是隐含在其中，直接按照释放的图元来==绘制成多边形==。而我图形学的编程基础也不是那么好，所以如果有大佬了解这方面的话，欢迎评论指出！

#### 片段着色器

在之前的文章中，我也叙述过，它的职责主要是计算出一个片段，使得这个片段看起来像是一段曲线。之后再通过==调整透明度==的方式，擦除不需要的片段。

```csharp
frag_color.a *= smoothstep(0.5, -0.5, signed_dist / uv_anti_alias_width);
```

## 后记

图形学这方面是真的复杂，感觉历史包袱也蛮重的，想要写好 OpenGL 需要花费非常大的精力，像我就还不能从容的面对这些带有**繁重数学运算**，同时还被**严格限制在固定规范中**的代码，那就只能慢慢学，或者去寻找更好的方法吧。


