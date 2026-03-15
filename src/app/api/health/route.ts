import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json(
      { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0'
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { status: 'error' },
      { status: 500 }
    )
  }
}
