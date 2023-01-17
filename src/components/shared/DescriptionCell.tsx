import clsx from 'clsx';
import React from 'react';
import styles from './DescriptionCell.module.scss';

interface CellProps {
    /**
     * Id of the object that is edited with this cell
     */
    id: string;
    /**
     * Name of the field edited with this field (e.g. description)
     */
    name: string;
    /**
     * Text that can be edited with the cell
     */
    description: string;
    /**
     * Function called when text is edited.
     * Receives the id passed as a prop to identify the edited object.
     * The passed name (to identify the changed field) can be retrieved with
     * event.target.name
     */
    onChange: (event: any, id: string) => void;
    /**
     * Wheter the text can be edited
     */
    locked: boolean;
}

const DescriptionCell = (props: CellProps) => {
    const [editingText, setEditingText] = React.useState(false);

    const onSelect = (e: React.MouseEvent) => {
        if (props.locked) {
            return;
        }
        if (!editingText) {
            e.preventDefault();
        }
        setEditingText(true);
    }

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        props.onChange(e, props.id);
    }

    const onTextBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setEditingText(false);
    }

    return (<td onMouseDown={onSelect}>
        {editingText ? (
            <form>
                <textarea
                    name={props.name}
                    value={props.description}
                    onChange={onTextChange}
                    onBlur={onTextBlur}
                    autoFocus={editingText}
                    rows={3}
                    disabled={props.locked}
                />
            </form>
        ) : (
            <span
                className={clsx(styles.cell, props.locked && styles.locked)}
            >
                {props.description || '-'}
            </span>
        )}
    </td>)

}

export default DescriptionCell;