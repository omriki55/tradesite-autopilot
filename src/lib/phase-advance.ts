import { PrismaClient } from '@prisma/client'

/**
 * Advance the project to the next phase if the current action
 * completes the given phase. Only advances forward, never backward.
 */
export async function advancePhase(
  prisma: PrismaClient,
  projectId: string,
  completedPhase: number
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { currentPhase: true, status: true },
  })

  if (!project) return

  // Advance if we're completing the current phase or catching up from out-of-order completion
  if (completedPhase >= project.currentPhase && completedPhase < 6) {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        currentPhase: completedPhase + 1,
        status: 'ACTIVE',
      },
    })
  } else if (completedPhase >= project.currentPhase && completedPhase === 6) {
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'COMPLETED' },
    })
  }

  // Also activate the project if it's still a draft
  if (project.status === 'DRAFT') {
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'ACTIVE' },
    })
  }
}
