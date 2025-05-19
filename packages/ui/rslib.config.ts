import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: ['./src/index.tsx'],
    },
  },
  mode: 'production',
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm',
      output: {
        distPath: {
          root: './dist/esm', // Output directory
        },
      },
    },
    {
      bundle: true,
      dts: true,
      format: 'cjs',
      output: {
        distPath: {
          root: './dist/cjs', // Output directory
        },
      },
    },
    {
      format: 'umd',
      dts: true,
      output: {
        distPath: {
          root: './dist/umd', // Output directory
        },
      },
    },
  ],
  output: {
    target: 'web',
    cleanDistPath: true,
  },
  plugins: [pluginReact(), pluginSass()],
});
