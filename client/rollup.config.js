import { nodeResolve } from '@rollup/plugin-node-resolve';
import multi from '@rollup/plugin-multi-entry';
import glob from 'globby';
import typescript from '@rollup/plugin-typescript';

let config = {
  plugins: [nodeResolve(), typescript()],
};

export default {
  input: 'src/pages/home.ts',
  output: {
    dir: 'build',
    format: 'es',
    sourcemap: true,
  },
  ...config,
};
