import axe from "axe-core"

export async function checkA11y(container: HTMLElement, options?: axe.RunOptions) {
  const results = await axe.run(container, {
    rules: {
      // JSDOM has no CSS rendering engine, so color-contrast is verified in real browser
      "color-contrast": { enabled: false },
    },
    ...options,
  })
  return results.violations
}
