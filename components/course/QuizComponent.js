// components/course/QuizComponent.js
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Trophy, Star } from 'lucide-react'

export default function QuizComponent({ 
  questions = [], 
  passingScore = 80, 
  onComplete,
  moduleTitle = "Module"
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(questions.length * 60) // 1 minute per question
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPlayingSound, setIsPlayingSound] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      calculateScore()
    }
  }, [timeLeft, showResults])

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 500)
    } else {
      calculateScore()
    }
  }

  const playSuccessSound = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sound/success.mp3') // Add this sound file to public/sounds/
      audio.play().catch(() => {
        // Fallback: Use browser's SpeechSynthesis if audio file not available
        const synth = window.speechSynthesis
        const utterance = new SpeechSynthesisUtterance('Congratulations! Quiz passed!')
        synth.speak(utterance)
      })
      setIsPlayingSound(true)
      setTimeout(() => setIsPlayingSound(false), 2000)
    }
  }

  const calculateScore = () => {
    const correctAnswers = questions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length
    const calculatedScore = (correctAnswers / questions.length) * 100
    setScore(calculatedScore)
    setShowResults(true)

    if (calculatedScore >= passingScore) {
      playSuccessSound()
      setShowSuccess(true)
      // Auto-proceed after success animation
      setTimeout(() => {
        onComplete?.(true, calculatedScore)
      }, 4000)
    } else {
      setTimeout(() => {
        onComplete?.(false, calculatedScore)
      }, 3000)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Success Animation Component
  const SuccessAnimation = () => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-center text-white shadow-2xl"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <Trophy className="w-24 h-24 mx-auto mb-4" />
        </motion.div>
        
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-4"
        >
          Module Complete! 🎉
        </motion.h2>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl mb-6"
        >
          You scored {Math.round(score)}% - Excellent!
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-2 mb-6"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                delay: i * 0.2,
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Star className="w-8 h-8 fill-current" />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-lg"
        >
          Moving to next module...
        </motion.p>
      </motion.div>
    </motion.div>
  )

  if (showSuccess) {
    return <SuccessAnimation />
  }

  if (showResults) {
    const passed = score >= passingScore
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto"
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          passed ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {passed ? (
            <CheckCircle className="w-12 h-12 text-white" />
          ) : (
            <XCircle className="w-12 h-12 text-white" />
          )}
        </div>
        
        <h3 className="text-3xl font-bold mb-4">
          {passed ? 'Assessment Passed! 🎉' : 'Assessment Failed 😔'}
        </h3>
        
        <p className="text-xl text-gray-600 mb-6">
          You scored {Math.round(score)}% (required: {passingScore}%)
        </p>

        <div className="space-y-4 text-left max-w-md mx-auto">
          {questions.map((question, index) => (
            <div key={question.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                answers[question.id] === question.correctAnswer ? 'bg-green-500' : 'bg-red-500'
              } text-white text-sm font-bold mt-1`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-2">{question.question}</div>
                {answers[question.id] !== question.correctAnswer && (
                  <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                    <strong>Correct:</strong> {question.correctAnswer}
                    {question.explanation && (
                      <div className="mt-1 text-gray-500">{question.explanation}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!passed && (
          <button
            onClick={() => {
              setCurrentQuestion(0)
              setAnswers({})
              setShowResults(false)
              setTimeLeft(questions.length * 60)
            }}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </motion.div>
    )
  }

  const currentQ = questions[currentQuestion]

  if (!currentQ) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
        <p className="text-gray-600">No questions available for this assessment.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{moduleTitle} Assessment</h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Time Remaining</div>
            <div className={`text-lg font-bold ${
              timeLeft < 60 ? 'text-red-500' : 'text-gray-900'
            }`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Passing Score: {passingScore}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            {currentQ.question}
          </h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(currentQ.id, option)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 text-gray-700"
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="flex gap-1">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded ${
              index === currentQuestion
                ? 'bg-indigo-600'
                : index < currentQuestion
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}