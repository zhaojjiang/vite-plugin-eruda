# vite-plugin-eruda

A Vite plugin to inject eruda into your project during build.

## Usage

```shell
npm install --save-dev @zhaojjiang/vite-plugin-eruda
npm install eruda
```

**vite.config**

```ts
plugins: [
  condition && pluginEruda(options)
],
```

## Options

- enable: boolean - default `true`. You should control it outside plugin
- options: erudaOptions
- entry: string | string[] - default `['src/main.ts', 'src/main.js']`. Absolute path or relative to vite config root
