import React from "react";
import qaz from "./gen/qazwtf";

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

function computeResults(text: string, spacing: number) {
  const results: Record<string, string> = {};
  const trim = addSpacing(text.trim(), spacing);
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
  const results = React.useMemo(() => computeResults(text, spacing), [text, spacing]);
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
