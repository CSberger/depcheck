import path from 'path';
import lodash from 'lodash';
import requirePackageName from 'require-package-name';
import tryRequire from '../utils/try-require';

const sass = tryRequire('node-sass');

export default function parseSASS(content, filePath, deps, rootDir) {
  const { stats } = sass.renderSync({
    data: content,
    includePaths: [path.dirname(filePath)],
  });

  const result = lodash(stats.includedFiles)
    .map(file => path.relative(rootDir, file))
    .filter(file => file.indexOf('node_modules') === 0) // refer to node_modules
    .map(file => file.replace(/\\/g, '/')) // normalize paths in Windows
    .map(file => file.substring('node_modules/'.length)) // avoid heading slash
    .map(requirePackageName)
    .uniq()
    .value();

  return result;
}
