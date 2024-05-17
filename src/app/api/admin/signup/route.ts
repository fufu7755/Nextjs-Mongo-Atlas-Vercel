import { NextRequest, NextResponse } from 'next/server';
import {connect} from '@/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';

// 数据库连接
connect();

export const POST = async (request: NextRequest) => {
  try {

    // 获取请求体
    const req = await request.json();
    const { userName, password } = req;

    // 查询数据库 是否存在该用户
    const user = await User.findOne({ userName });

    // 如果存在该用户
    if (user) {
      return NextResponse.json({
        success: false,
        errorMessage: '用户名已存在',
      }, {status: 400});
    }

    // 密码加密
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    // 创建用户
    const newUser = new User({
      userName,
      password: hash,
    });

    // 保存用户
    const res = await newUser.save();
    // 返回响应
    return NextResponse.json({
      success: true,
      errorMessage: '注册成功',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      errorMessage: '注册失败',
    }, {status: 500});
  }
};
