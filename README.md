# Team-task-Async-race

## CI/CD Rules

This project uses **GitHub Actions** to automate validation and deployment.

### Branch Naming
- Development is allowed only in:
  - `feature/<feature_name>`
  - `fix/<bug_name>`
- Direct pushes to `main` and `develop` are prohibited.

### Validations
Automated checks run on every push and Pull Request:
- **Lint** — `npm run lint`
- **Tests** — `npm run test`
- **Build** — `npm run build`

Pull Requests are blocked if any check fails or if the branch name does not follow the required convention.

### Preview Deployment
- Each Pull Request triggers an automatic **preview deployment**.
- The application is built and deployed to **Netlify**.
- A unique preview URL is generated for every PR update.

