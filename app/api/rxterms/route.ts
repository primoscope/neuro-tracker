import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(
        query
      )}&ef=DISPLAY_NAME`,
      {
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from RxTerms API');
    }

    const data = await response.json();
    
    // RxTerms returns [totalCount, displayNames, extraFields, rawData]
    // We'll format it to be more convenient for the client
    const [totalCount, , extraFields] = data;
    
    const suggestions = extraFields?.[0] || [];
    
    return NextResponse.json(
      { 
        suggestions: suggestions.slice(0, 10), // Limit to 10 results
        totalCount 
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('RxTerms API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drug suggestions' },
      { status: 500 }
    );
  }
}
