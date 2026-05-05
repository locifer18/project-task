import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/client';

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const projectId = formData.get('projectId') as string;
    const paidAmount = Number(formData.get('paidAmount'));
    const remainingAmount = Number(formData.get('remainingAmount'));
    const totalBudget = Number(formData.get('totalBudget'));

    // Handle file uploads (you can implement file storage logic here)
    const latestInvoice = formData.get('latestInvoice') as File | null;
    const scopeTitle = formData.get('scopeTitle') as File | null;
    
    // Handle multiple payment history files
    const paymentHistoryFiles: File[] = [];
    let index = 0;
    while (formData.get(`paymentHistory_${index}`)) {
      paymentHistoryFiles.push(formData.get(`paymentHistory_${index}`) as File);
      index++;
    }

    // Update the projectInfo table (which client analytics reads from)
    const updatedProjectInfo = await db.projectInfo.updateMany({
      where: { projectId },
      data: {
        budget: totalBudget,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount
      }
    });

    // Also update the project table for consistency
    await db.project.update({
      where: { id: projectId },
      data: {
        projectInfo: {
          update: {
            budget: totalBudget
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Budget updated successfully',
      data: updatedProjectInfo
    });

  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        projectInfo: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    // Return budget data
    const budgetData = {
      scopeTitle: 'Project Scope Document', // You can store this in DB
      paidAmount: 0, // You can track this in a separate table
      remainingAmount: project.projectInfo?.budget || 0,
      totalBudget: project.projectInfo?.budget || 0,
      progress: Math.round(((project.projectInfo?.budget || 0) - (project.projectInfo?.budget || 0)) / (project.projectInfo?.budget || 1) * 100)
    };

    return NextResponse.json({ success: true, data: budgetData });

  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch budget data' },
      { status: 500 }
    );
  }
}