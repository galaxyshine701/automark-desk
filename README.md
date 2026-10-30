# AutoMark Desk

A simple, local web app that combines assignment tracking with result management.

## The problem
In a school class, assignments are often shared on WhatsApp, submissions arrive as photos or links, and marks are totalled by hand. This app keeps one clear flow: create, submit, check, review, publish a final result.

## The workflow
1. **Teacher creates an assignment** — title, class, due date and time, type (MCQ / Fill-in, or Project / Website), total marks, and a fixed late rule.
   - MCQ: questions, options, correct answer, and marks per question.
   - Project: a rubric, for example Design 10, Functionality 10, Completeness 5.
2. **Student submits** — MCQ answers, or a live website link + GitHub repo link + note.
   - Editing is allowed before the due date only. After the due date, or after a result is Final, editing is blocked.
3. **System checks** — status moves from Submitted to Checked.
   - MCQ answers are matched exactly against the teacher's correct answers. No AI is used for marking.
   - Late days are counted from the due date. Penalty: 5% of total marks per late day.
   - The system calculates raw marks, penalty, obtained marks, percentage, and grade.
   - Grades: A 90% and above, B 80–89%, C 70–79%, D 60–69%, below that Fail.
   - Project work has no marks until the teacher scores the rubric, so its result shows as Pending until then.
4. **Teacher reviews** — status becomes Reviewed.
   - The teacher sees the auto result, opens project links in a new tab, scores the rubric for project work, adds feedback, and may override MCQ marks only with a written reason.
5. **Teacher publishes** — status becomes Final / Graded, and the student sees a result card with marks, total, percentage, grade, late days, penalty, status, and feedback.

Status flow: Submitted → Checked → Reviewed → Final / Graded.

## Run it locally
```bash
npm install
npm run dev
```
Then open the address shown by Vite (usually http://localhost:5173).

To make a production build:
```bash
npm run build
```

## Demo steps
1. Start on Student view. The demo student is already filled in.
2. Open "English Grammar — Tenses" and submit answers. The result shows as Checked.
3. Switch to Teacher view, open that submission, add feedback, and publish it. It becomes Final.
4. Switch back to Student view to see the final result card.
5. Try the late example: "English Grammar — Late Example (for testing)" already has a Checked submission that is 2 days late.
6. Try the project example: "My First Website — Project". In Teacher view, open its links in a new tab, score the rubric, save the review, then publish.
7. Use "Reset demo data" at the top to restore the original demo assignments and submissions.

## Data and limitations — please read this before judging the demo
- Data is stored only in this browser's localStorage. There is no server or database.
- **There is no real login.** Teacher view and Student view are a toggle in the same browser and share the same local data. Do not present this as multi-user login.
- There is no file upload. Project submissions are links only.
- Written answers are not auto-marked by AI in this build. That is future work, not a hidden feature.
- Project links are opened in a new tab only. The app does not run a student's code inside itself.
- No secrets, tokens, passwords, or personal data are in this code. `.env.example` contains names only. Any real GitHub or Jira token used later for MCP work must stay in a local `.env` file that is in `.gitignore`, never in the repo.

## Still to do for the full assignment (not part of this local build)
- Jira project with at least five tasks, each linked to GitHub commits / pull requests.
- GitHub repository, branches, and pull requests for those tasks.
- MCP demonstration connecting Jira and GitHub.
- Reusable skill applied to a real pull request (a draft checklist is in `skills/assignment-review-skill.md`).
- A manual testing log with a real bug found during testing, fixed, and re-tested.
- A short screen-recording demo.

## Project structure
See the approved structure: `src/` holds the app, `src/utils/` holds all calculation logic, `src/components/` holds reusable pieces, and `src/views/` holds the Teacher, Student, and Review screens.
