
import { useState } from "react";
import "./App.css";

const courseTopics = [
  ["Introduction", "Core concepts", "Practical applications"],
  ["Getting started", "Fundamentals", "Practice and projects"],
  ["Basic concepts", "Intermediate concepts", "Hands-on practice"],
];

const courseNames = [
  ["Java Programming", "Programming"],
  ["Python Programming", "Programming"],
  ["C Programming", "Programming"],
  ["C++ Programming", "Programming"],
  ["JavaScript Essentials", "Programming"],
  ["Data Structures and Algorithms", "Computer Science"],
  ["SQL and Database Management", "Database"],
  ["HTML and CSS", "Web Development"],
  ["React.js Development", "Web Development"],
  ["MERN Stack Development", "Web Development"],
  ["Node.js and Express.js", "Web Development"],
  ["Spring Boot Development", "Web Development"],
  ["Git and GitHub", "Developer Tools"],
  ["Software Engineering", "Computer Science"],
  ["Operating Systems", "Computer Science"],
  ["Computer Networks", "Computer Science"],
  ["Cybersecurity Fundamentals", "Cybersecurity"],
  ["Cloud Computing", "Cloud"],
  ["AWS Cloud Essentials", "Cloud"],
  ["DevOps Fundamentals", "DevOps"],
  ["Artificial Intelligence", "AI and ML"],
  ["Machine Learning", "AI and ML"],
  ["Generative AI Fundamentals", "AI and ML"],
  ["Data Science", "Data Science"],
  ["Data Analytics with Python", "Data Science"],
  ["Power BI Essentials", "Data Analytics"],
  ["UI/UX Design", "Design"],
  ["Figma Design Fundamentals", "Design"],
  ["Software Testing", "Software Testing"],
  ["Agile and Scrum", "Project Management"],
];

const videoIds = [
  "eIrMbAQSU34",
  "rfscVS0vtbw",
  "W6NZfCO5SIk",
];

const quizQuestions = [
  {
    question: "What is the best way to learn a new technical skill?",
    options: [
      "Practice concepts with relevant exercises",
      "Skip all lessons",
      "Memorize titles only",
      "Avoid practical examples",
    ],
    answer: 0,
  },
  {
    question: "What should you do when you make a mistake while learning?",
    options: [
      "Stop learning",
      "Review the mistake and try again",
      "Ignore the mistake",
      "Skip every difficult topic",
    ],
    answer: 1,
  },
  {
    question: "What helps demonstrate your learning progress?",
    options: [
      "Opening the course only",
      "Changing the course title",
      "Completing lessons and passing assessments",
      "Skipping the course content",
    ],
    answer: 2,
  },
];

const courses = courseNames.map(([title, category], index) => ({
  id: index + 1,
  title,
  category,
  description: `Learn ${title} through structured lessons, practice, and assessment.`,
  lessons: courseTopics[index % courseTopics.length].map(
    (topic, lessonIndex) => ({
      id: `${index + 1}-${lessonIndex + 1}`,
      title: `${lessonIndex + 1}. ${topic}`,
      video: videoIds[lessonIndex],
    })
  ),
  questions: quizQuestions,
}));

const categories = [
  "All",
  ...new Set(courses.map((course) => course.category)),
];

function App() {
  const [user, setUser] = useState(() =>
    localStorage.getItem("learnhub-user") || ""
  );
  const [nameInput, setNameInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [passedCourses, setPassedCourses] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [certificateCourse, setCertificateCourse] = useState(null);
  const [quizMessage, setQuizMessage] = useState("");

  function login(event) {
    event.preventDefault();

    const cleanName = nameInput.trim();
    if (!cleanName) return;

    localStorage.setItem("learnhub-user", cleanName);
    setUser(cleanName);
  }

  function logout() {
    localStorage.removeItem("learnhub-user");
    setUser("");
    setSelectedCourse(null);
    setShowQuiz(false);
    setCertificateCourse(null);
  }

  function openCourse(course) {
    setSelectedCourse(course);
    setShowQuiz(false);
    setCertificateCourse(null);
    setQuizMessage("");
  }

  function isLessonComplete(courseId, lessonId) {
    return Boolean(completedLessons[`${courseId}-${lessonId}`]);
  }

  function markLessonComplete(course, lesson) {
    setCompletedLessons((previous) => ({
      ...previous,
      [`${course.id}-${lesson.id}`]: true,
    }));
  }

  function getProgress(course) {
    const completed = course.lessons.filter((lesson) =>
      isLessonComplete(course.id, lesson.id)
    ).length;

    return Math.round((completed / course.lessons.length) * 100);
  }

  function submitQuiz(event) {
    event.preventDefault();

    const answers = quizAnswers[selectedCourse.id] || {};

    if (selectedCourse.questions.some(
      (_, index) => answers[index] === undefined
    )) {
      setQuizMessage("Please answer all questions before submitting.");
      return;
    }

    const score = selectedCourse.questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

    const percentage = Math.round(
      (score / selectedCourse.questions.length) * 100
    );

    if (percentage >= 70) {
      setPassedCourses((previous) => ({
        ...previous,
        [selectedCourse.id]: true,
      }));
      setQuizMessage(`Congratulations! You scored ${percentage}% and passed.`);
    } else {
      setQuizMessage(
        `You scored ${percentage}%. You need at least 70% to pass. Try again!`
      );
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  const completedCourseCount = courses.filter(
    (course) => passedCourses[course.id]
  ).length;

  if (!user) {
    return (
      <main className="auth-screen">
        <section className="auth-welcome">
          <div className="brand brand-large">
            <span className="brand-icon">L</span>
            LearnHub
          </div>

          <p className="eyebrow">YOUR LEARNING JOURNEY STARTS HERE</p>
          <h1>Learn new skills. Build your future.</h1>
          <p className="muted">
            Explore programming, web development, AI, cloud computing,
            data science, and more.
          </p>

          <div className="auth-stats">
            <div>
              <strong>30</strong>
              <span>Courses</span>
            </div>
            <div>
              <strong>10+</strong>
              <span>Categories</span>
            </div>
            <div>
              <strong>1</strong>
              <span>Goal: Grow</span>
            </div>
          </div>
        </section>

        <form className="auth-card" onSubmit={login}>
          <span className="eyebrow">WELCOME TO LEARNHUB</span>
          <h2>Start learning today</h2>
          <p className="muted">
            Enter your name to open your learning dashboard.
          </p>

          <label htmlFor="learner-name">Your name</label>
          <input
            id="learner-name"
            className="search-input"
            placeholder="Enter your name"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            required
          />

          <button className="primary-button full-button" type="submit">
            Enter LearnHub →
          </button>

          <p className="auth-note">
            Demo sign-in only. This is not a secure account system.
          </p>
        </form>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <button
          className="brand brand-button"
          onClick={() => {
            setSelectedCourse(null);
            setShowQuiz(false);
            setCertificateCourse(null);
          }}
        >
          <span className="brand-icon">L</span>
          LearnHub
        </button>

        <div className="user-controls">
          <span className="welcome-user">Hi, {user} 👋</span>
          <button className="outline-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="main-content">
        {certificateCourse ? (
          <section className="certificate-page">
            <div className="certificate no-print">
              <span className="eyebrow">LEARNHUB ACHIEVEMENT</span>
              <h1>Certificate of Completion</h1>
              <p>This certificate is presented to</p>
              <h2>{user}</h2>
              <p>for completing the course</p>
              <h3>{certificateCourse.title}</h3>
              <p>Congratulations on your learning achievement!</p>
              <p className="certificate-date">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="certificate-actions no-print">
              <button
                className="primary-button"
                onClick={() => window.print()}
              >
                Print / Save as PDF
              </button>
              <button
                className="outline-button"
                onClick={() => setCertificateCourse(null)}
              >
                Back to course
              </button>
            </div>
          </section>
        ) : selectedCourse ? (
          <section className="learning-page">
            <button
              className="text-button"
              onClick={() => {
                setSelectedCourse(null);
                setShowQuiz(false);
                setQuizMessage("");
              }}
            >
              ← Back to courses
            </button>

            <div className="course-heading">
              <div>
                <span className="eyebrow">{selectedCourse.category}</span>
                <h1>{selectedCourse.title}</h1>
                <p className="muted">{selectedCourse.description}</p>
              </div>
              <div className="progress-card">
                <span className="progress-label">Course progress</span>
                <strong>{getProgress(selectedCourse)}%</strong>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${getProgress(selectedCourse)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="panel">
              <h2>Course lessons</h2>
              <p className="muted">
                Complete all three demo lessons to unlock the quiz.
              </p>

              {selectedCourse.lessons.map((lesson) => {
                const completed = isLessonComplete(
                  selectedCourse.id,
                  lesson.id
                );

                return (
                  <article className="lesson-row" key={lesson.id}>
                    <div className="lesson-number">
                      {completed ? "✓" : lesson.id.split("-")[1]}
                    </div>
                    <div className="lesson-info">
                      <strong>{lesson.title}</strong>
                      <span className="muted">
                        {completed ? "Completed" : "Demo lesson"}
                      </span>
                    </div>
                    <div className="lesson-actions">
                      <a
                        className="small-button"
                        href={`https://www.youtube.com/watch?v=${lesson.video}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch video ↗
                      </a>
                      <button
                        className={completed ? "outline-button" : "primary-button"}
                        disabled={completed}
                        onClick={() =>
                          markLessonComplete(selectedCourse, lesson)
                        }
                      >
                        {completed ? "Completed" : "Mark complete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {getProgress(selectedCourse) === 100 && (
              <div className="panel quiz-panel">
                <h2>Course assessment</h2>

                {passedCourses[selectedCourse.id] ? (
                  <>
                    <p className="success-message">
                      You passed this course's demo assessment!
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => setCertificateCourse(selectedCourse)}
                    >
                      View certificate
                    </button>
                  </>
                ) : (
                  <>
                    <p className="muted">
                      Answer all questions. You need at least 70% to pass.
                    </p>

                    {!showQuiz ? (
                      <button
                        className="primary-button"
                        onClick={() => {
                          setShowQuiz(true);
                          setQuizMessage("");
                        }}
                      >
                        Start quiz →
                      </button>
                    ) : (
                      <form onSubmit={submitQuiz}>
                        {selectedCourse.questions.map((question, index) => (
                          <fieldset className="quiz-question" key={index}>
                            <legend>
                              {index + 1}. {question.question}
                            </legend>

                            {question.options.map((option, optionIndex) => (
                              <label
                                className="quiz-option"
                                key={optionIndex}
                              >
                                <input
                                  type="radio"
                                  name={`question-${selectedCourse.id}-${index}`}
                                  checked={
                                    quizAnswers[selectedCourse.id]?.[index] ===
                                    optionIndex
                                  }
                                  onChange={() => {
                                    setQuizAnswers((previous) => ({
                                      ...previous,
                                      [selectedCourse.id]: {
                                        ...previous[selectedCourse.id],
                                        [index]: optionIndex,
                                      },
                                    }));
                                    setQuizMessage("");
                                  }}
                                />
                                {option}
                              </label>
                            ))}
                          </fieldset>
                        ))}

                        {quizMessage && (
                          <p className="success-message">{quizMessage}</p>
                        )}

                        <button className="primary-button" type="submit">
                          Submit answers
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow">LEARN SOMETHING NEW EVERY DAY</span>
                <h1>Knowledge is your superpower.</h1>
                <p>
                  Discover skills, explore new topics, and keep moving
                  toward your goals.
                </p>

                <div className="hero-search">
                  <input
                    className="search-input"
                    placeholder="Search Java, Python, AI, React..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <button
                    className="primary-button"
                    onClick={() =>
                      document
                        .getElementById("course-catalog")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Explore courses
                  </button>
                </div>
              </div>
              <div className="hero-decoration" aria-hidden="true">
                <span>💡</span>
                <span>💻</span>
                <span>🚀</span>
              </div>
            </section>

            <section className="dashboard-stats">
              <article className="stat-card">
                <span>📚</span>
                <div>
                  <strong>{courses.length}</strong>
                  <p>Available courses</p>
                </div>
              </article>
              <article className="stat-card">
                <span>🎯</span>
                <div>
                  <strong>
                    {Object.values(completedLessons).filter(Boolean).length}
                  </strong>
                  <p>Lessons completed</p>
                </div>
              </article>
              <article className="stat-card">
                <span>🏆</span>
                <div>
                  <strong>{completedCourseCount}</strong>
                  <p>Courses passed</p>
                </div>
              </article>
            </section>

            <section className="course-section" id="course-catalog">
              <div className="section-title">
                <div>
                  <span className="eyebrow">FIND YOUR NEXT SKILL</span>
                  <h2>Explore all courses</h2>
                </div>
                <span className="course-count">
                  {filteredCourses.length} courses
                </span>
              </div>

              <div className="category-filters">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={
                      category === item
                        ? "category-chip active-chip"
                        : "category-chip"
                    }
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {filteredCourses.length > 0 ? (
                <div className="course-grid">
                  {filteredCourses.map((course, index) => {
                    const progress = getProgress(course);

                    return (
                      <article className="course-card" key={course.id}>
                        <div className={`course-art art-${(index % 6) + 1}`}>
                          <span className="course-art-icon">
                            {[
                              "💻",
                              "🐍",
                              "⚙️",
                              "🚀",
                              "🌐",
                              "🧠",
                            ][index % 6]}
                          </span>
                          <span className="course-art-number">
                            COURSE {String(course.id).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="course-card-content">
                          <span className="course-category">
                            {course.category}
                          </span>
                          <h3>{course.title}</h3>
                          <p className="muted">{course.description}</p>

                          <div className="course-meta">
                            <span>📖 3 demo lessons</span>
                            <span>📝 Quiz</span>
                          </div>

                          <div className="card-progress">
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span>{progress}%</span>
                          </div>

                          <button
                            className="primary-button full-button"
                            onClick={() => openCourse(course)}
                          >
                            {progress === 100
                              ? "Continue course →"
                              : "Start learning →"}
                          </button>

                          {passedCourses[course.id] && (
                            <button
                              className="text-button"
                              onClick={() => setCertificateCourse(course)}
                            >
                              View certificate
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <span>🔎</span>
                  <h3>No courses found</h3>
                  <p>Try another search or choose a different category.</p>
                  <button
                    className="outline-button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="brand">
          <span className="brand-icon">L</span>
          LearnHub
        </div>
        <p>Keep learning. Keep growing.</p>
        <span>© {new Date().getFullYear()} LearnHub Demo</span>
      </footer>
    </div>
  );
}

export default App;