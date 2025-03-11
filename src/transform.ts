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

export function doMappingTransforms(trim: string) {
  const results: Record<string, string> = {};
  if (trim.length) {
    results["No Transform"] = trim;
    for (const name in qaz) {
      results[name] = mappingTransform(trim, qaz[name]!);
    }
  }
  return results;
}

export function doTransform(
  text: string,
  { reverse, collapse, spacing, spacer, repeat, caps }: TransformParams,
) {
  return maybeReverse(
    addSpacing(
      maybeCollapse(doCapsTransform(addRepeat(text.trim(), repeat), caps), collapse),
      spacing,
      spacer,
    ),
    reverse,
  );
}

function weightedDice(ratiosSum: number, mixerRatios: Record<string, number>) {
  const dice = Math.random() * ratiosSum;
  let acc = 0;
  for (const [key, value] of Object.entries(mixerRatios)) {
    acc += value;
    if (dice <= acc) {
      return key;
    }
  }
  return null;
}

export function doMixerTransform(text: string, mixerRatios: Record<string, number>) {
  const ratiosSum = Object.values(mixerRatios).reduce((a, b) => a + b, 0);
  if (ratiosSum <= 0) return text;
  return Array.from(text)
    .map((char) => {
      const mapping = qaz[weightedDice(ratiosSum, mixerRatios) ?? "xxx"];
      return mapping ? mappingTransform(char, mapping) : char;
    })
    .join("");
}
