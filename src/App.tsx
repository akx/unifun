import React from "react";
import { CapsTransform, doMappingTransforms, doMixerTransform, doTransform } from "./transform";
import qazwtf from "./gen/qazwtf";

function App() {
  const [text, setText] = React.useState(() =>
    window.location.hostname.startsWith("localhost") ? "the walls are closing in" : "",
  );
  const [spacing, setSpacing] = React.useState(0);
  const [spacer, setSpacer] = React.useState(" ");
  const [repeat, setRepeat] = React.useState(1);
  const [caps, setCaps] = React.useState<CapsTransform>(CapsTransform.None);
  const [reverse, setReverse] = React.useState(false);
  const [collapse, setCollapse] = React.useState(false);
  const [mixerMode, setMixerMode] = React.useState(false);
  const [mixerRatios, setMixerRatios] = React.useState<Record<string, number>>({});
  const transformed = React.useMemo(
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
  const results = React.useMemo(() => {
    let results = doMappingTransforms(transformed);
    if (mixerMode) {
      try {
        results = {
          Mixed: doMixerTransform(transformed, mixerRatios),
          ...results,
        };
      } catch {
        // vituiks meni, evm
      }
    }
    return results;
  }, [mixerMode, transformed, mixerRatios]);
  const keys = new Set(Object.keys(results)).union(new Set(Object.keys(qazwtf)));
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
        <div className="row">
          <span>Mapping Mode</span>
          <div>
            <label>
              <input
                type="checkbox"
                checked={mixerMode}
                onChange={(e) => setMixerMode(e.target.checked)}
              />
              Mixer mode
            </label>
          </div>
        </div>
      </header>
      <table>
        {mixerMode ? (
          <thead>
            <tr>
              <td></td>
              <td></td>
              <th style={{ width: "10em" }}>
                <div style={{ display: "flex", gap: "3px" }}>
                  <button
                    type="button"
                    onClick={() =>
                      setMixerRatios(
                        Object.fromEntries([...keys].map((name) => [name, Math.random()])),
                      )
                    }
                  >
                    Rnd
                  </button>
                  <button type="button" onClick={() => setMixerRatios({})}>
                    Zero
                  </button>
                </div>
              </th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {[...keys].map((name) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>{results[name] && <input type="text" readOnly value={results[name]} />}</td>
              {mixerMode && name !== "Mixed" ? (
                <td>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={mixerRatios[name] || 0}
                    onChange={(e) =>
                      setMixerRatios((mr) => ({
                        ...mr,
                        [name]: Number(e.target.value),
                      }))
                    }
                  />
                </td>
              ) : null}
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
