import { tap } from "ramda";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));


export function get_arg(key: string, def = ""): string {
  for (let arg of process.argv) {
    let [_key, value] = arg.split("=");
    if (_key === key) return value;
  }
  return def;
}

export const log = (...args) => {
  console.log(...args);
  return args[0];
};

export async function get_files(dir: string): Promise<string[]> {
  console.log(dir)
  console.log(__dirname)
  try {
    let directory = (await promisify(fs.lstat)(dir)).isDirectory();
    if (directory) {
      let paths = [];

      try {
        let entries = await promisify(fs.readdir)(dir);

        for (let entry of entries) {
          let entryPath = path.join(dir, entry);
          let is_directory = (
            await promisify(fs.lstat)(entryPath)
          ).isDirectory();

          if (is_directory) {
            let children = await get_files(entryPath);
            paths = paths.concat(children);
          } else {
            paths.push(entryPath);
          }
        }
        return paths;
      } catch (e) {
        console.log(e);
      } finally {
        return paths;
      }
    }
  } catch (e) {
    console.log(e);
    return [];
  }
}
