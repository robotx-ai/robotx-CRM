import { Dictionary } from '@/dictionaries/type';
import 'server-only';

interface LocaleDictionary {
  [x: string]: () => Dictionary;
}

const dictionaries: LocaleDictionary = {
  'en-US': () =>
    import('@/dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]();
};
