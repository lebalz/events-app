import _ from 'lodash';
import React from 'react';

const GroupIdContext = React.createContext<string>(null);

export const useGroupId = (): string | null => {
    const groupId = React.useContext(GroupIdContext);
    return groupId;
};

interface Props {
    children: React.ReactNode;
    groupId: string;
}

export const GroupIdProvider = ({ children, groupId }: Props) => {
    return <GroupIdContext.Provider value={groupId}>{children}</GroupIdContext.Provider>;
};
