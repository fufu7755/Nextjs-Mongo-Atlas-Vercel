import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { v4 as uuidv4 } from 'uuid';

// const getBase64 = (img: RcFile, callback: (url: string) => void) => {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result as string));
//   reader.readAsDataURL(img);
// };

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};



// 组件接受的属性
type Props = {
  imageUrl: string;
  setImageUrl: any;
};

const MyUpload = ({ imageUrl, setImageUrl }: Props) => {
  const [loading, setLoading] = useState(false);
  // const [imageUrl, setImageUrl] = useState<string>();
  const [uploadData, setUploadData] = useState<any>({key: '', token: ''});
  useEffect(() => {
    const key = uuidv4();
    fetch(`/api/admin/upload/token?key=${key}`)
      .then((res) => res.json())
      .then((res) => {
        setUploadData({
          key,
          token: res.token
        });
      });
  }, []);

  // 文件选择改变之后执行
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj as RcFile, (url) => {
      //   setLoading(false);
      //   setImageUrl(url);
      // });
      setImageUrl(uploadData.key);
      setLoading(false);
    }
  };

  const cdn = process.env.NEXT_PUBLIC_CDN;

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        name='file'
        listType='picture-card'
        className='avatar-uploader'
        showUploadList={false}
        action='https://upload.qiniup.com'
        data={uploadData}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={cdn + imageUrl} alt='avatar' style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};

export default MyUpload;
