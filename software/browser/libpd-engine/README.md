# Actual Pure Data engine in the browser

The shipped worklet runs **libpd's C DSP compiled to WebAssembly**. It loads the recovered CHAIR snare patch as Pd source at runtime; it does not translate the operators into WebPd substitutes. The runtime reports **Pure Data 0.56.2**, distributed by pinned npm package **libpd-wasm 0.1.6**.

```js
import {createMessierPd} from './libpd-engine/engine.js';
const pd = await createMessierPd(audioContext);
const inputs=audioContext.createChannelMerger(2);
source.connect(inputs,0,0); // snare excitation
kickSource.connect(inputs,0,1); // optional kick excitation
inputs.connect(pd.node);
pd.node.connect(outputGain);
pd.setParams({tuning: .6, rattle: .8, damping: .6});
pd.sendFloat('messier-rattle', .1); // pull loosens rattle in the UI
```

`setParams` sets all three values, using defaults for omitted keys. `sendFloat` changes one named receive independently. All model parameters use 0–1. `close()` closes the Pd patch and disconnects the node. The user must resume the AudioContext from a browser gesture. The engine does not request microphone access.

The worklet processes **two native 64-sample Pd ticks for each 128-sample Web Audio quantum**. Browser quantum size does not change Pd's internal delay/block semantics. The only edits to the upstream JavaScript worklet are enabling two input channels and interleaving their input samples to the allocated libpd input buffer; embedded WASM bytes are unchanged. `RUNTIME-PROVENANCE.json` records hashes and the exact edits. The wrapper `engine.js` provides file loading and parameter messages without shipping the upstream package's separate patch analyzer.

## Patch provenance

`source/main.pd` contains the complete `pd snare` subpatch extracted from the recovered `_main.pd`, unchanged. Its original arithmetic, noise generators, cubic delay readers, feedback graph and existing author credit are retained. `allp~.pd`, `allp4~.pd` and `chair.dc-offset~.pd` are byte-identical recovered helpers. `chair.distance.pd` is the original dependency recovered from the IRP CHAIR library.

The audition wrapper supplies mono input, center XY (0.5, 0.5), parameter receives, a 0.5 output gain, 4 Hz output high-pass and ±0.98 output protection. It does not include the final instrument's other effects, Bonk classifier or hardware I/O. Manual head/rim/whole interaction is an interface control; the designer confirms Bonk belongs to the final physical three-zone instrument.

## Evidence

- The original snare loads and produces finite, nonzero output through the shipped WASM AudioWorklet, with no missing objects or DSP-loop errors.
- A 97,020-sample deterministic impulse comparison with native Pd 0.55-0, disabling all three noise sources identically only in the test variants, has maximum sample error **1.49e-8**, RMS error **4.87e-10** and correlation **0.999999999999913** (`PARITY.json`). The delivered patch keeps all original noise sources.
- With the complete unchanged snare including noise, aligned startup gives maximum sample error **1.30e-5**, RMS error **1.12e-7**, correlation **0.9999999909** (`FULL-PARITY.json`). This is strong agreement, not a claim of bit-identical output across Pd versions, architectures or sample rates.
- `VALIDATION.json` records nine parameter settings and extreme corners. Repeat the offline worklet checks with `node test-engine.mjs`; no npm install is needed to run the shipped tests.

The old WebPd build is superseded. Its compiler rounded `delread4~` delays instead of implementing cubic interpolation, and used a different unseeded noise generator. These are important distinctions for this model's sound.

## Distribution

Serve this folder and `source/` alongside the player. The runtime is embedded in the worklet file, so no external CDN or native server is required. Retain `LICENSE-libpd.txt`, package provenance and existing patch credits. Source: https://github.com/hyrfilm/libpd-wasm . This adapter ships the pinned prebuilt runtime rather than claiming a local C rebuild. The verified CHAIR MIT notice is in LICENSE-CHAIR.txt; exact matches and bounded model/helper derivatives are recorded in ../../../third_party/CHAIR/PROVENANCE.md.

## Three-voice edition

The wrapper now adds an independent low-tuned, unchanged CHAIR bongo~ resonator for the kick. Input channel 1 still feeds the unchanged snare; channel 2 feeds the kick. V3-VALIDATION.json checks actual WASM output and confirms zero snare difference against the prior mono engine in the regression case. The browser uses one worklet instance. Native Pd edition, matching qlist scores and historical .pd sources are in ../../pure-data/. The browser kick is a new demo addition, not an assertion about the original prototype.
