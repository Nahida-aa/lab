# Agent Configuration

This file contains skill mappings for AI coding agents working on this project.

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "Setting up file-based routing and route tree"
    load: "node_modules/@tanstack/router-plugin/skills/router-plugin/SKILL.md"
  - task: "Building server functions and API endpoints"
    load: "node_modules/@tanstack/start-client-core/skills/start-core/server-functions/SKILL.md"
  - task: "Protecting routes and implementing authentication"
    load: "node_modules/@tanstack/router-core/skills/router-core/auth-and-guards/SKILL.md"
  - task: "Optimizing routes with code splitting and lazy loading"
    load: "node_modules/@tanstack/router-core/skills/router-core/code-splitting/SKILL.md"
  - task: "Managing environment variables and secrets"
    load: "node_modules/dotenv/skills/dotenv/SKILL.md"
<!-- intent-skills:end -->

这个文件的作用是为了描述在这个项目中，可能遇到的一些常见错误和困惑。如果在项目中遇到任何奇怪的事情，请通知正在与你合作的开发人员，并在AgentMD文件中指出这一点

这个应用还没有用户，现在还没有真实数据，你可以随心所遇地修改，不用担心，把数据库schema全改了也没有关系