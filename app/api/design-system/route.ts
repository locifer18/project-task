import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      projectId, 
      brandName, 
      colors, 
      fonts, 
      designType, 
      layoutStyle, 
      contentTone, 
      visualGuidelines, 
      theme, 
      brandFeel, 
      keyPages, 
      uniqueness 
    } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const designSystem = await db.designSystem.upsert({
      where: { projectId },
      update: {
        brandName: brandName || 'Brand Name',
        colors: colors || ['#FF6B6B', '#4ECDC4', '#A300F4'],
        fonts: fonts || {},
        designType: designType || ['Minimalist', 'Simple'],
        layoutStyle: layoutStyle || {},
        contentTone: contentTone || ['Formal', 'Friendly'],
        visualGuidelines: visualGuidelines || {},
        theme: theme || ['Modern'],
        brandFeel: brandFeel || 'Professional, Premium',
        keyPages: keyPages || ['Home', 'About'],
        uniqueness: uniqueness || {}
      },
      create: {
        projectId,
        brandName: brandName || 'Brand Name',
        colors: colors || ['#FF6B6B', '#4ECDC4', '#A300F4'],
        fonts: fonts || {},
        designType: designType || ['Minimalist', 'Simple'],
        layoutStyle: layoutStyle || {},
        contentTone: contentTone || ['Formal', 'Friendly'],
        visualGuidelines: visualGuidelines || {},
        theme: theme || ['Modern'],
        brandFeel: brandFeel || 'Professional, Premium',
        keyPages: keyPages || ['Home', 'About'],
        uniqueness: uniqueness || {}
      }
    });

    return NextResponse.json({
      success: true,
      data: designSystem
    });

  } catch (error) {
    console.error('Error managing design system:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const designSystem = await db.designSystem.findUnique({
      where: { projectId }
    });

    return NextResponse.json({
      success: true,
      data: designSystem
    });

  } catch (error) {
    console.error('Error fetching design system:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}