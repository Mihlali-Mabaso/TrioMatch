import { supabase } from '@/integrations/supabase/client';

export interface Student {
    id: string;
    full_name: string;
    whatsapp_number: string;
    year_level: string;
    faculty: string;
    joined_at: string;
    matched: boolean;
}

export interface WaitingPoolEntry {
    id: string;
    student_id: string;
    position: number;
    status: "waiting" | "matched";
}

export interface Match {
    id: string;
    student_1_id: string;
    student_2_id: string;
    student_3_id: string;
    matched_at: string;
    notified: boolean;
}

// Simulate async delay for consistency
function delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// GET all students (billboard)
export async function getAllStudents(): Promise<Student[]> {
    await delay(200);
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('joined_at', { ascending: false });

    if (error) {
        console.error('Error fetching students:', error);
        throw error;
    }

    console.log('Fetched students:', data);
    return data || [];
}

// GET students with pagination
export async function getStudentsPaginated(
    page: number,
    limit: number = 20
): Promise<{ students: Student[]; total: number; hasMore: boolean }> {
    await delay(200);

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
        .from('students')
        .select('*', { count: 'exact' })
        .order('joined_at', { ascending: false })
        .range(start, end);

    if (error) {
        console.error('Error fetching paginated students:', error);
        throw error;
    }

    console.log('Fetched paginated students:', data, 'Total count:', count);
    return {
        students: data || [],
        total: count || 0,
        hasMore: count ? end < count - 1 : false,
    };
}

// GET waiting pool entries
export async function getWaitingPool(): Promise<
    (WaitingPoolEntry & { student: Student })[]
> {
    await delay(200);
    const { data, error } = await supabase
        .from('waiting_pool')
        .select(`
      *,
      student:students(*)
    `)
        .eq('status', 'waiting')
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching waiting pool:', error);
        throw error;
    }

    console.log('Fetched waiting pool:', data);
    return (data || []).map((entry: any) => ({
        id: entry.id,
        student_id: entry.student_id,
        position: entry.position,
        status: entry.status,
        student: entry.student,
    }));
}

// GET stats
export async function getStats(): Promise<{
    totalStudents: number;
    totalMatched: number;
    totalWaiting: number;
    totalTrios: number;
}> {
    await delay(100);

    const { count: totalStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

    const { count: totalMatched } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('matched', true);

    const { count: totalWaiting } = await supabase
        .from('waiting_pool')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'waiting');

    const { count: totalTrios } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

    console.log('Stats:', {
        totalStudents,
        totalMatched,
        totalWaiting,
        totalTrios,
    });

    return {
        totalStudents: totalStudents || 0,
        totalMatched: totalMatched || 0,
        totalWaiting: totalWaiting || 0,
        totalTrios: totalTrios || 0,
    };
}

// POST add a new student
export async function addStudent(data: {
    full_name: string;
    whatsapp_number: string;
    year_level: string;
    faculty: string;
}): Promise<Student> {
    await delay(500);

    // Insert student
    const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
            full_name: data.full_name,
            whatsapp_number: data.whatsapp_number,
            year_level: data.year_level,
            faculty: data.faculty,
            matched: false,
        })
        .select()
        .single();

    if (studentError) {
        console.error('Error adding student:', studentError);
        throw studentError;
    }

    console.log('New student added:', newStudent);

    // Get current max position in waiting pool
    const { data: maxPositionData } = await supabase
        .from('waiting_pool')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

    const nextPosition = maxPositionData && maxPositionData.length > 0
        ? maxPositionData[0].position + 1
        : 1;

    // Add to waiting pool
    const { data: waitingPoolEntry, error: poolError } = await supabase
        .from('waiting_pool')
        .insert({
            student_id: newStudent.id,
            position: nextPosition,
            status: 'waiting',
        })
        .select()
        .single();

    if (poolError) {
        console.error('Error adding to waiting pool:', poolError);
        throw poolError;
    }

    console.log('New waiting pool entry:', waitingPoolEntry);
    console.log('Student added at position:', nextPosition);

    return newStudent;
}

// GET matches
export async function getMatches(): Promise<Match[]> {
    await delay(200);
    const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('matched_at', { ascending: false });

    if (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }

    console.log('Fetched matches:', data);
    return data || [];
}
