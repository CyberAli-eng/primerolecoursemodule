'use client'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { courses } from '@/data/courses'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, Users, Award, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [isEnrolling, setIsEnrolling] = useState(false)
  
  const course = courses.find(c => c.slug === params.slug)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleEnroll = async () => {
    if (!session) {
      toast.error('Please sign in to enroll')
      router.push('/login')
      return
    }

    setIsEnrolling(true)
    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseName: course.title
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Enrollment failed')
      }

      toast.success('Successfully enrolled!')
      router.push(`/courses/${course.slug}/learn`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 py-20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-white text-sm font-semibold mb-4">
              {course.category}
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              {course.title}
            </h1>
            
            <p className="text-2xl text-indigo-100 mb-8">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap gap-6 text-white mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{course.modules.length} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Certificate Included</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now - FREE'}
              </Button>
              {session && (
                <Link href={`/courses/${course.slug}/learn`}>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start Learning
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Course */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Course</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.certification.skills.map((skill, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                        <p className="text-gray-600 mb-3">{module.objective}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>{module.content.length} Lessons</span>
                          <span>•</span>
                          <span>{module.duration}</span>
                          {module.hasAssessment && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-semibold">Assessment Included</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-6">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">{course.price}</div>
                {course.originalPrice && (
                  <div className="text-lg text-gray-400 line-through">{course.originalPrice}</div>
                )}
              </div>

              <Button 
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold mb-4"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>

              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-gray-900">This course includes:</h3>
                {course.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Instructor</h3>
                <p className="text-gray-700">{course.instructor}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}