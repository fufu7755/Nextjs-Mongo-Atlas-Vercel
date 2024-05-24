'use client';
import { Card, Form, Button, Input, message } from 'antd';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const nav = useRouter();
  return (
    <div className='login-form pt-20'>
      <Card title='Next全栈管理后台' className='w-4/5 !mx-auto'>
        <Form
          labelCol={{ span: 3 }}
          onFinish={async (v) => {
            // console.log(v);
            const res = await fetch('/api/admin/login', {
              method: 'POST',
              body: JSON.stringify(v),
            }).then((res) => res.json());
            if (res.success) {
              nav.push('/admin/dashboard');
              message.success('登陆成功');
            } else {
              message.error(res.errorMessage);
            }
          }}
        >
          <Form.Item name='userName' label='用户名'>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item name='password' label='密码'>
            <Input.Password placeholder='请输入密码' />
          </Form.Item>
          <Form.Item>
            <Button block type='primary' htmlType='submit'>
              登陆
            </Button>
          </Form.Item>
        </Form>
        <a href='/admin/signup'>注册</a>
      </Card>
    </div>
  );
}

export default LoginPage;
