'use server';

import { getPocketBase, handlePocketBaseError } from './baseService';
import { Assignment, ListOptions, ListResult } from './types';

/**
 * Get a single assignment by ID
 */
export async function getAssignment(id: string): Promise<Assignment> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    return await pb.collection('assignments').getOne(id);
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.getAssignment');
  }
}

/**
 * Get assignments list with pagination
 */
export async function getAssignmentsList(options: ListOptions = {}): Promise<ListResult<Assignment>> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    const { page = 1, perPage = 30, ...rest } = options;
    return await pb.collection('assignments').getList(page, perPage, rest);
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.getAssignmentsList');
  }
}

/**
 * Get active assignments for an organization
 * Active assignments have startDate ≤ current date and no endDate or endDate ≥ current date
 */
export async function getActiveAssignments(organizationId: string): Promise<Assignment[]> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  const now = new Date().toISOString();

  try {
    return await pb.collection('assignments').getFullList({
      expand: 'equipment,assignedToUser,assignedToProject',
      filter: pb.filter(
        'organization = {:orgId} && startDate <= {:now} && (endDate = "" || endDate >= {:now})',
        { now, orgId: organizationId }
      ),
      sort: '-created',
    });
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.getActiveAssignments');
  }
}

/**
 * Get current assignment for a specific equipment
 */
export async function getCurrentEquipmentAssignment(equipmentId: string): Promise<Assignment | null> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  const now = new Date().toISOString();

  try {
    const assignments = await pb.collection('assignments').getList(1, 1, {
      expand: 'equipment,assignedToUser,assignedToProject',
      filter: pb.filter(
        'equipment = {:equipId} && startDate <= {:now} && (endDate = "" || endDate >= {:now})',
        { equipId: equipmentId, now }
      ),
      sort: '-created',
    });

    return assignments.items.length > 0 ? assignments.items[0] : null;
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.getCurrentEquipmentAssignment');
  }
}

/**
 * Get assignments for a user
 */
export async function getUserAssignments(userId: string): Promise<Assignment[]> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    return await pb.collection('assignments').getFullList({
      expand: 'equipment,assignedToProject',
      filter: `assignedToUser="${userId}"`,
      sort: '-created',
    });
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.getUserAssignments');
  }
}

/**
 * Get assignments for a project
 */
export async function getProjectAssignments(projectId: string): Promise<Assignment[]> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    return await pb.collection('assignments').getFullList({
      expand: 'equipment,assignedToUser',
      filter: `assignedToProject="${projectId}"`,
      sort: '-created',
    });
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.getProjectAssignments');
  }
}

/**
 * Create a new assignment
 */
export async function createAssignment(data: Partial<Assignment>): Promise<Assignment> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    return await pb.collection('assignments').create(data);
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.createAssignment');
  }
}

/**
 * Update an assignment
 */
export async function updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    return await pb.collection('assignments').update(id, data);
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.updateAssignment');
  }
}

/**
 * Delete an assignment
 */
export async function deleteAssignment(id: string): Promise<boolean> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    await pb.collection('assignments').delete(id);
    return true;
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.deleteAssignment');
  }
}

/**
 * Complete an assignment by setting its end date to now
 */
export async function completeAssignment(id: string): Promise<Assignment> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    return await pb.collection('assignments').update(id, {
      endDate: new Date().toISOString(),
    });
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.completeAssignment');
  }
}

/**
 * Get assignment history for an equipment
 */
export async function getEquipmentAssignmentHistory(equipmentId: string): Promise<Assignment[]> {
  const pb = await getPocketBase();
  if (!pb) {
    throw new Error('Failed to connect to PocketBase');
  }

  try {
    return await pb.collection('assignments').getFullList({
      expand: 'assignedToUser,assignedToProject',
      filter: `equipment=`${equipmentId}``,
      sort: '-startDate',
    });
  } catch (error) {
    return handlePocketBaseError(error, 'AssignmentService.getEquipmentAssignmentHistory');
  }
}