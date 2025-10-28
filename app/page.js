'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { GraduationCap, Users, Award, TrendingUp, BookOpen, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { courses } from '@/data/courses'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7f56d9] via-[#7f56d9] to-[#7f56d9] h-[600px] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1541178735493-479c1a27ed24?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920"
            alt="Professional Learning"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-semibold">Industry-Leading Certifications</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master Revenue Operations & 
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Accelerate Your Career
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Professional certification programs designed by industry experts.
              Learn RevOps, Sales Leadership, and more to transform your career.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link href="/dashboard">
                  <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white/10 px-8 py-6 text-lg font-semibold">
                      Explore Courses
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { icon: Users, label: 'Active Learners', value: '10,000+' },
                { icon: BookOpen, label: 'Courses', value: '50+' },
                { icon: Award, label: 'Certifications', value: '25+' },
                { icon: TrendingUp, label: 'Success Rate', value: '95%' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Professional Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master in-demand skills with our comprehensive certification programs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                  <img 
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-full px-4 py-1 text-sm font-semibold text-[#7f56d9] shadow-md">
                      {course.level}
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-[#7f56d9] font-semibold mb-3">
                    <GraduationCap className="w-4 h-4" />
                    {course.category}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#7f56d9] transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.subtitle}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      4.9 (2,500+ reviews)
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">{course.price}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {course.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button className="bg-[#7f56d9] hover:bg-[#6b4fbb] text-white">
                      View Course
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/courses">
            <Button variant="outline" className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg">
              View All Courses
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PrimeRole Institute?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to your professional growth and success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🎯',
                title: 'Industry-Relevant Curriculum',
                description: 'Learn skills that are in high demand with curriculum designed by industry experts and updated regularly.'
              },
              {
                icon: '🏆',
                title: 'Recognized Certifications',
                description: 'Earn professional certificates that are valued by employers and can be shared on LinkedIn.'
              },
              {
                icon: '⚡',
                title: 'Flexible Learning',
                description: 'Learn at your own pace with lifetime access to course materials and resources.'
              },
              {
                icon: '👥',
                title: 'Expert Instructors',
                description: 'Learn from seasoned professionals with real-world experience in their fields.'
              },
              {
                icon: '📊',
                title: 'Practical Projects',
                description: 'Apply your learning with hands-on projects and real-world case studies.'
              },
              {
                icon: '🌐',
                title: 'Community Support',
                description: 'Join a community of learners and get support when you need it.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-[#7f56d9] rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of professionals who have advanced their careers with PrimeRole
          </p>
          {!session && (
            <Link href="/signup">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                Start Learning Today - It's FREE
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}