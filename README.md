# Messier ’57

An electric drum with an acoustic feel.

Messier ’57 is an electric drum whose microphones excite a physically modelled snare. It explores a wider sound palette while preserving the touch of head and rim playing. This reusable project includes the browser and Pure Data instruments, original Rhino CAD, BOM and build notes. Designed and built by Peter Neyra.

[Open demo](https://atelierneyra.com/hardware/messier-57?play=1) · [Website](https://atelierneyra.com/hardware/messier-57) · [Product tour](docs/product-tour.md) · [Download v0.1.1 source beta](https://github.com/latintzar/messier57-instrument/releases/download/v0.1.1-source-beta/messier57-source-beta-v0.1.1.zip)

[![Messier ’57 drum on its stand beside an amplifier](https://atelierneyra.com/hardware/media/92b6541e_6.jpg)](https://atelierneyra.com/hardware/messier-57)

## Play a groove

Open the demo and choose **Enable audio** or **Continue without audio**. Strike the head or rim, or play the kick with **K**. Choose one of ten grooves and press **Play beat**; edit its kick/head/rim steps while it runs. Hold **S**, **Shift** or the brass latch to loosen the snares. One **Volume** sets the output and **Stop** ends the beat.

The [product tour](docs/product-tour.md) walks through the playing controls, editable sequencer, audio choice and source modules.

## What is included

| Area | What you can use |
| --- | --- |
| Browser instrument | Actual CHAIR snare through libpd C/WASM, a low-tuned modelled kick and shared stereo room reverb |
| Sequencer | Ten two-bar grooves with kick, editable kick/head/rim hits and per-step snare loosening |
| Playing controls | Head/Rim/Both selection, hold-to-loosen latch and dark percentage controls |
| Pure Data instrument | Portable desktop audition, dependencies, excitations and groove scores |
| Hardware | Original Rhino design, BOM, specifications and build notes |
| Visualisation | Separately identified Blender scene and compressed GLB |

## Run and understand it

[Play locally in a browser or Pure Data](docs/getting-started.md). The browser ships its model, excitation recordings and DSP runtime locally. Browser audio begins with an explicit user choice.

[Architecture](docs/architecture.md) explains the audio graph, timing and teardown. [Instrument reference](docs/instrument-reference.md) preserves the detailed source map, hardware history, model parameters and DSP checks. [Function index](docs/functions.md) and [source navigation skill](skills/messier57-instrument/SKILL.md) map a change to its actual module.

## Reached stage

This is the [reviewed source beta](RELEASE-STATUS.md). The browser audition uses manual Head/Rim/Both selection and included microphone excitations; the original hardware classifier patches remain in the archive. Its kick is a later demonstration voice. Native Rhino CAD is the mechanical reference; presentation reconstructions are identified separately.

The **v0.1.1 source-beta download is a fixed reviewed snapshot**. Documentation on `main` can develop separately; the release archive and its checksum retain their original bytes.

## Credits and reuse

Peter Neyra: original instrument design, build, CAD and original software. CHAIR: snare/bongo models and helpers. Tom Erbe: Chris Moore reverb implementation, included through CHAIR. Pure Data: Miller Puckette and contributors. libpd, Three.js and Draco retain their notices.

[LICENSE](LICENSE) covers Peter’s original software and documentation. CHAIR’s verified MIT source notice is included in [third_party/CHAIR/](third_party/CHAIR/PROVENANCE.md), with exact matches and later model derivatives distinguished. [THIRD-PARTY.md](THIRD-PARTY.md) records all dependency terms. Original CAD, BOM, specifications and visualisation are included with Peter’s explicit reuse authorization and preserved authorship metadata. The [source beta](RELEASE-STATUS.md) contains the reviewed instrument and design files. Portfolio research images and its media collection stay with the portfolio.

[made by atelier neyra](https://atelierneyra.com)
