#!/usr/bin/env bun

import { join } from 'node:path';

const path = process.cwd();

await Bun.build({
	entrypoints: [join(path, 'src/app/~workers/db.worker.ts')],
	outdir: 'public/workers',
	target: 'browser',
});

await Bun.write(
	Bun.file(join(path, 'public/workers/pglite.wasm')),
	Bun.file(join(path, '/node_modules/@electric-sql/pglite/dist/pglite.wasm')),
);

await Bun.write(
	Bun.file(join(path, 'public/workers/pglite.data')),
	Bun.file(join(path, '/node_modules/@electric-sql/pglite/dist/pglite.data')),
);

console.log('Worker compiled');
