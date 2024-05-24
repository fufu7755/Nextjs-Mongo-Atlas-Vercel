'use client';
import { Card, Form, Button, Input, message } from 'antd';
import { useRouter } from 'next/navigation';

function SignUpPage() {
  const nav = useRouter();
  return (
    <div className='login-form pt-20'>
      <Card title='Next全栈管理后台 用户注册' className='w-4/5 !mx-auto'>
        <Form
          labelCol={{ span: 3 }}
          onFinish={async (v) => {
            // console.log(v);
            const res = await fetch('/api/admin/signup', {
              method: 'POST',
              body: JSON.stringify(v),
            }).then((res) => res.json());
            if (res.success) {
              nav.push('/admin/login');
              message.success('注册成功');
            }
          }}
        >
          <Form.Item name='userName' label='用户名'>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item name='password' label='密码'>
            <Input placeholder='请输入密码' />
          </Form.Item>
          <Form.Item>
            <Button block type='primary' htmlType='submit'>
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default SignUpPage;
