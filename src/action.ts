import * as core from '@actions/core';
import { fsa } from '@chunkd/fs';
import path from 'path';
import { findGlyphCommand, waitForChildProcess } from './glyph';

function isFont(f: string): boolean {
  return f.toLowerCase().endsWith('.ttf') || f.toLowerCase().endsWith('.otf');
}

async function main(): Promise<void> {
  const SourceLocation = core.getInput('source');
  const targetLocation = core.getInput('target');

  const files = await fsa.toArray(fsa.list(SourceLocation));
  const fontFolders = new Set<string>();
  const fontNames: string[] = [];
  for (const f of files) {
    // Only TTF and OTF font types are supported
    if (!isFont(f)) continue;
    fontFolders.add(path.dirname(f));
    const extension = path.extname(f);
    fontNames.push(path.basename(f, extension));
  }

  core.info(`Found ${fontFolders.size} font folders from ${SourceLocation}`);

  const cmdPath = await findGlyphCommand();

  for (const folder of fontFolders) {
    core.info(`Creating Glyphs: ${folder}`);

    const startTime = Date.now();

    await waitForChildProcess(cmdPath, [folder, targetLocation]);
    const duration = Date.now() - startTime;
    core.info(`Glyphs created ${folder} duration: ${duration}ms`);
  }

  await fsa.write(fsa.join(targetLocation, 'fonts.json'), JSON.stringify(fontNames.sort()));
}

main().catch((e: Error) => core.setFailed(e.message));
