import { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc, updateDoc, collection, query, where, getDocs, writeBatch, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId, action, includeChairs } = req.body;

    if (!clientId || !action) {
      return res.status(400).json({ 
        success: false, 
        error: 'Client ID and action are required' 
      });
    }

    if (!['delete', 'deactivate', 'suspend'].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action. Must be delete, deactivate, or suspend' 
      });
    }

    const clientRef = doc(db, 'users', clientId);

    // Check if client exists
    const clientDoc = await getDoc(clientRef);
    if (!clientDoc.exists()) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    if (action === 'delete') {
      // Get all chairs belonging to this client
      const chairsQuery = query(
        collection(db, 'chairs'),
        where('clientId', '==', clientId)
      );
      const chairsSnapshot = await getDocs(chairsQuery);

      // Check for active jobs
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('clientId', '==', clientId)
      );
      const jobsSnapshot = await getDocs(jobsQuery);

      // Check for service logs
      const serviceLogsQuery = query(
        collection(db, 'serviceLogs'),
        where('clientId', '==', clientId)
      );
      const serviceLogsSnapshot = await getDocs(serviceLogsQuery);

      if (!jobsSnapshot.empty || !serviceLogsSnapshot.empty) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete client with existing jobs or service history. Consider deactivating instead.'
        });
      }

      const batch = writeBatch(db);

      // Delete client
      batch.delete(clientRef);

      // Optionally delete or retire chairs
      if (includeChairs && !chairsSnapshot.empty) {
        chairsSnapshot.docs.forEach(chairDoc => {
          batch.update(chairDoc.ref, {
            status: 'Retired',
            isActive: false,
            retiredAt: new Date(),
            retiredReason: 'Client deleted',
            updatedAt: new Date()
          });
        });
      }

      await batch.commit();
      
      return res.status(200).json({
        success: true,
        message: `Client deleted successfully. ${includeChairs ? 'Associated chairs retired.' : 'Chairs remain active.'}`
      });
    } else if (action === 'deactivate') {
      // Set client status to inactive
      await updateDoc(clientRef, {
        isActive: false,
        status: 'inactive',
        deactivatedAt: new Date(),
        updatedAt: new Date()
      });

      // Optionally deactivate chairs
      if (includeChairs) {
        const chairsQuery = query(
          collection(db, 'chairs'),
          where('clientId', '==', clientId)
        );
        const chairsSnapshot = await getDocs(chairsQuery);

        const batch = writeBatch(db);
        chairsSnapshot.docs.forEach(chairDoc => {
          batch.update(chairDoc.ref, {
            status: 'Inactive',
            isActive: false,
            updatedAt: new Date()
          });
        });
        await batch.commit();
      }

      return res.status(200).json({
        success: true,
        message: `Client deactivated successfully. ${includeChairs ? 'Associated chairs deactivated.' : 'Chairs remain active.'}`
      });
    } else if (action === 'suspend') {
      // Set client status to suspended
      await updateDoc(clientRef, {
        isActive: false,
        status: 'suspended',
        suspendedAt: new Date(),
        updatedAt: new Date()
      });

      return res.status(200).json({
        success: true,
        message: 'Client suspended successfully'
      });
    }

  } catch (error) {
    console.error('Error managing client:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}