/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalTreeGridCell as TreeGridCell,
	VisuallyHidden,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import {
	__experimentalGetBlockLabel as getBlockLabel,
	getBlockType,
} from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockNavigationRow from './row';
import BlockIcon from '../block-icon';
import {
	BlockMoverUpButton,
	BlockMoverDownButton,
} from '../block-mover/button';
import DescenderLines from './descender-lines';

export default function BlockNavigationBlockRow( {
	block,
	onClick,
	isSelected,
	position,
	level,
	rowCount,
	showBlockMovers,
	terminatedLevels,
	path,
} ) {
	const instanceId = useInstanceId( BlockNavigationBlockRow );
	const descriptionId = `block-navigation-block-row__description_${ instanceId }`;
	const [ isHovered, setIsHovered ] = useState( false );
	const [ isFocused, setIsFocused ] = useState( false );
	const { name, clientId, attributes } = block;
	const blockType = getBlockType( name );
	const blockDisplayName = getBlockLabel( blockType, attributes );

	// Subtract 1 from rowCount, as it includes the block appender.
	const siblingCount = rowCount - 1;
	const hasSiblings = siblingCount > 1;
	const hasRenderedMovers = showBlockMovers && hasSiblings;
	const hasVisibleMovers = isHovered || isSelected || isFocused;
	const moverCellClassName = classnames(
		'block-editor-block-navigation-row__mover-cell',
		{ 'is-visible': hasVisibleMovers }
	);

	const blockPositionDescription = sprintf(
		/* translators: 1: The numerical position of the block. 2: The total number of blocks. 3. The level of nesting for the block. */
		__( 'Block %1$d of %2$d, Level %3$d' ),
		position,
		siblingCount,
		level
	);

	return (
		<BlockNavigationRow
			className={ classnames( {
				'is-selected': isSelected,
			} ) }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
			onFocus={ () => setIsFocused( true ) }
			onBlur={ () => setIsFocused( false ) }
			level={ level }
			position={ position }
			rowCount={ rowCount }
			path={ path }
		>
			<TreeGridCell
				className="block-editor-block-navigation-row__select-cell"
				colSpan={ hasRenderedMovers ? undefined : 3 }
			>
				{ ( props ) => (
					<div className="block-editor-block-navigation-row__select-container">
						<DescenderLines
							level={ level }
							isLastRow={ position === rowCount }
							terminatedLevels={ terminatedLevels }
						/>
						<Button
							className="block-editor-block-navigation-row__select-button"
							onClick={ onClick }
							aria-describedby={ descriptionId }
							{ ...props }
						>
							<BlockIcon icon={ blockType.icon } showColors />
							{ blockDisplayName }
							{ isSelected && (
								<VisuallyHidden>
									{ __( '(selected block)' ) }
								</VisuallyHidden>
							) }
						</Button>
						<div
							className="block-editor-block-navigation-row__description"
							id={ descriptionId }
						>
							{ blockPositionDescription }
						</div>
					</div>
				) }
			</TreeGridCell>
			{ hasRenderedMovers && (
				<>
					<TreeGridCell className={ moverCellClassName }>
						{ ( props ) => (
							<BlockMoverUpButton
								__experimentalOrientation="vertical"
								clientIds={ [ clientId ] }
								{ ...props }
							/>
						) }
					</TreeGridCell>
					<TreeGridCell className={ moverCellClassName }>
						{ ( props ) => (
							<BlockMoverDownButton
								__experimentalOrientation="vertical"
								clientIds={ [ clientId ] }
								{ ...props }
							/>
						) }
					</TreeGridCell>
				</>
			) }
		</BlockNavigationRow>
	);
}
