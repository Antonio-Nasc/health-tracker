/**
 * Shared/FSD: helper utilitário para compor classes Tailwind sem dependência externa.
 */
export const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");
