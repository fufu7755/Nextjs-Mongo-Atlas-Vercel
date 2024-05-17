import qiniu from 'qiniu';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  // 获取key
  const key = req.nextUrl.searchParams.get('key');

  const bucket = process.env.QINIU_BUCKET;
  const accessKey = process.env.QINIU_AK;
  const secretKey = process.env.QINIU_SK;

  // 创建鉴权对象
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: bucket + ':' + key,
    expires: 7200
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken=putPolicy.uploadToken(mac);
  return NextResponse.json({
    token: uploadToken,
  });
}