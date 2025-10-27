'use client'
import { useParams, useRouter, notFound } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import { courses } from '@/data/courses'
import { Button } from '@/components/ui/button'
import { Download, Linkedin, Share2, Award, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function CertificatePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const certificateRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const course = courses.find(c => c.slug === params.slug)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return notFound()
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const element = certificateRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`${course.title.replace(/\s+/g, '-')}-Certificate.pdf`)
      
      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Failed to generate certificate')
    } finally {
      setIsGenerating(false)
    }
  }

  const shareToLinkedIn = () => {
    const certificationName = encodeURIComponent(course.certification.title)
    const certificationURL = encodeURIComponent(window.location.href)
    const organizationName = encodeURIComponent('PrimeRole Institute')
    const issueYear = new Date().getFullYear()
    const issueMonth = new Date().getMonth() + 1
    
    const linkedInURL = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certificationName}&organizationName=${organizationName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certificationURL}`
    
    window.open(linkedInURL, '_blank')
    toast.success('Opening LinkedIn...')
  }

  const certificateId = `PRI-${course.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  const completionDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Congrats Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Congratulations, {session?.user?.name}! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You've successfully completed the {course.title} and earned your professional certificate!
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Download Certificate'}
          </Button>
          
          <Button
            onClick={shareToLinkedIn}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            Add to LinkedIn
          </Button>
          
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success('Certificate link copied!')
            }}
            variant="outline"
            className="px-8 py-6 text-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Certificate
          </Button>
        </div>

        {/* Certificate */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div 
              ref={certificateRef}
              className="relative p-16 bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              {/* Border */}
              <div className="absolute inset-8 border-8 border-double border-indigo-200 rounded-2xl"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">PrimeRole Institute</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl text-gray-600 mb-2">Certificate of Completion</h2>
                <h3 className="text-xl text-gray-500 mb-8">This is to certify that</h3>
                
                {/* Student Name */}
                <div className="mb-8">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {session?.user?.name}
                  </div>
                  <div className="w-64 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent mx-auto"></div>
                </div>

                {/* Course Info */}
                <p className="text-xl text-gray-700 mb-2">
                  has successfully completed the
                </p>
                <h4 className="text-3xl font-bold text-gray-900 mb-8">
                  {course.certification.title}
                </h4>

                {/* Skills */}
                <div className="mb-8">
                  <p className="text-lg text-gray-600 mb-4">Demonstrating proficiency in:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {course.certification.skills.slice(0, 4).map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date and ID */}
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-gray-600 text-sm mb-1">Completion Date</p>
                    <p className="text-gray-900 font-semibold">{completionDate}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-32 h-0.5 bg-gray-900 mb-2 mx-auto"></div>
                    <p className="text-gray-600 text-sm">Authorized Signature</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-gray-600 text-sm mb-1">Certificate ID</p>
                    <p className="text-gray-900 font-semibold text-xs">{certificateId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-3xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Linkedin className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Showcase Your Achievement</h4>
                <p className="text-gray-600">Add this certificate to your LinkedIn profile to boost your professional credibility</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Continue Learning</h4>
                <p className="text-gray-600">Explore more courses to expand your skills and earn additional certifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}