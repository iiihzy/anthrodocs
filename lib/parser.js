import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parseSpecFromString } from './parser-string.js';

/**
 * Parse an OpenAPI / Swagger specification file into the IR.
 * Supports Swagger 2.0 and OpenAPI 3.x.
 *
 * @param {string} filePath - path to YAML or JSON file
 * @returns {import('./ir.js').ApiDoc}
 */
export function parseSpec(filePath) {
  const absPath = resolve(filePath);
  if (!existsSync(absPath)) {
    throw new Error(`文件不存在: ${absPath}`);
  }

  const raw = readFileSync(absPath, 'utf-8');
  try {
    return parseSpecFromString(raw);
  } catch (e) {
    if (e.yamlError) {
      throw new Error(`无法解析输入文件: ${e.message}`);
    }
    throw e;
  }
}

export { parseSpecFromString } from './parser-string.js';