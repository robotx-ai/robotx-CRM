import React from 'react';
import { Dictionary } from '../../dictionaries/type';
import { LangContext } from './LangContext';

interface LangProviderProps {
  children: React.ReactNode;
  dictionary: Dictionary;
}

function LangProvider({ dictionary, children }: LangProviderProps) {
  return (
    <LangContext.Provider value={dictionary}>{children}</LangContext.Provider>
  );
}

export { LangProvider };
