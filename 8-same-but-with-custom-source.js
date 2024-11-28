wp.blocks.registerBlockBindingsSource( {
	name: 'wd4d/date',
	label: wp.i18n.__( 'Date' ),
	getValues( { bindings } ) {
		const { date, format } = bindings?.content?.args ?? {};
		const defaultFormat = wp.date.getSettings().formats.date;

		let content;
		if ( date ) {
			content =
				format === 'human-diff'
					? wp.date.humanTimeDiff( date )
					: wp.date.dateI18n( format || defaultFormat, date );
		}

		return { content };
	},
} );

/*

<!-- wp:paragraph {
	"metadata": {
		"bindings": {
			"content": {
				"source": "wd4d/date",
				"args": {
					"date": "2024-11-21T12:00:00+00:00",
					"format": "l",
					"type": "wd4d_date"
				}
			}
		}
	}
} -->
<p></p>
<!-- /wp:paragraph -->

*/
