import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import HtmlNavbarItem from '@theme/NavbarItem/HtmlNavbarItem';
import DocNavbarItem from '@theme/NavbarItem/DocNavbarItem';
import DocSidebarNavbarItem from '@theme/NavbarItem/DocSidebarNavbarItem';
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

import type { ComponentTypesObject } from '@theme/NavbarItem/ComponentTypes';
import { default as LoginProfileButton } from '@site/src/components/User/Navbar/LoginProfileButton';
import { default as MyEventsLink } from '@site/src/components/User/Navbar/MyEventsLink';
import SemesterSelector from '@site/src/components/shared/SemesterSelector';
import AdminLink from '@site/src/components/User/Navbar/AdminLink';
import NavColorPicker from '@site/src/components/ColorGenerator/NavColorPicker';

const ComponentTypes: ComponentTypesObject = {
    default: DefaultNavbarItem,
    localeDropdown: LocaleDropdownNavbarItem,
    search: SearchNavbarItem,
    dropdown: DropdownNavbarItem,
    html: HtmlNavbarItem,
    doc: DocNavbarItem,
    docSidebar: DocSidebarNavbarItem,
    docsVersion: DocsVersionNavbarItem,
    docsVersionDropdown: DocsVersionDropdownNavbarItem,
    ['custom-semesterSelector']: SemesterSelector,
    ['custom-userBadge']: LoginProfileButton,
    ['custom-myEventsLink']: MyEventsLink,
    ['custom-adminLink']: AdminLink,
    ['custom-colorPicker']: NavColorPicker
};

export default ComponentTypes;
