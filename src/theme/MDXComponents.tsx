// import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import DefinitionList from '../components/shared/DefinitionList';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Dl: DefinitionList
};