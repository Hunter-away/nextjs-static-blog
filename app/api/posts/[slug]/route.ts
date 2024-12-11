import { getPostBySlug } from '@/lib/utils/content';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const decodedSlug = decodeURIComponent(params.slug);
    const post = await getPostBySlug(decodedSlug);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch post' },
      { status: 500 }
    );
  }
}