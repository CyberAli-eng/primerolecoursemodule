import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId, courseName } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    // Check if already enrolled
    const existingEnrollment = await db.collection('enrollments').findOne({
      userId: session.user.id,
      courseId
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Create enrollment
    const enrollment = {
      id: uuidv4(),
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      courseId,
      courseName,
      enrolledAt: new Date().toISOString(),
      status: 'active',
      progress: {
        completedModules: 0,
        currentModule: 'module-1',
        completedLessons: [],
        score: 0,
        lastActivity: new Date().toISOString()
      }
    }

    await db.collection('enrollments').insertOne(enrollment)

    return NextResponse.json(
      { message: 'Enrolled successfully', enrollmentId: enrollment.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const enrollments = await db.collection('enrollments')
      .find({ userId: session.user.id })
      .toArray()

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error('Fetch enrollments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}