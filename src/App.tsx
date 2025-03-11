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
  const visibleKeys = [...keys].filter((name) => mixerMode || results[name]);
  return (
    <main className="border container m-2 mx-auto bg-white">
      <header className="border-b p-2 flex flex-col">
        <input
          className="border w-full border-gray-400 p-1"
          type="text"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label>
          Repeat letters
          <input
            type="number"
            className="inline w-16 text-center border-b"
            min={1}
            value={repeat}
            onChange={(e) => setRepeat(Number(e.target.value))}
          />
          <span> times</span>
        </label>
        <label>
          <span>Pad with </span>
          <input
            type="number"
            className="inline w-16 text-center border-b"
            min={0}
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
          />
          <span> copies of the string </span>
          <input
            value={spacer}
            className="inline border-b"
            onChange={(e) => setSpacer(e.target.value)}
          />
          <span> between letters</span>
        </label>
        <div className="flex gap-2">
          <label>
            <input
              type="checkbox"
              checked={reverse}
              onChange={(e) => setReverse(e.target.checked)}
            />{" "}
            Reverse input
          </label>
          <label>
            <input
              type="checkbox"
              checked={collapse}
              onChange={(e) => setCollapse(e.target.checked)}
            />{" "}
            Collapse spaces
          </label>
        </div>
        <label className="row">
          <span>Caps:</span>
          <div className="inline-flex flex-wrap ps-2 gap-2">
            {Object.values(CapsTransform).map((t) => (
              <label key={t}>
                <input
                  type="radio"
                  name="caps-transform"
                  value={t}
                  checked={caps === t}
                  onChange={() => setCaps(t)}
                />{" "}
                {t}
              </label>
            ))}
          </div>
        </label>
        <label>
          <input
            type="checkbox"
            checked={mixerMode}
            onChange={(e) => setMixerMode(e.target.checked)}
          />{" "}
          Mixer mode
        </label>
      </header>
      <div className="p-2">
        <table className="w-full">
          {mixerMode ? (
            <thead>
              <tr>
                <td></td>
                <td></td>
                <th className="w-40">
                  <div className="flex gap-1 *:grow">
                    <button
                      className="border border-gray-400 hover:border-black"
                      type="button"
                      onClick={() =>
                        setMixerRatios(
                          Object.fromEntries([...keys].map((name) => [name, Math.random()])),
                        )
                      }
                    >
                      Rnd
                    </button>
                    <button
                      className="border border-gray-400 hover:border-black"
                      type="button"
                      onClick={() => setMixerRatios({})}
                    >
                      Zero
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
          ) : null}
          <tbody>
            {visibleKeys.map((name) => (
              <tr key={name}>
                <th scope="row" className="text-start w-64">
                  {name}
                </th>
                <td>
                  {results[name] && (
                    <input type="text" readOnly className="w-full" value={results[name]} />
                  )}
                </td>
                {mixerMode && name !== "Mixed" ? (
                  <td>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
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
      </div>
      <footer className="text-center p-2">
        React frontend via:{" "}
        <a href="https://github.com/akx" className="text-red-600">
          @akx
        </a>{" "}
        &middot; Mappings via:{" "}
        <a href="https://qaz.wtf/u/" className="text-red-600">
          A Unicode Toy
        </a>{" "}
        &copy; 2009-2021 Eli the Bearded
      </footer>
    </main>
  );
}

export default App;
