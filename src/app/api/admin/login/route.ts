import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 数据库连接
connect();

export const POST = async (request: NextRequest) => {
  try {
    // 获取请求体
    const req = await request.json();
    const { userName, password } = req;

    // 查询数据库 是否存在该用户
    const user = await User.findOne({ userName });

    // 如果不存在该用户
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: '用户名不存在',
        },
        { status: 400 }
      );
    }

    // 密码比对
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: '登陆失败',
        },
        { status: 400 }
      ); 
    }
    const tokenData = {
      id: user._id,
      userName: user.userName,
    }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {expiresIn: '1d'});

    const response = NextResponse.json(
      {
        success: true,
        errorMessage: '登陆成功',
      }
    );

    response.cookies.set('token', token, {httpOnly: true});

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        errorMessage: '登陆失败',
      },
      { status: 500 }
    );
  }
};
