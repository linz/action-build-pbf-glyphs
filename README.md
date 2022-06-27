# linz/action-build-pbf-glyphs

Github action to convert fonts (TTF/OTF) into Protobuf SDF Glyphs for use in maplibre.


This uses [build_pbf_glyphs](https://github.com/stadiamaps/build_pbf_glyphs) to generate glyphs


# Usage

Add this to your github action to build all fonts inside `fonts/:font-name/*.ttf` into pbf files output into `build/fonts/:font-name/:range.pbf`

```yaml
- uses: linz/action-build-pbf-glyphs@v1
    with:
    source: fonts/
    target: build/fonts/
```
