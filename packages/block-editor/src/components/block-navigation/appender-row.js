/**
 * WordPress dependencies
 */
import { __experimentalTreeGridCell as TreeGridCell } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockNavigationRow from './row';
import ButtonBlockAppender from '../button-block-appender';
import DescenderLines from './descender-lines';

export default function BlockNavigationAppenderRow( {
	parentBlockClientId,
	position,
	level,
	rowCount,
	terminatedLevels,
	path,
} ) {
	const instanceId = useInstanceId( BlockNavigationAppenderRow );
	const descriptionId = `block-navigation-appender-row__description_${ instanceId }`;

	const appenderPositionDescription = sprintf(
		/* translators: 1: The numerical position of the block. 2: The total number of blocks. 3. The level of nesting for the block. */
		__( 'Insert block at position %1$d, Level %2$d' ),
		position,
		level
	);

	return (
		<BlockNavigationRow
			level={ level }
			position={ position }
			rowCount={ rowCount }
			path={ path }
		>
			<TreeGridCell
				className="block-editor-block-navigation-row__appender-cell"
				colSpan="3"
			>
				{ ( props ) => (
					<div className="block-editor-block-navigation-row__appender-container">
						<DescenderLines
							level={ level }
							isLastRow={ position === rowCount }
							terminatedLevels={ terminatedLevels }
						/>
						<ButtonBlockAppender
							rootClientId={ parentBlockClientId }
							__experimentalSelectBlockOnInsert={ false }
							aria-describedby={ descriptionId }
							{ ...props }
						/>
						<div
							className="block-editor-block-navigation-appender-row__description"
							id={ descriptionId }
						>
							{ appenderPositionDescription }
						</div>
					</div>
				) }
			</TreeGridCell>
		</BlockNavigationRow>
	);
}
