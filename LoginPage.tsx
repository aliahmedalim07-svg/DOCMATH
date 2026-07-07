@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --surface: oklch(0.985 0.01 245);
  --surface-muted: oklch(0.96 0.02 245);
  --ink: oklch(0.25 0.04 245);
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--surface);
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    linear-gradient(180deg, rgba(237, 241, 245, 0.92), rgba(247, 249, 251, 0.98)),
    var(--surface);
  color: var(--ink);
  font-family: "Outfit", "Cairo", system-ui, sans-serif;
  text-rendering: geometricPrecision;
}

html[dir="rtl"] body {
  font-family: "Cairo", "Outfit", system-ui, sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid rgba(82, 102, 122, 0.45);
  outline-offset: 2px;
}

::selection {
  background: rgba(82, 102, 122, 0.28);
}

.page-scroll {
  scrollbar-color: rgba(1, 33, 154, 0.35) transparent;
}

.table-scroll {
  scrollbar-color: rgba(1, 33, 154, 0.45) rgba(237, 241, 245, 0.7);
}

.practice-gradient {
  background: linear-gradient(135deg, #edf1f5 0%, #e1e7ed 45%, #d1dae3 100%);
}

.safe-bottom {
  padding-bottom: calc(5.5rem + env(safe-area-inset-bottom));
}
