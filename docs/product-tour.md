# Messier ’57 product tour

Messier ’57 is an electric drum with an acoustic feel. Its browser and Pure Data auditions let you play the physical snare model, edit grooves and inspect the relationship between excitation, snare loosening and the room sound.

[Open demo](https://atelierneyra.com/hardware/messier-57?play=1) · [Play locally](getting-started.md) · [Reviewed v0.1.1 source beta](https://github.com/latintzar/messier57-instrument/releases/tag/v0.1.1-source-beta)

## Play and change one groove

1. Open the instrument. Choose **Enable audio** to hear it or **Continue without audio** to inspect the controls and fixed model. The **Audio** button can enable sound later.
2. Play the head with **H**, the rim with **R**, and the kick with **K**, or use their visible controls. **Where the sound works** selects **Head / Rim / Both** for snare excitation.
3. Choose a groove and press **Play beat**. Each of the ten two-bar presets includes kick. The 32-column sequencer shows kick, head and rim; toggle a cell to change that hit.
4. Hold **S**, **Shift** or the brass latch: **“Hold to loosen.”** The snare response changes while the control is held.
5. Drag a snare percentage up/right to increase loosening or down/left to decrease it. Arrow keys work too. Individual sequencer percentages set per-step loosening.
6. Adjust the single **Volume** and press **Stop** when finished. Close the portfolio modal to tear down its audio graph and restore focus to the opener.

The result is a played and edited groove using the actual snare DSP. Preset edits live in the current browser session. The model stays in a fixed material-and-shadow view while you play.

## Product areas and source

| Area | Action and result | Module |
| --- | --- | --- |
| Audio and playing state | Start audio, strike a voice, hold/release the latch and stop | [app.js](../software/browser/app.js) |
| Physical snare and demonstration kick | Run the Pd model through the pinned worklet | [libpd-engine](../software/browser/libpd-engine/README.md) |
| Sequencer | Change hit cells and per-step loosening | [sequencer.js](../software/browser/sequencer.js), [grooves.js](../software/browser/grooves.js) |
| Shared room | Put dry pickups, snare and kick in one stereo room | [room-reverb.js](../software/browser/room-reverb.js) |
| Fixed instrument view | Play the head/rim and hold the physical latch | [scene.js](../software/browser/scene.js), [materials.js](../software/browser/materials.js) |
| Desktop audition | Play the portable Pd wrapper and groove scores | [software/pure-data](../software/pure-data) |
| Hardware and design | Inspect CAD, parts and assembly evidence | [hardware](../hardware), [visualisation](../visualisation) |

## Sound and interaction decisions

The CHAIR snare runs in native Pd and in the browser’s libpd C/WASM runtime. The later demonstration kick uses CHAIR’s low-tuned `bongo~` resonator. Browser voices and dry pickups share one stereo convolution room before the master output.

The resting snare values are tuning `.6`, rattle `.8`, damping `.6`. Latch pull maps to `rattle = .8 × (1 − pull)`. The strongest active pull from the key, latch, global percentage or current step wins, keeping a held gesture meaningful during a groove.

The browser substitutes manual area selection for the historical Bonk pickup classifier. [Architecture](architecture.md) explains these choices, the scheduling clock and close/pagehide teardown. [Instrument reference](instrument-reference.md) preserves the original microphone arrangement, selector, spring return and hardware/runtime history.

## Continue the instrument

Start with [local browser/Pd setup](getting-started.md), then use the [function index](functions.md) or [source guide skill](../skills/messier57-instrument/SKILL.md). Run the documented offline DSP checks, then check actual audio, touch, keyboard and teardown for the change you make.

The [source-beta record](../RELEASE-STATUS.md) and [third-party notices](../THIRD-PARTY.md) govern the included material. The original Rhino file remains the mechanical reference. Visualisation files are presentation reconstructions, and portfolio research/media stay with the portfolio. The v0.1.1 instrument download remains its fixed reviewed release while these guides evolve on `main`.
