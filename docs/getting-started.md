# Play Messier ’57

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


[Product tour](product-tour.md) · [Source reference](instrument-reference.md) · [Credits and reuse](../README.md#credits-and-reuse)
