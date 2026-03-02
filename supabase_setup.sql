-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates a server-side function that performs matching with full permissions

CREATE OR REPLACE FUNCTION match_students()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    first_years jsonb;
    second_years jsonb;
    third_years jsonb;
    min_count int;
    i int;
    p1_student_id uuid;
    p2_student_id uuid;
    p3_student_id uuid;
    p1_pool_id uuid;
    p2_pool_id uuid;
    p3_pool_id uuid;
    teams_formed int := 0;
BEGIN
    -- Get waiting pool entries grouped by year level (ORDER BY inside jsonb_agg)
    SELECT jsonb_agg(jsonb_build_object('pool_id', wp.id, 'student_id', s.id) ORDER BY wp.position)
    INTO first_years
    FROM waiting_pool wp
    JOIN students s ON s.id = wp.student_id
    WHERE wp.status = 'waiting' AND s.year_level = '1st Year';

    SELECT jsonb_agg(jsonb_build_object('pool_id', wp.id, 'student_id', s.id) ORDER BY wp.position)
    INTO second_years
    FROM waiting_pool wp
    JOIN students s ON s.id = wp.student_id
    WHERE wp.status = 'waiting' AND s.year_level = '2nd Year';

    SELECT jsonb_agg(jsonb_build_object('pool_id', wp.id, 'student_id', s.id) ORDER BY wp.position)
    INTO third_years
    FROM waiting_pool wp
    JOIN students s ON s.id = wp.student_id
    WHERE wp.status = 'waiting' AND s.year_level = '3rd Year';

    -- Handle nulls (no students in that year)
    IF first_years IS NULL OR second_years IS NULL OR third_years IS NULL THEN
        RETURN jsonb_build_object('success', true, 'teams_formed', 0, 'message', 'Not enough students from all 3 year levels');
    END IF;

    -- Find minimum count across all years
    min_count := LEAST(
        jsonb_array_length(first_years),
        jsonb_array_length(second_years),
        jsonb_array_length(third_years)
    );

    -- Create matches
    FOR i IN 0..min_count-1 LOOP
        p1_student_id := (first_years->i->>'student_id')::uuid;
        p2_student_id := (second_years->i->>'student_id')::uuid;
        p3_student_id := (third_years->i->>'student_id')::uuid;
        p1_pool_id := (first_years->i->>'pool_id')::uuid;
        p2_pool_id := (second_years->i->>'pool_id')::uuid;
        p3_pool_id := (third_years->i->>'pool_id')::uuid;

        -- Insert match
        INSERT INTO matches (student_1_id, student_2_id, student_3_id, notified)
        VALUES (p1_student_id, p2_student_id, p3_student_id, false);

        -- Mark students as matched
        UPDATE students SET matched = true WHERE id IN (p1_student_id, p2_student_id, p3_student_id);

        -- Update waiting pool status
        UPDATE waiting_pool SET status = 'matched' WHERE id IN (p1_pool_id, p2_pool_id, p3_pool_id);

        teams_formed := teams_formed + 1;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'teams_formed', teams_formed, 'message', teams_formed || ' teams formed successfully');
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION match_students() TO anon;
GRANT EXECUTE ON FUNCTION match_students() TO authenticated;
