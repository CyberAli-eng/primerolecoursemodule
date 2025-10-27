'use client'
import { CheckCircle2, Circle, Lock } from 'lucide-react'

export default function ProgressBar({ course, progress, modules, onModuleClick }) {
  const calculateModuleProgress = (module) => {
    const totalLessons = module.content.length
    const completedLessons = module.content.filter(
      lesson => progress.completedLessons.includes(lesson.id)
    ).length
    return (completedLessons / totalLessons) * 100
  }

  const isModuleAccessible = (moduleIndex) => {
    // First module is always accessible
    if (moduleIndex === 0) return true
    // Other modules accessible if previous module is completed
    return progress.completedModules >= moduleIndex
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Course Completion</span>
          <span className="font-semibold">
            {Math.round((progress.completedModules / modules.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(progress.completedModules / modules.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        {modules.map((module, index) => {
          const moduleProgress = calculateModuleProgress(module)
          const isAccessible = isModuleAccessible(index)
          const isCurrentModule = progress.currentModule === module.id
          const isCompleted = progress.completedModules > index

          return (
            <button
              key={module.id}
              onClick={() => isAccessible && onModuleClick(module.id)}
              disabled={!isAccessible}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isCurrentModule
                  ? 'border-indigo-600 bg-indigo-50'
                  : isCompleted
                  ? 'border-green-200 bg-green-50'
                  : isAccessible
                  ? 'border-gray-200 hover:border-indigo-300 bg-white'
                  : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : isAccessible ? (
                    <Circle className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-1">
                    Module {index + 1}
                  </div>
                  <div className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                    {module.title}
                  </div>
                  
                  {isAccessible && (
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(moduleProgress)}% complete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}