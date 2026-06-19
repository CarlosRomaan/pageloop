import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  createWidgetPublicKey,
  createWidgetSecretKey,
} from "../lib/project-keys";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const main = async () => {
  console.log("Seeding database...");

  await prisma.activityLog.deleteMany();
  await prisma.commentStatusHistory.deleteMany();
  await prisma.commentReply.deleteMany();
  await prisma.commentPosition.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.page.deleteMany();
  await prisma.projectDomain.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.invite.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  const owner = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah@pageloop.app",
      image: null,
    },
  });

  const designer = await prisma.user.create({
    data: {
      name: "Emily Chen",
      email: "emily@pageloop.app",
      image: null,
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "Mark Davis",
      email: "mark@client.com",
      image: null,
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Acme Agency",
      slug: "acme-agency",
    },
  });

  await prisma.workspaceMember.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: owner.id,
        role: "OWNER",
      },
      {
        workspaceId: workspace.id,
        userId: designer.id,
        role: "MEMBER",
      },
    ],
  });

  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: "Acme Website Redesign",
      slug: "acme-website-redesign",
      description: "Website review project for Acme's new marketing site.",
      widgetPublicKey: createWidgetPublicKey(),
      widgetSecretKey: createWidgetSecretKey(),
      setupCompletedAt: new Date(),
      lastWidgetPingAt: new Date(),
    },
  });

  await prisma.projectMember.createMany({
    data: [
      {
        projectId: project.id,
        userId: owner.id,
        role: "ADMIN",
      },
      {
        projectId: project.id,
        userId: designer.id,
        role: "MEMBER",
      },
      {
        projectId: project.id,
        userId: client.id,
        role: "CLIENT",
      },
    ],
  });

  await prisma.projectDomain.createMany({
    data: [
      {
        projectId: project.id,
        domain: "acme.com",
        isVerified: true,
        lastDetectedAt: new Date(),
      },
      {
        projectId: project.id,
        domain: "www.acme.com",
        isVerified: true,
        lastDetectedAt: new Date(),
      },
    ],
  });

  const homepage = await prisma.page.create({
    data: {
      projectId: project.id,
      url: "https://acme.com",
      path: "/",
      title: "Homepage",
      source: "WIDGET",
      lastSeenAt: new Date(),
    },
  });

  const pricing = await prisma.page.create({
    data: {
      projectId: project.id,
      url: "https://acme.com/pricing",
      path: "/pricing",
      title: "Pricing",
      source: "WIDGET",
      lastSeenAt: new Date(),
    },
  });

  const contact = await prisma.page.create({
    data: {
      projectId: project.id,
      url: "https://acme.com/contact",
      path: "/contact",
      title: "Contact",
      source: "WIDGET",
      lastSeenAt: new Date(),
    },
  });

  const commentOne = await prisma.comment.create({
    data: {
      projectId: project.id,
      pageId: homepage.id,
      authorId: client.id,
      assigneeId: null,
      number: 1,
      message: "Move the main CTA button higher on the hero section.",
      status: "OPEN",
      visibility: "PUBLIC",
      position: {
        create: {
          x: 620,
          y: 340,
          viewportWidth: 1440,
          viewportHeight: 900,
          scrollX: 0,
          scrollY: 0,
          cssSelector: "#hero .cta-button",
          domPath: "html > body > main > section#hero > a.cta-button",
          elementText: "Get Started",
          elementTag: "a",
        },
      },
    },
  });

  const commentTwo = await prisma.comment.create({
    data: {
      projectId: project.id,
      pageId: homepage.id,
      authorId: client.id,
      assigneeId: designer.id,
      number: 2,
      message: "The headline feels too small compared to the design mockup.",
      status: "IN_PROGRESS",
      visibility: "PUBLIC",
      position: {
        create: {
          x: 480,
          y: 220,
          viewportWidth: 1440,
          viewportHeight: 900,
          cssSelector: "#hero h1",
          elementText: "Launch faster with Acme",
          elementTag: "h1",
        },
      },
    },
  });

  const commentThree = await prisma.comment.create({
    data: {
      projectId: project.id,
      pageId: pricing.id,
      authorId: client.id,
      assigneeId: owner.id,
      number: 3,
      message: "Please review the spacing between pricing cards.",
      status: "IN_REVIEW",
      visibility: "PUBLIC",
      position: {
        create: {
          x: 760,
          y: 520,
          viewportWidth: 1440,
          viewportHeight: 900,
          cssSelector: ".pricing-grid",
          elementTag: "div",
        },
      },
    },
  });

  await prisma.comment.create({
    data: {
      projectId: project.id,
      pageId: contact.id,
      authorId: designer.id,
      assigneeId: null,
      number: 4,
      message: "Contact form alignment has been fixed.",
      status: "RESOLVED",
      visibility: "PUBLIC",
      resolvedAt: new Date(),
    },
  });

  await prisma.commentReply.createMany({
    data: [
      {
        commentId: commentOne.id,
        authorId: owner.id,
        message: "Got it. We will adjust the CTA placement.",
      },
      {
        commentId: commentTwo.id,
        authorId: designer.id,
        message: "I am updating the headline size now.",
      },
      {
        commentId: commentThree.id,
        authorId: owner.id,
        message: "Spacing was adjusted. Ready for review.",
      },
    ],
  });

  await prisma.activityLog.createMany({
    data: [
      {
        workspaceId: workspace.id,
        projectId: project.id,
        actorId: owner.id,
        type: "PROJECT_CREATED",
        message: "Created Acme Website Redesign.",
      },
      {
        workspaceId: workspace.id,
        projectId: project.id,
        actorId: client.id,
        type: "COMMENT_CREATED",
        message: "Mark Davis created comment #1.",
      },
      {
        workspaceId: workspace.id,
        projectId: project.id,
        actorId: designer.id,
        type: "COMMENT_ASSIGNED",
        message: "Comment #2 was assigned to Emily Chen.",
      },
      {
        workspaceId: workspace.id,
        projectId: project.id,
        actorId: owner.id,
        type: "COMMENT_STATUS_CHANGED",
        message: "Comment #3 was moved to In Review.",
      },
    ],
  });

  console.log("Seed completed.");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });