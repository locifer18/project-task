import { notifyAdminNewProject } from './notification-service';
import { sendBulkAdminEmails } from './mailer';

export async function handleLeaveRequestNotification(leaveData: {
  empName: string;
  empId: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveRequestId: string;
}) {
  try {
    // Send notifications
    await notifyAdminLeaveRequest(leaveData);
    
    // Send emails
    await sendBulkAdminEmails('leave', {
      empName: leaveData.empName,
      empId: leaveData.empId,
      department: leaveData.department,
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      reason: leaveData.reason,
    });
  } catch (error) {
    console.error('Failed to send leave request notifications:', error);
  }
}

export async function handlePaymentAcceptedNotification(paymentData: {
  clientName: string;
  projectName: string;
  amount: string;
  paymentRequestId: string;
}) {
  try {
    // Send notifications
    await notifyAdminPaymentAccepted(paymentData);
    
    // Send emails
    await sendBulkAdminEmails('payment_accepted', {
      clientName: paymentData.clientName,
      projectName: paymentData.projectName,
      amount: paymentData.amount,
    });
  } catch (error) {
    console.error('Failed to send payment accepted notifications:', error);
  }
}

export async function handlePaymentQueryNotification(queryData: {
  clientName: string;
  projectName: string;
  amount: string;
  querySubject: string;
  paymentRequestId: string;
}) {
  try {
    // Send notifications
    await notifyAdminPaymentQuery(queryData);
    
    // Send emails
    await sendBulkAdminEmails('payment_query', {
      clientName: queryData.clientName,
      projectName: queryData.projectName,
      amount: queryData.amount,
      querySubject: queryData.querySubject,
    });
  } catch (error) {
    console.error('Failed to send payment query notifications:', error);
  }
}

export async function handleNewProjectNotification(projectData: {
  projectName: string;
  clientName?: string;
  budget: number;
  projectType: string;
  projectId: string;
  memberIds?: string[];
}) {
  try {
    // Send notifications
    await notifyAdminNewProject(projectData);
    
    // Send emails
    await sendBulkAdminEmails('project', {
      projectName: projectData.projectName,
      clientName: projectData.clientName,
      budget: projectData.budget,
      projectType: projectData.projectType,
    });
  } catch (error) {
    console.error('Failed to send new project notifications:', error);
  }
}