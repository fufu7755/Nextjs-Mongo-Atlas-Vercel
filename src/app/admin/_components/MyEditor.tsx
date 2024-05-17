'use client';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { v4 as uuidv4 } from 'uuid';
import * as qiniu from 'qiniu-js'

type InsertFnType = (url: string, alt: string, href: string) => void

function MyEditor({ html, setHtml }: { html: string; setHtml: any }) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    // setTimeout(() => {
    //   setHtml('<p>hello world</p>');
    // }, 1500);
  }, []);

  // 获取七牛云上传 token
  const getToken = async (key: string) => {
    const res = await fetch(`/api/admin/upload/token?key=${key}`);
    const data = await res.json();
    return data.token;
  }

  // cdn
  const cnd = process.env.NEXT_PUBLIC_CDN;

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
          // 获得文件名
          const key = uuidv4();
          const token = await getToken(key)
          // 上传文件
          const observable = qiniu.upload(file, key, token)
          observable.subscribe({
            next: (res) => {
              // 进度展示
              console.log(res, '进度')
            }, 
            error: (err) => {
              console.log(err, '错误')
            },
            complete: (res) => {
              console.log(res, '完成')
              const url = cnd + res.key
              insertFn(url, file.name, res.key)
            }
          })
        }
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode='default'
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode='default'
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
      {/* <div style={{ marginTop: '15px' }}>{html}</div> */}
    </>
  );
}

export default MyEditor;
