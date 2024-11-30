import { addFilter } from '@wordpress/hooks';
import {
	parseWithAttributeSchema,
	registerBlockVariation,
} from '@wordpress/blocks';
import {
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	Dropdown,
	DatePicker,
} from '@wordpress/components';
import {
	InspectorControls,
	BlockControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalDateFormatPicker as DateFormatPicker,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	dateI18n,
	humanTimeDiff,
	getSettings as getDateSettings,
} from '@wordpress/date';
import { edit as editIcon, postDate as dateIcon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { DOWN } from '@wordpress/keycodes';
import { useMemo } from '@wordpress/element';
import * as richText from '@wordpress/rich-text';

function isDateVariation( attributes ) {
	return (
		attributes?.metadata?.bindings?.content?.args?.type === 'wd4d_date' ||
		attributes?.metadata?.bindings?.__default?.args?.type === 'wd4d_date'
	);
}

const withDateControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! isDateVariation( props?.attributes ) ) {
			return <BlockEdit { ...props } />;
		}

		const {
			attributes: { content, metadata },
			setAttributes,
		} = props;

		const format = metadata?.bindings?.content?.args?.format;

		function setBindingsArgs( args ) {
			setAttributes( {
				metadata: {
					...metadata,
					bindings: {
						...metadata.bindings,
						content: {
							...metadata.bindings.content,
							args: {
								...metadata.bindings.content.args,
								...args,
							},
						},
					},
				},
			} );
		}

		const date = useMemo( () => {
			try {
				return parseWithAttributeSchema( content, {
					type: 'string',
					source: 'attribute',
					selector: 'time',
					attribute: 'datetime',
				} );
			} catch ( e ) {
				return undefined;
			}
		}, [ content ] );

		return (
			<>
				<BlockEdit { ...props } />
				<BlockControls group="block">
					<DateBlockControls { ...{ date, format, setAttributes } } />
				</BlockControls>
				<InspectorControls>
					<DateInspectorControls
						{ ...{ date, format, setAttributes, setBindingsArgs } }
					/>
				</InspectorControls>
			</>
		);
	};
}, 'withDateControls' );

function DateBlockControls( { date, format, setAttributes } ) {
	return (
		<ToolbarGroup>
			<Dropdown
				renderContent={ ( { onClose } ) => {
					return (
						<DatePicker
							currentDate={ date }
							onChange={ ( newDate ) => {
								setAttributes( {
									content: renderDate( newDate, format ),
								} );
								onClose();
							} }
						/>
					);
				} }
				renderToggle={ ( { isOpen, onToggle } ) => {
					const openOnArrowDown = ( event ) => {
						if ( ! isOpen && event.keyCode === DOWN ) {
							event.preventDefault();
							onToggle();
						}
					};
					return (
						<ToolbarButton
							aria-expanded={ isOpen }
							icon={ editIcon }
							title={ __( 'Change date' ) }
							onClick={ onToggle }
							onKeyDown={ openOnArrowDown }
						/>
					);
				} }
			/>
		</ToolbarGroup>
	);
}

function DateInspectorControls( {
	date,
	format,
	setAttributes,
	setBindingsArgs,
} ) {
	const defaultFormat = getDateSettings().formats.date;
	return (
		<PanelBody title={ __( 'Settings' ) }>
			<DateFormatPicker
				format={ format }
				defaultFormat={ defaultFormat }
				onChange={ ( newFormat ) => {
					setBindingsArgs( { format: newFormat } );
					setAttributes( {
						content: renderDate( date, newFormat ),
					} );
				} }
			/>
		</PanelBody>
	);
}

// Can be achieved in multiple ways. Here, we leverage WP's Rich Text library,
// but we could also just serialise a React element.
//
// @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-rich-text/
function renderDate( date, format ) {
	let value = richText.create( {
		text:
			format === 'human-diff'
				? humanTimeDiff( date )
				: dateI18n( format || getDateSettings()?.formats.date, date ),
	} );

	value = richText.applyFormat(
		value,
		{
			type: 'wd4d/date',
			attributes: { datetime: dateI18n( 'c', date ) },
		},
		0,
		value.text.length
	);

	return richText.toHTMLString( { value } );

	/*
	 * Alternative:
	 *
	 *   return renderToString(
	 *   	<time dateTime={ dateI18n( 'c', date ) } className="wd4d-date">
	 *   		{ format === 'human-diff'
	 *   			? humanTimeDiff( date )
	 *   			: dateI18n( format || getDateSettings()?.formats.date, date ) }
	 *   	</time>
	 *   );
	 */
}

registerBlockVariation( 'core/paragraph', {
	name: 'date',
	icon: dateIcon,
	title: '(WD4D) Date-enabled Paragraph',
	attributes: {
		metadata: {
			bindings: {
				content: {
					source: 'core/post-meta',
					args: {
						key: 'wd4d_date',
						type: 'wd4d_date', // FIXME
					},
				},
			},
		},
	},
	isActive: isDateVariation,
} );

// Nice to have, though not absolutely essential.
richText.registerFormatType( 'wd4d/date', {
	name: 'wd4d/date',
	className: 'wd4d-date',
	tagName: 'time',
	title: __( 'Date' ),
} );

addFilter(
	'editor.BlockEdit',
	'wd4d/paragraph-with-date-controls',
	withDateControls
);
