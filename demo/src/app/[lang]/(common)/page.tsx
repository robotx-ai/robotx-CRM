import { redirect } from 'next/navigation';

export default function Home({ params }: { params: { lang: string } }) {
  const { lang } = params;

  redirect(`/${lang}/welcome`);
}
