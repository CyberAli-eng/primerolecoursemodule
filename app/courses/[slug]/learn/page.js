'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { courses } from '@/data/courses'
import ProgressBar from '@/components/course/ProgressBar'
import VideoPlayer from '@/components/course/VideoPlayer'
import QuizComponent from '@/components/course/QuizComponent'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, BookOpen, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [progress, setProgress] = useState({
    completedModules: 0,
    currentModule: 'module-1',
    completedLessons: [],
    score: 0,
    lastActivity: new Date().toISOString()
  })
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  const course = courses.find(c => c.slug === params.slug)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Load progress from API
  useEffect(() => {
    if (course && session) {
      loadProgress()
    }
  }, [course, session])

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/progress?courseId=${course.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.progress) {
          setProgress(data.progress)
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  const updateProgress = async (newProgress) => {
    const updatedProgress = {
      ...newProgress,
      lastActivity: new Date().toISOString()
    }
    setProgress(updatedProgress)

    // Save to API
    try {
      await fetch('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          progress: updatedProgress
        })
      })
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  const completeLesson = (lessonId) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const updatedProgress = {
        ...progress,
        completedLessons: [...progress.completedLessons, lessonId]
      }
      updateProgress(updatedProgress)
      toast.success('Lesson completed!')
    }
  }

  const completeModule = (moduleId) => {
    const moduleIndex = course.modules.findIndex(m => m.id === moduleId)
    const nextModule = course.modules[moduleIndex + 1]
    
    const updatedProgress = {
      ...progress,
      completedModules: Math.max(progress.completedModules, moduleIndex + 1),
      currentModule: nextModule ? nextModule.id : moduleId
    }
    updateProgress(updatedProgress)
    toast.success('Module completed! 🎉')
  }

  const navigateToModule = (moduleId) => {
    const updatedProgress = {
      ...progress,
      currentModule: moduleId
    }
    updateProgress(updatedProgress)
    setCurrentLessonIndex(0)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return notFound()
  }

  const currentModule = course.modules.find(m => m.id === progress.currentModule)
  if (!currentModule) {
    return notFound()
  }

  const currentLesson = currentModule.content[currentLessonIndex]
  const isLastLesson = currentLessonIndex === currentModule.content.length - 1
  const isLessonCompleted = progress.completedLessons.includes(currentLesson.id)

  const handleNext = () => {
    if (!isLessonCompleted) {
      completeLesson(currentLesson.id)
    }

    if (isLastLesson) {
      // Check if all lessons in module are completed
      const allLessonsCompleted = currentModule.content.every(
        lesson => progress.completedLessons.includes(lesson.id) || lesson.id === currentLesson.id
      )
      
      if (allLessonsCompleted) {
        completeModule(currentModule.id)
        const currentModuleIndex = course.modules.findIndex(m => m.id === currentModule.id)
        const nextModule = course.modules[currentModuleIndex + 1]
        if (nextModule) {
          navigateToModule(nextModule.id)
        } else {
          toast.success('Congratulations! Course completed! 🎓')
          router.push(`/courses/${course.slug}/certificate`)
        }
      }
    } else {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const renderLessonContent = () => {
    switch (currentLesson.type) {
      case 'video':
        return (
          <div>
            <VideoPlayer 
              videoUrl={currentLesson.videoUrl} 
              onComplete={() => !isLessonCompleted && completeLesson(currentLesson.id)}
            />
            {currentLesson.description && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">About this lesson</h3>
                <p className="text-gray-700">{currentLesson.description}</p>
              </div>
            )}
          </div>
        )

      case 'reading':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {currentLesson.content}
              </div>
            </div>
          </div>
        )

      case 'quiz':
        const assessment = course.assessments.find(a => a.module === currentModule.id)
        if (!assessment) {
          return <div className="text-center py-12 text-gray-600">Quiz not available</div>
        }
        return (
          <QuizComponent
            questions={assessment.questions}
            passingScore={assessment.passingScore}
            onComplete={(passed, score) => {
              if (passed) {
                completeLesson(currentLesson.id)
                updateProgress({ ...progress, score })
              }
            }}
          />
        )

      case 'project':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-indigo-200">
            <FileText className="w-16 h-16 text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Assignment</h3>
            <p className="text-gray-700 text-lg mb-6">{currentLesson.description}</p>
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Project Guidelines:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Complete the assigned project using the concepts learned</li>
                <li>Document your approach and findings</li>
                <li>Submit your completed work for review</li>
              </ul>
            </div>
          </div>
        )

      default:
        return <div>Unknown lesson type</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Progress */}
          <div className="lg:col-span-1">
            <ProgressBar 
              course={course} 
              progress={progress} 
              modules={course.modules}
              onModuleClick={navigateToModule}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              {/* Lesson Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-2">
                  {currentLesson.type === 'video' && <BookOpen className="w-4 h-4" />}
                  {currentLesson.type === 'reading' && <FileText className="w-4 h-4" />}
                  Lesson {currentLessonIndex + 1} of {currentModule.content.length}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ {currentLesson.duration}</span>
                  {isLessonCompleted && (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson Content */}
              <div className="mb-8">
                {renderLessonContent()}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                  disabled={currentLessonIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>

                <div className="text-sm text-gray-600">
                  {currentLessonIndex + 1} / {currentModule.content.length}
                </div>

                {currentLesson.type !== 'quiz' && (
                  <Button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isLastLesson ? 'Complete Module' : 'Next Lesson'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}