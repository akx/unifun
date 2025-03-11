import qaz from "./gen/qazwtf";

export enum CapsTransform {
  None = "None",
  Upper = "Upper",
  Lower = "Lower",
  Invert = "Invert",
  Alternate1 = "Alternate 1",
  Alternate2 = "Alternate 2",
}

function mappingTransform(s: string, mapping: Map<number, number>) {
  return Array.from(s)
    .map((c) => {
      const repl = mapping.get(c.codePointAt(0) ?? 0);
      return repl ? String.fromCodePoint(repl) : c;
    })
    .join("");
}

function addSpacing(text: string, spacing: number, spacer = " ") {
  return Array.from(text).join(spacer.repeat(spacing));
}

function doCapsTransform(s: string, caps: CapsTransform) {
  switch (caps) {
    case CapsTransform.None:
      return s;
    case CapsTransform.Upper:
      return s.toUpperCase();
    case CapsTransform.Lower:
      return s.toLowerCase();
    case CapsTransform.Invert:
      return s
        .split("")
        .map((c) => (c.toUpperCase() === c ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    case CapsTransform.Alternate1:
    case CapsTransform.Alternate2: {
      const a = caps === CapsTransform.Alternate2 ? 1 : 0;
      return s
        .split("")
        .map((c, i) => ((i & 1) === a ? c.toUpperCase() : c.toLowerCase()))
        .join("");
    }
  }
}

function maybeReverse(s: string, reverse: boolean) {
  return reverse ? s.split("").reverse().join("") : s;
}

function addRepeat(s: string, repeat: number) {
  return Array.from(s)
    .map((c) => c.repeat(repeat))
    .join("");
}

interface TransformParams {
  caps: CapsTransform;
  collapse: boolean;
  repeat: number;
  reverse: boolean;
  spacing: number;
  spacer: string;
}

function maybeCollapse(s: string, collapse: boolean) {
  return collapse ? s.replace(/\s+/g, " ") : s;
}

export function doTransform(
  text: string,
  { reverse, collapse, spacing, spacer, repeat, caps }: TransformParams,
) {
  const results: Record<string, string> = {};
  const trim = maybeReverse(
    addSpacing(
      maybeCollapse(doCapsTransform(addRepeat(text.trim(), repeat), caps), collapse),
      spacing,
      spacer,
    ),
    reverse,
  );
  if (trim.length) {
    results["No Transform"] = trim;
    for (const name in qaz) {
      results[name] = mappingTransform(trim, qaz[name]);
    }
  }
  return results;
}
