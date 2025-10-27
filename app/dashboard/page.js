'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { courses } from '@/data/courses'
import { BookOpen, Award, TrendingUp, Clock, PlayCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      loadEnrollments()
    }
  }, [status, router])

  const loadEnrollments = async () => {
    try {
      const response = await fetch('/api/enroll')
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data.enrollments)
      }
    } catch (error) {
      console.error('Failed to load enrollments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const enrolledCourses = enrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId)
    return { ...enrollment, courseDetails: course }
  }).filter(e => e.courseDetails)

  const totalProgress = enrolledCourses.length > 0
    ? enrolledCourses.reduce((sum, e) => sum + (e.progress.completedModules / (e.courseDetails.modules?.length || 1)) * 100, 0) / enrolledCourses.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {session?.user?.name}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">Continue your learning journey</p>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/8532850/pexels-photo-8532850.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Learning"
                className="w-32 h-32 rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</div>
                <div className="text-gray-600">Enrolled Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{Math.round(totalProgress)}%</div>
                <div className="text-gray-600">Average Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {enrolledCourses.filter(e => 
                    e.progress.completedModules === e.courseDetails.modules?.length
                  ).length}
                </div>
                <div className="text-gray-600">Certificates Earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Courses</h2>
            <Link href="/courses">
              <Button variant="outline">Browse More Courses</Button>
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses enrolled yet</h3>
              <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
              <Link href="/courses">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Explore Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {enrolledCourses.map((enrollment) => {
                const course = enrollment.courseDetails
                const progress = enrollment.progress
                const progressPercent = (progress.completedModules / (course.modules?.length || 1)) * 100
                const isCompleted = progress.completedModules === course.modules?.length

                return (
                  <div key={enrollment.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-purple-600">
                      <img 
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      {isCompleted && (
                        <div className="absolute top-4 right-4 bg-green-600 text-white rounded-full px-4 py-1 text-sm font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-indigo-600">
                            {Math.round(progressPercent)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        {progress.completedModules} of {course.modules?.length || 0} modules completed
                      </div>

                      <Link href={`/courses/${course.slug}/learn`}>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {isCompleted ? 'Review Course' : 'Continue Learning'}
                        </Button>
                      </Link>

                      {isCompleted && (
                        <Link href={`/courses/${course.slug}/certificate`}>
                          <Button variant="outline" className="w-full mt-2">
                            <Award className="w-4 h-4 mr-2" />
                            View Certificate
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}