'use client'

import { useParams } from 'next/navigation'
import { trpc } from '@/trpc/client'
import { useState } from 'react'
import {
  GraduationCap, Plus, Play, Clock, Users, Star, BookOpen, Video,
  FileText, CheckCircle2, Lock, Eye, BarChart3, Loader2, Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PhaseLayout } from '@/components/dashboard/phase-layout'

interface Course {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  lessons: number
  duration: string
  students: number
  rating: number
  status: 'draft' | 'published' | 'archived'
  thumbnail: string
  category: string
}

interface Lesson {
  id: string
  courseId: string
  title: string
  type: 'video' | 'article' | 'quiz'
  duration: string
  order: number
  isLocked: boolean
}

const sampleCourses: Course[] = [
  { id: '1', title: 'Forex Trading Fundamentals', description: 'Learn the basics of currency trading — from pip calculations to your first live trade', level: 'beginner', lessons: 12, duration: '4h 30m', students: 2840, rating: 4.7, status: 'published', thumbnail: '📈', category: 'Forex' },
  { id: '2', title: 'Technical Analysis Masterclass', description: 'Master chart patterns, indicators, and price action strategies used by professional traders', level: 'intermediate', lessons: 18, duration: '7h 15m', students: 1920, rating: 4.8, status: 'published', thumbnail: '📊', category: 'Analysis' },
  { id: '3', title: 'Cryptocurrency Trading A-Z', description: 'Complete guide to crypto markets — blockchain basics, DeFi, and advanced trading strategies', level: 'beginner', lessons: 15, duration: '5h 45m', students: 3150, rating: 4.6, status: 'published', thumbnail: '₿', category: 'Crypto' },
  { id: '4', title: 'Risk Management & Psychology', description: 'The most important skills in trading — position sizing, risk-reward ratios, and emotional control', level: 'advanced', lessons: 8, duration: '3h 20m', students: 1540, rating: 4.9, status: 'published', thumbnail: '🧠', category: 'Psychology' },
  { id: '5', title: 'MetaTrader 4 & 5 Platform Guide', description: 'Step-by-step walkthroughs for setting up and using MT4/MT5 like a professional', level: 'beginner', lessons: 10, duration: '3h 50m', students: 4200, rating: 4.5, status: 'published', thumbnail: '💻', category: 'Platform' },
  { id: '6', title: 'Advanced Options Strategies', description: 'Iron condors, butterflies, and complex multi-leg strategies for experienced traders', level: 'advanced', lessons: 14, duration: '6h 10m', students: 680, rating: 4.4, status: 'draft', thumbnail: '🎯', category: 'Options' },
]

const sampleLessons: Lesson[] = [
  { id: '1', courseId: '1', title: 'What is Forex Trading?', type: 'video', duration: '12:30', order: 1, isLocked: false },
  { id: '2', courseId: '1', title: 'Understanding Currency Pairs', type: 'video', duration: '18:45', order: 2, isLocked: false },
  { id: '3', courseId: '1', title: 'Reading a Forex Chart', type: 'video', duration: '22:10', order: 3, isLocked: false },
  { id: '4', courseId: '1', title: 'Pip Calculations & Lot Sizes', type: 'article', duration: '8 min read', order: 4, isLocked: true },
  { id: '5', courseId: '1', title: 'Module 1 Quiz', type: 'quiz', duration: '10 questions', order: 5, isLocked: true },
  { id: '6', courseId: '1', title: 'Placing Your First Trade', type: 'video', duration: '25:00', order: 6, isLocked: true },
]

const levelColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-blue-500/20 text-blue-400',
  advanced: 'bg-purple-500/20 text-purple-400',
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-red-500/20 text-red-400',
}

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4 text-blue-400" />,
  article: <FileText className="w-4 h-4 text-orange-400" />,
  quiz: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
}

export default function ClassroomPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project } = trpc.project.getById.useQuery({ id })
  const [courses] = useState(sampleCourses)
  const [lessons] = useState(sampleLessons)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const totalStudents = courses.reduce((s, c) => s + c.students, 0)
  const totalLessons = courses.reduce((s, c) => s + c.lessons, 0)
  const avgRating = (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1)

  const courseLessons = selectedCourse ? lessons.filter(l => l.courseId === selectedCourse) : []

  return (
    <PhaseLayout projectId={id} projectName={project?.name} phaseNum={0} title="Classroom" subtitle="Educational platform with video courses, tutorials, and guides — instant access for registered leads">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Courses', value: courses.length, color: 'text-foreground' },
          { label: 'Published', value: courses.filter(c => c.status === 'published').length, color: 'text-green-400' },
          { label: 'Total Students', value: `${(totalStudents / 1000).toFixed(1)}K`, color: 'text-blue-400' },
          { label: 'Total Lessons', value: totalLessons, color: 'text-purple-400' },
          { label: 'Avg. Rating', value: `${avgRating}/5`, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Course Library</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Course Title" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input type="text" placeholder="Category (e.g., Forex, Crypto)" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="text" placeholder="Estimated Duration" className="px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <textarea placeholder="Course Description" rows={2} className="w-full mt-3 px-3 py-2 rounded-lg border border-border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="flex gap-2 mt-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Create Course</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {courses.map(course => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
            className={cn(
              'bg-card border rounded-xl p-4 cursor-pointer transition-all',
              selectedCourse === course.id ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                {course.thumbnail}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-foreground">{course.title}</span>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', statusColors[course.status])}>{course.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', levelColors[course.level])}>{course.level}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {course.rating}</span>
                </div>
              </div>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded Lessons */}
            {selectedCourse === course.id && course.id === '1' && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Lessons</p>
                <div className="space-y-1.5">
                  {courseLessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-background hover:bg-muted transition-colors">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {lesson.order}
                      </span>
                      {typeIcons[lesson.type]}
                      <span className={cn('flex-1 text-sm', lesson.isLocked ? 'text-muted-foreground' : 'text-foreground')}>{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      {lesson.isLocked ? <Lock className="w-3.5 h-3.5 text-muted-foreground" /> : <Play className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Platform Features */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Classroom Features</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: <Video className="w-5 h-5 text-blue-400" />, title: 'Video Tutorials', desc: 'HD video lessons with progress tracking' },
            { icon: <FileText className="w-5 h-5 text-orange-400" />, title: 'Written Guides', desc: 'In-depth articles and PDF downloads' },
            { icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />, title: 'Quizzes & Tests', desc: 'Knowledge verification after each module' },
            { icon: <GraduationCap className="w-5 h-5 text-green-400" />, title: 'Certificates', desc: 'Completion certificates for students' },
          ].map(feature => (
            <div key={feature.title} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">{feature.icon}</div>
              <p className="text-sm font-medium text-foreground mb-1">{feature.title}</p>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PhaseLayout>
  )
}
