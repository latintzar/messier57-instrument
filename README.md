# Messier ’57

An acoustic drum whose microphones excite a physically modelled snare. Designed and built by Peter Neyra.

[Open demo](https://atelierneyra.com/hardware/messier-57?play=1) · [Website](https://atelierneyra.com/hardware/messier-57) · [Download source](https://github.com/latintzar/messier57-instrument/releases/download/v0.1.0-source-beta/messier57-source-beta-v0.1.0.zip) · [Source beta](RELEASE-STATUS.md)

[![Messier ’57 drum on its stand beside an amplifier](https://atelierneyra.com/hardware/media/92b6541e_6.jpg)](https://atelierneyra.com/hardware/messier-57)

## Play in the browser

Python 3 and a browser with Web Audio and WebGL are enough. From this repository:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the instrument](http://127.0.0.1:8000/software/browser/index.html?embed=1), then choose **Enable audio**. The player, model, excitation recordings, fonts and DSP runtime are included locally.

- **H**: head. **R**: rim. **K**: kick.
- Hold **S**, **Shift** or the brass latch to loosen the snares.
- **Head / Rim / Both** chooses which areas excite the snare.
- Choose one of ten grooves and press **Play beat**. Click kick/head/rim cells to edit the rhythm.
- Drag a percentage up or right to increase loosening; down or left decreases it. Arrow keys work too.
- One **Volume** controls the output; **Stop** ends the beat and releases held controls.

Audio starts after an explicit choice. The instrument processes locally and uses its included excitations. It runs with the included local assets.

## Play in Pure Data

Open `software/pure-data/desktop.pd` in Pure Data Vanilla, then open `grooves.pd` beside it. DSP starts when the desktop patch loads; start with low output volume. The same three voices, controls and ten groove scores are included.

The original snare runs in native Pd and in the browser's pinned libpd C/WASM runtime. The newer demonstration kick uses CHAIR’s unchanged `bongo~` resonator tuned low. Browser voices share one stereo convolution room; native Pd uses the included CHAIR/Tom Erbe Chris Moore reverb.

## Source map

[Architecture and workflows](docs/architecture.md) · [Function index](docs/functions.md)

| Path | Contents |
| --- | --- |
| `software/browser/app.js` | Audio choice, excitation, sensing, latch, controls and groove scheduling |
| `software/browser/sequencer.js` | Editable hit cells and per-step loosening |
| `software/browser/scene.js` | Fixed material/shadow view and head/rim/latch interaction |
| `software/browser/room-reverb.js` | Shared stereo room impulse and wet/dry routing |
| `software/browser/libpd-engine/` | Actual C/WASM DSP adapter, Pd source, provenance and numerical checks |
| `software/pure-data/` | Portable desktop audition, dependencies, WAV excitations and ten qlist scores |
| `software/pure-data/original-project/` | Recovered hardware/Bonk patches and training templates |
| `hardware/cad/Electric Drum.3dm` | Original native Rhino design |
| `hardware/BOM.csv` | Parts, evidence and remaining specifications |
| `hardware/SPECIFICATIONS.md`, `BUILD-NOTES.md` | Controls, known dimensions, assembly context and measurements to recover |
| `visualisation/` | Editable Blender presentation scene and compressed GLB |

The original prototype used a central lavalier and edge contact microphone to excite one snare model. Its selector used a small dot for head, a ring for rim and a large dot for both. A short internal spring returned the brass latch and shaft. Saved baseline: tuning `.6`, rattle `.8`, damping `.6`.

The audition maps latch pull to `rattle = .8 × (1 − pull)` and substitutes manual zone choice for live Bonk classification. Its kick is a later demonstration voice. Original notes record Bela CPU limits and a planned Intel mini-PC/Max continuation. Historical patches and training templates preserve that work; their hardware runtime and large recording datasets remain separate.

The Blender scene is a presentation reconstruction. The original Rhino file remains the mechanical reference. The portfolio’s retouched curved mahogany support image is a separate presentation asset, rather than a revised manufacturing drawing.

## Validate the DSP

```sh
node --experimental-default-type=module software/browser/libpd-engine/test-engine.mjs
```

Node.js 22 or later runs the shipped offline worklet checks without an npm install. `software/browser/libpd-engine/VALIDATION.json`, `PARITY.json` and `FULL-PARITY.json` retain earlier engine evidence. Browser interaction and audible checks are separate from numerical DSP checks.

## Agents

Read [the source navigation skill](skills/messier57-instrument/SKILL.md). It maps controls to the actual modules, explains the first result and records the historical boundaries. Copy its folder to your agent's skills directory when useful.

## Credits and reuse

Peter Neyra: original instrument design, build, CAD and original software. CHAIR: snare/bongo models and helpers. Tom Erbe: Chris Moore reverb implementation, included through CHAIR. Pure Data: Miller Puckette and contributors. libpd, Three.js and Draco retain their notices.

[LICENSE](LICENSE) covers Peter’s original software and documentation. CHAIR’s verified MIT source notice is included in [third_party/CHAIR/](third_party/CHAIR/PROVENANCE.md), with exact matches and later model derivatives distinguished. [THIRD-PARTY.md](THIRD-PARTY.md) records all dependency terms. Original CAD, BOM, specifications and visualisation are included with Peter’s explicit reuse authorization and preserved authorship metadata. The [source beta](RELEASE-STATUS.md) contains the reviewed instrument and design files. Portfolio research images and its media collection stay with the portfolio.

[made by atelier neyra](https://atelierneyra.com)
