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

<template name="clock" observe="show">
  <time></time>
  <script>
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

    function constructor() {
      const update = () => {
        currentUpdate();
        window.requestAnimationFrame(update);
      };
      window.requestAnimationFrame(update);
    }

    function observer(name, oldValue, newValue) {
      if (name === "show") {
        if (newValue === "full") currentUpdate = updateDatetime;
        else currentUpdate = updateTime;
      }
    }
  </script>
</template>
```
