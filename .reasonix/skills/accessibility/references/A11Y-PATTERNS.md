# Accessibility Code Patterns

## Skip link

```html
<a class="skip-link" href="#main-content">Skip to main content</a>
<main id="main-content">
  ...
</main>
```

```css
.skip-link {
  position: absolute;
  left: 1rem;
  top: -3rem;
}

.skip-link:focus {
  top: 1rem;
}
```

## Form labels

```html
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email" />
```

## Error handling

```html
<label for="password">Password</label>
<input
  id="password"
  type="password"
  aria-invalid="true"
  aria-describedby="password-error"
/>
<p id="password-error" role="alert">Password must be at least 12 characters.</p>
```

## Modal focus trap

- Move focus into the dialog when it opens.
- Keep keyboard focus within the dialog while it is open.
- Return focus to the trigger when the dialog closes.
- Prefer native `<dialog>` or accessible dialog primitives when available.

## Live regions and notifications

```html
<div aria-live="polite" id="status-region"></div>
```

```ts
function announceStatus(message: string) {
  const region = document.getElementById("status-region");
  if (region) {
    region.textContent = message;
  }
}
```
