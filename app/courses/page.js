'use client'
import Link from 'next/link'
import { courses } from '@/data/courses'
import { Clock, Star, GraduationCap, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Explore Our Courses</h1>
            <p className="text-xl text-indigo-100">
              Professional certification programs to accelerate your career
            </p>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Course Image */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                <img 
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white rounded-full px-4 py-1 text-sm font-semibold text-indigo-600">
                    {course.level}
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-3">
                  <GraduationCap className="w-4 h-4" />
                  {course.category}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                  {course.subtitle}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.modules?.length || 0} Modules
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(2,500+)</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {course.originalPrice}
                      </span>
                    )}
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}