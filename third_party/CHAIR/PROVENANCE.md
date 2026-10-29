# CHAIR source correspondence

The official [tickle-examples README licence section](https://github.com/chairaudio/tickle-examples/blob/8465d66edae545b451b18402ac9a41211c5af14a/README.md#license) identifies the examples as MIT. The adjacent `LICENSE` is copied verbatim from that pinned repository: Git blob `708dbae874176c33e4780f26084c30e525a964cf`.

## Exact correspondence

`file-correspondence.json` compares all 41 native `.pd` files with that MIT tree. Twenty-one match exactly, including the runtime all-pass helpers, DC-offset helper, touchgate and Chris Moore reverb. These six distinct runtime helper blobs are:

| File | MIT Git blob |
| --- | --- |
| `allp~.pd` | `9bace62765fe65a64f734845f1e4900837e1554f` |
| `allp4~.pd` | `badd7c8d2d8f767e9e8e414f0c6378b675b35948` |
| `allp-d~.pd` | `5dd922ec3c39d5dbd1a035c068dce270e4c29f02` |
| `chair.dc-offset~.pd` | `72be861600fa5f414e3d969d1e5ec98b7f5f1cbc` |
| `chair.touchgate~.pd` | `80629f5e3363399074cd98275b3db9778542a457` |
| `chair.chrismoore-reverb~.pd` | `034c7c85523317122e812c39c2890261c5ebdf47` |

## Model derivatives

The recovered embedded snare is byte-identical between the historical `_main.pd` and both current audition wrappers. Its closest inspected MIT example is `Pd/examples/A06.percussion-snare.pd`, blob `8c02637b292574844a19d1c238456044a214a0cd`. The recovered model removes `block~ 1` and changes distance normalization from `/ 0.7071` to `/ 0.72`, with corresponding connections. Those changes affect DSP semantics; they are not described as formatting.

The standalone MIT `snare~.pd`, blob `2839791c9f4a2593a3605aebe4d3ca6baeb0589d`, also occurs unchanged in the later official CHAIR-Pd-library. The delivered embedded model is a related derivative, rather than that exact standalone file.

The shipped bongo matches later-library blob `cad41f2b8c771e33f2c88b36e1d6463569a4e198`. MIT ancestor `fe8211ed24cb142f140fa019a5bf66f0df629e77` has the same resonator core; the later variant changes mute/polyphony routing. The distance helper changes two connections (`fc3b05d3a85205d04a85e0c0fc57a11f644fbac2` to `aa475c59ffca67982911931b16579b99e565af14`). Polyphony changes trigger/routing handling (`20fde414b2cf16a4a54ba6563eda607cc81fdbef` to `fe6d9c4f136f1f344059e818cc0a4a0314016c1d`).

These later variants occur in the official [CHAIR-Pd-library at adc0b65c](https://github.com/chairaudio/CHAIR-Pd-library/tree/adc0b65c58bc2fb7b6cff5b23b95bf27f3e0360c). The retained records do not identify the author of every later edit; that repository has no separate project licence file. The MIT grant for inherited material is established. This record distinguishes exact correspondence from derivative provenance and does not assign a fresh blanket grant to unknown additions. The audit did not conclusively identify a genuinely unlicensed addition.

Keep CHAIR’s MIT notice, Philipp Schmalfuß’s model credit, Tom Erbe’s reverb credit and other existing notices. The CHAIR name/logo trademark statement is separate from code reuse. The paper’s CC-BY licence concerns the article. Portfolio research images remain outside this instrument source package.

[made by atelier neyra](https://atelierneyra.com)
