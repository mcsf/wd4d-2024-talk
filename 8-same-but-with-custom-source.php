<?php

add_action(
	'init',
	function () {
		register_block_bindings_source(
			'wd4d/date',
			array(
				'label'              => __( 'Date' ),
				'get_value_callback' => function (
					$source_args,
					$block_instance,
					$attribute_name
				) {
					if ( empty( $source_args['date'] ) ) {
						return;
					}

					$format = $source_args['format'] ?? 'F j, Y';
					$date = strtotime( $source_args['date'] );

					if ( $format === 'human-diff' ) {
						return human_time_diff( $date );
					}

					return date( $format, $date );
				},
			)
		);
	}
);

add_action(
	'enqueue_block_editor_assets', 
	function () {
		wp_enqueue_script(
			'wd4d-custom-source',
			plugins_url( '8-same-but-with-custom-source.js', __FILE__ ),
			array( 'wp-blocks', 'wp-date', 'wp-i18n' )
		);
	}
);
