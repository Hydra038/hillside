import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch enabled payment methods for public use (checkout)
export async function GET() {
    try {
        const paymentMethods = await prisma.paymentSetting.findMany({
            where: {
                enabled: true
            },
            select: {
                id: true,
                type: true,
                displayName: true,
                description: true,
                config: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json(
            { error: 'Unable to load payment methods' },
            { status: 500 }
        );
    }
}