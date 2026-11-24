import type { SourceConfig, LiveSourceConfig } from './types';
import { parseSourceListPayload } from './source-list';
// 仓库根目录的订阅源文件：直接内置挂载为默认源，便于本地编辑与版本管理。
// 部署者未通过 DEFAULT_SOURCES / DEFAULT_LIVE_SOURCES 显式配置时，作为开箱默认源生效。
import builtinRaw from '../../LibreTV-SourceList.json';

/**
 * 内置默认源：读取仓库根目录的 LibreTV-SourceList.json（LibreTV-SourceList 订阅格式），
 * 复用 parseSourceListPayload 完成字段校验 / 归一化 / 去重，再补上稳定的 key。
 * 解析失败时告警并整体忽略，退回空数组，不影响站点运行。
 */
function loadBuiltinSources(): { sources: SourceConfig[]; liveSources: LiveSourceConfig[] } {
  try {
    const payload = parseSourceListPayload(builtinRaw);
    return {
      sources: payload.sources.map((s, i) => ({ ...s, key: `builtin_${i}` })),
      liveSources: payload.liveSources.map((s, i) => ({ ...s, key: `builtinlive_${i}` })),
    };
  } catch (err) {
    console.warn(
      '[LibreTV] 内置订阅源 LibreTV-SourceList.json 解析失败，已忽略：',
      err instanceof Error ? err.message : err
    );
    return { sources: [], liveSources: [] };
  }
}

const builtin = loadBuiltinSources();

/** 内置点播源（无 DEFAULT_SOURCES 时的默认值） */
export const BUILTIN_SOURCES: SourceConfig[] = builtin.sources;

/** 内置直播源（无 DEFAULT_LIVE_SOURCES 时的默认值） */
export const BUILTIN_LIVE_SOURCES: LiveSourceConfig[] = builtin.liveSources;