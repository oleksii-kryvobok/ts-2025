export const $ = <T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T | null => parent.querySelector(selector) as T | null;

export const $$ = <T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T[] => Array.from(parent.querySelectorAll(selector)) as T[];