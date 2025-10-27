'use client'
import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QuizComponent({ questions, passingScore = 80, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    if (!quizStarted || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, showResults])

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    })
  }

  const handleSubmit = () => {
    let correctCount = 0
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })

    const finalScore = (correctCount / questions.length) * 100
    setScore(finalScore)
    setShowResults(true)

    if (onComplete) {
      onComplete(finalScore >= passingScore, finalScore)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border-2 border-indigo-200">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready for the Assessment?</h2>
          <div className="space-y-4 text-left max-w-md mx-auto mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Time Limit: 15 minutes</p>
                <p className="text-sm text-gray-600">Complete all questions within the time limit</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Passing Score: {passingScore}%</p>
                <p className="text-sm text-gray-600">You need to score at least {passingScore}% to pass</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{questions.length} Questions</p>
                <p className="text-sm text-gray-600">Multiple choice format</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setQuizStarted(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
          >
            Start Assessment
          </Button>
        </div>
      </div>
    )
  }

  if (showResults) {
    const passed = score >= passingScore
    return (
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-2xl p-8 text-center ${
          passed ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
        }`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {passed ? (
              <CheckCircle2 className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          
          <div className="text-6xl font-bold mb-6">
            <span className={passed ? 'text-green-600' : 'text-red-600'}>
              {Math.round(score)}%
            </span>
          </div>

          <p className="text-xl text-gray-700 mb-8">
            {passed 
              ? 'You passed the assessment! You can now move to the next module.'
              : `You need ${passingScore}% to pass. Review the material and try again.`
            }
          </p>

          <div className="bg-white rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Results:</h3>
            <div className="space-y-3">
              {questions.map((q) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer
                return (
                  <div key={q.id} className="flex items-start gap-3 text-left">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{q.question}</p>
                      {!isCorrect && (
                        <div className="mt-2 text-sm">
                          <p className="text-red-600">Your answer: {selectedAnswers[q.id] || 'Not answered'}</p>
                          <p className="text-green-600">Correct answer: {q.correctAnswer}</p>
                          <p className="text-gray-600 mt-1">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {!passed && (
            <Button
              onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowResults(false)
                setScore(0)
                setTimeLeft(900)
                setQuizStarted(false)
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Retry Assessment
            </Button>
          )}
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Timer and Progress */}
      <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </div>
        <div className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {question.question}
        </h3>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question.id, option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswers[question.id] === option
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[question.id] === option
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[question.id] === option && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={Object.keys(selectedAnswers).length !== questions.length}
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}