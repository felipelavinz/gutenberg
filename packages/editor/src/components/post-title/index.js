/**
 * External dependencies
 */
import Textarea from 'react-autosize-textarea';
import classnames from 'classnames';
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { useState, useRef, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import { ENTER } from '@wordpress/keycodes';
import { useSelect, useDispatch } from '@wordpress/data';
import { DetectFocusOutside, VisuallyHidden } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import PostPermalink from '../post-permalink';
import PostTypeSupportCheck from '../post-type-support-check';

/**
 * Global regular expression matching one or more newline characters.
 *
 * @type {RegExp}
 */
const REGEXP_NEWLINES = /[\r\n]+/g;

/**
 * Global regular expression matching ampersands.
 *
 * @type {RegExp}
 */
const REGEXP_AMPERSAND = /&/g;

function PostTitle() {
	const {
		isCleanNewPost,
		title,
		isPostTypeViewable,
		placeholder,
		isFocusMode,
	} = useSelect( ( select ) => {
		const {
			getEditedPostAttribute,
			isCleanNewPost: getIsCleanNewPost,
		} = select( 'core/editor' );
		const { getSettings } = select( 'core/block-editor' );
		const { getPostType } = select( 'core' );
		const postType = getPostType( getEditedPostAttribute( 'type' ) );
		const { titlePlaceholder, focusMode } = getSettings();

		return {
			isCleanNewPost: getIsCleanNewPost(),
			title: getEditedPostAttribute( 'title' ),
			isPostTypeViewable: get( postType, [ 'viewable' ], false ),
			placeholder: titlePlaceholder,
			isFocusMode: focusMode,
		};
	} );
	const { insertDefaultBlock, clearSelectedBlock } = useDispatch(
		'core/block-editor'
	);
	const { editPost } = useDispatch( 'core/editor' );
	const instanceId = useInstanceId( PostTitle );
	const [ isSelected, setIsSelected ] = useState( false );
	const hasReceivedChangeInteraction = useRef( false );
	const decodedTitle = useMemo( () => decodeEntities( title ), [ title ] );

	function onSelect() {
		setIsSelected( true );
		clearSelectedBlock();
	}

	function onUnselect() {
		setIsSelected( false );
	}

	function onChange( event ) {
		hasReceivedChangeInteraction.current = true;

		const nextTitle = event.target.value
			// `onKeyDown` interprets Enter press as inserting a default block,
			// so this logic would never be reached. But for content which is
			// pated and includes newlines, convert each newline to a space.
			.replace( REGEXP_NEWLINES, ' ' )
			// The title field renders with decoded entities. If user explicitly
			// enters an ampersand, anticipate the decoding by preemptively
			// _encoding_ it.
			.replace( REGEXP_AMPERSAND, '&amp;' );

		editPost( { title: nextTitle } );
	}

	function onKeyDown( event ) {
		if ( event.keyCode === ENTER ) {
			event.preventDefault();
			insertDefaultBlock( undefined, undefined, 0 );
		}
	}

	// The wp-block className is important for editor styles.
	const className = classnames( 'wp-block editor-post-title__block', {
		'is-focus-mode': isFocusMode,
	} );
	const decodedPlaceholder = decodeEntities( placeholder );

	return (
		<DetectFocusOutside onFocusOutside={ onUnselect }>
			<PostTypeSupportCheck supportKeys="title">
				<div className="editor-post-title">
					<div className={ className }>
						<div>
							<VisuallyHidden
								as="label"
								htmlFor={ `post-title-${ instanceId }` }
							>
								{ decodedPlaceholder || __( 'Add title' ) }
							</VisuallyHidden>
							<Textarea
								id={ `post-title-${ instanceId }` }
								className="editor-post-title__input"
								value={ decodedTitle }
								onChange={ onChange }
								placeholder={
									decodedPlaceholder || __( 'Add title' )
								}
								onFocus={ onSelect }
								onKeyDown={ onKeyDown }
								onKeyPress={ onUnselect }
								/*
								Only autofocus the title when the post is entirely empty.
								This should only happen for a new post, which means we
								focus the title on new post so the author can start typing
								right away, without needing to click anything.
								*/
								/* eslint-disable jsx-a11y/no-autofocus */
								autoFocus={
									document.body === document.activeElement &&
									isCleanNewPost
								}
								/* eslint-enable jsx-a11y/no-autofocus */
							/>
						</div>
						{ isSelected && isPostTypeViewable && (
							<PostPermalink />
						) }
					</div>
				</div>
			</PostTypeSupportCheck>
		</DetectFocusOutside>
	);
}

export default PostTitle;
