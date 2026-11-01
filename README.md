# AutoMark Desk

A coursework portal for one course. An instructor creates quizzes and projects, students submit, the app checks the work and applies a late penalty, and the instructor reviews and publishes the final result.

It runs in the browser only. There is no server and no database.

Built for the Saylani Vibe Engineering assignment "Build an AI-Powered Project Management System Using MCP, Skills, Jira, and GitHub". The app is the real-world project; the way it was built (Jira tasks, branches, pull requests, MCP, a review skill) is described in [Development workflow](#development-workflow).

## Features

- **Two assignment types.** Multiple-choice quizzes (questions, four options, correct answer, marks per question) and projects (a live link, a GitHub link and a rubric).
- **Automatic checking of quizzes.** Answers are matched against the stored correct answer. Capital letters and extra spaces do not matter. No AI is used for marking.
- **Late penalty.** 5% of the total marks per late day. One minute late counts as one day. Marks never go below zero.
- **Grades.** A 90% and above, B 80–89%, C 70–79%, D 60–69%, below that Fail.
- **Project marking.** A project has no marks until the instructor scores the rubric. Until then the result shows Pending, not 0, and it cannot be published.
- **Instructor review.** The instructor sees the automatic result, opens project links in a new tab, scores the rubric, writes feedback and publishes. A quiz mark can be overridden only with a written reason.
- **Status flow.** Checked → Reviewed → Final. A result is official only when it is Final. A student can resubmit before the due date; editing is blocked after the due date and after the result is Final.
- **Instructor dashboard.** Class statistics, review queue, grade distribution and results per assignment.
- **Student dashboard.** Deadlines (due soon, overdue), waiting for review, published results.
- **Safe storage.** Data is kept in the browser's `localStorage`. Broken or wrongly shaped saved data is ignored and the demo data is loaded instead of a white screen. If saving fails (storage full or blocked) a warning banner is shown.

## Run it

You need Node.js 22 or newer (developed on Node 24) and npm.

```bash
npm install
npm run dev
```

Open the address that Vite prints (usually http://localhost:5173).

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the app with hot reload |
| `npm run build` | Makes a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs all unit tests (Node's built-in test runner, no extra packages) |

## How to use it

1. On the welcome screen choose **Enter as student**. The demo student is "Demo Student". Change the name in the box on the right to act as another student; results are kept per name.
2. Open an open quiz (for example "Quiz 3 — JavaScript Basics"), answer and submit. The result shows as **Checked**.
3. Switch to **Instructor** at the top. Open the submission from the review queue, add feedback, click **Save review** (status **Reviewed**), then **Publish final result** (status **Final**).
4. Switch back to **Student** to see the result card with marks, penalty, percentage, grade and feedback.
5. Late example: "Quiz 2 — CSS Fundamentals" already has a submission that is late.
6. Project example: "Course Project — Personal Portfolio Website". As instructor, open the links, score the rubric, save and publish.
7. **Create new assignment** (instructor) makes a new quiz or project. A quiz is refused if its correct answer is not one of the four options.
8. **Reset demo data** (bottom of the page) restores the original demo assignments and submissions.

Demo content is a "CS-210 Web Development" course. Due dates are counted from today's date, so the demo always looks current.

## Tests

`npm test` runs **51 tests**.

| File | Tests | Covers |
|------|-------|--------|
| `tests/grading.test.js` | 4 | grade cut-offs, just below each cut-off, 0 and 100, Pending |
| `tests/latePenalty.test.js` | 10 | late days (on time, exactly due, 1 minute, 24 hours, 48 hours), broken dates, 5% per day |
| `tests/calculateResult.test.js` | 7 | fully correct, partly correct, 2 days late, penalty bigger than marks, Pending project |
| `tests/checkMCQ.test.js` | 16 | answer matching rules, missing correct answer, the option check used by the instructor form |
| `tests/storage.test.js` | 14 | nothing saved, round trip, corrupted JSON, six wrong shapes, blocked or full storage, no localStorage |

Expected numbers in the tests are worked out by hand (for example 5% of 20 marks × 2 days = 2 marks), not copied from the code's own output. The test log with the bugs found is in [docs/testing-log.md](docs/testing-log.md).

## Project structure

```
src/
  App.jsx               app state and the Checked / Reviewed / Final flow
  components/           reusable pieces (app bar, cards, forms, result card)
  views/                StudentDashboard, TeacherDashboard (instructor), ReviewSubmission
  utils/                all calculation logic (grading, late penalty, MCQ check, results)
  data/                 demo data and the localStorage wrapper
tests/                  unit tests (node:test)
docs/                   MCP setup, AI log, testing log, skill note
.claude/                review skill and two sub-agents used with Claude Code
```

## Development workflow

Every change followed the same loop:

**Jira task (AMD-n) → branch → commits starting with `AMD-n:` → pull request with the Jira key → PR link commented on the Jira task → review → merge.**

The AI coding agent (Claude Code in VS Code) read the Jira task through MCP, did the work on a branch, and commented the pull request link back on the task. Claude Code ran in manual mode, so it asked for permission before editing files, running commands and writing to Jira or GitHub. Merges were done by me on GitHub.

Two entries in the table were prepared outside Claude Code and then committed through this loop: the AMD-6 redesign (made in a separate Claude chat and committed from a branch) and these AMD-5 documents (drafted in the same chat). The agent read AMD-6 from Jira, built the project and opened its pull request. [docs/ai-log.md](docs/ai-log.md) says this task by task.

| Jira | Pull request | What changed |
|------|--------------|--------------|
| AMD-6 | #1 | University-portal redesign: welcome screen, student and instructor dashboards |
| AMD-4 | #2 | Review skill `assignment-review` and the `test-writer` and `pr-reviewer` sub-agents |
| AMD-1 | #3 | 21 unit tests for grading, late penalty and result calculation, and the `npm test` script |
| AMD-2 | #4 | Bug fix: answer matching in `checkMCQ`; the instructor form refuses a correct answer that is not an option |
| AMD-3 | #5 | Bug fix: broken or wrongly shaped saved data, blocked storage, visible warning when saving fails |
| AMD-5 | this PR | README and documentation |

Details:

- How Jira and GitHub are connected to the agent, and what does not work: [docs/mcp-setup.md](docs/mcp-setup.md)
- The reusable review skill and how it was used on a real pull request: [docs/skill.md](docs/skill.md)
- What the AI did on each task, and where its work was wrong: [docs/ai-log.md](docs/ai-log.md)
- Tests, bugs found, fixes and re-tests: [docs/testing-log.md](docs/testing-log.md)
- The steps of the recorded demo: [docs/mcp-demo-steps.md](docs/mcp-demo-steps.md)

## Security

- No token, password or key is in this repository. `.env` is in `.gitignore`.
- `.env.example` contains variable names only and is not read by the app.
- The credentials used for MCP (an Atlassian sign-in and a GitHub fine-grained token) are stored outside the repository, in Claude Code's own local settings. See [docs/mcp-setup.md](docs/mcp-setup.md).

## Known limitations

- **No real login.** The Student and Instructor switch is a toggle in one browser and both views share the same local data. The student name box is for the demo only.
- **Local data only.** Everything is in this browser's `localStorage`. Clearing site data erases it, and nothing is shared between browsers or devices.
- **No file upload.** Project submissions are links only. The app does not run a student's code.
- **Quizzes only are marked automatically.** Written answers are not marked by AI in this build.
- **Override marks are not capped.** The instructor's override field accepts any number from 0 upwards, not only up to the total marks.
- **The save-failed banner is not covered by a test that renders the page.** The tests check that `saveState` returns `false`; the banner itself was checked by the build only.
- **GitHub MCP could not merge.** The GitHub token used by the agent could create pull requests and comments, but its merge request was refused (HTTP 403), so merges were done on GitHub in the browser.
- **The `pr-reviewer` sub-agent cannot read pull request descriptions on its own.** Its tool list is limited, so the main agent read the PR for it. See [docs/skill.md](docs/skill.md).
