#!/usr/bin/env python3
"""Check the standalone Pd download against its source files and notices."""
from pathlib import Path
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "software/browser/downloads/messier57-pd-instrument.zip"
NOTICES = {
    "LICENSE": "LICENSE",
    "pd/LICENSE-CHAIR.txt": "software/pure-data/LICENSE-CHAIR.txt",
    "notices/LICENSE-PureData-libpd.txt": "software/browser/libpd-engine/LICENSE-libpd.txt",
    "third_party/CHAIR/LICENSE": "third_party/CHAIR/LICENSE",
    "third_party/CHAIR/PROVENANCE.md": "third_party/CHAIR/PROVENANCE.md",
    "third_party/CHAIR/file-correspondence.json": "third_party/CHAIR/file-correspondence.json",
}
REQUIRED = {"README.md", "THIRD-PARTY.md", "pd/desktop.pd", "pd/instrument.pd", "pd/grooves.pd", *NOTICES}

def check():
    checked = 0
    with zipfile.ZipFile(ARCHIVE) as archive:
        names = archive.namelist()
        assert len(names) == len(set(names)), "Duplicate archive members"
        assert archive.testzip() is None, "Archive CRC failure"
        assert REQUIRED.issubset(names), "Missing source, setup or licence material"
        for name in names:
            path = Path(name)
            assert not path.is_absolute() and ".." not in path.parts, "Unsafe archive member"
            # Preserve the original download notes; the root guide explains their repository-relative paths.
            if name in {"pd/README.txt", "hardware/SPECIFICATIONS.md", "hardware/BUILD-NOTES.md"}:
                continue
            if name.startswith("pd/"):
                source = ROOT / "software/pure-data" / name.removeprefix("pd/")
            elif name.startswith("hardware/"):
                source = ROOT / name
            elif name in NOTICES:
                source = ROOT / NOTICES[name]
            else:
                continue
            assert source.is_file(), "Missing source counterpart: " + name
            assert archive.read(name) == source.read_bytes(), "Source or notice differs: " + name
            checked += 1
        for name, relative in NOTICES.items():
            assert archive.read(name) == (ROOT / relative).read_bytes(), "Notice differs: " + name
        assert b"CHAIR" in archive.read("THIRD-PARTY.md"), "Missing CHAIR attribution"
        assert b"Tom Erbe" in archive.read("THIRD-PARTY.md"), "Missing reverb attribution"
        assert b"Pure Data" in archive.read("THIRD-PARTY.md"), "Missing Pure Data attribution"
    print(json.dumps({"archive": ARCHIVE.name, "members": len(names), "verified_source_and_notice_members": checked, "licence_notices": len(NOTICES), "status": "passed"}))

if __name__ == "__main__":
    check()
