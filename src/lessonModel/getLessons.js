const pool = require("../db");

async function getLessons({
  date,
  status,
  teacherIds,
  studentsCount,
  page = 1,
  lessonsPerPage = 5,
}) {
  // Преобразование teacherIds в массив и разделение строкового ввода
  const teacherIdsArray = teacherIds
    ? teacherIds.split(",").map((id) => parseInt(id.trim()))
    : [];

  // Преобразование значений даты в правильный формат (date должен быть строкой в формате 'YYYY-MM-DD')
  const dateArray = date ? date.split(",").map((d) => d.trim()) : [];
  const startDate = dateArray[0];
  const endDate = dateArray[1];

  // Преобразование studentsCount в массив
  const studentsCountArray = studentsCount
    ? studentsCount.split(",").map((count) => parseInt(count.trim()))
    : [];

  // Логика выполнения SQL-запроса для получения занятий с учетом фильтров
  const offset = (page - 1) * lessonsPerPage;
  const query = `
    SELECT DISTINCT lessons.id, lessons.date, lessons.title, lessons.status,
      COUNT(DISTINCT lesson_students.student_id) AS visitCount
    FROM lessons
    LEFT JOIN lesson_teachers ON lessons.id = lesson_teachers.lesson_id
    LEFT JOIN teachers ON lesson_teachers.teacher_id = teachers.id
    LEFT JOIN lesson_students ON lessons.id = lesson_students.lesson_id
    WHERE (lessons.date BETWEEN $1 AND $2 OR lessons.date = $1 OR lessons.date = $2)
      AND lessons.status = $3
      AND (teachers.id = ANY($4::int[]) OR $4::int[] IS NULL)
    GROUP BY lessons.id
    HAVING COUNT(DISTINCT lesson_students.student_id) BETWEEN $5 AND $6
    ORDER BY lessons.id
    OFFSET $7 LIMIT $8;
  `;

  const result = await pool.query(query, [
    startDate,
    endDate,
    status,
    teacherIdsArray,
    studentsCountArray[0],
    studentsCountArray[1],
    offset,
    lessonsPerPage,
  ]);
  return {
    data: result.rows,
    paginaton: {
      page,
      lessonsPerPage,
    },
  };
}

module.exports = { getLessons };
