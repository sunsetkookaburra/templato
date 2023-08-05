# Templato

A JavaScript patch for `<template>` defined custom elements.

## Usage

```html
<!-- index.html -->

<head>
  <link rel="template" href="./widgets.html" title="widgets"/>
  <script type="module" src="./templato.mjs"></script>
</head>
<body>
  <widgets-clock></widgets-clock>
</body>
```

```html
<!-- widgets.html -->

<template name="clock" observe="show" shadow="closed">
  <time></time>
  <script>
    /*
      Magic Variables:
      - shadow: custom element shadow root
      - args: custom element constructor arguments
    */
    const time = shadow.querySelector("time");

    function updateTime() {
      const now = new Date();
      time.innerText = now.toTimeString();
    }

    function updateDatetime() {
      const now = new Date();
      time.innerText = now.toString();
    }

    let currentUpdate = updateTime;

    const update = () => {
      currentUpdate();
      window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);

    this.attributeChangedCallback = (name, oldValue, newValue) => {
      if (name === "show") {
        if (newValue === "full") currentUpdate = updateDatetime;
        else currentUpdate = updateTime;
      }
    };
  </script>
</template>
```
