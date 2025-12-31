import { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, deleteUser as deleteAuthUser } from 'firebase/auth';
import { db } from 'lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, action } = req.body;

    if (!userId || !action) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and action are required' 
      });
    }

    if (!['delete', 'deactivate', 'suspend'].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action. Must be delete, deactivate, or suspend' 
      });
    }

    const userRef = doc(db, 'users', userId);

    if (action === 'delete') {
      // Check if user has active jobs, service logs, or other dependencies
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('assignedTechnicianId', '==', userId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);

      const serviceLogsQuery = query(
        collection(db, 'serviceLogs'),
        where('technicianId', '==', userId)
      );
      const serviceLogsSnapshot = await getDocs(serviceLogsQuery);

      const chairsQuery = query(
        collection(db, 'chairs'),
        where('clientId', '==', userId)
      );
      const chairsSnapshot = await getDocs(chairsQuery);

      if (!jobsSnapshot.empty || !serviceLogsSnapshot.empty || !chairsSnapshot.empty) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete user with existing jobs, service history, or chairs. Consider deactivating instead.'
        });
      }

      // Delete from Firestore
      await deleteDoc(userRef);
      
      // Note: Deleting from Firebase Auth requires admin SDK server-side
      // For now, we'll just delete from Firestore
      
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully from database. Auth account may need manual cleanup.'
      });
    } else if (action === 'deactivate') {
      // Set user status to inactive
      await updateDoc(userRef, {
        isActive: false,
        status: 'inactive',
        deactivatedAt: new Date(),
        updatedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'User deactivated successfully'
      });
    } else if (action === 'suspend') {
      // Set user status to suspended
      await updateDoc(userRef, {
        isActive: false,
        status: 'suspended',
        suspendedAt: new Date(),
        updatedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'User suspended successfully'
      });
    }

  } catch (error) {
    console.error('Error managing user:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}