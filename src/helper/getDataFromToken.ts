import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function getDataFromToken(req: NextRequest) {
  try {
    // 获取token
    const token = req.cookies.get('token')?.value || '';
    // 解析token
    const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (decodedToken) {
      // 返回用户id
      return decodedToken.id
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}