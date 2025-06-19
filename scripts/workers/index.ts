#!/usr/bin/env bun

import { join } from 'node:path';
import process from 'node:process';
import { build, file, write } from 'bun';

const path = process.cwd();

await build({
	entrypoints: [join(path, 'src/app/~workers/db.worker.ts')],
	outdir: 'public/workers',
	target: 'browser',
});

await write(
	file(join(path, 'public/workers/pglite.wasm')),
	file(join(path, '/node_modules/@electric-sql/pglite/dist/pglite.wasm')),
);

await write(
	file(join(path, 'public/workers/pglite.data')),
	file(join(path, '/node_modules/@electric-sql/pglite/dist/pglite.data')),
);
