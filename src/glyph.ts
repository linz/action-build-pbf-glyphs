import * as core from '@actions/core';
import cp from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export async function fileExists(fileName: string): Promise<boolean> {
  try {
    await fs.stat(fileName);
    return true;
  } catch (e) {
    return false;
  }
}

export async function findGlyphCommand(): Promise<string> {
  const glyphCommand = './static/build_pbf_glyphs'; // tmp.tmpNameSync();

  const isInstalled = await fileExists(glyphCommand);
  if (isInstalled) return glyphCommand;

  const upCommand = path.join(__dirname, '..', glyphCommand);
  const isInstalledUp = await fileExists(upCommand);
  if (isInstalledUp) return upCommand;
  throw new Error('Failed to open command @ ' + glyphCommand);
}

export async function waitForChildProcess(cmd: string, args: string[]): Promise<string> {
  core.info(`\t ${cmd} ${args}`);
  const child = cp.spawn(cmd, args);

  const stdout: string[] = [];
  const stderr: string[] = [];
  if (child.stdout == null) throw new Error('Child missing stdout');
  if (child.stderr == null) throw new Error('Child missing stderr');

  child.stdout.on('data', (data) => stdout.push(data));
  child.stderr.on('data', (data) => stderr.push(data));

  return new Promise((resolve, reject) => {
    child.addListener('error', reject);
    child.addListener('exit', (code: number) => {
      if (code === 0) return resolve(stdout.join(''));
      core.error(`Failed to run Command \nstdout: ${stdout.join('')}\nstderr: ${stderr.join('')}`);
      return reject(new Error('Exited with code: ' + code));
    });
  });
}
