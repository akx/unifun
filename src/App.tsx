import React from "react";
import { CapsTransform, doTransform } from "./transform";

function App() {
  const [text, setText] = React.useState("");
  const [spacing, setSpacing] = React.useState(0);
  const [spacer, setSpacer] = React.useState(" ");
  const [repeat, setRepeat] = React.useState(1);
  const [caps, setCaps] = React.useState<CapsTransform>(CapsTransform.None);
  const [reverse, setReverse] = React.useState(false);
  const [collapse, setCollapse] = React.useState(false);
  const results = React.useMemo(
    () =>
      doTransform(text, {
        collapse,
        reverse,
        spacing,
        spacer,
        repeat,
        caps,
      }),
    [text, collapse, reverse, spacing, spacer, repeat, caps],
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
        <div className="row">
          <span>Repeat letters</span>
          <label style={{ flex: 1 }}>
            <input
              type="number"
              min={1}
              value={repeat}
              onChange={(e) => setRepeat(Number(e.target.value))}
            />
            <span> times</span>
          </label>
        </div>
        <div className="row">
          <span>Pad letters</span>
          <label style={{ flex: 1 }}>
            <span>Put</span>
            <input
              type="number"
              min={0}
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
            />
            <span> copies of the string</span>
            <input value={spacer} onChange={(e) => setSpacer(e.target.value)} />
            <span> between letters</span>
          </label>
        </div>
        <div className="row">
          <span>This and that</span>
          <div>
            <label>
              <input
                type="checkbox"
                checked={reverse}
                onChange={(e) => setReverse(e.target.checked)}
              />
              Reverse input
            </label>
            <label>
              <input
                type="checkbox"
                checked={collapse}
                onChange={(e) => setCollapse(e.target.checked)}
              />
              Collapse spaces
            </label>
          </div>
        </div>
        <label className="row">
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
        React frontend via: <a href="https://github.com/akx">@akx</a> &middot; Mappings via:{" "}
        <a href="https://qaz.wtf/u/">A Unicode Toy</a> &copy; 2009-2021 Eli the Bearded
      </footer>
    </main>
  );
}

export default App;
