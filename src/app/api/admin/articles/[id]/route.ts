import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/db';
import Article  from '@/models/article';

// 数据库连接
connect();

export const PUT = async (req: NextRequest, { params }: any) => {
  const { id } = params; // 路由中传递的参数
  const data = await req.json(); // 请求体中传递的数据
  await Article.findOneAndUpdate({_id: id}, data);
  return NextResponse.json({
    success: true,
    errorMessage: '修改成功',
  });
};

export const DELETE = async (req: NextRequest, { params }: any) => {
  const { id } = params;
  await Article.deleteOne({_id: id})
  return NextResponse.json({
    success: true,
    errorMessage: '删除成功',
  });
};
