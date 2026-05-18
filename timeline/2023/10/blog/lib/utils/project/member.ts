import type { ProjectMember } from "../../services/project/member.t";

export const isProjectMember = (projectMembers: ProjectMember[], userId: string) =>
  projectMembers.some(
    (member) => member.entityType === "user" && member.user?.id === userId,
  );
