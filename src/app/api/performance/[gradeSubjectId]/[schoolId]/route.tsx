// app/api/performance/[gradeSubjectId]/[schoolId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPerformanceDashboardData } from '@/app/actions/performance-data'; // Import your server action

export const dynamic = 'force-dynamic'; // Ensures this API route is dynamic

interface Params {
  gradeSubjectId: string;
  schoolId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params } // Access URL parameters
) {
  const { gradeSubjectId, schoolId } = params;

  if (!gradeSubjectId || !schoolId) {
    return NextResponse.json(
      { success: false, error: 'Missing gradeSubjectId or schoolId in path parameters.' },
      { status: 400 }
    );
  }

  try {
    // Call your existing server action logic here
    const result = await getPerformanceDashboardData(gradeSubjectId, schoolId);

    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch performance data.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error fetching performance data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}