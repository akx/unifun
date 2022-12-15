import React from "react";
import { CapsTransform, doTransform } from "./transform";

function App() {
  const [text, setText] = React.useState("");
  const [spacing, setSpacing] = React.useState(0);
  const [caps, setCaps] = React.useState<CapsTransform>(CapsTransform.None);
  const results = React.useMemo(
    () => doTransform(text, spacing, caps),
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
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {Object.values(CapsTransform).map((t) => (
              <label key={t}>
                <input
                  type="radio"
                  name="caps-transform"
                  value={t}
                  checked={caps === t}
                  onChange={() => setCaps(t)}
                />
                {t}
              </label>
            ))}
          </div>
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
