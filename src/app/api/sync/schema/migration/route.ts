import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const version = searchParams.get('version');

	return NextResponse.json({ version });
}
