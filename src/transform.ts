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

function addSpacing(text: string, spacing: number) {
  return Array.from(text).join(" ".repeat(spacing));
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
    case CapsTransform.Alternate2:
      const a = caps === CapsTransform.Alternate2 ? 1 : 0;
      return s
        .split("")
        .map((c, i) => ((i & 1) === a ? c.toUpperCase() : c.toLowerCase()))
        .join("");
  }
}

export function doTransform(text: string, spacing: number, caps: CapsTransform) {
  const results: Record<string, string> = {};
  const trim = addSpacing(doCapsTransform(text.trim(), caps), spacing);
  if (trim.length) {
    results["No Transform"] = trim;
    for (const name in qaz) {
      results[name] = mappingTransform(trim, qaz[name]);
    }
  }
  return results;
}
