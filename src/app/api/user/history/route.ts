import { NextRequest, NextResponse } from 'next/server'
import { getUser, isDevelopmentMode, DEV_USER_ID } from '@/lib/db'
import { getAnalysisHistory } from '@/lib/analysis-session'

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await getUser()

    if (!user) {
      // In development mode, use dev user
      if (isDevelopmentMode()) {
        const history = await getAnalysisHistory(DEV_USER_ID)
        return NextResponse.json(history || [])
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const history = await getAnalysisHistory(user.id)

    return NextResponse.json(history || [])
  } catch (error) {
    console.error('Failed to fetch history:', error)

    // In development mode, return empty array instead of error
    if (isDevelopmentMode()) {
      console.log('[History API] Error in dev mode, returning empty history')
      return NextResponse.json([])
    }

    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    )
  }
}
