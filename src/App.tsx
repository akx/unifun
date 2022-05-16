import React from "react";
import qaz from "./gen/qazwtf";

enum CapsTransform {
  None = "none",
  Upper = "upper",
  Lower = "lower",
  Invert = "invert",
  Alternate1 = "alternate1",
  Alternate2 = "alternate2",
}

function transform(s: string, mapping: Map<number, number>) {
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

function computeResults(text: string, spacing: number, caps: CapsTransform) {
  const results: Record<string, string> = {};
  const trim = addSpacing(doCapsTransform(text.trim(), caps), spacing);
  if (trim.length) {
    results["No Transform"] = trim;
    for (const name in qaz) {
      results[name] = transform(trim, qaz[name]);
    }
  }
  return results;
}

function App() {
  const [text, setText] = React.useState("");
  const [spacing, setSpacing] = React.useState(0);
  const [caps, setCaps] = React.useState<CapsTransform>(CapsTransform.None);
  const results = React.useMemo(
    () => computeResults(text, spacing, caps),
    [text, spacing, caps],
  );
  return (
    <main>
      <header>
        <input
          type="text"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label>
          <span>Spaces between letters</span>
          <input
            type="number"
            min={0}
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
          />
        </label>
        <label>
          <span>Caps Transform</span>
          <select
            value={caps}
            onChange={(e) => setCaps(e.target.value as CapsTransform)}
          >
            <option value={CapsTransform.None}>None</option>
            <option value={CapsTransform.Upper}>Upper</option>
            <option value={CapsTransform.Lower}>Lower</option>
            <option value={CapsTransform.Invert}>Invert</option>
            <option value={CapsTransform.Alternate1}>Alternate 1</option>
            <option value={CapsTransform.Alternate2}>Alternate 2</option>
          </select>
        </label>
      </header>
      <table>
        <tbody>
          {Object.entries(results).map(([name, text]) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>
                <input type="text" readOnly value={text} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        React frontend via: <a href="https://github.com/akx">@akx</a> &middot;
        Mappings via: <a href="https://qaz.wtf/u/">A Unicode Toy</a> &copy;
        2009-2021 Eli the Bearded
      </footer>
    </main>
  );
}

export default App;
