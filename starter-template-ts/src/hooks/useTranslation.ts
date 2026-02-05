import { useContext } from 'react';
import { LangContext } from '../components/LangProvider';

export function useTranslation() {
  return useContext(LangContext);
}
