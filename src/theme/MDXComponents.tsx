// import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import DefinitionList from '../components/shared/DefinitionList';
import Figure from '../plugins/remark-images/Figure';
import SourceRef from '../plugins/remark-images/Figure/SourceRef';

export default {
    // Re-use the default mapping
    ...MDXComponents,
    Dl: DefinitionList,
    Figure: Figure,
    SourceRef: SourceRef
};
