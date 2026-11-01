# Third-party source and notices

| Material | Included location | Terms and provenance |
| --- | --- | --- |
| Pure Data / libpd-wasm 0.1.6 | `software/browser/libpd-engine/libpd-worklet.js` | BSD-3-Clause; retain `LICENSE-libpd.txt`, runtime/package provenance. The pinned runtime is prebuilt. |
| Three.js r180 | `software/browser/vendor/three.*.js`, `vendor/addons/` | MIT, in `vendor/THREE-LICENSE`. |
| DM Sans and Instrument Serif | `software/browser/assets/fonts/` | SIL OFL 1.1; both OFL notices and provenance included. |
| Google Draco | `software/browser/vendor/draco/` | Apache-2.0, with LICENSE, AUTHORS and decoder provenance. |
| CHAIR examples, models and helpers | `.pd` sources in both editions; embedded snare and bongo derivatives | Verified MIT base from pinned `chairaudio/tickle-examples`. Verbatim notice and exact/derivative correspondence in `third_party/CHAIR/`. |
| Schaller M6 locking-machine-head reference drawing | Embedded bitmap in the original Rhino CAD | Schaller’s technical drawing and mark retain their original rights and attribution. Peter’s MIT grant covers his original contributions. |
| Chris Moore reverb by Tom Erbe, via CHAIR | `software/pure-data/chair.chrismoore-reverb~.pd` and archival copy | Exact match to the pinned MIT example; original credit retained. |

The official [tickle-examples README](https://github.com/chairaudio/tickle-examples/blob/8465d66edae545b451b18402ac9a41211c5af14a/README.md#license) explicitly grants MIT reuse, with its [LICENSE](third_party/CHAIR/LICENSE) included verbatim. Twenty-one of 41 native Pd files match that MIT tree exactly. The snare, bongo, distance and polyphony variants have documented derivative differences; [source correspondence](third_party/CHAIR/PROVENANCE.md) records them without claiming exact-file identity for the complete recovered forms.

The recovered snare, including three noise sources, remains unchanged between Peter’s historical patch and current audition wrappers. Peter’s original contributions retain the scoped project MIT grant. Upstream terms and author notices remain their own. Some archival/original files are unmatched by exact blob; this denotes the comparison’s scope, rather than an unlicensed-material finding.

Original CAD, BOM, specifications and visualisation are included with Peter’s explicit reuse authorization. Authorship/path metadata and software-vendor contact metadata remain preserved with those originals. See [recovery provenance](provenance/RECOVERY.md). The [source-beta record](RELEASE-STATUS.md) describes the reviewed publication.

[made by atelier neyra](https://atelierneyra.com)
