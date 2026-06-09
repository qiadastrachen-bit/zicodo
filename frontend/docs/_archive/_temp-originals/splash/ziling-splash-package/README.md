# ZiLing 开屏动画交付说明

## 文件说明

- `index.html`：干净预览页，可直接打开或放到静态服务里测试。
- `ziling-splash.css`：开屏动画样式，背景色为 `#FFFAF1`，logo 色为 `#87C8B4`。
- `ziling-splash.js`：动画逻辑和 SVG 内容，无第三方依赖。
- `embed-snippet.html`：后端/客户端嵌入时可复制的最小代码片段。

## 快速接入

在页面中引入 CSS 和 JS，然后放一个挂载容器：

```html
<link rel="stylesheet" href="/static/ziling-splash/ziling-splash.css">

<div id="zilingSplash" data-ziling-splash></div>

<script src="/static/ziling-splash/ziling-splash.js"></script>
```

默认播放一次，时长约 `5.45s`。播放结束后，容器会触发 `zilingSplashFinished` 事件：

```html
<script>
  document.getElementById("zilingSplash").addEventListener("zilingSplashFinished", function () {
    this.remove(); // 或切换到 app 首页
  });
</script>
```

## 容器尺寸

组件默认占满父级容器：

```css
.your-splash-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
}
```

```html
<div class="your-splash-layer">
  <div data-ziling-splash></div>
</div>
```

如果放在 WebView 或 H5 app 首屏里，父级给 `width: 100%; height: 100%;` 即可。组件内部会适配不同移动端屏幕比例。

## 可选配置

循环播放：

```html
<div data-ziling-splash data-loop="true"></div>
```

播放结束后自动隐藏：

```html
<div data-ziling-splash data-auto-hide="true"></div>
```

手动挂载：

```html
<div id="splash"></div>
<script src="/static/ziling-splash/ziling-splash.js"></script>
<script>
  const instance = window.ZiLingSplash.mount(document.getElementById("splash"));
  // instance.replay();
  // instance.destroy();
</script>
```

## 集成建议

- 不需要图片资源，logo 和动效全部内联在 JS/SVG 中。
- 不依赖框架，不需要 npm install。
- 建议把这个文件夹整体放到静态资源目录，例如 `/static/ziling-splash/`。
- 如果 app 原生端控制开屏结束，监听 `zilingSplashFinished` 后再通知原生层即可。
- 背景色请保持 `#FFFAF1`，logo 色请保持 `#87C8B4`。
