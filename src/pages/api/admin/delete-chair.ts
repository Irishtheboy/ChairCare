import { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chairId, action } = req.body;

    if (!chairId || !action) {
      return res.status(400).json({ 
        success: false, 
        error: 'Chair ID and action are required' 
      });
    }

    if (!['delete', 'deactivate', 'retire'].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action. Must be delete, deactivate, or retire' 
      });
    }

    const chairRef = doc(db, 'chairs', chairId);

    if (action === 'delete') {
      // Check if chair has active service logs or jobs
      const serviceLogsQuery = query(
        collection(db, 'serviceLogs'),
        where('chairId', '==', chairId)
      );
      const serviceLogsSnapshot = await getDocs(serviceLogsQuery);

      const jobsQuery = query(
        collection(db, 'jobs'),
        where('chairs', 'array-contains', chairId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);

      if (!serviceLogsSnapshot.empty || !jobsSnapshot.empty) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete chair with existing service history or active jobs. Consider retiring instead.'
        });
      }

      // Delete the chair
      await deleteDoc(chairRef);
      
      return res.status(200).json({
        success: true,
        message: 'Chair deleted successfully'
      });
    } else if (action === 'deactivate') {
      // Set chair status to inactive
      await updateDoc(chairRef, {
        status: 'Inactive',
        isActive: false,
        updatedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Chair deactivated successfully'
      });
    } else if (action === 'retire') {
      // Set chair status to retired
      await updateDoc(chairRef, {
        status: 'Retired',
        isActive: false,
        retiredAt: new Date(),
        updatedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Chair retired successfully'
      });
    }

  } catch (error) {
    console.error('Error managing chair:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}