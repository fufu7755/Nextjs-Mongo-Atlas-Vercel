import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const response = NextResponse.json({
      success: true,
      errorMessage: '退出',
    });

    response.cookies.set('token', '', {httpOnly: true, expires: new Date(0)});
    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      errorMessage: error,
    }, {status: 500});
  }
};
