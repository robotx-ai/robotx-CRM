import * as Yup from 'yup';

export const getValidationSchema = (isZh = false) =>
  Yup.object().shape({
    name: Yup.string().required(isZh ? '请输入姓名' : 'Enter your name'),
    email: Yup.string()
      .email(isZh ? '请输入有效邮箱' : 'Enter a valid email')
      .required(isZh ? '请输入邮箱' : 'Enter your email'),
    password: Yup.string()
      .min(8, isZh ? '密码至少 8 位' : 'Password must be at least 8 characters')
      .required(isZh ? '请输入密码' : 'Enter your password'),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('password')],
        isZh ? '两次输入的密码不一致' : 'Passwords must match',
      )
      .required(isZh ? '请确认密码' : 'Confirm your password'),
  });
