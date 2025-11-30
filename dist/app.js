"use strict";
// масиви даних
const professors = [];
const classrooms = [];
const courses = [];
const schedule = [];
// функції додавання професорів, занять, та пошуку аудиторій і розкладів професорів
function addProfessor(professor) {
    const exists = professors.some((p) => p.id === professor.id);
    if (!exists)
        professors.push(professor);
}
function addLesson(lesson) {
    const validation = validateLesson(lesson);
    if (validation === null) {
        schedule.push(lesson);
        return true;
    }
    return false;
}
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const occupied = schedule
        .filter((l) => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
        .map((l) => l.classroomNumber);
    return classrooms.map((c) => c.number).filter((num) => !occupied.includes(num));
}
function getProfessorSchedule(professorId) {
    return schedule.filter((l) => l.professorId === professorId);
}
function validateLesson(lesson) {
    for (const existing of schedule) {
        const sameTime = existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;
        if (sameTime) {
            if (existing.professorId === lesson.professorId) {
                return { type: "ProfessorConflict", lessonDetails: existing };
            }
            if (existing.classroomNumber === lesson.classroomNumber) {
                return { type: "ClassroomConflict", lessonDetails: existing };
            }
        }
    }
    return null;
}
// використання аудиторії
function getClassroomUtilization(classroomNumber) {
    const totalSlots = 5 * 5;
    const usedSlots = schedule.filter((l) => l.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}
// найпопулярніший тип занять
function getMostPopularCourseType() {
    const count = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0,
    };
    for (const lesson of schedule) {
        const course = courses.find((c) => c.id === lesson.courseId);
        if (course)
            count[course.type]++;
    }
    return Object.keys(count).reduce((a, b) => count[a] >= count[b] ? a : b);
}
// перепризначення аудиторії
function reassignClassroom(lessonId, newClassroomNumber) {
    const lesson = schedule[lessonId];
    if (!lesson)
        return false;
    const proposed = {
        ...lesson,
        classroomNumber: newClassroomNumber,
    };
    const conflict = validateLesson(proposed);
    if (conflict === null) {
        schedule[lessonId].classroomNumber = newClassroomNumber;
        return true;
    }
    return false;
}
// відміна заняття
function cancelLesson(lessonId) {
    if (lessonId >= 0 && lessonId < schedule.length) {
        schedule.splice(lessonId, 1);
    }
}
// введення даних для демонстрації
professors.push({ id: 1, name: "John Doe", department: "Math" });
courses.push({ id: 1, name: "Calculus", type: "Lecture" });
classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 25, hasProjector: false });
const lesson = {
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
};
console.log("Add lesson:", addLesson(lesson));
console.log("Available:", findAvailableClassrooms("8:30-10:00", "Monday"));
console.log("Prof schedule:", getProfessorSchedule(1));
console.log("Utilization 101:", getClassroomUtilization("101"), "%");
