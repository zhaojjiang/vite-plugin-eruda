import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import type { InitOptions } from "eruda";

type PluginOptions = {
  enabled?: boolean;
  options?: InitOptions;
  /** absolute path, or relative to root */
  entry?: string | string[];
};

/**
 * @description 通过 vite 自定义条件动态导入 eruda
 * @description Eruda 配置参考 {@link https://github.com/liriliri/eruda/blob/HEAD/README_CN.md}
 */
export default function vitePluginEruda(options?: PluginOptions): Plugin {
  let config: ResolvedConfig;
  let resolvedEntry: string[] = [];

  const {
    enabled = true,
    options: _options = {},
    entry = ["src/main.ts", "src/main.js"],
  } = options || {};

  return {
    name: "vite:eruda",
    async configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;

      if (
        !(await import(path.resolve(config.root, "package.json")))?.dependencies
          ?.eruda
      ) {
        throw new Error("[vite-plugin-eruda] need eruda to be installed.");
      }

      resolvedEntry = (Array.isArray(entry) ? entry : [entry])
        .map((_) => path.resolve(config.root, _))
        .map((_) => _.replace(/\\/g, "/"));
    },
    enforce: "pre",
    transform(code: string, id: string) {
      if (enabled && resolvedEntry.includes(id)) {
        code += `
        // eslint-disable-next-line
        import eruda from 'eruda'
        eruda.init(${JSON.stringify(_options)})
        `;
      }
      return { code, map: null };
    },
  };
}
