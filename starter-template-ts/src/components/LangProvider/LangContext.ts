'use client';
import React from 'react';
import { Dictionary } from '../../dictionaries/type';

const defaultLangContext: Dictionary = {};
const LangContext = React.createContext(defaultLangContext);

export { LangContext };
