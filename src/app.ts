// типи
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
    id: number;
    name: string;
    department: string;
};
type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};


// масиви даних
const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];


// функції додавання професорів, занять, та пошуку аудиторій і розкладів професорів
function addProfessor(professor: Professor): void {
    const exists = professors.some((p) => p.id === professor.id);
    if (!exists) professors.push(professor);
}

function addLesson(lesson: Lesson): boolean {
    const validation = validateLesson(lesson);
    if (validation === null) {
    schedule.push(lesson);
    return true;
    }
    return false;
}

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupied = schedule
    .filter((l) => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
    .map((l) => l.classroomNumber);
    return classrooms.map((c) => c.number).filter((num) => !occupied.includes(num));
}

function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter((l) => l.professorId === professorId);
}


// конфлікт та валідація
type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
    for (const existing of schedule) {
        const sameTime =
        existing.dayOfWeek === lesson.dayOfWeek &&
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
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5;
    const usedSlots = schedule.filter((l) => l.classroomNumber === classroomNumber).length;
    return (usedSlots / totalSlots) * 100;
}

// найпопулярніший тип занять
function getMostPopularCourseType(): CourseType {
    const count: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
    };


    for (const lesson of schedule) {
    const course = courses.find((c) => c.id === lesson.courseId);
    if (course) count[course.type]++;
    }


    return (Object.keys(count) as CourseType[]).reduce((a, b) =>
    count[a] >= count[b] ? a : b
    );
}

// перепризначення аудиторії
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule[lessonId];
    if (!lesson) return false;


    const proposed: Lesson = {
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
function cancelLesson(lessonId: number): void {
    if (lessonId >= 0 && lessonId < schedule.length) {
        schedule.splice(lessonId, 1);
    }
}


// введення даних для демонстрації
professors.push({ id: 1, name: "John Doe", department: "Math" });
courses.push({ id: 1, name: "Calculus", type: "Lecture" });
classrooms.push({ number: "101", capacity: 30, hasProjector: true });
classrooms.push({ number: "102", capacity: 25, hasProjector: false });


const lesson: Lesson = {
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