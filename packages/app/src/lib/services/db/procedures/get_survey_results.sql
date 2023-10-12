CREATE OR REPLACE FUNCTION get_survey_results(p_survey_id UUID)
RETURNS TABLE(
    question_id UUID,
    question_type VARCHAR,
    aggregated_result TEXT
) LANGUAGE plpgsql AS $$
DECLARE
    v_question_id UUID;
    v_question_type VARCHAR;
    v_result TEXT;
    v_cur CURSOR FOR SELECT id, answer_type FROM survey_questions WHERE id IN (
        SELECT survey_questions_id FROM surveys_survey_questions WHERE surveys_id = p_survey_id
    );
BEGIN
    -- Open the cursor
    OPEN v_cur;

    -- Loop through each question in the survey
    LOOP
        FETCH v_cur INTO v_question_id, v_question_type;
        EXIT WHEN NOT FOUND;

        -- Reset result
        v_result := '';

        -- Aggregate results based on question type
        CASE v_question_type
            WHEN 'text' THEN
                SELECT string_agg(answer_text, ', ') INTO v_result
                FROM survey_answers WHERE question = v_question_id;

            WHEN 'number' THEN
                SELECT avg(answer_number)::TEXT INTO v_result
                FROM survey_answers WHERE question = v_question_id;

            WHEN 'boolean' THEN
                SELECT json_object_agg(answer_boolean, count)::TEXT INTO v_result
                FROM (
                    SELECT answer_boolean, COUNT(*) as count
                    FROM survey_answers WHERE question = v_question_id
                    GROUP BY answer_boolean
                ) sub;

            WHEN 'string' THEN
                SELECT string_agg(answer_text, ', ') INTO v_result
                FROM survey_answers WHERE question = v_question_id;

            WHEN 'string_array' THEN
                SELECT json_object_agg(value, count)::TEXT INTO v_result
                FROM (
                    SELECT value, COUNT(*) as count
                    FROM survey_answers, json_array_elements_text(answer_choose::json) AS value
                    WHERE question = v_question_id
                    GROUP BY value
                ) sub;


            WHEN 'number_array' THEN
                -- Assuming a JSON field (like answer_context) is used for storing number arrays
                SELECT json_agg(answer_context) INTO v_result
                FROM survey_answers WHERE question = v_question_id;

            WHEN 'file' THEN
                -- Assuming answer_file is used for storing file UUIDs
                SELECT string_agg(answer_file::TEXT, ', ') INTO v_result
                FROM survey_answers WHERE question = v_question_id;

            ELSE
                v_result := 'Unsupported question type';
        END CASE;

        -- Store the aggregated result
        RETURN QUERY SELECT v_question_id, v_question_type, v_result;

    END LOOP;

    -- Close the cursor
    CLOSE v_cur;
END;
$$;
