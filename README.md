# Tasky — To-Do App

A sleek, mobile-first To-Do app built with vanilla HTML, CSS, and JavaScript. Inspired by modern mobile UI patterns from [Mobbin](https://mobbin.com).

## Features

- **Add tasks** via a bottom-sheet modal with a floating action button (FAB)
- **Priority levels** — Low, Medium, High with color-coded indicators
- **Filter tasks** — All, Active, Completed
- **Mark complete** with a custom animated checkbox
- **Delete tasks** individually or clear all completed at once
- **Live stats** — Total, Active, and Done counts in the header
- **Dark theme** — modern dark UI with purple accent colors
- **LocalStorage** — tasks persist across page reloads
- **Smooth animations** — slide-up modal, card entrance animations

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, keyframe animations)
- Vanilla JavaScript (no frameworks, no dependencies)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/AKASHNINJA/todo-app.git

# Open in browser
cd todo-app
open index.html
```

No build step. No dependencies. Just open `index.html` in any modern browser.

## Project Structure

```
todo-app/
├── index.html   # App shell & markup
├── style.css    # Dark theme, layout, animations
└── app.js       # State management & DOM rendering
```

## Screenshots

> Dark mobile-first UI with priority dots, stats header, filter tabs, and FAB.

## License

MIT
