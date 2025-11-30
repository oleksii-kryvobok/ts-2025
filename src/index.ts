// enum списки
enum StudentStatus {
    Active = "Active",
    AcademicLeave = "AcademicLeave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum GradeValue {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    ComputerScience = "ComputerScience",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}



// інтерфейси
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeValue;
    date: Date;
    semester: Semester;
}


// головний клас
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private registrations: Map<number, number[]> = new Map(); // studentId -> список courseId
    private studentIdCounter = 1;

    constructor() {}

    addCourse(course: Course): void { // додавання курсу
        this.courses.push(course);
    }

    enrollStudent(student: Omit<Student, "id">): Student { // додавання студента
        const newStudent: Student = {
            id: this.studentIdCounter++,
            ...student
        };
        this.students.push(newStudent);
        return newStudent;
    }

    registerForCourse(studentId: number, courseId: number): void { // запис студента на курс
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        // перевірки
        if (!student) { console.log("Студент не знайдений"); throw new Error("Студент не знайдений");}
        if (!course) { console.log("Курс не знайдено");throw new Error("Курс не знайдено");}

        if (student.status !== StudentStatus.Active) {
            console.log("Поточний статус студента не є Активний, неможливо виконати");
            throw new Error("Поточний статус студента не є Активний, неможливо виконати");
        }

        if (student.faculty !== course.faculty) {
            console.log("Студент не може зареєструватися на курс іншого факультету");
            throw new Error("Студент не може зареєструватися на курс іншого факультету");
        }

        const registeredCount = Array.from(this.registrations.values())
            .filter(list => list.includes(courseId)).length;

        if (registeredCount >= course.maxStudents) {
            console.log("Немає місць, неможливо зареєструватися");
            throw new Error("Немає місць, неможливо зареєструватися");
        }

        const studentCourses = this.registrations.get(studentId) || [];
        if (!studentCourses.includes(courseId)) {
            studentCourses.push(courseId);
            this.registrations.set(studentId, studentCourses);
        }
    }

    setGrade(studentId: number, courseId: number, grade: GradeValue): void { // виставлення оцінок
        const studentCourses = this.registrations.get(studentId);
        if (!studentCourses || !studentCourses.includes(courseId)) {
            console.log("Неможливо виставити оцінку: студент не зареєстрований на курсі");
            throw new Error("Неможливо виставити оцінку: студент не зареєстрований на курсі");
        }

        const course = this.courses.find(c => c.id === courseId);
        if (!course) {console.log("Курс не знайдено");throw new Error("Курс не знайдено");}

        this.grades.push({studentId, courseId, grade, date: new Date(), semester: course.semester});
    }

    updateStudentStatus(studentId: number, newStatus: StudentStatus): void { // зміна статусу студента
        const student = this.students.find(s => s.id === studentId);
        if (!student) {console.log("Студент не знайдений");throw new Error("Студент не знайдений");}

        if (student.status === StudentStatus.Graduated || student.status === StudentStatus.Expelled) {
            console.log("Статус студента неможливо змінити після встановлення Graduated чи Expelled");
            throw new Error("Статус студента неможливо змінити після встановлення Graduated чи Expelled");
        }

        student.status = newStatus;
    }
    // отримати: студентів за ф-том, оцінки студента, доступні курси
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }
    // середні оцінки
    calculateAverageGrade(studentId: number): number {
        const grades = this.getStudentGrades(studentId);
        if (grades.length === 0) return 0;

        const sum = grades.reduce((acc, g) => acc + g.grade, 0);
        return sum / grades.length;
    }
    // список відмінників
    getExcellentStudents(faculty: Faculty): Student[] {
        return this.students.filter(st => {
            if (st.faculty !== faculty) return false;
            const avg = this.calculateAverageGrade(st.id);
            return avg >= GradeValue.Excellent;
        });
    }
}



// тести

const ums = new UniversityManagementSystem();
// додавання курсів
ums.addCourse({
    id: 1,
    name: "Algorithms",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.ComputerScience,
    maxStudents: 2
});

ums.addCourse({
    id: 2,
    name: "Microeconomics",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 3
});
// додавання студентів
const st1 = ums.enrollStudent({
    fullName: "Slow Poke",
    faculty: Faculty.ComputerScience,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2025-09-01"),
    groupNumber: "PD-44"
});

const st2 = ums.enrollStudent({
    fullName: "Vitalii Kim",
    faculty: Faculty.ComputerScience,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2025-09-01"),
    groupNumber: "PD-42"
});
// реєстрація студентів
ums.registerForCourse(st1.id, 1);
ums.registerForCourse(st2.id, 1);
// виставлення оцінок
ums.setGrade(st1.id, 1, GradeValue.Excellent);
ums.setGrade(st2.id, 1, GradeValue.Good);
// консольні виводи даних
console.log("Студенти факультету Комп'ютерні науки:", ums.getStudentsByFaculty(Faculty.ComputerScience));
console.log(`\nОцінки студента ${st1.fullName}:`, ums.getStudentGrades(st1.id));
console.log(`Середній бал студента ${st1.fullName}:`, ums.calculateAverageGrade(st1.id));
console.log(`\nОцінки студента ${st2.fullName}:`, ums.getStudentGrades(st2.id));
console.log(`Середній бал студента ${st2.fullName}:`, ums.calculateAverageGrade(st2.id));
console.log("Доступні курси факультету Комп'ютерні науки на першому семестрі:", ums.getAvailableCourses(Faculty.ComputerScience, Semester.First));
console.log("Відмінники факультету Комп'ютерні науки:", ums.getExcellentStudents(Faculty.ComputerScience));