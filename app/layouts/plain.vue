<template>
  <div>
    <slot />
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #f7f7f7;
  --surface: #fff;
  --border: #e8e8e8;
  --border-2: #d0d0d0;
  --text: #0c0c0c;
  --text-2: #5a5a5a;
  --text-3: #a0a0a0;
  --accent: #0c0c0c;
  --accent-fg: #fff;
  --sidebar-active: #f2f2f2;
  --r: 8px;
  --r-sm: 6px;
  --hh: 56px;
  --th: 48px;
  --sw: 240px;
  --shadow: 0 1px 3px rgba(0,0,0,.06);
  --shadow-md: 0 8px 32px rgba(0,0,0,.12);
}
[data-theme=dark] {
  --bg: #0c0c0c;
  --surface: #111;
  --border: #222;
  --border-2: #333;
  --text: #f5f5f5;
  --text-2: #a3a3a3;
  --text-3: #525252;
  --accent: #f5f5f5;
  --accent-fg: #0c0c0c;
  --sidebar-active: #1a1a1a;
  --shadow: 0 1px 3px rgba(0,0,0,.3);
  --shadow-md: 0 8px 32px rgba(0,0,0,.6);
}
body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background .15s, color .15s;
}
</style>
