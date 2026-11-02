# Instrument source reference

## Source map

[Architecture and workflows](../docs/architecture.md) · [Function index](../docs/functions.md)

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

Validate the smaller Pd download and its bundled notices with:

```sh
python3 scripts/check-pd-download.py
```
