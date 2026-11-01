---
name: messier57-instrument
description: Run, inspect and modify the Messier57 local browser/Pure Data instrument while preserving recovered DSP, controls and hardware provenance.
---

# Messier ’57 source guide

Use the repository root as the working directory. Read `README.md`, `THIRD-PARTY.md` and `RELEASE-STATUS.md` first. This is the public source beta of the reviewed instrument.

## First result

Run `python3 -m http.server 8000 --bind 127.0.0.1`, then open `http://127.0.0.1:8000/software/browser/index.html?embed=1`. Choose audio explicitly. DSP, excitation WAVs and scene assets are local; there are no credentials or model-provider calls to configure. Browser audio requires a user gesture. For desktop sound, open `software/pure-data/desktop.pd` and then `grooves.pd` in Pure Data Vanilla.

## Navigate by task

- Audio initialization, excitation and parameters: `software/browser/app.js`, especially `enable`, `strike`, `actualRattle`, `updateSound` and `releaseLatch`.
- Groove scheduling: `startGroove`, `scheduleEvent`, `tick`, `stopGroove` in the same file; `grooves.js` holds patterns.
- Editable steps: `software/browser/sequencer.js` exports `editablePattern`, `toggleStep`, `loosenValues`, `setLoosenStep`.
- Shared room: `software/browser/room-reverb.js`, `createRoomReverb`.
- Actual Pd adapter: `software/browser/libpd-engine/engine.js`, `createMessierPd`; read its README and runtime provenance before DSP changes.
- Fixed view/materials and physical hit zones: `software/browser/scene.js`, `materials.js`, `model/messier57-v3.glb`.
- Desktop wrapper: `software/pure-data/desktop.pd`, `instrument.pd`; ten qlist scores are in `grooves/`.
- Historical hardware/classification source: `software/pure-data/original-project/`. It is archival, with incomplete original runtime/search-path layout.
- Hardware evidence: `hardware/BOM.csv`, `SPECIFICATIONS.md`, `BUILD-NOTES.md`; original native CAD is `hardware/cad/Electric Drum.3dm`.

## Preserve the contracts

Keep the recovered snare source and credits intact unless the task explicitly changes DSP. The snare has three original noise sources. K is a newer low-tuned CHAIR bongo demonstration voice. Manual head/rim/both selection substitutes for the historical live classifier. The virtual latch mapping is `.8 * (1 - pull)`; physical endpoint calibration remains unverified.

Retain explicit audio choice; one volume and Stop; S/Shift/brass-latch hold; editable kick/head/rim steps; independent per-step loosening; and up/right increase, down/left decrease, with arrow-key access. The camera is fixed. Rendering assets are presentation reconstructions, separate from native mechanical CAD and the portfolio’s retouched interior photograph.

Run `node --experimental-default-type=module software/browser/libpd-engine/test-engine.mjs` for the shipped offline engine checks. Then verify actual browser sound, touch controls, keyboard/focus, viewport fit and audio teardown separately. Historical JSON validation is evidence, not a replacement for checking the current integration.

Preserve licence notices, including the verified CHAIR MIT notice and derivative correspondence. Preserve original CAD/Blender bytes and authorship metadata. Publication requires Peter’s review.
