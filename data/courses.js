// data/courses.js
export const courses = [
  {
    id: "revops",
    slug: "revenue-operations",
    title: "Revenue Operations",
    subtitle: "Master the complete RevOps framework to align sales, marketing, and customer success",
    duration: "8 Weeks",
    level: "Professional",
    cohortStart: "Immediate Access",
    instructor: "Sarah Chen, VP Revenue Operations",
    category: "Revenue Operations",
    thumbnail: "https://images.unsplash.com/photo-1660020619062-70b16c44bf0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxyZXZlbnVlJTIwYW5hbHl0aWNzfGVufDB8fHxibHVlfDE3NjE1NzEwNTV8MA&ixlib=rb-4.1.0&q=85&w=800",
    description: "Comprehensive RevOps training with hands-on projects, real-world case studies, and industry-recognized certification",
    price: "FREE",
    originalPrice: "$1,999",
    features: [
      "8 intensive modules with video lessons",
      "Practical assessments & case studies",
      "Lifetime access to course materials",
      "Professional certification",
      "LinkedIn badge & shareable certificate",
      "Community access"
    ],

    modules: [
      {
        id: "module-1",
        title: "Introduction to Revenue Operations",
        duration: "1 week",
        lessons: 4,
        hasAssessment: true,
        objective: "Introduction to the course and fundamentals of RevOps and definition.",
        content: [
          {
            id: "lesson-1-1",
            type: "reading",
            title: "Welcome to RevOps Mastery",
            duration: "10 min",
            content: `# Welcome to RevOps Mastery! 🎯

## Why This Course?
This course is specifically designed for GTM leaders who want to master the art and science of revenue operations. Whether you're looking to implement RevOps in your organization or advance your career, this comprehensive program provides the strategic framework and practical skills you need.

## What You'll Achieve:
- **Module Assessments**: Test your knowledge after each module to ensure mastery of key concepts
- **Professional Certificate**: Earn a recognized certification to showcase your RevOps expertise
- **Expert-Designed Curriculum**: Learn from leading RevOps professionals at PrimeRole
- **Career Growth**: Build skills that position you for leadership roles in revenue operations
- **Comprehensive Learning**: 8 structured modules from fundamentals to advanced strategies

## Course Structure:
1. **Introduction to RevOps** - Fundamentals and strategic importance
2. **Building the Revenue Engine** - Systems, Data & People alignment
3. **Revenue Data Simplified** - From chaos to clarity
4. **Process Design** - Creating predictable growth
5. **AI Meets RevOps** - Future of revenue efficiency
6. **GTM Alignment** - Cross-functional collaboration
7. **Measuring Success** - RevOps metrics that matter
8. **Scaling RevOps** - Maturity models & career growth

Ready to transform your revenue operations? Let's begin! 🚀`
          },
          {
            id: "lesson-1-2",
            type: "video",
            title: "What is Revenue Operations?",
            duration: "18 min",
            videoUrl: "/videos/revops/Revops 1.1.mp4",
            description: "Introduction to RevOps and its role in modern businesses"
          },
          {
            id: "lesson-1-3",
            type: "video",
            title: "The Evolution of RevOps",
            duration: "10 min",
            videoUrl: "/videos/revops/Revops 1.2.mp4",
            description: "Understanding the core principles and business impact and Revenue Operations has evolved from siloed departmental functions into a unified business strategy. In the past, marketing, sales, and customer success operated independently with separate goals, metrics, and tools. This created friction, data discrepancies, and revenue leakage. Today, RevOps represents a fundamental shift toward aligning all revenue-facing teams around shared objectives, common data, and integrated processes to drive sustainable growth.",
          },
          {
            id: "lesson-1-4",
            type: "quiz",
            title: "Module 1 Knowledge Check",
            duration: "15 min",
            questions: 5
          }
        ]
      },
      {
        id: "module-2",
        title: "Building the Revenue Engine - Systems, Data & People",
        duration: "1 week",
        lessons: 5,
        hasAssessment: true,
        objective: "Understand the pillars that make a revenue engine work and how to align teams around shared goals.",
        content: [
          {
            id: "lesson-2-1",
            type: "video",
            title: "Mapping the Revenue Journey",
            duration: "20 min",
            videoUrl: "/videos/revops/Revops Mod 2.1.mp4",
            description: "From lead to lifetime value mapping"
          },
          {
            id: "lesson-2-2",
            type: "video",
            title: "Defining Shared Metrics",
            duration: "15 min",
            videoUrl: "/videos/revops/module-2-lesson-2.mp4",
            description: "Creating unified KPIs across marketing, sales, and customer success"
          },
          {
            id: "lesson-2-3",
            type: "reading",
            title: "People, Process & Platforms",
            duration: "12 min",
            content: "The three pillars of RevOps success: People (cross-functional teams with shared goals), Process (streamlined workflows and handoffs), and Platforms (integrated technology stack). When these elements work in harmony, they create a revenue engine that scales efficiently and predictably."
          },
          {
            id: "lesson-2-4",
            type: "video",
            title: "Identifying Bottlenecks",
            duration: "18 min",
            videoUrl: "/videos/revops/module-2-lesson-4.mp4",
            description: "Spotting and eliminating friction points in the revenue funnel"
          },
          {
            id: "lesson-2-5",
            type: "quiz",
            title: "Revenue Engine Assessment",
            duration: "20 min",
            questions: 6
          }
        ]
      }
    ],

    assessments: [
      {
        id: "assessment-1",
        title: "RevOps Fundamentals Assessment",
        module: "module-1",
        passingScore: 80,
        timeLimit: 15,
        questions: [
          {
            id: "q1",
            question: "What is the primary goal of Revenue Operations?",
            options: [
              "Increase sales team size",
              "Align sales, marketing, and customer success",
              "Reduce marketing budget",
              "Automate all processes"
            ],
            correctAnswer: "Align sales, marketing, and customer success",
            explanation: "RevOps focuses on breaking down silos between departments to create a unified revenue engine."
          },
          {
            id: "q2",
            question: "Which department is NOT typically part of RevOps alignment?",
            options: [
              "Marketing",
              "Sales",
              "Customer Success",
              "Product Development"
            ],
            correctAnswer: "Product Development",
            explanation: "While RevOps influences many revenue-related functions, product development typically operates separately."
          },
          {
            id: "q3",
            question: "What is the main benefit of implementing RevOps?",
            options: [
              "Reducing headcount across departments",
              "Creating a single source of truth for revenue data",
              "Eliminating the need for CRM systems",
              "Making marketing teams obsolete"
            ],
            correctAnswer: "Creating a single source of truth for revenue data",
            explanation: "RevOps unifies data, processes, and goals across revenue-generating teams."
          },
          {
            id: "q4",
            question: "Which metric is most important for RevOps alignment?",
            options: [
              "Department-specific KPIs",
              "Individual team performance",
              "Shared revenue metrics",
              "Tool utilization rates"
            ],
            correctAnswer: "Shared revenue metrics",
            explanation: "Shared metrics ensure all teams are working toward common business objectives."
          },
          {
            id: "q5",
            question: "What role does technology play in RevOps?",
            options: [
              "It replaces human decision-making entirely",
              "It serves as an enabler for alignment and efficiency",
              "It's optional and not necessary for success",
              "It creates more complexity than value"
            ],
            correctAnswer: "It serves as an enabler for alignment and efficiency",
            explanation: "Technology supports RevOps by integrating systems and providing actionable insights."
          }
        ]
      },
      {
        id: "assessment-2",
        title: "RevOps Fundamentals Assessment",
        module: "module-2",
        passingScore: 80,
        timeLimit: 15,
        questions: [
          {
            id: "q1",
            question: "What is the primary goal of Revenue Operations?",
            options: [
              "Increase sales team size",
              "Align sales, marketing, and customer success",
              "Reduce marketing budget",
              "Automate all processes"
            ],
            correctAnswer: "Align sales, marketing, and customer success",
            explanation: "RevOps focuses on breaking down silos between departments to create a unified revenue engine."
          },
          {
            id: "q2",
            question: "Which department is NOT typically part of RevOps alignment?",
            options: [
              "Marketing",
              "Sales",
              "Customer Success",
              "Product Development"
            ],
            correctAnswer: "Product Development",
            explanation: "While RevOps influences many revenue-related functions, product development typically operates separately."
          },
          {
            id: "q3",
            question: "What is the main benefit of implementing RevOps?",
            options: [
              "Reducing headcount across departments",
              "Creating a single source of truth for revenue data",
              "Eliminating the need for CRM systems",
              "Making marketing teams obsolete"
            ],
            correctAnswer: "Creating a single source of truth for revenue data",
            explanation: "RevOps unifies data, processes, and goals across revenue-generating teams."
          },
          {
            id: "q4",
            question: "Which metric is most important for RevOps alignment?",
            options: [
              "Department-specific KPIs",
              "Individual team performance",
              "Shared revenue metrics",
              "Tool utilization rates"
            ],
            correctAnswer: "Shared revenue metrics",
            explanation: "Shared metrics ensure all teams are working toward common business objectives."
          },
          {
            id: "q5",
            question: "What role does technology play in RevOps?",
            options: [
              "It replaces human decision-making entirely",
              "It serves as an enabler for alignment and efficiency",
              "It's optional and not necessary for success",
              "It creates more complexity than value"
            ],
            correctAnswer: "It serves as an enabler for alignment and efficiency",
            explanation: "Technology supports RevOps by integrating systems and providing actionable insights."
          }
        ]
      }
    ],

    certification: {
      title: "Revenue Operations",
      issuer: "PrimeRole Institute",
      validFor: "Lifetime",
      skills: [
        "RevOps Strategy",
        "Revenue Engine Design",
        "Data Analytics",
        "Process Automation",
        "Cross-functional Leadership",
        "GTM Alignment",
        "AI Integration",
        "Performance Metrics"
      ]
    }
    
  },
 
]