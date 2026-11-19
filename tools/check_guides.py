#!/usr/bin/env python3
"""Check every guide before publishing. Run from the repo root:  python3 tools/check_guides.py

Fails (exit 1) on anything that would hurt SEO or tracking: leftover {{PLACEHOLDERS}},
a forgotten noindex, a wrong canonical, missing sitemap/hub entries, too few internal
links, untagged App Store links, or broken structured data.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://stepguard.live"
errors, warnings = [], []

pages = [p for p in ROOT.rglob("*.html") if ".git" not in p.parts]
texts = {p: p.read_text(encoding="utf-8") for p in pages}
sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
hub = (ROOT / "guides" / "index.html").read_text(encoding="utf-8")

# Structured data must parse on every page.
for p, s in texts.items():
    if p.name == "_template.html":
        continue
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            json.loads(block)
        except json.JSONDecodeError as e:
            errors.append(f"{p.relative_to(ROOT)}: structured data is not valid JSON ({e})")

guides = sorted(p for p in (ROOT / "guides").glob("*.html") if p.name not in ("_template.html", "index.html"))
for p in guides:
    slug, s, name = p.stem, texts[p], f"guides/{p.name}"
    url = f"{SITE}/guides/{slug}"

    if "{{" in s:
        errors.append(f"{name}: unfilled placeholders: {sorted(set(re.findall(r'{{[A-Z0-9_]+}}', s)))}")
    if 'name="robots" content="noindex"' in s:
        errors.append(f"{name}: still has the template's noindex tag")
    if f'<link rel="canonical" href="{url}">' not in s:
        errors.append(f"{name}: canonical must be {url}")
    if len(re.findall(r"<h1[ >]", s)) != 1:
        errors.append(f"{name}: needs exactly one <h1>")

    title = re.search(r"<title>(.*?)</title>", s, re.S)
    if title and len(title.group(1)) > 65:
        warnings.append(f"{name}: title is {len(title.group(1))} chars (Google cuts off around 60)")
    desc = re.search(r'<meta name="description" content="(.*?)">', s)
    if not desc:
        errors.append(f"{name}: missing meta description")
    elif not 110 <= len(desc.group(1)) <= 165:
        warnings.append(f"{name}: description is {len(desc.group(1))} chars (aim for 140–160)")

    if f"<loc>{url}</loc>" not in sitemap:
        errors.append(f"{name}: not in sitemap.xml")
    if f'href="/guides/{slug}"' not in hub:
        errors.append(f"{name}: not listed on guides/index.html")

    linked_from = [q for q, t in texts.items()
                   if q not in (p, ROOT / "guides" / "index.html", ROOT / "guides" / "_template.html")
                   and f'href="/guides/{slug}"' in t]
    if len(linked_from) < 2:
        errors.append(f"{name}: linked from {len(linked_from)} other page(s); link it from at least 2 "
                      f"(homepage, FAQ or other guides) so Google finds and trusts it")

    for link in re.findall(r'href="(https://apps\.apple\.com[^"]*)"', s):
        if "pt=127825166" not in link or f"ct=guide_{slug}" not in link:
            errors.append(f"{name}: App Store link not tagged with pt=127825166&ct=guide_{slug}: {link}")

for w in warnings:
    print("warning:", w)
for e in errors:
    print("ERROR:", e)
print(f"\n{len(guides)} guide(s) checked: {len(errors)} error(s), {len(warnings)} warning(s)")
sys.exit(1 if errors else 0)
