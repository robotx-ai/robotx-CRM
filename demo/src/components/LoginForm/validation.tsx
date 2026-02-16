import * as Yup from 'yup';

export const getValidationSchema = (isZh = false) =>
  Yup.object().shape({
    email: Yup.string()
      .email(isZh ? '请输入有效邮箱' : 'Enter a valid email')
      .required(isZh ? '邮箱不能为空' : 'Email is required'),
    password: Yup.string().required(
      isZh ? '请输入密码' : 'Enter your password',
    ),
  });
