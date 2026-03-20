import { relations } from "drizzle-orm/relations"

// import { home, identity } from "./schema/user";
// import {
// 	// linkGroupFollow, 
// 	linkGroupProj, linkGroupResource,
// 	// linkUserFollow, 
// 	linkUserProj, linkUserResource
// } from "./schema/link";
// import { group_table } from "./schema/group";
// import { proj_table } from "./schema/proj";
// import { resource } from "./schema/resource";
import { account, invitation, member, organization, session, user } from "@/modules/auth/schema/tables";


export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	members: many(member),
	invitations: many(invitation),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
}));




// export const linkGroupProjRelations = relations(linkGroupProj, ({ one }) => ({
// 	proj: one(proj_table, {
// 		fields: [linkGroupProj.proj_id],
// 		references: [proj_table.id]
// 	}),
// 	group: one(group_table, {
// 		fields: [linkGroupProj.group_id],
// 		references: [group_table.id]
// 	}),
// }));

// export const projRelations = relations(proj_table, ({ many }) => ({
// 	linkGroupProjs: many(linkGroupProj),
// 	linkUserProjs: many(linkUserProj),
// }));

// export const linkGroupResourceRelations = relations(linkGroupResource, ({ one }) => ({
// 	resource: one(resource, {
// 		fields: [linkGroupResource.resource_id],
// 		references: [resource.id]
// 	}),
// 	group: one(group_table, {
// 		fields: [linkGroupResource.group_id],
// 		references: [group_table.id]
// 	}),
// }));

// export const resourceRelations = relations(resource, ({ many }) => ({
// 	linkGroupResources: many(linkGroupResource),
// 	linkUserResources: many(linkUserResource),
// }));

// export const linkUserProjRelations = relations(linkUserProj, ({ one }) => ({
// 	proj: one(proj_table, {
// 		fields: [linkUserProj.proj_id],
// 		references: [proj_table.id]
// 	}),
// 	user: one(user, {
// 		fields: [linkUserProj.user_id],
// 		references: [user.id]
// 	}),
// }));

// export const linkUserResourceRelations = relations(linkUserResource, ({ one }) => ({
// 	resource: one(resource, {
// 		fields: [linkUserResource.resource_id],
// 		references: [resource.id]
// 	}),
// 	user: one(user, {
// 		fields: [linkUserResource.user_id],
// 		references: [user.id]
// 	}),
// }));



// export const linkGroupIdentityRelations = relations(linkGroupIdentity, ({ one }) => ({
// 	identity: one(identity, {
// 		fields: [linkGroupIdentity.identity_id],
// 		references: [identity.id]
// 	}),
// 	group: one(group_table, {
// 		fields: [linkGroupIdentity.group_id],
// 		references: [group_table.id]
// 	}),
// }));

// export const identityRelations = relations(identity, ({ many }) => ({
// 	linkGroupIdentities: many(linkGroupIdentity),
// 	linkUserIdentities: many(linkUserIdentity),
// }));

// export const linkUserIdentityRelations = relations(linkUserIdentity, ({ one }) => ({
// 	identity: one(identity, {
// 		fields: [linkUserIdentity.identity_id],
// 		references: [identity.id]
// 	}),
// 	user: one(user, {
// 		fields: [linkUserIdentity.user_id],
// 		references: [user.id]
// 	}),
// }));