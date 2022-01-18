import io
import json
import subprocess
import sys

import bs4


def parse_mappings():
    with open("./data/a.html") as f:
        soup = bs4.BeautifulSoup(f, features="html.parser")
    parsed_mappings = {}
    for aname in soup.find_all("span", attrs={"class": "aname"}):
        tr = aname.find_parent("tr")
        name_cell, data_cell = tr.find_all("td")
        name = name_cell.get_text().strip()
        if "backwards" in name:
            continue
        if name == "Regional Indicator":
            continue
        parsed_mappings[name] = data_cell.text.strip().split(" ")
    src_string = soup.find("input", attrs={"name": "text"}).get("value").split(" ")
    mappings = {}
    for name, mapping in parsed_mappings.items():
        if len(mapping) != len(src_string):
            print("Ignoring:", name, len(mapping), len(src_string), file=sys.stderr)
            continue
        mappings[name.replace(" pseudoalphabet", "")] = {
            ord(f): ord(t) for (f, t) in zip(src_string, mapping) if f != t
        }
    return mappings


def write_mappings(dest_file: str, mappings):
    pipe = subprocess.Popen(
        ["./node_modules/.bin/prettier", "--parser", "typescript"],
        stdin=subprocess.PIPE,
        stdout=open(dest_file, "wb"),
    )
    with io.TextIOWrapper(pipe.stdin, encoding="utf-8") as outf:
        print(
            "// Via https://qaz.wtf/u/convert.cgi; A Unicode Toy © 2009-2021 Eli the Bearded",
            file=outf,
        )
        print("const mappings: Record<string, Map<number, number>> = {", file=outf)
        for name, mapping in sorted(mappings.items()):
            if not mapping:
                continue
            name_js = json.dumps(name)
            items_js = json.dumps(sorted(mapping.items()))
            print("  %s: new Map(%s)," % (name_js, items_js), file=outf)
        print("};", file=outf)
        print("export default mappings;", file=outf)
    pipe.wait()
    assert pipe.returncode == 0


def main():
    mappings = parse_mappings()
    write_mappings("./src/gen/qazwtf.ts", mappings)


if __name__ == "__main__":
    main()
