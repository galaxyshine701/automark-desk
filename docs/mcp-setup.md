# MCP setup: Claude Code with Jira and GitHub

Claude Code (the AI coding agent in VS Code) is connected to two MCP servers. This page says how, what it was used for, and what did not work. It contains no secrets.

## What is connected

| Name | Server | How it signs in |
|------|--------|-----------------|
| `atlassian` | Atlassian Rovo MCP server, `https://mcp.atlassian.com/v2/mcp` | OAuth in the browser. No token is typed anywhere. |
| `github` | GitHub remote MCP server, `https://api.githubcopilot.com/mcp/` | A fine-grained personal access token sent as an `Authorization` header |

In Claude Code, `/mcp` lists both as connected (`atlassian` 26 tools, `github` 47 tools in this setup).

## Setup steps

Run these in a terminal inside the project folder, then start `claude`.

**1. Jira (Atlassian)**

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp
```

In Claude Code type `/mcp`, choose `atlassian`, then **Authenticate**. A browser opens; sign in to the Atlassian site and approve access. Nothing is saved in the repository.

**2. GitHub**

Create a fine-grained token on GitHub (Settings → Developer settings → Personal access tokens → Fine-grained tokens):

- Repository access: **only** this repository (`automark-desk`).
- Permissions: Contents (read and write), Pull requests (read and write), Metadata (read).
- Short expiry.

Then add the server. `<YOUR_TOKEN>` is a placeholder; paste the real token only in your own terminal and never in a file, a chat or a commit:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer <YOUR_TOKEN>"
```

The command stores the token in Claude Code's local settings on your computer (`.claude.json` in your user folder), outside this repository.

**3. Check**

In Claude Code, `/mcp` should show `atlassian` and `github` as connected. A first test: ask the agent to read one Jira task and summarise it.

## What the agent did through MCP

| Server | Operations used |
|--------|-----------------|
| Jira | Read a task, add a comment with the pull request link, move a task to Done |
| GitHub | Read a pull request, create a pull request, comment on a pull request |

Each task followed the loop in the README: Jira task → branch → commits with the key → pull request → link commented on Jira.

## Rules followed

- Claude Code ran in **manual mode**: it asked for permission before editing files, running commands and writing to Jira or GitHub.
- The agent's prompts said not to merge. The one time it was asked to merge (PR #4) GitHub refused, and every pull request was merged by a person on GitHub.
- `.env` is in `.gitignore`; `.env.example` holds names only and is not read by the app.
- The GitHub token is limited to one repository. It should be revoked when the work is finished.

## Limitations and problems met

- **Merge through GitHub MCP was refused.** The same token created pull requests and comments, but "merge pull request" returned HTTP 403 ("Resource not accessible by personal access token"), also on a retry. Merges were done in the browser. The cause was not found. The agent suggested a token with Pull requests and Contents read and write access, and a restart of the GitHub MCP server after changing the token.
- **Sub-agent tool list.** The `pr-reviewer` sub-agent lists only `Read, Grep, Glob, Bash`, so it has no GitHub tools. It could not read a pull request description; the main agent read it and reported that. Removing the `tools:` line would let the sub-agent inherit the MCP tools.
- **Wrong login type.** Claude Code first reported "Credit balance is too low" because it was signed in with a Console API key. `/logout`, then `/login` with the Claude subscription fixed it.
- **Atlassian sign-in lost after logging in again.** `/mcp` → `atlassian` → **Authenticate** connects it again.
- **Typing `/mcp` can select a different command** from the suggestion list (for example a GitHub tool). Clear the line and type it again.
- The Jira site, project key (`AMD`) and repository are specific to this project. Another project needs its own sign-in and token.
