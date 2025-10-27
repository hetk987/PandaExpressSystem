import { NextRequest, NextResponse } from 'next/server';
import { getRoles, createRole } from '@/app/services/roleService';

export async function GET() {
    try {
        const roles = await getRoles();
        return NextResponse.json(roles, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for roles
        if (!body.name || body.canDiscount === undefined ||
            body.canRestock === undefined || body.canEditEmployees === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: name, canDiscount, canRestock, canEditEmployees' },
                { status: 400 }
            );
        }

        const newRole = await createRole(body);
        return NextResponse.json(newRole, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
    }
}

