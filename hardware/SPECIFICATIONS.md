# Messier ’57 — source and specifications

Final prototype: sapele drum, centrally mounted lavalier and edge contact microphone, Bela Mini / Pure Data, one physically modelled snare, three-position sensing selector, spring-return brass latch. Battery power is for Bela. The optional browser kick is a new demonstration voice, not a component of the original prototype.

## Established values

- Recovered shell render-mesh envelope: approximately 251.993 mm outside diameter and 83 mm depth. This is the source CAD envelope, not a measured finished-drum specification.
- Six tension positions, equally spaced by 60 degrees.
- Saved snare baseline: tuning 0.6, rattle 0.8, damping 0.6.
- Selector: small dot = head; ring = rim; large dot = both excite the same snare model.
- Latch: hold/pull loosens synthesized snares; release returns to the baseline. The short internal spring returns the shaft/fork. Original travel and pulled-end coefficients are not verified. The demo mapping is rattle = .8 × (1 − pull).
- Browser DSP: actual libpd C/WASM, 44.1 kHz requested, 64-sample Pd blocks; head/rim recorded excitation and a separate low-tuned CHAIR bongo~ kick resonator.

## Files and their status

The original Rhino .3dm assembly is preserved in `cad/Electric Drum.3dm`. The new Blender scene and GLB are a presentation reconstruction and proposed tidy finish. They add a connected latch rod, fixed shell bearing, clear board covers, a closed base and a generic stand. They do not certify those additions for manufacturing. The 93 mm display shaft and stand dimensions belong to that reconstruction; measure the actual mechanism before machining.

BOM.csv separates photographed/CAD evidence from proposed additions. Unknown part numbers, fastener threads, bearing fits, spring rate/travel, microphone bias, audio conditioning and power-system details remain marked unknown. No fabricated supplier links or costs are supplied.

## Performance and continuation

The original notes record Bela CPU limits with the complete model and a planned Intel mini-PC / Max continuation. The modern browser audition demonstrates the recovered snare stage and added kick, rather than proving the complete historical Bela build meets latency/CPU requirements.

## Licensing and credit

Peter Neyra: instrument design, build, experiments, source CAD and project photographs. CHAIR: snare and bongo resonator models and Pd helpers. libpd/Pure Data and browser dependencies retain their included licences. The upstream CHAIR files retain author notices. CHAIR’s verified MIT source notice and derivative correspondence are included in `../third_party/CHAIR/`. Peter explicitly authorizes reuse of his original CAD, BOM, specifications and visualisation with their authorship metadata. Historical research images remain outside this source package.
