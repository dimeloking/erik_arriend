import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: [
    'checkly.config.ts',
    'src/libs/I18n.ts',
    'src/types/I18n.ts',
    'tests/**/*.ts',
    // Skills are read by AI agents at runtime, not imported in code
    '.agents/**',
    // Reference prototype kept for client onboarding (not part of build)
    'doc/**',
    // Boilerplate showcase components no longer wired up
    'src/components/Hello.tsx',
    'src/components/Sponsors.tsx',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    '@commitlint/types',
    '@clerk/shared',
    '@swc/helpers', // Avoid error in CI: "`npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync."
    'vite',
    'server-only', // Bundled with Next.js
  ],
  // Binaries to ignore during analysis
  ignoreBinaries: [
    'production', // False positive raised with dotenv-cli
  ],
  // server-only is bundled with Next.js, not a direct dependency
  ignoreExportsUsedInFile: true,
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/gu)].join('\n'),
  },
};

export default config;
