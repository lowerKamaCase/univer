const pool = require("../db");

async function createLessons({ teacherIds, title, days, firstDate, lessonsCount, lastDate }) {
  // Проверка на максимальное количество занятий и период в 1 год
  if (lessonsCount > 300) {
    throw new Error('Количество занятий не должно превышать 300.');
  }

  const startDate = new Date(firstDate);
  const endDate = lastDate ? new Date(lastDate) : new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  if (endDate - startDate > 365 * 24 * 60 * 60 * 1000) {
    throw new Error('Период создания занятий не должен превышать 1 год.');
  }

  const lessonIds = [];

  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    if (days.includes(currentDate.getDay())) {
      const lessonDate = currentDate.toISOString().split('T')[0];
      await Promise.all(
        teacherIds.map(async () => {
          const query = `
            INSERT INTO lessons (date, title, status)
            VALUES ($1, $2, $3)
            RETURNING id;
          `;
          const values = [lessonDate, title, 0]; // Устанавливаем статус "не проведено"
          const { rows } = await pool.query(query, values);
          lessonIds.push(rows[0].id);
          if (lessonIds.length >= lessonsCount) {
            return lessonIds;
          }
        })
      );
    }
  }

  return lessonIds;
}

module.exports = {
  createLessons,
};
