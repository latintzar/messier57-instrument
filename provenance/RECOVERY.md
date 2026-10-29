# Source recovery

Recovered 2026-10-28 from `Messier57-Atelier-v4.zip`, following its `HANDOFF.md`, `PAGE-PLAN.md` and `VALIDATION.json`. Only the source-only inner package, `downloads/messier57-project-files.zip`, supplied this repository baseline. The portfolio, research images and full media collection remain separate.

- Outer archive SHA256: `2463f317ea59c5e63faa968af6538879094a87593e560f9cce076a34f4835193`.
- Source-only ZIP SHA256: `b674fe29dde26cfeafc97e3a0e7bcaa5987202356abebe5ecad13b4e91d49d71`.
- Baseline: 134 regular files, 97,769,635 uncompressed bytes, no symlinks or unsafe paths.
- Original native Rhino SHA256: `858d27cb88bc2fdeec75a04124cae3b92fcdbf7627e613d6828be017bf17cff1`.
- Blender source SHA256: `c92e1d7f3db0c0148d9f2cfccd1670650b7faea0c13d606f36926f58797ab061`.
- Presentation GLB SHA256: `f7d47ea48676837d87665b08753143a178ad9634992f016cd6dd962371664d94`.

The source package includes the full static browser player. Its 24 libpd-engine files matched the portfolio engine byte-for-byte at recovery. The complete `pd snare` body is 3,198 characters and matches the recovered original in both the native and browser wrappers, retaining all three `noise~` objects.

Integration corrections are documentation paths, scoped original-code licensing, third-party notices, private review status and source navigation. The browser now loads the same DM Sans and Instrument Serif fonts locally under OFL notices; its S label is exactly “Hold to loosen.” and its footer uses the requested Atelier anchor. An appended `pagehide` handler releases held/playing voices, mutes output, disconnects the Pd node and closes the owned AudioContext when its frame unloads. The DSP, patches, CAD, models and recordings remain preserved. Numerical evidence in retained JSON files is earlier evidence, separately identified from new integration tests.

See [../PRIVATE-REVIEW.md](../PRIVATE-REVIEW.md) for the private review gate and [../THIRD-PARTY.md](../THIRD-PARTY.md) for upstream terms.



## CHAIR primary evidence update

The pinned official tickle-examples MIT licence supersedes the earlier blanket CHAIR hold. `third_party/CHAIR/` retains its verbatim notice, 21 exact native-Pd matches and documented model/helper derivatives. Original DSP, CAD, models, recordings and visual assets are preserved byte-for-byte. Peter explicitly authorizes inclusion and reuse of his original design materials with their authorship metadata.

[made by atelier neyra](https://atelierneyra.com)
