import { redirect } from 'next/navigation';
import { Params } from '@/types/paramsType';

export default async function Home(props: Params) {
  const params = await props.params;
  const { lang } = params;

  redirect(`/${lang}/welcome`);
}
