import { redirect } from 'next/navigation';

export default async function Home(props: Params) {
  const params = await props.params;
  const { lang } = params;

  redirect(`/${lang}/welcome`);
}
