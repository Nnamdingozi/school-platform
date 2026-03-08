import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface ProfileResult {
    id: string
    name: string | null
    email: string
    role: 'TEACHER' | 'STUDENT' | 'PARENT'
}

interface ClassResult {
    id: string
    name: string
    grade: { displayName: string }
    teacher: { name: string | null }
}

interface SearchCategory<T> {
    data: T[]
    total: number
}

interface SearchResults {
    teachers: SearchCategory<ProfileResult>
    students: SearchCategory<ProfileResult>
    parents: SearchCategory<ProfileResult>
    classes: SearchCategory<ClassResult>
}

const TAKE = 5
const MIN_QUERY_LENGTH = 3

export async function GET(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const query = searchParams.get('q')?.trim() ?? ''
        const schoolId = searchParams.get('schoolId') ?? ''

        if (query.length < MIN_QUERY_LENGTH || !schoolId) {
            return NextResponse.json({ results: null })
        }

        const profileWhere = (role: 'TEACHER' | 'STUDENT' | 'PARENT') => ({
            schoolId,
            role,
            OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { email: { contains: query, mode: 'insensitive' as const } },
            ],
        })

        const classWhere = {
            schoolId,
            name: { contains: query, mode: 'insensitive' as const },
        }

        const [
            teachers, teacherCount,
            students, studentCount,
            parents, parentCount,
            classes, classCount,
        ] = await Promise.all([
            prisma.profile.findMany({
                where: profileWhere('TEACHER'),
                select: { id: true, name: true, email: true, role: true },
                take: TAKE,
            }),
            prisma.profile.count({ where: profileWhere('TEACHER') }),

            prisma.profile.findMany({
                where: profileWhere('STUDENT'),
                select: { id: true, name: true, email: true, role: true },
                take: TAKE,
            }),
            prisma.profile.count({ where: profileWhere('STUDENT') }),

            prisma.profile.findMany({
                where: profileWhere('PARENT'),
                select: { id: true, name: true, email: true, role: true },
                take: TAKE,
            }),
            prisma.profile.count({ where: profileWhere('PARENT') }),

            prisma.class.findMany({
                where: classWhere,
                select: {
                    id: true,
                    name: true,
                    grade: { select: { displayName: true } },
                    teacher: { select: { name: true } },
                },
                take: TAKE,
            }),
            prisma.class.count({ where: classWhere }),
        ])

        const results: SearchResults = {
            teachers: { data: teachers as ProfileResult[], total: teacherCount },
            students: { data: students as ProfileResult[], total: studentCount },
            parents:  { data: parents  as ProfileResult[], total: parentCount  },
            classes:  { data: classes  as ClassResult[],   total: classCount   },
        }

        return NextResponse.json({ results })

    } catch (err: unknown) {
        console.error('Search error:', err)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
}