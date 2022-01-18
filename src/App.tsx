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

function computeResults(text: string) {
  const results: Record<string, string> = {};
  const trim = text.trim();
  if (trim.length) {
    for (const name in qaz) {
      results[name] = transform(trim, qaz[name]);
    }
  }
  return results;
}

function App() {
  const [text, setText] = React.useState("");
  const results = React.useMemo(() => computeResults(text), [text]);
  return (
    <main>
      <input
        type="text"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
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
